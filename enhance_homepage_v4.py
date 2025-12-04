#!/usr/bin/env python3
"""
AETHER Homepage Enhancement Script v4:
1. Add accessibility improvements (ARIA labels, roles)
2. Enhanced keyboard navigation for buttons
3. Add tooltips on hover
4. Improved focus states for keyboard users
5. Add subtle preloader animation
"""

import re

# Read HTML file
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'r') as f:
    html = f.read()

# Enhancement 1: Accessibility & Keyboard Navigation CSS
accessibility_css = '''
    <style>
    /* ============================================
       ACCESSIBILITY ENHANCEMENTS
       ============================================ */

    /* Skip to main content link for screen readers */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--aether-purple);
        color: white;
        padding: 8px 16px;
        z-index: 100000;
        border: none;
        border-radius: 0 0 4px 0;
        font-size: 14px;
        transition: top 0.3s ease;
    }

    .skip-link:focus {
        top: 0;
    }

    /* Enhanced focus states for keyboard navigation */
    .main-desktop-button:focus {
        outline: 3px solid var(--aether-pink);
        outline-offset: 4px;
        box-shadow: 0 0 20px rgba(240, 147, 251, 0.5);
    }

    .main-desktop-button:focus-visible {
        outline: 3px solid var(--aether-pink);
        outline-offset: 4px;
        animation: focusPulse 1.5s ease infinite;
    }

    @keyframes focusPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(240, 147, 251, 0.4); }
        50% { box-shadow: 0 0 25px rgba(240, 147, 251, 0.7); }
    }

    /* Focus states for all interactive elements */
    a:focus,
    button:focus {
        outline: 2px solid var(--aether-purple);
        outline-offset: 2px;
    }

    a:focus-visible,
    button:focus-visible {
        outline: 2px solid var(--aether-pink);
        outline-offset: 2px;
    }

    /* Remove default focus outline and use custom */
    *:focus {
        outline-color: var(--aether-purple);
    }

    /* ============================================
       TOOLTIP SYSTEM
       ============================================ */
    .main-desktop-button {
        position: relative;
    }

    .main-desktop-button::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-5px);
        background: rgba(44, 62, 80, 0.95);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 1px solid var(--aether-purple);
    }

    .main-desktop-button:hover::before,
    .main-desktop-button:focus::before {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(-10px);
    }

    /* Tooltip arrow */
    .main-desktop-button[data-tooltip]::after {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: rgba(44, 62, 80, 0.95) transparent transparent transparent;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .main-desktop-button:hover[data-tooltip]::after,
    .main-desktop-button:focus[data-tooltip]::after {
        opacity: 1;
        visibility: visible;
    }

    /* ============================================
       PRELOADER ANIMATION
       ============================================ */
    .page-preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .page-preloader.hidden {
        opacity: 0;
        visibility: hidden;
    }

    .preloader-logo {
        width: 80px;
        height: 80px;
        border: 4px solid var(--aether-purple);
        border-radius: 50%;
        animation: preloaderSpin 1.2s linear infinite;
        border-top-color: var(--aether-pink);
    }

    .preloader-text {
        margin-top: 20px;
        color: white;
        font-size: 14px;
        letter-spacing: 4px;
        text-transform: uppercase;
        animation: preloaderFade 1.5s ease infinite;
    }

    @keyframes preloaderSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes preloaderFade {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }

    /* ============================================
       ENHANCED WINDOW CONTROLS
       ============================================ */
    .window-controls button:focus {
        outline: 2px solid white;
        outline-offset: 1px;
    }

    /* Keyboard hint on desktop buttons */
    .keyboard-hint {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(0,0,0,0.6);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .main-desktop-button:focus .keyboard-hint {
        opacity: 1;
    }

    /* ============================================
       MOBILE ACCESSIBILITY
       ============================================ */
    @media (max-width: 768px) {
        .main-desktop-button::before {
            display: none; /* Hide tooltips on mobile */
        }

        .skip-link:focus {
            padding: 12px 20px;
            font-size: 16px;
        }

        .keyboard-hint {
            display: none;
        }
    }

    /* ============================================
       HIGH CONTRAST MODE SUPPORT
       ============================================ */
    @media (prefers-contrast: high) {
        .main-desktop-button:focus {
            outline: 4px solid yellow;
            outline-offset: 2px;
        }

        .window {
            border: 2px solid white;
        }
    }

    /* ============================================
       REDUCED MOTION SUPPORT
       ============================================ */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }

        .page-preloader {
            display: none;
        }
    }
    </style>
'''

