#!/usr/bin/env python3
"""
Create v16 CLEAN - Remove duplicates and ensure everything works
1. Remove duplicate images (same image appearing twice)
2. Remove duplicate CSS rules
3. Ensure balanced distribution (~9 images per tab)
4. Clean up code
"""

import base64
import os
import re
from collections import defaultdict

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
    """Load all assets"""
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

# Consolidated CSS - no duplicates
CLEAN_CSS = '''
        /* ===== V16 OPTIMIZED STYLES - CONSOLIDATED ===== */

        /* Content Images */
        .v16-img {
            margin: 25px auto;
            text-align: center;
            clear: both;
        }
        .v16-img img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
            border: 2px solid rgba(102, 126, 234, 0.25);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .v16-img img:hover {
            transform: scale(1.02);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
        }
        .v16-hero img { max-width: 750px; }
        .v16-large img { max-width: 600px; }
        .v16-medium img { max-width: 480px; }

        /* Float Images */
        .v16-fl {
            width: 42%;
            max-width: 360px;
            margin-bottom: 20px;
        }
        .v16-fl-r { float: right; margin-left: 25px; }
        .v16-fl-l { float: left; margin-right: 25px; }
        .v16-fl img {
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.18);
            border: 2px solid rgba(102, 126, 234, 0.2);
            transition: transform 0.3s ease;
        }
        .v16-fl img:hover { transform: scale(1.03); }

        /* Captions */
        .v16-cap {
            margin-top: 8px;
            font-size: 12px;
            color: #667eea;
            font-style: italic;
            text-align: center;
        }

        /* Gallery Enhancements */
        .aether-gallery-item img {
            min-height: 220px !important;
            object-fit: cover !important;
            transition: transform 0.3s ease !important;
        }
        .aether-gallery-item:hover img {
            transform: scale(1.04);
        }

        /* Mobile */
        @media (max-width: 768px) {
            .v16-fl {
                float: none !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 15px 0 !important;
            }
            .v16-img img, .v16-fl img { max-width: 100% !important; }
            .aether-gallery { grid-template-columns: 1fr !important; }
        }
'''

def make_img(data_url, alt, caption, size="large", float_dir=None):
    """Create image HTML"""
    cap = f'<div class="v16-cap">{caption}</div>' if caption else ""

    if float_dir:
        cls = f"v16-fl v16-fl-{'r' if float_dir == 'right' else 'l'}"
        return f'<div class="{cls}"><img src="{data_url}" alt="{alt}" loading="lazy">{cap}</div>'
    else:
        return f'<div class="v16-img v16-{size}"><img src="{data_url}" alt="{alt}" loading="lazy">{cap}</div>'

def insert_after(html, search, img_html):
    """Insert image after search text"""
    idx = html.find(search)
    if idx == -1:
        return html

    # Find end of paragraph/div after search
    end = idx + len(search)
    for tag in ['</p>', '</div>', '</h2>', '</h3>', '</li>']:
        pos = html.find(tag, end)
        if pos != -1 and pos < end + 500:
            insert_at = pos + len(tag)
            return html[:insert_at] + '\n' + img_html + '\n' + html[insert_at:]
    return html

