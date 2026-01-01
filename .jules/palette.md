## 2024-05-23 - Robust Scroll Handling
**Learning:** Checking only `window.scrollY` is unreliable when `html` and `body` have `height: 100%` and `overflow-x: hidden` in certain browser contexts (or print emulation). The scroll container may shift to `document.body` or `document.documentElement`.
**Action:** Always check `window.scrollY || document.documentElement.scrollTop || document.body.scrollTop` and listen to scroll events on both `window` and `document.body`.

## 2024-05-23 - Script Placement Hazards
**Learning:** Defining `const element = document.getElementById(...)` in a script block placed *before* the element itself (e.g., script in body before footer, element after footer) causes immediate null errors.
**Action:** Always wrap such logic in `document.addEventListener('DOMContentLoaded', ...)` even if the script is at the "end" of the body, unless you are absolutely certain no elements are defined after it.
