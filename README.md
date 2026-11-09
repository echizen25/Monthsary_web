# Our Little Sunshine 💛

An interactive, mobile-first monthsary surprise in a soft butter-yellow palette.

## Features
- Three chapters: **Invitation → Gift & Memories → Love Letter & Finale**
- Animated invitation with Accept and Maybe Later choices
- Clickable gift box and photo/video memory presentation
- Customizable letter, nicknames, captions and final surprise
- Floating music toggle (after adding your own audio)
- Sunflower and heart finale, replay button
- Local editing panel using Settings (top right)
- Browser-only media uploads saved with IndexedDB, text saved with localStorage
- Reduced-motion support, responsive layout

## Development
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Important publishing/privacy notes

**This GitHub repository was PUBLIC when development started. Change visibility to Private in GitHub Settings → General → Danger Zone before adding any personal photos, messages, or videos.**

This is a front-end prototype, **not** a private authenticated site. The Customize panel has no authentication. Media uploaded via the editor is saved in the current browser's IndexedDB and **will not appear on other devices or on a deployment**. Text is saved in that browser's localStorage and does not synchronize.

For a truly shareable customized website, we should next add authenticated editing plus persistent hosted media (for example a protected storage/backend workflow), then deploy with access protection. A hidden URL alone is not private. Do not put secrets or personal media in the public git repository. For demo use, no real photos, videos, or passwords are bundled.

## Stack
React, Vite, Framer Motion, Lucide icons, custom CSS.
