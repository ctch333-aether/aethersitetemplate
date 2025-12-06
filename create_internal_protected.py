#!/usr/bin/env python3
"""
Create Internal Protected Website with:
1. Code 144 password protection
2. 36% larger images
3. Improved brand asset display
4. Fixed rendering issues
5. Local base64 embedded images
"""

import base64
import os
import re

# Configuration
INPUT_FILE = "aether-matrix-v16-optimized.html"
OUTPUT_FILE = "aether-internal-protected.html"
ACCESS_CODE = "144"

# 36% size increase
SIZE_MULTIPLIER = 1.36

def calculate_new_size(original_px):
    """Calculate new size with 36% increase"""
    return int(original_px * SIZE_MULTIPLIER)

# Password protection HTML/CSS/JS to inject at the beginning
PASSWORD_PROTECTION = f'''
    <!-- PASSWORD PROTECTION OVERLAY -->
    <style>
        /* Access Code Protection Overlay */
        .access-overlay {{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg,
                #0a0a1a 0%,
                #1a1a3a 25%,
                #2a1a4a 50%,
                #1a1a3a 75%,
                #0a0a1a 100%);
            background-size: 400% 400%;
            animation: accessBgShift 8s ease infinite;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }}

        .access-overlay.hidden {{
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }}

        @keyframes accessBgShift {{
            0%, 100% {{ background-position: 0% 50%; }}
            50% {{ background-position: 100% 50%; }}
        }}

        .access-overlay::before {{
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background:
                radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.8), transparent),
                radial-gradient(2px 2px at 40% 70%, rgba(102,126,234,0.8), transparent),
                radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.6), transparent),
                radial-gradient(2px 2px at 80% 50%, rgba(118,75,162,0.8), transparent);
            background-size: 200px 200px;
            animation: starFloat 60s linear infinite;
            opacity: 0.6;
        }}

        .access-container {{
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 60px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 24px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow:
                0 25px 80px rgba(0, 0, 0, 0.5),
                0 8px 32px rgba(102, 126, 234, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            max-width: 480px;
            width: 90%;
        }}

        .access-title {{
            font-family: 'Space Grotesk', 'Inter', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow:
                0 0 20px rgba(102, 126, 234, 0.8),
                0 0 40px rgba(118, 75, 162, 0.6);
        }}

        .access-subtitle {{
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 36px;
            letter-spacing: 1px;
        }}

        .access-input-container {{
            position: relative;
            margin-bottom: 24px;
        }}

        .access-input {{
            width: 100%;
            padding: 18px 24px;
            font-size: 24px;
            font-family: 'JetBrains Mono', monospace;
            text-align: center;
            letter-spacing: 12px;
            background: rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(102, 126, 234, 0.4);
            border-radius: 12px;
            color: #ffffff;
            outline: none;
            transition: all 0.3s ease;
        }}

        .access-input:focus {{
            border-color: rgba(102, 126, 234, 0.8);
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
            background: rgba(0, 0, 0, 0.4);
        }}

        .access-input::placeholder {{
            color: rgba(255, 255, 255, 0.3);
            letter-spacing: 4px;
        }}

        .access-button {{
            width: 100%;
            padding: 16px 32px;
            font-size: 16px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }}

        .access-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
        }}

        .access-button:active {{
            transform: translateY(0);
        }}

        .access-error {{
            color: #ff6b6b;
            font-size: 13px;
            margin-top: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'Inter', sans-serif;
        }}

        .access-error.show {{
            opacity: 1;
        }}

        .access-hint {{
            margin-top: 28px;
            padding-top: 28px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
            font-family: 'Inter', sans-serif;
        }}

        .access-badge {{
            display: inline-block;
            padding: 6px 16px;
            background: rgba(102, 126, 234, 0.2);
            border: 1px solid rgba(102, 126, 234, 0.4);
            border-radius: 20px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 24px;
        }}
    </style>

    <div class="access-overlay" id="accessOverlay">
        <div class="access-container">
            <div class="access-badge">Internal Access</div>
            <div class="access-title">AETHER PXR</div>
            <div class="access-subtitle">Enter access code to continue</div>
            <div class="access-input-container">
                <input type="password"
                       class="access-input"
                       id="accessCode"
                       placeholder="***"
                       maxlength="10"
                       autocomplete="off"
                       onkeypress="if(event.key==='Enter')verifyAccess()">
            </div>
            <button class="access-button" onclick="verifyAccess()">Verify Access</button>
            <div class="access-error" id="accessError">Invalid access code. Please try again.</div>
            <div class="access-hint">Authorized personnel only</div>
        </div>
    </div>

    <script>
        // Access code verification
        const VALID_CODE = "{ACCESS_CODE}";

        function verifyAccess() {{
            const input = document.getElementById('accessCode');
            const error = document.getElementById('accessError');
            const overlay = document.getElementById('accessOverlay');

            if (input.value === VALID_CODE) {{
                overlay.classList.add('hidden');
                // Store access in session
                sessionStorage.setItem('aether_access', 'granted');
                // Focus on main content
                document.body.style.overflow = 'hidden';
            }} else {{
                error.classList.add('show');
                input.value = '';
                input.focus();
                // Shake animation
                input.style.animation = 'shake 0.5s ease';
                setTimeout(() => {{
                    input.style.animation = '';
                    error.classList.remove('show');
                }}, 2000);
            }}
        }}

        // Check if already authenticated
        document.addEventListener('DOMContentLoaded', function() {{
            if (sessionStorage.getItem('aether_access') === 'granted') {{
                document.getElementById('accessOverlay').classList.add('hidden');
            }} else {{
                document.getElementById('accessCode').focus();
            }}
        }});

        // Add shake animation
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shake {{
                0%, 100% {{ transform: translateX(0); }}
                20% {{ transform: translateX(-10px); }}
                40% {{ transform: translateX(10px); }}
                60% {{ transform: translateX(-10px); }}
                80% {{ transform: translateX(10px); }}
            }}
        `;
        document.head.appendChild(shakeStyle);
    </script>
'''

