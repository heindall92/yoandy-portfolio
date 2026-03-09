#!/bin/bash

# ==============================================================
# INSTALL SKILLS - Claude Code Skills Installer
# Instala todos los skills en ~/.claude/skills/ para Kali Linux
# Uso: bash install-skills.sh
# ==============================================================

SKILLS_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMANDS_DIR="$SCRIPT_DIR/.claude/commands"

echo "=============================================="
echo "  Claude Code Skills Installer"
echo "  Destino: $SKILLS_DIR"
echo "=============================================="

# Crear directorio si no existe
mkdir -p "$SKILLS_DIR"
echo "[OK] Directorio $SKILLS_DIR listo"

# Lista de skills a instalar
SKILLS=(
  "pentest"
  "redteam"
  "blueteam"
  "purpleteam"
  "htb-thm"
  "osint"
  "phd-cyber"
  "phd-redteam"
  "pentest-report"
  "dev"
  "appdev"
  "it"
  "llm-ai"
  "informe"
  "negocios"
  "linkedin"
  "socialposts"
  "psicologo"
  "seduccion"
  "comportamiento"
  "mecanico"
  "pintor"
  "albanil"
)

# Copiar cada skill
INSTALLED=0
FAILED=0

for skill in "${SKILLS[@]}"; do
  src="$COMMANDS_DIR/${skill}.md"
  dst="$SKILLS_DIR/${skill}.md"

  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "[OK] $skill"
    INSTALLED=$((INSTALLED + 1))
  else
    echo "[!!] No encontrado: $skill.md"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "=============================================="
echo "  Instalados: $INSTALLED / ${#SKILLS[@]} skills"
if [ "$FAILED" -gt 0 ]; then echo "  Fallidos:    $FAILED skills"; fi
echo "=============================================="
echo ""
echo "Skills disponibles en Claude CLI:"
echo ""
echo "  HACKING & CYBER:"
echo "  /pentest        - Pentesting profesional (PTES/OWASP)"
echo "  /redteam        - Red Team operaciones APT (MITRE ATT&CK)"
echo "  /blueteam       - Blue Team, SOC & Incident Response"
echo "  /purpleteam     - Ejercicios Purple Team colaborativos"
echo "  /htb-thm        - HackTheBox & TryHackMe (CTF)"
echo "  /osint          - OSINT Intelligence Analyst"
echo "  /phd-cyber      - PhD Ciberseguridad academico"
echo "  /phd-redteam    - PhD Red Team investigacion avanzada"
echo "  /pentest-report - Generador de informes profesionales"
echo ""
echo "  DESARROLLO & IT:"
echo "  /dev            - Developer Seguro Full Stack"
echo "  /appdev         - Full Stack Web/Movil/Apps"
echo "  /it             - IT Infraestructura & Soporte"
echo "  /llm-ai         - LLMs & Sistemas de IA"
echo "  /informe        - Redactor de Informes Profesionales"
echo ""
echo "  NEGOCIOS & SOCIAL:"
echo "  /negocios       - Estrategia Empresarial & Startups"
echo "  /linkedin       - LinkedIn Expert & Recruiter"
echo "  /socialposts    - Creador de Posts Redes Sociales"
echo ""
echo "  OTROS:"
echo "  /psicologo      - Psicologo Clinico & Organizacional"
echo "  /seduccion      - Atraccion & Conexion Genuina"
echo "  /comportamiento - Analisis de Comportamiento Humano"
echo "  /mecanico       - Mecanico Experto Automotriz"
echo "  /pintor         - Pintor Decorativo & Industrial"
echo "  /albanil        - Maestro Albanil & Construccion"
echo ""
echo "Reinicia Claude CLI para cargar los skills."
