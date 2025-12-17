## 2024-05-23 - [Critical] Unsafe Script Execution & SRI Pitfall
**Vulnerability:** The codebase was using `XMLHttpRequest` (synchronous) to fetch a script and execute it via `new Function()`. This is equivalent to `eval` and bypasses Content Security Policy (CSP), posing a significant RCE/XSS risk if the CDN is compromised or MITM'd.
**Learning:** Using `eval` or `new Function` on fetched content is extremely dangerous. Additionally, jsDelivr's auto-minified files (e.g., `suncalc.min.js`) are dynamically generated, meaning their hash can change, breaking Subresource Integrity (SRI) checks.
**Prevention:**
1. Never use `eval` or `new Function` on external content. Use standard `<script>` tags.
2. When using SRI with CDNs like jsDelivr, always target the specific version of the **unminified** file (e.g., `suncalc.js` instead of `suncalc.min.js`) to guarantee a stable hash.
3. Always implement SRI for third-party scripts.
