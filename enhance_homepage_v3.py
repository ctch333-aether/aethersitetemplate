#!/usr/bin/env python3
"""
AETHER Homepage Enhancement Script v3:
1. Add floating "Back to Top" button
2. Enhanced button hover animations
3. Improved co-founder section mobile responsiveness
4. Add subtle loading animations
5. Better visual polish throughout
"""

import re

# Read HTML file
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'r') as f:
    html = f.read()

# Enhancement 1: Back to Top Button HTML and CSS
back_to_top_html = '''
    <!-- Back to Top Button -->
    <button id="backToTop" class="back-to-top-btn" onclick="scrollToTop()" title="Back to top">
        <span class="back-to-top-arrow">&#8593;</span>
    </button>
'''

back_to_top_css = '''
    /* ============================================
       BACK TO TOP BUTTON
       ============================================ */
    .back-to-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(145deg, var(--aether-purple), var(--aether-purple-dark));
        border: 2px solid var(--win95-dark);
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 9999;
        box-shadow:
            inset 1px 1px 0 rgba(255,255,255,0.3),
            inset -1px -1px 0 rgba(0,0,0,0.2),
            3px 3px 6px rgba(0,0,0,0.3);
    }

    .back-to-top-btn.visible {
        opacity: 1;
        visibility: visible;
    }

    .back-to-top-btn:hover {
        transform: translateY(-3px);
        box-shadow:
            inset 1px 1px 0 rgba(255,255,255,0.4),
            inset -1px -1px 0 rgba(0,0,0,0.2),
            5px 5px 10px rgba(0,0,0,0.4);
    }

    .back-to-top-btn:active {
        transform: translateY(0);
    }

    .back-to-top-arrow {
        color: white;
        font-size: 24px;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        .back-to-top-btn {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
        .back-to-top-arrow {
            font-size: 20px;
        }
    }
'''

back_to_top_js = '''
    // Back to Top Button Functionality
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
'''

# Enhancement 2: Enhanced button effects and animations
enhanced_button_css = '''
    /* ============================================
       ENHANCED BUTTON EFFECTS
       ============================================ */
    .main-desktop-button {
        position: relative;
        overflow: hidden;
    }

    .main-desktop-button::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.2),
            transparent
        );
        transition: left 0.5s ease;
    }

    .main-desktop-button:hover::after {
        left: 100%;
    }

    /* Pulse effect on button labels */
    .button-label {
        transition: all 0.3s ease;
    }

    .main-desktop-button:hover .button-label {
        text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }

    /* Enhanced window title bars */
    .window-title {
        transition: all 0.3s ease;
    }

    .window:hover .window-title {
        background: linear-gradient(90deg, var(--aether-purple), var(--aether-purple-dark), var(--aether-purple));
    }
'''

# Enhancement 3: Co-founder section mobile improvements
cofounder_mobile_css = '''
    /* ============================================
       CO-FOUNDER SECTION MOBILE OPTIMIZATION
       ============================================ */
    @media (max-width: 768px) {
        .cofounder-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
            padding: 15px !important;
        }

        .cofounder-grid > div:first-child {
            text-align: center !important;
            margin-bottom: 10px;
        }

        .cofounder-grid img {
            max-width: 120px !important;
            margin: 0 auto;
        }
    }

    @media (max-width: 480px) {
        .cofounder-grid {
            padding: 10px !important;
        }

        .cofounder-grid img {
            max-width: 100px !important;
        }
    }
'''

# Enhancement 4: Smooth loading transitions
loading_css = '''
    /* ============================================
       SMOOTH LOADING TRANSITIONS
       ============================================ */
    .window {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Staggered animation for content sections */
    .window-content > * {
        animation: fadeIn 0.4s ease-out forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    /* Improve scroll anchor behavior */
    [id] {
        scroll-margin-top: 20px;
    }
'''

# Enhancement 5: Better highlight box styling
highlight_css = '''
    /* ============================================
       ENHANCED HIGHLIGHT BOXES
       ============================================ */
    .highlight-box,
    .takeaway-box {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .highlight-box:hover,
    .takeaway-box:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
    }

    .highlight-box::before,
    .takeaway-box::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, var(--aether-purple), var(--aether-purple-dark));
    }
'''

# Combine all CSS enhancements
all_css_enhancements = f'''
    <style>
    {back_to_top_css}
    {enhanced_button_css}
    {cofounder_mobile_css}
    {loading_css}
    {highlight_css}
    </style>
'''

# Find the closing </head> tag and insert CSS before it
html = re.sub(
    r'(</head>)',
    all_css_enhancements + r'\n    \1',
    html
)

# Find the closing </body> tag and insert Back to Top button and JS before it
closing_body_content = f'''
{back_to_top_html}
    <script>
    {back_to_top_js}
    </script>
</body>'''

html = re.sub(
    r'</body>',
    closing_body_content,
    html
)

# Write the updated HTML
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'w') as f:
    f.write(html)

print("Homepage enhanced successfully!")
print("- Added floating 'Back to Top' button")
print("- Enhanced button hover animations")
print("- Improved co-founder section mobile responsiveness")
print("- Added smooth loading transitions")
print("- Better highlight box styling")
