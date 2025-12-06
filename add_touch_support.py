#!/usr/bin/env python3
"""
Add touch support and JavaScript optimizations:
1. Add touch event handlers for window dragging
2. Add passive event listeners
3. Improve performance with requestAnimationFrame
4. Add error handling
"""

import re

INPUT_FILE = "aether-internal-protected.html"
OUTPUT_FILE = "aether-internal-protected.html"

# New JavaScript to add at the end of the existing script
TOUCH_SUPPORT_JS = '''

        // ===== TOUCH SUPPORT FOR MOBILE =====
        // Touch event handlers for window dragging
        let touchStartX = 0;
        let touchStartY = 0;
        let touchDraggedWindow = null;
        let touchOffsetX = 0;
        let touchOffsetY = 0;

        function startTouchDrag(e, windowId) {
            if (e.touches.length !== 1) return;

            const touch = e.touches[0];
            touchDraggedWindow = document.getElementById(windowId);
            if (!touchDraggedWindow) return;

            touchDraggedWindow.style.zIndex = ++windowZIndex;
            const rect = touchDraggedWindow.getBoundingClientRect();
            touchOffsetX = touch.clientX - rect.left;
            touchOffsetY = touch.clientY - rect.top;

            e.preventDefault();
        }

        document.addEventListener('touchmove', (e) => {
            if (!touchDraggedWindow || e.touches.length !== 1) return;

            const touch = e.touches[0];
            const x = touch.clientX - touchOffsetX;
            const y = touch.clientY - touchOffsetY;

            requestAnimationFrame(() => {
                if (touchDraggedWindow) {
                    touchDraggedWindow.style.left = Math.max(0, Math.min(x, window.innerWidth - touchDraggedWindow.offsetWidth)) + 'px';
                    touchDraggedWindow.style.top = Math.max(0, Math.min(y, window.innerHeight - 40 - touchDraggedWindow.offsetHeight)) + 'px';
                }
            });

            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchend', () => {
            touchDraggedWindow = null;
        }, { passive: true });

        // ===== PERFORMANCE OPTIMIZATIONS =====
        // Debounce resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 100);
        }, { passive: true });

        // ===== LAZY LOAD IMAGES =====
        // Mark images as loaded when they finish loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                }, { once: true, passive: true });
            }
        });

        // ===== SMOOTH SCROLL FOR WINDOW CONTENT =====
        document.querySelectorAll('.window-content').forEach(content => {
            content.style.scrollBehavior = 'smooth';
        });

        // ===== KEYBOARD ACCESSIBILITY =====
        document.addEventListener('keydown', (e) => {
            // ESC to close active window
            if (e.key === 'Escape') {
                const activeWindows = document.querySelectorAll('.window.active');
                activeWindows.forEach(win => {
                    const windowName = win.id.replace('window-', '');
                    closeWindow(windowName);
                });
            }

            // Enter on access code input
            if (e.key === 'Enter' && document.activeElement.id === 'accessCode') {
                verifyAccess();
            }
        }, { passive: true });

        // ===== PREFERS REDUCED MOTION =====
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            // Stop matrix animation
            cancelAnimationFrame(window.matrixAnimationId);
            canvas.style.display = 'none';
        }

        // ===== ERROR BOUNDARY FOR CANVAS =====
        try {
            if (!ctx) {
                console.warn('Canvas context not available');
                canvas.style.display = 'none';
            }
        } catch (err) {
            console.warn('Canvas error:', err);
        }

        // ===== ACCESSIBILITY: FOCUS MANAGEMENT =====
        // Trap focus in access overlay when visible
        const accessOverlay = document.getElementById('accessOverlay');
        if (accessOverlay && !accessOverlay.classList.contains('hidden')) {
            const focusableElements = accessOverlay.querySelectorAll('input, button');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
'''

# Update window headers to include touch support
def add_touch_handlers(html):
    """Add touch handlers to window headers"""
    # Pattern to find window headers with onmousedown
    pattern = r'onmousedown="startDrag\(event, \'([^\']+)\'\)"'

    def add_touch(match):
        window_id = match.group(1)
        return f'onmousedown="startDrag(event, \'{window_id}\')" ontouchstart="startTouchDrag(event, \'{window_id}\')"'

    return re.sub(pattern, add_touch, html)

def add_js_optimizations(html):
    """Add JavaScript optimizations before </script>"""
    # Find the last </script> tag
    last_script_end = html.rfind('</script>')
    if last_script_end == -1:
        return html

    # Insert the touch support JS before </script>
    html = html[:last_script_end] + TOUCH_SUPPORT_JS + '\n    ' + html[last_script_end:]
    return html

def update_mouse_handlers(html):
    """Update mouse handlers to use requestAnimationFrame"""
    # Update mousemove handler
    old_mousemove = '''document.addEventListener('mousemove', (e) => {
            if (!isDragging || !draggedWindow) return;
            e.preventDefault();
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            draggedWindow.style.left = Math.max(0, Math.min(x, window.innerWidth - draggedWindow.offsetWidth)) + 'px';
            draggedWindow.style.top = Math.max(0, Math.min(y, window.innerHeight - 40 - draggedWindow.offsetHeight)) + 'px';
        });'''

    new_mousemove = '''document.addEventListener('mousemove', (e) => {
            if (!isDragging || !draggedWindow) return;
            e.preventDefault();
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            requestAnimationFrame(() => {
                if (draggedWindow) {
                    draggedWindow.style.left = Math.max(0, Math.min(x, window.innerWidth - draggedWindow.offsetWidth)) + 'px';
                    draggedWindow.style.top = Math.max(0, Math.min(y, window.innerHeight - 40 - draggedWindow.offsetHeight)) + 'px';
                }
            });
        });'''

    html = html.replace(old_mousemove, new_mousemove)
    return html

def main():
    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print("Adding touch event handlers to window headers...")
    html = add_touch_handlers(html)

    print("Adding JavaScript optimizations...")
    html = add_js_optimizations(html)

    print("Updating mouse handlers for performance...")
    html = update_mouse_handlers(html)

    # Update version
    html = html.replace('v6.4 | December 2025 | Optimized Edition',
                        'v6.5 | December 2025 | Mobile Optimized')
    html = html.replace('AETHER PXR v3.2 OPTIMIZED',
                        'AETHER PXR v3.3 MOBILE')

    print(f"Writing {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    import os
    file_size = os.path.getsize(OUTPUT_FILE) / 1024 / 1024

    print(f"\nTouch support added successfully!")
    print(f"File: {OUTPUT_FILE}")
    print(f"Size: {file_size:.2f} MB")

    # Verify touch handlers
    touch_count = html.count('ontouchstart')
    print(f"Touch handlers added: {touch_count}")

if __name__ == "__main__":
    main()
