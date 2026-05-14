// =============================================
//   FLOWBEAT — main.js
//   Descubrimiento musical basado en estado de ánimo
//   API: Last.fm (free tier)
// =============================================

const API_KEY = '40226c642c041e721fbec46512b8fb25';
const API_BASE = 'https://ws.audioscrobbler.com/2.0/';

// Mapa de estado de ánimo → tags de Last.fm
// 70% del tag principal + 30% de tags sorpresa
const MOOD_CONFIG = {
  energetico: {
    label: '⚡ Energético',
    primary: ['dance', 'electronic', 'pop'],
    surprise: ['afrobeat', 'drum and bass', 'reggaeton', 'k-pop', 'cumbia']
  },
  melancolico: {
    label: '🌧 Melancólico',
    primary: ['sad', 'indie', 'folk'],
    surprise: ['bossa nova', 'fado', 'ambient', 'post-rock', 'bolero']
  },
  relajado: {
    label: '🌿 Relajado',
    primary: ['chill', 'lo-fi', 'acoustic'],
    surprise: ['jazz', 'classical', 'bossa nova', 'new age', 'bossa nova']
  },
  euforico: {
    label: '🔥 Eufórico',
    primary: ['euphoria', 'hip-hop', 'rnb'],
    surprise: ['cumbia', 'samba', 'flamenco', 'metal', 'afrobeats']
  }
};

// =============================================
//   ESTADO DE LA APP
// =============================================

let currentMood = null;
let currentTracks = [];
let history = loadHistory();

// =============================================
//   REFERENCIAS DOM
// =============================================

const moodCards = document.querySelectorAll('.mood-card');
const loader = document.getElementById('loader');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const tracksGrid = document.getElementById('tracksGrid');
const refreshBtn = document.getElementById('refreshBtn');
const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const closeHistory = document.getElementById('closeHistory');
const overlay = document.getElementById('overlay');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const clearHistoryBtn = document.getElementById('clearHistory');

// =============================================
//   INICIALIZACIÓN
// =============================================

updateHistoryCount();
renderHistory();

moodCards.forEach(card => {
  card.addEventListener('click', () => {
    const mood = card.dataset.mood;
    selectMood(mood, card);
  });
});

refreshBtn.addEventListener('click', () => {
  if (currentMood) fetchTracks(currentMood);
});

historyToggle.addEventListener('click', openHistory);
closeHistory.addEventListener('click', closeHistoryPanel);
overlay.addEventListener('click', closeHistoryPanel);
clearHistoryBtn.addEventListener('click', clearHistory);

// =============================================
//   SELECCIÓN DE MOOD
// =============================================

function selectMood(mood, cardEl) {
  currentMood = mood;

  // Actualizar UI de cards
  moodCards.forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');

  fetchTracks(mood);
}

// =============================================
//   FETCH CANCIONES DESDE LAST.FM
// =============================================

async function fetchTracks(mood) {
  const config = MOOD_CONFIG[mood];
  showLoader();
  hideResults();

  try {
    // Elegir tags
    const primaryTag = config.primary[Math.floor(Math.random() * config.primary.length)];
    const surpriseTag = config.surprise[Math.floor(Math.random() * config.surprise.length)];

    // Traer canciones de ambos tags en paralelo
    const [primaryTracks, surpriseTracks] = await Promise.all([
      fetchTagTracks(primaryTag, 30),
      fetchTagTracks(surpriseTag, 15)
    ]);

    // Mezcla 70/30
    const shuffledPrimary = shuffle(primaryTracks).slice(0, 7);
    const shuffledSurprise = shuffle(surpriseTracks).slice(0, 3);

    // Marcar cada track
    const allTracks = [
      ...shuffledPrimary.map(t => ({ ...t, type: 'familiar', tag: primaryTag })),
      ...shuffledSurprise.map(t => ({ ...t, type: 'surprise', tag: surpriseTag }))
    ];

    currentTracks = shuffle(allTracks);

    resultsTitle.textContent = `${config.label} · ${capitalize(primaryTag)} + ${capitalize(surpriseTag)}`;
    renderTracks(currentTracks);
    showResults();
    scrollToResults();
  } catch (err) {
    console.error('Error al obtener canciones:', err);
    tracksGrid.innerHTML = `
      <div style="text-align:center; padding:3rem; color:var(--text-muted)">
        <p style="font-size:2rem">😕</p>
        <p>No pudimos cargar las canciones.<br>Verifica tu conexión e intenta de nuevo.</p>
      </div>
    `;
    showResults();
  }

  hideLoader();
}

