"""D round 2: targeted polite fetch of known official/vendor pages; saves text and prints size/status."""
import sys, time, pathlib, re, requests
from bs4 import BeautifulSoup
URLS = {
 "cms_icd10": "https://www.medicalschemes.com/medical_schemes_pmb/ICD-10_codes.htm",
 "cms_circ34_2013": "https://www.medicalschemes.com/files/Circulars/Circular34Of2013.pdf",
 "doh_mit": "https://health.gov.za/icd-10-master-industry-table",
 "sama_icd10": "https://samedical.org/private-health/icd_10",
 "sama_coding_faq": "https://samedical.org/private-health/coding_faqs",
 "sama_ccsa": "https://samedical.org/private-health/ccsa_complete_cpt_for_south_africa",
 "pcns_home": "https://www.pcns.co.za/",
 "phisc_about": "https://www.phisc.net/about-us",
 "phisc_home": "https://www.phisc.net/",
 "goodx_about": "https://goodx.co.za/about-us/",
 "altron_about": "https://healthtech.altron.com/about-us",
 "healthbridge": "https://healthbridge.co.za/",
 "netcare911": "https://www.netcare.co.za/netcare-911/our-services",
 "netcare911_20y": "https://www.netcare.co.za/NewsHub/Articles/netcare-911-celebrates-providing-emergency-medical-services-and-saving-lives-for-20-years",
 "er24_cc": "https://er24.co.za/en/infohub/awareness/behind-the-scenes-at-er24-s-contact-centre.html",
 "ampath_about": "https://www2.ampath.co.za/about/about-ampath",
 "lancet_netlims": "https://www.intelligentcio.com/africa/2018/12/17/lancet-laboratories-chooses-netlims-labos-product-to-replace-its-lis/",
 "medavis_polokwane": "https://www.medavis.com/northern-radiologists-polokwane-za/",
 "sectra_sa": "https://medical.sectra.com/news-press-releases/news-item/084302271ED35A65",
 "engnews_mbod": "https://www.engineeringnews.co.za/article/stakeholders-join-hands-to-improve-occupational-lung-disease-compensation-system-2020-02-25",
 "pmg_hmi": "https://pmg.org.za/committee-meeting/30019/",
 "hello_doctor_hpcsa": "https://www.hpcsa-blogs.co.za/hpcsa-telehealth-guidelines/",
 "altron_telehealth": "https://healthtech.altron.com/press-releases/caring-for-patients-remotely-during-covid-19",
 "disrupt_er24": "https://disrupt-africa.com/2015/12/10/sa-e-health-startup-cenhealth-partners-er24-to-speed-up-response-time/",
 "momentum_ir": "https://www.momentum.co.za/",
 "discovery_about": "https://discovery.co.za/medical-aid/about-discovery-health",
 "lenmed_bluebird": "https://www.lenmed.co.za/lenmed-works-to-mitigate-infection-risk-in-its-hospitals-with-bluebird/",
 "citizen_careconnect": "https://citizen.co.za/business/careconnect-aims-to-break-healthcare-boundaries-in-sa",
 "itweb_careconnect": "https://itweb.co.za/content/GxwQDq1Z8gPvlPVo",
 "iol_careconnect": "https://www.iol.co.za/technology/your-medical-details-can-now-be-shared-between-private-hospitals-with-your-consent-02eb18b9-f96d-4593-b7b3-4255bb634cc5",
 "fanews_careconnect": "https://www.fanews.co.za/article/healthcare/6/general/1124/data-information-the-lifeblood-of-positive-healthcare-outcomes/38270",
 "intelligentcio_cc2": "https://www.intelligentcio.com/africa/?p=12959",
 "medsch_ehealth": "https://www.engineeringnews.co.za/article/medscheme-announces-roll-out-of-an-electronic-medical-records-platform---less-administration-for-gps-more-time-to-treat-patients-2015-07-28",
}
def main(out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    s = requests.Session(); s.headers["User-Agent"] = "Mozilla/5.0 SAHealth-research/1.0 (DEXA)"
    for k, u in URLS.items():
        try:
            r = s.get(u, timeout=40)
            if "pdf" in r.headers.get("content-type", "") :
                txt = "(PDF %d bytes)" % len(r.content)
            else:
                txt = BeautifulSoup(r.text, "html.parser").get_text("\n", strip=True)
            (out / f"{k}.txt").write_text(f"{u}\nSTATUS {r.status_code}\n\n{txt}", encoding="utf-8")
            print(k, r.status_code, len(txt))
        except Exception as e:
            print(k, "ERR", str(e)[:80])
        time.sleep(2)
if __name__ == "__main__":
    main(sys.argv[1])
