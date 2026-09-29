import json, sys, time
from faster_whisper import WhisperModel
m = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=4)
for name in sys.argv[1:]:
    t0 = time.time()
    segs, info = m.transcribe(f"raw/{name}.mp3", word_timestamps=True, vad_filter=True, beam_size=5)
    out = []
    for s in segs:
        out.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
                    "words": [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for w in s.words]})
        print(name, f"{s.start:7.1f}", s.text.strip()[:90], flush=True)
    json.dump(out, open(f"transcripts/{name}.json", "w"), indent=0)
    print("DONE", name, round(time.time() - t0), "s", flush=True)
