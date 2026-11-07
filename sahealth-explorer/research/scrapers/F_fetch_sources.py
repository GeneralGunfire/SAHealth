"""Phase F scraper: fetch public pages, extract text, save under F_out/, print keyword hits."""
import requests, re, sys, time, pathlib
from bs4 import BeautifulSoup
OUT = pathlib.Path(__file__).parent / "F_out"; OUT.mkdir(exist_ok=True)
H = {"User-Agent": "Mozilla/5.0 (research; SAHealth DEXA)"}
URLS = {
 "dhis2_dv": "https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/data.html",
 "dhis2_meta": "https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-241/metadata.html",
 "popia_s32": "https://popia.co.za/section-32-authorisation-for-processing-of-personal-information-concerning-a-data-subjects-health-or-sex-life/",
 "popia_s26": "https://popia.co.za/section-26-prohibition-on-processing-of-special-personal-information/",
 "popia_s22": "https://popia.co.za/section-22-notification-of-security-compromises/",
 "popia_s34": "https://popia.co.za/section-34-prohibition-on-processing-of-personal-information-of-children/",
 "nha_pdf": "https://www.gov.za/sites/default/files/gcis_document/201409/a61-03.pdf",
 "nhi_act": "https://www.gov.za/documents/national-health-insurance-act-20-2023-16-may-2024-0000",
 "ir_enforce": "https://inforegulator.org.za/enforcement-notices/",
 "cima_idnum": "https://www.dha.gov.za/index.php/civic-services/identity-document",
 "nappi_discovery": "https://cdn.discovery.co.za/wcm/discoverycoza/assets/health_professionals/propbm-communiques/nappi-code-registration-and-review-process.pdf",
 "ndoh_projectathon_pdf": "https://ndohwebsite.azurewebsites.net/wp-content/uploads/2026/01/Health-Department-leads-first-Digital-Health-Interoperability-Projectathon.pdf",
 "cms_annual": "https://www.medicalschemes.co.za/annual-reports/",
}
def get(name, url):
    try:
        r = requests.get(url, headers=H, timeout=40)
        ct = r.headers.get("content-type", "")
        if "html" in ct:
            s = BeautifulSoup(r.text, "html.parser")
            for t in s(["script", "style", "nav", "footer"]): t.decompose()
            txt = re.sub(r"\n\s*\n+", "\n", s.get_text("\n"))
        else:
            txt = f"[non-html {ct} {len(r.content)} bytes]"
            (OUT / f"{name}.bin").write_bytes(r.content)
        (OUT / f"{name}.txt").write_text(txt, encoding="utf-8")
        print(name, r.status_code, len(txt))
    except Exception as e:
        print(name, "ERR", e)
if __name__ == "__main__":
    for n, u in URLS.items():
        get(n, u); time.sleep(2)
