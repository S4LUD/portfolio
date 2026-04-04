# Release QA Checklist

Use this after the code-side production pass is complete.

## Manual Smoke Test

- [x] Open the portfolio in desktop light mode.
- [x] Open the portfolio in desktop dark mode.
- [x] Confirm the hero loads cleanly and the workflow images slide correctly.
- [x] Open the projects filters and switch through `All`, `Automation`, `Web`, and `Mobile`.
- [x] Open the contact modal and verify:
  - [x] close button works
  - [x] email copy action works
  - [x] CV download works
  - [x] form validation feels correct
  - [x] Turnstile loads and verifies
  - [x] successful submit closes the modal and shows the success notice

## Real Mobile Check

- [x] Open the site on an actual phone in light mode.
- [x] Open the site on an actual phone in dark mode.
- [x] Confirm the floating contact bar does not block the last visible content.
- [x] Confirm the theme toggle works on touch.
- [x] Confirm the projects section reads cleanly on mobile.
- [x] Confirm the contact modal is scrollable and usable on mobile.
- [x] Confirm the keyboard does not break the modal layout when inputs are focused.

## Final Release Check

- [x] Review `git status` and confirm only intended files are included.
- [x] Keep `.env` out of the release.
- [ ] Commit only after the manual and mobile checks pass.
- [ ] Push only after the full release pass is complete.
