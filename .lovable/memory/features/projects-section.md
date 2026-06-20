---
name: Projects / Labs Section
description: Sección /projects con casos de estudio detallados (Valhalla SOC, Máster Evolve). Distinta de write-ups.
type: feature
---
Ruta `/projects` lista cards de proyectos propios; `/projects/:slug` muestra ficha completa (header, highlights, overview, stack, arquitectura ASCII, tabla de reglas MITRE, capturas, CTA GitHub).

Datos en `src/lib/projects-registry.ts` (interface `ProjectEntry`). Capturas servidas desde `public/projects/<slug>/`.

Primer proyecto: **Valhalla SOC** — Wazuh 4.9.2 + Cowrie + Ollama (qwen2.5-coder:7b) + Docker. Proyecto del Máster Evolve (Prácticas 1 y 2). Repo: https://github.com/heindall92/Proyecto-Master-Ciberseguridad-Evolve-Yoandy

Convenciones:
- Mismo lenguaje visual que el resto del sitio (Bebas Neue + JetBrains Mono, neon-green #00e87a sobre forest #0b1a10).
- Status: PRODUCTION | WIP | ARCHIVED con color (primary / yellow / muted).
- Sitemap auto-incluye los slugs via regex sobre el registry (ver scripts/generate-sitemap.ts).
- SEO: JSON-LD `SoftwareSourceCode` por proyecto.
- Navbar muestra link "projects" en desktop y mobile.
- Práctica 2 del Máster aún no existe → card placeholder visible en `/projects`.