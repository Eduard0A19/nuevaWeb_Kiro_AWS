'use strict';

/* =====================================================================
   Pokédex · Primera generación (HTML + CSS + JS puros)
   Datos: https://pokeapi.co  ·  Sin dependencias ni build.
   ===================================================================== */

const API = 'https://pokeapi.co/api/v2';
const SPR = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const art = (id, shiny) => `${SPR}/other/official-artwork/${shiny ? 'shiny/' : ''}${id}.png`;
const TOTAL = 151;

/* ---------- Diccionarios en español ---------- */
const TYPES_ES = {
  normal: 'Normal', fighting: 'Lucha', flying: 'Volador', poison: 'Veneno', ground: 'Tierra', rock: 'Roca',
  bug: 'Bicho', ghost: 'Fantasma', steel: 'Acero', fire: 'Fuego', water: 'Agua', grass: 'Planta',
  electric: 'Eléctrico', psychic: 'Psíquico', ice: 'Hielo', dragon: 'Dragón', dark: 'Siniestro', fairy: 'Hada',
};
const TYPE_ORDER = Object.keys(TYPES_ES);
const STATS = [
  ['hp', 'PS'], ['attack', 'Ataque'], ['defense', 'Defensa'],
  ['special-attack', 'At. Esp.'], ['special-defense', 'Def. Esp.'], ['speed', 'Velocidad'],
];
const STAT_ES = Object.fromEntries(STATS);
const COLORS_ES = { black: 'Negro', blue: 'Azul', brown: 'Marrón', gray: 'Gris', green: 'Verde', pink: 'Rosa', purple: 'Morado', red: 'Rojo', white: 'Blanco', yellow: 'Amarillo' };
const HABITAT_ES = { cave: 'Cueva', forest: 'Bosque', grassland: 'Pradera', mountain: 'Montaña', rare: 'Raro', 'rough-terrain': 'Terreno accidentado', sea: 'Mar', urban: 'Urbano', 'waters-edge': 'Orilla del agua' };
const GROWTH_ES = { slow: 'Lenta', medium: 'Media rápida', fast: 'Rápida', 'medium-slow': 'Media lenta', 'slow-then-very-fast': 'Errática', 'fast-then-very-slow': 'Fluctuante' };
const EGG_ES = { monster: 'Monstruo', water1: 'Agua 1', bug: 'Bicho', flying: 'Volador', ground: 'Campo', fairy: 'Hada', plant: 'Planta', humanshape: 'Humanoide', water3: 'Agua 3', mineral: 'Mineral', indeterminate: 'Amorfo', water2: 'Agua 2', ditto: 'Ditto', dragon: 'Dragón', 'no-eggs': 'Desconocido' };
const SHAPE_ES = { ball: 'Esfera', squiggle: 'Serpentina', fish: 'Pez', arms: 'Brazos', blob: 'Amorfo', upright: 'Erguido', legs: 'Piernas', quadruped: 'Cuadrúpedo', wings: 'Alas', tentacles: 'Tentáculos', heads: 'Cabezas', humanoid: 'Humanoide', 'bug-wings': 'Alas de insecto', armor: 'Armadura' };
const VERSION_ES = { red: 'Rojo', blue: 'Azul', yellow: 'Amarillo', gold: 'Oro', silver: 'Plata', crystal: 'Cristal', ruby: 'Rubí', sapphire: 'Zafiro', emerald: 'Esmeralda', firered: 'Rojo Fuego', leafgreen: 'Verde Hoja', diamond: 'Diamante', pearl: 'Perla', platinum: 'Platino', heartgold: 'Oro HeartGold', soulsilver: 'Plata SoulSilver', black: 'Negro', white: 'Blanco', 'black-2': 'Negro 2', 'white-2': 'Blanco 2', x: 'X', y: 'Y', 'omega-ruby': 'Rubí Omega', 'alpha-sapphire': 'Zafiro Alfa', sun: 'Sol', moon: 'Luna', 'ultra-sun': 'Ultrasol', 'ultra-moon': 'Ultraluna', 'lets-go-pikachu': "Let's Go Pikachu", 'lets-go-eevee': "Let's Go Eevee", sword: 'Espada', shield: 'Escudo', 'legends-arceus': 'Leyendas Arceus', scarlet: 'Escarlata', violet: 'Púrpura' };
const ITEM_ES = { 'fire-stone': 'Piedra Fuego', 'water-stone': 'Piedra Agua', 'thunder-stone': 'Piedra Trueno', 'leaf-stone': 'Piedra Hoja', 'moon-stone': 'Piedra Lunar', 'sun-stone': 'Piedra Solar' };
const CLASS_ES = { physical: 'Físico', special: 'Especial', status: 'Estado' };

