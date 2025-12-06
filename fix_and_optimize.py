#!/usr/bin/env python3
"""
Fix errors and optimize for mobile/desktop:
1. Fix CSS syntax errors (orphaned code at lines 3146-3149)
2. Add comprehensive mobile responsive CSS for access overlay
3. Optimize desktop interactions and hover states
4. Consolidate media queries
5. Add touch device optimizations
6. Fix window positioning for all screen sizes
7. Improve performance
"""

import re

INPUT_FILE = "aether-internal-protected.html"
OUTPUT_FILE = "aether-internal-protected.html"

# Comprehensive mobile/desktop optimization CSS
OPTIMIZATION_CSS = '''
        /* ===== COMPREHENSIVE MOBILE/DESKTOP OPTIMIZATION ===== */
        /* Version 2.0 - Full Responsive Fix */

        /* ===== ACCESS OVERLAY MOBILE OPTIMIZATION ===== */
        @media (max-width: 768px) {
            .access-overlay {
                padding: 20px;
            }

            .access-container {
                padding: 40px 25px;
                max-width: 95%;
                border-radius: 20px;
            }

            .access-title {
                font-size: 22px;
                letter-spacing: 3px;
            }

            .access-subtitle {
                font-size: 13px;
                margin-bottom: 28px;
            }

            .access-input {
                padding: 16px 20px;
                font-size: 20px;
                letter-spacing: 8px;
            }

            .access-button {
                padding: 14px 24px;
                font-size: 14px;
                letter-spacing: 2px;
            }

            .access-badge {
                font-size: 10px;
                padding: 5px 12px;
            }
        }

        @media (max-width: 480px) {
            .access-container {
                padding: 32px 20px;
            }

            .access-title {
                font-size: 18px;
                letter-spacing: 2px;
            }

            .access-input {
                padding: 14px 16px;
                font-size: 18px;
                letter-spacing: 6px;
            }

            .access-button {
                padding: 12px 20px;
                font-size: 13px;
            }
        }

        /* ===== WINDOW POSITIONING FIX ===== */
        .window {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1000px;
            max-height: 85vh;
        }

        @media (max-width: 1200px) {
            .window {
                width: 92%;
                max-width: 900px;
            }
        }

        @media (max-width: 900px) {
            .window {
                width: 94%;
                max-width: 100%;
                top: 60px !important;
                transform: translateX(-50%);
                max-height: calc(100vh - 140px);
            }
        }

        @media (max-width: 768px) {
            .window {
                width: 96% !important;
                left: 2% !important;
                right: 2% !important;
                top: 50px !important;
                transform: none;
                max-height: calc(100vh - 130px);
                border-radius: 8px;
            }

            .window-content {
                padding: 24px 20px;
                font-size: 14px;
                line-height: 1.75;
            }

            .window-content h1 {
                font-size: 24px;
                margin-bottom: 20px;
            }

            .window-content h2 {
                font-size: 18px;
                margin-top: 32px;
            }

            .window-content h3 {
                font-size: 16px;
            }
        }

        @media (max-width: 480px) {
            .window {
                width: 98% !important;
                left: 1% !important;
                top: 40px !important;
                max-height: calc(100vh - 110px);
            }

            .window-content {
                padding: 20px 16px;
                font-size: 13px;
            }

            .window-content h1 {
                font-size: 20px;
            }

            .window-content h2 {
                font-size: 16px;
            }
        }

        /* ===== DESKTOP LAYOUT OPTIMIZATION ===== */
        @media (min-width: 1400px) {
            .desktop {
                padding: 40px 60px;
                gap: 50px;
            }

            .main-button-container {
                gap: 60px;
            }

            .brand-logo-container img {
                max-width: 700px;
            }
        }

        @media (min-width: 1600px) {
            .main-desktop-button {
                min-width: 420px;
                max-width: 480px;
                min-height: 450px;
            }

            .button-icon {
                max-width: 380px;
            }

            .button-label {
                font-size: 30px;
            }
        }

        /* ===== LOADING SCREEN MOBILE FIX ===== */
        @media (max-width: 768px) {
            .loading-screen {
                padding: 20px;
            }

            .boot-text {
                font-size: 12px;
                letter-spacing: 2px;
                margin-bottom: 1.5rem;
            }

            .alchemical-loader {
                max-width: 250px;
                width: 70%;
            }
        }

        @media (max-width: 480px) {
            .boot-text {
                font-size: 10px;
                letter-spacing: 1.5px;
            }

            .alchemical-loader {
                max-width: 200px;
            }
        }

        /* ===== TASKBAR MOBILE FIX ===== */
        @media (max-width: 768px) {
            .taskbar {
                height: auto;
                min-height: 40px;
                padding: 4px 8px;
                flex-wrap: wrap;
            }

            .start-button {
                padding: 4px 10px;
                font-size: 11px;
            }

            .taskbar-buttons {
                flex-wrap: wrap;
                gap: 4px;
            }

            .task-button {
                padding: 4px 8px;
                font-size: 10px;
                min-width: auto;
            }

            .system-tray {
                font-size: 10px;
                padding: 4px 8px;
            }
        }

        /* ===== IMAGE CONTAINER FIXES ===== */
        .v16-image,
        .v16-float {
            box-sizing: border-box;
        }

        /* Prevent image overflow */
        .window-content .v16-image img,
        .window-content .v16-float img {
            max-width: 100%;
            height: auto;
        }

        /* Clear floats properly */
        .window-content > *:not(.v16-float) {
            clear: both;
        }

        .window-content .section-divider {
            clear: both;
            margin-top: 40px;
            margin-bottom: 40px;
        }

        /* ===== BOX COMPONENT MOBILE FIXES ===== */
        @media (max-width: 768px) {
            .highlight-box,
            .info-box {
                padding: 20px 18px;
                margin: 20px 0;
                border-radius: 10px;
            }

            .highlight-box h3,
            .info-box h3 {
                font-size: 15px;
            }

            .highlight-box ul,
            .info-box ul {
                margin-left: 16px;
            }

            .highlight-box li,
            .info-box li {
                font-size: 13px;
                padding: 8px 0;
            }

            .pull-quote {
                padding: 20px;
                margin: 20px 0;
            }

            .pull-quote p {
                font-size: 14px;
            }

            .comparison-grid {
                gap: 15px;
            }

            .comparison-item {
                padding: 15px;
            }
        }

        /* ===== TOUCH DEVICE ENHANCEMENTS ===== */
        @media (pointer: coarse) {
            /* Larger tap targets */
            .main-desktop-button {
                min-height: 120px;
            }

            .window-button {
                width: 24px;
                height: 22px;
                font-size: 12px;
            }

            .start-button,
            .task-button {
                min-height: 36px;
            }

            /* Remove hover effects on touch */
            .main-desktop-button:hover {
                transform: none;
            }

            .main-desktop-button:active {
                transform: scale(0.98);
                background: rgba(255, 255, 255, 0.2);
            }

            /* Better scroll behavior */
            .window-content {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }

            /* Tap highlight */
            .main-desktop-button,
            .window-button,
            .start-button,
            .task-button {
                -webkit-tap-highlight-color: rgba(102, 126, 234, 0.3);
            }
        }

        /* ===== HOVER EFFECTS FOR DESKTOP ONLY ===== */
        @media (hover: hover) and (pointer: fine) {
            .main-desktop-button:hover {
                transform: translateY(-12px) scale(1.03);
            }

            .v16-image img:hover {
                transform: scale(1.04) translateY(-5px);
            }

            .v16-float img:hover {
                transform: scale(1.05);
            }

            .highlight-box:hover,
            .info-box:hover,
            .takeaway-box:hover {
                transform: translateY(-4px);
            }
        }

        /* ===== SCROLLBAR STYLING ===== */
        .window-content::-webkit-scrollbar {
            width: 12px;
        }

        .window-content::-webkit-scrollbar-track {
            background: #e0e0e0;
            border-left: 1px solid #c0c0c0;
        }

        .window-content::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%);
            border: 1px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }

        .window-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #d0d0d0 0%, #b0b0b0 100%);
        }

        @media (max-width: 768px) {
            .window-content::-webkit-scrollbar {
                width: 8px;
            }
        }

        /* ===== PERFORMANCE OPTIMIZATIONS ===== */
        .window,
        .main-desktop-button,
        .v16-image img,
        .v16-float img,
        .access-overlay,
        .loading-screen {
            will-change: auto;
        }

        /* Enable GPU acceleration only when needed */
        .window.active,
        .main-desktop-button:hover,
        .v16-image img:hover,
        .v16-float img:hover {
            will-change: transform;
        }

        /* Reduce animations on low-power devices */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            .sky-glass-layer,
            .sky-glass-layer::before,
            .sky-glass-layer::after {
                animation: none !important;
            }

            #matrixCanvas {
                display: none;
            }
        }

        /* ===== LANDSCAPE MOBILE FIX ===== */
        @media (max-height: 500px) and (orientation: landscape) {
            .desktop {
                height: auto;
                min-height: 100vh;
                padding: 15px;
            }

            .brand-logo-container img {
                max-width: 150px;
            }

            .main-button-container {
                flex-direction: row;
                gap: 15px;
            }

            .main-desktop-button {
                min-width: 150px;
                max-width: 200px;
                min-height: 180px;
                padding: 15px;
            }

            .button-icon {
                max-width: 100px;
            }

            .button-label {
                font-size: 14px;
            }

            .button-subtitle {
                display: none;
            }

            .window {
                max-height: calc(100vh - 80px);
            }

            .taskbar {
                height: 35px;
            }
        }

        /* ===== PRINT STYLES ===== */
        @media print {
            .loading-screen,
            .access-overlay,
            #matrixCanvas,
            .sky-glass-layer,
            .taskbar,
            .window-controls {
                display: none !important;
            }

            .window {
                position: relative !important;
                transform: none !important;
                max-height: none !important;
                width: 100% !important;
                box-shadow: none !important;
            }

            .window-content {
                max-height: none !important;
                overflow: visible !important;
            }

            body {
                background: white !important;
            }
        }

        /* ===== HIGH CONTRAST MODE ===== */
        @media (prefers-contrast: high) {
            .window-content {
                background: white;
            }

            .highlight-box,
            .info-box,
            .takeaway-box {
                border-width: 3px;
            }

            .access-input {
                border-width: 3px;
            }
        }
'''

