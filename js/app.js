/* ═══════════════════════════════════════════════
   Irodori App — Shared JS Utilities
   ═══════════════════════════════════════════════ */

'use strict';

// ── Audio / TTS ─────────────────────────────────────────────────
const Audio = {
  voices: [],
  ready: false,

  init() {
    if (!window.speechSynthesis) return;
    const load = () => {
      this.voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('ja'));
      this.ready = this.voices.length > 0;
    };
    load();
    speechSynthesis.addEventListener('voiceschanged', load);
  },

  speak(text, rate = 0.85) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = rate;
    if (this.voices.length) u.voice = this.voices[0];
    speechSynthesis.speak(u);
  },

  // Play MP3 from GitHub releases or CDN path
  playFile(audioId, basePath = '') {
    const url = `${basePath}audio/${audioId}.mp3`;
    const a = new window.Audio(url);
    a.play().catch(() => {
      // fallback to TTS — extract romanji from audioId
      console.warn('Audio file not found, using TTS');
    });
    return a;
  }
};

// ── Local Storage Progress ───────────────────────────────────────
const Progress = {
  key(book, lessonNum) { return `irodori_${book}_l${lessonNum}`; },

  isLessonDone(book, lessonNum) {
    return localStorage.getItem(this.key(book, lessonNum)) === '1';
  },

  setLessonDone(book, lessonNum, done) {
    if (done) localStorage.setItem(this.key(book, lessonNum), '1');
    else localStorage.removeItem(this.key(book, lessonNum));
  },

  getLessonScore(book, lessonNum) {
    return parseInt(localStorage.getItem(this.key(book, lessonNum) + '_score') || '0');
  },

  setLessonScore(book, lessonNum, score) {
    localStorage.setItem(this.key(book, lessonNum) + '_score', score);
  },

  getBookProgress(book, totalLessons) {
    let done = 0;
    for (let i = 1; i <= totalLessons; i++) {
      if (this.isLessonDone(book, i)) done++;
    }
    return { done, total: totalLessons, pct: Math.round(done / totalLessons * 100) };
  },
};

// ── Exercise Engine ──────────────────────────────────────────────
const ExerciseEngine = {
  // Shuffle array
  shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); },

  // Build match-type quiz options (wrong picks from allItems pool)
  buildMatchOpts(correctItem, allItems, answerKey = 'a', questionKey = 'q', count = 4) {
    const correct = correctItem;
    const wrongs = this.shuffle(
      allItems.filter(x => x[answerKey] !== correct[answerKey])
    ).slice(0, count - 1);
    return this.shuffle([correct, ...wrongs]);
  },

  // Render multiple-choice options into a container el
  renderOpts(opts, correctAnswer, container, onDone, displayKey = 'a') {
    container.innerHTML = '';
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt[displayKey];
      btn.addEventListener('click', () => {
        if (container.dataset.answered) return;
        container.dataset.answered = '1';
        container.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
        const isCorrect = opt[displayKey] === correctAnswer;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) {
          container.querySelectorAll('.quiz-opt').forEach(b => {
            if (b.textContent === correctAnswer) b.classList.add('correct');
          });
        }
        if (onDone) onDone(isCorrect, opt[displayKey]);
      });
      container.appendChild(btn);
    });
  },
};

// ── Drawer (hamburger menu) ──────────────────────────────────────
const Drawer = {
  open()  {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('open');
  },
  close() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
  },
};

// ── Simple Router (hash-based) ───────────────────────────────────
const Router = {
  routes: {},
  currentRoute: null,

  on(path, handler) { this.routes[path] = handler; },

  navigate(path, params = {}) {
    if (this.currentRoute === path + JSON.stringify(params)) return;
    this.currentRoute = path + JSON.stringify(params);
    window.scrollTo(0, 0);
    const handler = this.routes[path] || this.routes['*'];
    if (handler) handler(params);
    // Update active tab bar item
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.dataset.route === path);
    });
  },

  init() {
    // Back button via popstate would need full SPA — skip for simplicity
    // Tab bar links handled via onclick
  }
};

