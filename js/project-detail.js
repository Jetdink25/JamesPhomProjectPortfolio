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

    const heroImage = p.image ? `
      <div class="detail-hero-image">
        <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}">
      </div>` : '';

    const gallery = (p.gallery && p.gallery.length) ? `
      <div class="gallery-block">
        <p class="gallery-label">Photo & Video Gallery</p>
        <div class="gallery-grid">
          ${p.gallery.map(g => {
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
                  <img src="${esc(g.url)}" alt="${esc(g.caption || p.title)}" loading="lazy"
                       onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                  <div class="gallery-broken" style="display:none;">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" opacity="0.3"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>Image unavailable</span>
                  </div>
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

          ${gallery}

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
