# Surprise video

Place your video here with the exact filename `1111.mp4`.

Expected structure:

```
Monthsary_web/
├── public/
│   ├── 1111.mp4
│   └── README.md
├── src/
└── package.json
```

Vite copies public assets into the deployment root, making this video available at `/1111.mp4` (or the configured base path). The memories scene automatically plays this video using a standard, touch-friendly HTML5 video player.

**Privacy:** The repository is currently public. A committed MP4 can be downloaded by others; a deployed static public video URL is also accessible to anyone with the link. Consider private repository visibility and authorization if the video is confidential. Videos can be too large for ordinary GitHub uploads; use Git LFS or external storage where needed.
