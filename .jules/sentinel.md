## 2025-05-18 - Insecure Dynamic Script Loading
**Vulnerability:** The `ensureSunCalc` function was using `XMLHttpRequest` with `new Function(script)` (eval) to load external code, which is dangerous. The fallback script injection lacked Subresource Integrity (SRI) and `crossorigin` attributes, making it vulnerable to dependency hijacking.
**Learning:** Legacy sync XHR + eval patterns are still lurking in "vanilla JS" libraries to avoid callbacks/promises, but they introduce severe RCE risks. Always prioritize standard `<script>` injection with SRI over custom loaders.
**Prevention:** Enforce SRI for all external scripts. Avoid `new Function()` or `eval()` for loading code. Use standard async script loading patterns.
