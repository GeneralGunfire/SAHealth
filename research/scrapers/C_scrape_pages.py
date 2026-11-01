import requests, time, re, sys, os
from bs4 import BeautifulSoup
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
URLS = {
 "snomed": "https://www.snomed.org/news/major-milestone-for-africa:-south-africa-adopts-snomed-ct-to-drive-digital-health-transformation",
 "icd10mit": "https://health.gov.za/icd-10-master-industry-table",
 "gazette314": "https://www.gov.za/sites/default/files/gcis_document/201409/37583gen314.pdf",
 "dhlomo2023": "https://www.gov.za/speeches/deputy-minister-sibongiseni-dhlomo-health-dept-budget-vote-202324-9-may-2023-0000",
 "budget2026": "https://www.health.gov.za/wp-content/uploads/2026/05/Health-Ministry-to-table-Budget-Vote-2026.pdf",
 "pmg_nw4495": "https://pmg.org.za/committee-question/31734/",
 "pmg_nw342": "https://pmg.org.za/committee-question/13607/",
 "pmg_nw1901": "https://pmg.org.za/committee-question/27410/",
 "pmg_nw6570": "https://pmg.org.za/committee-question/34165/",
 "ghsc_svs": "https://www.ghsupplychain.org/stock-visibility-system-technical-brief",
 "motsoaledi_bv2025": "https://www.gov.za/news/speeches/minister-aaron-motsoaledi-health-dept-budget-vote-202526-09-jul-2025",
 "phaahla_bv2025": "https://www.gov.za/news/speeches/deputy-minister-joe-phaahla-health-dept-budget-vote-202526-09-jul-2025",
 "nhls_stats": "https://allafrica.com/stories/202511270045.html",
 "evds_businesstech": "https://businesstech.co.za/news/technology/570912/government-to-keep-covid-database-going-permanently-with-plans-to-expand-it/",
}
H = {"User-Agent": "Mozilla/5.0 (research; DEXA SAHealth)"}
for k,u in URLS.items():
    try:
        r = requests.get(u, headers=H, timeout=60)
        if u.endswith(".pdf"):
            open(f"{OUT}/{k}.pdf","wb").write(r.content); print(k, r.status_code, "pdf", len(r.content))
        else:
            s = BeautifulSoup(r.text, "html.parser")
            for t in s(["script","style","nav","footer"]): t.decompose()
            txt = re.sub(r"\n\s*\n+","\n", s.get_text("\n"))
            open(f"{OUT}/{k}.txt","w",encoding="utf-8").write(txt); print(k, r.status_code, len(txt))
    except Exception as e:
        print(k, "ERR", e)
    time.sleep(2)
