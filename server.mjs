import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import pg from "pg";

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3001;
const adminPassword = process.env.ADMIN_PASSWORD;
const dataFile = path.join(root, "data", "projects.json");
const uploadDirectory = path.join(root, "public", "uploads");
const distributionDirectory = path.join(root, "dist");
const { Pool } = pg;
const bucket = process.env.AWS_S3_BUCKET;
const awsEndpoint = process.env.AWS_ENDPOINT_URL_S3;
const s3Configured = Boolean(bucket && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION);
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  ...(awsEndpoint ? { endpoint: awsEndpoint, forcePathStyle: true } : {}),
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } }
    : {}),
});
const database = process.env.DATABASE_URL
  ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.NODE_ENV === "production" ? { ssl: { rejectUnauthorized: false } } : {}),
  })
  : null;
let databaseReady = !database && process.env.NODE_ENV !== "production";
const sessions = new Set();
const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

await fs.mkdir(path.dirname(dataFile), { recursive: true });
await fs.mkdir(uploadDirectory, { recursive: true });

function getProjectImages(project) {
  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
  return images.length ? images : project.image ? [project.image] : [];
}

async function readProjects() {
  if (database) {
    const { rows } = await database.query("SELECT id, title, description, image, images, url, git, tags FROM projects ORDER BY created_at, id");
    return rows.map((project) => {
      const images = getProjectImages(project);
      return { ...project, images, image: images[0] ?? "" };
    });
  }
  return JSON.parse(await fs.readFile(dataFile, "utf8"));
}

async function writeProjects(projects) {
  const temporaryFile = `${dataFile}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(projects, null, 2)}\n`);
  await fs.rename(temporaryFile, dataFile);
}

async function insertProject(project) {
  if (database) {
    await database.query(
      "INSERT INTO projects (id, title, description, image, images, url, git, tags) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8::jsonb)",
      [project.id, project.title, project.description, project.images[0], JSON.stringify(project.images), project.url, project.git, JSON.stringify(project.tags)],
    );
    return;
  }
  const projects = await readProjects();
  projects.push(project);
  await writeProjects(projects);
}

async function removeProject(id) {
  if (database) {
    const { rowCount } = await database.query("DELETE FROM projects WHERE id = $1", [id]);
    return rowCount > 0;
  }
  const projects = await readProjects();
  const remainingProjects = projects.filter((project) => project.id !== id);
  if (remainingProjects.length === projects.length) return false;
  await writeProjects(remainingProjects);
  return true;
}

async function initializeDatabase() {
  if (!database) {
    if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL must be configured for production project storage.");
    return;
  }

  await database.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      url TEXT NOT NULL,
      git TEXT NOT NULL DEFAULT '',
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  const { rowCount } = await database.query("SELECT id FROM projects LIMIT 1");
  if (rowCount > 0) return;

  const seedProjects = JSON.parse(await fs.readFile(dataFile, "utf8"));
  for (const project of seedProjects) {
    const images = getProjectImages(project);
    if (images.length) await insertProject({ ...project, images });
  }
}

function requireProjectStorage(req, res, next) {
  if (databaseReady) return next();
  const error = database
    ? "Project storage is connecting. Please retry shortly."
    : "DATABASE_URL is not configured for project storage.";
  res.status(503).json({ error });
}

function requireAdmin(req, res, next) {
  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Please sign in to manage projects." });
  }
  next();
}

function validUrl(value, optional = false) {
  if (optional && !value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, callback) => {
    const isAllowed = allowedImageTypes.has(file.mimetype);
    callback(isAllowed ? null : new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), isAllowed);
  },
});

app.use(express.json({ limit: "32kb" }));