/* Naturalezas (no dependen de la especie): sube / baja un 10 % una estadística */
const NATURES = [
  ['Hardy', 'Fuerte', null, null], ['Lonely', 'Huraña', 'attack', 'defense'], ['Brave', 'Audaz', 'attack', 'speed'],
  ['Adamant', 'Firme', 'attack', 'special-attack'], ['Naughty', 'Pícara', 'attack', 'special-defense'],
  ['Bold', 'Osada', 'defense', 'attack'], ['Docile', 'Dócil', null, null], ['Relaxed', 'Plácida', 'defense', 'speed'],
  ['Impish', 'Agitada', 'defense', 'special-attack'], ['Lax', 'Floja', 'defense', 'special-defense'],
  ['Timid', 'Miedosa', 'speed', 'attack'], ['Hasty', 'Activa', 'speed', 'defense'], ['Serious', 'Seria', null, null],
  ['Jolly', 'Alegre', 'speed', 'special-attack'], ['Naive', 'Ingenua', 'speed', 'special-defense'],
  ['Modest', 'Modesta', 'special-attack', 'attack'], ['Mild', 'Afable', 'special-attack', 'defense'],
  ['Quiet', 'Mansa', 'special-attack', 'speed'], ['Bashful', 'Tímida', null, null], ['Rash', 'Alocada', 'special-attack', 'special-defense'],
  ['Calm', 'Serena', 'special-defense', 'attack'], ['Gentle', 'Amable', 'special-defense', 'defense'],
  ['Sassy', 'Atrevida', 'special-defense', 'speed'], ['Careful', 'Cauta', 'special-defense', 'special-attack'], ['Quirky', 'Rara', null, null],
].map(([en, es, up, down]) => ({ en, es, up, down }));

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad = n => String(n).padStart(3, '0');
const idFromUrl = u => Number(u.replace(/\/$/, '').split('/').pop());
const es = (names, key = 'name') => (names || []).find(n => n.language.name === 'es')?.[key];
const typeColor = t => `var(--t-${t})`;
const typeBadge = t => `<span class="badge" style="--tc:${typeColor(t)}">${TYPES_ES[t] || cap(t)}</span>`;

const cache = new Map();
function getJSON(url) {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }).catch(e => { cache.delete(url); throw e; }));
  }
  return cache.get(url);
}
async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(fn));
}

/* ---------- Estado ---------- */
const state = {
  list: [],                 // [{id, en, es, types[]}]
  typeFilter: 'all',
  q: '',
  sort: 'num',
  totals: {},               // id -> suma de estadísticas base (carga bajo demanda)
  cur: null,                // {id, p, species}
  tab: 'info',
  shiny: false,
  nature: 'Seria',
  level: 50,
  flavorIdx: null,
  typeData: {},             // nombre de tipo -> JSON de /type
};

/* ---------- Arranque ---------- */
init();

async function init() {
  buildTypeFilter();
  bindEvents();
  try {
    const data = await getJSON(`${API}/pokemon?limit=${TOTAL}`);
    state.list = data.results.map(r => ({ id: idFromUrl(r.url), en: r.name, es: null, types: [] }));
    loadSavedNames();
    renderGrid();
    handleHash();
    loadTypes();      // tipos actuales + efectividades
    loadSpanishNames();
  } catch (e) {
    const err = $('#error');
    err.hidden = false;
    err.textContent = 'No se pudo cargar la Pokédex. Comprueba tu conexión y recarga la página.';
  }
}

