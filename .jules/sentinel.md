## 2025-05-18 - Insecure Dynamic Script Loading
**Vulnerability:** The `ensureSunCalc` function was using `XMLHttpRequest` with `new Function(script)` (eval) to load external code, which is dangerous. The fallback script injection lacked Subresource Integrity (SRI) and `crossorigin` attributes, making it vulnerable to dependency hijacking.
**Learning:** Legacy sync XHR + eval patterns are still lurking in "vanilla JS" libraries to avoid callbacks/promises, but they introduce severe RCE risks. Always prioritize standard `<script>` injection with SRI over custom loaders.
**Prevention:** Enforce SRI for all external scripts. Avoid `new Function()` or `eval()` for loading code. Use standard async script loading patterns.

## 2025-05-23 - Unvalidated Input in Geolocation Library
**Vulnerability:** The library accepted geolocation data (latitude/longitude) from an external API or user input without any validation, potentially allowing injection of non-numeric data or invalid coordinates.
**Learning:** Libraries trusting external data sources without validation are fragile. Even if the immediate usage seems safe (math operations), passing garbage data can lead to DoS (crashes) or undefined behavior, especially in a library consumed by others.
**Prevention:** Always validate boundaries and types of external data at the entry point (e.g., `isValidCoordinate` check) before using it in internal logic.
