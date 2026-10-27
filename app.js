'use strict';

/* =====================================================================
   Animalia · Enciclopedia de animales (HTML + CSS + JS puros)
   Datos: animals.js (propios) y wiki-data.js (Wikipedia / Wikimedia Commons)
   ===================================================================== */

/* ---------- Diccionarios ---------- */
const CLASSES = {
  mamifero: { es: 'Mamíferos', one: 'mamífero', emoji: '🦁' },
  ave: { es: 'Aves', one: 'ave', emoji: '🦅' },
  reptil: { es: 'Reptiles', one: 'reptil', emoji: '🐍' },
  anfibio: { es: 'Anfibios', one: 'anfibio', emoji: '🐸' },
  pez: { es: 'Peces', one: 'pez', emoji: '🐟' },
  invertebrado: { es: 'Invertebrados', one: 'invertebrado', emoji: '🐙' },
};
const IUCN = {
  LC: 'Preocupación menor', NT: 'Casi amenazado', VU: 'Vulnerable',
  EN: 'En peligro', CR: 'En peligro crítico', DD: 'Datos insuficientes', NE: 'No evaluado',
};
const IUCN_SCALE = ['LC', 'NT', 'VU', 'EN', 'CR'];
const METRICS = [
  { key: 'kg', label: 'Peso', fmt: fmtWeight, bigger: 'pesado' },
  { key: 'cm', label: 'Tamaño', fmt: fmtSize, bigger: 'grande' },
  { key: 'kmh', label: 'Velocidad máxima', fmt: fmtSpeed, bigger: 'rápido' },
  { key: 'yrs', label: 'Esperanza de vida', fmt: fmtLife, bigger: 'longevo' },
];

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });
const ccolor = c => `var(--c-${c})`;
const wiki = a => (typeof WIKI !== 'undefined' && WIKI[a.id]) || {};
const byId = id => ANIMALS[id - 1];

function fmtWeight(kg) {
  if (kg == null) return '—';
  if (kg >= 1000) return `${nf.format(kg / 1000)} t`;
  if (kg >= 1) return `${nf.format(kg)} kg`;
  if (kg >= 0.001) return `${nf.format(kg * 1000)} g`;
  return `${nf.format(kg * 1e6)} mg`;
}
function fmtSize(cm) {
  if (cm == null) return '—';
  return cm >= 100 ? `${nf.format(cm / 100)} m` : `${nf.format(cm)} cm`;
}
function fmtSpeed(k) { return k == null ? 'Sin dato' : `${nf.format(k)} km/h`; }
function fmtLife(y) {
  if (y == null) return '—';
  if (y < 1) { const m = Math.max(1, Math.round(y * 12)); return `~${m} ${m === 1 ? 'mes' : 'meses'}`; }
  return `~${nf.format(y)} ${y === 1 ? 'año' : 'años'}`;
}
function thumbBig(url) { return url ? url.replace(/\/\d+px-/, '/640px-') : ''; }

/* ---------- Voz femenina (Web Speech API del navegador) ---------- */
const Voice = (() => {
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const FEMALE = /helena|sabina|laura|elvira|dalia|paulina|monica|m[óo]nica|luc[íi]a|elena|marisol|esperanza|female|mujer|google espa[ñn]ol/i;
  const MALE = /pablo|raul|ra[úu]l|jorge|alvaro|[áa]lvaro|diego|juan|carlos|andres|andr[ée]s|male\b|hombre/i;
  let voice = null, on = localStorage.getItem('zoo:voice') !== 'off';

  function pick() {
    const all = synth ? synth.getVoices() : [];
    const rank = v => (FEMALE.test(v.name) ? 0 : MALE.test(v.name) ? 9 : 4) +
      (/natural|online/i.test(v.name) ? -1 : 0) + (/^es[-_]ES/i.test(v.lang) ? 0 : 1);
    voice = all.filter(v => /^es/i.test(v.lang)).sort((a, b) => rank(a) - rank(b))[0] || null;
  }
  if (synth) { pick(); synth.addEventListener?.('voiceschanged', pick); }

  function stop() { synth?.cancel(); }
  function say(text, force) {
    if (!synth || (!on && !force) || !text) return;
    stop();
    // Se trocea por frases: Chrome corta los textos largos.
    (text.match(/[^.!?;]+[.!?;]?/g) || [text]).map(s => s.trim()).filter(Boolean).forEach(part => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = voice?.lang || 'es-ES';
      if (voice) u.voice = voice;
      u.pitch = voice && FEMALE.test(voice.name) ? 1.05 : 1.35;   // más agudo si no hay voz femenina
      u.rate = 0.97;
      synth.speak(u);
    });
  }
  function toggle() {
    on = !on;
    localStorage.setItem('zoo:voice', on ? 'on' : 'off');
    if (!on) stop();
    return on;
  }
  return { say, stop, toggle, get on() { return on; }, supported: !!synth };
})();

