# Our Little Secret ♡

A static, framework-free romantic surprise site. Flow: PIN → password → song → scrolling story with swipeable memory cards → love letter → gift.

## Quick start
1. Open `js/config.js`. Everything personal is there.
2. Test locally: `python3 -m http.server 8000` in this folder, then open http://localhost:8000 (YouTube needs http, not `file://`).
3. While placeholders are unchanged and `devMode: true`, the PIN is `000000` and the password is `demo`.
4. Before deploying, set a real `pin` (six digits), `password`, `clue`, and `devMode: false`.

## Config cheat sheet
- **Song**: `youtube` accepts a full URL or the 11-character ID. Set `song.title` / `song.artist`.
- **Volume / ducking**: `music.volume`, `ducking.level` (target % while a video plays), `fadeDown`, `fadeUp` (ms).
- **Photos & videos**: put files in `assets/images` and `assets/videos`, then replace the arrays in `memories`:
  `{ id:'adv-1', type:'image', src:'assets/images/beach.jpg', title:'Beach day', caption:'…', date:'June 2025' }`
  Videos: `type:'video'`, `src:'assets/videos/clip.mp4'`, `thumb:'assets/images/clip-poster.jpg'`. Videos load only when played. Keep files small (compress to ~720p).
- **Chapter 1 intro text and photo**: `index.html`, `.c1` section (`data-ph` placeholder; set `src` on that `<img>` for a real photo).
- **Love letter**: `letter` array. **Ending**: `finalMessage`.

## Deploy (free)
- **GitHub Pages**: push the folder, Settings → Pages → deploy from branch.
- **Netlify**: drag the folder onto app.netlify.com/drop.
- **Vercel**: `vercel` in the folder, no build step.

## Honest limitations
- The PIN and password are **sentimental gates, not security**; anyone can read them via View Source.
- **iOS/iPadOS** does not allow scripts to change embedded media volume, so automatic ducking is skipped there; she gets a notice and can use the volume slider or pause button.
- Autoplay is never used; music starts only when she taps play. If YouTube blocks embedding, an "Open on YouTube" link appears.
- The YouTube player is kept mounted but visually hidden so music continues while scrolling. Check YouTube's embedding terms if that concerns you.

## Using an audio file instead of YouTube
Put your mp3 in `assets/audio/` and set `audioFile` in `js/config.js` to its path (e.g. `assets/audio/song.mp3`). Set `audioFile: ''` to use YouTube. Keep the file small (under ~10 MB; GitHub web upload limit is 25 MB). Only host audio you have the right to share: a public repo lets anyone download the file.
