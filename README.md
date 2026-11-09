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

## Secret love question (local prototype)

The visitor now starts with **“Saan tayo unang nag-kiss?”** and the nickname **Baby**. After a correct answer, a sweet response appears and the invitation opens automatically after roughly 2.2 seconds. Wrong answers get a cute retry message.

To set the correct answer **on your development computer**:

1. Run `npm install && npm run dev`.
2. Open `http://localhost:5173/?admin=1` (for **local testing only**).
3. In Customize, enter **Secret love question**, **Accepted answer(s)**, and the response messages. Separate alternative accepted spellings with `|` (for example `place one|alternate spelling`). Do not use a personal secret in examples committed to git.
4. Close the editor; open `http://localhost:5173/` to test the visitor flow.

The correct answer is intentionally blank by default; the visitor cannot proceed until an answer is configured on that browser. No real answer is stored in source control.

**Security warning:** The `?admin=1` URL is NOT an admin login. It only shows editor controls for local preview. Both the answer and the content remain browser-local. Client-side question checking can be bypassed and does not protect remote media. Before real sharing, build a server-validated question with rate limits, authenticated owner-only admin, and protected media access. Do NOT deploy this prototype as a confidential surprise or add private content to a public repo.
