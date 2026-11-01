"""B_treasury_epre.py: for each province find the Health vote EPRE PDF (2026) on archive.treasury.gov.za, save text, print facility/IT lines."""
import sys, re, io, time, requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, quote
from pypdf import PdfReader
H={"User-Agent":"SAHealth-research/1.0"}
base="https://archive.treasury.gov.za/documents/provincial%20budget/2026/3.%20Estimates%20of%20Provincial%20Revenue%20and%20Expenditure/"
out=sys.argv[1]
KW=re.compile(r"(e-?health|electronic|information system|HIS\b|HMS|Meditech|Clinicom|PHCIS|EMR|HPRS|connectivity|broadband|digitis|digitali|scann|district hospitals?|regional hospitals?|tertiary hospitals?|central hospitals?|specialised|\d+\s+clinics|community health cent|ideal clinic|ICT)",re.I)
for prov in ["Eastern Cape","Free State","Gauteng","Limpopo","Mpumalanga","North West","Northern Cape","Western Cape"]:
    try:
        u=base+prov.replace(" ","%20")+"/Default.aspx"
        s=BeautifulSoup(requests.get(u,headers=H,timeout=60).text,"html.parser")
        pdfs=[(a.get_text(strip=True),urljoin(u,a["href"])) for a in s.find_all("a",href=True) if a["href"].lower().endswith(".pdf")]
        h=[p for p in pdfs if re.search(r"health",p[0]+p[1],re.I)]
        print("##",prov,[p[0] for p in h][:3])
        if not h: continue
        pu=h[0][1].replace(" ","%20")
        rd=PdfReader(io.BytesIO(requests.get(pu,headers=H,timeout=180).content))
        txt="\n".join(p.extract_text() or "" for p in rd.pages)
        fn=f"{out}/epre26_{prov.replace(' ','_')}.txt"; open(fn,"w",encoding="utf-8").write(txt)
        print("  pdf",pu,len(rd.pages),"pages")
        n=0
        for l in txt.split("\n"):
            if KW.search(l) and not re.search(r"\d{3}\s+\d{3}",l):
                print("   ",l.strip()[:230]); n+=1
                if n>45: break
    except Exception as e: print("ERR",prov,e)
    time.sleep(3)
