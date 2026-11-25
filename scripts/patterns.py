"""Gera src/patterns.css: as estampas de fundo de cada cartão (SVG em data URI).
Rode: python3 scripts/patterns.py"""
import urllib.parse, pathlib

S = 'fill="none" stroke="{c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'

def place(items):
    return "".join(f'<g transform="translate({x} {y}) rotate({r}) scale({s})">{el}</g>' for el, x, y, r, s in items)

def svg(body, size=80, opacity=0.2):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}"><g opacity="{opacity}">{body}</g></svg>'

def uri(s):
    return "data:image/svg+xml," + urllib.parse.quote(s, safe='/:= ".,-')

def pine(c):
    return f'<path d="M0-10 6-2H2.5L8 5H-8l5.5-7H-6Z" fill="{c}"/><path d="M0 5v4" {S.format(c=c)}/>'

def tree_round(c):
    return f'<circle cy="-3" r="6" {S.format(c=c)}/><path d="M0 3v6M0 0l-2.5-2.5M0 1l3-3" {S.format(c=c)}/>'

def rock(c):
    return f'<path d="M-8 4c-.6-4 2.4-7.4 6-7.6 2-1.4 5.6-.4 6.6 2.6 2 .6 3.6 2.6 3.4 5Z" {S.format(c=c)}/><path d="M-1-1.5 1 1" {S.format(c=c)}/>'

def leaf(c):
    return f'<path d="M-6 5C-6-2-1-6 6-6 6 1 1 5-6 5ZM-6 5 2-3" {S.format(c=c)}/>'

def note8(c):
    return f'<ellipse cx="-2.5" cy="5" rx="3.2" ry="2.4" transform="rotate(-20 -2.5 5)" fill="{c}"/><path d="M0.4 4.4V-8c2 1.4 4.6 2.4 5 5.4" {S.format(c=c)}/>'

def note16(c):
    return (f'<ellipse cx="-5" cy="6" rx="3" ry="2.2" transform="rotate(-20 -5 6)" fill="{c}"/>'
            f'<ellipse cx="5" cy="4" rx="3" ry="2.2" transform="rotate(-20 5 4)" fill="{c}"/>'
            f'<path d="M-2.4 5.4V-6.6L7.6-8.6V3.4" {S.format(c=c)}/><path d="M-2.4-6.6 7.6-8.6" stroke="{c}" stroke-width="3"/>')

def spiral(c):
    return f'<path d="M0 0c1-1 2.4 0 2 1.4-.6 2-3.6 2-4.6 0-1.4-3 1.4-6 4.6-5.4 4 .8 5.4 5.6 3 8.6" {S.format(c=c)}/>'

def squiggle(c):
    return f'<path d="M-9 0c2-4 4 4 6 0s4 4 6 0 4 4 6 0" {S.format(c=c)}/>'

def star_doodle(c):
    return f'<path d="M0-7 2 -2 7-1.6 3 1.6 4.4 6.6 0 3.8-4.4 6.6-3 1.6-7-1.6-2-2Z" {S.format(c=c)}/>'

def smiley(c):
    return f'<circle r="6.5" {S.format(c=c)}/><path d="M-3 1.6c1.6 2 4.4 2 6 0M-2.4-2v.2M2.4-2v.2" {S.format(c=c)}/>'

def heart_line(c):
    return f'<path d="M0 6-5.6.4C-8.4-2.6-5.8-7 -2.6-5.6-1.2-5 0-3.6 0-3.6S1.2-5 2.6-5.6C5.8-7 8.4-2.6 5.6.4Z" {S.format(c=c)}/>'

def ball(c):
    return (f'<circle r="6.5" {S.format(c=c)}/><path d="M0-2.6 2.5-.8 1.6 2.2h-3.2L-2.5-.8Z" fill="{c}"/>'
            f'<path d="M0-2.6V-6.4M2.5-.8l3.6-1.2M1.6 2.2l2.2 3.2M-1.6 2.2l-2.2 3.2M-2.5-.8l-3.6-1.2" {S.format(c=c)}/>')

def goal(c):
    return f'<path d="M-9 5V-5H9V5M-9-5-6-2h12l3-3M-6-2V5M6-2V5M-3-2V5M0-2V5M3-2V5M-6 1.5H6" {S.format(c=c)}/>'

def whistle(c):
    return f'<circle cx="-2" cy="2" r="4" {S.format(c=c)}/><path d="M-2-2H8v4H2M8-2V-4" {S.format(c=c)}/>'

def flag(c):
    return f'<path d="M-4 8V-8l9 3.4L-4-1.4" {S.format(c=c)}/>'

def flower(c, center="#ffffff"):
    petals = "".join(f'<circle cx="0" cy="-3.6" r="2.8" transform="rotate({a})" fill="{c}"/>' for a in range(0, 360, 72))
    return petals + f'<circle r="1.9" fill="{center}"/>'