def fix_css_errors(html):
    """Fix CSS syntax errors"""
    # Fix the orphaned CSS code at lines 3146-3149
    # Pattern: closing brace followed by CSS properties outside any selector
    orphaned_pattern = r'(\.column-box p \{[^}]+\})\s*\n\s*(background:[^;]+;\s*box-shadow:[^;]+;\s*\}\s*\})'

    def fix_orphaned(match):
        return match.group(1) + '\n'

    html = re.sub(orphaned_pattern, fix_orphaned, html, flags=re.DOTALL)

    # Alternative fix if pattern doesn't match - remove orphaned lines directly
    lines = html.split('\n')
    fixed_lines = []
    skip_next = 0

    for i, line in enumerate(lines):
        if skip_next > 0:
            skip_next -= 1
            continue

        stripped = line.strip()
        # Check for orphaned CSS (properties without selector)
        if stripped.startswith('background:') and i > 0:
            prev_stripped = lines[i-1].strip() if i > 0 else ''
            if prev_stripped == '}' or prev_stripped.endswith('}'):
                # This is orphaned - skip it
                continue
        elif stripped == '}' and i > 0:
            prev_stripped = lines[i-1].strip() if i > 0 else ''
            if prev_stripped.startswith('box-shadow:'):
                continue

        fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def add_optimization_css(html):
    """Add comprehensive optimization CSS before </style>"""
    # Find the last </style> before </head>
    head_end = html.find('</head>')
    if head_end == -1:
        return html

    # Find the last </style> before </head>
    last_style_end = html.rfind('</style>', 0, head_end)
    if last_style_end == -1:
        return html

    # Insert optimization CSS before this </style>
    html = html[:last_style_end] + '\n' + OPTIMIZATION_CSS + '\n    ' + html[last_style_end:]

    return html

