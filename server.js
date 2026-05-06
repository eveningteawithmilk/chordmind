// ============================================================
//  ChordMind Backend — server.js
//  Run: node server.js   (make sure you did npm install first)
// ============================================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend (index.html) from the same folder
app.use(express.static(path.join(__dirname)));

// ─────────────────────────────────────────────
//  MUSIC THEORY DATA
// ─────────────────────────────────────────────
const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

const SCALES = {
  major:      { intervals:[0,2,4,5,7,9,11], qualities:['maj','min','min','maj','maj','min','dim'] },
  minor:      { intervals:[0,2,3,5,7,8,10], qualities:['min','dim','maj','min','min','maj','maj'] },
  dorian:     { intervals:[0,2,3,5,7,9,10], qualities:['min','min','maj','maj','min','dim','maj'] },
  mixolydian: { intervals:[0,2,4,5,7,9,10], qualities:['maj','min','dim','maj','min','min','maj'] }
};

const ROMAN = ['I','II','III','IV','V','VI','VII'];

const CHORD_INTERVALS = { maj:[0,4,7], min:[0,3,7], dim:[0,3,6] };

const PROGRESSIONS = {
  happy:      { pop:[[0,3,4,5],[0,4,5,3]], rock:[[0,4,5,3],[0,3,4,5]], jazz:[[0,3,4,1]], folk:[[0,3,4,0]], rnb:[[0,3,4,5]] },
  sad:        { pop:[[5,3,0,4],[0,5,3,4]], rock:[[0,5,3,4]], jazz:[[1,4,0,5]], folk:[[0,3,5,4]], rnb:[[0,5,3,4]] },
  energetic:  { pop:[[0,4,5,3]], rock:[[0,4,3,4],[0,3,0,4]], jazz:[[0,2,4,1]], folk:[[0,4,3,0]], rnb:[[0,4,5,6]] },
  mysterious: { pop:[[5,3,6,4]], rock:[[5,3,6,0]], jazz:[[1,6,4,0]], folk:[[0,6,5,3]], rnb:[[5,6,3,4]] },
  romantic:   { pop:[[0,3,4,3],[0,5,3,4]], rock:[[0,4,5,4]], jazz:[[0,3,5,4]], folk:[[0,3,4,5]], rnb:[[0,3,5,4]] }
};

