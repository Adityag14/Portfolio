import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public", "Resume", "Aditya_Gawande_Resume.pdf");
const width = 595.28;
const left = 42;
const right = width - 42;
const contentWidth = right - left;
const colors = { ink: "#17231e", muted: "#52635a", green: "#17624b", lime: "#d5f268", rule: "#dce5df" };
const document = new PDFDocument({ size: "A4", margins: { top: 32, bottom: 34, left, right: 42 }, compress: true, info: { Title: "Aditya Gawande - GenAI and ML Engineer Resume", Author: "Aditya Gawande" } });
let pageCount = 1;
document.on("pageAdded", () => { pageCount += 1; });
await fs.mkdir(path.dirname(output), { recursive: true });
document.pipe((await import("node:fs")).createWriteStream(output));

document.rect(0, 0, width, 7).fill(colors.green);
document.font("Helvetica-Bold").fontSize(24).fillColor(colors.ink).text("ADITYA GAWANDE", left, 29, { lineBreak: false });
document.font("Helvetica-Bold").fontSize(9).fillColor(colors.green).text("GENERATIVE AI & MACHINE LEARNING ENGINEER", left, 61, { lineBreak: false, characterSpacing: 0.7 });
document.font("Helvetica").fontSize(8).fillColor(colors.muted).text("India  ·  ", left, 78, { continued: true, lineBreak: false });
document.fillColor(colors.green).text("+91 90114 10132", { continued: true, link: "tel:+919011410132" });
document.fillColor(colors.muted).text("  ·  ", { continued: true });
document.fillColor(colors.green).text("gawandeadi2@gmail.com", { link: "mailto:gawandeadi2@gmail.com" });
document.font("Helvetica").fontSize(8).fillColor(colors.green).text("linkedin.com/in/aditya-gawande-ai", left, 91, { continued: true, lineBreak: false, link: "https://www.linkedin.com/in/aditya-gawande-ai" });
document.fillColor(colors.muted).text("  ·  ", { continued: true });
document.fillColor(colors.green).text("github.com/adityag14", { link: "https://github.com/adityag14" });
document.moveTo(left, 108).lineTo(right, 108).lineWidth(0.8).strokeColor(colors.rule).stroke();
document.y = 118;

function sectionHeading(label) {
  document.moveDown(0.28);
  const y = document.y;
  document.font("Helvetica-Bold").fontSize(8).fillColor(colors.green).text(label.toUpperCase(), left, y, { lineBreak: false, characterSpacing: 0.8 });
  document.moveTo(left + 112, y + 6).lineTo(right, y + 6).lineWidth(0.55).strokeColor(colors.rule).stroke();
  document.y = y + 17;
}

function paragraph(text, fontSize = 8.5) {
  document.font("Helvetica").fontSize(fontSize).fillColor(colors.ink).text(text, left, document.y, { width: contentWidth, lineGap: 1.5, paragraphGap: 1 });
  document.moveDown(0.18);
}

function bullet(text) {
  const y = document.y;
  document.circle(left + 2, y + 5, 1.5).fill(colors.green);
  document.font("Helvetica").fontSize(8.3).fillColor(colors.ink).text(text, left + 10, y, { width: contentWidth - 10, lineGap: 1.25 });
  document.moveDown(0.14);
}

sectionHeading("Professional summary");
paragraph("Generative AI & Machine Learning Engineer with 1.9+ years of production experience designing autonomous agent architectures, multimodal RAG systems, and enterprise process automation. Hands-on with open-source LLM fine-tuning (LoRA/QLoRA), MCP toolchains, LangChain and LangGraph workflows, and high-throughput inference on Azure and GCP.", 8.6);

sectionHeading("Technical skills");
const skillGroups = [
  ["GenAI & LLMs", "LangChain, LangGraph, CrewAI, MCP, RAG, prompt engineering, function calling, PEFT/LoRA, Ragas, NeMo Guardrails"],
  ["AI / ML", "PyTorch, TensorFlow, Hugging Face, Transformers, scikit-learn, CNNs, RNNs, statistical modeling, spaCy, NLTK"],
  ["Retrieval", "ChromaDB, FAISS, Pinecone, PostgreSQL/pgvector, hybrid search, semantic reranking"],
  ["Backend & cloud", "Python, FastAPI, Flask, Node.js, WebSockets, REST APIs, GCP Cloud Run, Azure AI Foundry, Docker, Kubernetes, CI/CD"],
];
for (const [label, tools] of skillGroups) {
  document.font("Helvetica-Bold").fontSize(8.2).fillColor(colors.ink).text(`${label}: `, left, document.y, { continued: true });
  document.font("Helvetica").fontSize(8.2).fillColor(colors.muted).text(tools, { width: contentWidth, lineGap: 1.2 });
  document.moveDown(0.12);
}

