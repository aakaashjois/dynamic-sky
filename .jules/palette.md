## 2025-02-18 - Interactive Scroll Indicator
**Learning:** Purely visual "scroll arrows" are a missed accessibility opportunity. Converting them to anchor links with smooth scroll not only helps mouse users but provides a critical navigation shortcut for keyboard users.
**Action:** When adding scroll indicators, always implement them as `<a>` tags with `href="#target"` and ensure JavaScript handles focus management (`target.focus()`) after scrolling.

## 2025-02-18 - Respecting Reduced Motion
**Learning:** Users with motion sensitivities rely on `prefers-reduced-motion` settings. JavaScript-driven animations (like smooth scroll) often bypass CSS media queries.
**Action:** Always check `window.matchMedia('(prefers-reduced-motion: reduce)')` before triggering programmatic animations or smooth scrolling behaviors.
