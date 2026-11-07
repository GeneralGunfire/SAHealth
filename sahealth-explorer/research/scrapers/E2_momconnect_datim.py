"""E2: fetch MomConnect / PEPFAR / DATIM related pages and print keyword contexts."""
from E2_common import run
URLS = ["https://www.health.gov.za/?p=21258",
        "https://www.itu.int/net4/wsis/stocktaking/Prizes/2026/Details/17720121703313989",
        "https://www.eatg.org/hiv-news/avac-pepfar-in-transition/",
        "https://auruminstitute.org/areas-of-expertise/hiv/monitoring-evaluation-and-reporting"]
run(URLS, ["MomConnect", "DATIM", "TIER.Net", "handover", "DHIS2", "Praekelt", "MARS"])
