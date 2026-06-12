#!/usr/bin/env node
/**
 * Sync BuilderPulse markdown reports from GitHub into ./content/
 * Run before build/dev, or via GitHub Actions on a schedule.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

const REPO = "BuilderPulse/BuilderPulse";
const BRANCH = "main";
const LANGS = ["en", "zh"];
const YEARS = ["2026"];

const GITHUB_API = `https://api.github.com/repos/${REPO}/contents`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

async function fetchJson(url) {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${url}`);
  }
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status}: ${url}`);
  }
  return res.text();
}

function extractMeta(content, lang) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? "Untitled";

  const buildPattern =
    lang === "zh"
      ? /## 🎯 今日 2 小时构建\s*\n+\*\*([^*]+)\*\*/
      : /## 🎯 Today's one 2-hour build\s*\n+\*\*([^*]+)\*\*/;
  const buildMatch = content.match(buildPattern);
  const buildIdea = buildMatch?.[1]?.trim() ?? "";

  const summaryPattern =
    lang === "zh"
      ? /## 📝 刘小排说\s*\n+([\s\S]*?)(?=\n## |\n\*\*谁会|\n\*\*Who pays)/
      : /## 📝 Liu Xiaopai says\s*\n+([\s\S]*?)(?=\n## |\n\*\*Who pays)/;
  const summaryMatch = content.match(summaryPattern);
  let summary = "";
  if (summaryMatch) {
    summary = summaryMatch[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 220);
    if (summary.length === 220) summary += "…";
  }

  return { title, buildIdea, summary };
}

async function loadManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { syncedAt: null, files: {} };
  }
}

async function main() {
  console.log("Syncing BuilderPulse content from GitHub…");
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  const manifest = await loadManifest();
  const files = { ...manifest.files };
  let updated = 0;
  let skipped = 0;

  for (const lang of LANGS) {
    for (const year of YEARS) {
      const dir = `${lang}/${year}`;
      const apiUrl = `${GITHUB_API}/${dir}?ref=${BRANCH}`;
      const entries = await fetchJson(apiUrl);

      const mdFiles = entries.filter(
        (e) => e.type === "file" && e.name.endsWith(".md"),
      );

      const targetDir = path.join(CONTENT_DIR, dir);
      await fs.mkdir(targetDir, { recursive: true });

      for (const entry of mdFiles) {
        const key = entry.path;
        const localPath = path.join(CONTENT_DIR, entry.path);

        if (files[key]?.sha === entry.sha) {
          skipped++;
          continue;
        }

        const content = await fetchText(entry.download_url);
        await fs.writeFile(localPath, content, "utf8");

        const date = entry.name.replace(".md", "");
        const meta = extractMeta(content, lang);

        files[key] = {
          sha: entry.sha,
          lang,
          year,
          date,
          ...meta,
          size: entry.size,
        };
        updated++;
        process.stdout.write(`  ✓ ${key}\n`);
      }
    }
  }

  const reports = Object.values(files)
    .filter((f) => f.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  const latest = {
    en: reports.find((r) => r.lang === "en")?.date ?? null,
    zh: reports.find((r) => r.lang === "zh")?.date ?? null,
  };

  const newManifest = {
    syncedAt: new Date().toISOString(),
    source: `https://github.com/${REPO}`,
    latest,
    reports,
    files,
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(newManifest, null, 2));
  console.log(`Done: ${updated} updated, ${skipped} unchanged.`);
  console.log(`Latest: EN ${latest.en}, ZH ${latest.zh}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});