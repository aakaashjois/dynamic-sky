## 2024-05-23 - Client-Side DoS Protection
**Vulnerability:** Client-Side Denial of Service (DoS) via unvalidated configuration options (`starDensity`, `starLayers`).
**Learning:** Even client-side libraries can be vectors for DoS if they allow unbounded resource creation (DOM elements) based on user input or misconfiguration. Input validation in the constructor is crucial.
**Prevention:** Always clamp configuration values that directly impact resource allocation (loops, DOM creation) to reasonable maximums.