function loadSavedNames() {
  try {
    const saved = JSON.parse(localStorage.getItem('pdx:names:v1') || '{}');
    state.list.forEach(p => { if (saved[p.id]) p.es = saved[p.id]; });
  } catch { /* sin caché */ }
}

async function loadSpanishNames() {
  const missing = state.list.filter(p => !p.es);
  if (!missing.length) return;
  let done = 0;
  await inBatches(missing, 15, async p => {
    try {
      const sp = await getJSON(`${API}/pokemon-species/${p.id}`);
      p.es = es(sp.names) || cap(p.en);
    } catch { p.es = cap(p.en); }
    done++;
  });
  const saved = Object.fromEntries(state.list.map(p => [p.id, p.es]));
  try { localStorage.setItem('pdx:names:v1', JSON.stringify(saved)); } catch { /* ignorar */ }
  renderGrid();
}

async function loadTypes() {
  await inBatches(TYPE_ORDER, 9, async t => {
    try {
      const d = await getJSON(`${API}/type/${t}`);
      state.typeData[t] = d;
      d.pokemon.forEach(({ pokemon, slot }) => {
        const id = idFromUrl(pokemon.url);
        const p = state.list[id - 1];
        if (p && id <= TOTAL) p.types[slot - 1] = t;
      });
    } catch { /* se reintenta al abrir la ficha */ }
  });
  state.list.forEach(p => { p.types = p.types.filter(Boolean); });
  renderGrid();
  if (state.cur) renderSheet();
}

/* ---------- Rejilla ---------- */
function buildTypeFilter() {
  const nav = $('#types');
  nav.innerHTML = `<button class="chip all active" data-type="all">Todos</button>` +
    TYPE_ORDER.filter(t => t !== 'dark').map(t =>
      `<button class="chip" data-type="${t}" style="--tc:${typeColor(t)}">${TYPES_ES[t]}</button>`).join('');
}

function visibleList() {
  const q = norm(state.q.trim());
  let out = state.list.filter(p => {
    if (state.typeFilter !== 'all' && !p.types.includes(state.typeFilter)) return false;
    if (!q) return true;
    return norm(p.en).includes(q) || norm(p.es || '').includes(q) || String(p.id) === q.replace('#', '') || pad(p.id).includes(q.replace('#', ''));
  });
  if (state.sort === 'name') out = out.slice().sort((a, b) => (a.es || a.en).localeCompare(b.es || b.en, 'es'));
  if (state.sort === 'total') out = out.slice().sort((a, b) => (state.totals[b.id] || 0) - (state.totals[a.id] || 0));
  return out;
}

function renderGrid() {
  const list = visibleList();
  $('#grid').innerHTML = list.map(p => `
    <button class="card" data-id="${p.id}" style="--c1:${p.types[0] ? typeColor(p.types[0]) : 'var(--panel2)'}" aria-label="${esc(p.es || cap(p.en))}, número ${p.id}">
      <span class="num">#${pad(p.id)}</span>
      <img src="${art(p.id)}" alt="" loading="lazy" width="120" height="120">
      <h2>${esc(p.es || cap(p.en))}</h2>
      <div class="types">${p.types.map(typeBadge).join('')}</div>
      ${state.sort === 'total' && state.totals[p.id] ? `<small>Total ${state.totals[p.id]}</small>` : ''}
    </button>`).join('');
  $('#count').textContent = `${list.length} de ${TOTAL} Pokémon`;
  $('#empty').hidden = list.length > 0;
}