def leopard():
    """Rosetas de onça: manchas escuras irregulares em volta de um miolo laranja,
    mais pintas soltas. Ladrilho sem emenda (elementos repetidos nas bordas)."""
    import random, math
    rnd = random.Random(11)
    SIZE = 120
    dark, core = "#2e1a08", "#d08f35"
    els = []

    def blob(cx, cy, rx, ry, rot):
        # elipse "torta": 6 pontos com raio sorteado, ligados por curvas suaves
        pts = []
        for k in range(6):
            a = math.radians(k * 60 + rnd.uniform(-12, 12))
            f = rnd.uniform(0.75, 1.15)
            pts.append((rx * f * math.cos(a), ry * f * math.sin(a)))
        d = f"M{(pts[0][0]+pts[1][0])/2:.1f} {(pts[0][1]+pts[1][1])/2:.1f}"
        for k in range(6):
            p1, p2 = pts[(k + 1) % 6], pts[(k + 2) % 6]
            d += f"Q{p1[0]:.1f} {p1[1]:.1f} {(p1[0]+p2[0])/2:.1f} {(p1[1]+p2[1])/2:.1f}"
        return f'<path transform="translate({cx:.1f} {cy:.1f}) rotate({rot:.0f})" d="{d}Z" fill="{dark}"/>'

    # posições das rosetas: grade 3x3 com sorteio
    for gx in range(4):
        for gy in range(4):
            cx = gx * 30 + 15 + (15 if gy % 2 else 0) + rnd.uniform(-8, 8)
            cy = gy * 30 + 15 + rnd.uniform(-7, 7)
            r = rnd.uniform(6.5, 8.5)
            parts = [f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r*0.85:.1f}" ry="{r*0.7:.1f}" fill="{core}" transform="rotate({rnd.uniform(0,180):.0f} {cx:.1f} {cy:.1f})"/>']
            n = rnd.choice([4, 5, 5, 6])
            start = rnd.uniform(0, 360)
            for k in range(n):
                ang = math.radians(start + k * 360 / n + rnd.uniform(-14, 14))
                bx, by = cx + r * 1.05 * math.cos(ang), cy + r * 0.9 * math.sin(ang)
                parts.append(blob(bx, by, rnd.uniform(4.2, 6), rnd.uniform(2.4, 3.4), math.degrees(ang) + 90))
            els.append("".join(parts))
    # pintas soltas entre as rosetas
    for _ in range(10):
        els.append(blob(rnd.uniform(0, SIZE), rnd.uniform(0, SIZE), rnd.uniform(1.6, 2.6), rnd.uniform(1.4, 2.2), rnd.uniform(0, 180)))

    body = "".join(els)
    tiled = "".join(f'<g transform="translate({dx} {dy})">{body}</g>' for dx in (-SIZE, 0, SIZE) for dy in (-SIZE, 0, SIZE))
    return svg(tiled, size=SIZE, opacity=0.62)

def laptop(c):
    return f'<path d="M-7-6H7V3H-7ZM-10 3h20l-1.6 3H-8.4Z" {S.format(c=c)}/>'

def code(c):
    return f'<path d="M-4-4-8 0l4 4M4-4l4 4-4 4M1.5-6-1.5 6" {S.format(c=c)}/>'

def chip(c):
    return f'<path d="M-5-5H5V5H-5ZM-2-2H2V2H-2ZM-3-5V-8M0-5V-8M3-5V-8M-3 5V8M0 5V8M3 5V8M-5-3H-8M-5 0H-8M-5 3H-8M5-3H8M5 0H8M5 3H8" {S.format(c=c)}/>'

def wifi(c):
    return f'<path d="M-8-1c4.6-4.4 11.4-4.4 16 0M-5 2.4c2.8-2.6 7.2-2.6 10 0M-2 5.6c1.2-1 2.8-1 4 0" {S.format(c=c)}/><circle cy="8.4" r="1.1" fill="{c}"/>'

def cursor(c):
    return f'<path d="M-4-7V5l3.2-3 2.4 5.4 2.2-1-2.4-5.2H5.6Z" {S.format(c=c)}/>'

def layout(f, c):
    """Seis elementos espalhados num ladrilho de 80x80, alternando tamanho e giro."""
    pos = [(14, 14, -12, 1), (52, 10, 18, .85), (34, 38, 8, 1.05), (70, 42, -20, .9), (12, 60, 24, .9), (52, 68, -6, 1)]
    return [(f[i % len(f)](c), x, y, r, s) for i, (x, y, r, s) in enumerate(pos)]

PEOPLE = {
    'bruno':   [pine, rock, tree_round, leaf],
    'daiane':  [spiral, squiggle, star_doodle, smiley, heart_line],
    'diego':   [ball, goal, whistle, flag],
    'joao':    [laptop, code, chip, wifi, cursor],
    'livia':   [note8, note16],
    'isabela': [flower],
}
COLOR = {'bruno': '#1e5b47', 'daiane': '#ad2f38', 'diego': '#6a4228', 'joao': '#553685', 'livia': '#2a567f', 'isabela': '#c48a00'}

out = ["/* Gerado por scripts/patterns.py: estampas de fundo de cada cartão */"]
for pid, fns in PEOPLE.items():
    c = COLOR[pid]
    op = 0.32 if pid == 'isabela' else 0.2
    out.append(f"[data-person='{pid}'] {{\n  --t-pattern: url('{uri(svg(place(layout(fns, c)), opacity=op))}');\n}}")
out.append(f"[data-person='marcia'] {{\n  --t-pattern: url('{uri(leopard())}');\n}}")
pathlib.Path(__file__).resolve().parent.parent.joinpath('src/patterns.css').write_text("\n".join(out) + "\n")
print("ok")
