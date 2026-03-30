# Design System Specification: High-Velocity Fintech

## 1. Overview & Creative North Star: "The Digital Obsidian"
This design system is built to transform complex financial data into a high-end, editorial experience. We reject the "spreadsheet-clutter" common in fintech. Our Creative North Star is **The Digital Obsidian**: a philosophy of deep, monochromatic depth punctuated by razor-sharp precision and bioluminescent accents.

We break the "template" look by utilizing **intentional asymmetry** and **atmospheric layering**. Instead of rigid boxes, we use shifting tonal surfaces and glassmorphism to create a UI that feels like a sophisticated cockpit. The goal is "Authority through Calm"—even when the market is volatile, the interface remains composed.

---

2. Colors & Surface Philosophy

### The Tonal Palette
Our palette moves away from flat hex codes into a functional hierarchy of light and depth.

*   **Primary Background:** `surface` (#0b1326) – The void upon which all data lives.
*   **The Accents:** 
    *   `primary` (#adc6ff): High-clarity blue for focus.
    *   `secondary` (#4ae176): "Bioluminescent" green for growth/success.
    *   `tertiary` (#ffb3ad): Sophisticated red for risk/danger.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. We prohibit "boxed-in" layouts. Boundaries are created through background shifts:
*   **Main Workspace:** `surface`
*   **Navigational Rails:** `surface-container-low`
*   **Active Panels:** `surface-container-high`

### The "Glass & Gradient" Rule
To elevate the professional polish, use Glassmorphism for floating elements (e.g., Order Entry panels).
*   **Implementation:** Use `surface-container-highest` at 60% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs (Buy/Sell), use a subtle linear gradient from `primary` to `primary_container` at a 135° angle. This adds "visual soul" and depth that flat fills lack.

---

## 3. Typography: Editorial Precision
We utilize **Inter** for its mathematical clarity. The hierarchy is designed to guide the eye through dense data without causing fatigue.

*   **Display (lg/md):** Used for portfolio totals. Set at `-0.02em` letter spacing to feel "locked-in" and authoritative.
*   **Headline (sm):** Used for major market pairs (e.g., BTC/USD). 
*   **Title (sm):** The workhorse for panel headers. Always uppercase with `0.05em` tracking for a premium, labeled feel.
*   **Body (md/sm):** For data tables. Use `on_surface_variant` (#c2c6d6) to reduce optical vibration against the dark background.
*   **Label (sm):** Specifically for micro-data (e.g., Timestamp, Volatility index).

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Forget drop shadows for structural components. Depth is achieved by "stacking" the surface tiers.
*   **Base:** `surface` (#0b1326)
*   **Section:** `surface_container_low` (#131b2e)
*   **Card:** `surface_container_lowest` (#060e20) — Creating a "sunken" effect for data density.

### Ambient Shadows
For floating modals or dropdowns, use "Atmospheric Shadows":
*   **Values:** `0px 24px 48px rgba(0, 0, 0, 0.4)`
*   **Tint:** Shadow color must be a tinted version of `surface_container_highest`, never pure black, to maintain the "Obsidian" depth.

### The "Ghost Border" Fallback
If contrast ratio requires a boundary, use a **Ghost Border**:
*   **Token:** `outline_variant` (#424754) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Trading Primitives

### Advanced Data Tables
*   **No Dividers:** Forbid the use of horizontal lines. Use a `1.3rem` (Spacing 6) vertical gap between rows.
*   **Row States:** On hover, shift the background to `surface_bright` (#31394d) with a `0.25rem` (DEFAULT) corner radius.
*   **Numerical Alignment:** All price data must be tabular-lining (monospaced numbers) for easy vertical scanning.

### Stat Cards & Order Panels
*   **Glassmorphism:** Order panels should utilize the Glass Rule.
*   **Asymmetry:** Use `xl` (0.75rem) rounding on the top-left and bottom-right corners only to create a signature, custom fintech look.

### Input Fields & Modern Forms
*   **Default State:** `surface_container_highest` fill, no border.
*   **Focus State:** A 1px "Ghost Border" of `primary` at 40% opacity and a subtle `surface_tint` outer glow.
*   **Helper Text:** Always use `label-sm` in `on_surface_variant`.

### Trading Charts (TradingView Style)
*   **Grid Lines:** Use `outline_variant` at 5% opacity.
*   **Crosshair:** Use `primary` at 50% opacity with a dashed stroke.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `secondary_fixed_dim` for "Buy" buttons to ensure the green feels "glowy" but premium.
*   **Do** use spacing `scale 8` (1.75rem) for major gutter margins to provide "breathing room" in data-heavy views.
*   **Do** leverage `surface_container_high` for nested navigation tabs to create a physical sense of "current location."

### Don’t:
*   **Don’t** use pure white (#FFFFFF) for text. Use `on_surface` (#dae2fd) to prevent "halo" effects on dark backgrounds.
*   **Don’t** use 100% opaque borders for any reason. It breaks the "Obsidian" fluid feel.
*   **Don’t** use standard "drop shadows" on cards; rely on background color shifts for hierarchy.