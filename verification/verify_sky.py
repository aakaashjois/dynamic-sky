from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Navigate to local server
        page.goto("http://localhost:8080/index.html")

        # Wait for initialization (there is a 'dynamic-sky-initialized' event but we can just wait for elements)
        # Wait for .dynamic-sky-layer to appear
        page.wait_for_selector(".dynamic-sky-layer", timeout=10000)

        # Wait a bit for animation/rendering
        time.sleep(2)

        # Take screenshot of the whole page
        page.screenshot(path="verification/verification_sky.png", full_page=True)

        # Also take screenshot of DOM structure if possible? No, just visual.
        # We can check if stars exist.
        stars = page.locator(".dynamic-sky-star").count()
        print(f"Found {stars} stars")

        if stars > 0:
            print("Verification Passed: Stars are rendered.")
        else:
            print("Verification Failed: No stars found.")

        browser.close()

if __name__ == "__main__":
    run()
