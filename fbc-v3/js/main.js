/* Full Bloom Counseling v6 */
(function(){'use strict';

/* ── Transparent nav on scroll ── */
var hdr = document.getElementById('header');
function updateNav() {
  if (!hdr) return;
  if (window.scrollY > 20) {
    hdr.classList.add('scrolled');
    document.body.classList.add('header-scrolled');
  } else {
    hdr.classList.remove('scrolled');
    document.body.classList.remove('header-scrolled');
  }
}
if (hdr) {
  window.addEventListener('scroll', updateNav, {passive: true});
  updateNav();
}

/* ── Mobile menu ── */
var btn = document.getElementById('hamburger');
var menu = document.getElementById('mobile-menu');

function openMenu() {
  if (!menu) return;
  menu.style.cssText = 'display:flex!important;transform:translateX(100%)';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      menu.style.cssText = '';
      menu.classList.add('open');
      var spans = document.querySelectorAll('#hamburger span');
      if (spans.length === 3) {
        spans[0].style.transform = 'rotate(45deg) translate(4px,4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px,-4px)';
      }
    });
  });
  document.body.style.overflow = 'hidden';
  document.body.classList.add('menu-open');
  if (btn) { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
  menu.setAttribute('aria-hidden','false');
}

function closeMenu() {
  if (!menu) return;
  menu.classList.remove('open');
  // Reset hamburger from X
  var spans = document.querySelectorAll('#hamburger span');
  if (spans.length === 3) {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  menu.setAttribute('aria-hidden','true');
  // Hide after transition completes
  setTimeout(function() {
    if (!menu.classList.contains('open')) {
      menu.style.display = '';
    }
  }, 320);
  updateNav();
}

if (btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    menu && menu.classList.contains('open') ? closeMenu() : openMenu();
  });
}
var closeBtn = document.getElementById('mobile-close');
if (closeBtn) { closeBtn.addEventListener('click', closeMenu); }
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeMenu(); closeSearch(); } });
if (menu) {
  menu.querySelectorAll('a[href]').forEach(function(a) { 
    a.addEventListener('click', function() {
      setTimeout(closeMenu, 50);
    });
  });
}

/* Mobile submenus */
document.querySelectorAll('.mobile-toggle-sub').forEach(function(t) {
  t.addEventListener('click', function() {
    var s = t.nextElementSibling;
    if (!s) return;
    var o = s.classList.contains('open');
    s.classList.toggle('open', !o);
    t.setAttribute('aria-expanded', o ? 'false' : 'true');
  });
});

/* ── Search overlay ── */
var searchOverlay = document.getElementById('search-overlay');
var searchInput = document.getElementById('search-input');

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  if (searchInput) setTimeout(function(){ searchInput.focus(); }, 50);
}
function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  if (searchInput) searchInput.value = '';
  var results = document.getElementById('search-results');
  if (results) results.innerHTML = '';
}

document.querySelectorAll('.nav-search, .nav-search-mobile').forEach(function(el) {
  el.addEventListener('click', function(e) { e.preventDefault(); openSearch(); });
});

var searchBtn = document.getElementById('search-submit');
if (searchBtn) searchBtn.addEventListener('click', doSearch);
if (searchInput) {
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') closeSearch();
  });
}

var searchCloseBtn = document.getElementById('search-close-btn');
if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
if (searchOverlay) {
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) closeSearch();
  });
}