async function ensureTotals() {
  const missing = state.list.filter(p => !state.totals[p.id]);
  if (!missing.length) return;
  $('#count').textContent = 'Calculando estadísticas de los 151 Pokémon…';
  await inBatches(missing, 15, async p => {
    try {
      const d = await getJSON(`${API}/pokemon/${p.id}`);
      state.totals[p.id] = d.stats.reduce((s, x) => s + x.base_stat, 0);
    } catch { /* ignorar */ }
  });
}

function bindEvents() {
  $('#types').addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    state.typeFilter = b.dataset.type;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === b));
    renderGrid();
  });
  let t;
  $('#q').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 120);
  });
  $('#sort').addEventListener('change', async e => {
    state.sort = e.target.value;
    if (state.sort === 'total') await ensureTotals();
    renderGrid();
  });
  $('#random').addEventListener('click', () => openPokemon(1 + Math.floor(Math.random() * TOTAL)));
  $('#grid').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (c) openPokemon(Number(c.dataset.id));
  });

  const modal = $('#modal');
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  modal.addEventListener('close', () => { if (location.hash) history.replaceState(null, '', location.pathname + location.search); state.cur = null; });
  modal.addEventListener('keydown', e => {
    if (!state.cur || e.target.matches('input, select')) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  $('#sheet').addEventListener('click', onSheetClick);
  $('#sheet').addEventListener('change', onSheetChange);
  $('#sheet').addEventListener('input', onSheetInput);
  window.addEventListener('hashchange', handleHash);
}

function handleHash() {
  const id = Number(location.hash.replace('#', ''));
  if (id >= 1 && id <= TOTAL && state.cur?.id !== id) openPokemon(id);
}

/* ---------- Ficha ---------- */
function closeModal() { $('#modal').close(); }
function go(delta) {
  if (!state.cur) return;
  openPokemon(((state.cur.id - 1 + delta + TOTAL) % TOTAL) + 1, true);
}

async function openPokemon(id, keepTab = false) {
  const modal = $('#modal');
  if (!keepTab) { state.tab = 'info'; state.shiny = false; }
  state.flavorIdx = null;
  if (!modal.open) modal.showModal();
  $('#sheet').innerHTML = `<div class="pane loading">Cargando #${pad(id)}…</div>`;
  history.replaceState(null, '', `#${id}`);
  try {
    const [p, species] = await Promise.all([getJSON(`${API}/pokemon/${id}`), getJSON(`${API}/pokemon-species/${id}`)]);
    state.cur = { id, p, species };
    state.totals[id] = p.stats.reduce((s, x) => s + x.base_stat, 0);
    await ensureTypeData(p.types.map(t => t.type.name));
    renderSheet();
    $('#modal').scrollTop = 0;
    $('#sheet').scrollTop = 0;
  } catch (e) {
    $('#sheet').innerHTML = `<div class="pane"><p>No se pudo cargar este Pokémon.</p><button class="btn" data-act="close">Cerrar</button></div>`;
  }
}

async function ensureTypeData(names) {
  await Promise.all(names.filter(n => !state.typeData[n]).map(async n => {
    try { state.typeData[n] = await getJSON(`${API}/type/${n}`); } catch { /* ignorar */ }
  }));
}

function cur() { return state.cur; }

function renderSheet() {
  const { id, p, species } = cur();
  const types = p.types.sort((a, b) => a.slot - b.slot).map(t => t.type.name);
  const name = es(species.names) || cap(p.name);
  const genus = es(species.genera, 'genus') || '';
  const imgUrl = art(id, state.shiny);
  const flags = [];
  if (species.is_legendary) flags.push('<span class="badge" style="--tc:#d4a017">Legendario</span>');
  if (species.is_mythical) flags.push('<span class="badge" style="--tc:#c0397f">Singular</span>');
  const tabs = [['info', 'Información'], ['stats', 'Estadísticas y naturaleza'], ['evo', 'Evolución'], ['moves', 'Movimientos']];

  $('#sheet').innerHTML = `
    <div class="hero" style="--c1:${typeColor(types[0])};--c2:${typeColor(types[1] || types[0])}">
      <div class="nav">
        <button class="btn" data-act="prev" title="Anterior (←)" aria-label="Pokémon anterior">◀</button>
        <button class="btn" data-act="next" title="Siguiente (→)" aria-label="Pokémon siguiente">▶</button>
        <button class="btn" data-act="close" title="Cerrar (Esc)" aria-label="Cerrar">✕</button>
      </div>
      <div class="art">
        <img src="${imgUrl}" alt="${esc(name)}${state.shiny ? ' variocolor' : ''}">
        <div class="tools">
          <button class="btn" data-act="shiny" aria-pressed="${state.shiny}">✨ Variocolor</button>
          ${p.cries?.latest ? '<button class="btn" data-act="cry">🔊 Grito</button>' : ''}
        </div>
      </div>
      <div>
        <div style="opacity:.8;font-weight:700">#${pad(id)}</div>
        <h2>${esc(name)}</h2>
        <p class="sub">${esc(genus)} · ${esc(cap(p.name))}</p>
        <div class="types">${types.map(typeBadge).join('')}</div>
        ${flags.length ? `<div class="flags">${flags.join('')}</div>` : ''}
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${state.tab === k}">${l}</button>`).join('')}
    </div>
    <div id="pane" class="pane" role="tabpanel"></div>
    <div class="close-row"><button class="btn" data-act="close">Cerrar</button></div>`;
  renderPane();
}

function renderPane() {
  const pane = $('#pane');
  if (!pane) return;
  document.querySelectorAll('.tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === state.tab));
  if (state.tab === 'info') { pane.innerHTML = infoHTML(); fillAbilities(); }
  if (state.tab === 'stats') pane.innerHTML = statsHTML();
  if (state.tab === 'evo') { pane.innerHTML = '<p class="loading">Cargando cadena evolutiva…</p>'; fillEvolution(); }
  if (state.tab === 'moves') { pane.innerHTML = '<p class="loading">Cargando movimientos…</p>'; fillMoves(); }
  if (state.tab === 'stats') requestAnimationFrame(() => document.querySelectorAll('.bar > i').forEach(i => { i.style.width = i.dataset.w; }));
}

/* ----- Pestaña Información ----- */
function flavors(species) {
  const seen = new Set();
  return species.flavor_text_entries.filter(f => f.language.name === 'es').map(f => ({
    text: f.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim(),
    version: f.version.name,
  })).filter(f => { const k = f.version + f.text; if (seen.has(k)) return false; seen.add(k); return true; });
}

function infoHTML() {
  const { p, species } = cur();
  const fl = flavors(species);
  if (state.flavorIdx === null) state.flavorIdx = Math.max(0, fl.length - 1);
  const f = fl[state.flavorIdx];
  const gender = species.gender_rate === -1 ? 'Sin género' :
    `♂ ${100 - species.gender_rate * 12.5}% · ♀ ${species.gender_rate * 12.5}%`;
  const eggs = species.egg_groups.map(g => EGG_ES[g.name] || cap(g.name)).join(', ');
  const rows = [
    ['Altura', `${(p.height / 10).toFixed(1).replace('.', ',')} m`],
    ['Peso', `${(p.weight / 10).toFixed(1).replace('.', ',')} kg`],
    ['Experiencia base', p.base_experience ?? '—'],
    ['Hábitat', species.habitat ? (HABITAT_ES[species.habitat.name] || cap(species.habitat.name)) : '—'],
    ['Color', COLORS_ES[species.color?.name] || '—'],
    ['Forma', SHAPE_ES[species.shape?.name] || '—'],
    ['Grupo huevo', eggs || '—'],
    ['Ciclos de huevo', species.hatch_counter ?? '—'],
    ['Ratio de captura', `${species.capture_rate} / 255`],
    ['Amistad base', species.base_happiness ?? '—'],
    ['Género', gender],
    ['Crecimiento', GROWTH_ES[species.growth_rate?.name] || '—'],
    ['EVs que otorga', p.stats.filter(s => s.effort).map(s => `+${s.effort} ${STAT_ES[s.stat.name]}`).join(', ') || '—'],
    ['Cambia de forma', species.forms_switchable ? 'Sí' : 'No'],
  ];
  return `
    <h3>Descripción</h3>
    <div class="desc">${esc(f ? f.text : 'Sin descripción disponible en español.')}</div>
    ${fl.length > 1 ? `<div class="desc-row"><label for="ver">Versión:</label>
      <select id="ver">${fl.map((x, i) => `<option value="${i}" ${i === state.flavorIdx ? 'selected' : ''}>${esc(VERSION_ES[x.version] || cap(x.version))}</option>`).join('')}</select></div>` : ''}
    <h3>Datos</h3>
    <dl class="facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <h3>Habilidades</h3>
    <div id="abilities" class="abilities"><span class="loading">Cargando…</span></div>
    <h3>Efectividad de tipos (al recibir ataques)</h3>
    ${matchupsHTML()}
    <p class="note">Tipos y efectividades según las reglas actuales (incluye Acero, Siniestro y Hada).</p>`;
}

async function fillAbilities() {
  const { id, p } = cur();
  const box = $('#abilities');
  const items = await Promise.all(p.abilities.sort((a, b) => a.slot - b.slot).map(async a => {
    try {
      const d = await getJSON(a.ability.url);
      const flavor = (d.flavor_text_entries || []).filter(x => x.language.name === 'es').pop()?.flavor_text.replace(/\s+/g, ' ');
      return { name: es(d.names) || cap(a.ability.name), hidden: a.is_hidden, text: flavor || '' };
    } catch { return { name: cap(a.ability.name), hidden: a.is_hidden, text: '' }; }
  }));
  if (cur()?.id !== id || !$('#abilities')) return;
  box.innerHTML = items.map(a => `<div class="ability"><b>${esc(a.name)}</b>${a.hidden ? '<span class="tag">Oculta</span>' : ''}${a.text ? `<small>${esc(a.text)}</small>` : ''}</div>`).join('');
}

function matchupsHTML() {
  const { p } = cur();
  const defs = p.types.map(t => t.type.name);
  const mult = {};
  TYPE_ORDER.forEach(a => { mult[a] = 1; });
  defs.forEach(d => {
    const r = state.typeData[d]?.damage_relations;
    if (!r) return;
    r.double_damage_from.forEach(x => { mult[x.name] *= 2; });
    r.half_damage_from.forEach(x => { mult[x.name] *= .5; });
    r.no_damage_from.forEach(x => { mult[x.name] *= 0; });
  });
  const cls = m => m === 0 ? 'm0' : m === .25 ? 'm025' : m === .5 ? 'm05' : m === 2 ? 'm2' : m === 4 ? 'm4' : '';
  const label = m => m === 0 ? '0×' : m === .5 ? '½×' : m === .25 ? '¼×' : `${m}×`;
  const shown = TYPE_ORDER.filter(t => mult[t] !== 1).sort((a, b) => mult[b] - mult[a]);
  if (!shown.length) return '<p class="note">Sin debilidades ni resistencias.</p>';
  return `<div class="matchups">${shown.map(t => `<div class="match">${typeBadge(t)}<span class="mult ${cls(mult[t])}">${label(mult[t])}</span></div>`).join('')}</div>`;
}

/* ----- Pestaña Estadísticas / Naturaleza ----- */
function calcStat(key, base, level, nat) {
  const iv = 31, ev = 0;
  if (key === 'hp') return base === 1 ? 1 : Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
  let v = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5;
  if (nat.up === key) v = Math.floor(v * 1.1);
  else if (nat.down === key) v = Math.floor(v * .9);
  return v;
}

function statsHTML() {
  const { p } = cur();
  const nat = NATURES.find(n => n.es === state.nature) || NATURES[12];
  const lvl = state.level;
  const color = v => v < 50 ? '#ff6b6b' : v < 80 ? '#ffa94d' : v < 110 ? '#ffd43b' : v < 140 ? '#8ce99a' : '#38d9a9';
  let total = 0, totalFinal = 0;
  const rows = STATS.map(([key, label]) => {
    const base = p.stats.find(s => s.stat.name === key).base_stat;
    const fin = calcStat(key, base, lvl, nat);
    total += base; totalFinal += fin;
    const mark = nat.up === key ? ' <span class="up">▲</span>' : nat.down === key ? ' <span class="down">▼</span>' : '';
    return `<div class="stat"><span class="name">${label}${mark}</span><b>${base}</b>
      <div class="bar"><i data-w="${Math.min(100, base / 255 * 100)}%" style="background:${color(base)}"></i></div>
      <span class="final">${fin}</span></div>`;
  }).join('');
  const natDesc = nat.up ? `<span class="up">▲ ${STAT_ES[nat.up]} +10 %</span> · <span class="down">▼ ${STAT_ES[nat.down]} −10 %</span>` : 'Neutra: no modifica ninguna estadística.';
  return `
    <h3>Naturaleza y nivel</h3>
    <div class="nature-box">
      <label>Naturaleza
        <select id="nature">${NATURES.map(n => `<option ${n.es === nat.es ? 'selected' : ''}>${n.es}</option>`).join('')}</select>
      </label>
      <label>Nivel
        <input id="level" type="number" min="1" max="100" value="${lvl}">
      </label>
      <div class="nature-info"><b>${nat.es}</b> <small>(${nat.en})</small><br>${natDesc}</div>
    </div>
    <div class="stat head"><span>Estadística</span><span style="text-align:right">Base</span><span></span><span style="text-align:right">Nv. ${lvl}</span></div>
    ${rows}
    <div class="stat total"><span class="name">Total</span><b>${total}</b><span></span><span class="final">${totalFinal}</span></div>
    <p class="note">La naturaleza no es propia de la especie: cada ejemplar tiene una. Aquí se calculan las estadísticas finales con IV 31, EV 0 y la naturaleza elegida.</p>`;
}

/* ----- Pestaña Evolución ----- */
async function fillEvolution() {
  const { id, species } = cur();
  try {
    const chain = await getJSON(species.evolution_chain.url);
    if (cur()?.id !== id) return;
    const html = chainHTML(chain.chain, id);
    $('#pane').innerHTML = `<h3>Cadena evolutiva</h3>${html}
      <p class="note">Solo se muestran las formas de la primera generación.</p>`;
  } catch {
    $('#pane').innerHTML = '<p>No se pudo cargar la cadena evolutiva.</p>';
  }
}

function evoReason(d) {
  if (!d) return '';
  const parts = [];
  if (d.min_level) parts.push(`Nv. ${d.min_level}`);
  if (d.item) parts.push(ITEM_ES[d.item.name] || cap(d.item.name.replace(/-/g, ' ')));
  if (d.trigger?.name === 'trade') parts.push('Intercambio');
  if (d.min_happiness) parts.push('Amistad');
  if (d.known_move) parts.push(`Conocer ${cap(d.known_move.name.replace(/-/g, ' '))}`);
  if (d.time_of_day) parts.push(d.time_of_day === 'day' ? 'De día' : 'De noche');
  return parts.join(' · ') || '—';
}

function chainHTML(node, curId) {
  const nid = idFromUrl(node.species.url);
  const p = state.list[nid - 1];
  const nodeHtml = `<button class="evo-node ${nid === curId ? 'me' : ''}" data-open="${nid}">
      <img src="${art(nid)}" alt="" loading="lazy"><b>${esc(p?.es || cap(node.species.name))}</b><small>#${pad(nid)}</small></button>`;
  const next = node.evolves_to.filter(n => idFromUrl(n.species.url) <= TOTAL);
  if (!next.length) return `<div class="evo">${nodeHtml}</div>`;
  const branches = next.map(n => `<div class="evo-step">
      <div class="evo-arrow"><span>→</span>${esc(evoReason(n.evolution_details[0]))}</div>
      ${chainHTML(n, curId)}</div>`).join('');
  return `<div class="evo">${nodeHtml}<div class="evo-branch">${branches}</div></div>`;
}

