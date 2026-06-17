/**
 * research.js — Fetches data/research.json and renders research cards
 * on research.html. To add a new entry, edit data/research.json only.
 */

(function () {
  const grid = document.getElementById('research-grid');
  if (!grid) return;

  fetch('data/research.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(items => renderResearch(items))
    .catch(err => showError(err));

  /* ── Render all cards ──────────────────────────────────── */
  function renderResearch(items) {
    if (!items || items.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          No research yet — add entries to data/research.json to get started.
        </div>`;
      return;
    }

    grid.innerHTML = items.map(item => cardHTML(item)).join('');
  }

  /* ── Card template ─────────────────────────────────────── */
  function cardHTML(item) {
    const tags = (item.tags || [])
      .map(t => `<span class="tag">${esc(t)}</span>`)
      .join('');

    return `
      <article class="item-card">
        <p class="card-date">${esc(item.date || '')}</p>
        <h2 class="card-title">${esc(item.title)}</h2>
        ${item.subtitle ? `<p class="card-subtitle">${esc(item.subtitle)}</p>` : ''}
        ${tags ? `<div class="card-tags">${tags}</div>` : ''}
        <p class="card-summary">${esc(item.summary || '')}</p>
        <a href="research-item.html?id=${encodeURIComponent(item.id)}" class="card-cta">
          View Research <span class="arrow">→</span>
        </a>
      </article>`;
  }

  /* ── Error state ───────────────────────────────────────── */
  function showError(err) {
    console.error('Could not load research:', err);
    grid.innerHTML = `
      <div class="error-state" style="grid-column:1/-1;">
        <strong>Could not load research items.</strong><br>
        This site must be served over HTTP (not opened directly as a file).<br>
        Run a local server or deploy to GitHub Pages.
        <br><br>
        <code style="font-size:0.8rem;">npx serve .</code>
      </div>`;
  }

  /* ── HTML escape helper ────────────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
