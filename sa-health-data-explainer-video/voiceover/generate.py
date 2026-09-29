"""Generate per-scene voiceover + word timings from script/narration.json.

Outputs:
  public/audio/<scene>.mp3
  public/data/timings.json  -> {scenes: [{id, section, duration, words:[{w, t}]}]}

To use a human recording instead: drop <scene>.mp3 files into public/audio,
then run with --timings-only (word cues are then re-derived via forced alignment
is NOT implemented; cue times fall back to proportional estimates).
"""
import asyncio, json, subprocess, sys, pathlib, re
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / "script" / "narration.json").read_text(encoding="utf-8"))
AUDIO = ROOT / "public" / "audio"
AUDIO.mkdir(parents=True, exist_ok=True)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True)
    return float(out.stdout.strip())


async def synth(scene, voice, rate):
    comm = edge_tts.Communicate(scene["text"], voice, rate=rate, boundary="WordBoundary")
    words, path = [], AUDIO / f"{scene['id']}.mp3"
    with open(path, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"w": chunk["text"], "t": round(chunk["offset"] / 1e7, 3)})
    return path, words


def estimate_words(text, dur):
    toks = re.findall(r"\S+", text)
    return [{"w": re.sub(r"[^\w'.-]", "", t), "t": round(dur * i / len(toks), 3)} for i, t in enumerate(toks)]


async def main():
    only = set(sys.argv[1:]) - {"--timings-only"}
    timings_only = "--timings-only" in sys.argv
    tpath = ROOT / "public" / "data" / "timings.json"
    prev = {s["id"]: s for s in json.loads(tpath.read_text())["scenes"]} if tpath.exists() else {}
    result = []
    for sc in SCRIPT["scenes"]:
        if (only and sc["id"] not in only) and sc["id"] in prev:
            result.append(prev[sc["id"]]); continue
        if timings_only:
            p = AUDIO / f"{sc['id']}.mp3"; words = estimate_words(sc["text"], duration(p))
        else:
            for attempt in range(4):
                try:
                    p, words = await synth(sc, SCRIPT["voice"], SCRIPT["rate"]); break
                except Exception as e:  # network hiccups
                    print("retry", sc["id"], e); await asyncio.sleep(2 * (attempt + 1))
            else:
                raise SystemExit(f"failed {sc['id']}")
        d = duration(p)
        result.append({"id": sc["id"], "section": sc["section"], "duration": round(d, 3), "words": words})
        print(f"{sc['id']:18} {d:6.2f}s {len(words)} words")
    tpath.write_text(json.dumps({"gapAfterSceneSec": SCRIPT["gapAfterSceneSec"], "scenes": result}, indent=1))
    print("total", round(sum(s["duration"] + SCRIPT["gapAfterSceneSec"] for s in result), 1), "s")

asyncio.run(main())
