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

    const heroImage = item.image ? `
      <div class="detail-hero-image">
        <img src="${esc(item.image)}" alt="${esc(item.imageAlt || item.title)}">
      </div>` : '';

    const gallery = (item.gallery && item.gallery.length) ? `
      <div class="gallery-block">
        <p class="gallery-label">Photo & Video Gallery</p>
        <div class="gallery-grid">
          ${item.gallery.map(g => {
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(g.url);
            if (isVideo) {
              return `
                <figure class="gallery-item" data-lightbox-src="${esc(g.url)}" data-lightbox-type="video" style="cursor:zoom-in;">
                  <span class="gallery-video-badge">▶ VIDEO</span>
                  <video src="${esc(g.url)}" muted playsinline loop
                         style="width:100%;aspect-ratio:4/3;object-fit:cover;pointer-events:none;"></video>
                  ${g.caption ? `<figcaption class="gallery-caption">${esc(g.caption)}</figcaption>` : ''}
                </figure>`;
            } else {
              return `
                <figure class="gallery-item" data-lightbox-src="${esc(g.url)}" data-lightbox-type="image" style="cursor:zoom-in;">
                  <img src="${esc(g.url)}" alt="${esc(g.caption || item.title)}" loading="lazy">
                  ${g.caption ? `<figcaption class="gallery-caption">${esc(g.caption)}</figcaption>` : ''}
                </figure>`;
            }
          }).join('')}
        </div>
      </div>` : '';

    container.innerHTML = `
      <div class="detail-layout">

        <!-- Main content -->
        <div class="detail-main">
          ${heroImage}
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

          ${gallery}

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

      </div>

      <!-- Lightbox -->
      <div class="lightbox-overlay" id="lightbox">
        <button class="lightbox-close" id="lightbox-close" aria-label="Close">&times;</button>
        <div id="lightbox-inner"></div>
      </div>`;

    initLightbox();
  }

  /* ── Lightbox behavior ─────────────────────────────────── */
  function initLightbox() {
    const overlay  = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const lbInner  = document.getElementById('lightbox-inner');
    if (!overlay || !lbInner) return;

    // Play thumbnail videos on hover
    document.querySelectorAll('.gallery-item video').forEach(vid => {
      const fig = vid.closest('.gallery-item');
      fig.addEventListener('mouseenter', () => vid.play());
      fig.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    });

    // Click to open lightbox
    document.querySelectorAll('.gallery-item[data-lightbox-src]').forEach(fig => {
      fig.addEventListener('click', () => {
        const src  = fig.getAttribute('data-lightbox-src');
        const type = fig.getAttribute('data-lightbox-type');
        lbInner.innerHTML = type === 'video'
          ? `<video src="${esc(src)}" controls autoplay style="max-width:100%;max-height:85vh;border-radius:8px;"></video>`
          : `<img src="${esc(src)}" alt="" style="max-width:100%;max-height:85vh;border-radius:8px;">`;
        overlay.classList.add('open');
      });
    });

    function close() {
      overlay.classList.remove('open');
      lbInner.innerHTML = '';
    }
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
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
