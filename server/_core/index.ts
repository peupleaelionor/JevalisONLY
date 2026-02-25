import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const server = createServer(app);

  // Serve static frontend in production; use Vite dev server in dev
  if (process.env.NODE_ENV === "production") {
    const clientDist = path.resolve(__dirname, "../../dist/public");
    app.use(express.static(clientDist));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    const { createServer: createVite } = await import("vite");
    const vite = await createVite({
      configFile: path.resolve(__dirname, "../../vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  server.listen(port, () => {
    console.log(`[v0] Server running on http://localhost:${port}/`);
    console.log(`[v0] NODE_ENV=${process.env.NODE_ENV}`);
    console.log(`[v0] __dirname=${__dirname}`);
  });
}

startServer().catch(console.error);

