/**
 * projects.js — Fetches data/projects.json and renders project cards
 * on projects.html. To add a new project, edit data/projects.json only.
 */

(function () {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  fetch('data/projects.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(projects => renderProjects(projects))
    .catch(err => showError(err));

  /* ── Render all cards ──────────────────────────────────── */
  function renderProjects(projects) {
    if (!projects || projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          No projects yet — add entries to data/projects.json to get started.
        </div>`;
      return;
    }

    grid.innerHTML = projects.map(p => cardHTML(p)).join('');
  }

  /* ── Card template ─────────────────────────────────────── */
  function cardHTML(p) {
    const tags = (p.tags || [])
      .map(t => `<span class="tag">${esc(t)}</span>`)
      .join('');

    const imageBlock = p.image ? `
      <div class="card-image-wrap">
        <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy">
      </div>` : '';

    return `
      <article class="item-card">
        ${imageBlock}
        <div class="card-body">
          <p class="card-date">${esc(p.date || '')}</p>
          <h2 class="card-title">${esc(p.title)}</h2>
          ${p.subtitle ? `<p class="card-subtitle">${esc(p.subtitle)}</p>` : ''}
          ${tags ? `<div class="card-tags">${tags}</div>` : ''}
          <p class="card-summary">${esc(p.summary || '')}</p>
          <a href="project.html?id=${encodeURIComponent(p.id)}" class="card-cta">
            View Project <span class="arrow">→</span>
          </a>
        </div>
      </article>`;
  }

  /* ── Error state ───────────────────────────────────────── */
  function showError(err) {
    console.error('Could not load projects:', err);
    grid.innerHTML = `
      <div class="error-state" style="grid-column:1/-1;">
        <strong>Could not load projects.</strong><br>
        This site must be served over HTTP (not opened directly as a file).<br>
        Run a local server or deploy to GitHub Pages to view your projects.
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