const SONGS = {
  major: {
    happy:     [{title:"Don't Stop Believin'",artist:"Journey",prog:"I–V–vi–IV",emoji:"🎸",diff:"easy"},{title:"Let It Be",artist:"The Beatles",prog:"I–V–vi–IV",emoji:"🎵",diff:"easy"},{title:"Uptown Funk",artist:"Bruno Mars",prog:"I–IV–V",emoji:"🎤",diff:"med"},{title:"Happy",artist:"Pharrell Williams",prog:"IV–V–I",emoji:"☀️",diff:"easy"}],
    sad:       [{title:"The Scientist",artist:"Coldplay",prog:"vi–IV–I–V",emoji:"🌧️",diff:"med"},{title:"Someone Like You",artist:"Adele",prog:"I–V–vi–IV",emoji:"💙",diff:"easy"},{title:"Fix You",artist:"Coldplay",prog:"I–V–vi–IV",emoji:"🕯️",diff:"easy"},{title:"Skinny Love",artist:"Bon Iver",prog:"vi–IV–I–V",emoji:"🍂",diff:"med"}],
    energetic: [{title:"Mr. Brightside",artist:"The Killers",prog:"I–V–vi–IV",emoji:"🌟",diff:"easy"},{title:"Blinding Lights",artist:"The Weeknd",prog:"I–V–vi–IV",emoji:"🌃",diff:"easy"},{title:"Livin' on a Prayer",artist:"Bon Jovi",prog:"vi–IV–I–V",emoji:"🔥",diff:"med"},{title:"Thunderstruck",artist:"AC/DC",prog:"I–IV–V",emoji:"⚡",diff:"hard"}],
    mysterious:[{title:"Hotel California",artist:"Eagles",prog:"vi–III–V–II",emoji:"🌙",diff:"hard"},{title:"Stairway to Heaven",artist:"Led Zeppelin",prog:"vi–V–IV–III",emoji:"🎭",diff:"hard"},{title:"Comfortably Numb",artist:"Pink Floyd",prog:"vi–IV–V",emoji:"💫",diff:"hard"},{title:"Black",artist:"Pearl Jam",prog:"I–V–vi–IV",emoji:"🖤",diff:"med"}],
    romantic:  [{title:"Perfect",artist:"Ed Sheeran",prog:"I–V–vi–IV",emoji:"💕",diff:"easy"},{title:"Your Song",artist:"Elton John",prog:"I–IV–V–vi",emoji:"❤️",diff:"med"},{title:"Can't Help Falling",artist:"Elvis Presley",prog:"I–iii–IV–V",emoji:"🌹",diff:"easy"},{title:"La Vie en Rose",artist:"Édith Piaf",prog:"I–IV–V",emoji:"🌸",diff:"med"}]
  },
  minor: {
    happy:     [{title:"Pumped Up Kicks",artist:"Foster the People",prog:"i–III–VII–IV",emoji:"🎧",diff:"easy"},{title:"Royals",artist:"Lorde",prog:"i–V–VI–VII",emoji:"👑",diff:"easy"},{title:"Seven Nation Army",artist:"The White Stripes",prog:"i–VII–VI",emoji:"⚔️",diff:"easy"},{title:"Somebody That I Used To Know",artist:"Gotye",prog:"i–VII–VI–VII",emoji:"🎵",diff:"med"}],
    sad:       [{title:"Hurt",artist:"Johnny Cash",prog:"i–III–VII–IV",emoji:"💔",diff:"easy"},{title:"Mad World",artist:"Gary Jules",prog:"i–III–VII–IV",emoji:"🌪️",diff:"easy"},{title:"The Sound of Silence",artist:"Simon & Garfunkel",prog:"i–VII–VI",emoji:"🤫",diff:"med"},{title:"Hallelujah",artist:"Leonard Cohen",prog:"i–VI–III–VII",emoji:"🙏",diff:"med"}],
    energetic: [{title:"Smells Like Teen Spirit",artist:"Nirvana",prog:"i–III–VI–VII",emoji:"🤘",diff:"med"},{title:"Enter Sandman",artist:"Metallica",prog:"i–VII–VI–V",emoji:"💀",diff:"hard"},{title:"Back in Black",artist:"AC/DC",prog:"i–V–i",emoji:"⚫",diff:"med"},{title:"Master of Puppets",artist:"Metallica",prog:"i–VII–VI",emoji:"🎸",diff:"hard"}],
    mysterious:[{title:"Creep",artist:"Radiohead",prog:"I–III–IV–iv",emoji:"👁️",diff:"easy"},{title:"Paint It Black",artist:"Rolling Stones",prog:"i–V–VII–IV",emoji:"🖤",diff:"med"},{title:"Bohemian Rhapsody",artist:"Queen",prog:"i–VI–III–VII",emoji:"👸",diff:"hard"},{title:"Nothing Else Matters",artist:"Metallica",prog:"i–V–VI–III",emoji:"🌌",diff:"hard"}],
    romantic:  [{title:"Wicked Game",artist:"Chris Isaak",prog:"i–VI–III–VII",emoji:"🔥",diff:"med"},{title:"All of Me",artist:"John Legend",prog:"i–VI–III–VII",emoji:"❤️",diff:"easy"},{title:"My Heart Will Go On",artist:"Celine Dion",prog:"i–VI–III–V",emoji:"💎",diff:"easy"},{title:"Moon River",artist:"Audrey Hepburn",prog:"I–vi–IV–V",emoji:"🌕",diff:"easy"}]
  }
};

// In-memory store (replace with MongoDB in production)
let savedProgressions = [];

// ─────────────────────────────────────────────
//  API ROUTES
// ─────────────────────────────────────────────

// GET /api/health — server status check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ChordMind backend running', port: PORT });
});

