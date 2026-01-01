## 2024-05-23 - Client-Side DoS via Unbounded Configuration
**Vulnerability:** The library accepted unbounded values for `starLayers` and `starDensity`.
**Learning:** Even client-side libraries can cause Denial of Service (DoS) if they allow resource-intensive operations to be triggered by unvalidated configuration, potentially crashing the user's browser.
**Prevention:** Always validate and clamp configuration values that directly impact loop iterations or DOM element creation count. Use safe defaults if validation fails.
