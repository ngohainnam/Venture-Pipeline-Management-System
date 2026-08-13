# MIV Design System Cleanup

This document tracks the current state of the MIV frontend design system, what needs to be cleaned up, and the progress of applying the new color palette.

## Target Palette

| Token | Hex | Intended Use |
| --- | --- | --- |
| Primary | `#00709B` | Main actions, active navigation, focus accents, key charts |
| Secondary | `#F05125` | Important secondary actions, warnings, energetic highlights |
| Tertiary | `#00B4D8` | Supporting accents, info states, progress, links where primary is too heavy |
| Neutral | `#0F172A` | App shell, text foundation, dark surfaces, sidebar base |

## Design Goals

- Use semantic tokens instead of hard-coded Tailwind color classes wherever possible.
- Make `globals.css` the source of truth for palette, theme, radius, surfaces, borders, and focus states.
- Keep shared UI primitives simple and token-driven.
- Reduce one-off animation, gradient, and global override classes.
- Make the admin dashboard and user dashboard feel like the same product.
- Preserve accessibility features: dark mode, high contrast, reduce motion, and compact mode.

## Key Files

| File | Purpose | Cleanup Priority | Status |
| --- | --- | --- | --- |
| `app/globals.css` | Global CSS variables, Tailwind v4 theme tokens, base styles, accessibility modes, custom utilities | Critical | Cleaned |
| `tailwind.config.ts` | Legacy Tailwind theme extension and named brand/status colors | High | Aligned |
| `app/layout.tsx` | Root layout, font loading, global providers | Medium | Reviewed |
| `components/theme-provider.tsx` | Light/dark/system theme class management | Medium | Reviewed |
| `app/dashboard/layout.tsx` | Admin dashboard shell and page background | High | Cleaned |
| `app/user-dashboard/layout.tsx` | User dashboard shell, header, search, avatar, page background | High | Cleaned |
| `components/sidebar.tsx` | Admin desktop sidebar styling and active states | High | Cleaned |
| `components/user-dashboard/user-sidebar.tsx` | User sidebar styling and active states | High | Cleaned |
| `components/ui/button.tsx` | Button variants using semantic tokens | Medium | Reviewed |
| `components/ui/card.tsx` | Card surface styling using semantic tokens | Medium | Cleaned |
| `components/ui/input.tsx` | Input border, focus, placeholder, selection styling | Medium | Reviewed |
| `components/ui/badge.tsx` | Badge variants using semantic tokens | Medium | Reviewed |

## Current Problems

### Global CSS Noise

`app/globals.css` contains a large number of custom utility classes and animations that appear unused or too broad for a clean design system.

Examples to audit or remove:

- `animate-morphing`
- `animate-particle-float`
- `animate-liquid-flow`
- `animate-text-reveal`
- `animate-gradient-shift`
- `blob-shape`
- `artistic-grid`
- `artistic-text`
- `glitch-text`
- `magnetic-element`
- `data-pulse`
- `perspective-card`
- `text-shimmer`
- `hover-lift-3d`
- `terminal-cursor`
- `animate-hologram`
- `animate-quantum-pulse`
- `animate-energy-flow`
- `animate-cosmic`
- `typewriter`
- `holographic-text`
- `immersive-hover`
- `cinematic-entrance`
- `affinity-gradient`
- `affinity-shadow`
- `affinity-shadow-lg`
- `smooth-hover`
- `btn-primary`
- `card-hover`
- `dropdown-enter`
- `dropdown-enter-active`
- `text-gradient`
- `focus-ring`
- `section-padding`
- `animate-scroll`
- `animate-on-scroll`
- `interactive-hover`
- `btn-hover`
- `grid-fade-in`
- `artistic-hover`
- `particle-canvas`
- `loader-*`
- `page-transition`
- `hover-lift`
- `ripple`

### Duplicate CSS

These definitions appear duplicated or conflicting:

- `@keyframes float`
- `.animate-float`
- `@keyframes morphing`
- `@keyframes glitch-1`
- `@keyframes glitch-2`
- `.high-contrast`

### Theme Conflicts

There are currently two dark-mode concepts:

- `.dark`, controlled by `ThemeProvider`
- `.dark-mode`, manually toggled on the landing page

This can cause inconsistent styling. The preferred direction is to use `.dark` as the main theme mode and convert landing-page overrides to semantic tokens.

### Broad Global Overrides

Some selectors are too broad and can override component styling unexpectedly:

- `.high-contrast *`
- `.dark-mode .bg-white`
- `.dark-mode h1`, `.dark-mode h2`, etc.
- `.dark-mode .text-gray-900`
- global `button:focus`, `input:focus`, `select:focus`, `textarea:focus`

These should be replaced with token-based defaults and component-level focus styles.

### Hard-Coded Color Classes

The app has many hard-coded classes such as:

- `bg-blue-600`
- `text-blue-600`
- `from-slate-900`
- `via-slate-800`
- `to-blue-950`
- `bg-teal-600`
- `from-teal-500`
- `text-gray-600`

These should gradually move to semantic tokens like `bg-primary`, `text-muted-foreground`, `bg-sidebar`, `border-border`, and purpose-specific status tokens.

## Palette Application Progress

