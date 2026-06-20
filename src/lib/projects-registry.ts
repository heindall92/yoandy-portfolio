export interface ProjectScreenshot {
  src: string;
  caption: string;
}

export interface ProjectRule {
  id: string;
  level: number;
  what: string;
  mitre: string;
}

export interface ProjectEntry {
  slug: string;
  name: string;
  codename: string;
  tagline: string;
  emoji: string;
  status: "PRODUCTION" | "WIP" | "ARCHIVED";
  year: string;
  role: string;
  context: string;
  summary: string;
  description: string[];
  stack: string[];
  tags: string[];
  highlights: { label: string; value: string }[];
  links: { label: string; href: string; primary?: boolean }[];
  architecture?: string;
  rules?: ProjectRule[];
  screenshots: ProjectScreenshot[];
}

export const projects: ProjectEntry[] = [
  {
    slug: "valhalla-soc",
    name: "Valhalla SOC Pro",
    codename: "VALHALLA SOC PRO",
    tagline: "Plataforma SOC profesional con IA local · Blue Team · Wazuh 4.9.5",
    emoji: "⚔️",
    status: "PRODUCTION",
    year: "2025 — 2026",
    role: "Arquitecto & SOC Engineer",
    context: "Proyecto Máster Ciberseguridad & IA — Evolve Academy (Práctica 1 & 2)",
    summary:
      "SOC profesional que despliega un honeypot SSH/Telnet, detecta ataques reales en tiempo real con Wazuh SIEM, los analiza con un LLM local (Ollama · qwen2.5-coder) y los presenta en dashboards interactivos mapeados al framework MITRE ATT&CK. 100% local, sin coste, alineado con ISO/IEC 27001.",
    description: [
      "Valhalla SOC simula el día a día de un Blue/Purple Team: una infraestructura productiva expuesta a Internet a través de un honeypot Cowrie que atrae bots y atacantes reales, registra cada tecla y cada comando, y reenvía los logs a un SIEM Wazuh que los clasifica con 12+ reglas custom mapeadas a MITRE ATT&CK.",
      "Cuando una alerta supera el nivel 5 (fuerza bruta, descarga de malware, reverse shell, evasión de defensas…) un integrador llama vía HTTP a Ollama corriendo localmente en host.docker.internal:11434. El modelo qwen2.5-coder:7b genera un análisis técnico en 2 oraciones que vuelve a indexarse como alerta 'Ollama AI Insight' en el Dashboard.",
      "Toda la arquitectura está orquestada con Docker Compose. No hay datos saliendo a la nube — el cumplimiento normativo (GDPR, ISO 27001) se garantiza porque la inferencia, los logs y los dashboards viven en el mismo host. El operador obtiene reportes PDF/CSV listos para entregar a Dirección.",
    ],
    stack: ["Wazuh 4.9.2", "Cowrie", "Ollama", "qwen2.5-coder:7b", "OpenSearch", "Docker Compose", "Python", "MITRE ATT&CK"],
    tags: ["SOC", "SIEM", "Honeypot", "AI", "Blue Team", "ISO 27001", "MITRE"],
    highlights: [
      { label: "ALERTAS REALES", value: "12.918+" },
      { label: "REGLAS CUSTOM", value: "12" },
      { label: "MITRE TTPs", value: "11" },
      { label: "MODELO LOCAL", value: "qwen2.5 7B" },
      { label: "COSTE NUBE", value: "0 €" },
      { label: "STACK", value: "100% OSS" },
    ],
    links: [
      { label: "Demo cinemático", href: "/projects/valhalla/demo.html", primary: true },
      { label: "Repositorio GitHub", href: "https://github.com/heindall92/Proyecto-Master-Ciberseguridad-Evolve-Yoandy" },
      { label: "Documentación README", href: "https://github.com/heindall92/Proyecto-Master-Ciberseguridad-Evolve-Yoandy#readme" },
    ],
    architecture: `INTERNET / ATACANTES
        │  puerto 2222
        ▼
┌──────────────────────────┐
│  🪤  COWRIE HONEYPOT     │   simula SSH/Telnet · logs JSON
└──────────┬───────────────┘
           │ volumen compartido
           ▼
┌──────────────────────────┐
│  🔍  WAZUH MANAGER       │   reglas custom + MITRE ATT&CK
│  alerta ≥ 5  ────────────┼──► 🤖 OLLAMA  (qwen2.5-coder:7b)
└──────────┬───────────────┘     análisis IA en 2 frases
           ▼
┌──────────────────────────┐
│  🗄️  WAZUH INDEXER       │   OpenSearch · puerto 9200
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│  📊  WAZUH DASHBOARD     │   HTTPS · reportes PDF/CSV
└──────────────────────────┘`,
    rules: [
      { id: "100110", level: 5,  what: "Login fallido en honeypot",            mitre: "—" },
      { id: "100111", level: 10, what: "Fuerza bruta (5+ fallos en 120s)",     mitre: "T1110" },
      { id: "100112", level: 9,  what: "Login exitoso en honeypot",            mitre: "T1078" },
      { id: "100113", level: 12, what: "Login exitoso tras fuerza bruta",      mitre: "T1078 · T1110" },
      { id: "100120", level: 8,  what: "Comando ejecutado",                    mitre: "T1059" },
      { id: "100121", level: 9,  what: "Comandos de reconocimiento",           mitre: "T1082" },
      { id: "100130", level: 13, what: "Descarga de malware (wget/curl)",      mitre: "T1105" },
      { id: "100140", level: 15, what: "Reverse shell",                        mitre: "T1059 · T1071" },
      { id: "100150", level: 14, what: "Desactivar firewall / seguridad",      mitre: "T1562" },
      { id: "100160", level: 11, what: "Persistencia (crontab)",               mitre: "T1053" },
      { id: "100170", level: 12, what: "Anti-forense (borrar logs)",           mitre: "T1070" },
      { id: "100180", level: 12, what: "Escalada de privilegios",              mitre: "T1548" },
      { id: "100200", level: 9,  what: "Ollama AI Insight (análisis IA)",      mitre: "—" },
    ],
    screenshots: [
      { src: "/projects/valhalla/01-vista-general.png",        caption: "Vista General — KPIs en vivo, alertas 24h, agentes activos, tickets abiertos y distribución por severidad" },
      { src: "/projects/valhalla/02-login.png",                caption: "Login VALHALLA SOC PRO — branding Blue Team, Wazuh 4.9.5, CLASSIFIED // EYES ONLY" },
      { src: "/projects/valhalla/03-threat-intel.png",         caption: "Threat Intel — motor VT Report Engine: 14/91 vendors marcan la IP como maliciosa, IoC añadido a watchlist y bloqueado en firewall" },
      { src: "/projects/valhalla/04-threat-map.png",           caption: "Cyber-Threat Intelligence Map — visualización geo en tiempo real (Pew-Pew Mode) con geofencing alerts" },
      { src: "/projects/valhalla/05-workspace.png",            caption: "Workspace — panel de respuesta a incidentes estilo Kanban (Triaje · Investigación · Mitigación · Resuelto) con runbooks sugeridos" },
      { src: "/projects/valhalla/06-runbooks.png",             caption: "Runbooks — procedimientos NIST 800-61 r2 con pasos PowerShell ejecutables (Sysmon, VirusTotal, contención por VLAN)" },
      { src: "/projects/valhalla/07-lsa-monitor.png",          caption: "LSA Monitor · Credential Guard — detección de Mimikatz/Sysmon ID 10 sobre lsass.exe" },
      { src: "/projects/valhalla/08-honeypot.png",             caption: "Honeypots Cowrie — KPIs de engaño, TTY feed en vivo y top atacantes" },
      { src: "/projects/valhalla/09-estado-integraciones.png", caption: "Estado de Integraciones — health-check de Wazuh, OpenSearch, PostgreSQL, Ollama AI y VirusTotal con latencias en tiempo real" },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);