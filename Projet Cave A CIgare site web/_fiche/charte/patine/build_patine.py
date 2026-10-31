"""Build patinated versions of the Lemony monogram: burnished-leather fill that follows the stroke.

The patina is made of three layers clipped to the monogram shape:
  1. a dark-to-warm gradient running along the stroke (top-left to bottom-right);
  2. a lighter core obtained by eroding the shape, so edges stay darker like a dyed leather edge;
  3. a fine grain and a soft specular light that give the stroke relief.
"""
import re
import sys
from pathlib import Path

SRC, OUT_DIR = Path(sys.argv[1]), Path(sys.argv[2])

PALETTES = {
    # name: (gradient stops, core light colour, highlight opacity)
    "cognac": (["#2B1810", "#6E3B1E", "#9A5C30", "#B87A45", "#7A4224", "#2E1A10"], "#D9A56C", 0.55),
    "laiton": (["#4A3517", "#8C6A2E", "#C9A15A", "#E6C88A", "#9C7A3A", "#4A3517"], "#F2DDB0", 0.65),
}

svg = SRC.read_text()
view_box = re.search(r'viewBox="([^"]+)"', svg).group(1)
path_d = re.search(r'd="([^"]+)"', svg).group(1)


def patina_svg(stops, core, highlight):
    stop_tags = "".join(
        f'<stop offset="{i / (len(stops) - 1):.2f}" stop-color="{c}"/>' for i, c in enumerate(stops)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}">
<defs>
  <linearGradient id="g" x1="0.15" y1="0" x2="0.85" y2="1">{stop_tags}</linearGradient>
  <filter id="p" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="erode" radius="9" result="core"/>
    <feGaussianBlur in="core" stdDeviation="14" result="coreSoft"/>
    <feFlood flood-color="{core}" flood-opacity="0.55"/>
    <feComposite in2="coreSoft" operator="in" result="glow"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.07  0 0 0 0 0.03  0 0 0 0.55 -0.12" result="grain"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="bump"/>
    <feSpecularLighting in="bump" surfaceScale="6" specularConstant="0.9" specularExponent="22" lighting-color="#FFF4E2" result="spec">
      <feDistantLight azimuth="235" elevation="38"/>
    </feSpecularLighting>
    <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
    <feComponentTransfer in="specIn" result="specSoft"><feFuncA type="linear" slope="{highlight}"/></feComponentTransfer>
    <feMerge result="lit"><feMergeNode in="SourceGraphic"/><feMergeNode in="glow"/><feMergeNode in="grain"/><feMergeNode in="specSoft"/></feMerge>
    <feComposite in="lit" in2="SourceAlpha" operator="in"/>
  </filter>
</defs>
<path fill="url(#g)" fill-rule="evenodd" filter="url(#p)" d="{path_d}"/>
</svg>'''


OUT_DIR.mkdir(parents=True, exist_ok=True)
for name, (stops, core, highlight) in PALETTES.items():
    (OUT_DIR / f"monogramme-patine-{name}.svg").write_text(patina_svg(stops, core, highlight))
    print(f"monogramme-patine-{name}.svg")