| Area | Progress | Notes |
| --- | --- | --- |
| CSS theme tokens | 100% | Target palette mapped into `:root` and `.dark`; added sidebar, status, info, and chart tokens |
| Tailwind config alignment | 100% | Legacy theme extension now points at semantic CSS variables and updated MIV palette |
| Shared UI primitives | 45% | Card radius now follows the cleaner shared system; buttons/inputs/badges remain token-driven |
| Admin dashboard shell | 100% | Shell background, loading states, and access states use semantic tokens |
| User dashboard shell | 100% | Shell, header, search, status pill, and avatar use semantic tokens |
| Admin sidebar | 100% | Sidebar surface, active states, search, footer, and focus rings use sidebar tokens |
| User sidebar | 100% | Sidebar now matches admin language and route-based active states |
| Landing page | 20% | Root background and sticky nav use semantic tokens; manual `.dark-mode` class was merged into `.dark` |
| Accessibility modes | 70% | High contrast, reduced motion, compact mode, and focus behavior kept with narrower selectors |
| Component pages | 0% | Many page-level hard-coded colors remain |

## Recommended Cleanup Plan

### Phase 1: Token Foundation

- Replace `:root` and `.dark` values in `globals.css` with the new palette.
- Add semantic token aliases for:
  - app shell
  - sidebar
  - success
  - warning
  - info
  - danger
  - chart colors
- Align `tailwind.config.ts` with the same palette or reduce it to config-only responsibilities.

### Phase 2: Reduce Global CSS

- Remove unused visual-effect classes after confirming they are not referenced.
- Deduplicate repeated keyframes.
- Keep only essential global utilities:
  - accessibility modes
  - reduced motion
  - compact mode
  - focus behavior
  - base typography/surface behavior
- Resolve scrollbar conflict: choose either hidden scrollbars or custom scrollbars, not both.

### Phase 3: Shell And Navigation

- Update `app/dashboard/layout.tsx` and `app/user-dashboard/layout.tsx` to use semantic background, border, and text tokens.
- Update both sidebars to share the same design language.
- Replace blue/teal active states with `primary` and sidebar tokens.

### Phase 4: Shared UI Components

- Review `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Sheet`, `Tabs`, `Select`, and `Toast`.
- Keep variants token-driven.
- Avoid adding one-off brand colors inside primitives unless they are semantic variants.

### Phase 5: Page-Level Migration

- Migrate high-traffic pages first:
  - dashboard home
  - user dashboard
  - portfolio
  - deal flow
  - venture intake
  - system settings
- Replace hard-coded visual classes with semantic tokens.
- Keep status colors semantic and consistent.

## Proposed Token Mapping

Initial mapping for implementation:

| Semantic Token | Suggested Value |
| --- | --- |
| `--primary` | `#00709B` |
| `--primary-foreground` | `#F8FAFC` |
| `--secondary` | `#F05125` |
| `--secondary-foreground` | `#FFF7ED` |
| `--accent` | `#00B4D8` |
| `--accent-foreground` | `#06202A` |
| `--background` | `#F8FAFC` |
| `--foreground` | `#0F172A` |
| `--card` | `#FFFFFF` |
| `--card-foreground` | `#0F172A` |
| `--muted` | `#E2E8F0` |
| `--muted-foreground` | `#64748B` |
| `--border` | `#CBD5E1` |
| `--input` | `#CBD5E1` |
| `--ring` | `#00B4D8` |
| `--sidebar` | `#0F172A` |
| `--sidebar-foreground` | `#E2E8F0` |
| `--sidebar-primary` | `#00B4D8` |
| `--sidebar-primary-foreground` | `#06151C` |
| `--destructive` | `#F05125` |

Dark mode should stay close to the palette preview:

| Semantic Token | Suggested Value |
| --- | --- |
| `--background` | `#0F172A` |
| `--foreground` | `#E2E8F0` |
| `--card` | `#172033` |
| `--card-foreground` | `#E2E8F0` |
| `--primary` | `#7CCBFF` |
| `--secondary` | `#FF9F8F` |
| `--accent` | `#3DDCFF` |
| `--border` | `#29354D` |
| `--input` | `#29354D` |
| `--ring` | `#7CCBFF` |

## Progress Checklist

- [x] Create `DESIGN.md`
- [x] Define final token mapping in `globals.css`
- [x] Remove duplicate keyframes
- [x] Remove or quarantine unused global effect classes
- [x] Merge `.dark-mode` behavior into `.dark` or document why both are needed
- [x] Simplify high-contrast CSS
- [x] Resolve scrollbar styling conflict
- [x] Align `tailwind.config.ts` brand colors
- [x] Update admin dashboard layout
- [x] Update user dashboard layout
- [x] Update admin sidebar
- [x] Update user sidebar
- [x] Review shared UI primitive variants
- [ ] Migrate landing page one-off button classes
- [ ] Migrate high-traffic dashboard pages
- [x] Run lint/typecheck after design-system edits

## Current Status

Status: Foundation cleanup implemented. Remaining work is page-level migration.

Verification:

- `npm.cmd run lint` passes with existing warnings.
- `npm.cmd run typecheck` still fails on pre-existing API, seed, and page typing issues outside the design-system files touched in this pass.

Last reviewed files:

- `app/globals.css`
- `tailwind.config.ts`
- `app/layout.tsx`
- `components/theme-provider.tsx`
- `app/dashboard/layout.tsx`
- `app/user-dashboard/layout.tsx`
- `components/sidebar.tsx`
- `components/user-dashboard/user-sidebar.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/badge.tsx`
