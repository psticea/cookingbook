(function () {
  'use strict';

  var C = window.COOKBOOK;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* Copy that has no key in COOKBOOK.ui */
  var X = {
    ro: {
      search: 'Caută', searchFallback: 'Caută rețete…', clearSearch: 'Șterge căutarea', openSearch: 'Deschide căutarea',
      openMenu: 'Deschide meniul', skip: 'Sari la rețete', jump: 'Sari la categorie', here: 'Ești aici',
      remove: 'Elimină filtrul', sortBy: 'Sortează după', activeFilters: 'Filtre active',
      show: function (n) { return n === 0 ? 'Nicio rețetă' : 'Vezi ' + count('ro', n); },
      scrollTop: 'Înapoi sus', flatCats: 'Categorii', serving: 'porție'
    },
    en: {
      search: 'Search', searchFallback: 'Search recipes…', clearSearch: 'Clear search', openSearch: 'Open search',
      openMenu: 'Open menu', skip: 'Skip to recipes', jump: 'Jump to category', here: 'You are here',
      remove: 'Remove filter', sortBy: 'Sort by', activeFilters: 'Active filters',
      show: function (n) { return n === 0 ? 'No recipes' : 'Show ' + count('en', n); },
      scrollTop: 'Back to top', flatCats: 'Categories', serving: 'serving'
    }
  };

  function count(lang, n) {
    if (lang === 'en') return n + (n === 1 ? ' recipe' : ' recipes');
    if (n === 1) return '1 rețetă';
    var r = n % 100;
    return n + (n === 0 || (r >= 1 && r <= 19) ? ' rețete' : ' de rețete');
  }

  var prefs = { lang: root.lang === 'en' ? 'en' : 'ro', theme: root.dataset.theme, text: root.dataset.text };
  var state = {
    q: '',
    kw: new Set(),
    sort: 'name',
    dir: 'asc',
    grouped: true,
    active: C.categories[0].id
  };

  function t(key) { return (C.ui[prefs.lang] && C.ui[prefs.lang][key]) || (C.ui.en[key]) || key; }
  function x(key) { return X[prefs.lang][key]; }
  function nameOf(cat) { return cat.name[prefs.lang]; }
  function titleOf(r) { return r.title[prefs.lang]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function img(path) { return C.imageBase + path; }

  var catById = {};
  C.categories.forEach(function (c) { catById[c.id] = c; });
  var coverFor = {};
  C.recipes.forEach(function (r) { if (!coverFor[r.category]) coverFor[r.category] = r; });

  var ICON = {
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    out: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9.5 8H16v6.5"/></svg>'
  };

  /* ---------------- Data pipeline ---------------- */
  function filtered() {
    var q = state.q.trim().toLocaleLowerCase(prefs.lang);
    var kws = Array.from(state.kw);
    return C.recipes.filter(function (r) {
      if (kws.length && !kws.every(function (k) { return r.keywords.indexOf(k) !== -1; })) return false;
      if (q.length >= 2 && titleOf(r).toLocaleLowerCase(prefs.lang).indexOf(q) === -1) return false;
      return true;
    });
  }
  function sorted(list) {
    var s = state.dir === 'asc' ? 1 : -1;
    var coll = new Intl.Collator(prefs.lang === 'ro' ? 'ro' : 'en', { sensitivity: 'base' });
    return list.slice().sort(function (a, b) {
      if (state.sort === 'time') return (a.prepTime - b.prepTime) * s || coll.compare(titleOf(a), titleOf(b));
      if (state.sort === 'price') {
        var pa = a.pricePerServing, pb = b.pricePerServing;
        if (pa == null && pb == null) return coll.compare(titleOf(a), titleOf(b));
        if (pa == null) return 1;
        if (pb == null) return -1;
        return (pa - pb) * s || coll.compare(titleOf(a), titleOf(b));
      }
      return coll.compare(titleOf(a), titleOf(b)) * s;
    });
  }
  function countsByCat(list) {
    var m = {};
    C.categories.forEach(function (c) { m[c.id] = 0; });
    list.forEach(function (r) { m[r.category]++; });
    return m;
  }

  /* ---------------- Formatting ---------------- */
  function money(v) {
    return new Intl.NumberFormat(prefs.lang === 'ro' ? 'ro-RO' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
  }
  function priceHTML(r) {
    var perServ = ' / ' + x('serving');
    if (r.pricePerServing == null || r.priceStatus === 'unavailable') {
      return '<span class="meta-price na" aria-label="' + esc(t('costUnavailable')) + '" title="' + esc(t('costUnavailable')) + '">—</span>';
    }
    var v = money(r.pricePerServing);
    var partial = r.priceStatus === 'partial';
    var label = t('estimatedCost') + ': ' + v + ' lei' + perServ + (partial ? ', ' + t('partialEstimate').toLocaleLowerCase(prefs.lang) : '');
    return '<span class="meta-price" aria-label="' + esc(label) + '"' + (partial ? ' title="' + esc(t('partialEstimate')) + '"' : '') + '>' +
      (partial ? '<span class="approx" aria-hidden="true">≈</span>' : '') +
      '<span aria-hidden="true">' + v + ' <span class="unit">lei</span></span></span>';
  }
  function cardHTML(r, showDot) {
    var cat = catById[r.category];
    return '<li><a class="card" href="' + esc(C.recipeHref(r.id)) + '" data-cat="' + r.category + '" style="view-transition-name: r-' + r.id + '">' +
      '<span class="card-photo">' +
        '<img src="' + esc(img(r.thumb)) + '" data-full="' + esc(img(r.image)) + '" alt="" loading="lazy" decoding="async" width="600" height="400">' +
        (showDot ? '<span class="card-dot" title="' + esc(nameOf(cat)) + '"></span>' : '') +
      '</span>' +
      '<span class="card-body">' +
        '<span class="card-title">' + esc(titleOf(r)) + '</span>' +
        (showDot ? '<span class="sr-only">, ' + esc(nameOf(cat)) + '</span>' : '') +
        '<span class="card-meta">' +
          '<span class="meta-time" aria-label="' + esc(t('prepTime') + ': ' + r.prepTime + ' ' + t('minutes')) + '">' + ICON.clock + '<span aria-hidden="true">' + r.prepTime + ' min</span></span>' +
          priceHTML(r) +
        '</span>' +
      '</span>' +
    '</a></li>';
  }

  /* ---------------- Rendering ---------------- */
  var lastCounts = {};

  function renderResults() {
    var list = filtered();
    var counts = countsByCat(list);
    lastCounts = counts;
    var res = $('results');
    var html = '';

    if (!list.length) {
      html = '<section class="empty" aria-labelledby="emptyTitle">' + emptyArt() +
        '<h2 id="emptyTitle">' + esc(t('pantryEmpty')) + '</h2>' +
        '<p>' + esc(t('pantryEmptyMessage')) + '</p>' +
        '<button type="button" class="solid-btn" data-action="clear-all">' + esc(t('clearFilters')) + '</button></section>';
    } else if (state.grouped) {
      C.categories.forEach(function (cat) {
        var items = sorted(list.filter(function (r) { return r.category === cat.id; }));
        if (!items.length) return;
        html += '<section class="tile" id="category-' + cat.id + '" data-cat="' + cat.id + '" aria-labelledby="h-' + cat.id + '">' +
          '<div class="tile-head"><h2 class="tile-title" id="h-' + cat.id + '">' + esc(nameOf(cat)) + '</h2>' +
          '<span class="tile-count"><span aria-hidden="true">' + items.length + '</span><span class="sr-only">' + esc(count(prefs.lang, items.length)) + '</span></span></div>' +
          '<ul class="grid" data-sort="' + state.sort + '">' + items.map(function (r) { return cardHTML(r, false); }).join('') + '</ul></section>';
      });
    } else {
      html = '<section class="tile flat" aria-label="' + esc(t('recipes')) + '"><ul class="grid" data-sort="' + state.sort + '">' +
        sorted(list).map(function (r) { return cardHTML(r, true); }).join('') + '</ul></section>';
    }
    res.innerHTML = html;
    res.querySelectorAll('.card-photo img').forEach(wireImage);

    $('count').textContent = count(prefs.lang, list.length);
    updateNavCounts(counts);
    renderActiveFilters();
    $('drawerDone').textContent = x('show')(list.length);
    $('drawerClear').disabled = state.kw.size === 0;
    requestAnimationFrame(spy);
  }

  function wireImage(im) {
    im.setAttribute('data-loading', '');
    var done = function () { im.removeAttribute('data-loading'); };
    if (im.complete && im.naturalWidth) done();
    im.addEventListener('load', done);
    im.addEventListener('error', function onErr() {
      im.removeEventListener('error', onErr);
      if (im.dataset.full && im.src.indexOf(im.dataset.full) === -1) im.src = im.dataset.full;
      else done();
    });
  }

  function emptyArt() {
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<rect x="30" y="16" width="60" height="16" rx="8" fill="oklch(0.57 0.19 32)"/>' +
      '<rect x="34" y="30" width="52" height="6" rx="3" fill="oklch(0.50 0.15 262)"/>' +
      '<path d="M36 36h48a10 10 0 0 1 10 10v48a14 14 0 0 1-14 14H40a14 14 0 0 1-14-14V46a10 10 0 0 1 10-10z" fill="none" stroke="currentColor" stroke-width="4"/>' +
      '<rect x="38" y="58" width="44" height="22" rx="6" fill="oklch(0.82 0.15 82)"/>' +
      '<path d="M48 69h24" stroke="#18202e" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  function navItems(kind) {
    return C.categories.map(function (cat) {
      var cover = coverFor[cat.id];
      return { cat: cat, cover: cover };
    });
  }

  function renderNav() {
    // Shelf (mobile/tablet)
    $('shelf').setAttribute('aria-label', x('jump'));
    $('shelf').innerHTML = '<ul class="shelf-list">' + navItems().map(function (o) {
      return '<li><a class="lid" href="#category-' + o.cat.id + '" data-cat="' + o.cat.id + '" data-jump="' + o.cat.id + '">' +
        '<span class="lid-ring"><img src="' + esc(img(o.cover.thumb)) + '" data-full="' + esc(img(o.cover.image)) + '" alt="" width="96" height="96" decoding="async"><span class="lid-count" aria-hidden="true"></span></span>' +
        '<span class="lid-name">' + esc(nameOf(o.cat)) + '</span><span class="sr-only lid-sr"></span></a></li>';
    }).join('') + '</ul>';

    // Rail (desktop)
    $('railNav').setAttribute('aria-label', x('jump'));
    $('railNav').innerHTML = '<p class="rail-title">' + esc(t('categories')) + '</p><ul class="rail-list">' + navItems().map(function (o) {
      return '<li><button type="button" class="rail-item" data-cat="' + o.cat.id + '" data-jump="' + o.cat.id + '">' +
        '<span class="rl"><img src="' + esc(img(o.cover.thumb)) + '" data-full="' + esc(img(o.cover.image)) + '" alt="" width="88" height="88" loading="lazy" decoding="async"></span>' +
        '<span class="nm">' + esc(nameOf(o.cat)) + '</span><span class="n"></span></button></li>';
    }).join('') + '</ul>';

    // Colour index (mobile/tablet)
    $('indexTitle').textContent = x('jump');
    $('indexGrid').innerHTML = C.categories.map(function (cat) {
      return '<li><button type="button" class="index-tile" data-cat="' + cat.id + '" data-jump="' + cat.id + '"><span>' + esc(nameOf(cat)) + '</span><span class="n"></span></button></li>';
    }).join('');
    $('indexDots').innerHTML = C.categories.map(function (cat) { return '<i data-cat="' + cat.id + '"></i>'; }).join('');

    document.querySelectorAll('.lid img, .rail-item img').forEach(function (im) {
      im.addEventListener('error', function onErr() { im.removeEventListener('error', onErr); im.src = im.dataset.full; });
    });
  }

  function updateNavCounts(counts) {
    document.querySelectorAll('.lid').forEach(function (el) {
      var n = counts[el.dataset.cat];
      el.querySelector('.lid-count').textContent = n;
      el.querySelector('.lid-sr').textContent = ', ' + count(prefs.lang, n);
      if (n === 0) { el.setAttribute('aria-disabled', 'true'); el.tabIndex = -1; }
      else { el.removeAttribute('aria-disabled'); el.removeAttribute('tabindex'); }
    });
    document.querySelectorAll('.rail-item, .index-tile, .d-cat').forEach(function (el) {
      var n = counts[el.dataset.cat];
      var nEl = el.querySelector('.n, .sw');
      if (nEl) nEl.textContent = n;
      el.disabled = n === 0;
      el.setAttribute('aria-label', nameOf(catById[el.dataset.cat]) + ', ' + count(prefs.lang, n));
    });
    $('rail').dataset.flat = String(!state.grouped);
  }

  function renderActiveFilters() {
    var box = $('activeFilters');
    var n = state.kw.size;
    var hasQ = state.q.trim().length >= 2;
    $('filterBadge').hidden = n === 0;
    $('filterBadge').textContent = n;
    $('filterBtn').dataset.active = String(n > 0);
    $('filterBtn').setAttribute('aria-label', t('filters') + (n ? ', ' + n + ' ' + x('activeFilters').toLocaleLowerCase(prefs.lang) : ''));
    $('menuDot').hidden = n === 0;
    if (!n && !hasQ) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    var chips = '';
    if (hasQ) {
      var qq = prefs.lang === 'ro' ? '„' + state.q.trim() + '”' : '“' + state.q.trim() + '”';
      chips += '<button type="button" class="chip-remove" data-remove-q aria-label="' + esc(x('clearSearch') + ': ' + state.q.trim()) + '">' + esc(qq) + ICON.x + '</button>';
    }
    state.kw.forEach(function (id) {
      var k = C.filterKeywords.find(function (f) { return f.id === id; });
      if (!k) return;
      chips += '<button type="button" class="chip-remove" data-remove-kw="' + id + '" aria-label="' + esc(x('remove') + ': ' + k.label[prefs.lang]) + '">' + esc(k.label[prefs.lang]) + ICON.x + '</button>';
    });
    chips += '<button type="button" class="text-btn" data-action="clear-all">' + esc(t('clearFilters')) + '</button>';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', x('activeFilters'));
    box.innerHTML = chips;
  }

  function renderDrawer() {
    var groups = [['meatType', 12], ['cookType', 12], ['ingredient', 12]];
    var html = '<section class="d-section" aria-labelledby="dFilters"><div class="d-title-row"><h3 class="d-title" id="dFilters">' + esc(t('filters')) + '</h3>' +
      '<button type="button" class="text-btn" id="drawerClear">' + esc(t('clearAllFilters')) + '</button></div>';
    groups.forEach(function (g) {
      var kws = C.filterKeywords.filter(function (k) { return k.type === g[0]; }).slice(0, g[1]);
      html += '<p class="d-sub" id="dg-' + g[0] + '">' + esc(t(g[0])) + '</p><div class="chips" role="group" aria-labelledby="dg-' + g[0] + '">' +
        kws.map(function (k) {
          return '<button type="button" class="chip" data-kw="' + k.id + '" aria-pressed="' + state.kw.has(k.id) + '">' + ICON.check + '<span>' + esc(k.label[prefs.lang]) + '</span></button>';
        }).join('') + '</div>';
    });
    html += '</section>';

    html += '<section class="d-section" aria-labelledby="dCats"><h3 class="d-title" id="dCats">' + esc(t('categories')) + '</h3><ul class="d-cats">' +
      C.categories.map(function (cat) {
        return '<li><button type="button" class="d-cat" data-cat="' + cat.id + '" data-jump="' + cat.id + '"><span class="sw" aria-hidden="true"></span><span class="nm">' + esc(nameOf(cat)) + '</span>' + ICON.chev + '</button></li>';
      }).join('') + '</ul></section>';

    html += '<section class="d-section" aria-labelledby="dMore"><h3 class="d-title" id="dMore">' + esc(t('more')) + '</h3><ul class="d-links">' +
      C.menuLinks.map(function (l) { return '<li><a href="' + esc(l.href) + '"><span>' + esc(t(l.id)) + '</span>' + ICON.out + '</a></li>'; }).join('') + '</ul></section>';

    function seg(key, label, opts) {
      return '<div class="pref"><span class="pref-label" id="pl-' + key + '">' + esc(label) + '</span><div class="seg" role="radiogroup" aria-labelledby="pl-' + key + '">' +
        opts.map(function (o) {
          var on = prefs[key] === o[0];
          return '<button type="button" role="radio" data-pref="' + key + '" data-val="' + o[0] + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '"' + (o[2] ? ' lang="' + o[2] + '"' : '') + '>' + esc(o[1]) + '</button>';
        }).join('') + '</div></div>';
    }
    html += '<section class="d-section" aria-labelledby="dPrefs"><h3 class="d-title" id="dPrefs">' + esc(t('preferences')) + '</h3>' +
      seg('lang', t('language'), [['ro', 'Română', 'ro'], ['en', 'English', 'en']]) +
      seg('theme', t('theme'), [['light', t('light')], ['dark', t('dark')]]) +
      seg('text', t('textSize'), [['normal', t('normal')], ['large', t('large')]]) +
      '</section>';

    $('drawerBody').innerHTML = html;
  }

  function renderStatic() {
    root.lang = prefs.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n;
      el.textContent = X[prefs.lang][k] && typeof X[prefs.lang][k] === 'string' ? X[prefs.lang][k] : t(k);
    });
    $('greeting').textContent = t('greetingTitle');
    $('greetingSub').textContent = t('greetingSubtitle');
    $('footerSub').textContent = t('greetingSubtitle');
    var ph = t('searchPlaceholder');
    if (ph.indexOf('?') !== -1) ph = x('searchFallback');
    $('q').placeholder = ph;
    $('searchClear').setAttribute('aria-label', x('clearSearch'));
    $('searchReveal').setAttribute('aria-label', x('openSearch'));
    $('menuBtn').setAttribute('aria-label', x('openMenu'));
    $('drawerClose').setAttribute('aria-label', t('close'));
    $('sortGroup').setAttribute('aria-label', x('sortBy'));
    $('brand').setAttribute('aria-label', "Paul's Cookbook, " + x('scrollTop').toLocaleLowerCase(prefs.lang));
    $('footerLinks').innerHTML = C.menuLinks.map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(t(l.id)) + '</a>'; }).join('');
    $('footerLinks').setAttribute('aria-label', t('more'));
    updateSortUI();
    $('groupBtn').setAttribute('aria-pressed', String(state.grouped));
    $('groupBtn').title = t('groupByCategories');
  }

  function updateSortUI() {
    var labels = { name: 'sortByName', time: 'sortByPrepTime', price: 'sortByPrice' };
    document.querySelectorAll('.sort-btn').forEach(function (b) {
      var on = b.dataset.sort === state.sort;
      b.setAttribute('aria-pressed', String(on));
      b.dataset.dir = on ? state.dir : '';
      b.setAttribute('aria-label', t(labels[b.dataset.sort]) + (on ? ', ' + t(state.dir === 'asc' ? 'ascending' : 'descending') : ''));
    });
  }

  /* Wrap a DOM update in a view transition when motion is welcome */
  function transition(fn) {
    if (!document.startViewTransition || reduceMotion.matches || document.hidden) { fn(); return; }
    document.startViewTransition(fn);
  }

  /* ---------------- Scroll: header compaction + scroll-spy ---------------- */
  var header = $('siteHeader');
  var index = $('index');
  function spy() {
    var y = window.scrollY;
    var mobile = innerWidth < 768;
    if (mobile) {
      if (y > 90 && !header.classList.contains('compact')) header.classList.add('compact');
      else if (y < 40 && header.classList.contains('compact')) { header.classList.remove('compact'); header.classList.remove('search-open'); }
    }

    var tiles = document.querySelectorAll('.tile[data-cat]');
    var hh = header.getBoundingClientRect().height;
    var current = null;
    var line = hh + Math.min(innerHeight * 0.3, 260);
    tiles.forEach(function (tl) { if (tl.getBoundingClientRect().top <= line) current = tl.dataset.cat; });
    var first = tiles[0];
    var pastIntro = first && first.getBoundingClientRect().top <= hh + 120;
    if (!current && first) current = first.dataset.cat;

    var inView = state.grouped && tiles.length > 0;
    var rimOn = inView && pastIntro;
    root.style.setProperty('--rim', rimOn ? '1' : '0');
    if (current) setActive(current);

    var shelf = $('shelf').getBoundingClientRect();
    var showIndex = inView && shelf.bottom < hh && !document.body.classList.contains('locked');
    var nearEnd = document.querySelector('.site-footer').getBoundingClientRect().top < innerHeight - 24;
    if (!showIndex || nearEnd) closeIndex();
    index.dataset.state = showIndex && !nearEnd ? 'shown' : 'hidden';
  }

  function setActive(id) {
    if (state.active === id && root.dataset.active === id) return;
    state.active = id;
    root.dataset.active = id;
    var probe = document.querySelector('.index-tile[data-cat="' + id + '"]');
    if (probe) {
      var cs = getComputedStyle(probe);
      root.style.setProperty('--active-g', cs.backgroundColor);
      root.style.setProperty('--active-on', cs.color);
    }
    $('indexName').textContent = nameOf(catById[id]);
    $('indexPill').setAttribute('aria-label', x('jump') + ' — ' + x('here') + ': ' + nameOf(catById[id]));
    document.querySelectorAll('.index-dots i').forEach(function (d) { d.toggleAttribute('data-on', d.dataset.cat === id); });
    document.querySelectorAll('.rail-item, .index-tile').forEach(function (b) {
      if (b.dataset.cat === id) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; spy(); });
  }, { passive: true });
  addEventListener('resize', function () {
    if (innerWidth >= 768) header.classList.remove('compact', 'search-open');
    spy();
  });

  function jumpTo(id) {
    var go = function () {
      var el = $('category-' + id);
      if (!el) return;
      header.classList.add('compact');
      header.classList.remove('search-open');
      el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      setActive(id);
    };
    if (!state.grouped) {
      state.grouped = true;
      $('groupBtn').setAttribute('aria-pressed', 'true');
      renderResults();
      requestAnimationFrame(go);
    } else go();
  }

  /* ---------------- Colour index ---------------- */
  function openIndex() {
    $('indexPanel').hidden = false;
    $('indexPill').setAttribute('aria-expanded', 'true');
    var cur = document.querySelector('.index-tile[aria-current="true"]') || document.querySelector('.index-tile:not(:disabled)');
    if (cur) cur.focus({ preventScroll: true });
  }
  function closeIndex(returnFocus) {
    if ($('indexPanel').hidden) return;
    $('indexPanel').hidden = true;
    $('indexPill').setAttribute('aria-expanded', 'false');
    if (returnFocus) $('indexPill').focus({ preventScroll: true });
  }
  $('indexPill').addEventListener('click', function () {
    if ($('indexPanel').hidden) openIndex(); else closeIndex(true);
  });
  document.addEventListener('click', function (e) {
    if (!$('indexPanel').hidden && !index.contains(e.target)) closeIndex();
  });

  /* ---------------- Drawer ---------------- */
  var drawerRoot = $('drawerRoot'), drawer = $('drawer'), lastFocus = null, closeTimer = null;
  function openDrawer(focusFilters) {
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    closeIndex();
    var sw = innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = sw ? sw + 'px' : '';
    header.style.paddingRight = sw ? sw + 'px' : '';
    document.body.classList.add('locked');
    drawerRoot.hidden = false;
    $('menuBtn').setAttribute('aria-expanded', 'true');
    index.dataset.state = 'hidden';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { drawerRoot.classList.add('open'); });
    });
    $('drawerBody').scrollTop = 0;
    var target = focusFilters ? drawer.querySelector('.chip') : $('drawerClose');
    setTimeout(function () { (target || drawer).focus({ preventScroll: true }); }, 60);
  }
  function closeDrawer(restore) {
    if (drawerRoot.hidden) return;
    drawerRoot.classList.remove('open');
    $('menuBtn').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('locked');
    document.body.style.paddingRight = '';
    header.style.paddingRight = '';
    closeTimer = setTimeout(function () { drawerRoot.hidden = true; }, reduceMotion.matches ? 0 : 450);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    spy();
  }
  $('menuBtn').addEventListener('click', function () { openDrawer(false); });
  $('filterBtn').addEventListener('click', function () { openDrawer(true); });
  $('drawerClose').addEventListener('click', function () { closeDrawer(); });
  $('backdrop').addEventListener('click', function () { closeDrawer(); });
  $('drawerDone').addEventListener('click', function () {
    closeDrawer(false);
    var top = $('toolbar').getBoundingClientRect().top + scrollY - header.getBoundingClientRect().height - 8;
    if (scrollY > top) scrollTo({ top: top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    $('results').focus({ preventScroll: true });
  });


  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!drawerRoot.hidden) { e.preventDefault(); closeDrawer(); return; }
      if (!$('indexPanel').hidden) { closeIndex(true); return; }
    }
    if (e.key === 'Tab' && !drawerRoot.hidden) {
      var f = Array.prototype.filter.call(drawer.querySelectorAll('button:not(:disabled), a[href], input, [tabindex]:not([tabindex="-1"])'), function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === drawer)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  drawer.addEventListener('click', function (e) {
    if (e.target.closest('#drawerClear')) {
      state.kw.clear();
      drawer.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      renderResults();
      var first = drawer.querySelector('.chip');
      if (first) first.focus({ preventScroll: true });
      return;
    }
    var chip = e.target.closest('.chip');
    if (chip) {
      var id = chip.dataset.kw;
      if (state.kw.has(id)) state.kw.delete(id); else state.kw.add(id);
      chip.setAttribute('aria-pressed', String(state.kw.has(id)));
      renderResults();
      return;
    }
    var cat = e.target.closest('.d-cat');
    if (cat && !cat.disabled) {
      closeDrawer(false);
      setTimeout(function () { jumpTo(cat.dataset.jump); }, 30);
      return;
    }
    var pref = e.target.closest('[data-pref]');
    if (pref) setPref(pref.dataset.pref, pref.dataset.val, true);
  });
  drawer.addEventListener('keydown', function (e) {
    var r = e.target.closest('[role="radio"]');
    if (!r || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
    e.preventDefault();
    var sibs = Array.from(r.parentNode.children);
    var i = sibs.indexOf(r) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
    var nx = sibs[(i + sibs.length) % sibs.length];
    setPref(nx.dataset.pref, nx.dataset.val, true);
  });

  function setPref(key, val, keepFocus) {
    if (prefs[key] === val) return;
    prefs[key] = val;
    try { localStorage.setItem('enamel-prefs', JSON.stringify(prefs)); } catch (e) {}
    if (key === 'theme') {
      root.dataset.theme = val;
      document.querySelector('meta[name="theme-color"]').content = val === 'dark' ? '#0f131b' : '#eceeea';
      root.dataset.active = '';
      setActive(state.active);
    }
    if (key === 'text') root.dataset.text = val;
    var body = $('drawerBody'), st = body.scrollTop;
    if (key === 'lang') { renderStatic(); renderNav(); }
    renderDrawer();
    renderResults();
    root.dataset.active = '';
    setActive(state.active);
    body.scrollTop = st;
    if (keepFocus) {
      var b = drawer.querySelector('[data-pref="' + key + '"][data-val="' + val + '"]');
      if (b) b.focus({ preventScroll: true });
    }
  }

  /* ---------------- Controls ---------------- */
  document.addEventListener('click', function (e) {
    var j = e.target.closest('[data-jump]');
    if (j && !drawer.contains(j)) {
      e.preventDefault();
      if (j.disabled || j.getAttribute('aria-disabled') === 'true') return;
      closeIndex();
      jumpTo(j.dataset.jump);
      return;
    }
    if (e.target.closest('[data-action="clear-all"]')) {
      state.kw.clear(); state.q = ''; $('q').value = ''; $('searchClear').hidden = true;
      drawer.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      transition(renderResults);
      $('results').focus({ preventScroll: true });
      return;
    }
    var rk = e.target.closest('[data-remove-kw]');
    if (rk) {
      state.kw.delete(rk.dataset.removeKw);
      var c = drawer.querySelector('.chip[data-kw="' + rk.dataset.removeKw + '"]');
      if (c) c.setAttribute('aria-pressed', 'false');
      transition(renderResults);
      $('filterBtn').focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-remove-q]')) {
      state.q = ''; $('q').value = ''; $('searchClear').hidden = true;
      transition(renderResults);
      $('q').focus({ preventScroll: true });
    }
  });

  document.querySelectorAll('.sort-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (state.sort === b.dataset.sort) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      else { state.sort = b.dataset.sort; state.dir = 'asc'; }
      updateSortUI();
      transition(renderResults);
    });
  });

  $('groupBtn').addEventListener('click', function () {
    state.grouped = !state.grouped;
    $('groupBtn').setAttribute('aria-pressed', String(state.grouped));
    transition(renderResults);
  });

  var qTimer;
  $('q').addEventListener('input', function (e) {
    clearTimeout(qTimer);
    var v = e.target.value;
    $('searchClear').hidden = v.length === 0;
    qTimer = setTimeout(function () {
      var before = state.q.trim().length >= 2, after = v.trim().length >= 2;
      state.q = v;
      if (!before && !after) { renderActiveFilters(); return; }
      renderResults();
      var top = $('toolbar').getBoundingClientRect().top + scrollY - header.getBoundingClientRect().height - 8;
      if (scrollY > top + 10) scrollTo({ top: top });
    }, 120);
  });
  $('searchForm').addEventListener('submit', function (e) { e.preventDefault(); $('q').blur(); });
  $('searchClear').addEventListener('click', function () {
    $('q').value = ''; state.q = ''; $('searchClear').hidden = true; renderResults(); $('q').focus();
  });
  $('searchReveal').addEventListener('click', function () {
    header.classList.add('search-open');
    setTimeout(function () { $('q').focus({ preventScroll: true }); }, 50);
  });
  $('q').addEventListener('blur', function () {
    setTimeout(function () {
      if (!$('q').value && document.activeElement !== $('q') && scrollY > 90) header.classList.remove('search-open');
    }, 150);
  });

  $('brand').addEventListener('click', function (e) {
    e.preventDefault();
    scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  /* ---------------- Boot ---------------- */
  renderStatic();
  renderNav();
  renderDrawer();
  renderResults();
  document.querySelectorAll('.lid img').forEach(function (im) { im.loading = 'eager'; });
  root.dataset.active = '';
  setActive(state.active);
  spy();
})();
