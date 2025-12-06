#!/usr/bin/env python3
"""
Transform aether-matrix-v14 to v15 with:
1. Base64 embedded webp images
2. ~9 images per tab distributed throughout text
3. Larger image sizes
"""

import base64
import os
import re

# Paths
WEBP_DIR = "aether-website-assets/webp"
INPUT_FILE = "aether-matrix-v14-pxr-comprehensive.html"
OUTPUT_FILE = "aether-matrix-v15-pxr-embedded.html"

def load_webp_as_base64(filename):
    """Load a webp file and return base64 data URL"""
    filepath = os.path.join(WEBP_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'rb') as f:
            data = base64.b64encode(f.read()).decode('utf-8')
        return f"data:image/webp;base64,{data}"
    return None

def get_all_assets():
    """Get all webp assets organized by category"""
    assets = {}
    for f in os.listdir(WEBP_DIR):
        if f.endswith('.webp'):
            name = f.replace('.webp', '')
            assets[name] = load_webp_as_base64(f)
    return assets

def create_inline_image(data_url, alt, caption=None, style="large"):
    """Create an inline image HTML with enhanced styling"""
    size_styles = {
        "large": "width: 100%; max-width: 700px; height: auto;",
        "medium": "width: 100%; max-width: 550px; height: auto;",
        "float-right": "width: 45%; max-width: 400px; float: right; margin: 0 0 20px 25px;",
        "float-left": "width: 45%; max-width: 400px; float: left; margin: 0 25px 20px 0;",
        "hero": "width: 100%; max-width: 900px; height: auto;",
    }

    img_style = size_styles.get(style, size_styles["large"])

    caption_html = ""
    if caption:
        caption_html = f'<div class="inline-image-caption" style="text-align: center; font-size: 13px; color: #667eea; margin-top: 8px; font-style: italic;">{caption}</div>'

    return f'''
<div class="inline-image-block" style="margin: 25px auto; text-align: center; clear: both;">
    <img src="{data_url}" alt="{alt}" style="{img_style} border-radius: 12px; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25); border: 2px solid rgba(102, 126, 234, 0.3);">
    {caption_html}
</div>
'''

def create_float_image(data_url, alt, caption=None, float_dir="right"):
    """Create a floating image for text wrapping"""
    margin = "0 0 20px 30px" if float_dir == "right" else "0 30px 20px 0"

    caption_html = ""
    if caption:
        caption_html = f'<div style="text-align: center; font-size: 12px; color: #667eea; margin-top: 6px; font-style: italic;">{caption}</div>'

    return f'''
<div style="float: {float_dir}; width: 42%; max-width: 380px; margin: {margin};">
    <img src="{data_url}" alt="{alt}" style="width: 100%; height: auto; border-radius: 10px; box-shadow: 0 6px 24px rgba(102, 126, 234, 0.2); border: 2px solid rgba(102, 126, 234, 0.25);">
    {caption_html}
</div>
'''

