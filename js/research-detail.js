/**
 * research-detail.js — Reads "?id=" URL parameter, loads
 * data/research.json, and renders the matching item's full detail view.
 */

(function () {
  const container = document.getElementById('research-detail');
  const bcTitle   = document.getElementById('bc-title');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    showNotFound('No research ID specified.');
    return;
  }

  fetch('data/research.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(items => {
      const item = items.find(r => r.id === id);
      if (!item) {
        showNotFound(`No research found with id "${id}".`);
        return;
      }
      renderDetail(item);
    })
    .catch(err => showError(err));

  /* ── Render detail ─────────────────────────────────────── */
  function renderDetail(item) {
    document.title = `${item.title} | Research`;
    if (bcTitle) bcTitle.textContent = item.title;

    const tags = (item.tags || [])
      .map(t => `<span class="tag">${esc(t)}</span>`)
      .join('');

    const highlights = (item.highlights || [])
      .map(h => `<li>${esc(h)}</li>`)
      .join('');

    const links = (item.links || [])
      .map((l, i) => `
        <a href="${esc(l.url)}" class="btn ${i === 0 ? 'btn-primary' : 'btn-outline'}"
           target="_blank" rel="noopener">
          ${esc(l.label)} ↗
        </a>`)
      .join('');

    const descParagraphs = (item.description || '')
      .split('\n\n')
      .filter(Boolean)
      .map(para => `<p>${esc(para.trim())}</p>`)
      .join('');

    container.innerHTML = `
      <div class="detail-layout">

        <!-- Main content -->
        <div class="detail-main">
          <p class="detail-date">${esc(item.date || '')}</p>
          <h1 class="detail-title">${esc(item.title)}</h1>
          ${item.subtitle ? `<p class="detail-subtitle">${esc(item.subtitle)}</p>` : ''}
          ${tags ? `<div class="card-tags" style="margin-bottom:2rem;">${tags}</div>` : ''}

          <div class="detail-description">${descParagraphs}</div>

          ${highlights ? `
            <div class="highlights-block">
              <p class="highlights-label">Key Findings / Contributions</p>
              <ul class="highlights-list">${highlights}</ul>
            </div>` : ''}

          ${links ? `<div class="btn-row">${links}</div>` : ''}
        </div>

        <!-- Sidebar -->
        <aside class="detail-sidebar">
          <div class="info-card">
            <p class="card-label">Research Info</p>
            <ul class="info-list">
              ${item.date ? `<li>
                <span class="info-key">Date</span>
                <span class="info-val">${esc(item.date)}</span>
              </li>` : ''}
              ${item.venue ? `<li>
                <span class="info-key">Venue</span>
                <span class="info-val">${esc(item.venue)}</span>
              </li>` : ''}
              ${item.status ? `<li>
                <span class="info-key">Status</span>
                <span class="info-val">${esc(item.status)}</span>
              </li>` : ''}
              ${item.advisor ? `<li>
                <span class="info-key">Advisor</span>
                <span class="info-val">${esc(item.advisor)}</span>
              </li>` : ''}
              ${(item.tags || []).length ? `<li>
                <span class="info-key">Topics</span>
                <span class="info-val">${item.tags.map(t => esc(t)).join(', ')}</span>
              </li>` : ''}
            </ul>
          </div>
          <a href="research.html" class="btn btn-outline" style="width:100%;justify-content:center;">
            ← All Research
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
        <a href="research.html" class="btn btn-outline">← Back to Research</a>
      </div>`;
  }

  /* ── Fetch Error ───────────────────────────────────────── */
  function showError(err) {
    console.error('Could not load research:', err);
    container.innerHTML = `
      <div class="error-state">
        <strong>Could not load research data.</strong><br>
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