function speechText(a) {
  const w = wiki(a);
  const sentences = (w.x || '').replace(/\s*\([^)]*\)/g, '').match(/[^.!?]+[.!?]+/g) || [];
  const intro = sentences.slice(0, 2).join(' ').trim();
  const iucn = a.iucn === 'NE' ? 'Todavía no ha sido evaluado por la UICN.' :
    a.iucn === 'DD' ? 'Sus datos son insuficientes para evaluar su conservación.' :
    `Su estado de conservación es: ${IUCN[a.iucn].toLowerCase()}.`;
  return [
    `${a.es}. Nombre científico: ${a.sci}.`,
    `Es un ${CLASSES[a.cls].one} de la familia ${a.family}.`,
    `Su dieta es ${a.diet.toLowerCase().replace(/\s*\(.*\)/, '')}.`,
    `Vive en ${a.habitat.toLowerCase()}, en ${a.range}.`,
    `Pesa ${fmtWeight(a.kg)} y mide ${fmtSize(a.cm)}.`,
    iucn,
    `Curiosidad: ${a.fact}`,
    intro,
  ].filter(Boolean).join(' ');
}

/* ---------- Estado ---------- */
const state = { cls: 'all', q: '', sort: 'name', cur: null, tab: 'desc', cmp: null };

/* ---------- Arranque ---------- */
buildClassFilter();
bindEvents();
renderGrid();
handleHash();

/* ---------- Rejilla ---------- */
function buildClassFilter() {
  $('#classes').innerHTML = `<button class="chip all active" data-cls="all">Todos</button>` +
    Object.entries(CLASSES).map(([k, c]) =>
      `<button class="chip" data-cls="${k}" style="--tc:${ccolor(k)}">${c.emoji} ${c.es}</button>`).join('');
}

function visibleList() {
  const q = norm(state.q.trim());
  let out = ANIMALS.filter(a => {
    if (state.cls !== 'all' && a.cls !== state.cls) return false;
    if (!q) return true;
    return norm([a.es, a.sci, a.habitat, a.range, a.diet, a.family, CLASSES[a.cls].es].join(' ')).includes(q);
  });
  if (state.sort === 'name') out = out.slice().sort((a, b) => a.es.localeCompare(b.es, 'es'));
  else out = out.slice().sort((a, b) => (b[state.sort] ?? -1) - (a[state.sort] ?? -1));
  return out;
}

function renderGrid() {
  const list = visibleList();
  const m = METRICS.find(x => x.key === state.sort);
  $('#grid').innerHTML = list.map(a => {
    const img = wiki(a).i;
    return `
    <button class="card" data-id="${a.id}" style="--c1:${ccolor(a.cls)}" aria-label="${esc(a.es)}">
      <div class="thumb">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : CLASSES[a.cls].emoji}</div>
      <div class="body">
        <h2>${esc(a.es)}</h2>
        <p class="sci">${esc(a.sci)}</p>
        <span class="badge" style="--tc:${ccolor(a.cls)}">${CLASSES[a.cls].es.replace(/s$/, '')}</span>
        <div class="status-line">${m ? `${m.label}: <b>${m.fmt(a[m.key])}</b>` : `<span class="dot" style="--uc:var(--u-${a.iucn})"></span>${IUCN[a.iucn]}`}</div>
      </div>
    </button>`;
  }).join('');
  $('#count').textContent = `${list.length} de ${ANIMALS.length} animales`;
  $('#empty').hidden = list.length > 0;
}