app.get("/api/projects", requireProjectStorage, async (req, res, next) => {
  try {
    res.json({ projects: await readProjects() });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/status", (req, res) => {
  res.json({ configured: Boolean(adminPassword) });
});

app.post("/api/admin/login", (req, res) => {
  if (!adminPassword) {
    return res.status(503).json({ error: "Set ADMIN_PASSWORD in your .env file to enable the admin page." });
  }
  if (req.body.password !== adminPassword) {
    return res.status(401).json({ error: "That password is not correct." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  sessions.add(token);
  res.json({ token });
});

app.get("/api/admin/projects", requireAdmin, requireProjectStorage, async (req, res, next) => {
  try {
    res.json({ projects: await readProjects() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/uploads", requireAdmin, requireProjectStorage, upload.array("images", 8), async (req, res) => {
  const files = req.files ?? [];
  if (!files.length) return res.status(400).json({ error: "Choose at least one project image." });
  if (process.env.NODE_ENV === "production" && !s3Configured) {
    return res.status(503).json({ error: "Configure AWS_S3_BUCKET and the AWS credentials before uploading on Render." });
  }

  const images = [];
  try {
    for (const file of files) {
      const key = `${crypto.randomUUID()}${allowedImageTypes.get(file.mimetype)}`;
      if (s3Configured) {
        await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: file.buffer, ContentType: file.mimetype }));
        images.push(`/media/${key}`);
      } else {
        await fs.writeFile(path.join(uploadDirectory, key), file.buffer);
        images.push(`/uploads/${key}`);
      }
    }
    res.status(201).json({ images });
  } catch (error) {
    await Promise.all(images.map((image) => image.startsWith("/media/")
      ? s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: image.slice("/media/".length) })).catch(() => {})
      : fs.unlink(path.join(uploadDirectory, path.basename(image))).catch(() => {})));
    throw error;
  }
});

app.post("/api/admin/projects", requireAdmin, requireProjectStorage, async (req, res, next) => {
  const { title, description, url, git = "", tags = [] } = req.body;
  const images = Array.isArray(req.body.images) ? req.body.images.filter((image) => typeof image === "string" && image.trim()) : [];
  const validImage = (image) => /^\/(uploads|media)\/[\w.-]+$/.test(image) || validUrl(image);
  if (!title?.trim() || !description?.trim() || !images.length || images.length > 8 || images.some((image) => !validImage(image)) || !validUrl(url) || !validUrl(git, true)) {
    return res.status(400).json({ error: "Add a title, description, 1–8 valid images, and a valid deployed-site URL." });
  }
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    return res.status(400).json({ error: "Project tags must be a list of text values." });
  }

  try {
    const project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      image: images[0],
      images,
      url,
      git,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
    };
    await insertProject(project);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/projects/:id", requireAdmin, requireProjectStorage, async (req, res, next) => {
  try {
    const projects = await readProjects();
    const project = projects.find((entry) => entry.id === req.params.id);
    if (!project || !(await removeProject(req.params.id))) {
      return res.status(404).json({ error: "Project not found." });
    }
    if (s3Configured) {
      const remoteImages = getProjectImages(project).filter((image) => image.startsWith("/media/"));
      await Promise.all(remoteImages.map((image) => s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: image.slice("/media/".length),
      })).catch(() => {})));
    }
    res.json({ projects: await readProjects() });
  } catch (error) {
    next(error);
  }
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", projectStorage: databaseReady ? "ready" : "unavailable" });
});


app.use("/uploads", express.static(uploadDirectory));
app.use(express.static(distributionDirectory));
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(distributionDirectory, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error instanceof multer.MulterError ? 400 : 500;
  res.status(status).json({ error: error.message || "The server could not complete that request." });
});

app.listen(port, () => {
  console.log(`Portfolio server listening on http://localhost:${port}`);
  if (!database) {
    if (process.env.NODE_ENV === "production") console.error("DATABASE_URL is not configured; project APIs will return 503.");
    return;
  }

  const initializeInBackground = () => {
    initializeDatabase()
      .then(() => {
        databaseReady = true;
        console.log("Project database is ready.");
      })
      .catch((error) => {
        databaseReady = false;
        console.error(`Database initialization failed (${error.code ?? error.name}); retrying in a few seconds.`);
        setTimeout(initializeInBackground, 5000).unref();
      });
  };
  initializeInBackground();
});

app.get("/media/:key", async (req, res, next) => {
  if (!s3Configured || !/^[\w-]+\.(jpg|png|webp|gif|avif)$/i.test(req.params.key)) {
    return res.status(404).end();
  }
  try {
    const image = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: req.params.key }));
    res.set("Content-Type", image.ContentType || "application/octet-stream");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    await pipeline(image.Body, res);
  } catch (error) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) return res.status(404).end();
    next(error);
  }
});