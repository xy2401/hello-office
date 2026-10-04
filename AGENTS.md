# Repository Guidelines

## Structure

This is a standalone Chinese VitePress handbook for everyday office work. Pages live in `docs/`, components and pure ESM helpers in `docs/.vitepress/theme/`, downloadable practice materials in `docs/public/templates/`, and task instructions in `demos/`. There is no dependency on sibling projects at build time.

## Development

Use Node.js 22.16+ and PowerShell 7. `npm run docs:dev` uses port 5179. `npm run check:content` checks pages and navigation without installing packages. `npm run test:office` tests the budget and export helpers. `DOCS_BASE` supports deployment below a path prefix.

## Content and UI

Preserve Chinese explanations, lowercase routes, two-space indentation, and PascalCase Vue filenames. Teach concrete tasks and deliverables. Distinguish Microsoft 365, perpetual editions, web, Windows and macOS when feature availability differs; cite official sources for version claims. Do not imply that the playground runs Office engines or exports native Office documents. CSV is practice data, not a workbook.

Copy public templates from hello-world's `design/shared/`; keep copies identical and import the baseline before brand CSS. Use `withBase` for component links to local pages and downloads. Keep forms labeled, errors readable, and local-storage failures recoverable.

## Permissions and Validation

Use existing environments and the smallest checks relevant to the change. Before full builds/testing, multi-browser/OS checks, isolated environments, substantial downloads or workloads, remote pushes/publication, PRs, deployments or Actions dispatch, explain cost and remote effects and wait for explicit user permission. Silence is not approval. Existing session authorization covers only its specified scope. Preserve unrelated working-tree changes and report unverified behavior.
