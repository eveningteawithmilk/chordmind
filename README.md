# ChordMind — Setup Guide (Baby Steps!)

## Your 3 project files:
```
D:\chord-generator\
  ├── index.html    ← The app (frontend)
  ├── server.js     ← The backend brain
  └── package.json  ← Tells Node what to install
```

---

## STEP 1 — Copy Files
Copy all 3 files into your `D:\chord-generator` folder.

---

## STEP 2 — Install Dependencies
Open VS Code Terminal (Ctrl + `) and type:
```
cd D:\chord-generator
npm install
```
Wait for it to finish. You'll see a `node_modules` folder appear.

---

## STEP 3 — Start the Backend
In the same terminal, type:
```
node server.js
```
You should see:
```
  ✅  ChordMind backend is running!
  🌐  Open in browser → http://localhost:3000
```

---

## STEP 4 — Open the App
Open your browser and go to:
```
http://localhost:3000
```
The full app will load! 🎉

---

## Features:
- 🎸 **Tuner Tab** — Click "Start Tuning", allow microphone, play your guitar
- 🎵 **Generator Tab** — Pick key/mood/genre, generate chord progressions
- 💾 **Saved Tab** — All your saved progressions

## API Endpoints
| Method | URL | What it does |
|--------|-----|-------------|
| GET | /api/health | Check server is running |
| POST | /api/generate | Generate chord progression |
| GET | /api/songs?scale=major&mood=happy | Get song recommendations |
| GET | /api/tuning | Get guitar standard tuning |
| GET | /api/progressions | Get saved progressions |
| POST | /api/progressions | Save a progression |
| DELETE | /api/progressions/:id | Delete a progression |

---

## To stop the server:
Press `Ctrl + C` in the terminal.

## To restart:
Type `node server.js` again.
