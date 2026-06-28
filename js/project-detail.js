/**
 * project-detail.js — Reads "?id=" URL param, loads data/projects.json,
 * and renders the project in 4 sections:
 *   01 Design Goals  02 Design Process  03 Challenges  04 Reflection
 */

(function () {
  const container = document.getElementById('project-detail');
  const bcTitle   = document.getElementById('bc-title');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) { showNotFound('No project ID specified.'); return; }

  fetch('data/projects.json')
    .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
    .then(projects => {
      const project = projects.find(p => p.id === id);
      project ? renderDetail(project) : showNotFound(`No project found with id "${id}".`);
    })
    .catch(showError);

  /* ── Helpers ───────────────────────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mediaGrid(items, fallbackTitle) {
    if (!items || !items.length) return '';
    return `
      <div class="gallery-grid" style="margin-top:var(--sp-xl);">
        ${items.map(g => {
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
                <img src="${esc(g.url)}" alt="${esc(g.caption || fallbackTitle)}" loading="lazy"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="gallery-broken" style="display:none;">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" opacity="0.3">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Save image locally to display</span>
                </div>
                ${g.caption ? `<figcaption class="gallery-caption">${esc(g.caption)}</figcaption>` : ''}
              </figure>`;
          }
        }).join('')}
      </div>`;
  }

  function sectionHeading(num, title) {
    return `
      <div class="project-section-heading">
        <span class="project-section-num">${num}</span>
        <h2 class="project-section-title">${title}</h2>
      </div>`;
  }

  /* ── Render ────────────────────────────────────────────── */
  function renderDetail(p) {
    document.title = `${p.title} | Projects`;
    if (bcTitle) bcTitle.textContent = p.title;

    const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');

    const links = (p.links || []).map((l, i) => `
      <a href="${esc(l.url)}" class="btn ${i === 0 ? 'btn-primary' : 'btn-outline'}"
         target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('');

    const heroImage = p.image ? `
      <div class="detail-hero-image">
        <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}"
             onerror="this.style.display='none';">
      </div>` : '';

    /* 01 — Design Goals */
    const goalsHTML = p.designGoals && p.designGoals.length ? `
      <section class="project-section">
        ${sectionHeading('01', 'Design Goals')}
        <ul class="goals-list">
          ${p.designGoals.map(g => `<li>${esc(g)}</li>`).join('')}
        </ul>
      </section>` : '';

    /* 02 — Design Process */
    const processText = p.designProcess && p.designProcess.text
      ? p.designProcess.text.split('\n\n').filter(Boolean)
          .map(para => `<p>${esc(para.trim())}</p>`).join('')
      : '';
    const processMedia = mediaGrid((p.designProcess || {}).media, p.title);
    const processHTML = (processText || processMedia) ? `
      <section class="project-section">
        ${sectionHeading('02', 'Design Process')}
        ${processText ? `<div class="process-text">${processText}</div>` : ''}
        ${processMedia}
      </section>` : '';

    /* 03 — Challenges */
    const challengeItems = (p.challenges && p.challenges.items || [])
      .map(c => `<li>${esc(c)}</li>`).join('');
    const challengeMedia = mediaGrid((p.challenges || {}).media, p.title);
    const challengesHTML = (challengeItems || challengeMedia) ? `
      <section class="project-section">
        ${sectionHeading('03', 'Challenges')}
        ${challengeItems ? `<ul class="challenges-list">${challengeItems}</ul>` : ''}
        ${challengeMedia}
      </section>` : '';

    /* 04 — Reflection */
    const learnedItems = (p.reflection && p.reflection.learned || [])
      .map(l => `<li>${esc(l)}</li>`).join('');
    const improvementItems = (p.reflection && p.reflection.improvements || [])
      .map(i => `<li>${esc(i)}</li>`).join('');
    const reflectionHTML = (learnedItems || improvementItems) ? `
      <section class="project-section">
        ${sectionHeading('04', 'Reflection')}
        <div class="reflection-grid">
          ${learnedItems ? `
            <div class="reflection-block">
              <p class="reflection-sub-label">What I Learned</p>
              <ul class="reflection-list learned">${learnedItems}</ul>
            </div>` : ''}
          ${improvementItems ? `
            <div class="reflection-block">
              <p class="reflection-sub-label">Improvements</p>
              <ul class="reflection-list improvements">${improvementItems}</ul>
            </div>` : ''}
        </div>
      </section>` : '';

    container.innerHTML = `
      <div class="detail-layout">

        <div class="detail-main">
          ${heroImage}
          <p class="detail-date">${esc(p.date || '')}</p>
          <h1 class="detail-title">${esc(p.title)}</h1>
          ${p.subtitle ? `<p class="detail-subtitle">${esc(p.subtitle)}</p>` : ''}
          ${tags ? `<div class="card-tags" style="margin-bottom:2rem;">${tags}</div>` : ''}

          ${goalsHTML}
          ${processHTML}
          ${challengesHTML}
          ${reflectionHTML}

          ${links ? `<div class="btn-row" style="margin-top:var(--sp-xl);">${links}</div>` : ''}
        </div>

        <aside class="detail-sidebar">
          <div class="info-card">
            <p class="card-label">Project Info</p>
            <ul class="info-list">
              ${p.date   ? `<li><span class="info-key">Date</span><span class="info-val">${esc(p.date)}</span></li>` : ''}
              ${p.status ? `<li><span class="info-key">Status</span><span class="info-val">${esc(p.status)}</span></li>` : ''}
              ${p.course ? `<li><span class="info-key">Course</span><span class="info-val">${esc(p.course)}</span></li>` : ''}
              ${(p.tags||[]).length ? `<li><span class="info-key">Tools</span><span class="info-val">${p.tags.map(t=>esc(t)).join(', ')}</span></li>` : ''}
            </ul>
          </div>
          <a href="projects.html" class="btn btn-outline" style="width:100%;justify-content:center;">
            ← All Projects
          </a>
        </aside>

      </div>

      <div class="lightbox-overlay" id="lightbox">
        <button class="lightbox-close" id="lightbox-close" aria-label="Close">&times;</button>
        <div id="lightbox-inner"></div>
      </div>`;

    initLightbox();
  }

  /* ── Lightbox ──────────────────────────────────────────── */
  function initLightbox() {
    const overlay  = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const lbInner  = document.getElementById('lightbox-inner');
    if (!overlay || !lbInner) return;

    document.querySelectorAll('.gallery-item video').forEach(vid => {
      const fig = vid.closest('.gallery-item');
      fig.addEventListener('mouseenter', () => vid.play());
      fig.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    });

    document.querySelectorAll('.gallery-item[data-lightbox-src]').forEach(fig => {
      fig.addEventListener('click', () => {
        const src  = fig.getAttribute('data-lightbox-src');
        const type = fig.getAttribute('data-lightbox-type');
        lbInner.innerHTML = type === 'video'
          ? `<video src="${esc(src)}" controls autoplay style="max-width:100%;max-height:85vh;border-radius:8px;background:#000;"></video>`
          : `<img src="${esc(src)}" alt="" style="max-width:100%;max-height:85vh;border-radius:8px;">`;
        overlay.classList.add('open');
      });
    });

    const close = () => { overlay.classList.remove('open'); lbInner.innerHTML = ''; };
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function showNotFound(msg) {
    if (bcTitle) bcTitle.textContent = 'Not Found';
    container.innerHTML = `<div class="empty-state"><p>${esc(msg)}</p><br>
      <a href="projects.html" class="btn btn-outline">← Back to Projects</a></div>`;
  }

  function showError(err) {
    console.error('Could not load project:', err);
    container.innerHTML = `<div class="error-state"><strong>Could not load project data.</strong><br>
      Run a local server: <code>npx serve .</code></div>`;
  }
})();
