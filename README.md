# Aakanksha Suryawanshi — Portfolio

A static UI/UX and visual design portfolio inspired by the supplied https://aritheux.framer.ai/ reference. Includes a floating glass navigation, animated white particles, dissolving name, cutout portrait with particle interactions, glossy buttons, project gallery, experience cards, scrolling skills, draggable toolkit, and chat-style FAQs. Call scheduling is intentionally omitted.

Repository: https://github.com/parimalgavali/aakanksha-portfolio

Live site: https://parimalgavali.github.io/aakanksha-portfolio/

## Development

- `npm run dev`: serve locally at http://localhost:5173.
- `npm run check`: validate local assets and section links.
- `npm run build`: package the static site into `dist/`.

No dependencies or installation required. Poppins, Instrument Serif and Mrs Saint Delafield load from Google Fonts with system fallbacks.

## Deployment and forking

Pushes to `main` deploy automatically through `.github/workflows/pages.yml`. In GitHub repository Settings → Pages, the source is GitHub Actions.

Aakanksha can fork this repository, enable Actions on the fork, and select GitHub Actions as its Pages source. Run the deployment workflow manually for the first deployment. Keep the repository name for a project URL, or rename it to `aakankshasuryawanshi16-svg.github.io` for her root URL. All local paths are relative and support either option.

## Editing

- `index.html`: personal content, projects, experience, tools and FAQ.
- `style.css`: design tokens, components, responsive layouts and CSS motion.
- `script.js`: canvas effects, navigation, reveals, pointer lighting and constrained draggable tools.
- `assets/projects/`: higher-resolution artwork from her Behance projects.
- `assets/portrait.jpg`: original public Behance profile photo.
- `assets/portrait-cutout.png`: background-removed portrait, derived from that photo with image generation. Replace with a high-resolution approved cutout when available.
- `assets/Aakanksha-Suryawanshi-CV.pdf`: the supplied résumé.
- `DESIGN.md`: reference observations, implemented effects and fidelity limits.

Tool icons support pointer dragging, arrow-key movement and Home to reset. Reduced-motion preference stops continuous effects. Canvas animation pauses when offscreen or when the browser tab is hidden.

Content is based on her CV, LinkedIn and Behance. The reference's testimonials and live client work are replaced with her design perspectives and verified project links; no endorsements or performance metrics have been invented.
