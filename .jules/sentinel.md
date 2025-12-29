## 2025-05-18 - Insecure Dynamic Script Loading
**Vulnerability:** The `ensureSunCalc` function was using `XMLHttpRequest` with `new Function(script)` (eval) to load external code, which is dangerous. The fallback script injection lacked Subresource Integrity (SRI) and `crossorigin` attributes, making it vulnerable to dependency hijacking.
**Learning:** Legacy sync XHR + eval patterns are still lurking in "vanilla JS" libraries to avoid callbacks/promises, but they introduce severe RCE risks. Always prioritize standard `<script>` injection with SRI over custom loaders.
**Prevention:** Enforce SRI for all external scripts. Avoid `new Function()` or `eval()` for loading code. Use standard async script loading patterns.

## 2025-05-18 - Client-Side DoS via Configuration
**Vulnerability:** The library accepted unbounded integer values for `starLayers` and `starDensity` in the configuration object. A malicious or accidental configuration with large values (e.g., `1000`) would cause the library to create millions of DOM elements, freezing the browser (Resource Exhaustion).
**Learning:** Even in client-side libraries, "configuration" is an input vector. If config values control loop limits or memory allocation directly, they must be clamped to reasonable maximums.
**Prevention:** Always clamp numeric inputs that control loop iterations or object creation counts. Validate types for all configuration options.