function bindEvents() {
  $('#classes').addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    state.cls = b.dataset.cls;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === b));
    renderGrid();
  });
  let t;
  $('#q').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 120);
  });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  $('#random').addEventListener('click', () => openAnimal(1 + Math.floor(Math.random() * ANIMALS.length)));
  $('#grid').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (c) openAnimal(Number(c.dataset.id));
  });

  const vbtn = $('#voice');
  const paintVoice = () => { vbtn.setAttribute('aria-pressed', Voice.on); vbtn.textContent = `🗣️ Voz: ${Voice.on ? 'sí' : 'no'}`; };
  if (!Voice.supported) { vbtn.disabled = true; vbtn.title = 'Tu navegador no admite voz'; vbtn.textContent = '🗣️ Sin voz'; }
  else { paintVoice(); vbtn.addEventListener('click', () => { Voice.toggle(); paintVoice(); }); }

  const modal = $('#modal');
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => {
    Voice.stop();
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    state.cur = null;
  });
  modal.addEventListener('keydown', e => {
    if (!state.cur || e.target.matches('input, select')) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  $('#sheet').addEventListener('click', onSheetClick);
  $('#sheet').addEventListener('change', onSheetChange);
  window.addEventListener('hashchange', handleHash);
}

function handleHash() {
  const id = Number(location.hash.replace('#', ''));
  if (id >= 1 && id <= ANIMALS.length && state.cur !== id) openAnimal(id);
}

/* ---------- Ficha ---------- */
function go(delta) {
  const list = visibleList();
  let i = list.findIndex(a => a.id === state.cur);
  if (i < 0) i = 0;
  openAnimal(list[(i + delta + list.length) % list.length].id, true);
}

function openAnimal(id, keepTab = false) {
  const a = byId(id);
  if (!a) return;
  if (!keepTab) state.tab = 'desc';
  state.cur = id;
  if (!state.cmp || state.cmp === id) state.cmp = ANIMALS.find(x => x.id !== id && x.cls !== a.cls)?.id || (id % ANIMALS.length) + 1;
  const modal = $('#modal');
  if (!modal.open) modal.showModal();
  history.replaceState(null, '', `#${id}`);
  renderSheet();
  $('#sheet').scrollTop = 0;
  Voice.say(speechText(a));
}

function renderSheet() {
  const a = byId(state.cur);
  const w = wiki(a);
  const big = thumbBig(w.i);
  const tabs = [['desc', 'Descripción'], ['data', 'Datos'], ['cmp', 'Comparar']];
  $('#sheet').innerHTML = `
    <div class="hero" style="--c1:${ccolor(a.cls)}">
      <div class="nav">
        <button class="btn" data-act="prev" title="Anterior (←)" aria-label="Animal anterior">◀</button>
        <button class="btn" data-act="next" title="Siguiente (→)" aria-label="Animal siguiente">▶</button>
        <button class="btn" data-act="close" title="Cerrar (Esc)" aria-label="Cerrar">✕</button>
      </div>
      <div class="art">
        <div class="photo">${w.i ? `<img src="${esc(big)}" data-fallback="${esc(w.i)}" alt="${esc(a.es)}">` : CLASSES[a.cls].emoji}</div>
        ${w.i ? `<div class="credit">Foto: ${esc(w.a)} · <a href="${esc(w.u)}" target="_blank" rel="noopener">${esc(w.l)}</a></div>` : ''}
      </div>
      <div>
        <div style="opacity:.8;font-weight:700">Nº ${a.id}</div>
        <h2>${esc(a.es)}</h2>
        <p class="sub">${esc(a.sci)}</p>
        <div class="tags">
          <span class="badge" style="--tc:${ccolor(a.cls)}">${CLASSES[a.cls].emoji} ${CLASSES[a.cls].es}</span>
          <span class="badge" style="--tc:var(--u-${a.iucn})"><span style="color:#111">${IUCN[a.iucn]}</span></span>
        </div>
        ${Voice.supported ? `<div class="tools"><button class="btn" data-act="speak">🗣️ Escuchar</button><button class="btn" data-act="hush" aria-label="Callar la voz">⏹</button></div>` : ''}
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${state.tab === k}">${l}</button>`).join('')}
    </div>
    <div id="pane" class="pane" role="tabpanel" style="--c1:${ccolor(a.cls)}"></div>
    <div class="close-row"><button class="btn" data-act="close">Cerrar</button></div>`;
  $('#sheet img[data-fallback]')?.addEventListener('error', function () {
    if (this.src !== this.dataset.fallback) this.src = this.dataset.fallback;
  });
  renderPane();
}

function renderPane() {
  const a = byId(state.cur);
  document.querySelectorAll('.tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === state.tab));
  const pane = $('#pane');
  if (state.tab === 'desc') pane.innerHTML = descHTML(a);
  if (state.tab === 'data') pane.innerHTML = dataHTML(a);
  if (state.tab === 'cmp') {
    pane.innerHTML = cmpHTML(a);
    requestAnimationFrame(() => document.querySelectorAll('.bar > i').forEach(i => { i.style.width = i.dataset.w; }));
  }
}

/* ----- Descripción ----- */
function descHTML(a) {
  const w = wiki(a);
  return `
    <h3>Descripción</h3>
    <div class="desc">${esc(w.x || 'Sin descripción disponible.')}</div>
    ${w.p ? `<p class="src">Texto de <a href="${esc(w.p)}" target="_blank" rel="noopener">Wikipedia</a> (CC BY-SA 4.0).</p>` : ''}
    <h3>Curiosidad</h3>
    <div class="fact"><span aria-hidden="true">💡</span><div>${esc(a.fact)}</div></div>`;
}

/* ----- Datos ----- */
function dataHTML(a) {
  const rows = [
    ['Dieta', a.diet], ['Hábitat', a.habitat], ['Distribución', a.range],
    ['Peso típico', fmtWeight(a.kg)], ['Tamaño (largo o alto)', fmtSize(a.cm)],
    ['Velocidad máxima', fmtSpeed(a.kmh)], ['Esperanza de vida en libertad', fmtLife(a.yrs)],
    ['Actividad', a.activity], ['Vida social', a.social],
  ];
  const scale = IUCN_SCALE.includes(a.iucn)
    ? `<div class="scale">${IUCN_SCALE.map(k => `<div class="${k === a.iucn ? 'on' : ''}" style="--uc:var(--u-${k})">${k}<small>${IUCN[k]}</small></div>`).join('')}</div>`
    : `<div class="scale"><div class="on" style="--uc:var(--u-${a.iucn})">${a.iucn}<small>${IUCN[a.iucn]}</small></div></div>`;
  return `
    <h3>Clasificación</h3>
    <div class="taxon">
      <span><i>Reino</i> Animalia</span><span><i>Filo</i> ${esc(a.phylum)}</span>
      <span><i>Clase</i> ${CLASSES[a.cls].es}</span><span><i>Orden</i> ${esc(a.order)}</span>
      <span><i>Familia</i> ${esc(a.family)}</span><span><i>Especie</i> <em>${esc(a.sci)}</em></span>
    </div>
    <h3>Datos</h3>
    <dl class="facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <h3>Estado de conservación (UICN)</h3>
    ${scale}
    ${a.note ? `<p class="note">${esc(a.note)}</p>` : ''}
    <p class="note">Peso, tamaño, velocidad y vida son valores aproximados de ejemplares adultos.</p>`;
}

/* ----- Comparar ----- */
function rankOf(a, key) {
  const vals = ANIMALS.filter(x => x[key] != null).sort((p, q) => q[key] - p[key]);
  const i = vals.findIndex(x => x.id === a.id);
  return i < 0 ? null : `#${i + 1} de ${vals.length}`;
}

