# Claude Code Docs — Visual Extract (1440×900)

Source: `https://code.claude.com/docs/zh-CN/overview`  
Captured via gstack-browse · BuilderPulse keeps its own content.

## Layout
| Region | Width | Position |
|--------|-------|----------|
| Header | 100% × 112px (64+48) | fixed/sticky top |
| Left nav | 288px (`18rem`) | fixed, top 7.1rem |
| Main | max ~768px (`48rem`) | pl 23.7rem |
| TOC | 264px (`16.5rem`) | fixed right, xl+ |

## Colors
- Canvas: `rgb(253,253,247)` / `#FDFDF7`
- Primary text: `rgb(23,23,23)` / `#171717`
- Body: `rgb(80,80,80)` / `#505050`
- Muted: `rgb(112,112,112)` / `#707070`
- Border: `rgb(238,238,238)` / `#EEEEEE`
- Active nav fill: `rgba(14,14,14,0.10)`
- Dark canvas: `rgb(9,9,11)`
- Dark accent: `rgb(212,162,127)`

## Typography
- UI/body: Anthropic Sans → **Inter** fallback
- H1: 24–30px, bold, `#171717`
- Eyebrow: 14px semibold, primary color
- Sidebar: 14px / leading 20px
- TOC: 14px / leading 24px

## Components
- Search: 36px tall, rounded-xl, white fill, ⌘K chip
- Tabs: 48px row, 1.5px bottom bar on active, synthetic bold
- Sidebar link: rounded-xl, py-1.5, pl-4
- Copy page: split button (copy + chevron)
- TOC header: ≡ icon + "在此页面"
- Scrollbar: hidden until scroll (3px flash)