"""Phase F scraper 2: fetch statute pages and PDFs (pypdf for PDFs), save text, print keyword windows."""
import requests, re, pathlib, time, io
from bs4 import BeautifulSoup
OUT = pathlib.Path(__file__).parent / "F_out"
H = {"User-Agent": "Mozilla/5.0 (research; SAHealth DEXA)"}
URLS = {
 "nha_s14": "https://www.acts.co.za/national_health/14__confidentiality.php",
 "nha_s15": "https://www.acts.co.za/national_health/15__access_to_health_records",
 "nha_s16": "https://www.acts.co.za/national_health/16__use_of_health_records_for_study_teaching_or_research",
 "nha_s17": "https://www.acts.co.za/national_health/17__protection_of_health_records",
 "nha_s13": "https://www.acts.co.za/national_health/13__health_records",
 "nha_s74": "https://www.acts.co.za/national_health/74__national_health_information_system",
 "booklet9": "https://www.hpcsa-blogs.co.za/wp-content/uploads/2022/08/Booklet-9-Guidelines-on-Patient-Records.pdf",
 "booklet9_2022": "https://www.hpcsa-blogs.co.za/wp-content/uploads/2022/11/Booklet-9-Keeping-of-Patient-Records_Review-Draft_-FINAL_Sept-2022.pdf",
 "ijpds_phdc": "https://ijpds.org/article/view/1143",
 "popia_s27": "https://popia.co.za/section-27-general-authorisation-concerning-special-personal-information/",
 "popia_s32b": "https://popia.co.za/section-32-authorisation-concerning-data-subjects-health-or-sex-life/",
 "popia_s35": "https://popia.co.za/section-35-general-authorisation-concerning-personal-information-of-children/",
 "popia_s34b": "https://popia.co.za/section-34-prohibition-on-processing-of-personal-information-of-children/",
 "popia_s109": "https://popia.co.za/section-109-administrative-fines/",
 "popia_s107": "https://popia.co.za/section-107-penalties/",
 "ir_media_jun2026": "https://inforegulator.org.za/wp-content/uploads/2026/06/MEDIA-STATEMENT-INFORMATION-REGULATOR-ISSUES-ENFORCEMENT-NOTICES-FOR-THE-CONTRAVENTIONS-OF-POPIA-AND-PAIA-BY-PUBLIC-AND-PRIVATE-BODIES.pdf",
 "pmg_hprs": "https://pmg.org.za/committee-question/31749/",
 "cms_ar2526": "https://static.pmg.org.za/CMS_2025-26_AR.pdf",
 "ndoh_projectathon": "https://ndohwebsite.azurewebsites.net/wp-content/uploads/2026/01/Health-Department-leads-first-Digital-Health-Interoperability-Projectathon.pdf",
}
def txt_of(r):
    ct = r.headers.get("content-type", "")
    if "pdf" in ct or r.url.lower().endswith(".pdf"):
        try:
            import pypdf
            rd = pypdf.PdfReader(io.BytesIO(r.content))
            return "\n".join((p.extract_text() or "") for p in rd.pages[:120])
        except Exception as e:
            return f"[pdf parse fail {e}]"
    s = BeautifulSoup(r.text, "html.parser")
    for t in s(["script", "style", "nav", "footer"]): t.decompose()
    return re.sub(r"\n\s*\n+", "\n", s.get_text("\n"))
for n, u in URLS.items():
    try:
        r = requests.get(u, headers=H, timeout=60)
        t = txt_of(r)
        (OUT / f"{n}.txt").write_text(t, encoding="utf-8")
        print(n, r.status_code, len(t))
    except Exception as e:
        print(n, "ERR", e)
    time.sleep(2)