function cmpHTML(a) {
  const b = byId(state.cmp);
  const options = ANIMALS.slice().sort((p, q) => p.es.localeCompare(q.es, 'es')).filter(x => x.id !== a.id)
    .map(x => `<option value="${x.id}" ${x.id === b.id ? 'selected' : ''}>${esc(x.es)}</option>`).join('');
  const blocks = METRICS.map(m => {
    const va = a[m.key], vb = b[m.key];
    const max = Math.max(va ?? 0, vb ?? 0) || 1;
    const w = v => v == null ? '0%' : `${Math.max(2, v / max * 100)}%`;
    let txt = '';
    if (va != null && vb != null && va !== vb) {
      const hi = va > vb ? a : b, lo = va > vb ? b : a;
      const r = Math.max(va, vb) / Math.min(va, vb);
      txt = `${hi.es} es ${nf.format(r)} veces más ${m.bigger} que ${lo.es}.`;
    } else if (va === vb && va != null) txt = 'Valores iguales.';
    else txt = 'Falta el dato de uno de los dos animales.';
    return `
      <div class="metric">
        <h4>${m.label}</h4>
        <div class="mrow"><span class="n">${esc(a.es)}</span><div class="bar"><i data-w="${w(va)}" style="background:${ccolor(a.cls)}"></i></div><b>${m.fmt(va)}</b></div>
        <div class="mrow"><span class="n">${esc(b.es)}</span><div class="bar"><i data-w="${w(vb)}" style="background:${ccolor(b.cls)}"></i></div><b>${m.fmt(vb)}</b></div>
        <div class="rank">${esc(txt)} Puesto de ${esc(a.es)} entre los ${ANIMALS.length}: ${rankOf(a, m.key) || '—'}.</div>
      </div>`;
  }).join('');
  return `
    <h3>Compara con otro animal</h3>
    <div class="cmp-pick"><label for="cmp">Comparar ${esc(a.es)} con:</label><select id="cmp">${options}</select></div>
    ${blocks}`;
}

/* ----- Eventos de la ficha ----- */
function onSheetClick(e) {
  const t = e.target.closest('[data-act], [data-tab]');
  if (!t) return;
  if (t.dataset.tab) { state.tab = t.dataset.tab; renderPane(); return; }
  switch (t.dataset.act) {
    case 'close': $('#modal').close(); break;
    case 'prev': go(-1); break;
    case 'next': go(1); break;
    case 'speak': Voice.say(speechText(byId(state.cur)), true); break;
    case 'hush': Voice.stop(); break;
  }
}
function onSheetChange(e) {
  if (e.target.id === 'cmp') { state.cmp = Number(e.target.value); renderPane(); }
}