# Enhancement 2: Preloader HTML
preloader_html = '''
    <!-- Page Preloader -->
    <div class="page-preloader" id="pagePreloader">
        <div class="preloader-logo"></div>
        <div class="preloader-text">Loading AETHER</div>
    </div>

    <!-- Skip to main content link -->
    <a href="#desktop" class="skip-link">Skip to main content</a>
'''

# Enhancement 3: Accessibility JavaScript
accessibility_js = '''
    <script>
    // Page Preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('pagePreloader');
        if (preloader) {
            setTimeout(function() {
                preloader.classList.add('hidden');
            }, 500);
        }
    });

    // Keyboard Navigation for Desktop Buttons
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('.main-desktop-button');

        buttons.forEach(function(button, index) {
            // Make buttons focusable
            button.setAttribute('tabindex', '0');
            button.setAttribute('role', 'button');

            // Add tooltips based on button content
            const label = button.querySelector('.button-label');
            if (label) {
                const tooltips = {
                    'ETHOS': 'Explore our vision & credibility',
                    'PATHOS': 'Discover emotional connections',
                    'LOGOS': 'Learn about our technology'
                };
                const tooltipText = tooltips[label.textContent] || '';
                if (tooltipText) {
                    button.setAttribute('data-tooltip', tooltipText);
                }
            }

            // Keyboard activation
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            // Add keyboard hint
            const hint = document.createElement('span');
            hint.className = 'keyboard-hint';
            hint.textContent = 'Enter';
            button.appendChild(hint);
        });

        // Arrow key navigation between buttons
        buttons.forEach(function(button, index) {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % buttons.length;
                    buttons[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + buttons.length) % buttons.length;
                    buttons[prevIndex].focus();
                }
            });
        });

        // Add ARIA labels to windows
        const windows = document.querySelectorAll('.window');
        windows.forEach(function(win) {
            win.setAttribute('role', 'dialog');
            const titleSpan = win.querySelector('.window-title span');
            if (titleSpan) {
                win.setAttribute('aria-label', titleSpan.textContent);
            }
        });

        // Enhance close buttons
        const closeButtons = document.querySelectorAll('.window-controls button');
        closeButtons.forEach(function(btn) {
            btn.setAttribute('aria-label', 'Close window');
            btn.setAttribute('title', 'Close window');
        });

        // Focus trap for open windows
        windows.forEach(function(win) {
            win.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const closeBtn = win.querySelector('.window-controls button');
                    if (closeBtn) closeBtn.click();
                }
            });
        });
    });

    // Announce page loaded to screen readers
    window.addEventListener('load', function() {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -9999px;';
        announcement.textContent = 'AETHER page loaded. Use arrow keys to navigate between main buttons.';
        document.body.appendChild(announcement);

        setTimeout(function() {
            announcement.remove();
        }, 3000);
    });
    </script>
'''

# Insert accessibility CSS before </head>
html = re.sub(
    r'(</head>)',
    accessibility_css + r'\n    \1',
    html
)

# Insert preloader HTML after <body> tag
html = re.sub(
    r'(<body[^>]*>)',
    r'\1\n' + preloader_html,
    html
)

# Insert accessibility JS before </body>
html = re.sub(
    r'(</body>)',
    accessibility_js + r'\n\1',
    html
)

# Write the updated HTML
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'w') as f:
    f.write(html)

print("Homepage enhanced with v4 improvements!")
print("- Added skip-to-content link for accessibility")
print("- Enhanced focus states for keyboard navigation")
print("- Added tooltip system for desktop buttons")
print("- Added page preloader animation")
print("- Keyboard navigation with arrow keys")
print("- ARIA labels and roles for screen readers")
print("- High contrast mode support")
print("- Reduced motion support for accessibility")
