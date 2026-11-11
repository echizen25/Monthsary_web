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

## Secret love question (romantic interaction, not secure access)

The visitor sees **“Miss mo na ba ako, Baby?”**. Only `yes` and `oo` are accepted, case-insensitive and ignoring leading/trailing spaces. A matching answer shows a sweet response and automatically opens the invitation after ~2.2 seconds.

Any other nonempty answer shows a playful **Try again** message and stays on the same page. Changing the input clears the message. The question is fixed; the success and retry messages can be edited from the local preview at `http://localhost:5173/?admin=1`.

**Security warning:** This is client-side romantic interaction, **not** secure authentication. The `?admin=1` preview route is not authenticated, local uploads don't sync across devices, and the question doesn't restrict access to deployed static assets. Use real authentication and protected hosting before sharing confidential memories.

## Video-only Memories section

The photo gallery below the video and the finale photo have been removed. The site now uses a single video presentation.

1. Save your video as `public/1111.mp4` (case-sensitive on many hosting platforms).
2. Run `npm run dev` and open the memories scene to test playback.
3. Run `npm run build` before deployment; Vite will copy the video to `dist/1111.mp4`.
4. Deploy the generated static site to Vercel/Netlify or IIS. The playback URL uses Vite's configured base path.

A local preview video uploaded from the Customize panel still overrides the bundled file **on that browser only**. To ensure your recipient sees the video, include `1111.mp4` in the deployed `public` folder.

**Privacy and size:** This video file has not been uploaded or committed by the assistant. Add it locally. The repository was public when last checked, so do not commit confidential media unless you have first reviewed its visibility. A static deployment does not provide authenticated video access.