async function fetchTagTracks(tag, limit = 20) {
  const url = `${API_BASE}?method=tag.getTopTracks&tag=${encodeURIComponent(tag)}&api_key=${API_KEY}&format=json&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.tracks || !data.tracks.track) return [];

  return data.tracks.track.map(t => ({
    name: t.name,
    artist: t.artist.name,
    url: t.url,
    image: t.image?.find(img => img.size === 'medium')?.['#text'] || ''
  }));
}

// =============================================
//   RENDER TRACKS
// =============================================

function renderTracks(tracks) {
  tracksGrid.innerHTML = '';

  if (!tracks.length) {
    tracksGrid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No encontramos canciones para este estado de ánimo. Intenta refrescar.</p>';
    return;
  }

  tracks.forEach((track, i) => {
    const isSaved = isInHistory(track);
    const card = document.createElement('div');
    card.className = `track-card ${track.type === 'surprise' ? 'surprise-track' : ''}`;
    card.style.animationDelay = `${i * 0.04}s`;

    const coverHTML = track.image
      ? `<img class="track-cover" src="${track.image}" alt="${escapeHtml(track.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const placeholderHTML = `<div class="track-cover-placeholder" ${track.image ? 'style="display:none"' : ''}>🎵</div>`;

    card.innerHTML = `
      ${coverHTML}
      ${placeholderHTML}
      <div class="track-info">
        <div class="track-name">${escapeHtml(track.name)}</div>
        <div class="track-artist">${escapeHtml(track.artist)}</div>
        <span class="track-badge ${track.type === 'surprise' ? 'badge-surprise' : 'badge-familiar'}">
          ${track.type === 'surprise' ? '◆ Sorpresa' : '● Familiar'}
        </span>
      </div>
      <div class="track-actions">
        <button class="save-btn ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Guardado' : 'Guardar descubrimiento'}">
          ${isSaved ? '★' : '☆'}
        </button>
        <a class="lastfm-link" href="${track.url}" target="_blank" rel="noopener">▶ Last.fm</a>
      </div>
    `;

    const saveBtn = card.querySelector('.save-btn');
    saveBtn.addEventListener('click', () => toggleSave(track, saveBtn));

    tracksGrid.appendChild(card);
  });
}

// =============================================
//   GUARDAR / HISTORIAL
// =============================================

function toggleSave(track, btn) {
  if (isInHistory(track)) {
    removeFromHistory(track);
    btn.textContent = '☆';
    btn.classList.remove('saved');
  } else {
    addToHistory(track);
    btn.textContent = '★';
    btn.classList.add('saved');
  }
  updateHistoryCount();
  renderHistory();
}

function isInHistory(track) {
  return history.some(t => t.name === track.name && t.artist === track.artist);
}

function addToHistory(track) {
  history.unshift({ ...track, savedAt: Date.now() });
  saveHistory();
}

function removeFromHistory(track) {
  history = history.filter(t => !(t.name === track.name && t.artist === track.artist));
  saveHistory();
}

function clearHistory() {
  history = [];
  saveHistory();
  updateHistoryCount();
  renderHistory();
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('flowbeat_history')) || [];
  } catch { return []; }
}

function saveHistory() {
  localStorage.setItem('flowbeat_history', JSON.stringify(history));
}

function updateHistoryCount() {
  historyCount.textContent = history.length;
}

function renderHistory() {
  historyList.innerHTML = '';

  if (!history.length) {
    historyList.innerHTML = '<p class="empty-history">Aún no has guardado nada.<br>Guarda canciones que te sorprendan.</p>';
    return;
  }

  history.forEach(track => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const coverHTML = track.image
      ? `<img class="history-cover" src="${track.image}" alt="${escapeHtml(track.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const placeholderHTML = `<div class="history-cover-placeholder" ${track.image ? 'style="display:none"' : ''}>🎵</div>`;

    item.innerHTML = `
      ${coverHTML}
      ${placeholderHTML}
      <div>
        <div class="history-name">${escapeHtml(track.name)}</div>
        <div class="history-artist">${escapeHtml(track.artist)}</div>
      </div>
      <button class="remove-btn" title="Eliminar">✕</button>
    `;

    item.querySelector('.remove-btn').addEventListener('click', () => {
      removeFromHistory(track);
      updateHistoryCount();
      renderHistory();
    });

    historyList.appendChild(item);
  });
}

// =============================================
//   PANEL DE HISTORIAL
// =============================================

function openHistory() {
  historyPanel.classList.add('open');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeHistoryPanel() {
  historyPanel.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// =============================================
//   UI HELPERS
// =============================================

function showLoader() { loader.classList.add('visible'); }
function hideLoader() { loader.classList.remove('visible'); }
function showResults() { resultsSection.classList.add('visible'); }
function hideResults() { resultsSection.classList.remove('visible'); }

function scrollToResults() {
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// =============================================
//   UTILIDADES
// =============================================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}