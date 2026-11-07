"""Phase F scraper 3: download large PDFs and extract text with pypdf; print keyword hits."""
import requests, io, pathlib, re, sys, time, pypdf
OUT = pathlib.Path(__file__).parent / "F_out"
H = {"User-Agent": "Mozilla/5.0 (research; SAHealth DEXA)"}
URLS = {
 "dhb_2024_25": "https://knowledgehub.health.gov.za/system/files/2026-04/DHB_2024-25_Launch%20Presentation.pdf",
 "agsa_health_2026": "https://static.pmg.org.za/261001AGs_2025-26_BRRR_slides_-_Health_sector_-_1_October_2026.pdf",
 "nhls_ar_2022_23": "https://pmg.org.za/files/NHLS_Annual_Report_2022-23.pdf",
 "cms_ar_2526": "https://static.pmg.org.za/CMS_2025-26_AR.pdf",
 "inforeg_media_jun2026": "https://inforegulator.org.za/wp-content/uploads/2026/06/MEDIA-STATEMENT-INFORMATION-REGULATOR-ISSUES-ENFORCEMENT-NOTICES-FOR-THE-CONTRAVENTIONS-OF-POPIA-AND-PAIA-BY-PUBLIC-AND-PRIVATE-BODIES.pdf",
 "dischem_notice": "https://inforegulator.org.za/wp-content/uploads/2020/07/DIS-CHEM-ENFORCEMENT-NOTICE.pdf",
 "nappi_disc": "https://cdn.discovery.co.za/wcm/discoverycoza/assets/health_professionals/propbm-communiques/nappi-code-registration-and-review-process.pdf",
}
for n, u in URLS.items():
    try:
        r = requests.get(u, headers=H, timeout=90)
        rd = pypdf.PdfReader(io.BytesIO(r.content))
        t = "\n".join((p.extract_text() or "") for p in rd.pages[:80])
        (OUT / f"{n}.txt").write_text(t, encoding="utf-8")
        print(n, r.status_code, len(rd.pages), len(t), flush=True)
    except Exception as e:
        print(n, "ERR", repr(e)[:150], flush=True)
    time.sleep(2)
