/* =========================================================
   SHARED RENDERING ENGINE
   Paints site content into a document. Takes `doc` as a
   parameter (defaults to the live `document`) so the exact
   same, single, tested rendering code can run against either:
     - the live page the visitor is looking at, or
     - a separate document fetched and parsed in memory
       (used by the Admin Panel's "Publish" feature to bake a
       finished, static index.html — no iframe, no framing
       restrictions, no timing/loading race conditions).
   ========================================================= */

(function (global) {

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatWhatsapp(num) {
    const digits = String(num || '').replace(/[^0-9]/g, '');
    return digits ? `+${digits}` : '';
  }

  function shortUrl(url) {
    try {
      const u = new URL(url);
      return u.pathname && u.pathname !== '/' ? u.pathname.replace(/\/$/, '') : u.hostname;
    } catch (e) {
      return url || '';
    }
  }

  function projectThumbSVG(style) {
    if (style === 'line') {
      return `<svg viewBox="0 0 200 120" aria-hidden="true"><polyline points="10,90 40,70 70,78 100,40 130,55 160,20 190,35" fill="none" stroke="#C9A24B" stroke-width="3"/><polyline points="10,100 40,95 70,85 100,88 130,70 160,75 190,60" fill="none" stroke="#5FB7C7" stroke-width="3"/></svg>`;
    }
    if (style === 'donut') {
      return `<svg viewBox="0 0 200 120" aria-hidden="true"><circle cx="100" cy="60" r="42" fill="none" stroke="rgba(233,238,247,.1)" stroke-width="16"/><circle cx="100" cy="60" r="42" fill="none" stroke="#5FB7C7" stroke-width="16" stroke-dasharray="120 264" stroke-linecap="round" transform="rotate(-90 100 60)"/><circle cx="100" cy="60" r="42" fill="none" stroke="#C9A24B" stroke-width="16" stroke-dasharray="80 264" stroke-dashoffset="-120" stroke-linecap="round" transform="rotate(-90 100 60)"/></svg>`;
    }
    return `<svg viewBox="0 0 200 120" aria-hidden="true"><rect x="10" y="60" width="24" height="45" fill="#C9A24B" opacity=".85"/><rect x="46" y="35" width="24" height="70" fill="#5FB7C7" opacity=".8"/><rect x="82" y="70" width="24" height="35" fill="#C9A24B" opacity=".6"/><rect x="118" y="20" width="24" height="85" fill="#5FB7C7" opacity=".9"/><rect x="154" y="50" width="24" height="55" fill="#C9A24B" opacity=".75"/></svg>`;
  }

  function timelineHtml(items) {
    return `<div class="timeline reveal">${(items || []).map((it, i) => `
      <div class="t-item" data-n="${i + 1}">
        <h4>${escapeHtml(it.title)}</h4>
        <div class="t-meta">${escapeHtml(it.meta)}</div>
        <p>${escapeHtml(it.description)}</p>
      </div>`).join('')}</div>`;
  }

  // doc defaults to the live document so existing calls (renderContent(content))
  // keep working unchanged on the public site.
  function renderContent(content, doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc) return;

    /* ---------------- nav brand ---------------- */
    const navBrand = doc.getElementById('navBrand');
    if (navBrand) navBrand.textContent = content.hero.name || 'Portfolio';

    /* ---------------- hero ---------------- */
    doc.getElementById('heroEyebrow').textContent = content.hero.eyebrow;
    const [first, ...rest] = (content.hero.name || '').split(' ');
    doc.getElementById('heroNameFirst').textContent = first || '';
    doc.getElementById('heroNameRest').textContent = rest.join(' ');
    doc.getElementById('heroRole').textContent = content.hero.role;
    doc.getElementById('heroTagline').textContent = content.hero.tagline ? `"${content.hero.tagline}"` : '';

    const ctaPrimary = doc.getElementById('heroCtaPrimary');
    ctaPrimary.textContent = content.hero.ctaPrimaryText || 'View projects';
    ctaPrimary.setAttribute('href', content.hero.ctaPrimaryHref || '#projects');
    const ctaSecondary = doc.getElementById('heroCtaSecondary');
    ctaSecondary.textContent = content.hero.ctaSecondaryText || 'Get in touch';
    ctaSecondary.setAttribute('href', content.hero.ctaSecondaryHref || '#contact');

    const defaultPreviewInnerHTML = `
      <div class="mock-row">
        <div class="mock-card">
          <div class="mock-bar" style="height:40%"></div>
          <div class="mock-bar alt" style="height:70%"></div>
          <div class="mock-bar" style="height:55%"></div>
          <div class="mock-bar alt" style="height:85%"></div>
          <div class="mock-bar" style="height:30%"></div>
          <div class="mock-bar alt" style="height:60%"></div>
        </div>
        <div class="mock-card" style="align-items:center;justify-content:center;">
          <svg width="60" height="60" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(233,238,247,.08)" stroke-width="5"/>
            <circle cx="18" cy="18" r="15" fill="none" stroke="#C9A24B" stroke-width="5" stroke-dasharray="70 100" stroke-linecap="round" transform="rotate(-90 18 18)"/>
          </svg>
        </div>
      </div>
      <div class="mock-line">
        <svg viewBox="0 0 300 90" preserveAspectRatio="none">
          <polyline points="0,70 40,55 80,60 120,30 160,42 200,18 240,28 300,10" fill="none" stroke="#5FB7C7" stroke-width="2"/>
        </svg>
      </div>`;

    const previewInner = doc.getElementById('heroPreviewInner');
    const playBtn = doc.getElementById('heroPlayBtn');
    if (content.hero.previewVideo) {
      previewInner.outerHTML = `<video id="heroPreviewInner" autoplay loop muted playsinline src="${escapeHtml(content.hero.previewVideo)}"></video>`;
      if (playBtn) playBtn.style.display = 'none';
    } else if (content.hero.previewImage) {
      previewInner.outerHTML = `<img id="heroPreviewInner" src="${escapeHtml(content.hero.previewImage)}" alt="Dashboard preview">`;
      if (playBtn) playBtn.style.display = 'none';
    } else {
      previewInner.outerHTML = `<div id="heroPreviewInner" class="preview-inner">${defaultPreviewInnerHTML}</div>`;
      if (playBtn) playBtn.style.display = '';
    }
    doc.getElementById('heroPreviewTag').textContent = content.hero.previewTag || '';

    /* ---------------- about (kept exactly as originally designed) ---------------- */
    doc.getElementById('aboutEyebrow').textContent = content.about.eyebrow;
    doc.getElementById('aboutTitle').textContent = content.about.title;

    const photoFrame = doc.getElementById('aboutPhotoFrame');
    const captionEl = doc.getElementById('aboutPhotoCaption');
    if (content.about.photo) {
      photoFrame.innerHTML = `<img src="${escapeHtml(content.about.photo)}" alt="Profile photo">`;
      if (captionEl) captionEl.textContent = '';
    } else {
      photoFrame.innerHTML = `<span class="monogram">${escapeHtml((content.about.title || 'A').slice(0, 1))}</span>`;
      if (captionEl) captionEl.textContent = 'Placeholder headshot — replace via Admin Panel';
    }

    doc.getElementById('aboutParagraphs').innerHTML = (content.about.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join('');
    doc.getElementById('aboutStats').innerHTML = (content.about.stats || []).map(s => `<div class="stat"><b>${escapeHtml(s.value)}</b><span>${escapeHtml(s.label)}</span></div>`).join('');

    /* ---------------- projects ---------------- */
    doc.getElementById('projectGrid').innerHTML = (content.projects || []).map(p => `
      <div class="card reveal">
        <div class="card-thumb">${p.thumb ? `<img src="${escapeHtml(p.thumb)}" alt="${escapeHtml(p.title)} thumbnail">` : projectThumbSVG(p.thumbStyle)}</div>
        <div class="card-body">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.description)}</p>
          <a href="${escapeHtml(p.link || '#')}" class="card-link" target="_blank" rel="noopener">View full project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </a>
        </div>
      </div>`).join('');

    /* ---------------- tools ---------------- */
    doc.getElementById('toolsGrid').innerHTML = (content.tools || []).map(t => `
      <div class="tool-col">
        <h4>${escapeHtml(t.category)}</h4>
        <ul>${(t.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
      </div>`).join('');

    /* ---------------- education + certifications ---------------- */
    doc.getElementById('educationTimeline').innerHTML = timelineHtml(content.education);

    const certHeading = doc.getElementById('certHeading');
    const certRow = doc.getElementById('certRow');
    const certs = content.certifications || [];
    if (certs.length === 0) {
      certHeading.textContent = 'Coming soon';
      certRow.innerHTML = `<div class="cert-row">${[0, 1, 2].map(() => `<div class="cert-slot">Certification slot — add via Admin Panel</div>`).join('')}</div>`;
    } else {
      certHeading.textContent = 'Credentials';
      certRow.innerHTML = `<div class="cert-row">${certs.map(c => `
        <div class="cert-card"><h4>${escapeHtml(c.title)}</h4><div class="t-meta">${escapeHtml(c.issuer || '')}${c.issuer && c.date ? ' · ' : ''}${escapeHtml(c.date || '')}</div></div>`).join('')}</div>`;
    }

    /* ---------------- experience ---------------- */
    doc.getElementById('experienceTimeline').innerHTML = timelineHtml(content.experience);

    /* ---------------- resume CTA ---------------- */
    doc.getElementById('ctaTitle').textContent = content.cta.title;
    doc.getElementById('ctaText').textContent = content.cta.text;
    const ctaBtn = doc.getElementById('ctaBtn');
    ctaBtn.textContent = content.cta.buttonText || 'Download résumé';
    if (content.cta.resumeFileData) {
      ctaBtn.setAttribute('href', content.cta.resumeFileData);
      ctaBtn.setAttribute('download', content.cta.resumeFileName || 'resume.pdf');
    } else {
      ctaBtn.setAttribute('href', content.cta.resumeLink || '#');
      ctaBtn.removeAttribute('download');
    }

    /* ---------------- contact ---------------- */
    doc.getElementById('contactEmailValue').textContent = content.contact.email;
    doc.getElementById('contactEmailCard').setAttribute('href', `mailto:${content.contact.email}`);

    doc.getElementById('contactWhatsappValue').textContent = formatWhatsapp(content.contact.whatsapp);
    doc.getElementById('contactWhatsappCard').setAttribute('href', `https://wa.me/${String(content.contact.whatsapp || '').replace(/[^0-9]/g, '')}`);

    doc.getElementById('contactLinkedinValue').textContent = content.contact.linkedin.replace(/^https?:\/\//, '');
    doc.getElementById('contactLinkedinCard').setAttribute('href', content.contact.linkedin);

    doc.getElementById('contactGithubValue').textContent = content.contact.github.replace(/^https?:\/\//, '');
    doc.getElementById('contactGithubCard').setAttribute('href', content.contact.github);

    /* ---------------- footer ---------------- */
    const year = new Date().getFullYear();
    doc.getElementById('footerName').textContent = `© ${year} ${content.footer.name}`;
    doc.getElementById('footerRole').textContent = content.footer.role;
    doc.getElementById('footLinkedin').setAttribute('href', content.contact.linkedin);
    doc.getElementById('footGithub').setAttribute('href', content.contact.github);
    doc.getElementById('footEmail').setAttribute('href', `mailto:${content.contact.email}`);
    doc.getElementById('footerCopyright').textContent = 'Built as a living portfolio — sections update from the Admin Panel.';
  }

  // Applies a theme's CSS variables directly onto a given document's <html>
  // element (used for baking a theme into a published export where the
  // normal Store.applyTheme(), which only touches the live `document`,
  // wouldn't reach a separate parsed document).
  function applyThemeTo(doc, themeVars) {
    const root = doc.documentElement;
    Object.entries(themeVars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  global.SiteRenderer = {
    renderContent,
    applyThemeTo,
    escapeHtml,
    formatWhatsapp,
    shortUrl,
    projectThumbSVG
  };

})(window);
