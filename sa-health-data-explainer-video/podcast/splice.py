"""Build the clean master voice track from the three recordings.

segments.json: [{"part": "part1", "from": 0.0, "to": 1427.6}, ...]  (part-local seconds)
Outputs:
  master_voice.wav                       (48 kHz stereo, loudness-normalised to -16 LUFS)
  ../public/data/doc_words.json          [{w, s}] on the master timeline
  ../public/data/doc_meta.json           {duration, segments:[{part, from, to, offset}]}
"""
import json, subprocess

SEGS = json.load(open("segments.json"))
XF = 0.06  # tiny crossfade at each splice to avoid clicks

offset = 0.0
meta, words = [], []
inputs, filters = [], []
for i, s in enumerate(SEGS):
    dur = s["to"] - s["from"]
    inputs += ["-ss", f"{s['from']:.3f}", "-t", f"{dur:.3f}", "-i", f"raw/{s['part']}.mp3"]
    meta.append({**s, "offset": round(offset, 3)})
    tr = json.load(open(f"transcripts/{s['part']}.json"))
    for seg in tr:
        for w in seg["words"]:
            if s["from"] <= w["s"] < s["to"] - 0.05:
                words.append({"w": w["w"], "s": round(offset + w["s"] - s["from"], 3)})
    offset += dur - (XF if i < len(SEGS) - 1 else 0)

# chain acrossfades
chain = "[0:a]aresample=48000[a0];"
for i in range(1, len(SEGS)):
    chain += f"[{i}:a]aresample=48000[b{i}];[a{i-1}][b{i}]acrossfade=d={XF}:c1=tri:c2=tri[a{i}];"
last = f"a{len(SEGS)-1}"
chain += f"[{last}]loudnorm=I=-16:TP=-1.5:LRA=11[out]"
cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", chain, "-map", "[out]", "-ar", "48000", "-ac", "2", "master_voice.wav"]
subprocess.run(cmd, check=True)

dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "master_voice.wav"], capture_output=True, text=True).stdout)
json.dump(words, open("../public/data/doc_words.json", "w"))
json.dump({"duration": round(dur, 3), "segments": meta}, open("../public/data/doc_meta.json", "w"), indent=1)
print(f"master {dur:.1f}s, {len(words)} words")
for m in meta:
    print(m)
