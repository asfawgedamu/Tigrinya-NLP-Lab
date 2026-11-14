# Portfolio interaction enhancements

This version keeps the existing static HTML, CSS, and vanilla JavaScript setup. No React, npm, bundler, or compile step is required.

## What changed
- Fidel characters lift slightly on hover, gain a soft background and shadow, and retain the existing active-row/column highlight.
- Primary buttons and icon controls respond with subtle lift/press feedback.
- LinkedIn, GitHub, and email badge images lift slightly on hover.
- Navigation links animate an underline on hover, keyboard focus, and the active section.
- The Work, Resume, and Code destination cards lift and highlight on hover.
- Work rows, tabs, and disclosure summaries receive restrained interaction feedback.
- Motion is disabled for users who request reduced motion.

## Files changed
- `assets/css/style.css`

The existing `assets/js/main.js` is unchanged. It already controls the Fidel chart's dynamic selection and keyboard interactions. The additional visual effects are CSS-only, which keeps the site simple to maintain and deploy.


## Follow-up: hero badge feedback

The home-page LinkedIn, GitHub, and Email badges now animate both the link and the badge image. Hover and keyboard focus lift the badge, scale the image slightly, add a visible shadow, and reveal a subtle verdigris halo. Pressing a badge settles it back down. The same behavior applies to the footer/contact badges. These effects are CSS-only and respect reduced-motion preferences.


## Correction: hero badges on inner pages

The top badge strip on Work, Resume, Code, and Contact pages uses `.badge-bar .actions`, not `.hero .actions`. The hover, focus, press, image-scale, shadow, and halo styles now target that selector too. The home page hero and footer badges keep their existing effects.