/* Search index — embedded page data */
var PAGES = [
  {url:'/',title:'Therapists in Denver & Online | Full Bloom Counseling',desc:'Compassionate therapy for anxiety, trauma, relationships, disordered eating. Free consultations.',cat:'Home'},
  {url:'/about/',title:'About Our Denver Therapists',desc:'Eight licensed therapists specializing in trauma, anxiety, Enneagram, couples therapy, and more.',cat:'About'},
  {url:'/team/rebecca-moravec/',title:'Rebecca Moravec, LPC LMFT — Founder',desc:'Trauma-informed care, Enneagram, couples therapy, Intuitive Eating, women\'s issues.',cat:'Therapist'},
  {url:'/team/natalie-siegel/',title:'Natalie Siegel, LPC — Therapist',desc:'Body image, disordered eating, Intuitive Eating, anxiety, self-esteem.',cat:'Therapist'},
  {url:'/team/mark-whitney/',title:'Mark Whitney, LPC — Senior Clinician',desc:'Couples therapy, Enneagram, trauma, family systems.',cat:'Therapist'},
  {url:'/team/jillian-corpora/',title:'Jillian Corpora, LPC — Therapist',desc:'Anxiety, depression, grief, life transitions, Intuitive Eating.',cat:'Therapist'},
  {url:'/team/kirsten-adorno/',title:'Kirsten Adorno, LPC MFTC — Therapist',desc:'Attachment-based therapy, couples counseling, emotional bonds.',cat:'Therapist'},
  {url:'/team/kelsey-bennett/',title:'Kelsey Bennett, LPC — Therapist',desc:'Young adults, couples, emotional regulation, EMDR, SSP. Boulder office.',cat:'Therapist'},
  {url:'/team/kelli-ruhl/',title:'Kelli Ruhl, LPC — Therapist',desc:'Trauma therapy, addiction recovery, somatic interventions, Brainspotting.',cat:'Therapist'},
  {url:'/team/myldha-verdelus/',title:'Myldha Verdelus, LPCC — Therapist',desc:'Anxiety, depression, identity, couples, attachment-focused therapy.',cat:'Therapist'},
  {url:'/services/',title:'Therapy Services in Denver',desc:'Individual, couples, family, trauma, EMDR, Enneagram, Intuitive Eating, anxiety therapy.',cat:'Services'},
  {url:'/services/individual-therapy/',title:'Individual Therapy Denver',desc:'One-on-one therapy for anxiety, depression, trauma, relationships, life transitions. CBT, IFS, EMDR.',cat:'Service'},
  {url:'/services/couples-therapy/',title:'Couples Therapy Denver',desc:'Strengthen connection, communication, and navigate conflict. Gottman Method, EFT.',cat:'Service'},
  {url:'/services/family-therapy/',title:'Family Therapy Denver',desc:'Resolve conflict, improve communication, and build stronger family bonds.',cat:'Service'},
  {url:'/services/enneagram-therapy/',title:'Enneagram Therapy Denver',desc:'Use the Enneagram for deep self-discovery with certified practitioners.',cat:'Service'},
  {url:'/services/health-at-every-size/',title:'Intuitive Eating & HAES Therapy Denver',desc:'Heal your relationship with food and body. Weight-neutral, affirming care.',cat:'Service'},
  {url:'/services/trauma-therapy/',title:'Trauma Therapy Denver',desc:'EMDR, SSP, somatic therapy for PTSD, complex trauma, and attachment wounds.',cat:'Service'},
  {url:'/services/anxiety-therapy/',title:'Anxiety Therapy Denver',desc:'CBT, ACT, and mindfulness-based treatment for anxiety, panic, and perfectionism.',cat:'Service'},
  {url:'/services/emdr/',title:'EMDR Therapy Denver',desc:'Eye Movement Desensitization and Reprocessing for trauma and PTSD.',cat:'Service'},
  {url:'/services/disordered-eating/',title:'Disordered Eating & Body Image Therapy',desc:'Compassionate, weight-neutral support with Certified Intuitive Eating Counselors.',cat:'Service'},
  {url:'/services/safe-and-sound/',title:'Safe and Sound Protocol (SSP) Denver',desc:'Nervous system regulation for anxiety, trauma, and sensory processing.',cat:'Service'},
  {url:'/services/pre-marital/',title:'Pre-Marital Counseling Denver',desc:'Build a strong foundation for marriage with evidence-based premarital therapy.',cat:'Service'},
  {url:'/services/clinical-supervision/',title:'Clinical Supervision Denver',desc:'AAMFT-approved supervision for LPC and LMFT associate therapists in Colorado.',cat:'Service'},
  {url:'/blog/',title:'Mental Health Blog | Full Bloom Counseling',desc:'Insights on anxiety, trauma, Enneagram therapy, disordered eating, and mental health.',cat:'Blog'},
  {url:'/faqs/',title:'Therapy FAQs | Full Bloom Counseling Denver',desc:'Insurance, rates, sliding scale, first sessions, online therapy questions answered.',cat:'FAQ'},
  {url:'/contact/',title:'Contact Full Bloom Counseling Denver',desc:'Schedule a free 15-minute consultation. Call 720-767-9808 or email us.',cat:'Contact'},
  {url:'/press/',title:'Press & Media | Full Bloom Counseling',desc:'Rebecca Moravec featured in CNN, Bumble, Jewish Unpacked. Podcast: Two Therapists in Therapy.',cat:'Press'},
];

function doSearch() {
  if (!searchInput) return;
  var q = searchInput.value.toLowerCase().trim();
  var results = document.getElementById('search-results');
  if (!results) return;
  if (!q) { results.innerHTML = ''; return; }

  var hits = PAGES.filter(function(p) {
    return p.title.toLowerCase().includes(q) ||
           p.desc.toLowerCase().includes(q) ||
           p.cat.toLowerCase().includes(q) ||
           p.url.toLowerCase().includes(q);
  });

  if (hits.length === 0) {
    results.innerHTML = '<p class="search-no-results">No results found for \u201c' + q + '\u201d. Try a different search.</p>';
    return;
  }

  results.innerHTML = hits.map(function(p) {
    return '<a href="' + p.url + '" class="search-result-item">' +
      '<div class="search-result-cat">' + p.cat + '</div>' +
      '<h4>' + p.title + '</h4>' +
      '<p>' + p.desc + '</p>' +
      '</a>';
  }).join('');
}

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-question').forEach(function(q) {
  q.addEventListener('click', function() {
    var item = q.closest('.faq-item'), was = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(el) {
      el.classList.remove('open');
      el.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if (!was) { item.classList.add('open'); q.setAttribute('aria-expanded','true'); }
  });
});

