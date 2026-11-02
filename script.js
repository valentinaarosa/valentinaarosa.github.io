/* Valentina Arosa — CV site behaviour
   1. Image placeholders   2. Scroll reveal   3. Active section in the menu
   4. Work accordions      5. Mobile menu */
(function () {
  document.documentElement.classList.add('js');

  /* 1. Placeholders: if an image file is missing, show the hint box instead */
  document.querySelectorAll('.shot img').forEach(function (img) {
    var fig = img.closest('.shot');
    function missing() { fig.classList.add('is-missing'); }
    function found() { fig.classList.remove('is-missing'); }
    img.addEventListener('error', missing);
    img.addEventListener('load', found);
    if (img.complete) { img.naturalWidth === 0 ? missing() : found(); }
    // lazy images inside closed panels: mark as missing until they actually load
    if (!img.complete || img.naturalWidth === 0) missing();
  });

  /* 2. Soft reveal while scrolling */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  // small stagger for items that sit next to each other
  document.querySelectorAll('.skills, .langs').forEach(function (group) {
    group.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.setProperty('--delay', (i * 0.08) + 's');
    });
  });
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* 3. Highlight the current section in the side menu */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function setActive() {
    var y = window.innerHeight * 0.35;
    var current = 0;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= y) current = i; });
    // at the very bottom of the page, the last section is the active one
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections.length - 1;
    links.forEach(function (a, i) {
      a.classList.toggle('is-active', i === current);
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  /* 4. Work accordions */
  document.querySelectorAll('.work__toggle').forEach(function (btn) {
    var work = btn.closest('.work');
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    var label = btn.querySelector('.work__toggle-label');
    panel.inert = true;
    btn.addEventListener('click', function () {
      var open = !work.classList.contains('is-open');
      work.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close the case study' : 'Read the case study';
      panel.inert = !open;
      if (open) {
        // start loading the panel images right away
        panel.querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
      }
    });
  });

  /* 5. Mobile menu */
  var sidebar = document.getElementById('sidebar');
  var menuBtn = document.querySelector('.menu-btn');
  function closeMenu() { sidebar.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    var open = !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  links.forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
