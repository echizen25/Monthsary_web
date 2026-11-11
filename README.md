# Our Little Sunshine 💛

A simple, mobile-first romantic surprise website. **No admin dashboard, no browser-only customization, and no database.** Content is bundled in the React application so the recipient sees the same letter on every device.

## What happens

1. **“Miss mo na ba ako, Baby?”** Only `yes` or `oo` (case-insensitive) continues. Other answers show a cute Try Again message.
2. Romantic wax-seal envelope invitation
3. Cinematic gift reveal and **one video** (`1111.mp4`)
4. Unfolding love letter with the exact personal text supplied by the author, followed by the sunflower finale

The letter is in `src/App.jsx` in the `CONTENT.letter` value. **Its wording and spacing were preserved as supplied.** The app does not read previous `localStorage` values and it no longer displays a Customize/admin screen.

## Add your video

Put your complete file at:

```
Monthsary_web/
├── public/
│   └── 1111.mp4
├── src/
│   └── App.jsx
├── vite.config.js
└── package.json
```

**Copy the file completely before starting Vite.** On Windows, a large MP4 being copied, processed, or held by another app can produce `EBUSY: resource busy or locked`. The project now ignores `public/**/*.mp4` in Vite's file watcher; restart the dev server after copying the file so the new configuration takes effect.

```powershell
git switch feature/butter-yellow-monthsary
git pull origin feature/butter-yellow-monthsary
npm install
npm run dev
```

Open `http://localhost:5173/1111.mp4` directly in your browser. If the file downloads, is missing, or does not play, check its path, size, and encoding. For broad browser compatibility, encode MP4 as **H.264 video + AAC audio** (avoid unsupported video codecs). Large videos should be compressed for mobile.

Then open the website and reach the Memories section after the question, invitation and gift.

## Build and publish

```powershell
npm run build
npm run preview
```

Vite copies `public/1111.mp4` into `dist/1111.mp4` for static deployment. Upload the full build output to a static host like Vercel/Netlify or IIS.

**Privacy warning:** This repository was public when last checked. The letter is committed as source code and a video committed to a public repository or published to an unprotected static site can be accessed by others. Consider changing repository visibility before uploading personal media, and understand that private GitHub visibility does not make a deployed site private.

## Tech

React, Vite, Framer Motion, Lucide icons, CSS animations. Mobile responsive.