# Enhanced CSS for 36% larger images and improved brand display
ENHANCED_IMAGE_CSS = f'''
        /* ===== INTERNAL VERSION - ENHANCED IMAGE DISPLAY ===== */
        /* Images enlarged by 36% with improved brand asset styling */

        /* Override v16 image sizes with 36% increase */
        .v16-image img {{
            width: 100%;
            height: auto;
            border-radius: {calculate_new_size(14)}px;
            box-shadow: 0 {calculate_new_size(10)}px {calculate_new_size(35)}px rgba(102, 126, 234, 0.25);
            border: {calculate_new_size(2)}px solid rgba(102, 126, 234, 0.32);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }}

        .v16-hero img {{ max-width: {calculate_new_size(800)}px; }}
        .v16-large img {{ max-width: {calculate_new_size(650)}px; }}
        .v16-medium img {{ max-width: {calculate_new_size(500)}px; }}

        .v16-image img:hover {{
            transform: scale(1.04) translateY(-5px);
            box-shadow: 0 {calculate_new_size(20)}px {calculate_new_size(55)}px rgba(102, 126, 234, 0.38);
        }}

        /* Floating images 36% larger */
        .v16-float {{
            width: {int(44 * SIZE_MULTIPLIER)}%;
            max-width: {calculate_new_size(380)}px;
            margin-bottom: {calculate_new_size(22)}px;
        }}

        .v16-float-right {{
            margin-left: {calculate_new_size(28)}px;
        }}

        .v16-float-left {{
            margin-right: {calculate_new_size(28)}px;
        }}

        .v16-float img {{
            width: 100%;
            height: auto;
            border-radius: {calculate_new_size(12)}px;
            box-shadow: 0 {calculate_new_size(10)}px {calculate_new_size(32)}px rgba(102, 126, 234, 0.22);
            border: {calculate_new_size(2)}px solid rgba(102, 126, 234, 0.28);
            transition: all 0.35s ease;
        }}

        .v16-float img:hover {{
            transform: scale(1.05);
            box-shadow: 0 {calculate_new_size(16)}px {calculate_new_size(44)}px rgba(102, 126, 234, 0.32);
        }}

        /* Image captions enhanced */
        .v16-caption {{
            margin-top: {calculate_new_size(14)}px;
            font-size: {calculate_new_size(13)}px;
            color: #667eea;
            font-style: italic;
            font-weight: 600;
            text-align: center;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }}

        /* Gallery items 36% larger */
        .aether-gallery {{
            gap: {calculate_new_size(24)}px;
        }}

        .aether-gallery-item {{
            min-width: {calculate_new_size(300)}px !important;
            min-height: {calculate_new_size(280)}px !important;
        }}

        .aether-gallery-item img {{
            min-height: {calculate_new_size(260)}px !important;
            object-fit: cover !important;
            border-radius: {calculate_new_size(14)}px !important;
            border: {calculate_new_size(3)}px solid rgba(102, 126, 234, 0.25) !important;
        }}

        .aether-gallery-item:hover img {{
            transform: scale(1.06);
            box-shadow: 0 {calculate_new_size(18)}px {calculate_new_size(50)}px rgba(102, 126, 234, 0.35);
        }}

        /* Brand asset specific enhancements */
        .brand-logo-container img {{
            max-width: {calculate_new_size(600)}px !important;
            filter: drop-shadow(0 {calculate_new_size(12)}px {calculate_new_size(35)}px rgba(102, 126, 234, 0.7));
        }}

        /* Button icons 36% larger */
        .button-icon {{
            max-width: {calculate_new_size(340)}px !important;
            filter: drop-shadow(0 {calculate_new_size(10)}px {calculate_new_size(25)}px rgba(0, 0, 0, 0.55));
        }}

        .main-desktop-button:hover .button-icon {{
            transform: scale(1.12) translateY(-7px);
        }}

        /* Main desktop buttons larger */
        .main-desktop-button {{
            min-width: {calculate_new_size(380)}px;
            max-width: {calculate_new_size(420)}px;
            min-height: {calculate_new_size(400)}px;
            padding: {calculate_new_size(45)}px {calculate_new_size(35)}px;
            gap: {calculate_new_size(25)}px;
            border-radius: {calculate_new_size(24)}px;
        }}

        /* Content images in windows */
        .content-image img,
        .content-image-float img {{
            border-radius: {calculate_new_size(16)}px;
            box-shadow: 0 {calculate_new_size(14)}px {calculate_new_size(45)}px rgba(102, 126, 234, 0.28);
            border: {calculate_new_size(3)}px solid rgba(102, 126, 234, 0.32);
        }}

        .content-image-hero img {{ max-width: {calculate_new_size(850)}px; }}
        .content-image-large img {{ max-width: {calculate_new_size(700)}px; }}
        .content-image-medium img {{ max-width: {calculate_new_size(550)}px; }}

        .content-image-float {{
            width: {int(45 * SIZE_MULTIPLIER)}%;
            max-width: {calculate_new_size(400)}px;
            margin-bottom: {calculate_new_size(28)}px;
        }}

        /* Loading screen logo larger */
        .alchemical-loader {{
            max-width: {calculate_new_size(350)}px;
        }}

        /* Fix rendering issues */

        /* Ensure images don't overflow containers */
        .window-content img {{
            max-width: 100%;
            height: auto;
        }}

        /* Fix float clearing */
        .window-content::after {{
            content: "";
            display: table;
            clear: both;
        }}

        /* Prevent image overlap on sections */
        .section-divider {{
            clear: both;
        }}

        /* Fix highlight box overflow */
        .highlight-box,
        .takeaway-box,
        .info-box {{
            overflow: hidden;
        }}

        /* Smooth image loading */
        img {{
            opacity: 1;
            transition: opacity 0.3s ease;
        }}

        img[loading="lazy"] {{
            opacity: 0;
        }}

        img[loading="lazy"].loaded,
        img[loading="lazy"]:not([src=""]) {{
            opacity: 1;
        }}

        /* Mobile responsive for larger images */
        @media (max-width: 1200px) {{
            .v16-hero img {{ max-width: {calculate_new_size(700)}px; }}
            .v16-large img {{ max-width: {calculate_new_size(550)}px; }}
            .v16-float {{ max-width: {calculate_new_size(320)}px; }}
        }}

        @media (max-width: 900px) {{
            .v16-hero img {{ max-width: {calculate_new_size(600)}px; }}
            .v16-large img {{ max-width: {calculate_new_size(480)}px; }}
            .v16-float {{ width: 50%; max-width: {calculate_new_size(280)}px; }}
            .brand-logo-container img {{ max-width: {calculate_new_size(500)}px !important; }}
            .main-desktop-button {{
                min-width: {calculate_new_size(320)}px;
                min-height: {calculate_new_size(350)}px;
            }}
        }}

        @media (max-width: 768px) {{
            .v16-float {{
                float: none !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: {calculate_new_size(20)}px 0 !important;
            }}

            .v16-image img,
            .v16-float img {{
                max-width: 100% !important;
                border-radius: {calculate_new_size(12)}px;
            }}

            .brand-logo-container img {{
                max-width: 90% !important;
            }}

            .main-desktop-button {{
                min-width: 100%;
                min-height: auto;
                padding: {calculate_new_size(35)}px {calculate_new_size(25)}px;
            }}

            .button-icon {{
                max-width: 280px !important;
            }}
        }}

        @media (max-width: 480px) {{
            .v16-image img {{
                border-radius: {calculate_new_size(10)}px;
            }}

            .v16-caption {{
                font-size: {calculate_new_size(11)}px;
            }}

            .alchemical-loader {{
                max-width: 280px;
            }}
        }}

        /* Performance optimizations */
        .v16-image img,
        .v16-float img,
        .aether-gallery-item img,
        .brand-logo-container img,
        .button-icon {{
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }}
'''

