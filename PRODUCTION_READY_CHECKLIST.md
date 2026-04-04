# Production Ready Checklist

## Core Release

- [x] Clean up local changes and remove any files, components, code paths, or assets we no longer use.
- [x] Run one final verification pass with `lint`, `build`, and a manual smoke test.
- [x] Review the portfolio for visual consistency so it feels like one complete system.
- [x] Finalize all project content so cards and featured details use polished, intentional copy.
- [x] Recheck the contact flow end to end.
- [x] Confirm the floating contact bar never blocks content on real mobile devices.

## UI and UX

- [x] Refine light mode until it feels as polished as dark mode.
- [x] Tighten spacing rhythm across hero, projects, modal, and floating actions.
- [x] Remove or redesign anything that still feels generic or visually noisy.
- [x] Make sure every CTA has a real purpose and no placeholder text remains.
- [x] Standardize chip, badge, card, and panel styles across the site.

## Contact Flow

- [x] Verify email copy action behavior.
- [x] Verify form validation.
- [x] Verify success and error states.
- [x] Verify Turnstile behavior.
- [x] Verify mobile layout inside the modal.

## Performance

- [x] Audit and compress large assets such as workflow images if needed.
- [x] Remove unused dependencies from `package.json`.
- [x] Check image loading strategy and avoid oversized hero visuals.
- [x] Review theme toggle and modal-heavy areas for unnecessary rerenders.

## Accessibility

- [x] Check color contrast in both light and dark mode.
- [x] Verify keyboard navigation for the theme toggle.
- [x] Verify keyboard navigation for the modal.
- [x] Verify keyboard navigation for the project filters.
- [x] Verify keyboard navigation for the floating contact bar.
- [x] Confirm focus states are visible and consistent.
- [x] Make sure buttons and links use correct labels and semantics.

## Content

- [x] Replace weak or generic copy with final polished wording.
- [x] Make project summaries consistent in tone and detail level.
- [x] Keep freelance projects client-safe and intentional in wording.
- [x] Decide per project whether the right-side panel should show a snapshot, a confidentiality note, or nothing.

## Technical

- [x] Remove dead files and components completely.
- [x] Confirm theme persistence and no flash on first load.
- [x] Recheck responsive behavior on actual phones, not only devtools.
- [x] Make sure env-dependent features fail gracefully in production.

## Final Release

- [x] Final git cleanup
- [x] Final desktop and mobile QA
- [x] Final `lint`
- [x] Final `build`
- [x] Push only after the full release pass is complete
