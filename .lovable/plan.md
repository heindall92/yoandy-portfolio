
# Portfolio Profesional Cyberpunk — Yoandy Rodríguez

## Concepto Visual
Estilo **cyberpunk/futurista**: fondo oscuro, colores neón (verde #00ff41, cyan, magenta), gradientes vibrantes, efectos de glow, tipografía monoespaciada para elementos "hacker", y animaciones sutiles. Tu foto de perfil circular en posición destacada.

---

## Estructura Multi-página

### 1. 🏠 Home / Landing
- **Banner hero** con gradiente cyberpunk y efecto de partículas o scanlines
- **Foto de perfil circular** a la izquierda del banner con efecto glow verde neón
- **Nombre + título** ("Offensive Security | Pentesting | Red Team") a la derecha
- **Typing animation** como tu GitHub: "Cybersecurity & AI Master's Student; eJPT Candidate..."
- Botones de redes: LinkedIn, GitHub, TryHackMe, HackTheBox
- Barra de navegación fija con efecto glassmorphism oscuro

### 2. 👤 About Me
- Descripción profesional (bilingüe EN/ES como tu GitHub)
- Bloque estilo terminal con tu `$ whoami` info
- **Layout 2 columnas**: bio a la izquierda, stats/progreso a la derecha
  - eJPT prep: 75%
  - HTB Academy: Level 8
  - TryHackMe streak: 31+ days
  - Master's: 50%
- Barras de progreso con estilo neón

### 3. 🛠️ Skills & Certifications (2 columnas)
- **Columna izquierda**: Skills organizadas por categoría con badges estilo cyberpunk
  - ⚔️ Offensive Security: Kali, Metasploit, Nmap, Burp Suite, Wireshark, Gobuster, FFuf
  - 💻 Scripting & OS: Python, Bash, Linux
  - 🧰 Tools: Obsidian, Git, TryHackMe, HackTheBox
- **Columna derecha**: Certificaciones en cards con estado (✅ Done / 📚 In Progress)
  - eJPT — In Progress
  - Google IT Pro — Done
  - Cisco Cyber Defense — Done
  - IBM Cybersecurity — Done
  - Master's Cybersec & AI — 2026

### 4. 📂 Projects / Repositories (grid 2 columnas)
- Cards para cada repositorio con efecto hover neón:
  - 🔴 pentest-notes — Metodologías y checklists
  - 📖 tool-manuals — Manuales técnicos (Nmap, Metasploit, etc.)
  - 🛠️ security-scripts — Scripts de automatización
  - 🚩 ctf-writeups — Writeups de HTB y TryHackMe
- Cada card con tags de tecnologías, descripción y enlace a GitHub

### 5. 📬 Contact / Links
- Sección con todos los perfiles con iconos y efecto glow al hover:
  - LinkedIn: linkedin.com/in/yoandyrd92
  - GitHub: github.com/heindall92
  - TryHackMe: tryhackme.com/p/yoandy92
  - HackTheBox: profile link
- Ubicación: Lepe, Huelva, España 🇪🇸

---

## Detalles Técnicos
- Navegación entre páginas con React Router
- Responsive (móvil y desktop)
- Sin backend necesario (contenido estático con enlaces)
- Animaciones CSS para efectos neón y glow
- Diseño uniforme en 2 columnas donde aplique

---

## Formato Estándar de Reportes (Oopsie/Brutus Format)

**TODOS** los reportes de máquinas (HTB, HackMyVM, Sherlocks) deben seguir este formato unificado. NO se permite otro formato.

### Estructura HTML obligatoria:
1. **Canvas Matrix** — fondo animado `<canvas id="matrix">` con caracteres cayendo (opacity 0.13)
2. **Hero section** (`max-width: 1200px`, centrado):
   - `hero-breadcrumb`: `Plataforma / OS / NombreMáquina`
   - `tags`: pills con `tag-htb` (verde), `tag-hmv` (magenta), `tag-sherlock` (cyan), `tag-os`, `tag-easy/medium/hard/veryeasy`
   - `h1`: Nombre + `<span>Machine</span>` (palabra en verde)
   - `hero-desc`: Párrafo descriptivo de la cadena de ataque
   - `meta-row`: Autor (Yoandy Ramírez Delgado), Tipo, Herramienta Clave, Objetivo
3. **Main grid** (`1fr 280px`):
   - **Content**: Secciones `.section` con `.section-header` (`.section-icon` dot verde + `h2` uppercase)
   - **Sidebar**: Cards con `Detalles del Reto` (detail-rows), `Skills Demostradas` (barras de progreso), `Herramientas` (tool-items)
4. **Code blocks**: `<pre><code>` con `::before` terminal header (botones rojo/amarillo/verde + label "terminal")
5. **Clases de color**: `.cmd` (cyan), `.highlight` (verde), `.cred` (amarillo), `.flag-val` (rosa), `.comment` (verde oscuro), `.output` (gris)
6. **Callouts**: `.callout-info`, `.callout-danger`, `.callout-tip`, `.callout-warn`
7. **Timeline**: `.timeline-item` con dot verde y línea vertical
8. **MITRE ATT&CK**: `.mitre-grid` con `.mitre-tag` badges
9. **Flags**: `.flags-grid` con `.flag-card` (hash rosa)

### CSS Variables:
```css
--bg:#0a0e1a; --card-bg:#111827; --border:#1e2d4a; --primary:#4ade80;
--cyan:#22d3ee; --text:#e2e8f0; --text-dim:#94a3b8; --text-muted:#64748b;
--red:#f87171; --yellow:#fbbf24; --purple:#a78bfa; --orange:#fb923c;
```

### Tarjetas de descripción en la app React:
- Resumen técnico conciso de la cadena de ataque real (NO genérico)
- Tags relevantes a las herramientas/técnicas específicas usadas
- Dificultad y OS correctos

### Reportes actuales (33 total):
**HTB Machines (24):** meow, fawn, dancing, redeemer, appointment, explosion, preignition, mongod, synced, funnel, bike, vaccine, archetype, oopsie, unified, ignition, precious, steamcloud, eighteen, twomillion, cctv, pterodactyl, interpreter, airtouch
**Sherlocks (5):** brutus, crownjewel1, dreamjob1, dreamjob2, romcom
**HackMyVM (4):** dc01, dc01-v2, tripladvisor, devoops
