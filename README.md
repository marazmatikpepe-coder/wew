# GTA VI Menu Simulator (fan-made)

A Windows desktop menu simulator inspired by the supplied GTA VI / Vice City screenshots. It plays the supplied intro video, then opens the main menu and loops the supplied menu soundtrack. Settings are interactive and saved locally in the app using `localStorage`.

> This is an unofficial fan-made interface demo. It is not GTA VI, does not contain the game, does not connect to Rockstar services, and does not implement gameplay. The **Start Game** item intentionally displays a demo notice.

## Run locally

1. Install Node.js 22 or newer.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm start`.

## Build Windows EXE + ZIP with GitHub Actions

1. Create a new GitHub repository.
2. Upload the **contents** of this project folder (keep `.github/workflows/build.yml`).
3. Push to `main` or `master`, or open **Actions → Build Windows app → Run workflow**.
4. When the workflow finishes, open its run and download the artifact named `GTA-VI-Menu-Simulator-Windows`.
5. The artifact contains a portable `.exe` and a `.zip` Windows build.

The GitHub Actions workflow builds on `windows-latest`; no Windows machine is required locally.

## Controls

- Main menu: Up / Down, Enter.
- Settings: click tabs and controls; arrow keys navigate settings, Left / Right change values, Escape returns.
- Intro: any key or click skips the cinematic.
- Quit Game: exits the desktop app.

## Project structure

- `main.js`, `preload.js` — Electron desktop shell.
- `src/` — menu, settings interface and styling.
- `assets/intro.mp4` — supplied opening video.
- `assets/menu-theme.mp3` — supplied menu soundtrack.
- `assets/menu-reference.png`, `assets/settings-reference.png` — supplied visual references.
- `assets/app-icon.ico` — Windows executable icon derived from the supplied logo area.
