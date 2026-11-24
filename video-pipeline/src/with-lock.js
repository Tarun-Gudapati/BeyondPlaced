import { mkdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * Run a command while holding a machine-wide lock, so only one headless-Chrome job
 * (hyperframes check / snapshot / render) runs at a time on this low-memory machine.
 *
 *   node <video-pipeline>/src/with-lock.js npx -y hyperframes@0.9.87 check
 *
 * Runs in the current directory. Stale locks older than 30 minutes are broken.
 */

const lock = join(resolve(import.meta.dirname, ".."), ".chrome.lock");
const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error("Usage: node src/with-lock.js <command> [args...]");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let waited = 0;
for (;;) {
  try {
    mkdirSync(lock);
    break;
  } catch {
    try {
      if (Date.now() - statSync(lock).mtimeMs > 30 * 60_000) rmSync(lock, { recursive: true, force: true });
    } catch {}
    if (waited % 60 === 0) console.error(`waiting for ${lock} …`);
    await sleep(5000);
    waited += 5;
  }
}

let status = 1;
try {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  status = r.status ?? 1;
} finally {
  rmSync(lock, { recursive: true, force: true });
}
process.exit(status);
