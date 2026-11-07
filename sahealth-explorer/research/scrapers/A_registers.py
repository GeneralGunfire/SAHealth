"""Probe public lookup pages of statutory councils and record what the HTML exposes (forms, fields)."""
from bs4 import BeautifulSoup
from A_common import get, save
URLS = {
 "hpcsa_iregister": "https://hpcsaonline.custhelp.com/app/i_register",
 "sapc_find": "https://www.pharmcouncil.co.za/",
 "sanc_home": "https://www.sanc.co.za/",
 "cms_home": "https://www.medicalschemes.co.za/",
 "bhf_home": "https://www.bhfglobal.com/",
 "ohsc_pubs": "https://ohsc.org.za/publications-report-2/",
}
rep = []
for k, u in URLS.items():
    try:
        h = get(u, 2.5)
        s = BeautifulSoup(h, "html.parser")
        forms = [(f.get("action"), [i.get("name") for i in f.find_all(["input","select"])]) for f in s.find_all("form")]
        links = [a["href"] for a in s.find_all("a", href=True) if any(x in a["href"].lower() for x in ("regist","annual","list","search","pdf"))][:40]
        rep.append(f"## {k} {u}\ntitle={s.title.string if s.title else None}\nforms={forms}\nlinks={links}\n")
        print(k, "ok", len(h))
    except Exception as e:
        rep.append(f"## {k} {u}\nERROR {e}\n"); print(k, "ERR", e)
save("A_registers_probe.txt", "\n".join(rep))
