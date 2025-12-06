#!/usr/bin/env python3
"""
Create v16 optimized version with:
1. Better balanced image distribution (~9 per tab)
2. Optimized image sizes using webp-medium for inline
3. Enhanced CSS for mobile and performance
4. More strategic image placements
"""

import base64
import os
import re

# Paths
WEBP_DIR = "aether-website-assets/webp"
WEBP_MEDIUM_DIR = "aether-website-assets/webp-medium"
INPUT_FILE = "aether-matrix-v15-pxr-embedded.html"
OUTPUT_FILE = "aether-matrix-v16-optimized.html"

def load_image_as_base64(filepath):
    """Load an image file and return base64 data URL"""
    if os.path.exists(filepath):
        with open(filepath, 'rb') as f:
            data = base64.b64encode(f.read()).decode('utf-8')
        return f"data:image/webp;base64,{data}"
    return None

def get_optimized_asset(name, use_medium=True):
    """Get asset, preferring medium size for inline images"""
    if use_medium:
        medium_path = os.path.join(WEBP_MEDIUM_DIR, f"{name}_800w.webp")
        if os.path.exists(medium_path):
            return load_image_as_base64(medium_path)

    full_path = os.path.join(WEBP_DIR, f"{name}.webp")
    return load_image_as_base64(full_path)

def get_all_assets():
    """Get all assets"""
    assets = {}
    for f in os.listdir(WEBP_DIR):
        if f.endswith('.webp'):
            name = f.replace('.webp', '')
            assets[name] = {
                'full': load_image_as_base64(os.path.join(WEBP_DIR, f)),
                'medium': get_optimized_asset(name, use_medium=True)
            }
    return assets

def create_inline_image(data_url, alt, caption=None, style="large"):
    """Create an inline image HTML with enhanced styling"""
    size_styles = {
        "large": "width: 100%; max-width: 650px; height: auto;",
        "medium": "width: 100%; max-width: 500px; height: auto;",
        "hero": "width: 100%; max-width: 800px; height: auto;",
    }
    img_style = size_styles.get(style, size_styles["large"])
    caption_html = f'<div class="img-caption">{caption}</div>' if caption else ""

    return f'''
<div class="content-image content-image-{style}">
    <img src="{data_url}" alt="{alt}" loading="lazy">
    {caption_html}
</div>
'''

def create_float_image(data_url, alt, caption=None, float_dir="right"):
    """Create a floating image"""
    caption_html = f'<div class="img-caption">{caption}</div>' if caption else ""

    return f'''
<div class="content-image-float content-image-float-{float_dir}">
    <img src="{data_url}" alt="{alt}" loading="lazy">
    {caption_html}
</div>
'''

# Enhanced CSS to add
ENHANCED_CSS = '''
        /* ===== V16 OPTIMIZED STYLES ===== */

        /* Content Images - Inline */
        .content-image {
            margin: 30px auto;
            text-align: center;
            clear: both;
        }

        .content-image img {
            width: 100%;
            height: auto;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25);
            border: 3px solid rgba(102, 126, 234, 0.3);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .content-image-hero img { max-width: 850px; }
        .content-image-large img { max-width: 700px; }
        .content-image-medium img { max-width: 550px; }

        .content-image img:hover {
            transform: scale(1.02) translateY(-4px);
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.35);
        }

        /* Floating Images */
        .content-image-float {
            width: 45%;
            max-width: 400px;
            margin-bottom: 25px;
        }

        .content-image-float-right {
            float: right;
            margin-left: 30px;
        }

        .content-image-float-left {
            float: left;
            margin-right: 30px;
        }

        .content-image-float img {
            width: 100%;
            height: auto;
            border-radius: 14px;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
            border: 2px solid rgba(102, 126, 234, 0.25);
            transition: all 0.3s ease;
        }

        .content-image-float img:hover {
            transform: scale(1.03);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
        }

        /* Image Captions */
        .img-caption {
            margin-top: 12px;
            font-size: 13px;
            color: #667eea;
            font-style: italic;
            font-weight: 500;
            text-align: center;
        }

        /* Gallery Enhancements */
        .aether-gallery-item {
            min-width: 300px !important;
            flex: 1 1 300px !important;
        }

        .aether-gallery-item img {
            min-height: 260px !important;
            object-fit: cover !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }

        .aether-gallery-item:hover img {
            transform: scale(1.05);
            box-shadow: 0 15px 45px rgba(102, 126, 234, 0.3);
        }

        /* Clearfix */
        .window-content > p,
        .window-content > .highlight-box,
        .window-content > .takeaway-box {
            overflow: hidden;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .content-image-float {
                float: none !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 20px 0 !important;
            }

            .content-image img,
            .content-image-float img {
                max-width: 100% !important;
            }

            .aether-gallery {
                grid-template-columns: 1fr !important;
            }

            .aether-gallery-item {
                min-width: 100% !important;
            }
        }

        @media (max-width: 480px) {
            .content-image img {
                border-radius: 10px;
            }

            .img-caption {
                font-size: 12px;
            }
        }

        /* Performance: GPU acceleration */
        .content-image img,
        .content-image-float img,
        .aether-gallery-item img {
            will-change: transform;
            backface-visibility: hidden;
        }
'''

