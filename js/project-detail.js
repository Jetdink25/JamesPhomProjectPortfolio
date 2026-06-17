/**
 * project-detail.js — Reads the "?id=" URL parameter, loads
 * data/projects.json, and renders the matching project's full detail view.
 */

(function () {
  const container = document.getElementById('project-detail');
  const bcTitle   = document.getElementById('bc-title');
  if (!container) return;

  // Read ?id= from URL
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    showNotFound('No project ID specified.');
    return;
  }

  fetch('data/projects.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(projects => {
      const project = projects.find(p => p.id === id);
      if (!project) {
        showNotFound(`No project found with id "${id}".`);
        return;
      }
      renderDetail(project);
    })
    .catch(err => showError(err));

  /* ── Render detail ─────────────────────────────────────── */
  function renderDetail(p) {
    // Update page title & breadcrumb
    document.title = `${p.title} | Projects`;
    if (bcTitle) bcTitle.textContent = p.title;

    const tags = (p.tags || [])
      .map(t => `<span class="tag">${esc(t)}</span>`)
      .join('');

    const highlights = (p.highlights || [])
      .map(h => `<li>${esc(h)}</li>`)
      .join('');

    const links = (p.links || [])
      .map((l, i) => `
        <a href="${esc(l.url)}" class="btn ${i === 0 ? 'btn-primary' : 'btn-outline'}"
           target="_blank" rel="noopener">
          ${esc(l.label)} ↗
        </a>`)
      .join('');

    // Split description into paragraphs
    const descParagraphs = (p.description || '')
      .split('\n\n')
      .filter(Boolean)
      .map(para => `<p>${esc(para.trim())}</p>`)
      .join('');

    container.innerHTML = `
      <div class="detail-layout">

        <!-- Main content -->
        <div class="detail-main">
          <p class="detail-date">${esc(p.date || '')}</p>
          <h1 class="detail-title">${esc(p.title)}</h1>
          ${p.subtitle ? `<p class="detail-subtitle">${esc(p.subtitle)}</p>` : ''}
          ${tags ? `<div class="card-tags" style="margin-bottom:2rem;">${tags}</div>` : ''}

          <div class="detail-description">${descParagraphs}</div>

          ${highlights ? `
            <div class="highlights-block">
              <p class="highlights-label">Key Highlights</p>
              <ul class="highlights-list">${highlights}</ul>
            </div>` : ''}

          ${links ? `<div class="btn-row">${links}</div>` : ''}
        </div>

        <!-- Sidebar -->
        <aside class="detail-sidebar">
          <div class="info-card">
            <p class="card-label">Project Info</p>
            <ul class="info-list">
              ${p.date ? `<li>
                <span class="info-key">Date</span>
                <span class="info-val">${esc(p.date)}</span>
              </li>` : ''}
              ${p.status ? `<li>
                <span class="info-key">Status</span>
                <span class="info-val">${esc(p.status)}</span>
              </li>` : ''}
              ${(p.tags || []).length ? `<li>
                <span class="info-key">Technologies</span>
                <span class="info-val">${p.tags.map(t => esc(t)).join(', ')}</span>
              </li>` : ''}
            </ul>
          </div>
          <a href="projects.html" class="btn btn-outline" style="width:100%;justify-content:center;">
            ← All Projects
          </a>
        </aside>

      </div>`;
  }

  /* ── Not Found ─────────────────────────────────────────── */
  function showNotFound(msg) {
    if (bcTitle) bcTitle.textContent = 'Not Found';
    container.innerHTML = `
      <div class="empty-state">
        <p>${esc(msg)}</p>
        <br>
        <a href="projects.html" class="btn btn-outline">← Back to Projects</a>
      </div>`;
  }

  /* ── Fetch Error ───────────────────────────────────────── */
  function showError(err) {
    console.error('Could not load project:', err);
    container.innerHTML = `
      <div class="error-state">
        <strong>Could not load project data.</strong><br>
        Make sure you are running the site over HTTP (not file://).<br>
        Try: <code>npx serve .</code>
      </div>`;
  }

  /* ── Escape helper ─────────────────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
