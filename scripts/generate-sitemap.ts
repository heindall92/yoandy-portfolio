import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://yoandyramirez.com";

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/machines", changefreq: "weekly", priority: "0.9" },
  { path: "/sherlocks", changefreq: "weekly", priority: "0.9" },
  { path: "/hackmyvm", changefreq: "weekly", priority: "0.9" },
  { path: "/projects", changefreq: "monthly", priority: "0.9" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal", changefreq: "yearly", priority: "0.3" },
];

const registry = readFileSync(resolve("src/lib/reports-registry.ts"), "utf8");
const protectedSlugs = new Set(
  Array.from(registry.matchAll(/^\s*"([a-z0-9-]+)":\s*\{[^}]*protected:\s*true/gm)).map((m) => m[1]),
);
const allSlugs = Array.from(registry.matchAll(/^\s*"([a-z0-9-]+)":\s*\{/gm)).map((m) => m[1]);
const reportEntries: Entry[] = allSlugs
  .filter((s) => !protectedSlugs.has(s))
  .map((slug) => ({ path: `/report/${slug}`, changefreq: "monthly", priority: "0.7" }));

const projectsRegistry = readFileSync(resolve("src/lib/projects-registry.ts"), "utf8");
const projectSlugs = Array.from(projectsRegistry.matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm)).map((m) => m[1]);
const projectEntries: Entry[] = projectSlugs.map((slug) => ({
  path: `/projects/${slug}`,
  changefreq: "monthly",
  priority: "0.8",
}));

const entries = [...staticEntries, ...reportEntries, ...projectEntries];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);