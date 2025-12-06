#!/usr/bin/env python3
"""
Create CLEAN v16 from v14 original with:
1. 9 images per tab distributed throughout text
2. Optimized medium-size images for inline use
3. Full-size for galleries
4. Enhanced mobile-responsive CSS
5. Performance optimizations
"""

import base64
import os
import re

WEBP_DIR = "aether-website-assets/webp"
WEBP_MEDIUM_DIR = "aether-website-assets/webp-medium"
INPUT_FILE = "aether-matrix-v14-pxr-comprehensive.html"
OUTPUT_FILE = "aether-matrix-v16-optimized.html"

def load_base64(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'rb') as f:
            return f"data:image/webp;base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return None

def get_assets():
    """Load all assets with full and medium variants"""
    assets = {}
    for f in os.listdir(WEBP_DIR):
        if f.endswith('.webp'):
            name = f.replace('.webp', '')
            full_path = os.path.join(WEBP_DIR, f)
            medium_path = os.path.join(WEBP_MEDIUM_DIR, f"{name}_800w.webp")

            assets[name] = {
                'full': load_base64(full_path),
                'medium': load_base64(medium_path) if os.path.exists(medium_path) else load_base64(full_path)
            }
    return assets

# Enhanced CSS
ENHANCED_CSS = '''
        /* ===== V16 OPTIMIZED IMAGE STYLES ===== */

        /* Inline Content Images */
        .v16-image {
            margin: 28px auto;
            text-align: center;
            clear: both;
        }

        .v16-image img {
            width: 100%;
            height: auto;
            border-radius: 14px;
            box-shadow: 0 10px 35px rgba(102, 126, 234, 0.22);
            border: 2px solid rgba(102, 126, 234, 0.28);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .v16-hero img { max-width: 800px; }
        .v16-large img { max-width: 650px; }
        .v16-medium img { max-width: 500px; }

        .v16-image img:hover {
            transform: scale(1.02) translateY(-3px);
            box-shadow: 0 18px 50px rgba(102, 126, 234, 0.32);
        }

        /* Floating Images */
        .v16-float {
            width: 44%;
            max-width: 380px;
            margin-bottom: 22px;
        }

        .v16-float-right {
            float: right;
            margin-left: 28px;
        }

        .v16-float-left {
            float: left;
            margin-right: 28px;
        }

        .v16-float img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 8px 28px rgba(102, 126, 234, 0.18);
            border: 2px solid rgba(102, 126, 234, 0.22);
            transition: all 0.3s ease;
        }

        .v16-float img:hover {
            transform: scale(1.03);
            box-shadow: 0 12px 38px rgba(102, 126, 234, 0.28);
        }

        /* Captions */
        .v16-caption {
            margin-top: 10px;
            font-size: 12.5px;
            color: #667eea;
            font-style: italic;
            font-weight: 500;
            text-align: center;
        }

        /* Enhanced Gallery Sizing */
        .aether-gallery-item {
            min-width: 290px !important;
        }

        .aether-gallery-item img {
            min-height: 240px !important;
            object-fit: cover !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }

        .aether-gallery-item:hover img {
            transform: scale(1.04);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.28);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .v16-float {
                float: none !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 18px 0 !important;
            }

            .v16-image img,
            .v16-float img {
                max-width: 100% !important;
                border-radius: 10px;
            }

            .aether-gallery {
                grid-template-columns: 1fr !important;
            }
        }

        /* Performance Optimizations */
        .v16-image img,
        .v16-float img,
        .aether-gallery-item img {
            will-change: transform;
            backface-visibility: hidden;
        }
'''

def make_inline_img(data_url, alt, caption, size="large"):
    cap = f'<div class="v16-caption">{caption}</div>' if caption else ""
    return f'''
<div class="v16-image v16-{size}">
    <img src="{data_url}" alt="{alt}" loading="lazy">
    {cap}
</div>
'''

def make_float_img(data_url, alt, caption, direction="right"):
    cap = f'<div class="v16-caption">{caption}</div>' if caption else ""
    return f'''
<div class="v16-float v16-float-{direction}">
    <img src="{data_url}" alt="{alt}" loading="lazy">
    {cap}
</div>
'''

def insert_after(html, search, img_html, nth=1):
    """Insert image after nth occurrence of search text"""
    pattern = re.escape(search)
    matches = list(re.finditer(pattern, html, re.IGNORECASE))

    if len(matches) >= nth:
        pos = matches[nth-1].end()
        # Find next closing tag
        for tag in ['</p>', '</div>', '</li>', '</h2>', '</h3>', '</span>']:
            idx = html.find(tag, pos)
            if idx != -1 and idx < pos + 600:
                insert_at = idx + len(tag)
                return html[:insert_at] + '\n' + img_html + '\n' + html[insert_at:]
    return html

def replace_pictures(html, assets):
    """Replace <picture> elements with embedded base64 img tags"""
    def replacer(match):
        full = match.group(0)
        png_match = re.search(r'png-fallback/([^"]+)\.png', full)
        if png_match:
            name = png_match.group(1)
            if name in assets and assets[name]['full']:
                alt_match = re.search(r'alt="([^"]*)"', full)
                alt = alt_match.group(1) if alt_match else name
                return f'<img src="{assets[name]["full"]}" alt="{alt}" loading="lazy" style="width:100%; height:auto; min-height:240px; object-fit:cover; border-radius:10px;">'
        return full

    return re.sub(r'<picture>.*?</picture>', replacer, html, flags=re.DOTALL)