/* ----- Pestaña Movimientos ----- */
async function fillMoves() {
  const { id, p } = cur();
  const learn = [];
  p.moves.forEach(m => {
    const v = m.version_group_details.find(d => d.version_group.name === 'red-blue');
    if (!v) return;
    const method = v.move_learn_method.name;
    if (method === 'level-up') learn.push({ url: m.move.url, name: m.move.name, kind: 'lvl', level: v.level_learned_at });
    else if (method === 'machine') learn.push({ url: m.move.url, name: m.move.name, kind: 'tm', level: 999 });
  });
  learn.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  if (!learn.length) { $('#pane').innerHTML = '<p>Sin datos de movimientos para Rojo/Azul.</p>'; return; }
  const details = {};
  await inBatches(learn, 12, async m => {
    try { details[m.name] = await getJSON(m.url); } catch { /* ignorar */ }
  });
  if (cur()?.id !== id) return;
  const row = m => {
    const d = details[m.name];
    const t = d?.type?.name;
    return `<tr><td>${m.kind === 'lvl' ? (m.level || '—') : 'MT/MO'}</td>
      <td><b>${esc(d ? (es(d.names) || cap(m.name)) : cap(m.name))}</b></td>
      <td>${t ? typeBadge(t) : ''}</td><td>${esc(CLASS_ES[d?.damage_class?.name] || '—')}</td>
      <td>${d?.power ?? '—'}</td><td>${d?.accuracy ?? '—'}</td><td>${d?.pp ?? '—'}</td></tr>`;
  };
  const head = '<thead><tr><th>Nv.</th><th>Movimiento</th><th>Tipo</th><th>Clase</th><th>Pot.</th><th>Prec.</th><th>PP</th></tr></thead>';
  const lv = learn.filter(m => m.kind === 'lvl'), tm = learn.filter(m => m.kind === 'tm');
  $('#pane').innerHTML = `
    ${lv.length ? `<h3>Por nivel (Rojo / Azul)</h3><div class="table-wrap"><table>${head}<tbody>${lv.map(row).join('')}</tbody></table></div>` : ''}
    ${tm.length ? `<h3>Por MT / MO</h3><div class="table-wrap"><table>${head}<tbody>${tm.map(row).join('')}</tbody></table></div>` : ''}
    <p class="note">Potencia, precisión y PP son los valores actuales del movimiento.</p>`;
}

