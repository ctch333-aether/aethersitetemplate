#!/usr/bin/env python3
"""
Script to embed brand assets from brand_assets_base64.json into the HTML file.
This replaces existing images with the proper brand assets.
"""

import json
import re

def load_brand_assets(json_path):
    """Load brand assets from JSON file."""
    with open(json_path, 'r') as f:
        return json.load(f)

def load_html(html_path):
    """Load HTML file content."""
    with open(html_path, 'r') as f:
        return f.read()

def save_html(html_path, content):
    """Save HTML file content."""
    with open(html_path, 'w') as f:
        f.write(content)

def create_data_url(base64_data, mime_type='image/png'):
    """Create a data URL from base64 data."""
    return f"data:{mime_type};base64,{base64_data}"

def embed_assets(html_content, assets):
    """
    Embed brand assets into HTML content.

    This function finds specific image locations by alt text or context
    and replaces them with the correct brand assets.
    """

    # Map of alt text patterns to asset keys
    # Verified mappings based on asset filenames and HTML alt text analysis:
    #
    # BRAND LOGOS:
    #   - BRANDAsset-MAINLOGO.png -> AETHER logos/loading
    #
    # FOUNDER/CO-FOUNDERS:
    #   - BRANDAsset-FOUNDERCTCH.png -> Founder Christian Charles-Harris
    #   - BRANDAsset-FounderCTCH3dtext.png -> (3D text, not used in img tags)
    #   - BRANDAsset-cofoundershaxinwei.png -> (co-founder, if needed)
    #   - BRANDAsset-cofoundervangelis.png -> (co-founder, if needed)
    #   - BRANDAsset-sha3dtext.png -> (3D text, not used)
    #   - BRANDAsset-van3dtext.png -> (3D text, not used)
    #
    # PHYGITAL IPs (Intellectual Properties):
    #   - BRANDAsset-PHYGITALIP1.png -> Tales of Lucidia (IP #1)
    #   - BRANDAsset-PHYGITALIP2.png -> Port 51 Lucidia Confectionarium (IP #2)
    #   - BRANDAsset-PHYGITALIP3.png -> Broussard Bayou Honeymoon BBQ (IP #3)
    #   - BRANDAsset-PHYGITALIP4.png -> Port 51 Environment Concepts
    #   - BRANDAsset-PHYGITALIP5.png -> Port 51 Concept Art
    #
    # SERVICES:
    #   - BRANDAsset-services1.png -> Alchemist Atelier
    #   - BRANDAsset-services2.png -> Project Types
    #   - BRANDAsset-services3.png -> Skills & Capabilities
    #
    # ENCHANT/THEATRICAL WORK:
    #   - BRANDAsset-enchantwork1.png -> Beauty and the Beast Set Design
    #   - BRANDAsset-enchantwork2.png -> Beauty and Beast Stained Glass
    #   - BRANDAsset-enchantwork3.png -> (available for future use)
    #   - BRANDAsset-enchantwork4.png -> Conceptual Design and Production
    #
    # ASSORTED WORK:
    #   - BRANDAsset-AssortedWork1.png -> Theatrical Projection Mapping
    #   - BRANDAsset-AssortedWork2.png -> Immersive Set Design
    #   - BRANDAsset-AssortedWork3.png -> Large-Scale Holiday Lights
    #
    # SPECIAL PROJECTS:
    #   - BRANDAsset-KILLMOVEPARADISE1.png -> I Believe (footer)
    #   - BRANDAsset-KILLMOVEPARADISE2.png -> (available for future use)
    #
    # BACKGROUNDS:
    #   - BRANDAsset-BCKGRND5.png -> (background, not used in img tags)

    asset_mapping = {
        # Main branding (exact matches first, then partial)
        'AETHER Logo': 'BRANDAsset-MAINLOGO.png',
        'AETHER Loading': 'BRANDAsset-MAINLOGO.png',
        'AETHER': 'BRANDAsset-MAINLOGO.png',

        # Founder
        'Young Christian Charles-Harris': 'BRANDAsset-FOUNDERCTCH.png',

        # Phygital IPs - Tales of Lucidia (IP #1)
        'Tales of Lucidia Logo': 'BRANDAsset-PHYGITALIP1.png',

        # Phygital IPs - Port 51 Lucidia Confectionarium (IP #2)
        'Port 51 Lucidia Confectionarium Logo': 'BRANDAsset-PHYGITALIP2.png',
        'Port 51 Lucidia Confectionarium Concept Art': 'BRANDAsset-PHYGITALIP5.png',
        'Port 51 Environment Concepts': 'BRANDAsset-PHYGITALIP4.png',

        # Phygital IPs - Broussard Bayou Honeymoon BBQ (IP #3)
        'Broussard Bayou Honeymoon BBQ Logo': 'BRANDAsset-PHYGITALIP3.png',
        'Broussard Bayou Honeymoon BBQ': 'BRANDAsset-PHYGITALIP3.png',

        # Services
        'Alchemist Atelier': 'BRANDAsset-services1.png',
        'Project Types': 'BRANDAsset-services2.png',
        'Skills & Capabilities': 'BRANDAsset-services3.png',

        # Enchant/Theatrical Work - Beauty and the Beast
        'Beauty and the Beast Set Design - Stained Glass': 'BRANDAsset-enchantwork2.png',
        'Beauty and the Beast Set Design': 'BRANDAsset-enchantwork1.png',

        # Enchant Work - Other
        'Conceptual Design and Production': 'BRANDAsset-enchantwork4.png',

        # Assorted Work
        'Theatrical Projection Mapping': 'BRANDAsset-AssortedWork1.png',
        'Immersive Set Design': 'BRANDAsset-AssortedWork2.png',
        'Large-Scale Holiday Light': 'BRANDAsset-AssortedWork3.png',

        # Special Projects
        'I Believe': 'BRANDAsset-KILLMOVEPARADISE1.png',

        # Catch-all for Port 51 without logo suffix (should come after specific matches)
        'Port 51 Lucidia Confectionarium': 'BRANDAsset-PHYGITALIP2.png',
    }

    modified_html = html_content
    replacements_made = 0

    for alt_pattern, asset_key in asset_mapping.items():
        if asset_key not in assets:
            print(f"Warning: Asset {asset_key} not found in JSON")
            continue

        # Create a regex pattern to find img tags with this alt text
        # This pattern finds img tags and captures the src attribute
        pattern = rf'(<img[^>]*alt="[^"]*{re.escape(alt_pattern)}[^"]*"[^>]*src=")([^"]+)("[^>]*>)'

        # Also try pattern with src before alt
        pattern2 = rf'(<img[^>]*src=")([^"]+)("[^>]*alt="[^"]*{re.escape(alt_pattern)}[^"]*"[^>]*>)'

        data_url = create_data_url(assets[asset_key])

        # Try first pattern
        new_html, count1 = re.subn(pattern, rf'\1{data_url}\3', modified_html)
        if count1 > 0:
            modified_html = new_html
            replacements_made += count1
            print(f"Replaced {count1} image(s) for: {alt_pattern}")

        # Try second pattern
        new_html, count2 = re.subn(pattern2, rf'\1{data_url}\3', modified_html)
        if count2 > 0:
            modified_html = new_html
            replacements_made += count2
            print(f"Replaced {count2} image(s) for: {alt_pattern}")

    return modified_html, replacements_made

def fix_render_issues(html_content):
    """
    Fix common rendering issues in the HTML.
    """
    modified_html = html_content

    # Fix any broken image references that might cause render issues
    # Make sure all img tags have proper closing

    # Fix any images with empty or broken src
    modified_html = re.sub(
        r'src=""',
        'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"',
        modified_html
    )

    # Ensure proper image rendering attributes
    # Add loading="lazy" for performance where not present

    return modified_html

def main():
    # File paths
    json_path = 'brand_assets_base64.json'
    html_path = 'AETHER-Internal-Knowledge-Base-Concise.html'

    print("Loading brand assets...")
    assets = load_brand_assets(json_path)
    print(f"Loaded {len(assets)} assets")
    print(f"Asset keys: {list(assets.keys())}")

    print("\nLoading HTML file...")
    html_content = load_html(html_path)
    print(f"HTML file size: {len(html_content)} bytes")

    print("\nEmbedding brand assets...")
    modified_html, replacements = embed_assets(html_content, assets)
    print(f"Total replacements made: {replacements}")

    print("\nFixing render issues...")
    final_html = fix_render_issues(modified_html)

    print("\nSaving modified HTML...")
    save_html(html_path, final_html)
    print("Done!")

if __name__ == '__main__':
    main()
