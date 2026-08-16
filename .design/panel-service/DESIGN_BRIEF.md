# Design Brief: PanelService Maintenance System

## Problem

Maintenance technicians and admins are struggling to quickly locate, filter, and prioritize on-demand interactive panel service requests. The existing systems or manual tracking lack clear visual hierarchy, making it hard to discern at a glance whether a critical ticket is still unassigned or processing. 

## Solution

A robust, enterprise-grade dashboard experience that uses high-legibility typographic hierarchy and clear semantic coloring (status and priority) to surface the most critical tickets first. The interface acts as a command center, putting search, sorting, and ticket metadata front and center.

## Experience Principles

1. **Clarity over Density** -- Give data room to breathe with generous padding and distinct container boundaries so technicians can read details at a glance.
2. **Semantic Cues** -- Use distinct background tints and colors to communicate priority (Low/Medium/High) and status (Open/Processing/Closed) instantly without needing to read the text.
3. **Familiar Professionalism** -- Rely on established enterprise UI patterns (top bar, side navigation, search/filter bar) so users don't have to learn a new paradigm.

## Aesthetic Direction

- **Philosophy**: Material Design 3 (Enterprise / Google Cloud vibe)
- **Tone**: Professional, authoritative, organized, and clean.
- **Reference points**: Google Workspace, modern SaaS admin panels. Reference screens provided in `stitch_panelservice_tracker`.
- **Anti-references**: Cluttered spreadsheets, over-stylized/trendy neubrutalism, dark/gaming aesthetics.

## Existing Patterns

- **Typography**: `Inter` for all UI text and headings. `JetBrains Mono` for ticket IDs or system-level data.
- **Colors**: Deep blues for primary branding (`#004ac6`), semantic colors for errors/priority (`#ba1a1a`), and a layered surface system (`surface-container-lowest` up to `surface-container-highest`) to create depth without relying heavily on shadows.
- **Spacing**: A strict 4px/8px modular scale (`sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`).
- **Components**: The design references introduce a sidebar navigation, a top application bar, segmented control filters, rounded status chips, and bento-style ticket cards.

## Component Inventory

| Component | Status | Notes |
| --------- | ------ | ----- |
| TopNavBar | Modify | Needs to adapt from the reference HTML. Contains app title, add button, and user profile. |
| SideNavBar | New | Left rail navigation for desktop view. |
| TicketCard | Modify | Existing Ticket card needs to be restyled into the new Material 3 bento card pattern with semantic chips. |
| FilterBar | Modify | Search and select dropdowns must match the new rounded, surface-variant styling. |
| StatusChip | New | Pill-shaped span with semantic background/text colors (e.g. `bg-error-container text-on-error-container`). |

## Key Interactions

- **Hover States**: Cards use subtle shadow increases and an overlay gradient (`from-primary/5`) to indicate interactivity. Buttons invert or darken background colors.
- **Filtering**: Dropdowns and checkboxes instantly filter the card grid. 
- **Navigation**: The sidebar remains fixed on desktop while the main content area scrolls independently.

## Responsive Behavior

- **Mobile**: The sidebar is hidden (`hidden lg:flex`). The TopNavBar becomes the primary navigation anchor. The filter bar stacks vertically or wraps. The bento grid collapses to a single column (`grid-cols-1`).
- **Desktop**: Maximum container width (`max-w-container-max`) constrains the main content area to prevent overly stretched lines of text. 

## Accessibility Requirements

- Use semantic HTML (`<main>`, `<nav>`, `<header>`).
- Material 3 color pairings (e.g. `on-error-container` on top of `error-container`) are designed for WCAG AA contrast compliance; we must maintain these specific pairings.
- Form controls must have visible focus rings (`focus:ring-primary-container/20`).

## Out of Scope

- User authentication logic or real login flows.
- Real-time websocket updates (refreshing state will be handled via standard Next.js revalidation).
- Settings and Reports pages (navigation links will be present but inactive).
