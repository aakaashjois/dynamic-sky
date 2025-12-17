## 2024-05-23 - Accessibility Improvements
**Learning:** Using `div` with `onclick` for interactive elements (like accordions) is a common accessibility anti-pattern.
**Action:** Always use `<button>` for interactive elements. If converting legacy code, ensure default button styles (border, background, font) are handled in CSS, and add `aria-expanded` state management.
