import { useEffect, useRef, useState, useCallback } from "react";
import { sanitizeSearch } from "@/lib/security";
import * as THREE from "three";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import profileImg from "@/assets/profile.jpg";
import { machines } from "./Machines";
import { sherlocks } from "./Sherlocks";
import { hmvMachines } from "./HackMyVM";

/* ── All writeups combined ── */
const allWriteups = [
  ...machines.map((m) => ({ ...m, platform: "HTB", type: "machine" })),
  ...sherlocks.map((s) => ({ ...s, platform: "Sherlock", type: "sherlock", os: "N/A" })),
  ...hmvMachines.map((m) => ({ ...m, platform: "HackMyVM", type: "hmv" })),
  {
    slug: "hammer-thm", emoji: "🔨", name: "Hammer", platform: "TryHackMe", type: "thm",
    desc: "Máquina TryHackMe Linux Medium centrada en web. Cadena: directory listing en hmr_logs expone email → bypass de rate limiting con X-Forwarded-For para forzar OTP de 4 dígitos (50 hilos en paralelo) → reset de password → análisis del JWT con kid path traversal → forja de token admin con clave conocida (188ade1.key) → RCE como www-data.",
    tags: ["TryHackMe", "JWT", "kid Injection", "OTP Brute", "X-Forwarded-For", "Web"],
    difficulty: "MEDIUM", diffColor: "neon-yellow", os: "Linux",
  },
  {
    slug: "buda-thl", emoji: "🧘", name: "Buda", platform: "THL", type: "thl",
    desc: "Linux Hard de The Hacker Labs. Enumeración de virtual hosts, SQL Injection para credenciales FTP, crackeo de ZIP cifrado, port knocking para desbloquear SSH y escalada con SUID /usr/bin/bash.",
    tags: ["SQLi", "Port Knocking", "SUID", "ffuf", "fcrackzip"],
    difficulty: "HARD", diffColor: "destructive", os: "Linux",
  },
  {
    slug: "ejptv2-cert", emoji: "🎯", name: "eJPTv2", platform: "Cert", type: "cert",
    desc: "Evaluación ofensiva completa de red híbrida DMZ + red interna. Reconocimiento y enumeración de 7 hosts, explotación multi-vector (Drupalgeddon2, FTP webshell, WordPress RCE, SMB brute force), pivoting via autoroute y post-explotación con hashdump. 86% aprobado.",
    tags: ["eJPTv2", "Pivoting", "Drupalgeddon2", "Metasploit", "SMB"],
    difficulty: "CERTIFICATION", diffColor: "primary", os: "Windows · Linux",
  },
];

const totalMachines = allWriteups.length;

