import fs from "node:fs";
import path from "node:path";

let cache = null;

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : "";
}

function findAllStarts(source, pattern) {
  const starts = [];
  let idx = source.indexOf(pattern);
  while (idx !== -1) {
    starts.push(idx);
    idx = source.indexOf(pattern, idx + pattern.length);
  }
  return starts;
}

export function getLegacyPdfSections() {
  if (cache) {
    return cache;
  }

  const filePath = path.join(process.cwd(), "public", "index.html");
  const fullHtml = fs.readFileSync(filePath, "utf8");
  const body = extractBody(fullHtml);

  const pdfStart = body.indexOf('<div id="pagina-pdf">');
  if (pdfStart === -1) {
    throw new Error("Could not locate pagina-pdf section in public/index.html");
  }

  const innerStart = pdfStart + '<div id="pagina-pdf">'.length;
  const closeScriptsMarker = body.indexOf("<!-- <script defer src=", innerStart);
  const searchFrom = closeScriptsMarker === -1 ? body.length : closeScriptsMarker;
  const paginaClose = body.lastIndexOf("</div>", searchFrom);
  if (paginaClose === -1) {
    throw new Error("Could not locate closing tag for pagina-pdf");
  }
  const paginaInner = body.slice(innerStart, paginaClose).trim();

  const fichaPattern = '<div id="ficha" class="container pdf">';
  const contractPattern = '<div class="container-c pdf">';
  const starts = [
    ...findAllStarts(paginaInner, fichaPattern),
    ...findAllStarts(paginaInner, contractPattern)
  ].sort((a, b) => a - b);

  const pdfSections = starts.map((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1] : paginaInner.length;
    return paginaInner.slice(start, end).trim();
  });

  cache = pdfSections;
  return cache;
}
