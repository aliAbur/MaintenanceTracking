# Build Tasks: PanelService Maintenance System

Generated from: .design/panel-service/DESIGN_BRIEF.md
Date: 2026-08-16

## Foundation
- [ ] **Global Layout Shell**: Update `app/layout.tsx` to implement the Material 3 app shell (TopNavBar and fixed SideNavBar for desktop). Set up maximum container widths (`max-w-container-max`). _Reuses: existing `app/layout.tsx`._
- [ ] **Material Symbols & Fonts**: Update `app/layout.tsx` to include `JetBrains Mono` and Material Symbols web fonts, ensuring the typography aligns with the Material 3 aesthetic direction.

## Core UI
- [ ] **Dashboard Filter Bar**: Update `components/DashboardClient.tsx` to replace the Dieter Rams filters with the new Material 3 segmented control and search bar, using surface-variant backgrounds and focus rings. _Modifies: `DashboardClient.tsx`._
- [ ] **Ticket Bento Cards**: Refactor the ticket list in `components/DashboardClient.tsx` to use the Material 3 Bento Card pattern (`rounded-lg`, hover overlays `from-primary/5`, semantic priority chips). _Modifies: `DashboardClient.tsx`._

## Interactions & States
- [ ] **New Request Form**: Restyle `components/NewTicketForm.tsx` to use Material 3 input fields (filled variant or outlined with surface colors), clear focus rings, and proper label typography. Ensure loading states look native. _Modifies: `NewTicketForm.tsx`._
- [ ] **Ticket Details & Timeline**: Update `components/TicketDetailsClient.tsx` to use the new card styling, semantic status select dropdowns, and a highly structured timeline that uses primary/muted colors from the design tokens. _Modifies: `TicketDetailsClient.tsx`._

## Responsive & Polish
- [ ] **Mobile Navigation Adaptations**: Ensure the `SideNavBar` is hidden on mobile (`hidden lg:flex`) and the `TopNavBar` handles navigation constraints gracefully. Make sure the Bento Grid collapses to a single column on small screens.
- [ ] **Accessibility & Contrast Pass**: Verify focus states on all form controls and check that semantic color pairings (e.g. `on-error-container` on `error-container`) render correctly in both light and dark modes.

## Review
- [ ] **Design review**: Run `/design-review` against the brief to verify the new build perfectly matches the Material 3 aesthetic defined in the references.