/* ----- Eventos de la ficha ----- */
function onSheetClick(e) {
  const t = e.target.closest('[data-act], [data-tab], [data-open]');
  if (!t) return;
  if (t.dataset.tab) { state.tab = t.dataset.tab; renderPane(); return; }
  if (t.dataset.open) { openPokemon(Number(t.dataset.open), true); return; }
  switch (t.dataset.act) {
    case 'close': closeModal(); break;
    case 'prev': go(-1); break;
    case 'next': go(1); break;
    case 'shiny': state.shiny = !state.shiny; renderSheet(); break;
    case 'cry': new Audio(cur().p.cries.latest).play().catch(() => {}); break;
  }
}
function onSheetChange(e) {
  if (e.target.id === 'ver') { state.flavorIdx = Number(e.target.value); renderPane(); }
  if (e.target.id === 'nature') { state.nature = e.target.value; renderPane(); }
}
function onSheetInput(e) {
  if (e.target.id !== 'level') return;
  const v = Math.max(1, Math.min(100, Math.round(Number(e.target.value)) || 1));
  if (e.target.value === '') return;
  state.level = v;
  const pane = $('#pane');
  const scroll = pane.scrollTop;
  pane.innerHTML = statsHTML();
  const input = $('#level');
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  pane.scrollTop = scroll;
  document.querySelectorAll('.bar > i').forEach(i => { i.style.width = i.dataset.w; });
}