// POST /api/generate — generate a chord progression
// Body: { key, scale, mood, genre }
app.post('/api/generate', (req, res) => {
  const { key = 'C', scale = 'major', mood = 'happy', genre = 'pop' } = req.body;

  if (!SCALES[scale])      return res.status(400).json({ error: 'Invalid scale' });
  if (!PROGRESSIONS[mood]) return res.status(400).json({ error: 'Invalid mood' });
  if (!PROGRESSIONS[mood][genre]) return res.status(400).json({ error: 'Invalid genre' });

  const keyIdx = NOTES.indexOf(key);
  if (keyIdx === -1) return res.status(400).json({ error: 'Invalid key' });

  const sd = SCALES[scale];
  const scaleNotes = sd.intervals.map(i => NOTES[(keyIdx + i) % 12]);
  const opts = PROGRESSIONS[mood][genre];
  const prog = opts[Math.floor(Math.random() * opts.length)];

  const chords = prog.map(deg => {
    const q = sd.qualities[deg];
    const rootIdx = (keyIdx + sd.intervals[deg]) % 12;
    const name = NOTES[rootIdx] + (q === 'maj' ? '' : q === 'min' ? 'm' : '°');
    const roman = q === 'maj' ? ROMAN[deg] : (q === 'dim' ? ROMAN[deg].toLowerCase() + '°' : ROMAN[deg].toLowerCase());
    const noteNames = CHORD_INTERVALS[q].map(i => NOTES[(rootIdx + i) % 12]);
    return { name, roman, quality: q, notes: noteNames };
  });

  const scaleType = (scale === 'major' || scale === 'mixolydian') ? 'major' : 'minor';
  const songs = (SONGS[scaleType][mood] || []).slice(0, 4);

  res.json({ key, scale, mood, genre, scaleNotes, chords, songs });
});

// GET /api/scales — list available scales
app.get('/api/scales', (req, res) => {
  res.json(Object.keys(SCALES));
});

// GET /api/notes — list all notes
app.get('/api/notes', (req, res) => {
  res.json(NOTES);
});

// GET /api/tuning — standard guitar tuning
app.get('/api/tuning', (req, res) => {
  res.json([
    { string: 6, name: 'E2', freq: 82.41 },
    { string: 5, name: 'A2', freq: 110.00 },
    { string: 4, name: 'D3', freq: 146.83 },
    { string: 3, name: 'G3', freq: 196.00 },
    { string: 2, name: 'B3', freq: 246.94 },
    { string: 1, name: 'E4', freq: 329.63 }
  ]);
});

// GET /api/songs?scale=major&mood=happy — song recommendations
app.get('/api/songs', (req, res) => {
  const { scale = 'major', mood = 'happy' } = req.query;
  const scaleType = (scale === 'major' || scale === 'mixolydian') ? 'major' : 'minor';
  const songs = SONGS[scaleType][mood] || SONGS.major.happy;
  res.json(songs);
});

// GET /api/progressions — get all saved progressions
app.get('/api/progressions', (req, res) => {
  res.json(savedProgressions);
});

// POST /api/progressions — save a progression
// Body: { label, chords, key, scale, mood, genre }
app.post('/api/progressions', (req, res) => {
  const { label, chords, key, scale, mood, genre } = req.body;
  if (!chords) return res.status(400).json({ error: 'chords field required' });
  const entry = {
    id: Date.now(),
    label: label || `${key} ${scale}`,
    chords,
    key, scale, mood, genre,
    createdAt: new Date().toISOString()
  };
  savedProgressions.unshift(entry);
  res.status(201).json(entry);
});

// DELETE /api/progressions/:id — delete a saved progression
app.delete('/api/progressions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const before = savedProgressions.length;
  savedProgressions = savedProgressions.filter(p => p.id !== id);
  if (savedProgressions.length === before) return res.status(404).json({ error: 'Not found' });
  res.json({ deleted: true });
});

// ─────────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n  ✅  ChordMind backend is running!');
  console.log(`  🌐  Open in browser → http://localhost:${PORT}`);
  console.log(`  📡  API base URL   → http://localhost:${PORT}/api`);
  console.log('\n  API Endpoints:');
  console.log('    GET  /api/health');
  console.log('    POST /api/generate    { key, scale, mood, genre }');
  console.log('    GET  /api/songs       ?scale=major&mood=happy');
  console.log('    GET  /api/tuning');
  console.log('    GET  /api/progressions');
  console.log('    POST /api/progressions');
  console.log('    DELETE /api/progressions/:id\n');
});
