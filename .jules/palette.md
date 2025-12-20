## 2025-12-17 - Accessibility Improvements
**Learning:** Using `div` with `onclick` for interactive elements (like accordions) is a common accessibility anti-pattern.
**Action:** Always use `<button>` for interactive elements. If converting legacy code, ensure default button styles (border, background, font) are handled in CSS, and add `aria-expanded` state management.

## 2025-12-17 - Slider Accessibility
**Learning:** Range inputs representing complex values (like time) must use `aria-valuetext` to provide meaningful feedback to screen reader users (e.g., "12:00 PM" instead of "720").
**Action:** Always verify if `input[type="range"]` values are human-readable. If not, dynamically update `aria-valuetext` alongside the visual display.

## 2025-12-17 - Focus Visibility
**Learning:** Removing default outline with `outline: none` (often done for aesthetic reasons) creates a major accessibility barrier for keyboard users.
**Action:** When using `appearance: none` or `outline: none`, ALWAYS add a distinct `:focus-visible` style to restore the focus indicator for keyboard navigation.
