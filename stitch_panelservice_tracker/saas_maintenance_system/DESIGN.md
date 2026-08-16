---
name: SaaS Maintenance System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style
The design system is rooted in high-performance minimalism, prioritizing clarity and utility for maintenance workflows. The brand personality is professional, dependable, and efficient. It avoids decorative elements in favor of a systematic grid, generous white space, and purposeful color application.

The visual style follows a **Modern Corporate** aesthetic with subtle influences from **Minimalism**. Interface elements are built on a foundation of structural clarity, ensuring that critical data like ticket status and priority are immediately scannable. The emotional response should be one of "controlled calm"—reducing the cognitive load for users managing high-volume tasks.

## Colors
The color palette is architected for functional signaling. The neutral foundation (#F9FAFB) provides a high-key background that allows the primary blue (#2563EB) to define the main action path.

- **Action Colors:** Use the primary blue for primary buttons, active states, and selection markers.
- **Status Indicators:** These are semantic colors used exclusively for ticket lifecycles. They should appear in badges or subtle status bars.
- **Priority Signaling:** High-contrast hues are reserved for priority levels to ensure urgent maintenance tasks are visually prioritized.
- **Text:** Deep slate is used for primary body and headings to maintain high legibility without the harshness of pure black.

## Typography
This design system utilizes **Inter** for its systematic, utilitarian character and exceptional legibility at small sizes. 

- **Hierarchy:** Use `h1` and `h2` for page titles and section headers. 
- **Readability:** `body-md` is the standard for ticket descriptions and comments. 
- **Data Display:** Use `label-md` for metadata headers (e.g., "ASSIGNED TO", "DATE CREATED") to create a clear distinction from user-generated content.
- **Mobile Scaling:** Headlines must scale down on mobile viewports to prevent awkward line wrapping in compact ticket views.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. 

- **Desktop (1024px+):** 12 columns, 24px margins, 20px gutters. Use a sidebar for main navigation.
- **Tablet (768px - 1023px):** 8 columns, 20px margins. Sidebar may collapse into a drawer.
- **Mobile (<768px):** 4 columns, 16px margins. Content stacks vertically; horizontal scrolling is permitted only for data tables.

A strict 4px-based spacing scale ensures vertical rhythm. Elements within a ticket card should use `sm` (8px) for internal padding between related items and `md` (16px) for the card container's inner padding.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Ambient Shadows**. 

1. **Level 0 (Background):** #F9FAFB. All page-level content sits here.
2. **Level 1 (Cards/Surface):** White (#FFFFFF). Used for ticket items and content containers. Features a subtle, diffused shadow: `0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.06)`.
3. **Level 2 (Overlays/Modals):** White (#FFFFFF) with a more pronounced shadow: `0px 10px 15px -3px rgba(0,0,0,0.1)`.

Avoid heavy borders; use light #E5E7EB borders for table dividers or to separate sidebar sections.

## Shapes
The design system uses a "Rounded" (8px) corner radius for most UI elements. This creates a modern, approachable feel while maintaining a professional structure.

- **Cards & Containers:** Use `rounded-lg` (16px) for main dashboard widgets to soften the interface.
- **Form Inputs & Buttons:** Use the standard 8px radius.
- **Badges:** Use a fully rounded pill shape (999px) for status and priority tags to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid #2563EB background, white text. No shadow, 8px radius.
- **Secondary:** White background with #E5E7EB border, slate text. 
- **Ghost:** No background or border, primary blue text. Used for less prominent actions like "Cancel".

### Badges (Status & Priority)
- **High Contrast:** Use the defined semantic colors. For "High Priority," use a light crimson background with deep crimson text to ensure readability while maintaining the color signal.
- **Shape:** Pill-shaped, small caps or uppercase bold text at 12px.

### Ticket Cards
- White background, 8px radius, Level 1 shadow.
- Top-left: Ticket ID in `body-sm` (Slate).
- Top-right: Priority Badge.
- Center: Title in `body-md` (Semibold).
- Bottom: Status Badge and "Assigned To" avatar.

### Inputs
- Height: 40px for standard, 48px for large.
- Border: 1px solid #D1D5DB.
- Focus State: 1px solid #2563EB with a 3px soft blue outer glow.

### Lists
- Use for ticket overviews. Items should be separated by 1px solid #F3F4F6 lines with hover states that change the background to #F8FAFC.