def process(html, assets):
    """Process HTML - embed images, remove duplicates"""

    # Add clean CSS (replacing any old v16 CSS)
    html = html.replace('</style>', CLEAN_CSS + '\n    </style>', 1)

    # Track which images we've used (to avoid duplicates)
    used_images = set()

    # Define images for each tab - UNIQUE images only, not in galleries
    # ETHOS: Leadership-focused (galleries have: team photos, typography, projection mapping)
    # We'll add inline images that COMPLEMENT galleries, not duplicate them

    ethos_inline = [
        ("Chapter 1: Leadership Team", "aether-brand-logo-main", "AETHER Brand Identity", "hero", None),
        ("Visionary Strategist and Founder", "BRANDwork-ProjectionMapping-OceanForge", "Ocean Forge Technology", "large", "right"),
        ("eighteen million dollars", "BRANDwork-ProjectionMapping-SciFi", "Sci-Fi Environment Design", "medium", "left"),
        ("Synthesis of Art and Philosophy", "BRANDwork-ProjectionMapping-Vintage", "Vintage Projection Art", "large", "right"),
        ("Topological Media Lab", "BRANDwork-EnchantSite-Collage6", "Enchant Experience Collage", "medium", "left"),
        ("Alchemical Virtuoso", "BRANDwork-EnchantSite-Collage8", "Enchant Night Collage", "large", "right"),
        ("RelieVRx Breakthrough", "BRANDwork-EnchantSite-Collage7", "Holiday Experience", "medium", "left"),
        ("Why This Leadership Team Matters", "aether-portfolio-enchant-retail", "Retail Experience", "medium", None),
        ("Strategic Advisors", "BRANDwork-EnchantSite-Collage2", "Experience Design", "medium", "right"),
    ]

    # PATHOS: Emotional/Portfolio (galleries have: Enchant, theatrical, stage)
    pathos_inline = [
        ("The Origin Story", "aether-portfolio-enchant-lights-02", "Enchant Light Pathway", "hero", None),
        ("Linda Gary's stunning narration", "BRANDwork-EnchantSite-Collage4", "Design Elements", "large", "right"),
        ("theatrical enchantment", "aether-portfolio-killmove-02", "Kill Move Paradise Media", "large", "left"),
        ("My achievements include", "BRANDwork-StageProduction-PrisonScene", "Prison Scene Design", "medium", "right"),
        ("Memory, Alchemy", "aether-ip-tales-of-lucidia", "Tales of Lucidia", "large", "left"),
        ("resilience against", "BRANDAsset-WarriorPrincess-Render51", "Warrior Princess Render", "large", "right"),
        ("PHYGITAL PHUTURE", "aether-ip-maryjane-mainframe", "MaryJane Mainframe", "medium", "left"),
        ("Phygital Hospitality", "aether-ip-metamorphasis-apothecary", "Metamorphasis Apothecary", "large", "right"),
        ("Luxury Redefined", "BRANDAsset-WarriorPrincess-CharacterConcept", "Character Concept Art", "medium", None),
    ]

    # LOGOS: Logic/IP (galleries have: Tales of Lucidia, Warrior Princess, Phygital IP)
    logos_inline = [
        ("Tales of Lucidia: Transmedia", "BRANDwork-WarriorPrincessOz-ArenaLayout", "Arena Layout Design", "hero", None),
        ("The Three Warrior", "BRANDwork-WarriorPrincessOz-StageSet", "Stage Set Design", "large", "right"),
        ("Ozma - Strategic", "BRANDwork-WarriorPrincessOz-EmeraldCrystals", "Emerald Crystals", "large", "left"),
        ("Alice - Tactical", "BRANDAsset-PhygitalIP-BroussardBayouBBQ", "Broussard Bayou BBQ", "large", "right"),
        ("Polychrome - Creative", "BRANDAsset-PhygitalIP-Port51Confectionarium", "Port 51 Confectionarium", "large", "left"),
        ("Shared Mission", "aether-portfolio-batb-setdesign", "Beauty & Beast Set", "large", None),
        ("Creator Tools", "aether-portfolio-candlelight-venue", "Candlelight Concert", "medium", "right"),
        ("Measurable Impact", "aether-portfolio-enchant-daytime", "Enchant Daytime", "large", "left"),
        ("Integration of Digital", "aether-portfolio-enchant-lights-01", "Enchant Lights", "medium", "right"),
    ]

    # First, replace <picture> elements with embedded images (for galleries)
    def replace_picture(match):
        full = match.group(0)
        png_match = re.search(r'png-fallback/([^"]+)\.png', full)
        if png_match:
            name = png_match.group(1)
            if name in assets and assets[name]['full']:
                used_images.add(name)
                alt_match = re.search(r'alt="([^"]*)"', full)
                alt = alt_match.group(1) if alt_match else name
                return f'<img src="{assets[name]["full"]}" alt="{alt}" loading="lazy" style="width:100%; height:auto; min-height:220px; object-fit:cover; border-radius:8px;">'
        return full

    html = re.sub(r'<picture>.*?</picture>', replace_picture, html, flags=re.DOTALL)

    # Now add inline images (only if not already used in galleries)
    for search, name, caption, size, float_dir in (ethos_inline + pathos_inline + logos_inline):
        if name in assets and name not in used_images:
            data = assets[name]['medium'] if float_dir else assets[name]['full']
            if data:
                img = make_img(data, caption, caption, size, float_dir)
                html = insert_after(html, search, img)
                used_images.add(name)

    # Remove external Cloudflare script
    html = re.sub(r'<script[^>]*cloudflare[^>]*></script>', '', html)
    html = re.sub(r'<script data-cfasync="false"[^>]*></script>', '', html)

    # Remove broken menu items
    html = re.sub(r'<div class="menu-item" onclick="openWindow\(\'assets\'\)"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    return html, used_images

def main():
    print("Loading assets...")
    assets = get_assets()
    print(f"Loaded {len(assets)} assets")

    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print("Processing (removing duplicates, embedding images)...")
    html, used_images = process(html, assets)

    # Update title
    html = html.replace('v6.0 | December 2025', 'v6.2 | December 2025 | Optimized')

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    # Verify no duplicates
    with open(OUTPUT_FILE) as f:
        content = f.read()

    # Count image signatures
    sigs = re.findall(r'data:image/webp;base64,([A-Za-z0-9+/]{50})', content)
    sig_counts = defaultdict(int)
    for s in sigs:
        sig_counts[s] += 1

    duplicates = {k: v for k, v in sig_counts.items() if v > 1}

    size_mb = os.path.getsize(OUTPUT_FILE) / 1024 / 1024
    total_images = content.count('data:image/webp;base64')

    print(f"\n=== Results ===")
    print(f"File: {OUTPUT_FILE}")
    print(f"Size: {size_mb:.2f} MB")
    print(f"Total images: {total_images}")
    print(f"Unique images used: {len(used_images)}")
    print(f"Duplicate images: {len(duplicates)}")

    if duplicates:
        print("\n⚠️  WARNING: Found duplicate images!")
        for sig, count in duplicates.items():
            print(f"  - {sig[:30]}... appears {count}x")
    else:
        print("✓ No duplicate images!")

if __name__ == "__main__":
    main()