def process_html(html, assets):
    """Process HTML to embed images and distribute throughout text"""

    # First, update CSS for larger gallery images
    css_additions = '''
        /* Enhanced Image Sizes - v15 */
        .aether-gallery-item img {
            min-height: 280px !important;
            object-fit: cover !important;
        }

        .aether-gallery-3col .aether-gallery-item {
            min-width: 320px !important;
        }

        .inline-image-block img {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .inline-image-block img:hover {
            transform: scale(1.02);
            box-shadow: 0 12px 48px rgba(102, 126, 234, 0.35);
        }

        /* Clearfix for floated images */
        .window-content p::after,
        .window-content .highlight-box::after {
            content: "";
            display: table;
            clear: both;
        }
    '''

    # Insert CSS before </style>
    html = html.replace('</style>', css_additions + '\n    </style>', 1)

    # Replace all <picture> elements with embedded base64 <img> tags
    def replace_picture(match):
        full_match = match.group(0)
        # Extract the PNG fallback filename
        png_match = re.search(r'src="aether-website-assets/png-fallback/([^"]+)\.png"', full_match)
        if png_match:
            base_name = png_match.group(1)
            if base_name in assets and assets[base_name]:
                alt_match = re.search(r'alt="([^"]*)"', full_match)
                alt = alt_match.group(1) if alt_match else base_name
                return f'<img src="{assets[base_name]}" alt="{alt}" loading="lazy" style="width: 100%; height: auto; min-height: 250px; object-fit: cover; border-radius: 8px;">'
        return full_match

    # Replace picture elements
    html = re.sub(r'<picture>.*?</picture>', replace_picture, html, flags=re.DOTALL)

    # Now distribute images throughout the text content for each tab
    # ETHOS TAB - Leadership & Philosophy images
    ethos_images = [
        ("aether-brand-logo-main", "AETHER Brand Logo", "The AETHER Identity", "large"),
        ("aether-team-founder-ctch", "Christian Charles-Harris", "Christian Charles-Harris - Founder & CEO", "float-right"),
        ("BRANDwork-ProjectionMapping-CircuitNeuron", "Circuit Neuron Technology", "Neural Circuit Mapping Technology", "float-left"),
        ("aether-team-cofounder-shaxinwei", "Dr. Sha Xin Wei", "Dr. Sha Xin Wei - Co-Founder & CTO", "float-right"),
        ("BRANDwork-ProjectionMapping-CosmicEye", "Cosmic Eye Projection", "Immersive Cosmic Projection", "float-left"),
        ("aether-team-cofounder-vangelis", "Dr. Vangelis Lympouridis", "Dr. Vangelis Lympouridis - Co-Founder & CSO", "float-right"),
        ("BRANDAsset-Typography3D-AlchemicalArtisans", "Alchemical Artisans", "Alchemical Artisans Brand Typography", "medium"),
        ("BRANDwork-ProjectionMapping-GridMatrix", "Grid Matrix", "Grid Matrix Technology Platform", "float-left"),
        ("aether-brand-ctch-logotype", "CTCH Logotype", "CTCH Brand Mark", "medium"),
    ]

    # PATHOS TAB - Emotional/Portfolio images
    pathos_images = [
        ("aether-portfolio-enchant-lights-01", "Enchant Light Installation", "Enchant Christmas - Light Installation", "hero"),
        ("aether-portfolio-enchant-daytime", "Enchant Daytime", "Enchant Experience - Daytime Magic", "float-right"),
        ("BRANDwork-EnchantSite-Collage2", "Enchant Collage", "Enchant Experience Moments", "float-left"),
        ("aether-portfolio-killmove-01", "Kill Move Paradise", "Kill Move Paradise - Stage Production", "float-right"),
        ("BRANDwork-StageProduction-GhostProjection", "Ghost Projection", "Theatrical Ghost Projection Effect", "float-left"),
        ("aether-portfolio-batb-setdesign", "Beauty and the Beast", "Beauty and the Beast Set Design", "large"),
        ("BRANDwork-EnchantSite-Collage7", "Holiday Magic", "Holiday Magic Experience", "float-right"),
        ("aether-portfolio-candlelight-venue", "Candlelight Concert", "Candlelight Concert Venue Design", "float-left"),
        ("BRANDwork-EnchantSite-Collage4", "Design Elements", "Experience Design Elements", "medium"),
    ]

    # LOGOS TAB - IP/Technology images
    logos_images = [
        ("aether-ip-tales-of-lucidia", "Tales of Lucidia", "Tales of Lucidia - Key Art", "hero"),
        ("BRANDAsset-WarriorPrincess-CharacterConcept", "Warrior Princess", "Warrior Princess Character Concept", "float-right"),
        ("aether-ip-maryjane-mainframe", "MaryJane Mainframe", "MaryJane Mainframe IP", "float-left"),
        ("BRANDAsset-WarriorPrincess-Render51", "Warrior Princess Render", "Warrior Princess 3D Render", "float-right"),
        ("aether-ip-metamorphasis-apothecary", "Metamorphasis Apothecary", "Metamorphasis Apothecary Environment", "float-left"),
        ("BRANDwork-WarriorPrincessOz-EmeraldCrystals", "Emerald Crystals", "Emerald Crystals Environment", "large"),
        ("BRANDAsset-PhygitalIP-BroussardBayouBBQ", "Broussard Bayou BBQ", "Broussard Bayou BBQ Brand", "float-right"),
        ("BRANDwork-WarriorPrincessOz-ArenaLayout", "Arena Layout", "Arena Experience Layout Design", "float-left"),
        ("BRANDAsset-PhygitalIP-Port51Confectionarium", "Port 51", "Port 51 Confectionarium", "medium"),
    ]

    # Helper to insert image after a specific text pattern
    def insert_after_pattern(html, pattern, image_html, count=1):
        matches = list(re.finditer(pattern, html, re.IGNORECASE))
        if matches and len(matches) >= count:
            match = matches[count - 1]
            # Find the end of the paragraph or div
            end_pos = match.end()
            # Look for </p> or </div>
            next_close = html.find('</p>', end_pos)
            if next_close == -1 or next_close > end_pos + 500:
                next_close = html.find('</div>', end_pos)
            if next_close != -1 and next_close < end_pos + 500:
                insert_pos = next_close + 4 if html[next_close:next_close+4] == '</p>' else next_close + 6
                html = html[:insert_pos] + '\n' + image_html + '\n' + html[insert_pos:]
        return html

    # ETHOS TAB insertions (after "ETHOS" section starts around line 4528)
    # Insert after key paragraphs

    # After "The AETHER Identity" or first major section
    if "aether-brand-logo-main" in assets and assets["aether-brand-logo-main"]:
        pattern = r'<h1>Chapter 1: Leadership Team'
        html = insert_after_pattern(html, pattern,
            create_inline_image(assets["aether-brand-logo-main"], "AETHER Brand Logo", "The AETHER Brand Identity", "hero"))

    # After CTCH intro paragraph
    if "aether-team-founder-ctch" in assets and assets["aether-team-founder-ctch"]:
        pattern = r'Christian Charles-Harris.*?Founder.*?CEO'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-team-founder-ctch"], "Christian Charles-Harris", "Christian Charles-Harris - Founder", "right"))

    # After entrepreneurial achievements
    if "BRANDwork-ProjectionMapping-CircuitNeuron" in assets and assets["BRANDwork-ProjectionMapping-CircuitNeuron"]:
        pattern = r'entrepreneurial achievements'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-ProjectionMapping-CircuitNeuron"], "Neural Technology", "Circuit Neuron Mapping", "left"))

    # After Sha Xin Wei section
    if "aether-team-cofounder-shaxinwei" in assets and assets["aether-team-cofounder-shaxinwei"]:
        pattern = r'Dr\. Sha Xin Wei.*?Co-Founder'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-team-cofounder-shaxinwei"], "Dr. Sha Xin Wei", "Dr. Sha Xin Wei - Co-Founder & CTO", "right"))

    # After Vangelis section
    if "aether-team-cofounder-vangelis" in assets and assets["aether-team-cofounder-vangelis"]:
        pattern = r'Dr\. Vangelis Lympouridis.*?Innovative'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-team-cofounder-vangelis"], "Dr. Vangelis Lympouridis", "Dr. Vangelis Lympouridis - Co-Founder & CSO", "right"))

    # Add projection mapping tech image
    if "BRANDwork-ProjectionMapping-CosmicEye" in assets and assets["BRANDwork-ProjectionMapping-CosmicEye"]:
        pattern = r'RelieVRx Breakthrough'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-ProjectionMapping-CosmicEye"], "Cosmic Eye", "Cosmic Eye Projection Technology", "left"))

    # Strategic advisors section
    if "BRANDwork-ProjectionMapping-GridMatrix" in assets and assets["BRANDwork-ProjectionMapping-GridMatrix"]:
        pattern = r'Strategic Advisors'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-ProjectionMapping-GridMatrix"], "Grid Matrix", "Grid Matrix Technology", "left"))

    # PATHOS TAB insertions
    # After origin story
    if "aether-portfolio-enchant-lights-01" in assets and assets["aether-portfolio-enchant-lights-01"]:
        pattern = r'The Origin Story'
        html = insert_after_pattern(html, pattern,
            create_inline_image(assets["aether-portfolio-enchant-lights-01"], "Enchant Lights", "Enchant Christmas - Immersive Light Experience", "hero"))

    # After "My journey begins here"
    if "aether-portfolio-enchant-daytime" in assets and assets["aether-portfolio-enchant-daytime"]:
        pattern = r'My journey begins here'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-portfolio-enchant-daytime"], "Enchant Daytime", "Enchant Daytime Experience", "right"))

    # After Memory and Alchemy section
    if "BRANDwork-EnchantSite-Collage2" in assets and assets["BRANDwork-EnchantSite-Collage2"]:
        pattern = r'Memory, Alchemy, and the Cult'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-EnchantSite-Collage2"], "Experience Collage", "Immersive Experience Moments", "left"))

    # After theatrical production mention
    if "aether-portfolio-killmove-01" in assets and assets["aether-portfolio-killmove-01"]:
        pattern = r'theatrical enchantment'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-portfolio-killmove-01"], "Kill Move Paradise", "Kill Move Paradise Production", "right"))

    # Ghost projection after stage design mention
    if "BRANDwork-StageProduction-GhostProjection" in assets and assets["BRANDwork-StageProduction-GhostProjection"]:
        pattern = r'cirque audacity'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-StageProduction-GhostProjection"], "Ghost Projection", "Ghost Projection Effect", "left"))

    # LOGOS TAB insertions
    # After Tales of Lucidia header
    if "aether-ip-tales-of-lucidia" in assets and assets["aether-ip-tales-of-lucidia"]:
        pattern = r'Tales of Lucidia: Transmedia Franchise'
        html = insert_after_pattern(html, pattern,
            create_inline_image(assets["aether-ip-tales-of-lucidia"], "Tales of Lucidia", "Tales of Lucidia - Warrior Princess IP", "hero"))

    # After Warrior Princess intro
    if "BRANDAsset-WarriorPrincess-CharacterConcept" in assets and assets["BRANDAsset-WarriorPrincess-CharacterConcept"]:
        pattern = r'Three Warrior Princesses'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDAsset-WarriorPrincess-CharacterConcept"], "Warrior Princess", "Warrior Princess Character Concept", "right"))

    # MaryJane Mainframe
    if "aether-ip-maryjane-mainframe" in assets and assets["aether-ip-maryjane-mainframe"]:
        pattern = r'Ozma.*?Strategic Leader'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-ip-maryjane-mainframe"], "MaryJane Mainframe", "MaryJane Mainframe IP", "left"))

    # Warrior Princess Render after Alice
    if "BRANDAsset-WarriorPrincess-Render51" in assets and assets["BRANDAsset-WarriorPrincess-Render51"]:
        pattern = r'Alice.*?Tactical Innovator'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDAsset-WarriorPrincess-Render51"], "Warrior Princess", "Warrior Princess 3D Render", "right"))

    # Metamorphasis after Polychrome
    if "aether-ip-metamorphasis-apothecary" in assets and assets["aether-ip-metamorphasis-apothecary"]:
        pattern = r'Polychrome.*?Creative Force'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["aether-ip-metamorphasis-apothecary"], "Metamorphasis Apothecary", "Metamorphasis Environment", "left"))

    # Emerald crystals after shared mission
    if "BRANDwork-WarriorPrincessOz-EmeraldCrystals" in assets and assets["BRANDwork-WarriorPrincessOz-EmeraldCrystals"]:
        pattern = r'Shared Mission'
        html = insert_after_pattern(html, pattern,
            create_inline_image(assets["BRANDwork-WarriorPrincessOz-EmeraldCrystals"], "Emerald Crystals", "Emerald Crystals Environment", "large"))

    # Phygital IP images
    if "BRANDAsset-PhygitalIP-BroussardBayouBBQ" in assets and assets["BRANDAsset-PhygitalIP-BroussardBayouBBQ"]:
        pattern = r'Creator Tools.*?Democratization'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDAsset-PhygitalIP-BroussardBayouBBQ"], "Broussard Bayou", "Broussard Bayou BBQ Brand", "right"))

    if "BRANDwork-WarriorPrincessOz-ArenaLayout" in assets and assets["BRANDwork-WarriorPrincessOz-ArenaLayout"]:
        pattern = r'Measurable Impact.*?ROI'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-WarriorPrincessOz-ArenaLayout"], "Arena Layout", "Arena Experience Layout", "left"))

    # Additional inline images in key sections
    if "BRANDwork-ProjectionMapping-OceanForge" in assets and assets["BRANDwork-ProjectionMapping-OceanForge"]:
        pattern = r'Phygital Hospitality Revolution'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-ProjectionMapping-OceanForge"], "Ocean Forge", "Ocean Forge Immersive", "left"))

    if "BRANDwork-ProjectionMapping-Vintage" in assets and assets["BRANDwork-ProjectionMapping-Vintage"]:
        pattern = r'The Complete Advisory Board'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-ProjectionMapping-Vintage"], "Vintage Aesthetic", "Vintage Aesthetic Projection", "right"))

    if "BRANDwork-ProjectionMapping-SciFi" in assets and assets["BRANDwork-ProjectionMapping-SciFi"]:
        pattern = r'Integration of Digital and Physical'
        html = insert_after_pattern(html, pattern,
            create_float_image(assets["BRANDwork-ProjectionMapping-SciFi"], "Sci-Fi Environment", "Sci-Fi Environment Design", "right"))

    return html

def main():
    print("Loading webp assets...")
    assets = get_all_assets()
    print(f"Loaded {len(assets)} assets")

    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print("Processing HTML with embedded images...")
    html = process_html(html, assets)

    # Update title to v15
    html = html.replace('v6.0 | December 2025', 'v6.1 | December 2025 | Embedded Assets')

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Done! Output: {OUTPUT_FILE}")
    print(f"File size: {os.path.getsize(OUTPUT_FILE) / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    main()
