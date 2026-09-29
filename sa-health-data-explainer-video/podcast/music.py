"""Procedural documentary score.

Builds a full-length underscore from a cue map (podcast/cuemap.json):
  [{"start": sec, "end": sec, "mood": "open|process|private|tension|resolve"}, ...]
Writes podcast/music.wav (44.1 kHz stereo, peak-normalised; mixed later under the voices).

Everything is synthesised here (no samples), so there are no licensing questions.
Palette: soft detuned pads, a felt-piano motif, a muted pluck pulse, a sub drone.
"""
import json, sys, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
rng = np.random.default_rng(7)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)

def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)

def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    A, D, R = int(a * SR), int(d * SR), int(r * SR)
    A = min(A, n); e[:A] = np.linspace(0, 1, A, endpoint=False) if A else e[:A]
    D2 = min(D, n - A)
    if D2 > 0: e[A:A + D2] = np.linspace(1, s, D2, endpoint=False)
    R = min(R, n)
    if R > 0: e[n - R:] *= np.linspace(1, 0, R) ** 2
    return e

def pad_note(freq, dur, amp=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for k, det in enumerate((-0.07, 0.0, 0.06)):
        f = freq * 2 ** (det / 12)
        ph = rng.uniform(0, 2 * np.pi)
        # soft saw-ish: first 5 harmonics with 1/h^1.6 rolloff
        w = sum(np.sin(2 * np.pi * f * h * t + ph * h) / h ** 1.6 for h in range(1, 6))
        pan = (k - 1) * 0.5
        out[:, 0] += w * (1 - pan) * 0.5; out[:, 1] += w * (1 + pan) * 0.5
    trem = 1 + 0.06 * np.sin(2 * np.pi * 0.15 * t + rng.uniform(0, 6))
    e = env_adsr(n, min(2.5, dur * 0.4), 1.0, 0.85, min(3.0, dur * 0.45)) * trem
    for c in range(2): out[:, c] = lp(out[:, c] * e, 1400)
    return out * amp

def piano_note(freq, dur=4.0, amp=0.16, bright=2600):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for h in range(1, 9):
        B = 0.0004
        fh = freq * h * np.sqrt(1 + B * h * h)
        decay = np.exp(-t * (0.9 + 0.55 * h))
        x += np.sin(2 * np.pi * fh * t) * decay / h ** 1.2
    hammer = np.exp(-t * 60) * rng.normal(0, 0.02, n)
    x = lp(x + hammer, bright) * np.minimum(1, t / 0.004)
    return np.stack([x, x], 1) * amp

from functools import lru_cache

@lru_cache(maxsize=None)
def _pluck(freq, dur):
    return _pluck_raw(freq, dur)

def pluck(freq, dur=0.5, amp=0.08):
    return _pluck(round(freq, 3), dur) * amp

def _pluck_raw(freq, dur=0.5, amp=1.0):
    # Karplus-Strong, heavily damped (muted)
    n = int(dur * SR); N = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, N); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % N]
        buf[i % N] = 0.5 * (buf[i % N] + buf[(i + 1) % N]) * 0.985
    out = lp(out, 1800) * np.exp(-np.arange(n) / SR * 5)
    return np.stack([out, out], 1) * amp

def sub(freq, dur, amp=0.10):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t)
    x *= env_adsr(n, 3, 1, 0.9, 3) * (1 + 0.1 * np.sin(2 * np.pi * 0.08 * t))
    return np.stack([x, x], 1) * amp

def reverb_ir(sec=3.8):
    n = int(sec * SR); t = np.arange(n) / SR
    ir = np.stack([rng.normal(0, 1, n), rng.normal(0, 1, n)], 1) * np.exp(-t * 3.2)[:, None]
    for c in range(2): ir[:, c] = lp(ir[:, c], 5000)
    ir[:int(0.012 * SR)] = 0
    return ir / np.abs(ir).sum(0).max() * 40

IR = reverb_ir()

def add(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i]

