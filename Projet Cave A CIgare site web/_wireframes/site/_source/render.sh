#!/bin/bash
# render.sh <dossier> : exporte chaque SVG en PNG 2x via Edge headless
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
for f in "$1"/*.svg; do
  W=$(grep -o 'width="[0-9.]*"' "$f" | head -1 | grep -o '[0-9]*' | head -1)
  H=$(grep -o 'height="[0-9.]*"' "$f" | head -1 | grep -o '[0-9]*' | head -1)
  win=$(cygpath -w "$f"); png=$(cygpath -w "${f%.svg}.png")
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size=$W,$H --screenshot="$png" "file:///${win//\//}" 2>/dev/null
  echo "$png ($W x $H)"
done
