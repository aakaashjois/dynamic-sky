import os
from playwright.sync_api import sync_playwright, expect

def verify_skip_link():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load local file
        cwd = os.getcwd()
        file_path = f"file://{cwd}/index.html"
        print(f"Navigating to: {file_path}")
        page.goto(file_path)

        # Verify link exists
        skip_link = page.get_by_role("link", name="Skip to main content")
        expect(skip_link).to_be_attached()

        # Check initial state (should be off-screen)
        # We need to wait a bit for styles to apply if needed, though local file is fast.
        page.wait_for_timeout(100)

        box = skip_link.bounding_box()
        print(f"Initial bounding box: {box}")

        # Focus the link (simulate Tab)
        page.keyboard.press("Tab")

        # Verify focus
        expect(skip_link).to_be_focused()

        # Wait for transition (0.2s in CSS)
        page.wait_for_timeout(500)

        # Check state after focus (should be on-screen)
        box = skip_link.bounding_box()
        print(f"Bounding box after focus: {box}")

        if not box or box['y'] < 0:
            raise Exception(f"Skip link is not visible/on-screen after focus. Box: {box}")

        # Take screenshot
        screenshot_path = os.path.join(cwd, "verification", "skip_link_focused.png")
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_skip_link()