# ---------------------------------------------------------------- harmony
# D Dorian / D minor world; each chord = (bass, [voicing midi notes])
PROG = {
    'open':    [(38, [62, 65, 69, 76]), (34, [62, 65, 69, 74]), (41, [60, 65, 69, 72]), (36, [60, 64, 67, 74])],   # Dm9 Bbmaj7 F C
    'process': [(38, [62, 65, 69, 72]), (41, [60, 65, 69, 72]), (36, [59, 64, 67, 72]), (34, [62, 65, 69, 74])],   # Dm7 F C Bb
    'private': [(41, [60, 65, 69, 72]), (36, [60, 64, 67, 74]), (38, [62, 65, 69, 76]), (34, [62, 65, 70, 74])],   # F C Dm Bb
    'tension': [(38, [62, 65, 69, 74]), (34, [61, 65, 70, 74]), (31, [62, 67, 70, 74]), (33, [61, 64, 69, 73])],   # Dm Bbaug Gm A
    'resolve': [(41, [60, 65, 69, 72]), (36, [60, 64, 67, 74]), (38, [62, 65, 69, 76]), (41, [60, 65, 69, 77])],   # F C Dm F
}
CHORD_SEC = {'open': 4.444, 'process': 4.444, 'private': 4.444, 'tension': 4.444, 'resolve': 4.444}  # 2 bars @108bpm
MOTIF = [0, 2, 1, 3]  # indexes into voicing for sparse piano

def render_cue(mood, dur):
    buf = np.zeros((int((dur + 6) * SR), 2))
    cs = CHORD_SEC[mood]; prog = PROG[mood]
    t = 0.0; k = 0
    beat = 60 / 108
    while t < dur:
        bass, voic = prog[k % len(prog)]
        add(buf, pad_note(midi(bass + 12), cs + 2.5, 0.07), t)
        for v in voic:
            add(buf, pad_note(midi(v), cs + 2.5, 0.045 if mood != 'tension' else 0.04), t)
        if mood in ('open', 'resolve', 'tension'):
            # sparse felt piano: 2 notes per chord
            for m in range(2):
                note = voic[MOTIF[(k + m) % 4]] + (12 if mood != 'tension' else 0)
                add(buf, piano_note(midi(note), 5.0, 0.12 if mood != 'tension' else 0.10, 2000 if mood == 'tension' else 2600), t + 0.6 + m * cs / 2 + rng.uniform(-0.05, 0.05))
        if True:
            # muted pluck pulse on chord tones, eighth notes, gentle accents
            steps = int(cs / (beat / 2))
            for s in range(steps):
                if s % 8 in (3, 7) and rng.random() < 0.5: continue
                note = voic[(s * 2 + k) % len(voic)] + (12 if mood in ('private', 'open', 'resolve') else 0)
                amp = 0.028 if s % 4 == 0 else 0.016
                add(buf, pluck(midi(note), 0.45, amp), t + s * beat / 2)
        # soft kick on every beat, closed hat on off-beats
        for b in range(int(round(cs / beat))):
            kt = t + b * beat
            n = int(0.25 * SR); tt = np.arange(n) / SR
            kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-tt * 28)) * tt) * np.exp(-tt * 14) * 0.16
            add(buf, np.stack([kick, kick], 1), kt)
            hn = int(0.06 * SR)
            hat = hp(rng.normal(0, 1, hn), 7000) * np.exp(-np.arange(hn) / SR * 70) * 0.035
            add(buf, np.stack([hat * 0.8, hat], 1), kt + beat / 2)
        if mood == 'tension':
            add(buf, sub(midi(bass), cs + 2, 0.09), t)
            # slow heartbeat
            for s in range(int(cs / (beat * 2))):
                add(buf, sub(midi(26), 0.35, 0.05) * np.linspace(1, 0, int(0.35 * SR))[:, None] ** 3, t + s * beat * 2)
        t += cs; k += 1
    # gentle reverb send
    wet = np.stack([fftconvolve(buf[:, c], IR[:, c])[:len(buf)] for c in range(2)], 1)
    out = hp(buf * 0.75 + wet * 0.35, 40, 2) if False else np.stack([hp(buf[:, c] * 0.75 + wet[:, c] * 0.35, 40) for c in range(2)], 1)
    return out[:int(dur * SR)]

def main():
    cues = json.load(open('cuemap.json'))
    total = max(c['end'] for c in cues)
    mix = np.zeros((int((total + 1) * SR), 2))
    XF = 4.0
    for i, c in enumerate(cues):
        d = c['end'] - c['start'] + XF
        x = render_cue(c['mood'], d)
        n = len(x); f = int(XF * SR)
        fade = np.ones(n)
        fade[:f] = np.sin(np.linspace(0, np.pi / 2, f)) ** 2 if i > 0 else np.linspace(0, 1, f)
        fade[-f:] = np.cos(np.linspace(0, np.pi / 2, f)) ** 2
        add(mix, x * fade[:, None], max(0, c['start'] - (XF / 2 if i > 0 else 0)))
        print('cue', i, c['mood'], round(c['start']), '->', round(c['end']), flush=True)
    peak = np.abs(mix).max()
    mix = mix / peak * 0.7
    import wave
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open('music.wav', 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print('wrote music.wav', round(total), 's')

if __name__ == '__main__':
    main()
