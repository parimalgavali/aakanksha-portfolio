# Reference design system

Reference: https://aritheux.framer.ai/ — inspected in the shared browser on 2026-11-25, at desktop width 1280 and mobile width 390. Browser screenshots and computed DOM styles informed this implementation.

## Observed visual system

- Black page background; soft white typography; purple accents. Computed heading color `#fbfafc`, purple serif `#a21caf`; source uses some much darker purple body text. Implementation lightens supporting text for readability.
- Poppins body and sans-serif headings. Instrument Serif italic accent words. Desktop main headings measured 70px / 84px, weight 500. Hero greeting measured 50px / 60px italic.
- Floating capsule navigation with dark glass, faint border, blur, compact labels. Mobile switches to a hamburger menu.
- Hero approximately 905px tall at desktop. Centered animated name, portrait, two short introductory lines and glossy pill controls.
- White drifting snow-like dots are rendered in canvas. The source also uses a canvas name dissolve and Three.js portrait particle overlay.
- Project gallery: 2 columns, 24px gap, approximately 588 × 442px cards at the source viewport, rounded corners, bottom gradient, title and summary, arrow appearing on hover.
- Centered section labels: green status dot inside a small dark pill; large white heading with italic purple final words; purple supporting text.
- Horizontal project strip, 4 compact experience cards, skills ticker, draggable tool tray, horizontal quote cards, social controls and FAQ chat bubbles.
- Original navigation and hero contain call scheduling. These are removed as requested.

## Implemented motion and interactions

- Native canvas snowfall: small varying radii and opacity, slow downward drift and lateral motion.
- Sampled text points alternate between Aakanksha and UI/UX Designer, assembling and dissolving every 5 seconds.
- Portrait particle sweep and pointer-responsive particles use colors sampled from her own image. This is a custom 2D reconstruction, not the source's Three.js effect.
- Glossy buttons: conic border rotation, faint white inset highlight, drifting glints, hover light sweep and lift.
- Project hover zoom, pointer-positioned card illumination, hover arrows, staggered scroll reveals.
- Continuous work and skill strips, with hover pause on project and perspective strips.
- Tool icons drag within their tray using pointer capture; arrow keys move them and Home resets them.
- Mobile navigation and FAQ use accessible native controls. Reduced motion stops continuous motion. Canvas rendering pauses offscreen and when the browser tab is hidden.

## Content substitutions and limitations

All authored project imagery and career details are Aakanksha's. The reference's testimonials are replaced with design perspectives rather than attributing its endorsements to her. Live client products are replaced with a work strip linking to her actual portfolio. Social links are verified supplied profiles and email. No call booking controls remain.

Portrait source: her public Behance profile. The source file is 276px square; it is a temporary asset until a high-resolution portrait is provided. Background-removal processing preserves her identity and clothing. The cutout and particle rendering cannot match the reference portrait's geometry exactly. No claim of pixel-for-pixel or identical motion is made.
