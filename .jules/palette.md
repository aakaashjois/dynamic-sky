## 2025-02-18 - Interactive Scroll Indicator
**Learning:** Purely visual "scroll arrows" are a missed accessibility opportunity. Converting them to anchor links with smooth scroll not only helps mouse users but provides a critical navigation shortcut for keyboard users.
**Action:** When adding scroll indicators, always implement them as `<a>` tags with `href="#target"` and ensure JavaScript handles focus management (`target.focus()`) after scrolling.

## 2025-02-18 - Respecting Reduced Motion
**Learning:** Users with motion sensitivities rely on `prefers-reduced-motion` settings. JavaScript-driven animations (like smooth scroll) often bypass CSS media queries.
**Action:** Always check `window.matchMedia('(prefers-reduced-motion: reduce)')` before triggering programmatic animations or smooth scrolling behaviors.

## 2025-02-19 - Back to Top Visibility & Accessibility
**Learning:** A "Back to Top" button that fades in must also be removed from the accessibility tree when hidden. Using `opacity: 0` alone leaves the interactive element focusable but invisible, which is confusing for screen reader and keyboard users.
**Action:** Always toggle `aria-hidden` and `tabindex="-1"` in sync with visual visibility state. Also, verify scroll listeners attach to both `window` and `document.body` to handle different overflow contexts.
