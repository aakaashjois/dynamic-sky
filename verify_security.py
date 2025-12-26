
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Capture console logs
    logs = []
    page.on("console", lambda msg: logs.append(msg.text))

    page.goto("http://localhost:8080/test_security.html")

    # Wait for tests to run
    page.wait_for_timeout(3000)

    print("Console Logs:")
    for log in logs:
        print(log)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
