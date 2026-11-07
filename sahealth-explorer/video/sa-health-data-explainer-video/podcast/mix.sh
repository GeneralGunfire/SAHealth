#!/usr/bin/env bash
# Voice master + subtle ducked score -> ../public/audio/doc_mix.m4a
set -e
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 master_voice.wav)
ffmpeg -v error -y -i master_voice.wav -i music.wav -filter_complex "
[1:a]aresample=48000,volume=-21dB,afade=t=in:d=4,afade=t=out:st=$(python -c "print($D-8)"):d=8[m];
[0:a]asplit=2[v][sc];
[m][sc]sidechaincompress=threshold=0.02:ratio=6:attack=80:release=900:makeup=1[md];
[v][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[out]" \
  -map "[out]" -c:a aac -b:a 192k -ar 48000 ../public/audio/doc_mix.m4a
ffmpeg -v info -i ../public/audio/doc_mix.m4a -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
