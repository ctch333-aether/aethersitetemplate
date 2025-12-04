#!/usr/bin/env python3
"""
Update AETHER homepage:
1. Update button assets (ETHOS=services1, PATHOS=services2, LOGOS=services3)
2. Add feedback and contact section before believe footer
"""

import json
import re

# Load brand assets
with open('/home/user/aethersitetemplate/brand_assets_base64.json', 'r') as f:
    assets = json.load(f)

# Read HTML file
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'r') as f:
    html = f.read()

# Get base64 data for services assets
services1_b64 = assets['BRANDAsset-services1.png']
services2_b64 = assets['BRANDAsset-services2.png']
services3_b64 = assets['BRANDAsset-services3.png']

# Find and update each button's image
# The buttons are structured as:
# <!-- ETHOS Button -->
# <div class="main-desktop-button" onclick="openWindow('ethos')">
#     <img class="button-icon" src="data:image/png;base64,..." ...

# Pattern to match button sections
button_pattern = r'(<!-- (ETHOS|PATHOS|LOGOS) Button -->[\s\S]*?<img class="button-icon" src=")data:image/png;base64,[^"]+(")'

def replace_button_image(match):
    full_match = match.group(0)
    prefix = match.group(1)
    button_name = match.group(2)
    suffix = match.group(3)

    if button_name == 'ETHOS':
        return f'{prefix}data:image/png;base64,{services1_b64}{suffix}'
    elif button_name == 'PATHOS':
        return f'{prefix}data:image/png;base64,{services2_b64}{suffix}'
    elif button_name == 'LOGOS':
        return f'{prefix}data:image/png;base64,{services3_b64}{suffix}'
    return full_match

# Apply button image updates
html = re.sub(button_pattern, replace_button_image, html)

# Feedback and Contact Section HTML
feedback_section = '''
    <!-- Feedback and Contact Section -->
    <div class="feedback-contact-section" id="feedback-section">
        <div class="feedback-container">
            <h2 class="feedback-title">Connect With Us</h2>
            <p class="feedback-subtitle">We'd love to hear from you. Share your thoughts, ideas, or inquiries.</p>

            <div class="contact-grid">
                <div class="contact-card">
                    <div class="contact-icon">&#128231;</div>
                    <h3>Email Us</h3>
                    <p>hello@aether.phygital</p>
                    <a href="mailto:hello@aether.phygital" class="contact-link">Send Message</a>
                </div>

                <div class="contact-card">
                    <div class="contact-icon">&#128172;</div>
                    <h3>Feedback</h3>
                    <p>Help us improve your experience</p>
                    <button onclick="openFeedbackForm()" class="contact-link">Share Feedback</button>
                </div>

                <div class="contact-card">
                    <div class="contact-icon">&#127760;</div>
                    <h3>Social</h3>
                    <p>Follow our journey</p>
                    <div class="social-links">
                        <span class="social-link">LinkedIn</span>
                        <span class="social-link">Instagram</span>
                    </div>
                </div>
            </div>

            <div class="feedback-form-container" id="feedback-form" style="display: none;">
                <div class="feedback-form">
                    <h3>Share Your Feedback</h3>
                    <textarea id="feedback-text" placeholder="Tell us what you think..." rows="4"></textarea>
                    <div class="feedback-actions">
                        <button onclick="closeFeedbackForm()" class="btn-cancel">Cancel</button>
                        <button onclick="submitFeedback()" class="btn-submit">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .feedback-contact-section {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
            padding: 60px 20px;
            margin: 40px 0;
            border-top: 3px solid var(--aether-purple);
            border-bottom: 3px solid var(--aether-purple);
        }

        .feedback-container {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .feedback-title {
            font-size: clamp(24px, 4vw, 36px);
            color: var(--aether-purple);
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .feedback-subtitle {
            font-size: clamp(14px, 2vw, 18px);
            color: #555;
            margin-bottom: 40px;
        }

        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }

        .contact-card {
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border: 2px solid var(--win95-dark);
            border-radius: 8px;
            padding: 30px 20px;
            box-shadow:
                inset 1px 1px 0 #ffffff,
                inset -1px -1px 0 #808080,
                3px 3px 0 rgba(0,0,0,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .contact-card:hover {
            transform: translateY(-5px);
            box-shadow:
                inset 1px 1px 0 #ffffff,
                inset -1px -1px 0 #808080,
                5px 5px 10px rgba(102, 126, 234, 0.3);
        }

        .contact-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .contact-card h3 {
            color: var(--aether-purple-dark);
            font-size: 20px;
            margin-bottom: 10px;
        }

        .contact-card p {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }

        .contact-link {
            display: inline-block;
            background: linear-gradient(145deg, var(--aether-purple), var(--aether-purple-dark));
            color: white;
            padding: 10px 25px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
        }

        .contact-link:hover {
            background: linear-gradient(145deg, var(--aether-purple-dark), var(--aether-purple));
            transform: translateY(-2px);
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        .social-link {
            background: var(--win95-gray);
            padding: 8px 15px;
            border: 2px outset #ffffff;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .social-link:hover {
            background: var(--aether-blue);
            color: white;
            border-style: inset;
        }

        .feedback-form-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        .feedback-form {
            background: var(--win95-gray);
            border: 3px outset #ffffff;
            padding: 30px;
            max-width: 500px;
            width: 90%;
        }

        .feedback-form h3 {
            background: linear-gradient(90deg, var(--aether-purple), var(--aether-purple-dark));
            color: white;
            padding: 10px;
            margin: -30px -30px 20px -30px;
        }

        .feedback-form textarea {
            width: 100%;
            padding: 10px;
            border: 2px inset var(--win95-dark);
            font-family: inherit;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
        }

        .feedback-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }

        .btn-cancel, .btn-submit {
            padding: 8px 20px;
            border: 2px outset #ffffff;
            cursor: pointer;
            font-size: 14px;
        }

        .btn-cancel {
            background: var(--win95-gray);
        }

        .btn-submit {
            background: linear-gradient(145deg, var(--aether-purple), var(--aether-purple-dark));
            color: white;
        }

        .btn-cancel:active, .btn-submit:active {
            border-style: inset;
        }

        @media (max-width: 768px) {
            .feedback-contact-section {
                padding: 40px 15px;
            }

            .contact-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <script>
        function openFeedbackForm() {
            document.getElementById('feedback-form').style.display = 'flex';
        }

        function closeFeedbackForm() {
            document.getElementById('feedback-form').style.display = 'none';
        }

        function submitFeedback() {
            const text = document.getElementById('feedback-text').value;
            if (text.trim()) {
                alert('Thank you for your feedback! We appreciate your input.');
                document.getElementById('feedback-text').value = '';
                closeFeedbackForm();
            } else {
                alert('Please enter your feedback before submitting.');
            }
        }
    </script>

'''

# Insert feedback section before the believe footer
believe_footer_pattern = r'(<!-- I Believe Footer -->)'
html = re.sub(believe_footer_pattern, feedback_section + r'\1', html)

# Write updated HTML
with open('/home/user/aethersitetemplate/AETHER-Internal-Knowledge-Base-Concise (2).html', 'w') as f:
    f.write(html)

print("Homepage updated successfully!")
print("- Updated ETHOS button with services1.png")
print("- Updated PATHOS button with services2.png")
print("- Updated LOGOS button with services3.png")
print("- Added Feedback and Contact section before believe footer")
