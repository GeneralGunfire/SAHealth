"""
Probabilistic identity matching sidecar. A single endpoint, invoked by the
Node backend over plain HTTP — deliberately not a client library, so the
matching engine underneath (currently Splink) could be replaced without
the Node side changing at all.

Run: uvicorn main:app --host 0.0.0.0 --port 5001
"""

from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from matching import MATCH_THRESHOLD, find_probable_match_groups

app = FastAPI(title="SA Health Probabilistic Matching Sidecar")


class Candidate(BaseModel):
    id: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None


class MatchRequest(BaseModel):
    candidates: list[Candidate]


class MatchGroup(BaseModel):
    candidateIds: list[str]
    score: float


class MatchResponse(BaseModel):
    groups: list[MatchGroup]
    threshold: float


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/match", response_model=MatchResponse)
def match(request: MatchRequest) -> MatchResponse:
    candidates = [c.model_dump() for c in request.candidates]
    groups = find_probable_match_groups(candidates, threshold=MATCH_THRESHOLD)
    return MatchResponse(groups=groups, threshold=MATCH_THRESHOLD)