sectionHeading("Professional experience");
document.font("Helvetica-Bold").fontSize(10).fillColor(colors.ink).text("LTIMindtree", left, document.y, { continued: true });
document.font("Helvetica").fontSize(8.8).fillColor(colors.muted).text("  /  Technical Consultant, AI & GenAI Solutions");
document.font("Helvetica-Oblique").fontSize(7.8).fillColor(colors.muted).text("Dec 2024 – Present  ·  India", left, document.y + 1);
document.moveDown(0.3);
bullet("Built AI-powered workflow automations with Copilot Studio, Power Automate, and Azure Functions, connecting emails, documents, SharePoint, and web sources to reduce manual effort and operational overhead.");
bullet("Developed a real-time LangChain, GPT-4, and ChromaDB retrieval system over WebSockets, bringing grounded answers into enterprise workflows on GCP Cloud Run.");
bullet("Built SAP IDOC diagnosis and resolution with human approval gates, dynamic retries, and Azure Communication Services alerts.");
bullet("Applied semantic caching and prompt optimization to reduce redundant model calls and manage inference costs.");

sectionHeading("Selected technical projects");
const projects = [
  ["Autonomous multi-agent enterprise research analyst", "LangGraph, MCP, ChromaDB, Claude/GPT-4, FastAPI. Built stateful Planner, Code-Execution, and Reviewer agents with PostgreSQL checkpoints; secure MCP servers and Ragas benchmarks reached 96% hallucination resistance."],
  ["Domain-specific LLM fine-tuning & quantized serving", "Fine-tuned Llama 3 (8B) and Mistral (7B) with 4-bit QLoRA, raising domain terminology accuracy by 28%. vLLM serving on Kubernetes delivered 3.2× throughput over naive inference."],
  ["MCP-based natural-language-to-SQL analytics", "Created a FastMCP and Gemini translation engine for sanitized PostgreSQL queries, with AST-based read-only validation; reduced reporting turnaround by 75%."],
  ["Intelligent healthcare report analysis", "Built a CrewAI, FAISS, PyMuPDF, and LangChain pipeline that parsed lab reports with 98% extraction accuracy and generated recommendations trialed across 500+ records."],
];
for (const [title, details] of projects) {
  document.font("Helvetica-Bold").fontSize(8.4).fillColor(colors.ink).text(title, left, document.y, { width: contentWidth });
  document.font("Helvetica").fontSize(8.1).fillColor(colors.muted).text(details, left, document.y + 1, { width: contentWidth, lineGap: 1.2 });
  document.moveDown(0.25);
}

sectionHeading("Awards & certifications");
document.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.ink).text("Best AI Initiative — EzCredit", left, document.y, { continued: true });
document.font("Helvetica").fontSize(8.2).fillColor(colors.muted).text("  ·  Outcreator  ·  June 2026");
paragraph("Recognized for EzCredit, developed by the EUROPE SAP team as L’Oréal’s first SAP GenAI solution in production, automating credit decisions through real-time AI analysis.", 8.1);
document.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.green).text("SAP Certified GenAI Developer — View verified credential", left, document.y, { width: contentWidth, link: "https://www.credly.com/badges/8cabb610-df74-4dab-b978-a71b5491b619" });
document.moveDown(0.35);

sectionHeading("Education");
document.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.ink).text("B.E. in Artificial Intelligence and Data Science", left, document.y, { continued: true });
document.font("Helvetica").fontSize(8.2).fillColor(colors.muted).text("  ·  CGPA 8.45/10");
document.font("Helvetica").fontSize(8.1).fillColor(colors.muted).text("DY Patil College of Engineering, Akurdi  ·  Jun 2024  ·  India", left, document.y + 1);

console.log(`Content ends at y=${Math.round(document.y)} pt`);
document.font("Helvetica").fontSize(7).fillColor(colors.muted).text("ADITYA GAWANDE  /  RESUME", left, 790, { lineBreak: false, characterSpacing: 0.5 });
document.font("Helvetica").fontSize(7).fillColor(colors.muted).text("INDIA", left, 790, { width: contentWidth, align: "right", lineBreak: false, characterSpacing: 0.5 });
document.end();

await new Promise((resolve, reject) => {
  document.on("end", resolve);
  document.on("error", reject);
});
console.log(`Generated ${path.relative(root, output)} (${pageCount} page${pageCount === 1 ? "" : "s"})`);
