# Enhance Text Contrast and Complete Navigation Links for MediScript

Written against: dc78175003f81a561c208b3e63e5fd3f6696c8f4

## Evidence chain

- Surface: Primary application layout shell, including Top Navigation Bar (`src/components/Navbar.tsx`), Hero Landing Field Plates (`src/components/HeroLandingSection.tsx`), and Primary Footer (`src/App.tsx`).
- Problem: 
  1. Active and inactive navigation tab links in `Navbar.tsx` use low-contrast teal (`#3FA796`, 2.74:1) and muted green (`#4B6E60`, 3.9:1) on parchment background (`#FAF6EA`), failing WCAG AA (minimum 4.5:1).
  2. Action links in `HeroLandingSection.tsx` (Plates I, II, III, IV) use low-contrast text tokens (`#3FA796`, `#D9483B`, `#7BC96F`) against parchment cards, dropping as low as 1.78:1 contrast.
  3. The footer section navigation index in `App.tsx` omits the 6th active tab (`VI. CUSTODIA (Audit & DPDP)`), creating an internal navigation discrepancy, while the digital architecture items lack interactive reference links.
- Design evidence: `docs/BULBASAUR_THEME.md` Section 2 (tokens Herbal Emerald `#2D6A4F`, Forest Night `#14372C`, Vitality Mint `#52B788`, Warning Berry `#991B1B`) and Section 5 (Accessibility & Contrast: mandatory WCAG AA ≥ 4.5:1 for body and normal text).
- Owner: `src/components/Navbar.tsx`, `src/components/HeroLandingSection.tsx`, `src/App.tsx`.
- Scope and affected surfaces: `src/components/Navbar.tsx`, `src/components/HeroLandingSection.tsx`, `src/App.tsx`.
- Uncertainty: none.

## Design decision

Replace all low-contrast interactive text colors on light parchment and dark forest cards with certified WCAG AA tokens from the Vintage Botanical design system (`#17483A` / `#2D6A4F` for light mode actions, `#52B788` / `#C5E99B` for dark mode actions, and `#991B1B` / `#F87171` for alerts). Reconcile the footer tab index with `Navbar.tsx` by adding `VI. CUSTODIA (Audit & DPDP)`, and furnish architectural standards with verified external specification links.

## Reuse

- `--color-forest-700: #17483A` and `--color-forest-900: #0E2A21` (`src/index.css`)
- Herbal Emerald `#2D6A4F` and Vitality Mint `#52B788` (`docs/BULBASAUR_THEME.md`)
- Warning Berry `#991B1B` (`docs/BULBASAUR_THEME.md`)
- Exemplar: Badge styling in `src/components/Navbar.tsx#L69-L72` (`text-[#17483A] dark:text-[#C5E99B]`)

## Changes

1. `src/components/Navbar.tsx`
   - Change: Update inactive tab links from `text-[#4B6E60] dark:text-[#95BDB0]` to `text-[#1E4D3B] dark:text-[#A3C5B8] hover:text-[#0E2A21] dark:hover:text-[#F3EBD3]`. Update active tab styling from `text-[#3FA796] border-[#3FA796]` to `text-[#2D6A4F] dark:text-[#52B788] border-[#2D6A4F] dark:border-[#52B788]`. Add `aria-current={activeTab === tabId ? 'page' : undefined}` to navigation buttons.
   - Preserve: Layout spacing, badge counts, responsive breakpoints, and tab switching handlers.
   - Verify: Contrast ratio for inactive tabs is ≥ 5.2:1 and active tabs is ≥ 6.5:1 in light mode and ≥ 8.3:1 in dark mode.

2. `src/components/HeroLandingSection.tsx`
   - Change: In Plates I through IV action footers, replace low-contrast links with `text-[#17483A] dark:text-[#52B788]` (Plates I, II, IV) and `text-[#991B1B] dark:text-[#F87171]` (Plate III). Add `role="button"` or `tabIndex={0}` and arrow transition affordances for keyboard navigation.
   - Preserve: Plate layout, grid hierarchy, icon badges, and tab dispatch callbacks.
   - Verify: All text inside `.specimen-card` meets WCAG AA 4.5:1 minimum contrast.

3. `src/App.tsx`
   - Change: In the footer `TABULAE & SECTIONES` list (lines 1145–1191), add the missing 6th tab:
     `VI. CUSTODIA (Audit & DPDP)` calling `setActiveTab('audit')`.
     In `ARCHITECTURA DIGITALIS` (lines 1120–1140), wrap the items in accessible external anchor tags (`<a href="..." target="_blank" rel="noopener noreferrer">`) pointing to HL7 FHIR R4, ABDM NRCES, DPDP Act 2023, and Google Gemini API documentation.
   - Preserve: 4-column responsive grid structure, botanical footer strip metadata, and return-to-top handler.
   - Verify: All 6 tabs can be navigated from the footer index, and external architectural links open the correct references in new tabs with security rel attributes.

## Scope

- Inherit: `src/components/Navbar.tsx`, `src/components/HeroLandingSection.tsx`, `src/App.tsx`.
- Verify: Light mode (`#FAF6EA`) and Dark mode (`#0E2A21`) across desktop and mobile viewports.
- Exclude: Clinical OCR coordinate drawing engine and backend API endpoints.

## Validation

- Product: Test tab navigation across all 6 sections from both Navbar and Footer, verify contrast readability in both light and dark themes, and click external architecture links.
- Interface: Check light theme (`#FAF6EA`) and dark theme (`#0E2A21`), inspect hover states on desktop and touch targets on mobile.
- System: Validate that all updated color tokens originate directly from `docs/BULBASAUR_THEME.md` and `src/index.css`.
- Repository: `npm run lint` → passes with 0 errors; `npm run build` → builds cleanly.

## Stop conditions

- Stop if theme tokens in `src/index.css` or `docs/BULBASAUR_THEME.md` conflict with WCAG AA contrast thresholds.

## Design documentation

- After acceptance and validation: Record the finalized high-contrast action tokens (`#2D6A4F` for light mode active links, `#52B788` for dark mode active links) under Section 5 of `docs/BULBASAUR_THEME.md`.