def process_html():
    """Process the v16 HTML file and create protected internal version"""

    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find the position after <body> tag to insert password protection
    body_match = re.search(r'<body[^>]*>', html)
    if body_match:
        insert_pos = body_match.end()
        html = html[:insert_pos] + '\n' + PASSWORD_PROTECTION + '\n' + html[insert_pos:]
        print("Added password protection overlay")

    # Find position before </style> to insert enhanced CSS
    # Insert before the first </style> to ensure it takes precedence
    style_end = html.find('</style>')
    if style_end != -1:
        html = html[:style_end] + '\n' + ENHANCED_IMAGE_CSS + '\n' + html[style_end:]
        print("Added enhanced image CSS with 36% size increase")

    # Update the title to indicate internal version
    html = html.replace(
        '<title>AETHER | Phygital Experience Platform | v6.2 | December 2025 | Optimized Edition</title>',
        '<title>AETHER | Internal Platform | v6.3 | December 2025 | Protected Edition</title>'
    )

    # Update boot text
    html = html.replace(
        'INITIALIZING AETHER PXR v3.0...',
        'INITIALIZING AETHER PXR v3.1 INTERNAL...'
    )

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    file_size = os.path.getsize(OUTPUT_FILE) / 1024 / 1024
    print(f"\nDone! Created: {OUTPUT_FILE}")
    print(f"File size: {file_size:.2f} MB")
    print(f"Access code: {ACCESS_CODE}")
    print(f"Image size increase: 36%")

    # Statistics
    total_base64 = html.count('data:image/webp;base64')
    print(f"Embedded base64 images: {total_base64}")

if __name__ == "__main__":
    process_html()
