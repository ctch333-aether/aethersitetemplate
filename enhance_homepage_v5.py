#!/usr/bin/env python3
"""
AETHER Homepage Enhancement Script v5:
1. Add smooth scroll behavior for anchor links
2. Add print styles for better printing experience
3. Add image loading optimization (lazy loading)
4. Add enhanced micro-interactions and animations
5. Add touch-friendly improvements for mobile
6. Add scroll progress indicator
7. Add enhanced window interactions
"""

import re

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def add_v5_enhancements(html_content):
    """Add v5 enhancements to the HTML content."""

    # CSS enhancements to add
    v5_css = '''
        /* ===== V5 ENHANCEMENTS ===== */

        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }

        /* Scroll progress indicator */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--aether-purple), var(--aether-purple-dark));
            z-index: 10001;
            transition: width 0.1s ease-out;
        }

        /* Enhanced window animations */
        .window {
            transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
        }

        .window:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(106, 13, 173, 0.3);
        }

        .window.window-opening {
            animation: windowOpen 0.4s ease-out forwards;
        }

        .window.window-closing {
            animation: windowClose 0.3s ease-in forwards;
        }

        @keyframes windowOpen {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes windowClose {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
        }

        /* Enhanced button micro-interactions */
        .main-desktop-button {
            transition: transform 0.2s ease, filter 0.2s ease;
        }

        .main-desktop-button:active {
            transform: scale(0.95);
        }

        .main-desktop-button::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
            pointer-events: none;
        }

        .main-desktop-button:hover::after {
            width: 100%;
            height: 100%;
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
            .main-desktop-button {
                min-height: 44px;
                min-width: 44px;
            }

            .window-controls span {
                min-width: 28px;
                min-height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            /* Larger touch targets */
            .menu-bar > span,
            .status-bar span {
                padding: 8px 12px;
            }
        }

        /* Image loading states */
        img {
            transition: opacity 0.3s ease;
        }

        img[loading="lazy"] {
            opacity: 0;
        }

        img.loaded {
            opacity: 1;
        }

        /* Scroll-triggered animations */
        .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .scroll-reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }

        /* Enhanced selection styling */
        ::selection {
            background: var(--aether-purple);
            color: white;
        }

        ::-moz-selection {
            background: var(--aether-purple);
            color: white;
        }

        /* Improved scrollbar styling */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        ::-webkit-scrollbar-track {
            background: var(--win95-gray);
            border: 1px solid #808080;
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #dfdfdf 0%, #bfbfbf 100%);
            border: 1px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #efefef 0%, #cfcfcf 100%);
        }

        ::-webkit-scrollbar-corner {
            background: var(--win95-gray);
        }

        /* Print styles */
        @media print {
            body {
                background: white !important;
                color: black !important;
            }

            .loading-screen,
            .scroll-progress,
            .back-to-top,
            .skip-link,
            .preloader,
            .window-controls,
            .menu-bar,
            .status-bar {
                display: none !important;
            }

            .desktop {
                display: block !important;
                padding: 0 !important;
            }

            .window {
                box-shadow: none !important;
                border: 1px solid #ccc !important;
                page-break-inside: avoid;
                margin-bottom: 20px !important;
            }

            .window-content {
                max-height: none !important;
                overflow: visible !important;
            }

            img {
                max-width: 100% !important;
                page-break-inside: avoid;
            }

            a {
                color: black !important;
                text-decoration: underline !important;
            }

            a[href]::after {
                content: " (" attr(href) ")";
                font-size: 0.8em;
                color: #666;
            }

            .main-desktop-button {
                display: inline-block !important;
                margin: 10px !important;
            }
        }

        /* Page visibility transitions */
        .page-transitioning {
            opacity: 0.5;
            pointer-events: none;
        }
    '''

    # JavaScript enhancements to add
    v5_js = '''
        // ===== V5 ENHANCEMENTS =====

        // Scroll progress indicator
        (function initScrollProgress() {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-label', 'Page scroll progress');
            document.body.insertBefore(progressBar, document.body.firstChild);

            function updateProgress() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                progressBar.style.width = progress + '%';
                progressBar.setAttribute('aria-valuenow', Math.round(progress));
            }

            window.addEventListener('scroll', updateProgress, { passive: true });
            updateProgress();
        })();

        // Enhanced window open/close animations
        (function enhanceWindowAnimations() {
            const originalOpenWindow = window.openWindow;
            const originalCloseWindow = window.closeWindow;

            if (originalOpenWindow) {
                window.openWindow = function(windowId) {
                    originalOpenWindow(windowId);
                    const win = document.getElementById(windowId + '-window') || document.getElementById(windowId + 'Window');
                    if (win) {
                        win.classList.remove('window-closing');
                        win.classList.add('window-opening');
                        setTimeout(() => win.classList.remove('window-opening'), 400);
                    }
                };
            }

            if (originalCloseWindow) {
                window.closeWindow = function(windowId) {
                    const win = document.getElementById(windowId + '-window') || document.getElementById(windowId + 'Window');
                    if (win) {
                        win.classList.add('window-closing');
                        setTimeout(() => {
                            originalCloseWindow(windowId);
                            win.classList.remove('window-closing');
                        }, 300);
                    } else {
                        originalCloseWindow(windowId);
                    }
                };
            }
        })();

        // Lazy loading for images
        (function initLazyLoading() {
            const images = document.querySelectorAll('img:not(.alchemical-loader)');

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                images.forEach(img => {
                    if (img.complete) {
                        img.classList.add('loaded');
                    } else {
                        img.addEventListener('load', () => img.classList.add('loaded'));
                        imageObserver.observe(img);
                    }
                });
            } else {
                // Fallback for older browsers
                images.forEach(img => img.classList.add('loaded'));
            }
        })();

        // Scroll reveal animations
        (function initScrollReveal() {
            const revealElements = document.querySelectorAll('.window');

            if ('IntersectionObserver' in window) {
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('scroll-reveal', 'revealed');
                        }
                    });
                }, {
                    rootMargin: '-50px',
                    threshold: 0.1
                });

                revealElements.forEach(el => {
                    revealObserver.observe(el);
                });
            }
        })();

        // Touch gesture support
        (function initTouchGestures() {
            let touchStartX = 0;
            let touchStartY = 0;

            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                const diffX = touchEndX - touchStartX;
                const diffY = touchEndY - touchStartY;

                // Detect swipe right to go back to top (on left edge)
                if (Math.abs(diffX) > Math.abs(diffY) && diffX > 100 && touchStartX < 50) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, { passive: true });
        })();

        // Keyboard shortcuts
        (function initKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Escape to close top window
                if (e.key === 'Escape') {
                    const openWindows = document.querySelectorAll('.window[style*="display: block"], .window:not([style*="display: none"])');
                    if (openWindows.length > 0) {
                        const topWindow = openWindows[openWindows.length - 1];
                        const closeBtn = topWindow.querySelector('.window-controls span:last-child');
                        if (closeBtn) closeBtn.click();
                    }
                }

                // Home key to scroll to top
                if (e.key === 'Home' && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }

                // End key to scroll to bottom
                if (e.key === 'End' && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                }
            });
        })();

        // Double-click to maximize window
        (function initWindowMaximize() {
            document.querySelectorAll('.title-bar').forEach(titleBar => {
                titleBar.addEventListener('dblclick', () => {
                    const win = titleBar.closest('.window');
                    if (win) {
                        win.classList.toggle('maximized');
                        if (win.classList.contains('maximized')) {
                            win.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 10000 !important;';
                        } else {
                            win.style.cssText = '';
                        }
                    }
                });
            });
        })();

        // Performance: Reduce animations when page not visible
        (function initVisibilityOptimization() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    document.body.classList.add('reduce-motion');
                } else {
                    document.body.classList.remove('reduce-motion');
                }
            });
        })();

        console.log('AETHER v5 Enhancements loaded successfully!');
    '''

    # Insert CSS before </style> in the head
    style_pattern = r'(</style>\s*</head>)'
    if re.search(style_pattern, html_content, re.IGNORECASE):
        html_content = re.sub(
            style_pattern,
            v5_css + r'\n    \1',
            html_content,
            count=1,
            flags=re.IGNORECASE
        )
        print("Added v5 CSS enhancements")

    # Insert JS before the believe footer section
    believe_pattern = r'(<!-- I Believe Footer -->)'
    if re.search(believe_pattern, html_content, re.IGNORECASE):
        js_block = f'\n    <script>\n    {v5_js}\n    </script>\n\n'
        html_content = re.sub(
            believe_pattern,
            js_block + r'\1',
            html_content,
            count=1,
            flags=re.IGNORECASE
        )
        print("Added v5 JavaScript enhancements")

    # Add loading="lazy" to images (except the loader)
    img_pattern = r'<img\s+class="([^"]*)"([^>]*?)(?<!loading="lazy")>'
    def add_lazy_loading(match):
        class_attr = match.group(1)
        rest = match.group(2)
        if 'alchemical-loader' in class_attr:
            return match.group(0)  # Don't add lazy loading to the loader
        if 'loading=' not in rest:
            return f'<img class="{class_attr}" loading="lazy"{rest}>'
        return match.group(0)

    html_content = re.sub(img_pattern, add_lazy_loading, html_content)
    print("Added lazy loading to images")

    return html_content

def main():
    filepath = 'AETHER-Internal-Knowledge-Base-Concise (2).html'

    print(f"Reading {filepath}...")
    content = read_file(filepath)

    print("Applying v5 enhancements...")
    enhanced_content = add_v5_enhancements(content)

    print(f"Writing enhanced content back to {filepath}...")
    write_file(filepath, enhanced_content)

    print("Done! V5 enhancements applied successfully.")
    print("\nEnhancements added:")
    print("1. Smooth scroll behavior")
    print("2. Scroll progress indicator")
    print("3. Enhanced window animations (open/close)")
    print("4. Button micro-interactions")
    print("5. Touch-friendly improvements")
    print("6. Image lazy loading")
    print("7. Scroll reveal animations")
    print("8. Custom scrollbar styling")
    print("9. Print styles")
    print("10. Keyboard shortcuts (Escape, Home, End)")
    print("11. Double-click to maximize windows")
    print("12. Performance optimizations")

if __name__ == '__main__':
    main()
