#!/usr/bin/env node
import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SKILLS_DIR = join(ROOT, "skills");

const WSL = process.env.ZERO_WSL ?? "wsl";
const WSL_DISTRO = process.env.ZERO_WSL_DISTRO ?? "Ubuntu";

function execWsl(command) {
  return new Promise((resolve) => {
    const child = spawn(
      WSL,
      ["-d", WSL_DISTRO, "--", "bash", "-lc", command],
      { windowsHide: true },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (c) => (stdout += c.toString("utf8")));
    child.stderr.on("data", (c) => (stderr += c.toString("utf8")));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", (e) => resolve({ code: -1, stdout, stderr: String(e) }));
  });
}

function parseFrontmatter(md) {
  const m = /^---\n([\s\S]*?)\n---/.exec(md);
  if (!m) return null;
  const body = md.slice(m[0].length);
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = /^(\w+):\s*(.*)$/.exec(line.trim());
    if (kv) fm[kv[1]] = kv[2];
  }
  return { fm, body };
}

function extractZeroBlocks(body) {
  const blocks = [];
  const re = /```zero\n([\s\S]*?)```/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

async function checkZero(source, label) {
  const dir = join(tmpdir(), `zero-skill-validate-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  const winPath = join(dir, "snippet.0");
  await writeFile(winPath, source, "utf8");
  const wslPath = winPath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, (_, d) => `/mnt/${d.toLowerCase()}`);
  const cmd = `export PATH="$HOME/.zero/bin:$PATH" && zero check ${JSON.stringify(wslPath)} 2>&1`;
  const r = await execWsl(cmd);
  await rm(dir, { recursive: true, force: true });
  if (r.code !== 0) {
    console.error(`FAIL ${label}\n${r.stdout}${r.stderr}`);
    return false;
  }
  console.log(`ok  ${label}`);
  return true;
}

async function main() {
  const files = (await readdir(SKILLS_DIR)).filter((f) => f.endsWith(".md"));
  let failed = 0;

  for (const file of files) {
    const path = join(SKILLS_DIR, file);
    const md = await readFile(path, "utf8");
    const parsed = parseFrontmatter(md);
    if (!parsed) {
      console.error(`FAIL ${file}: missing frontmatter`);
      failed++;
      continue;
    }
    const { fm, body } = parsed;
    if (!fm.name || !fm.description) {
      console.error(`FAIL ${file}: name and description required`);
      failed++;
      continue;
    }
    if (fm.description.length > 120) {
      console.error(`FAIL ${file}: description > 120 chars (${fm.description.length})`);
      failed++;
      continue;
    }
    const blocks = extractZeroBlocks(body);
    if (blocks.length === 0) {
      console.error(`FAIL ${file}: no \`\`\`zero blocks`);
      failed++;
      continue;
    }
    for (let i = 0; i < blocks.length; i++) {
      const ok = await checkZero(blocks[i], `${file} block ${i + 1}`);
      if (!ok) failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} validation error(s)`);
    process.exit(1);
  }
  console.log(`\nAll ${files.length} skills validated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