// ── DOM helpers ──────────────────────────────────────────────────
function el(id)       { return document.getElementById(id); }
function html(id, h)  { el(id).innerHTML = h; }
function show(id)     { el(id).style.display = ''; }
function hide(id)     { el(id).style.display = 'none'; }
function toggle(id)   { const e = el(id); e.style.display = e.style.display === 'none' ? '' : 'none'; }

// Escape HTML
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Render helpers ───────────────────────────────────────────────
function renderCanDoList(candos) {
  return candos.map(c => `
    <div class="cando-item">
      <span class="cando-icon">✓</span>
      <span class="cando-text">${esc(c)}</span>
    </div>`).join('');
}

function renderPhrases(phrases, speakFn) {
  return phrases.map((p, i) => `
    <div class="phrase-row" onclick="${speakFn}('${esc(p.jp).replace(/'/g,"\\'")}')">
      <span class="phrase-jp">${esc(p.jp)}</span>
      <div class="phrase-right">
        <div class="phrase-r">${esc(p.r)}</div>
        <div class="phrase-en">${esc(p.en)}</div>
      </div>
      <span class="phrase-play">▶</span>
    </div>`).join('');
}

function renderKanjiGrid(kanji) {
  if (!kanji || !kanji.length) return '<p style="font-size:0.8rem;color:var(--text3)">このレッスンには漢字のことばがありません。</p>';
  return `<div class="kanji-grid">${kanji.map(k => `
    <div class="kanji-chip" onclick="Audio.speak('${esc(k.jp).replace(/'/g,"\\'")}')">
      <div class="kanji-jp">${esc(k.jp)}</div>
      <div class="kanji-r">${esc(k.r)}</div>
      <div class="kanji-en">${esc(k.en)}</div>
    </div>`).join('')}</div>`;
}

function renderGrammar(grammar) {
  if (!grammar || !grammar.length) return '<p style="font-size:0.8rem;color:var(--text3)">文法ノートなし</p>';
  return grammar.map(g => `
    <div class="grammar-item">
      <div class="gi-pattern">${esc(g.pattern)}</div>
      <div class="gi-example">${esc(g.example)}</div>
      <div class="gi-meaning">${esc(g.meaning)}</div>
    </div>`).join('');
}

function renderActivities(activities) {
  return activities.map(a => `
    <div class="activity-row">
      <span class="act-icon">${a.icon || '🎧'}</span>
      <span class="act-text">${esc(a.jp)}</span>
      <span class="act-pg">${esc(a.en)}</span>
      <button class="act-audio-btn" onclick="Audio.speak('${esc(a.jp).replace(/'/g,"\\'")}')">▶</button>
    </div>`).join('');
}

function renderTips(tips) {
  if (!tips || !tips.length) return '';
  return `<div class="tips-box">${tips.map(t => `<span class="tips-tag">${esc(t)}</span>`).join('')}</div>`;
}

function renderStatsGrid(done, total, label = 'Lessons') {
  return `<div class="stats-grid">
    <div class="stat-box"><div class="stat-n">${total}</div><div class="stat-l">Total ${label}</div></div>
    <div class="stat-box"><div class="stat-n" style="color:var(--green)">${done}</div><div class="stat-l">Completed</div></div>
    <div class="stat-box"><div class="stat-n" style="color:var(--accent)">${total-done}</div><div class="stat-l">Remaining</div></div>
  </div>`;
}

function renderProgBar(pct, id = 'prog') {
  return `<div class="prog-wrap">
    <div class="prog-track"><div class="prog-bar" id="${id}" style="width:${Math.max(2,pct)}%"></div></div>
    <div class="prog-label">${pct}%</div>
  </div>`;
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Audio.init();
  Router.init();
  // Drawer bindings
  el('menu-btn')?.addEventListener('click', Drawer.open.bind(Drawer));
  el('drawer-overlay')?.addEventListener('click', Drawer.close.bind(Drawer));
  el('drawer-close')?.addEventListener('click', Drawer.close.bind(Drawer));
});
