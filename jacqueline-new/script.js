/* ============================================================
   JACQUELINE — 1970 Ford Mustang Fastback 428 Cobra Jet
   Interactions: Lightbox · Nav · Scroll Reveal · Back to Top
   ============================================================ */

(function () {
  'use strict';

  /* ---- Lightbox ----------------------------------------- */

  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');
  const lbCounter  = document.getElementById('lightbox-counter');

  let currentGroup  = [];
  let currentIndex  = 0;

  function openLightbox(items, index) {
    currentGroup = items;
    currentIndex = index;
    showImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showImage() {
    const item = currentGroup[currentIndex];
    lbImg.src  = item.dataset.src || item.querySelector('img').src;
    lbImg.alt  = item.querySelector('img').alt || '';
    lbCounter.textContent = (currentIndex + 1) + ' / ' + currentGroup.length;
    lbPrev.style.visibility = currentGroup.length > 1 ? 'visible' : 'hidden';
    lbNext.style.visibility = currentGroup.length > 1 ? 'visible' : 'hidden';
  }

  function prev() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    showImage();
  }

  function next() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    showImage();
  }

  // Bind photo items — group by data-group attribute
  document.querySelectorAll('.photo-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const group = item.dataset.group;
      const items = Array.from(
        document.querySelectorAll('.photo-item[data-group="' + group + '"]')
      );
      const index = items.indexOf(item);
      openLightbox(items, index);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Close on backdrop click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  /* ---- Navigation active state (IntersectionObserver) --- */

  const navLinks = Array.from(document.querySelectorAll('.nav-list a'));

  // Map href → nav link
  const linkMap = {};
  navLinks.forEach(function (a) {
    const id = a.getAttribute('href').replace('#', '');
    linkMap[id] = a;
  });

  const sections = Array.from(
    document.querySelectorAll('section[id], section.build-section[id]')
  ).filter(function (s) { return linkMap[s.id]; });

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove('active'); });
            const a = linkMap[entry.target.id];
            if (a) {
              a.classList.add('active');
              // Scroll the nav link into view (for mobile overflow)
              a.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---- Scroll reveal ------------------------------------ */

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- Back to top -------------------------------------- */

  const backTop = document.getElementById('back-top');

  window.addEventListener('scroll', function () {
    backTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
