/* =========================================================
   PUBLIC SITE BOOTSTRAP
   Wires up the interactive bits (nav toggle, scroll reveal)
   and calls the shared renderer (shared/render.js) to paint
   content from shared/store.js (localStorage). Also listens
   for changes made in the Admin Panel (in another tab) and
   updates live, instantly.
   ========================================================= */

(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver = null;

  window.initReveal = function initReveal(root = document) {
    const revealEls = root.querySelectorAll('.reveal:not(.reveal-bound)');
    revealEls.forEach((el) => el.classList.add('reveal-bound'));

    if (prefersReduced) {
      revealEls.forEach((el) => el.classList.add('in'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
    }
    revealEls.forEach((el) => revealObserver.observe(el));
  };

  document.addEventListener('DOMContentLoaded', () => {
    // A page exported via the Admin Panel's "Publish" feature has real
    // content baked directly into the HTML and is marked with
    // data-static="1". It must NOT be overwritten by a visitor's own
    // (empty) local storage.
    if (document.body.dataset.static === '1') {
      window.initReveal();
      return;
    }
    if (typeof Store !== 'undefined' && typeof SiteRenderer !== 'undefined') {
      Store.applyTheme(Store.getTheme());
      SiteRenderer.renderContent(Store.getContent(), document);
    }
    window.initReveal();
  });

  // ---------- Live sync from the Admin Panel (other tab) ----------
  window.addEventListener('storage', (e) => {
    if (document.body.dataset.static === '1') return;
    if (typeof Store === 'undefined') return;
    if (e.key === Store.KEYS.content) {
      SiteRenderer.renderContent(Store.getContent(), document);
      window.initReveal();
    }
    if (e.key === Store.KEYS.theme) {
      Store.applyTheme(Store.getTheme());
    }
  });
})();
