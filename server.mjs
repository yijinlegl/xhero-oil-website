import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const target = clean.endsWith("/") || clean === "" ? join(clean, "index.html") : clean;
  const full = normalize(join(root, target));
  return full.startsWith(root) ? full : join(root, "index.html");
}

createServer(async (req, res) => {
  try {
    const file = resolvePath(req.url || "/");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, "index.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end("Server error");
    }
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Xhero website running at http://127.0.0.1:${port}/`);
});
