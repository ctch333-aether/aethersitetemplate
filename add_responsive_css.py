#!/usr/bin/env python3
"""
Script to add responsive CSS for mobile/desktop optimization.
"""

import re

def load_html(html_path):
    """Load HTML file content."""
    with open(html_path, 'r') as f:
        return f.read()

def save_html(html_path, content):
    """Save HTML file content."""
    with open(html_path, 'w') as f:
        f.write(content)

def add_responsive_css(html_content):
    """
    Add responsive CSS and class to co-founder grid sections.
    """
    modified_html = html_content

    # 1. Add 'cofounder-grid' class to co-founder sections
    # Pattern: div with specific grid style for co-founders
    pattern = r'<div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; margin: 20px 0; padding: 20px; background: linear-gradient\(135deg, rgba\(102, 126, 234, 0\.05\), rgba\(240, 147, 251, 0\.05\)\); border: 2px solid #e0e0e0; border-radius: 4px;">'
    replacement = '<div class="cofounder-grid" style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(240, 147, 251, 0.05)); border: 2px solid #e0e0e0; border-radius: 4px;">'

    modified_html, count = re.subn(pattern, replacement, modified_html)
    print(f"Added cofounder-grid class to {count} sections")

    # 2. Add responsive CSS for cofounder-grid to stack on mobile
    # Find the first @media (max-width: 768px) block and add our CSS to it
    responsive_css = """
    .cofounder-grid {
        grid-template-columns: 1fr !important;
        text-align: center;
    }
    .cofounder-grid > div:first-child img {
        max-width: 200px !important;
        margin: 0 auto 15px auto !important;
    }"""

    # Find first 768px media query and add our styles
    pattern_media = r'(@media \(max-width: 768px\) \{[^}]*\.comparison-grid,[^}]*\.two-column \{[^}]*grid-template-columns: 1fr;[^}]*\})'

    def add_cofounder_styles(match):
        return match.group(1) + responsive_css

    modified_html, count2 = re.subn(pattern_media, add_cofounder_styles, modified_html, count=1)
    print(f"Added responsive CSS to {count2} media query block(s)")

    return modified_html

def main():
    html_path = 'AETHER-Internal-Knowledge-Base-Concise.html'

    print("Loading HTML file...")
    html_content = load_html(html_path)
    print(f"HTML file size: {len(html_content)} bytes")

    print("\nAdding responsive CSS...")
    modified_html = add_responsive_css(html_content)

    print("\nSaving modified HTML...")
    save_html(html_path, modified_html)
    print("Done!")

if __name__ == '__main__':
    main()
