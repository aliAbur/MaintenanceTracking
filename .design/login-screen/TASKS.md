# Build Tasks: Login Screen Redesign

Generated from: Reference HTML at `stitch_panelservice_tracker/login_screen/code.html`
Date: 2026-08-18

## Foundation
- [ ] **Page Shell & Layout**: Update the main layout wrapper of `app/(auth)/login/page.tsx` to match the exact spacing, centering, and background colors defined in the reference. Replace the current centered box with the reference's `<div class="w-full max-w-md bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 p-8">`.

## Core UI
- [ ] **Header Section**: Update the icon, typography, and text copy of the login header to match the reference ("dashboard" icon, text-h2 "PanelService", text-body-sm "Sign in to your workspace").
- [ ] **Form Inputs & Labels**: Modify the Email and Password inputs to match the reference HTML structures, including the "Forgot password?" link placement, label styling (`text-body-sm`), and input box heights and border colors.
- [ ] **Submit & Footer**: Redesign the submit button to match the reference (`h-12 bg-primary rounded-lg text-body-md text-on-primary`) and add the footer section ("Don't have an account? Request access").

## Interactions & States
- [ ] **Focus & Hover States**: Ensure the input focus rings (`focus:ring-2 focus:ring-primary focus:border-transparent`) and hover states on the links (`hover:text-primary-fixed-dim`) are successfully carried over.
