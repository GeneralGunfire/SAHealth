"""Find repeated / restarted audio at the seams between parts and inside each part.

Uses word-level transcripts in transcripts/partN.json. Prints candidate cuts; does not modify audio.
"""
import json, re, sys
from difflib import SequenceMatcher

def words(name):
    segs = json.load(open(f"transcripts/{name}.json"))
    return [(re.sub(r"[^a-z0-9']", "", w["w"].lower()), w["s"], w["e"]) for s in segs for w in s["words"] if w["w"].strip()]

def ctx(ws, i, n=14):
    return " ".join(w[0] for w in ws[max(0, i):i + n])

parts = sys.argv[1:] or ["part1", "part2", "part3"]
W = {p: words(p) for p in parts}

print("=== seams ===")
for a, b in zip(parts, parts[1:]):
    A, B = W[a], W[b]
    tail = A[-600:]; head = B[:600]
    sm = SequenceMatcher(None, [w[0] for w in tail], [w[0] for w in head], autojunk=False)
    blocks = [m for m in sm.get_matching_blocks() if m.size >= 6]
    print(f"\n{a} -> {b}: {a} ends {A[-1][2]:.1f}s, {b} starts {B[0][1]:.1f}s")
    print(f"  {a} last words : ...{' '.join(w[0] for w in A[-25:])}")
    print(f"  {b} first words: {' '.join(w[0] for w in B[:25])}...")
    for m in blocks:
        ta = tail[m.a]; hb = head[m.b]
        print(f"  MATCH {m.size:3d} words | {a}@{ta[1]:.2f}s  {b}@{hb[1]:.2f}s | {ctx(tail, m.a)}")

print("\n=== restarts inside parts (same 10-word run repeated within 120 s) ===")
N = 10
for p in parts:
    ws = W[p]; seen = {}
    for i in range(len(ws) - N):
        key = " ".join(w[0] for w in ws[i:i + N])
        if key in seen and ws[i][1] - ws[seen[key]][1] < 120:
            j = seen[key]
            print(f"  {p}: first {ws[j][1]:.2f}s, again {ws[i][1]:.2f}s | {key}")
        seen.setdefault(key, i)
