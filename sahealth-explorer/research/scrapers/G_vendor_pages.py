"""G_vendor_pages.py - fetch vendor/product/standards pages and dump title, meta description, headings, first paragraphs."""
import sys, json, requests
from bs4 import BeautifulSoup
URLS = {
 "jembi":"https://www.jembi.org/", "openhim":"https://openhim.org/", "ohie":"https://ohie.org/",
 "altron_healthtech":"https://healthtech.altron.com/", "healthbridge":"https://www.healthbridge.co.za/",
 "medikredit":"https://www.medikredit.co.za/", "dhis2":"https://dhis2.org/", "openmrs":"https://openmrs.org/",
 "bahmni":"https://www.bahmni.org/", "redox":"https://redoxengine.com/", "particle":"https://www.particlehealth.com/",
 "healthgorilla":"https://www.healthgorilla.com/", "smilecdr":"https://www.smilecdr.com/", "hapi":"https://hapifhir.io/",
 "medplum":"https://www.medplum.com/", "aidbox":"https://www.health-samurai.io/aidbox", "firely":"https://fire.ly/",
 "metriport":"https://www.metriport.com/", "zus":"https://zushealth.com/", "verato":"https://verato.com/",
 "nextgate":"https://nextgate.com/", "senzing":"https://senzing.com/", "openempi":"https://www.openempi.org/",
 "hl7":"https://www.hl7.org/", "ihe":"https://www.ihe.net/", "digitalsquare":"https://digitalsquare.org/",
 "healthdataglobalgoods":"https://digitalpublicgoods.net/", "x-road":"https://x-road.global/",
 "who_dha":"https://digitalhealthatlas.org/", "gdhi":"https://www.digitalhealthindex.org/",
 "africacdc":"https://africacdc.org/", "careconnect":"https://careconnect.co.za/", "reach":"https://www.reachdigitalhealth.org/",
 "carequality":"https://carequality.org/", "commonwell":"https://www.commonwellalliance.org/", "tefca":"https://rce.sequoiaproject.org/",
 "abdm":"https://abdm.gov.in/", "infoway":"https://www.infoway-inforoute.ca/en/", "myhealthrecord":"https://www.digitalhealth.gov.au/initiatives-and-programs/my-health-record",
 "ehds":"https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space_en",
 "intersystems_za":"https://www.intersystems.com/za/", "rhapsody":"https://rhapsody.health/", "nextgen_mirth":"https://www.nextgen.com/solutions/interoperability/mirth-integration-engine",
}
H={"User-Agent":"Mozilla/5.0 (research-bot G_vendor_pages)"}
out={}
for k,u in URLS.items():
    try:
        r=requests.get(u,headers=H,timeout=20)
        s=BeautifulSoup(r.text,"html.parser")
        md=s.find("meta",attrs={"name":"description"})
        out[k]={"url":u,"status":r.status_code,"title":(s.title.string.strip() if s.title and s.title.string else ""),
          "desc":md.get("content","") if md else "",
          "h":[h.get_text(" ",strip=True) for h in s.find_all(["h1","h2"])][:8],
          "p":[p.get_text(" ",strip=True) for p in s.find_all("p") if len(p.get_text())>80][:3]}
    except Exception as e:
        out[k]={"url":u,"error":str(e)[:100]}
    print(k,out[k].get("status",out[k].get("error")),flush=True)
json.dump(out,open(sys.argv[1] if len(sys.argv)>1 else "G_vendor_pages.json","w"),indent=1)
