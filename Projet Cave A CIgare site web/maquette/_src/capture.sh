#!/bin/bash
# capture.sh <out-dir> nom:largeur:hauteur:chemin ... — captures pleine page via Edge headless (serveur sur :4321, mode ?capture)
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
out="$(cd "$1" && pwd)"; shift
for spec in "$@"; do
  IFS=: read -r name w h path <<< "$spec"
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=20000 --window-size=$w,$h --screenshot="$(cygpath -w "$out/$name.png")" "http://localhost:4321/$path" 2>/dev/null
  echo "$name"
done
