import type { MetadataRoute } from "next";
import {
  getArchivePeriods,
  getBuildIdeas,
  getManifest,
  getReports,
  LANGS,
  TOPICS,
} from "@/lib/content";
import { PERSONAS } from "@/lib/programmatic";
import { absoluteUrl, languageAlternates, localizedPath } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export const dynamic = "force-static";

const STATIC_PATHS = [
  "",
  "/archive",
  "/topics",
  "/build-ideas",
  "/for",
  "/methodology",
  "/sources",
  "/about",
];

const MACHINE_READABLE_PATHS = [
  "/llms.txt",
  "/ai-search.md",
  "/about.md",
  "/sources.md",
];

function entry({
  lang,
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  lang: Lang;
  path: string;
  lastModified: string | Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(localizedPath(lang, path)),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: languageAlternates(path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const manifest = getManifest();
  const lastModified = manifest.syncedAt ?? new Date().toISOString();
  const urls: MetadataRoute.Sitemap = [];

  for (const path of MACHINE_READABLE_PATHS) {
    urls.push({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "daily",
      priority: 0.85,
    });
  }

  for (const lang of LANGS) {
    for (const path of STATIC_PATHS) {
      urls.push(
        entry({
          lang,
          path,
          lastModified,
          changeFrequency: path === "" ? "daily" : "weekly",
          priority: path === "" ? 1 : 0.8,
        }),
      );
    }

    for (const period of getArchivePeriods(lang)) {
      urls.push(
        entry({
          lang,
          path: `/archive/${period.key}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.65,
        }),
      );
    }

    for (const year of new Set(
      getArchivePeriods(lang).map((period) => period.key.slice(0, 4)),
    )) {
      urls.push(
        entry({
          lang,
          path: `/archive/${year}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.55,
        }),
      );
    }

    for (const topic of TOPICS) {
      urls.push(
        entry({
          lang,
          path: `/topics/${topic.slug}`,
          lastModified,
          changeFrequency: "daily",
          priority: 0.8,
        }),
      );
    }

    for (const persona of PERSONAS) {
      urls.push(
        entry({
          lang,
          path: `/for/${persona.slug}`,
          lastModified,
          changeFrequency: "daily",
          priority: 0.82,
        }),
      );
    }

    for (const idea of getBuildIdeas(lang)) {
      urls.push(
        entry({
          lang,
          path: `/build-ideas/${idea.slug}`,
          lastModified: idea.primaryReport.date,
          changeFrequency: "monthly",
          priority: 0.75,
        }),
      );
    }

    for (const report of getReports(lang)) {
      urls.push(
        entry({
          lang,
          path: `/${report.date}`,
          lastModified: report.date,
          changeFrequency: "monthly",
          priority: 0.7,
        }),
      );
    }
  }

  return urls;
}
