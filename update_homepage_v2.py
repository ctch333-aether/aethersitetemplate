#!/usr/bin/env python3
"""
Update AETHER homepage v2:
1. Add contact link (AETHERCODEX@pm.me) below believe asset
2. Enhanced mobile optimization for feedback section
"""

import re

# Read HTML file
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'r') as f:
    html = f.read()

# Contact link HTML and CSS to add below believe footer
contact_below_believe = '''
        <!-- Primary Contact Link -->
        <div class="primary-contact-link">
            <a href="mailto:AETHERCODEX@pm.me" class="aether-email-link">
                <span class="email-icon">&#9993;</span>
                AETHERCODEX@pm.me
            </a>
        </div>
    </div>

    <style>
        .primary-contact-link {
            text-align: center;
            padding: 20px 10px 40px 10px;
            background: linear-gradient(180deg, transparent, rgba(102, 126, 234, 0.1));
        }

        .aether-email-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--aether-purple);
            text-decoration: none;
            font-size: clamp(16px, 3vw, 22px);
            font-weight: bold;
            padding: 15px 30px;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border: 2px solid var(--win95-dark);
            border-radius: 8px;
            box-shadow:
                inset 1px 1px 0 #ffffff,
                inset -1px -1px 0 #808080,
                3px 3px 0 rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .aether-email-link:hover {
            background: linear-gradient(145deg, var(--aether-purple), var(--aether-purple-dark));
            color: white;
            transform: translateY(-3px);
            box-shadow:
                inset 1px 1px 0 rgba(255,255,255,0.3),
                inset -1px -1px 0 rgba(0,0,0,0.2),
                5px 5px 15px rgba(102, 126, 234, 0.4);
        }

        .email-icon {
            font-size: 1.3em;
        }

        /* Enhanced Mobile Optimizations */
        @media (max-width: 768px) {
            .primary-contact-link {
                padding: 15px 10px 30px 10px;
            }

            .aether-email-link {
                padding: 12px 20px;
                flex-direction: column;
                gap: 5px;
            }

            .feedback-contact-section {
                padding: 30px 10px !important;
                margin: 20px 0 !important;
            }

            .contact-grid {
                gap: 20px !important;
            }

            .contact-card {
                padding: 20px 15px !important;
            }

            .contact-icon {
                font-size: 36px !important;
            }

            .contact-card h3 {
                font-size: 18px !important;
            }

            .contact-link {
                padding: 8px 20px !important;
                font-size: 13px !important;
            }

            .social-links {
                flex-direction: column;
                gap: 10px !important;
            }

            .feedback-form {
                padding: 20px !important;
                margin: 10px !important;
            }

            .feedback-form h3 {
                margin: -20px -20px 15px -20px !important;
                padding: 8px !important;
                font-size: 16px !important;
            }

            .feedback-actions {
                flex-direction: column;
            }

            .btn-cancel, .btn-submit {
                width: 100%;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            .aether-email-link {
                font-size: 14px;
                padding: 10px 15px;
            }

            .feedback-title {
                font-size: 20px !important;
            }

            .feedback-subtitle {
                font-size: 13px !important;
            }

            .contact-card {
                padding: 15px 10px !important;
            }

            .contact-icon {
                font-size: 30px !important;
            }
        }
    </style>
'''

# Find and replace the closing of believe-footer div
# The believe footer structure is: <div class="believe-footer"><img ...></div>
# We need to add content after the img but before the closing </div>

# Pattern to find the believe footer closing
believe_footer_end_pattern = r'(<div class="believe-footer">[\s\S]*?<img[^>]+>)\s*</div>'

def add_contact_link(match):
    img_section = match.group(1)
    return img_section + contact_below_believe

html = re.sub(believe_footer_end_pattern, add_contact_link, html)

# Write updated HTML
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'w') as f:
    f.write(html)

print("Homepage updated successfully!")
print("- Added contact link (AETHERCODEX@pm.me) below believe asset")
print("- Enhanced mobile optimization for feedback section")
print("- Added responsive styles for various screen sizes")
