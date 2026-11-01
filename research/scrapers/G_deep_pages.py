"""G_deep_pages.py - second pass: deeper pages (about/docs/pricing/programs) for factual detail."""
import sys, json, requests
from bs4 import BeautifulSoup
URLS={
 "dhis2_countries":"https://dhis2.org/in-action/","openhim_docs":"https://jembi.gitbook.io/openhim","openhie_arch":"https://guides.ohie.org/arch-spec/introduction-to-the-openhie/openhie-component-specifications",
 "who_smart":"https://www.who.int/teams/digital-health-and-innovation/smart-guidelines","dpg_dhis2":"https://digitalpublicgoods.net/registry/dhis2.html",
 "dpg_openmrs":"https://digitalpublicgoods.net/registry/openmrs.html","dpg_openhim":"https://digitalpublicgoods.net/registry/openhim.html",
 "xroad_about":"https://x-road.global/about","hl7_fhir":"https://hl7.org/fhir/overview.html","ihe_profiles":"https://profiles.ihe.net/ITI/",
 "carequality_about":"https://carequality.org/about/","commonwell_about":"https://www.commonwellalliance.org/about-us/",
 "medplum_pricing":"https://www.medplum.com/pricing","aidbox_pricing":"https://www.health-samurai.io/aidbox/pricing",
 "redox_about":"https://redoxengine.com/about","zus_about":"https://zushealth.com/about","metriport_gh":"https://github.com/metriport/metriport",
 "openempi_gh":"https://github.com/MURDOCK98/openempi","hapi_gh":"https://github.com/hapifhir/hapi-fhir","medplum_gh":"https://github.com/medplum/medplum",
 "openhim_gh":"https://github.com/jembi/openhim-core-js","openmrs_gh":"https://github.com/openmrs/openmrs-core","bahmni_gh":"https://github.com/Bahmni/bahmni-core",
 "dhis2_gh":"https://github.com/dhis2/dhis2-core","senzing_gh":"https://github.com/Senzing","azure_hds":"https://learn.microsoft.com/en-us/azure/healthcare-apis/healthcare-apis-overview",
 "gcp_chc":"https://cloud.google.com/healthcare-api/docs/introduction","tefca":"https://www.healthit.gov/topic/interoperability/policy/trusted-exchange-framework-and-common-agreement-tefca",
 "ehds":"https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en","abdm":"https://abdm.gov.in/home/about",
 "africacdc_dh":"https://africacdc.org/news-item/africa-cdc-digital-health-strategy/","gdhi":"https://index.digitalhealthindex.org/","dha":"https://digitalhealthatlas.org/en/-/",
 "kenya_dha":"https://www.dha.go.ke/about","hisp_za":"https://www.hisp.org/","csir_health":"https://www.csir.co.za/health","dhis2_za":"https://dhis2.org/south-africa/",
}
H={"User-Agent":"Mozilla/5.0 (research-bot G_deep_pages)"}
out={}
for k,u in URLS.items():
    try:
        r=requests.get(u,headers=H,timeout=20); s=BeautifulSoup(r.text,"html.parser")
        for t in s(["script","style","nav","footer"]): t.decompose()
        txt=" ".join(s.get_text(" ",strip=True).split())
        out[k]={"url":u,"status":r.status_code,"title":s.title.string.strip() if s.title and s.title.string else "","text":txt[:1800]}
    except Exception as e: out[k]={"url":u,"error":str(e)[:80]}
    print(k,out[k].get("status",out[k].get("error")),flush=True)
json.dump(out,open(sys.argv[1],"w"),indent=1)