def process(html, assets):
    # Add CSS
    html = html.replace('</style>', ENHANCED_CSS + '\n    </style>', 1)

    # Replace picture elements with embedded images
    html = replace_pictures(html, assets)

    # ===== ETHOS TAB: 9 images =====
    ethos = [
        ("Chapter 1: Leadership Team", "aether-brand-logo-main", "AETHER Brand Identity", "hero", "center"),
        ("Visionary Strategist and Founder", "aether-team-founder-ctch", "Christian Charles-Harris — Founder", "large", "right"),
        ("eighteen million dollars in profit", "BRANDwork-ProjectionMapping-CircuitNeuron", "Neural Circuit Technology", "medium", "left"),
        ("Synthesis of Art and Philosophy", "aether-team-cofounder-shaxinwei", "Dr. Sha Xin Wei — Co-Founder", "large", "right"),
        ("Topological Media Lab", "BRANDwork-ProjectionMapping-GridMatrix", "Grid Matrix Platform", "medium", "left"),
        ("Alchemical Virtuoso", "aether-team-cofounder-vangelis", "Dr. Vangelis Lympouridis — Co-Founder", "large", "right"),
        ("RelieVRx Breakthrough", "BRANDwork-ProjectionMapping-CosmicEye", "Cosmic Eye Projection", "medium", "left"),
        ("Why This Leadership Team Matters", "BRANDAsset-Typography3D-AlchemicalArtisans", "Alchemical Artisans", "medium", "center"),
        ("Strategic Advisors: Industry Wisdom", "aether-brand-ctch-logotype", "CTCH Brand Identity", "medium", "right"),
    ]

    # ===== PATHOS TAB: 9 images =====
    pathos = [
        ("The Origin Story", "aether-portfolio-enchant-lights-01", "Enchant Christmas Light Installation", "hero", "center"),
        ("Linda Gary's stunning narration", "aether-portfolio-enchant-daytime", "Enchant Daytime Magic", "large", "right"),
        ("theatrical enchantment, cirque audacity", "aether-portfolio-killmove-01", "Kill Move Paradise Production", "large", "left"),
        ("My achievements include", "BRANDwork-EnchantSite-Collage2", "Experience Moments", "medium", "right"),
        ("Memory, Alchemy, and the Cult", "BRANDwork-StageProduction-GhostProjection", "Ghost Projection Effect", "large", "left"),
        ("resilience against the suppression", "aether-portfolio-batb-setdesign", "Beauty & The Beast Set Design", "large", "right"),
        ("PHYGITAL PHUTURE", "BRANDwork-EnchantSite-Collage7", "Holiday Magic", "medium", "left"),
        ("Phygital Hospitality Revolution", "aether-portfolio-candlelight-venue", "Candlelight Concert Venue", "large", "right"),
        ("Luxury Redefined", "BRANDwork-EnchantSite-Collage4", "Design Elements", "medium", "center"),
    ]

    # ===== LOGOS TAB: 9 images =====
    logos = [
        ("Tales of Lucidia: Transmedia Franchise", "aether-ip-tales-of-lucidia", "Tales of Lucidia — Key Art", "hero", "center"),
        ("The Three Warrior Princesses", "BRANDAsset-WarriorPrincess-CharacterConcept", "Warrior Princess Concept", "large", "right"),
        ("Ozma - Strategic Leader", "aether-ip-maryjane-mainframe", "MaryJane Mainframe IP", "large", "left"),
        ("Alice - Tactical Innovator", "BRANDAsset-WarriorPrincess-Render51", "Warrior Princess Render", "large", "right"),
        ("Polychrome - Creative Force", "aether-ip-metamorphasis-apothecary", "Metamorphasis Apothecary", "large", "left"),
        ("Shared Mission", "BRANDwork-WarriorPrincessOz-EmeraldCrystals", "Emerald Crystals Environment", "large", "center"),
        ("Creator Tools & Democratization", "BRANDAsset-PhygitalIP-BroussardBayouBBQ", "Broussard Bayou BBQ", "medium", "right"),
        ("Measurable Impact & ROI", "BRANDwork-WarriorPrincessOz-ArenaLayout", "Arena Experience Layout", "large", "left"),
        ("Integration of Digital and Physical", "BRANDwork-WarriorPrincessOz-StageSet", "Stage Set Design", "medium", "right"),
    ]

    all_insertions = ethos + pathos + logos

    for search, name, caption, size, pos in all_insertions:
        if name in assets:
            # Use medium for floats, full for hero/center
            use_full = (size == "hero") or (pos == "center")
            data = assets[name]['full'] if use_full else assets[name]['medium']

            if data:
                if pos in ["left", "right"]:
                    img = make_float_img(data, caption, caption, pos)
                else:
                    img = make_inline_img(data, caption, caption, size)
                html = insert_after(html, search, img)

    return html

def main():
    print("Loading assets...")
    assets = get_assets()
    print(f"Loaded {len(assets)} assets")

    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print("Processing...")
    html = process(html, assets)

    # Update title
    html = html.replace('v6.0 | December 2025', 'v6.2 | December 2025 | Optimized Edition')

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    size_mb = os.path.getsize(OUTPUT_FILE) / 1024 / 1024
    print(f"\nDone! File: {OUTPUT_FILE}")
    print(f"Size: {size_mb:.2f} MB")

    # Stats
    with open(OUTPUT_FILE) as f:
        c = f.read()
    print(f"\n=== Statistics ===")
    print(f"Total base64 images: {c.count('data:image/webp;base64')}")
    print(f"Float images: {c.count('v16-float')}")
    print(f"Inline images: {c.count('v16-image v16-')}")

if __name__ == "__main__":
    main()
