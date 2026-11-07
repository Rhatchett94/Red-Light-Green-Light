# Red Light, Green Light Game

A free, installable, full-screen color game for phones. No account, external libraries, tracking, or backend required.

## Features
- **Manual mode:** tap RED, YELLOW, or GREEN to instantly change the whole screen.
- **Auto mode:** changes at unpredictable intervals and randomly chooses between the other two colors (no immediate repeats).
- **Five speed levels:** from very slow to very fast; every interval is randomized within a range.
- **Distraction-free display:** controls automatically hide during auto mode; tap the screen to bring them back.
- **Fullscreen:** button for browsers that support the Fullscreen API. On iPhone, install to the Home Screen for standalone display.
- **Offline:** after first successful load, service worker caches the app.
- **Keep screen awake:** requests Screen Wake Lock where supported. On unsupported browsers, temporarily set Auto-Lock to Never if needed.

## Publish with GitHub Pages
1. Create a new **public** GitHub repository, for example `red-light-green-light`.
2. Upload **all six files** from this folder to the root of the repository and commit them.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, then `main` and `/ (root)`. Save.
5. Once GitHub finishes publishing, open `https://YOUR-USERNAME.github.io/red-light-green-light/` on your iPhone.
6. In Safari, tap **Share → Add to Home Screen → Add**. Launch from the new icon for an app-like full-screen experience.

Note: GitHub Pages may take a few minutes to publish. The repository name in the URL must match your actual repository name.

## Controls
- Tap any color button for manual mode. This stops auto mode.
- Start/Stop Auto toggles unpredictable changes.
- The frequency slider adjusts the randomized wait time between changes.
- Tap the color display to reveal or hide controls.
- Desktop shortcuts: R, Y, G for colors; Space to toggle auto mode.

## Notes
This is a web app (PWA), not a native App Store app. iOS Safari may not support the Fullscreen API; Home Screen installation provides the best display. Yellow text is dark for contrast. Auto mode changes randomly between the *other* two colors, and the timer is randomized each time.