def fix_duplicate_media_queries(html):
    """Remove duplicate media query content"""
    # This is a simplified approach - consolidate obvious duplicates
    # The CSS will cascade properly, but this removes exact duplicates

    # Remove duplicate .believe-footer rules
    html = re.sub(
        r'(@media \(max-width: 768px\) \{\s*\.believe-footer \{[^}]+\}\s*\.believe-footer img \{[^}]+\}\s*\})\s*(?=\s*</style>)',
        '',
        html
    )

    return html

def add_meta_viewport_fix(html):
    """Ensure proper viewport meta tag"""
    viewport_pattern = r'<meta name="viewport"[^>]*>'
    optimal_viewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">'

    html = re.sub(viewport_pattern, optimal_viewport, html)
    return html

def main():
    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    original_size = len(html)

    print("Fixing CSS syntax errors...")
    html = fix_css_errors(html)

    print("Adding comprehensive mobile/desktop optimization CSS...")
    html = add_optimization_css(html)

    print("Fixing duplicate media queries...")
    html = fix_duplicate_media_queries(html)

    print("Fixing viewport meta tag...")
    html = add_meta_viewport_fix(html)

    # Update version indicator
    html = html.replace('v6.3 | December 2025 | Protected Edition',
                        'v6.4 | December 2025 | Optimized Edition')

    html = html.replace('AETHER PXR v3.1 INTERNAL',
                        'AETHER PXR v3.2 OPTIMIZED')

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    import os
    new_size = os.path.getsize(OUTPUT_FILE)

    print(f"\nOptimization complete!")
    print(f"File: {OUTPUT_FILE}")
    print(f"Size: {new_size / 1024 / 1024:.2f} MB")
    print(f"Changes: +{(new_size - original_size) / 1024:.1f} KB (optimization CSS)")

    # Count media queries
    media_count = html.count('@media')
    print(f"Media queries: {media_count}")

if __name__ == "__main__":
    main()
