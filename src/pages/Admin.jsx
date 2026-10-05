import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, LogOut, Plus, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

const emptyForm = {
  title: "",
  description: "",
  images: [],
  imageUrls: "",
  url: "",
  git: "",
  tags: "",
};

const tokenKey = "portfolio-admin-token";

export default function Admin() {
  const [configured, setConfigured] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem(tokenKey) ?? "");
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/status")
      .then((response) => response.json())
      .then(({ configured: isConfigured }) => setConfigured(isConfigured))
      .catch(() => setError("The portfolio server is not available."));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setProjects(data.projects);
      })
      .catch((requestError) => {
        sessionStorage.removeItem(tokenKey);
        setToken("");
        setError(requestError.message);
      });
  }, [token]);

  async function handleLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      sessionStorage.setItem(tokenKey, data.token);
      setToken(data.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleImageUpload(event) {
    const imageFiles = Array.from(event.target.files ?? []);
    if (!imageFiles.length) return;
    if (imageFiles.length + form.images.length > 8) {
      setError("Each project can have up to eight images.");
      event.target.value = "";
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const body = new FormData();
    imageFiles.forEach((imageFile) => body.append("images", imageFile));
    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setForm((current) => ({ ...current, images: [...current.images, ...data.images] }));
      setNotice(`${data.images.length} image${data.images.length === 1 ? "" : "s"} uploaded.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function handleAddProject(event) {
    event.preventDefault();
    const images = [
      ...form.images,
      ...form.imageUrls.split(/\r?\n/).map((image) => image.trim()).filter(Boolean),
    ];
    if (!images.length || images.length > 8) {
      setError("Add between one and eight project images.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          images,
          url: form.url,
          git: form.git,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects((current) => [...current, data.project]);
      setForm(emptyForm);
      setNotice("Project added to your portfolio.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteProject(project) {
    if (!window.confirm(`Remove "${project.title}" from the portfolio?`)) return;
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(data.projects);
      setNotice("Project removed.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(tokenKey);
    setToken("");
    setProjects([]);
  }

  const imageUrlEntries = form.imageUrls.split(/\r?\n/).map((image) => image.trim()).filter(Boolean);
  const previewImages = [...form.images, ...imageUrlEntries];
  const inputClass = "w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
            <ArrowLeft size={17} /> Portfolio
          </Link>
          {token && (
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950">
              <LogOut size={16} /> Sign out
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">Portfolio management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-2 text-sm text-slate-600">Add work to your portfolio without editing the source code.</p>
        </div>

        {configured === false ? (
          <div className="max-w-xl rounded border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
            Admin access is not configured. Add <code>ADMIN_PASSWORD</code> to your local <code>.env</code> file, then restart the server.
          </div>
        ) : configured === null ? (
          <p className="text-sm text-slate-600">Connecting to the portfolio server...</p>
        ) : !token ? (
          <form onSubmit={handleLogin} className="max-w-md space-y-4 rounded border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Sign in</h2>
            <label className="block text-sm font-medium">
              Admin password
              <input className={`${inputClass} mt-1.5`} name="password" type="password" autoComplete="current-password" required />
            </label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button disabled={busy} className="rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50">
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form onSubmit={handleAddProject} className="space-y-5 rounded border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold">Add a project</h2>
                <p className="mt-1 text-sm text-slate-500">Fields marked required appear on the portfolio.</p>
              </div>

              <label className="block text-sm font-medium">
                Project name <span className="text-red-600">*</span>
                <input className={`${inputClass} mt-1.5`} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required maxLength={100} />
              </label>

              <label className="block text-sm font-medium">
                Short description <span className="text-red-600">*</span>
                <textarea className={`${inputClass} mt-1.5 min-h-28 resize-y`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required maxLength={600} />
              </label>

              <div className="space-y-2">
                <span className="block text-sm font-medium">Project images <span className="text-red-600">*</span></span>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 hover:border-sky-500 hover:text-sky-700">
                  <ImagePlus size={18} />
                  {busy ? "Uploading..." : "Choose images (up to 8, 8 MB each)"}
                  <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleImageUpload} disabled={busy} multiple />
                </label>
                <textarea className={`${inputClass} min-h-20 resize-y`} aria-label="Image URLs" placeholder="Or paste image URLs, one per line" value={form.imageUrls} onChange={(event) => setForm({ ...form, imageUrls: event.target.value })} />
                <p className="text-xs text-slate-500">{previewImages.length} of 8 images selected. They rotate on the portfolio every 2 seconds.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {previewImages.map((image, index) => (
                    <div className="relative aspect-video overflow-hidden rounded border border-slate-200" key={`${image}-${index}`}>
                      <img src={image} alt={`Project image ${index + 1}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => index < form.images.length
                        ? setForm({ ...form, images: form.images.filter((_, imageIndex) => imageIndex !== index) })
                        : setForm({ ...form, imageUrls: imageUrlEntries.filter((_, imageIndex) => imageIndex !== index - form.images.length).join("\n") })}
                        aria-label={`Remove image ${index + 1}`} className="absolute right-1 top-1 grid h-7 w-7 place-items-center bg-slate-950/80 text-white hover:bg-red-700">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="block text-sm font-medium">
                Deployed site URL <span className="text-red-600">*</span>
                <input className={`${inputClass} mt-1.5`} type="url" placeholder="https://example.com" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} required />
              </label>

              <label className="block text-sm font-medium">
                Source code URL <span className="font-normal text-slate-500">(optional)</span>
                <input className={`${inputClass} mt-1.5`} type="url" placeholder="https://github.com/..." value={form.git} onChange={(event) => setForm({ ...form, git: event.target.value })} />
              </label>

              <label className="block text-sm font-medium">
                Technologies <span className="font-normal text-slate-500">(comma separated)</span>
                <input className={`${inputClass} mt-1.5`} placeholder="React, Node.js, CSS" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
              </label>

              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              {notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
              <button disabled={busy} className="flex items-center gap-2 rounded bg-sky-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-50">
                <Plus size={17} /> Add project
              </button>
            </form>

            <section aria-labelledby="current-projects-heading">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 id="current-projects-heading" className="text-lg font-semibold">Current projects</h2>
                <span className="text-sm text-slate-500">{projects.length} total</span>
              </div>
              <div className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">
                {projects.map((project) => (
                  <article key={project.id} className="flex items-center gap-4 p-4">
                    <img src={project.images?.[0] ?? project.image} alt="" className="h-16 w-20 shrink-0 rounded border border-slate-200 object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{project.description}</p>
                    </div>
                    <button onClick={() => handleDeleteProject(project)} aria-label={`Remove ${project.title}`} title="Remove project" className="shrink-0 rounded p-2 text-slate-500 hover:bg-red-50 hover:text-red-700">
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))}
                {projects.length === 0 && <p className="p-5 text-sm text-slate-500">No projects yet. Add the first one using the form.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}