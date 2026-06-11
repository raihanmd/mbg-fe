## 2026-06-11 Initial

- All new components use exact HTML class names from reference (not Tailwind utilities)
- global.css is standalone — no Tailwind `@import` or `@theme`
- Header uses named export (`export const Header`), others use default
- Footer.tsx still uses styled-components — must convert to plain CSS classes
- SectionHeading.tsx uses Tailwind classes but is unused — should be deleted
- Skills.tsx install buttons have TODO + console.log placeholders
- Build passes (`yarn build`)