const socialLinks = [
  { label: "LINKEDIN", val: "/yoandyrd92", sub: "Conectar profesionalmente", href: "https://www.linkedin.com/in/yoandyrd92/", ico: "💼" },
  { label: "GITHUB", val: "/heindall92", sub: "Proyectos y herramientas", href: "https://github.com/heindall92", ico: "🐙" },
  { label: "HACK THE BOX", val: "/heindall", sub: "Perfil y ranking activo", href: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa", ico: "🟩" },
  { label: "TRYHACKME", val: "/yoandy92", sub: "Racha activa", href: "https://tryhackme.com/p/yoandy92", ico: "🔴" },
];

const certifications = [
  { ico: "🎯", org: "eLEARNSECURITY", name: "eJPTv2 — Junior Penetration Tester", status: "✓ CERTIFIED", statusClass: "cs-d" },
  { ico: "🔵", org: "GOOGLE", name: "Cybersecurity Professional", status: "✓ DONE", statusClass: "cs-d" },
  { ico: "🌐", org: "CISCO", name: "Networking & Security", status: "✓ DONE", statusClass: "cs-d" },
  { ico: "💙", org: "IBM", name: "Cybersecurity Analyst", status: "✓ DONE", statusClass: "cs-d" },
  { ico: "🟩", org: "HTB ACADEMY", name: "Jr. Cybersecurity Analyst Path", status: "✓ FULL PATH", statusClass: "cs-d" },
  { ico: "🎓", org: "EVOLVE ACADEMY", name: "Master Ciberseguridad & AI", status: "EN CURSO", statusClass: "cs-w" },
  { ico: "🏆", org: "OFFSEC", name: "OSCP — Offensive Security", status: "2026", statusClass: "cs-p" },
  { ico: "⚡", org: "HTB", name: "CPTS — Certified Pentester", status: "2026", statusClass: "cs-p" },
];

const roadmap = [
  { n: "01", title: "HTB Jr. Cybersecurity Analyst", desc: "Full path completado · 2024", status: "done", badge: "DONE", badgeClass: "rbd" },
  { n: "02", title: "Google · IBM · Cisco · 6 certs", desc: "Fundamentos sólidos · Completadas", status: "done", badge: "DONE", badgeClass: "rbd" },
  { n: "03", title: "eJPTv2 — Junior Penetration Tester", desc: "Certificación obtenida · eLEARNSECURITY", status: "done", badge: "CERTIFIED", badgeClass: "rbd" },
  { n: "04", title: "CPTS — HTB Certified Pentester", desc: "Certified Penetration Testing Specialist", status: "", badge: "2026", badgeClass: "rbp" },
  { n: "05", title: "OSCP — OffSec Certified Pro", desc: "El Asgard del offensive security", status: "", badge: "2026", badgeClass: "rbp" },
];

const skills = [
  { ico: "🎯", name: "Penetration Testing", desc: "Evaluaciones PTES/OWASP. Reconocimiento, explotación, post-explotación y reporte técnico.", tags: ["Metasploit", "Burp Suite", "Nmap", "Gobuster", "ffuf"], pct: "82%" },
  { ico: "🌐", name: "Web App Security", desc: "SQLi, XSS, SSRF, JWT attacks, IDOR, LFI/RFI — OWASP Top 10 completo.", tags: ["SQLMap", "Nikto", "jwt_tool", "Nuclei", "XSS Hunter"], pct: "78%" },
  { ico: "🔍", name: "Recon & OSINT", desc: "Enumeración activa/pasiva, DNS recon, subdomain takeover, análisis de superficie.", tags: ["Subfinder", "Amass", "dnsrecon", "unfurl", "Harvester"], pct: "85%" },
  { ico: "🐚", name: "Post-Explotación", desc: "PrivEsc Linux/Windows, cron hijacking, SUID abuse, pivoting y movimiento lateral.", tags: ["LinPEAS", "WinPEAS", "Penelope", "MSFVenom", "hashcat"], pct: "75%" },
  { ico: "🤖", name: "Automation & Scripting", desc: "Automatización de tareas de pentesting con scripts personalizados en Python y Bash.", tags: ["Python", "Bash", "Scripting", "Automation"], pct: "80%" },
  { ico: "🏴‍☠️", name: "CTF & Research", desc: `${totalMachines}+ máquinas en HTB, THM, HackMyVM. Serie de tutoriales ES/EN.`, tags: ["HackTheBox", "TryHackMe", "HackMyVM"], pct: "88%" },
];

const toolsRow1 = ["⚡ Metasploit", "🌐 Burp Suite", "🔍 Nmap", "💉 SQLMap", "📂 Gobuster", "🦊 ffuf", "🐍 Python", "🔐 hashcat", "🛡️ Nikto", "🔑 jwt_tool", "📡 Subfinder", "🕵️ theHarvester"];
const toolsRow2 = ["🧪 LinPEAS", "🪟 WinPEAS", "🔴 MSFVenom", "📡 Amass", "🔎 dnsrecon", "🔗 unfurl", "📜 Nuclei", "🐚 Penelope", "🖧 Wireshark", "🔀 John the Ripper", "🩸 BloodHound"];

/* ── Difficulty helpers ── */
const diffClass = (d: string) => {
  const dl = d.toLowerCase();
  if (dl.includes("very easy") || dl.includes("easy")) return "de";
  if (dl.includes("medium")) return "dm";
  return "dh";
};
const diffLabel = (d: string) => d.toUpperCase();

const marqueeItems = ["HEINDALL", "RED TEAM OPERATOR", "OFFENSIVE SECURITY", "PENETRATION TESTING", "VULNERABILITY HUNTER", "ETHICAL HACKING", "CTF HUNTER"];

const Index = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [counter, setCounter] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  /* Three.js particles background — exact replica */
  useEffect(() => {
    const c3d = particlesRef.current;
    if (!c3d) return;
    const renderer = new THREE.WebGLRenderer({ canvas: c3d, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
    camera.position.z = 5;

    const N = 7000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      const t = Math.random();
      if (t > 0.85) { col[i * 3] = 0; col[i * 3 + 1] = 1; col[i * 3 + 2] = 0.42; }
      else if (t > 0.7) { col[i * 3] = 0.13; col[i * 3 + 1] = 0.77; col[i * 3 + 2] = 0.37; }
      else if (t > 0.5) { col[i * 3] = 0.07; col[i * 3 + 1] = 0.42; col[i * 3 + 2] = 0.2; }
      else if (t > 0.3) { col[i * 3] = 0.04; col[i * 3 + 1] = 0.2; col[i * 3 + 2] = 0.1; }
      else { col[i * 3] = 0.02; col[i * 3 + 1] = 0.08; col[i * 3 + 2] = 0.04; }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const ptMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true });
    const pts = new THREE.Points(geo, ptMat);
    scene.add(pts);

    // wireframe spheres (3 layers)
    const spheres = [[1.9, 3, 0.055], [2.7, 1, 0.028], [3.6, 1, 0.014]].map(([r, d, o]) => {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r, d),
        new THREE.MeshBasicMaterial({ color: 0x00ff6a, wireframe: true, transparent: true, opacity: o })
      );
      scene.add(m);
      return m;
    });

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = -(e.clientY / innerHeight - 0.5) * 2;
    };
    document.addEventListener("mousemove", onMouse);

    const resize = () => {
      const w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let tick = 0;
    let raf: number;
    const anim = () => {
      raf = requestAnimationFrame(anim);
      tick += 0.012;
      pts.rotation.y = tick * 0.18 + mx * 0.18;
      pts.rotation.x = tick * 0.09 + my * 0.12;
      spheres[0].rotation.y = tick * 0.35; spheres[0].rotation.x = tick * 0.18;
      spheres[1].rotation.y = -tick * 0.25; spheres[1].rotation.z = tick * 0.15;
      spheres[2].rotation.y = tick * 0.15; spheres[2].rotation.z = -tick * 0.1;
      renderer.render(scene, camera);
    };
    anim();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      geo.dispose();
      ptMat.dispose();
      spheres.forEach(s => { s.geometry.dispose(); (s.material as THREE.Material).dispose(); });
    };
  }, []);

  /* Orb — 2D icosahedron wireframe (same shape as Three.js IcosahedronGeometry) */
  useEffect(() => {
    const oc = orbRef.current;
    if (!oc) return;
    const ox = oc.getContext("2d");
    if (!ox) return;
    let oW = oc.offsetWidth, oH = oc.offsetHeight;
    oc.width = oW; oc.height = oH;
    const onResize = () => { oW = oc.offsetWidth; oH = oc.offsetHeight; oc.width = oW; oc.height = oH; };
    window.addEventListener("resize", onResize);

    // Build subdivided icosahedron (matches Three.js IcosahedronGeometry)
    const buildIco = (detail: number, radius: number) => {
      const t = (1 + Math.sqrt(5)) / 2;
      let verts: [number, number, number][] = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
      ];
      // Normalize to unit sphere
      verts = verts.map(v => {
        const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / l, v[1] / l, v[2] / l];
      });
      let faces = [
        [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
        [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
        [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
        [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
      ];
      // Subdivide
      const midCache: Record<string, number> = {};
      const getMid = (a: number, b: number): number => {
        const key = Math.min(a, b) + "-" + Math.max(a, b);
        if (midCache[key] !== undefined) return midCache[key];
        const va = verts[a], vb = verts[b];
        const mx = (va[0] + vb[0]) / 2, my = (va[1] + vb[1]) / 2, mz = (va[2] + vb[2]) / 2;
        const l = Math.sqrt(mx * mx + my * my + mz * mz);
        verts.push([mx / l, my / l, mz / l]);
        midCache[key] = verts.length - 1;
        return midCache[key];
      };
      for (let d = 0; d < detail; d++) {
        const newFaces: number[][] = [];
        for (const f of faces) {
          const a = getMid(f[0], f[1]);
          const b = getMid(f[1], f[2]);
          const c = getMid(f[2], f[0]);
          newFaces.push([f[0], a, c], [f[1], b, a], [f[2], c, b], [a, b, c]);
        }
        faces = newFaces;
      }
      // Extract unique edges
      const edgeSet = new Set<string>();
      const edges: [number, number][] = [];
      for (const f of faces) {
        for (let i = 0; i < 3; i++) {
          const a = f[i], b = f[(i + 1) % 3];
          const key = Math.min(a, b) + "-" + Math.max(a, b);
          if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([a, b]); }
        }
      }
      // Scale vertices
      const scaled = verts.map(v => [v[0] * radius, v[1] * radius, v[2] * radius] as [number, number, number]);
      return { verts: scaled, edges };
    };

    // Fewer details than background to not steal focus
    const layer1 = buildIco(2, 1);
    const layer2 = buildIco(1, 0.72);

    const rotYf = (x: number, z: number, a: number): [number, number] => [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
    const rotXf = (y: number, z: number, a: number): [number, number] => [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];

    let ot = 0;
    let raf: number;
    const animOrb = () => {
      raf = requestAnimationFrame(animOrb);
      ot += 0.006;
      ox.clearRect(0, 0, oW, oH);
      const cx = oW / 2, cy = oH / 2, R = Math.min(oW, oH) * 0.28;

      // Outer glow
      const grd = ox.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.3);
      grd.addColorStop(0, "rgba(0,232,122,.08)");
      grd.addColorStop(1, "rgba(0,232,122,0)");
      ox.beginPath(); ox.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ox.fillStyle = grd; ox.fill();

      // Draw wireframe layer
      const drawLayer = (layer: typeof layer1, ryMul: number, rxMul: number, alpha: number) => {
        const ry = ot * ryMul, rxr = ot * rxMul;
        ox.beginPath();
        ox.strokeStyle = `rgba(0,232,122,${alpha})`;
        ox.lineWidth = 0.7;
        for (const [a, b] of layer.edges) {
          const va = layer.verts[a], vb = layer.verts[b];
          let [x1, z1] = rotYf(va[0], va[2], ry);
          let [y1] = rotXf(va[1], z1, rxr);
          let [x2, z2] = rotYf(vb[0], vb[2], ry);
          let [y2] = rotXf(vb[1], z2, rxr);
          ox.moveTo(cx + x1 * R, cy + y1 * R);
          ox.lineTo(cx + x2 * R, cy + y2 * R);
        }
        ox.stroke();
      };

      // Sync with background (bg tick+=0.012, orb ot+=0.006 → multiply by 2)
      drawLayer(layer1, 0.7, 0.36, 0.18);
      drawLayer(layer2, -0.5, 0.3, 0.08);

      // Atom electron orbits
      const orbitR = R * 1.35;
      const drawOrbit = (tiltX: number, tiltZ: number, electronAngle: number) => {
        ox.beginPath();
        ox.strokeStyle = 'rgba(0,232,122,0.18)';
        ox.lineWidth = 0.7;
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          let px = Math.cos(a) * orbitR;
          let py = Math.sin(a) * orbitR * 0.3;
          const px2 = px * Math.cos(tiltZ) - py * Math.sin(tiltZ);
          const py2 = px * Math.sin(tiltZ) + py * Math.cos(tiltZ);
          const py3 = py2 * Math.cos(tiltX) - Math.sin(a) * orbitR * 0.1 * Math.sin(tiltX);
          const sx = cx + px2, sy = cy + py3;
          if (i === 0) ox.moveTo(sx, sy); else ox.lineTo(sx, sy);
        }
        ox.stroke();
        // Electron dot
        const ea = electronAngle;
        let ex = Math.cos(ea) * orbitR;
        let ey = Math.sin(ea) * orbitR * 0.3;
        const ex2 = ex * Math.cos(tiltZ) - ey * Math.sin(tiltZ);
        const ey2 = ex * Math.sin(tiltZ) + ey * Math.cos(tiltZ);
        const ey3 = ey2 * Math.cos(tiltX) - Math.sin(ea) * orbitR * 0.1 * Math.sin(tiltX);
        // Glow
        ox.beginPath();
        ox.arc(cx + ex2, cy + ey3, 3, 0, Math.PI * 2);
        ox.fillStyle = 'rgba(0,232,122,0.12)';
        ox.fill();
        // Core electron
        ox.beginPath();
        ox.arc(cx + ex2, cy + ey3, 1.8, 0, Math.PI * 2);
        ox.fillStyle = 'rgba(0,232,122,0.5)';
        ox.fill();
      };
      drawOrbit(0, 0.5, ot * 2);
      drawOrbit(0.8, -0.3, ot * 2 + Math.PI * 0.66);
      drawOrbit(-0.5, 1.2, ot * 2 + Math.PI * 1.33);

      // Core glow
      const pulse = 0.06 + Math.sin(ot * 2) * 0.03;
      const cg = ox.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
      cg.addColorStop(0, `rgba(0,232,122,${pulse + 0.08})`);
      cg.addColorStop(1, "rgba(0,232,122,0)");
      ox.beginPath(); ox.arc(cx, cy, R * 0.35, 0, Math.PI * 2);
      ox.fillStyle = cg; ox.fill();

      // YRD text in center (bigger)
      const txtPulse = 0.65 + Math.sin(ot * 1.8) * 0.2;
      ox.font = `${Math.round(R * 0.38)}px Bebas Neue`;
      ox.textAlign = "center"; ox.textBaseline = "middle";
      ox.shadowColor = "rgba(0,232,122,.7)"; ox.shadowBlur = 18 + Math.sin(ot * 2) * 6;
      ox.fillStyle = `rgba(0,232,122,${txtPulse})`;
      ox.fillText("YRD", cx, cy + 2);
      ox.shadowBlur = 0;
    };
    animOrb();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  /* Counter animation */
  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n++;
      setCounter(n);
      if (n >= totalMachines) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, []);

  /* Reveal on scroll */
  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("v");
            e.target.querySelectorAll<HTMLElement>(".skf").forEach((b) => {
              if (!b.dataset.a) {
                b.dataset.a = "1";
                setTimeout(() => (b.style.width = b.dataset.w || "0"), 200);
              }
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".rev,.revr").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  /* Nav solid on scroll */
  useEffect(() => {
    const handler = () => {
      const nav = document.getElementById("main-nav");
      if (nav) nav.classList.toggle("solid", window.scrollY > 60);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Filter writeups */
  const filtered = allWriteups.filter((w) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      w.name.toLowerCase().includes(q) ||
      w.desc.toLowerCase().includes(q) ||
      w.tags.some((t) => t.toLowerCase().includes(q));

    let matchFilter = true;
    if (filter === "htb") matchFilter = w.platform === "HTB";
    else if (filter === "sherlock") matchFilter = w.platform === "Sherlock";
    else if (filter === "hmv") matchFilter = w.platform === "HackMyVM";
    else if (filter === "thl") matchFilter = w.platform === "THL";
    else if (filter === "thm") matchFilter = w.platform === "TryHackMe";
    else if (filter === "cert") matchFilter = w.platform === "Cert";
    else if (filter === "easy") matchFilter = w.difficulty.toLowerCase().includes("easy");
    else if (filter === "medium") matchFilter = w.difficulty.toLowerCase().includes("medium");
    else if (filter === "hard") matchFilter = w.difficulty.toLowerCase() === "hard";

    return matchSearch && matchFilter;
  });

  return (
    <div className="draft-page">
      <style>{`
        /* ─── MAIN PAGE STYLES ─── */
        .draft-page{
          --ink:#0b1a10;--forest:#0f2318;--pine:#163020;--moss:#1e4030;--sage:#2a6048;
          --green:#00e87a;--green2:rgba(0,232,122,.15);--green3:rgba(0,232,122,.06);
          --cream:#f2ede4;--cream2:#faf7f1;--cream3:#e8e0d0;
          --text-d:#c8f0dc;--text-d2:rgba(200,240,220,.5);--text-d3:rgba(200,240,220,.25);
          --text-l:#1a2e20;--text-l2:rgba(26,46,32,.55);--text-l3:rgba(26,46,32,.3);
          --blue:#38d9f5;--amber:#f5a623;--red:#f04f5a;
          --bb:'Bebas Neue',sans-serif;--dm:'DM Sans',sans-serif;--mo:'JetBrains Mono',monospace;
          font-family:var(--dm);background:var(--ink);color:var(--text-d);overflow-x:hidden;font-size:16px;
        }
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

        /* NAV */
        .dnav{position:fixed;top:0;left:0;right:0;z-index:300;display:flex;justify-content:space-between;align-items:center;padding:22px 52px;transition:all .4s}
        .dnav.solid{background:rgba(11,26,16,.92);backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,232,122,.08);padding:15px 52px}
        .nlogo{display:flex;align-items:center;gap:12px;text-decoration:none}
        .nlogo-h{font-family:var(--bb);font-size:1.6rem;letter-spacing:.25em;color:var(--green);line-height:1}
        .nlogo-s{font-family:var(--mo);font-size:.72rem;color:var(--text-d3);letter-spacing:.2em;margin-top:2px}
        .nlinks{display:flex;gap:32px;list-style:none;margin:0;padding:0}
        .nlinks a{font-family:var(--mo);font-size:.92rem;color:var(--text-d3);text-decoration:none;letter-spacing:.12em;transition:color .3s}
        .nlinks a:hover{color:var(--green)}
        .nmobile-toggle{display:none;background:none;border:none;color:var(--green);cursor:pointer}
        .nmobile-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:299;background:rgba(11,26,16,.97);backdrop-filter:blur(24px);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px}
        .nmobile-overlay a{font-family:var(--mo);font-size:1.3rem;color:var(--text-d3);text-decoration:none;letter-spacing:.15em;transition:color .3s;padding:12px 0}
        .nmobile-overlay a:hover{color:var(--green)}
        @media(max-width:900px){.nlinks{display:none}.nmobile-toggle{display:block}}

        /* HERO */
        .draft-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:100px 20px 80px}
        .h-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 55%,var(--forest) 0%,var(--ink) 70%)}
        .h-bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,232,122,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.03) 1px,transparent 1px);background-size:56px 56px}
        .h-particles{position:absolute;inset:0;z-index:1;pointer-events:none}

        /* Hero — 2 column layout */
        .hero-inner{position:relative;z-index:10;width:100%;max-width:1200px;display:flex;align-items:center;justify-content:space-between;gap:2rem}
        .h-left{flex:1;max-width:520px}
        .h-eyebrow{font-family:var(--mo);font-size:.65rem;color:rgba(0,232,122,.4);letter-spacing:3px;margin-bottom:1rem}
        .h-name{font-family:var(--bb);font-size:clamp(3.5rem,6vw,5.5rem);line-height:.9;letter-spacing:.03em;color:var(--text-d)}
        .h-name span{color:var(--green);text-shadow:0 0 30px rgba(0,232,122,.25)}
        .h-role{font-family:var(--mo);font-size:.72rem;color:var(--text-d2);letter-spacing:2px;margin-top:1rem;line-height:1.8}
        .h-desc{font-family:var(--dm);font-size:.88rem;color:var(--text-d3);line-height:1.9;margin-top:1rem;max-width:420px}
        .h-stats{display:flex;gap:2rem;margin-top:1.8rem}
        .hstat{display:flex;flex-direction:column;gap:.2rem}
        .hstat-n{font-family:var(--bb);font-size:1.8rem;color:var(--green);letter-spacing:.05em;line-height:1;text-shadow:0 0 15px rgba(0,232,122,.2)}
        .hstat-l{font-family:var(--mo);font-size:.58rem;color:var(--text-d3);letter-spacing:2px}
        .h-btns{display:flex;gap:.8rem;margin-top:2rem;flex-wrap:wrap}
        .hbtn-p{background:rgba(0,232,122,.1);border:1px solid rgba(0,232,122,.3);color:var(--green);padding:.65rem 1.6rem;border-radius:6px;font-family:var(--mo);font-size:.72rem;letter-spacing:2px;cursor:pointer;text-decoration:none;transition:.25s}
        .hbtn-p:hover{background:rgba(0,232,122,.18);box-shadow:0 0 20px rgba(0,232,122,.15);transform:translateY(-2px)}
        .hbtn-s{border:1px solid var(--text-d3);color:var(--text-d2);padding:.65rem 1.6rem;background:transparent;border-radius:6px;font-family:var(--mo);font-size:.72rem;letter-spacing:2px;cursor:pointer;text-decoration:none;transition:.25s}
        .hbtn-s:hover{border-color:var(--text-d2);color:var(--text-d);transform:translateY(-2px)}
        .h-right{flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center}
        .h-right canvas{width:380px;height:380px}
        .h-status-bar{position:absolute;bottom:2.5rem;left:2.5rem;z-index:20;display:flex;align-items:center;gap:.5rem;font-family:var(--mo);font-size:.62rem;color:var(--text-d3);letter-spacing:2px}
        .h-sdot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:pd 1.8s infinite;flex-shrink:0}
        .h-scroll-hint{position:absolute;bottom:2.5rem;right:2.5rem;z-index:20;font-family:var(--mo);font-size:.58rem;color:var(--text-d3);letter-spacing:3px;display:flex;flex-direction:column;align-items:center;gap:.5rem}
        .h-scroll-hint::after{content:'';width:1px;height:32px;background:linear-gradient(to bottom,rgba(200,240,220,.2),transparent)}
        @media(max-width:1100px){.hero-inner{flex-direction:column;text-align:center}.h-left{max-width:100%}.h-stats{justify-content:center}.h-btns{justify-content:center}.h-right canvas{width:280px;height:280px}.h-status-bar,.h-scroll-hint{display:none}}

        /* Marquee */
        .mq{background:var(--green);overflow:hidden;padding:13px 0;position:relative;z-index:50}
        .mq-t{display:flex;animation:mqa 22s linear infinite;white-space:nowrap}
        .mq-i{font-family:var(--bb);font-size:.82rem;letter-spacing:.28em;color:var(--ink);padding:0 40px;flex-shrink:0}
        .mq-sep{color:rgba(11,26,16,.3);flex-shrink:0;font-size:.7rem}
        @keyframes mqa{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

        /* Sections */
        .sec{padding:100px 52px;position:relative;z-index:10}
        .sec-dark{background:var(--ink)}
        .sec-mid{background:var(--forest)}
        .stag{display:flex;align-items:center;gap:14px;font-family:var(--mo);font-size:.72rem;letter-spacing:.22em;margin-bottom:56px;color:var(--green)}
        .stag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green);flex-shrink:0}
        .stag::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(0,232,122,.2),transparent)}
        .bh{font-family:var(--bb);font-size:clamp(3.5rem,6vw,7rem);line-height:.92;letter-spacing:.02em;color:var(--text-d)}
        .bh em{font-style:normal;color:var(--green)}

        /* About */
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .about-p{font-size:1rem;color:var(--text-d2);line-height:1.9;margin-bottom:16px;font-weight:300}
        .about-p strong{color:var(--text-d);font-weight:500}
        .hl{color:var(--green)}
        .quote-block{margin-top:36px;padding:24px 28px;background:var(--green3);border-left:2px solid rgba(0,232,122,.4);border-radius:0 10px 10px 0}
        .qb-rune{font-family:var(--mo);font-size:.58rem;color:var(--green);letter-spacing:.2em;margin-bottom:8px;opacity:.6}
        .qb-txt{font-size:.92rem;color:var(--text-d2);line-height:1.8;font-style:italic;font-weight:300}

        /* Terminal */
        .term{background:rgba(5,14,8,.9);border:1px solid rgba(0,232,122,.1);border-radius:14px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.5)}
        .t-bar{background:rgba(10,22,14,.9);padding:12px 20px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(0,232,122,.07)}
        .td{width:11px;height:11px;border-radius:50%}.tdr{background:#ff5f57}.tdy{background:#febc2e}.tdg{background:#28c840}
        .t-ttl{font-family:var(--mo);font-size:.62rem;color:var(--text-d3);margin-left:auto;margin-right:auto}
        .t-bod{padding:24px;font-family:var(--mo);font-size:.85rem;line-height:2.2}
        .tl2{display:flex;gap:10px;flex-wrap:wrap}
        .tp{color:var(--green)}.tc{color:#6ee7b7}.ts{color:var(--text-d3)}.tv{color:var(--text-d)}.tk{color:var(--amber)}.te{color:var(--red)}
        .tcur{display:inline-block;width:7px;height:.85em;background:var(--green);vertical-align:middle;animation:blink 1s infinite}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}

        /* Timeline */
        .tl-wrap{margin-top:48px;padding-left:20px;border-left:1px solid rgba(0,232,122,.1);position:relative}
        .tl-item2{margin-bottom:30px;position:relative;padding-left:20px}
        .tl-dot2{position:absolute;left:-29px;top:5px;width:10px;height:10px;border-radius:50%;border:1.5px solid var(--green);background:var(--ink)}
        .tl-yr2{font-family:var(--mo);font-size:.6rem;color:var(--green);letter-spacing:.12em;margin-bottom:5px;opacity:.7}
        .tl-ti2{font-family:var(--dm);font-size:.88rem;color:var(--text-d);font-weight:500;margin-bottom:4px}
        .tl-de2{font-size:.76rem;color:var(--text-d3);font-weight:300}

        /* Skills */
        .sk-intro{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:72px}
        .sk-desc{font-size:1rem;color:var(--text-d2);line-height:1.8;font-weight:300}
        .sk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,232,122,.06);border-radius:18px;overflow:hidden;margin-bottom:56px}
        .skc{background:var(--forest);padding:30px 26px;transition:all .4s;position:relative;overflow:hidden}
        .skc::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--green),transparent);transform:scaleX(0);transform-origin:left;transition:transform .4s}
        .skc:hover{background:rgba(0,232,122,.04);transform:translateY(-4px) scale(1.01)}
        .skc:hover::after{transform:scaleX(1)}
        .skc-ico{font-size:1.5rem;margin-bottom:14px;display:block}
        .skc-n{font-family:var(--bb);font-size:1.15rem;letter-spacing:.08em;color:var(--text-d);margin-bottom:8px}
        .skc-d{font-size:.88rem;color:var(--text-d2);line-height:1.6;margin-bottom:16px;font-weight:300}
        .skc-ts{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px}
        .skt{padding:4px 10px;border-radius:4px;font-family:var(--mo);font-size:.68rem;color:rgba(0,232,122,.7);border:1px solid rgba(0,232,122,.15);background:rgba(0,232,122,.04);letter-spacing:.04em}
        .skb{height:2px;background:rgba(255,255,255,.05);border-radius:1px;overflow:hidden}
        .skf{height:100%;background:linear-gradient(90deg,var(--green),rgba(0,232,122,.3));width:0;transition:width 1.4s cubic-bezier(.23,1,.32,1)}

        /* Tools scroll */
        .tscr{overflow:hidden;mask-image:linear-gradient(90deg,transparent,black 6%,black 94%,transparent);margin-bottom:14px}
        .ttrk{display:flex;gap:12px;animation:mqa 28s linear infinite;width:max-content}
        .ttrk2{animation-direction:reverse}
        .tpill{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;background:rgba(0,232,122,.04);border:1px solid rgba(0,232,122,.09);font-family:var(--mo);font-size:.75rem;color:var(--text-d3);white-space:nowrap;letter-spacing:.04em;flex-shrink:0;transition:all .3s}
        .tpill:hover{border-color:var(--green);color:var(--green)}

        /* Writeups */
        .wu-hero{padding:100px 52px;position:relative;overflow:hidden;background:var(--cream2);color:var(--text-l)}
        .wu-bg-num{position:absolute;right:-20px;top:-40px;font-family:var(--bb);font-size:clamp(14rem,22vw,26rem);color:rgba(26,46,32,.04);line-height:1;pointer-events:none;user-select:none;letter-spacing:-.05em}
        .wu-top{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:60px;position:relative;z-index:2}
        .wu-h{font-family:var(--bb);font-size:clamp(3.5rem,6vw,6.5rem);line-height:.92;letter-spacing:.02em;color:var(--text-l)}
        .wu-h em{font-style:normal;color:var(--sage)}
        .wu-hdesc{font-size:1rem;color:var(--text-l2);line-height:1.8;font-weight:300}

        .srch{position:relative;margin-bottom:14px}
        .sin{width:100%;padding:16px 50px;background:white;border:2px solid rgba(26,46,32,.1);border-radius:10px;font-family:var(--mo);font-size:.9rem;color:var(--text-l);outline:none;letter-spacing:.04em;transition:all .3s;box-shadow:0 2px 8px rgba(0,0,0,.04)}
        .sin:focus{border-color:var(--sage);box-shadow:0 0 0 4px rgba(42,96,72,.08)}
        .sin::placeholder{color:var(--text-l3)}
        .sico{position:absolute;left:18px;top:50%;transform:translateY(-50%);font-size:.85rem;color:var(--text-l3);pointer-events:none}
        .frow{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:48px;position:relative;z-index:2}
        .fb{padding:7px 18px;border-radius:20px;font-family:var(--mo);font-size:.72rem;border:1.5px solid rgba(26,46,32,.12);background:transparent;color:var(--text-l2);cursor:pointer;transition:all .3s;letter-spacing:.07em}
        .fb:hover{border-color:var(--sage);color:var(--sage)}
        .fb.on{background:var(--sage);border-color:var(--sage);color:white}

        .wug{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;position:relative;z-index:2}
        .wuc{background:white;border:1.5px solid rgba(26,46,32,.07);border-radius:16px;overflow:hidden;transition:all .4s cubic-bezier(.23,1,.32,1);box-shadow:0 2px 8px rgba(0,0,0,.04);text-decoration:none;display:block}
        .wuc:hover{transform:translateY(-8px);border-color:rgba(42,96,72,.2);box-shadow:0 24px 48px rgba(0,0,0,.1)}
        .wtop{height:148px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .wico{font-size:3.2rem;position:relative;z-index:1}
        .wtbg{position:absolute;inset:0}
        .wdiff{position:absolute;top:12px;right:12px;padding:4px 12px;border-radius:4px;font-family:var(--mo);font-size:.58rem;letter-spacing:.1em;font-weight:500}
        .de{background:rgba(42,96,72,.1);color:var(--sage);border:1px solid rgba(42,96,72,.25)}
        .dm{background:rgba(245,166,35,.1);color:var(--amber);border:1px solid rgba(245,166,35,.25)}
        .dh{background:rgba(240,79,90,.1);color:var(--red);border:1px solid rgba(240,79,90,.25)}
        .wplat{position:absolute;bottom:12px;left:12px;font-family:var(--mo);font-size:.56rem;color:var(--text-l3);background:rgba(242,237,228,.88);padding:3px 10px;border-radius:3px;letter-spacing:.08em}
        .wb{padding:20px}
        .wti{font-family:var(--dm);font-weight:600;font-size:1rem;color:var(--text-l);margin-bottom:7px}
        .wde{font-size:.85rem;color:var(--text-l2);line-height:1.55;margin-bottom:13px;font-weight:300;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .wtags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px}
        .wtag{padding:4px 10px;border-radius:3px;font-family:var(--mo);font-size:.68rem;background:rgba(42,96,72,.07);border:1px solid rgba(42,96,72,.14);color:var(--sage);letter-spacing:.04em}
        .wft{display:flex;align-items:center;justify-content:space-between}
        .wlnk{font-family:var(--mo);font-size:.75rem;color:var(--sage);text-decoration:none;display:flex;align-items:center;gap:4px;transition:gap .25s;font-weight:500}
        .wlnk:hover{gap:8px}

        /* Certs */
        .cert-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:64px}
        .cc{background:var(--pine);border:1px solid rgba(0,232,122,.08);border-radius:16px;padding:24px 20px;text-align:center;transition:all .4s;position:relative;overflow:hidden}
        .cc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:0;transition:opacity .3s}
        .cc:hover{transform:translateY(-6px);border-color:rgba(0,232,122,.2)}
        .cc:hover::after{opacity:1}
        .cc-ico{font-size:1.5rem;margin-bottom:12px;display:block}
        .cc-org{font-family:var(--mo);font-size:.54rem;color:rgba(0,232,122,.45);letter-spacing:.2em;margin-bottom:7px}
        .cc-n{font-family:var(--dm);font-size:.9rem;font-weight:500;color:var(--text-d);line-height:1.3}
        .ccs{display:inline-block;margin-top:10px;padding:3px 12px;border-radius:20px;font-family:var(--mo);font-size:.55rem;letter-spacing:.1em}
        .cs-d{background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.2);color:var(--green)}
        .cs-w{background:rgba(56,217,245,.08);border:1px solid rgba(56,217,245,.18);color:var(--blue)}
        .cs-p{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:var(--text-d3)}

        /* Roadmap */
        .rm-wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px}
        .rm-h{font-family:var(--bb);font-size:clamp(2.5rem,4vw,4.5rem);line-height:.95;letter-spacing:.02em;margin-bottom:10px}
        .rm-h em{font-style:normal;color:var(--green)}
        .rm-sub{font-size:.85rem;color:var(--text-d2);line-height:1.7;font-weight:300;margin-bottom:40px}
        .rm-steps{display:flex;flex-direction:column;gap:0}
        .rm-step{display:flex;gap:20px;padding:22px 0;border-bottom:1px solid rgba(0,232,122,.06)}
        .rm-step:last-child{border-bottom:none}
        .rm-n{font-family:var(--bb);font-size:2rem;color:rgba(0,232,122,.1);line-height:1;flex-shrink:0;width:46px}
        .rm-step.done .rm-n{color:var(--green)}
        .rm-step.cur .rm-n{color:rgba(0,232,122,.5)}
        .rm-b{flex:1}
        .rm-t{font-family:var(--dm);font-weight:600;font-size:.95rem;color:var(--text-d);margin-bottom:4px}
        .rm-step.done .rm-t{color:rgba(0,232,122,.8)}
        .rm-d{font-size:.82rem;color:var(--text-d3);font-weight:300}
        .rmbg{padding:4px 12px;border-radius:20px;font-family:var(--mo);font-size:.55rem;letter-spacing:.1em;flex-shrink:0;align-self:flex-start;margin-top:4px}
        .rbd{background:rgba(0,232,122,.07);border:1px solid rgba(0,232,122,.18);color:var(--green)}
        .rba{background:rgba(56,217,245,.07);border:1px solid rgba(56,217,245,.2);color:var(--blue);animation:agl 2s infinite}
        @keyframes agl{0%,100%{box-shadow:0 0 0 rgba(56,217,245,0)}50%{box-shadow:0 0 10px rgba(56,217,245,.3)}}
        .rbp{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:var(--text-d3)}

        /* Contact */
        .contact-sec{background:linear-gradient(160deg,var(--pine) 0%,var(--forest) 60%,var(--ink) 100%);padding:100px 52px;position:relative;overflow:hidden}
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:2}
        .c-h{font-family:var(--bb);font-size:clamp(3rem,5.5vw,6rem);line-height:.92;letter-spacing:.02em;margin-bottom:20px;color:var(--text-d)}
        .c-h em{font-style:normal;color:var(--green)}
        .c-desc{font-size:1rem;color:var(--text-d2);line-height:1.8;margin-bottom:36px;font-weight:300}
        .cbtns{display:flex;gap:12px;flex-wrap:wrap}
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:var(--green);color:var(--ink);font-family:var(--mo);font-size:.8rem;font-weight:500;letter-spacing:.1em;text-decoration:none;border-radius:6px;transition:all .3s;border:1.5px solid var(--green)}
        .bp:hover{background:transparent;color:var(--green);box-shadow:0 0 30px rgba(0,232,122,.2)}
        .bo{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;border:1.5px solid rgba(0,232,122,.25);color:var(--text-d2);font-family:var(--mo);font-size:.8rem;letter-spacing:.1em;text-decoration:none;border-radius:6px;transition:all .3s}
        .bo:hover{border-color:var(--green);color:var(--green)}
        .ccards{display:flex;flex-direction:column;gap:14px}
        .ccard{display:flex;align-items:center;gap:16px;padding:17px 22px;background:rgba(0,232,122,.04);border:1px solid rgba(0,232,122,.1);border-radius:12px;text-decoration:none;transition:all .4s;color:inherit}
        .ccard:hover{background:rgba(0,232,122,.08);border-color:rgba(0,232,122,.25);transform:translateX(6px)}
        .cc-ico2{width:40px;height:40px;border-radius:9px;background:rgba(0,232,122,.08);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
        .cc-inf{flex:1}
        .cc-lbl{font-family:var(--mo);font-size:.54rem;color:var(--text-d3);letter-spacing:.18em;margin-bottom:4px}
        .cc-val2{font-family:var(--dm);font-weight:600;font-size:.95rem;color:var(--green)}
        .cc-sub{font-family:var(--mo);font-size:.68rem;color:var(--text-d3);margin-top:2px}
        .cc-arr{color:var(--text-d3);font-family:var(--mo);font-size:.8rem;transition:all .3s}
        .ccard:hover .cc-arr{color:var(--green);transform:translateX(4px)}

        /* Footer */
        .draft-footer{background:var(--ink);padding:32px 52px;border-top:1px solid rgba(0,232,122,.07);display:flex;justify-content:space-between;align-items:center;position:relative}
        .draft-footer::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,var(--green),transparent)}
        .flogo{font-family:var(--bb);font-size:.95rem;letter-spacing:.3em;color:var(--green)}
        .fmid{font-family:var(--mo);font-size:.58rem;color:var(--text-d3);text-align:center;line-height:2;letter-spacing:.04em}
        .fmid span{color:var(--green)}
        .flinks2{display:flex;gap:20px}
        .flinks2 a{font-family:var(--mo);font-size:.58rem;color:var(--text-d3);text-decoration:none;letter-spacing:.08em;transition:color .3s}
        .flinks2 a:hover{color:var(--green)}

        /* Reveal */
        .rev{opacity:0;transform:translateY(36px);transition:opacity .85s cubic-bezier(.23,1,.32,1),transform .85s cubic-bezier(.23,1,.32,1)}
        .revr{opacity:0;transform:translateX(36px);transition:opacity .85s cubic-bezier(.23,1,.32,1),transform .85s cubic-bezier(.23,1,.32,1)}
        .rev.v,.revr.v{opacity:1;transform:none}
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}.d5{transition-delay:.5s}

        /* Responsive */
        @media(max-width:1100px){
          .about-grid,.sk-intro,.rm-wrap,.contact-grid,.wu-top{grid-template-columns:1fr}
          .cert-grid{grid-template-columns:repeat(2,1fr)}
          .sec{padding:80px 28px}
          .wu-hero,.contact-sec{padding:80px 28px}
          .draft-hero{padding:80px 28px}
          .dnav{padding:18px 28px}
        }
        @media(max-width:640px){
          .draft-hero{padding:90px 20px 70px}
          .sec,.wu-hero,.contact-sec{padding:60px 20px}
          .wug,.sk-grid{grid-template-columns:1fr}
          .cert-grid{grid-template-columns:repeat(2,1fr)}
          .draft-footer{flex-direction:column;gap:14px;text-align:center;padding:28px 20px}
        }
      `}</style>

      {/* NAV */}
      <nav className="dnav" id="main-nav">
        <a href="#home" className="nlogo">
          <div>
            <span className="nlogo-h">HEINDALL</span>
            <div className="nlogo-s">RED TEAM // OFFENSIVE SEC</div>
          </div>
        </a>
        <ul className="nlinks">
          <li><a href="#about">about</a></li>
          <li><a href="#skills">skills</a></li>
          <li><a href="#writeups">writeups</a></li>
          <li><a href="#certs">certs</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
        <button className="nmobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? <X size={28} /> : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {mobileNavOpen && (
        <div className="nmobile-overlay">
          <button style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", color: "var(--green)", cursor: "pointer" }} onClick={() => setMobileNavOpen(false)}>
            <X size={28} />
          </button>
          {["about", "skills", "writeups", "certs", "contact"].map((s) => (
            <a key={s} href={`#${s}`} onClick={() => setMobileNavOpen(false)}>{s}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="draft-hero" id="home" ref={heroRef}>
        <div className="h-bg" />
        <div className="h-bg-grid" />
        <canvas ref={particlesRef} className="h-particles" />

        <div className="hero-inner rev">
          {/* LEFT — Text */}
          <div className="h-left">
            <div className="h-eyebrow">// RED TEAM OPERATOR · SEGURIDAD OFENSIVA</div>
            <div className="h-name">
              YOANDY<br />
              <span>RAMÍREZ</span><br />
              DELGADO
            </div>
            <div className="h-role">Junior Security Analyst &nbsp;·&nbsp; Pentester &nbsp;·&nbsp; eJPTv2 Certified</div>
            <div className="h-desc">Ethical Hacking | Offensive Cybersecurity | Máster en Ciberseguridad & IA — Evolve Academy 2026.</div>
            <div className="h-stats">
              <div className="hstat"><div className="hstat-n">{counter}+</div><div className="hstat-l">MÁQUINAS</div></div>
              <div className="hstat"><div className="hstat-n">8</div><div className="hstat-l">HTB LVL</div></div>
              <div className="hstat"><div className="hstat-n">✓</div><div className="hstat-l">eJPTv2</div></div>
              <div className="hstat"><div className="hstat-n">4+</div><div className="hstat-l">AÑOS EXP</div></div>
            </div>
            <div className="h-btns">
              <a href="#writeups" className="hbtn-p">VER WRITEUPS</a>
              <a href="#contact" className="hbtn-s">CONTACTO</a>
            </div>
          </div>
          {/* RIGHT — Orb Canvas */}
          <div className="h-right">
            <canvas ref={orbRef} />
          </div>
        </div>
        <div className="h-status-bar"><div className="h-sdot" />OPEN TO WORK · LEPE, HUELVA 🇪🇸</div>
        <div className="h-scroll-hint">SCROLL</div>
      </section>

      {/* MARQUEE */}
      <div className="mq">
        <div className="mq-t">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>
              <span className="mq-i">{item}</span>
              <span className="mq-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="sec sec-dark">
        <div className="stag rev">01 // SOBRE HEINDALL</div>
        <div className="about-grid">
          <div>
            <h2 className="bh rev d1" style={{ marginBottom: 28 }}>Sobre <em>Mí</em></h2>
            <p className="about-p rev d2"><strong>4 años rompiendo sistemas</strong> — primero por accidente, ahora por metodología. Vengo de IT: redes, hardware, sistemas. Cuando descubrí que podía aplicar ese conocimiento para encontrar lo que otros no ven, no volví atrás.</p>
            <p className="about-p rev d3">Hoy construyo desde <strong>Lepe, Huelva</strong>: pentesting en <span className="hl">HTB/THM</span>, automatización de recon con <strong>Python y Bash</strong>, y herramientas propias bajo el alias <strong>Heindall</strong>. <strong>eJPTv2</strong> certificado. Máster en Ciberseguridad &amp; IA en curso (Evolve Academy, 2026).</p>
            <p className="about-p rev d4">Busco mi primer rol en <strong>seguridad ofensiva</strong>. No traigo años de empresa — traigo <strong>45+ máquinas comprometidas</strong>, herramientas publicadas, y documentación que demuestra cómo pienso.</p>
            <div className="quote-block rev d5">
              <div className="qb-rune">💡 OBJETIVO PROFESIONAL</div>
              <p className="qb-txt"><strong>Red Team Junior / Junior Pentester.</strong> Quiero unirme a un equipo donde pueda comprometer sistemas reales, escribir sobre lo que encuentro, y seguir aprendiendo en producción. Disponible para contratos, prácticas remuneradas o posición junior. Lepe, Huelva — abierto a remoto.</p>
            </div>
          </div>
          <div>
            <div className="term revr d1">
              <div className="t-bar"><div className="td tdr" /><div className="td tdy" /><div className="td tdg" /><span className="t-ttl">heindall@kali:~$</span></div>
              <div className="t-bod">
                <div className="tl2"><span className="tp">❯ </span><span className="tc">cat</span><span className="ts"> ~/.heindall/identity</span></div>
                <div className="tl2"><span className="tk">alias  :</span><span className="tv"> Heindall · Red Team Operator</span></div>
                <div className="tl2"><span className="tk">role   :</span><span className="tv"> Offensive Security Specialist</span></div>
                <div className="tl2"><span className="tk">base   :</span><span className="tv"> Lepe, Huelva, Spain</span></div>
                <div className="tl2"><span className="tk">os     :</span><span className="tv"> Kali Linux 2024.x</span></div>
                <div className="tl2"><span className="tk">tools  :</span><span className="tv"> Metasploit · Burp · Nmap · SQLMap</span></div>
                <div className="tl2">&nbsp;</div>
                <div className="tl2"><span className="tp">❯ </span><span className="tc">nmap</span><span className="ts"> -A -sV -p- target.htb</span></div>
                <div className="tl2"><span style={{ color: "var(--green)" }}>22/tcp  </span><span className="ts">open </span><span className="tv">ssh OpenSSH 9.2</span></div>
                <div className="tl2"><span style={{ color: "var(--green)" }}>80/tcp  </span><span className="ts">open </span><span className="tv">http Apache 2.4.57</span></div>
                <div className="tl2"><span className="te">[!] SQLi on /api/auth — exploiting...</span></div>
                <div className="tl2"><span className="tp">❯ </span><span className="tcur" /></div>
              </div>
            </div>
            <div className="tl-wrap revr d2">
              <div className="tl-item2"><div className="tl-dot2" /><div className="tl-yr2">2025 — HOY</div><div className="tl-ti2">Master Ciberseguridad & AI</div><div className="tl-de2">Evolve Academy · eJPTv2 Certified ✓</div></div>
              <div className="tl-item2"><div className="tl-dot2" /><div className="tl-yr2">2024</div><div className="tl-ti2">HTB Academy · Full Path Completado</div><div className="tl-de2">Jr. Cybersecurity Analyst · Google · IBM · Cisco certs</div></div>
              <div className="tl-item2"><div className="tl-dot2" /><div className="tl-yr2">2020+</div><div className="tl-ti2">IT Specialist · 4+ años</div><div className="tl-de2">Redes · Sistemas · Automatización</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="sec sec-mid">
        <div className="stag rev">02 // ARSENAL OFENSIVO</div>
        <div className="sk-intro">
          <h2 className="bh rev d1">Arsenal<br /><em>Táctico</em></h2>
          <p className="sk-desc rev d2">El toolkit de Heindall — herramientas dominadas en CTFs, labs y pentests reales. Cada vector de ataque documentado y probado.</p>
        </div>
        <div className="sk-grid">
          {skills.map((s) => (
            <div className="skc rev" key={s.name}>
              <span className="skc-ico">{s.ico}</span>
              <div className="skc-n">{s.name}</div>
              <div className="skc-d">{s.desc}</div>
              <div className="skc-ts">
                {s.tags.map((t) => <span className="skt" key={t}>{t}</span>)}
              </div>
              <div className="skb"><div className="skf" data-w={s.pct} /></div>
            </div>
          ))}
        </div>
        <div className="tscr rev">
          <div className="ttrk">
            {[...toolsRow1, ...toolsRow1].map((t, i) => <span className="tpill" key={i}>{t}</span>)}
          </div>
        </div>
        <div className="tscr" style={{ marginTop: 12 }}>
          <div className="ttrk ttrk2">
            {[...toolsRow2, ...toolsRow2].map((t, i) => <span className="tpill" key={i}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* WRITEUPS */}
      <section id="writeups" className="wu-hero">
        <div className="wu-bg-num">03</div>
        <div className="wu-top">
          <h2 className="wu-h rev d1">Brechas<br /><em>Documentadas</em></h2>
          <p className="wu-hdesc rev d2">Cada máquina comprometida con metodología completa. Busca por técnica, plataforma o dificultad.</p>
        </div>
        <div className="srch rev">
          <input
            type="text"
            className="sin"
            placeholder="SQLi · JWT · LFI · Windows · RCE · HTB · Easy ..."
            value={search}
            onChange={(e) => setSearch(sanitizeSearch(e.target.value))}
          />
          <span className="sico">🔍</span>
        </div>
        <div className="frow rev d1">
          {[
            { key: "all", label: "Todos" },
            { key: "htb", label: "HackTheBox" },
            { key: "sherlock", label: "Sherlocks" },
            { key: "hmv", label: "HackMyVM" },
            { key: "thl", label: "The Hacker Labs" },
            { key: "thm", label: "TryHackMe" },
            { key: "cert", label: "Certs" },
            { key: "easy", label: "Easy" },
            { key: "medium", label: "Medium" },
            { key: "hard", label: "Hard" },
          ].map((f) => (
            <button key={f.key} className={`fb ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="wug">
          {filtered.map((w) => {
            const bgGrad = w.platform === "HTB"
              ? "linear-gradient(135deg,#041810,#07281a)"
              : w.platform === "Sherlock"
              ? "linear-gradient(135deg,#12051e,#200838)"
              : w.platform === "Cert"
              ? "linear-gradient(135deg,#0a1628,#0d2040)"
              : w.platform === "THL"
              ? "linear-gradient(135deg,#1a1005,#2d1a08)"
              : "linear-gradient(135deg,#1a0808,#350d0d)";
            const Wrapper = w.type === "cert" ? "div" : Link;
            const wrapperProps = w.type === "cert" ? { className: "wuc", key: w.slug } : { to: `/report/${w.slug}`, className: "wuc", key: w.slug };
            return (
              <Wrapper {...(wrapperProps as any)}>
                <div className="wtop">
                  <div className="wtbg" style={{ background: bgGrad }} />
                  <span className="wico">{w.emoji}</span>
                  <span className={`wdiff ${diffClass(w.difficulty)}`}>{diffLabel(w.difficulty)}</span>
                  <span className="wplat">{w.platform}</span>
                </div>
                <div className="wb">
                  <div className="wti">{w.name}</div>
                  <div className="wde">{w.desc}</div>
                  <div className="wtags">
                    {w.tags.slice(0, 4).map((t) => <span className="wtag" key={t}>{t}</span>)}
                  </div>
                  {w.type !== "cert" && (
                    <div className="wft">
                      <span className="wlnk">Leer writeup →</span>
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, fontFamily: "var(--mo)", fontSize: ".8rem", color: "var(--text-l3)" }}>
            <span style={{ display: "block", fontSize: "2rem", marginBottom: 10 }}>🔍</span>
            Sin resultados — prueba: linux · sqli · jwt · htb...
          </div>
        )}
      </section>

      {/* CERTS */}
      <section id="certs" className="sec sec-dark">
        <div className="stag rev">04 // CERTIFICATIONS & ROADMAP</div>
        <div className="cert-grid">
          {certifications.map((c, i) => (
            <div className={`cc rev ${i > 0 ? `d${Math.min(i, 5)}` : ""}`} key={c.name}>
              <span className="cc-ico">{c.ico}</span>
              <div className="cc-org">{c.org}</div>
              <div className="cc-n">{c.name}</div>
              <span className={`ccs ${c.statusClass}`}>{c.status}</span>
            </div>
          ))}
        </div>
        <div className="rm-wrap">
          <div>
            <h3 className="rm-h rev d1">Roadmap<br /><em>Offensive</em></h3>
            <p className="rm-sub rev d2">La ruta de Heindall hacia las certificaciones élite del offensive security.</p>
          </div>
          <div className="rm-steps">
            {roadmap.map((r) => (
              <div className={`rm-step ${r.status} rev`} key={r.n}>
                <div className="rm-n">{r.n}</div>
                <div className="rm-b"><div className="rm-t">{r.title}</div><div className="rm-d">{r.desc}</div></div>
                <span className={`rmbg ${r.badgeClass}`}>{r.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-sec">
        <div className="contact-grid">
          <div>
            <div className="stag rev" style={{ marginBottom: 36 }}>05 // CONTACT</div>
            <h2 className="c-h rev d1">¿Comenzamos<br />la <em>Operación</em>?</h2>
            <p className="c-desc rev d2">Disponible para roles en Pentesting y Red Team, colaboraciones técnicas y proyectos de ciberseguridad.</p>
            <div className="cbtns rev d3">
              <a href="https://www.linkedin.com/in/yoandyrd92/" className="bp" target="_blank" rel="noopener noreferrer">Contactar en LinkedIn</a>
              <a href="https://github.com/heindall92" className="bo" target="_blank" rel="noopener noreferrer">Ver GitHub →</a>
            </div>
          </div>
          <div className="ccards">
            {socialLinks.map((s, i) => (
              <a href={s.href} className={`ccard revr d${i + 1}`} key={s.label} target="_blank" rel="noopener noreferrer">
                <div className="cc-ico2">{s.ico}</div>
                <div className="cc-inf">
                  <div className="cc-lbl">{s.label}</div>
                  <div className="cc-val2">{s.val}</div>
                  <div className="cc-sub">{s.sub}</div>
                </div>
                <span className="cc-arr">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="draft-footer">
        <span className="flogo">HEINDALL</span>
        <div className="fmid">
          <div>© 2025 Yoandy Ramírez Delgado · Alias <span>Heindall</span> · Lepe, España</div>
          <div style={{ fontSize: ".5rem", marginTop: 3, opacity: .4 }}>Todo el contenido es para fines educativos y entornos autorizados ⚠️</div>
        </div>
        <div className="flinks2">
          <a href="https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa" target="_blank" rel="noopener noreferrer">HTB</a>
          <a href="https://www.linkedin.com/in/yoandyrd92/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/heindall92" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="/privacy">Privacidad</a>
          <a href="/legal">Aviso Legal</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
