# Aakanksha Suryawanshi — Portfolio

A responsive portfolio closely recreating the supplied Framer reference: black starfield, blue hero grid, lavender handwritten accents, floating skills, project gallery and experience cards, with Aakanksha’s real work and downloadable résumé. Built with semantic HTML, CSS and JavaScript; no runtime framework or package dependencies.

## Run locally

Run `npm run dev` and open http://localhost:5173. Run `npm run check` to validate local links and assets, and `npm run build` to produce `dist/`.

## Publish with GitHub Actions / Pages

1. This project is hosted in https://github.com/parimalgavali/aakanksha-portfolio. She can fork it to her account later, keeping the repository name for a project site or renaming it to `aakankshasuryawanshi16-svg.github.io` for her root site.
2. Push updates to `main`. The local `origin` remote points to the repository above. In a fork, GitHub Actions must be enabled in the Actions tab before running the workflow.
3. In the repository, select **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Run **Actions → Deploy portfolio to GitHub Pages → Run workflow**, or push to `main`.
5. The workflow reports the published URL in its `github-pages` environment.

All local paths are relative, so root and repository-based Pages URLs are supported without a base-path change. If your default branch differs from `main`, update `.github/workflows/pages.yml`.

## Content and editing

- `index.html`: copy, project links, experience, résumé and contact details.
- `style.css`: colors, typography, responsive layout and reduced-motion support.
- `script.js`: reserved for progressive enhancements; navigation works without JavaScript.
- `assets/projects/`: locally hosted artwork from Aakanksha’s Behance portfolio.
- `assets/Aakanksha-Suryawanshi-CV.pdf`: the supplied résumé.

Project summaries are based on her supplied CV and public portfolio. No performance metrics or testimonials have been invented. The CV and LinkedIn differ on the certification date, so certification dates are not displayed. Review the résumé and public email before publishing. Google Fonts supplies DM Sans and Manrope, with local system fallbacks.

## Source material

- https://www.behance.net/aakankshasuryawanshi
- https://www.behance.net/aakankshasuryawanshi/moodboards (inspiration collections; not presented as authored work)
- https://www.linkedin.com/in/aakanksha-gavali/
- Supplied Aakanksha CV

## Verification

`npm run check`, `npm run build`, and `node --check script.js` pass. These validate packaging, JavaScript syntax, local assets and section anchors. A live browser layout review and the deployed GitHub Actions run have not been performed.
