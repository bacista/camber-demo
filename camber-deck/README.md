# Camber Pitch Deck

Interactive investor pitch deck built with React, Vite, and TailwindCSS. Features smooth animations, presenter view, and PDF export capability.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the deck.

## Features

- **Keyboard Navigation**: Use arrow keys to navigate
- **Presenter View**: Add `?presenter=true` to URL
- **Print Mode**: Navigate to `/print` for PDF export
- **Hash Routing**: Direct links to slides via `/#/1`, `/#/2`, etc.

## Deployment

Deploy to Vercel:
```bash
npm run build
vercel --prod
```

Or deploy to Netlify by connecting your GitHub repo.

## Adding Images

1. Extract images from `deck/camber pitch deck_250807.pdf`
2. Place in `/public/assets/`
3. Reference in slides: `<img src="/assets/logo.png" />`

## Modifying Content

- Edit slide components in `/src/slides/`
- Update data in `/src/data/onePagerContent.ts`
- Adjust theme colors in `tailwind.config.ts`