def insert_image_after_text(html, search_text, image_html, occurrence=1):
    """Insert image HTML after finding specific text"""
    pattern = re.escape(search_text)
    matches = list(re.finditer(pattern, html, re.IGNORECASE))

    if matches and len(matches) >= occurrence:
        match = matches[occurrence - 1]
        # Find end of containing element
        end_pos = match.end()

        # Look for closing tags
        for end_tag in ['</p>', '</div>', '</li>', '</h2>', '</h3>']:
            tag_pos = html.find(end_tag, end_pos)
            if tag_pos != -1 and tag_pos < end_pos + 800:
                insert_pos = tag_pos + len(end_tag)
                return html[:insert_pos] + '\n' + image_html + '\n' + html[insert_pos:]

    return html

def process_html(html, assets):
    """Process HTML with optimized images"""

    # Add enhanced CSS
    html = html.replace('</style>', ENHANCED_CSS + '\n    </style>', 1)

    # ===== ETHOS TAB IMAGES (need ~9) =====
    ethos_insertions = [
        # 1. After Chapter 1 Leadership header
        ("Chapter 1: Leadership Team", "aether-brand-logo-main", "AETHER Brand Identity", "hero", "center"),
        # 2. After CTCH founder intro
        ("Visionary Strategist and Founder", "aether-team-founder-ctch", "Christian Charles-Harris — Founder & CEO", "large", "right"),
        # 3. After entrepreneurial track record
        ("eighteen million dollars in profit", "BRANDwork-ProjectionMapping-CircuitNeuron", "Neural Technology Integration", "medium", "left"),
        # 4. After Sha Xin Wei section starts
        ("Synthesis of Art and Philosophy", "aether-team-cofounder-shaxinwei", "Dr. Sha Xin Wei — Co-Founder & CTO", "large", "right"),
        # 5. After topological media lab
        ("Topological Media Lab", "BRANDwork-ProjectionMapping-GridMatrix", "Grid Matrix Technology Platform", "medium", "left"),
        # 6. After Vangelis section starts
        ("Alchemical Virtuoso", "aether-team-cofounder-vangelis", "Dr. Vangelis Lympouridis — Co-Founder & CSO", "large", "right"),
        # 7. After RelieVRx mention
        ("RelieVRx Breakthrough", "BRANDwork-ProjectionMapping-CosmicEye", "Cosmic Eye Immersive Projection", "medium", "left"),
        # 8. After Why This Leadership Team Matters
        ("Why This Leadership Team Matters", "BRANDAsset-Typography3D-AlchemicalArtisans", "Alchemical Artisans Brand", "medium", "center"),
        # 9. After Strategic Advisors
        ("Strategic Advisors: Industry Wisdom", "aether-brand-ctch-logotype", "CTCH Brand Identity", "medium", "right"),
    ]

    # ===== PATHOS TAB IMAGES (already has ~10, balance to 9) =====
    pathos_insertions = [
        # 1. After Origin Story header
        ("The Origin Story", "aether-portfolio-enchant-lights-01", "Enchant Christmas — Immersive Light Installation", "hero", "center"),
        # 2. After Disneyland memory
        ("spellbound by Linda Gary", "aether-portfolio-enchant-daytime", "Enchant Daytime Experience", "large", "right"),
        # 3. After theatrical enchantment mention
        ("theatrical enchantment, cirque audacity", "aether-portfolio-killmove-01", "Kill Move Paradise — Stage Production", "large", "left"),
        # 4. After My achievements include
        ("My achievements include", "BRANDwork-EnchantSite-Collage2", "Immersive Experience Moments", "medium", "right"),
        # 5. After Memory Alchemy section
        ("Memory, Alchemy, and the Cult", "BRANDwork-StageProduction-GhostProjection", "Ghost Projection Technology", "large", "left"),
        # 6. After resilience mention
        ("resilience against the suppression", "aether-portfolio-batb-setdesign", "Beauty & The Beast Set Design", "large", "right"),
        # 7. After philosophy section
        ("PHYGITAL Experiential Alchemy", "BRANDwork-EnchantSite-Collage7", "Holiday Magic Experience", "medium", "left"),
        # 8. After Hospitality section
        ("Phygital Hospitality Revolution", "aether-portfolio-candlelight-venue", "Candlelight Concert Venue", "large", "right"),
        # 9. After travel experiences
        ("Luxury Redefined", "BRANDwork-EnchantSite-Collage4", "Experience Design Elements", "medium", "center"),
    ]

    # ===== LOGOS TAB IMAGES (need ~9) =====
    logos_insertions = [
        # 1. After Tales of Lucidia header
        ("Tales of Lucidia: Transmedia Franchise", "aether-ip-tales-of-lucidia", "Tales of Lucidia — Warrior Princess IP", "hero", "center"),
        # 2. After Three Warrior Princesses
        ("The Three Warrior Princesses", "BRANDAsset-WarriorPrincess-CharacterConcept", "Warrior Princess Character Concept", "large", "right"),
        # 3. After Ozma description
        ("Ozma - Strategic Leader", "aether-ip-maryjane-mainframe", "MaryJane Mainframe IP", "large", "left"),
        # 4. After Alice description
        ("Alice - Tactical Innovator", "BRANDAsset-WarriorPrincess-Render51", "Warrior Princess 3D Render", "large", "right"),
        # 5. After Polychrome description
        ("Polychrome - Creative Force", "aether-ip-metamorphasis-apothecary", "Metamorphasis Apothecary", "large", "left"),
        # 6. After Shared Mission
        ("Shared Mission", "BRANDwork-WarriorPrincessOz-EmeraldCrystals", "Emerald Crystals Environment", "large", "center"),
        # 7. After Creator Tools section
        ("Creator Tools & Democratization", "BRANDAsset-PhygitalIP-BroussardBayouBBQ", "Broussard Bayou BBQ Brand", "medium", "right"),
        # 8. After Measurable Impact
        ("Measurable Impact & ROI", "BRANDwork-WarriorPrincessOz-ArenaLayout", "Arena Experience Layout", "large", "left"),
        # 9. After Integration section
        ("Integration of Digital and Physical", "BRANDwork-WarriorPrincessOz-StageSet", "Warrior Princess Stage Set", "medium", "right"),
    ]

    all_insertions = ethos_insertions + pathos_insertions + logos_insertions

    for search_text, asset_name, caption, size, position in all_insertions:
        if asset_name in assets:
            # Use medium size for floating images, full for hero/large center
            use_full = (size == "hero" or (size == "large" and position == "center"))
            data_url = assets[asset_name]['full'] if use_full else assets[asset_name]['medium']

            if data_url:
                if position in ["left", "right"]:
                    img_html = create_float_image(data_url, caption, caption, position)
                else:
                    img_html = create_inline_image(data_url, caption, caption, size)

                html = insert_image_after_text(html, search_text, img_html)

    return html

def main():
    print("Loading optimized assets...")
    assets = get_all_assets()
    print(f"Loaded {len(assets)} assets with full and medium variants")

    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print("Processing with optimized image distribution...")
    html = process_html(html, assets)

    # Update version
    html = html.replace('v6.1 | December 2025 | Embedded Assets',
                        'v6.2 | December 2025 | Optimized')

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    file_size = os.path.getsize(OUTPUT_FILE) / 1024 / 1024
    print(f"Done! Output: {OUTPUT_FILE}")
    print(f"File size: {file_size:.2f} MB")

    # Count images
    with open(OUTPUT_FILE, 'r') as f:
        content = f.read()

    total_base64 = content.count('data:image/webp;base64')
    float_images = content.count('content-image-float')
    inline_images = content.count('content-image content-image-')

    print(f"\n=== Image Statistics ===")
    print(f"Total base64 images: {total_base64}")
    print(f"New floating images: {float_images}")
    print(f"New inline images: {inline_images}")

if __name__ == "__main__":
    main()
