## 2024-05-23 - Client-Side DoS Protection
**Vulnerability:** Client-Side Denial of Service (DoS) via unvalidated configuration options (`starDensity`, `starLayers`).
**Learning:** Even client-side libraries can be vectors for DoS if they allow unbounded resource creation (DOM elements) based on user input or misconfiguration. Input validation in the constructor is crucial.
**Prevention:** Always clamp configuration values that directly impact resource allocation (loops, DOM creation) to reasonable maximums.

## 2025-01-06 - Enforced HTTPS for Location API
**Vulnerability:** Insecure transmission of geolocation data (sensitive user info) via unencrypted HTTP.
**Learning:** Defaulting to HTTPS is not enough; explicit validation is required to prevent accidental or malicious misconfiguration that downgrades security.
**Prevention:** Strictly enforce `https://` protocol in validation logic for all external API endpoints handling sensitive data.