/* ── Contact form ── */
var form = document.getElementById('contact-form'), suc = document.getElementById('form-success');
if (form && suc) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var b = form.querySelector('[type="submit"]');
    if (b) { b.disabled = true; b.textContent = 'Sending\u2026'; }
    fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}})
      .then(function(r) {
        if (r.ok) { form.hidden = true; suc.hidden = false; suc.focus(); }
        else { alert('Something went wrong. Please call 720-767-9808.'); }
      })
      .catch(function() { alert('Connection error. Please call 720-767-9808.'); })
      .finally(function() { if (b) { b.disabled = false; b.textContent = 'Send Message'; } });
  });
}

/* ── Active nav link ── */
var path = location.pathname;
document.querySelectorAll('.nav-link').forEach(function(a) {
  var href = a.getAttribute('href');
  if (!href) return;
  if (href === '/' && (path === '/' || path === '/index.html')) a.classList.add('active');
  else if (href !== '/' && path.indexOf(href) === 0) a.classList.add('active');
});

/* ── Fade-in on scroll ── */
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });

/* ── Mobile search modal ── */
(function() {
  var mSearchBtn = document.getElementById('mobile-search-btn');
  var mSearchInput = document.getElementById('mobile-search-input');
  if (!mSearchBtn || !mSearchInput) return;

  // Build dedicated mobile search modal
  var modal = document.createElement('div');
  modal.id = 'mobile-search-modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-label','Search');
  modal.setAttribute('aria-modal','true');
  modal.innerHTML =
    '<div class="msm-box">' +
      '<div class="msm-top">' +
        '<input type="search" id="msm-input" class="msm-input" placeholder="Search therapists, services, topics\u2026" autocomplete="off" aria-label="Search site">' +
        '<button class="msm-close" id="msm-close" aria-label="Close search">' +
          '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>' +
        '</button>' +
      '</div>' +
      '<button class="msm-submit" id="msm-submit">Search</button>' +
      '<div class="msm-results" id="msm-results" role="list" aria-live="polite"></div>' +
    '</div>';
  document.body.appendChild(modal);

  var msmInput = document.getElementById('msm-input');
  var msmResults = document.getElementById('msm-results');

  function openMobileSearch() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (msmInput) msmInput.focus(); }, 80);
    // Pre-fill with whatever's already typed in the bottom bar
    if (mSearchInput.value) { msmInput.value = mSearchInput.value; runMobileSearch(); }
  }
  function closeMobileSearch() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    msmResults.innerHTML = '';
    msmInput.value = '';
  }
  function runMobileSearch() {
    var q = msmInput.value.toLowerCase().trim();
    if (!q) { msmResults.innerHTML = ''; return; }
    var hits = PAGES.filter(function(p) {
      return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    });
    if (!hits.length) {
      msmResults.innerHTML = '<p class="msm-no-results">No results for \u201c' + q + '\u201d</p>';
      return;
    }
    msmResults.innerHTML = hits.map(function(p) {
      return '<a href="' + p.url + '" class="msm-result">' +
        '<span class="msm-cat">' + p.cat + '</span>' +
        '<strong>' + p.title + '</strong>' +
        '<span>' + p.desc + '</span></a>';
    }).join('');
  }

  mSearchBtn.addEventListener('click', openMobileSearch);
  document.getElementById('msm-close').addEventListener('click', closeMobileSearch);
  document.getElementById('msm-submit').addEventListener('click', runMobileSearch);
  msmInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') runMobileSearch();
    if (e.key === 'Escape') closeMobileSearch();
  });
  modal.addEventListener('click', function(e) { if (e.target === modal) closeMobileSearch(); });
})();

/* ══════════════════════════════════════════════
   KONAMI CODE EASTER EGG
   ↑ ↑ ↓ ↓ ← → ← → B A  (then Enter/Start)
   ══════════════════════════════════════════════ */
(function() {
  var CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;

  // Build the retro TV overlay
  var overlay = document.createElement('div');
  overlay.id = 'konami-overlay';
  overlay.innerHTML =
    '<div class="konami-tv">' +
      '<div class="konami-screen-bezel">' +
        '<div class="konami-screen">' +
          '<img src="/images/konami-contra.jpg" alt="Contra — Konami 1988" class="konami-img">' +
          '<div class="konami-scanlines"></div>' +
        '</div>' +
      '</div>' +
      '<div class="konami-tv-bottom">' +
        '<div class="konami-speaker"></div>' +
        '<div class="konami-tv-knobs"><span></span><span></span><span></span></div>' +
      '</div>' +
    '</div>' +
    
    '<p class="konami-hint">Press any key to continue&hellip;</p>';
  document.body.appendChild(overlay);

  function showKonami() {
    overlay.classList.add('active');
    // Auto-dismiss after 8 seconds
    setTimeout(hideKonami, 8000);
  }
  function hideKonami() {
    overlay.classList.remove('active');
    pos = 0;
  }

  document.addEventListener('keydown', function(e) {
    if (overlay.classList.contains('active')) { hideKonami(); return; }
    if (e.key === CODE[pos]) {
      pos++;
      if (pos === CODE.length) { showKonami(); pos = 0; }
    } else {
      pos = (e.key === CODE[0]) ? 1 : 0;
    }
  });

  overlay.addEventListener('click', hideKonami);
})();

})();
