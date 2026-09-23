(function () {
  'use strict';

  var C = window.COOKBOOK;
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  // Copy that has no key in ui strings.
  var LOCAL = {
    ro: { sort: 'Sortează', show: 'Vezi', clearSearch: 'Șterge căutarea', remove: 'Elimină filtrul', one: 'rețetă', searchPlaceholder: 'Caută rețete…' },
    en: { sort: 'Sort', show: 'Show', clearSearch: 'Clear search', remove: 'Remove filter', one: 'recipe', searchPlaceholder: 'Search recipes…' }
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var state = {
    lang: root.lang === 'en' ? 'en' : 'ro',
    theme: root.dataset.theme === 'light' ? 'light' : 'dark',
    text: root.dataset.text === 'large' ? 'large' : 'normal',
    query: '',
    keywords: new Set(),
    sortField: 'name',
    sortOrder: 'asc',
    grouped: true
  };

  function t(key) {
    var v = C.ui[state.lang][key];
    if (key === 'searchPlaceholder' && (!v || v.indexOf('?') !== -1)) v = LOCAL[state.lang].searchPlaceholder;
    return v != null ? v : key;
  }
  function L(key) { return LOCAL[state.lang][key]; }

  function fold(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var nf = {};
  function price(n) {
    var loc = state.lang === 'ro' ? 'ro-RO' : 'en-GB';
    if (!nf[loc]) nf[loc] = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return nf[loc].format(n);
  }

  function img(path) { return C.imageBase + path; }

  function countLabel(n) {
    return n === 1 ? L('one') : t('recipes').toLowerCase();
  }

  function metaHTML(r) {
    var mins = r.prepTime;
    var timeLabel = t('prepTime') + ': ' + mins + ' ' + t('minutes');
    var cost, costLabel;
    if (r.pricePerServing == null || r.priceStatus === 'unavailable') {
      cost = '<span class="meta__cost" aria-hidden="true"><b>—</b></span>';
      costLabel = t('costUnavailable');
    } else if (r.priceStatus === 'partial') {
      costLabel = t('partialEstimate') + ', ' + t('knownSubtotal') + ': ' + price(r.pricePerServing) + ' ' + t('perServing');
      cost = '<span class="meta__cost" aria-hidden="true" title="' + esc(t('partialEstimate')) + '"><span class="meta__approx">≈</span><b>' + price(r.pricePerServing) + '</b> lei</span>';
    } else {
      costLabel = t('estimatedCost') + ': ' + price(r.pricePerServing) + ' ' + t('perServing');
      cost = '<span class="meta__cost" aria-hidden="true"><b>' + price(r.pricePerServing) + '</b> lei</span>';
    }
    return '<span class="meta__time" aria-hidden="true"><b>' + mins + '</b> min</span>' +
      '<span class="meta__sep" aria-hidden="true"></span>' + cost +
      '<span class="sr-only">' + esc(timeLabel + '. ' + costLabel + '.') + '</span>';
  }

  /* ------------------------------------------------------------------ data */
  function filtered() {
    var q = state.query.trim();
    var fq = q.length >= 2 ? fold(q) : '';
    var kws = Array.from(state.keywords);
    return C.recipes.filter(function (r) {
      if (kws.length && !kws.every(function (k) { return r.keywords.indexOf(k) !== -1; })) return false;
      if (fq && fold(r.title[state.lang]).indexOf(fq) === -1) return false;
      return true;
    });
  }

  function sortList(list) {
    var dir = state.sortOrder === 'asc' ? 1 : -1;
    var lang = state.lang;
    return list.slice().sort(function (a, b) {
      if (state.sortField === 'prepTime') return (a.prepTime - b.prepTime) * dir || a.title[lang].localeCompare(b.title[lang], lang);
      if (state.sortField === 'price') {
        var pa = a.pricePerServing, pb = b.pricePerServing;
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return (pa - pb) * dir;
      }
      return a.title[lang].localeCompare(b.title[lang], lang, { sensitivity: 'base' }) * dir;
    });
  }

  function isFiltering() { return state.keywords.size > 0 || state.query.trim().length >= 2; }

  /* ---------------------------------------------------------------- render */
  function dishHTML(r, i) {
    var eager = i < 4 && !isFiltering();
    return '<li class="dish" style="--i:' + i + '">' +
      '<a class="dish__link" href="' + esc(C.recipeHref(r.id)) + '">' +
        '<span class="dish__plate"><img src="' + esc(img(r.thumb)) + '" data-full="' + esc(img(r.image)) + '" alt="" width="600" height="400"' +
          (eager ? '' : ' loading="lazy"') + ' decoding="async"></span>' +
        '<h3 class="dish__title">' + esc(r.title[state.lang]) + '</h3>' +
        '<p class="meta">' + metaHTML(r) + '</p>' +
      '</a></li>';
  }

  var els = {};
  function cache() {
    els.results = $('[data-results]');
    els.empty = $('[data-empty]');
    els.count = $('[data-count]');
    els.countLabel = $('[data-count-label]');
    els.rail = $('[data-rail]');
    els.railList = $('[data-rail-list]');
    els.railScroller = $('[data-rail-scroller]');
    els.hero = $('[data-hero]');
    els.active = $('[data-active]');
    els.activeList = $('[data-active-list]');
    els.q = $('#q');
    els.clearSearch = $('[data-clear-search]');
    els.drawer = $('[data-drawer]');
    els.scrim = $('[data-scrim]');
    els.menuBtn = $('[data-menu-toggle]');
    els.badge = $('[data-filter-badge]');
    els.filterBtn = $('[data-open-filters]');
    els.filterN = $('[data-filter-count]');
    els.showResults = $('[data-show-results]');
    els.bar = $('.bar');
  }

  var sections = [];

  function renderResults(animate) {
    var list = filtered();
    var n = list.length;
    els.count.textContent = n;
    els.countLabel.textContent = countLabel(n);
    els.showResults.textContent = L('show') + ' ' + n + ' ' + countLabel(n);
    els.hero.hidden = isFiltering();

    var html = '';
    sections = [];
    if (state.grouped) {
      C.categories.forEach(function (cat) {
        var items = sortList(list.filter(function (r) { return r.category === cat.id; }));
        if (!items.length) return;
        sections.push(cat);
        html += '<section class="course" id="category-' + cat.id + '" aria-labelledby="h-' + cat.id + '">' +
          '<div class="course__head"><h2 class="course__title" id="h-' + cat.id + '">' + esc(cat.name[state.lang]) + '</h2>' +
          '<span class="course__count">' + items.length + ' ' + countLabel(items.length) + '</span></div>' +
          '<ul class="grid" role="list">' + items.map(dishHTML).join('') + '</ul></section>';
      });
    } else if (n) {
      html = '<section class="course" aria-label="' + esc(t('recipes')) + '"><ul class="grid" role="list">' + sortList(list).map(dishHTML).join('') + '</ul></section>';
    }
    els.results.innerHTML = html;
    els.empty.hidden = n > 0;

    if (animate && !reduceMotion.matches) {
      $$('.grid', els.results).forEach(function (g) {
        g.classList.add('is-entering');
        setTimeout(function () { g.classList.remove('is-entering'); }, 1700);
      });
    }

    renderRail();
    renderActive();
    renderDrawerState();
  }

  function renderRail() {
    var show = state.grouped && sections.length > 1;
    els.rail.hidden = !show;
    if (!show) return;
    els.rail.setAttribute('aria-label', t('categories'));
    els.railList.innerHTML = '<li class="rail__light" data-rail-light aria-hidden="true"></li>' + sections.map(function (c) {
      return '<li><a class="rail__link" href="#category-' + c.id + '" data-cat="' + c.id + '">' + esc(c.name[state.lang]) + '</a></li>';
    }).join('');
    activeCat = null;
    requestAnimationFrame(function () { updateActiveCat(true); });
  }

  function renderActive() {
    var kws = Array.from(state.keywords);
    els.active.hidden = kws.length === 0;
    els.activeList.innerHTML = kws.map(function (id) {
      var k = C.filterKeywords.find(function (f) { return f.id === id; });
      var label = k ? k.label[state.lang] : id;
      return '<li><button type="button" class="active__chip" data-remove="' + esc(id) + '" aria-label="' + esc(L('remove') + ': ' + label) + '">' +
        esc(label) + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg></button></li>';
    }).join('');
    var c = kws.length;
    els.badge.hidden = c === 0;
    els.badge.textContent = c;
    els.filterN.hidden = c === 0;
    els.filterN.textContent = c;
    els.filterBtn.classList.toggle('is-on', c > 0);
    els.menuBtn.setAttribute('aria-label', t('menu') + (c ? ' (' + c + ' ' + t('filters').toLowerCase() + ')' : ''));
  }

  function renderFilters() {
    var groups = ['meatType', 'cookType', 'ingredient'];
    var html = groups.map(function (type) {
      var items = C.filterKeywords.filter(function (k) { return k.type === type; });
      if (type === 'ingredient') items = items.slice(0, 12);
      return '<div class="fgroup" role="group" aria-labelledby="fg-' + type + '"><p class="fgroup__label" id="fg-' + type + '">' + esc(t(type)) + '</p><div class="chips">' +
        items.map(function (k) {
          return '<button type="button" class="chip" data-kw="' + k.id + '" aria-pressed="false">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' + esc(k.label[state.lang]) + '</button>';
        }).join('') + '</div></div>';
    }).join('');
    $('[data-filter-groups]').innerHTML = html;
  }

  function renderDrawerCats() {
    var html = C.categories.map(function (c) {
      var all = C.recipes.filter(function (r) { return r.category === c.id; });
      var first = all[0];
      return '<li><button type="button" class="cats__btn" data-jump="' + c.id + '">' +
        '<span class="cats__thumb">' + (first ? '<img src="' + esc(img(first.thumb)) + '" data-full="' + esc(img(first.image)) + '" alt="" width="80" height="80" loading="lazy" decoding="async">' : '') + '</span>' +
        '<span class="cats__name">' + esc(c.name[state.lang]) + '</span>' +
        '<span class="cats__n" data-cat-n="' + c.id + '"></span></button></li>';
    }).join('');
    $('[data-drawer-cats]').innerHTML = html;
  }

  var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function renderLinks() {
    $('[data-drawer-links]').innerHTML = C.menuLinks.map(function (l) {
      return '<li><a href="' + esc(l.href) + '">' + esc(t(l.id)) + arrow + '</a></li>';
    }).join('');
    $('[data-foot-links]').innerHTML = C.menuLinks.map(function (l) {
      return '<li><a href="' + esc(l.href) + '">' + esc(t(l.id)) + '</a></li>';
    }).join('');
  }

  function renderDrawerState() {
    $$('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(state.keywords.has(b.dataset.kw))); });
    $('[data-clear-keywords]').hidden = state.keywords.size === 0;
    var list = filtered();
    $$('[data-cat-n]').forEach(function (s) {
      var n = list.filter(function (r) { return r.category === s.dataset.catN; }).length;
      s.textContent = n;
      s.closest('button').disabled = n === 0;
    });
  }

  function renderFeature() {
    var pool = C.recipes.filter(function (r) { return r.category !== 'basics'; });
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    var r = pool[day % pool.length];
    var a = $('[data-feature]');
    a.href = C.recipeHref(r.id);
    var plate = $('[data-feature-plate]');
    if (!plate.firstChild) {
      var im = new Image();
      im.alt = '';
      im.width = 1200; im.height = 800;
      im.decoding = 'async';
      im.setAttribute('fetchpriority', 'high');
      im.src = img(r.image);
      plate.appendChild(im);
    }
    $('[data-feature-title]').textContent = r.title[state.lang];
    $('[data-feature-meta]').innerHTML = metaHTML(r);
  }

  function renderPrefs() {
    $$('[data-pref]').forEach(function (g) {
      var cur = state[g.dataset.pref];
      $$('button', g).forEach(function (b) {
        var on = b.dataset.value === cur;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
    });
  }

  function renderControls() {
    var g = $('[data-group-toggle]');
    g.setAttribute('aria-checked', String(state.grouped));
    $('[data-sort-group]').setAttribute('aria-label', L('sort'));
    $$('[data-sort]').forEach(function (b) {
      var on = b.dataset.sort === state.sortField;
      b.setAttribute('aria-pressed', String(on));
      if (on) {
        b.dataset.dir = state.sortOrder;
        b.title = t(state.sortOrder === 'asc' ? 'ascending' : 'descending');
        b.setAttribute('aria-label', b.textContent.trim() + ', ' + b.title);
      } else {
        delete b.dataset.dir;
        b.removeAttribute('title');
        b.removeAttribute('aria-label');
      }
    });
  }

  function renderStatic() {
    root.lang = state.lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    els.q.placeholder = t('searchPlaceholder');
    els.clearSearch.setAttribute('aria-label', L('clearSearch'));
    $('[data-close-drawer].icon-btn').setAttribute('aria-label', t('close'));
    document.title = "Paul's Cookbook — " + t('greetingTitle');
  }

  function renderAll(animate) {
    renderStatic();
    renderFilters();
    renderDrawerCats();
    renderLinks();
    renderFeature();
    renderPrefs();
    renderControls();
    renderResults(animate);
  }

  /* ------------------------------------------------- active category (rail) */
  var activeCat = null;
  function updateActiveCat(force) {
    if (els.rail.hidden || !sections.length) return;
    var offset = els.bar.offsetHeight + els.rail.offsetHeight + 24;
    var cur = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      var s = document.getElementById('category-' + sections[i].id);
      if (s && s.getBoundingClientRect().top - offset <= 0) cur = sections[i].id;
    }
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4) cur = sections[sections.length - 1].id;
    if (cur === activeCat && !force) return;
    activeCat = cur;
    var link = null;
    $$('.rail__link', els.railList).forEach(function (a) {
      var on = a.dataset.cat === cur;
      if (on) { a.setAttribute('aria-current', 'true'); link = a; } else a.removeAttribute('aria-current');
    });
    var light = $('[data-rail-light]', els.railList);
    if (link && light) {
      light.style.setProperty('--x', link.offsetLeft + 'px');
      light.style.setProperty('--w', link.offsetWidth + 'px');
      if (!light.classList.contains('is-ready')) requestAnimationFrame(function () { light.classList.add('is-ready'); });
      var sc = els.railScroller;
      var target = link.offsetLeft - (sc.clientWidth - link.offsetWidth) / 2;
      sc.scrollTo({ left: Math.max(0, target), behavior: reduceMotion.matches || force ? 'auto' : 'smooth' });
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      els.bar.classList.toggle('is-scrolled', window.scrollY > 8);
      var stuck = !els.rail.hidden && els.rail.getBoundingClientRect().top <= els.bar.offsetHeight + 1 && window.scrollY > 8;
      els.rail.classList.toggle('is-stuck', stuck);
      els.bar.classList.toggle('rail-stuck', stuck);
      updateActiveCat(false);
    });
  }

  /* ---------------------------------------------------------------- drawer */
  var lastFocus = null;
  var scrollbarW = 0;
  function openDrawer(focusFilters) {
    lastFocus = document.activeElement;
    scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    root.classList.add('is-locked');
    document.body.style.paddingRight = scrollbarW ? scrollbarW + 'px' : '';
    els.drawer.hidden = false;
    els.scrim.hidden = false;
    void els.drawer.offsetWidth;
    $('#main').inert = true;
    $('.bar').inert = true;
    els.menuBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () {
      els.drawer.classList.add('is-open');
      els.scrim.classList.add('is-open');
      var body = $('[data-drawer-body]');
      body.scrollTop = 0;
      var f = focusFilters ? $('.chip', els.drawer) : $('[data-close-drawer].icon-btn');
      if (f) f.focus({ preventScroll: true });
    });
  }

  function closeDrawer(after) {
    if (!els.drawer.classList.contains('is-open')) { if (after) after(); return; }
    els.drawer.classList.remove('is-open');
    els.scrim.classList.remove('is-open');
    els.menuBtn.setAttribute('aria-expanded', 'false');
    $('#main').inert = false;
    $('.bar').inert = false;
    root.classList.remove('is-locked');
    document.body.style.paddingRight = '';
    var done = function () {
      if (!els.drawer.classList.contains('is-open')) { els.drawer.hidden = true; els.scrim.hidden = true; }
    };
    setTimeout(done, reduceMotion.matches ? 0 : 600);
    if (after) after();
    else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !els.drawer.classList.contains('is-open')) return;
    var f = $$('button:not([disabled]):not([hidden]), a[href], input, [tabindex]:not([tabindex="-1"])', els.drawer)
      .filter(function (el) { return el.offsetParent !== null && el.tabIndex >= 0; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function scrollToCat(id) {
    var el = document.getElementById('category-' + id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  /* ----------------------------------------------------------- preferences */
  function setPref(key, value) {
    if (state[key] === value) return;
    state[key] = value;
    try { localStorage.setItem('ek-' + key, value); } catch (e) {}
    if (key === 'theme') {
      root.classList.add('theme-shift');
      root.dataset.theme = value;
      $('meta[name="theme-color"]').content = value === 'light' ? '#e9eae2' : '#22171d';
      setTimeout(function () { root.classList.remove('theme-shift'); }, 700);
      renderPrefs();
    } else if (key === 'text') {
      root.dataset.text = value;
      renderPrefs();
      requestAnimationFrame(function () { updateActiveCat(true); });
    } else if (key === 'lang') {
      renderAll(false);
      var btn = $('[data-pref="lang"] [data-value="' + value + '"]');
      if (btn) btn.focus();
    }
  }

  /* ---------------------------------------------------------------- events */
  function bind() {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { updateActiveCat(true); });

    document.addEventListener('error', function (e) {
      var im = e.target;
      if (im && im.tagName === 'IMG' && im.dataset.full && im.src.indexOf(im.dataset.full) === -1) im.src = im.dataset.full;
    }, true);

    $('[data-scroll-top]').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });

    var qTimer;
    els.q.addEventListener('input', function () {
      state.query = els.q.value;
      els.clearSearch.hidden = !els.q.value;
      clearTimeout(qTimer);
      qTimer = setTimeout(function () {
        var was = els.hero.hidden;
        renderResults(true);
        if (!was && els.hero.hidden) window.scrollTo(0, 0);
      }, 120);
    });
    els.q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') els.q.blur();
      if (e.key === 'Escape' && els.q.value) { e.stopPropagation(); clearSearch(); }
    });
    els.clearSearch.addEventListener('click', function () { clearSearch(); els.q.focus(); });

    function clearSearch() {
      els.q.value = '';
      state.query = '';
      els.clearSearch.hidden = true;
      renderResults(true);
    }

    $('[data-group-toggle]').addEventListener('click', function () {
      state.grouped = !state.grouped;
      renderControls();
      renderResults(true);
    });

    $$('[data-sort]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (state.sortField === b.dataset.sort) state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        else { state.sortField = b.dataset.sort; state.sortOrder = 'asc'; }
        renderControls();
        renderResults(true);
      });
    });

    els.menuBtn.addEventListener('click', function () { openDrawer(false); });
    els.filterBtn.addEventListener('click', function () { openDrawer(true); });
    els.scrim.addEventListener('click', function () { closeDrawer(); });
    $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', function () { closeDrawer(); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && els.drawer.classList.contains('is-open')) { e.preventDefault(); closeDrawer(); }
      trapFocus(e);
    });

    els.drawer.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-kw]');
      if (chip) {
        var id = chip.dataset.kw;
        if (state.keywords.has(id)) state.keywords.delete(id); else state.keywords.add(id);
        renderResults(true);
        window.scrollTo(0, 0);
        return;
      }
      var jump = e.target.closest('[data-jump]');
      if (jump) {
        if (!state.grouped) { state.grouped = true; renderControls(); renderResults(false); }
        closeDrawer(function () { requestAnimationFrame(function () { scrollToCat(jump.dataset.jump); }); });
        return;
      }
      var pref = e.target.closest('[data-pref] button');
      if (pref) setPref(pref.closest('[data-pref]').dataset.pref, pref.dataset.value);
    });

    $$('[data-pref]').forEach(function (g) {
      g.addEventListener('keydown', function (e) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
        e.preventDefault();
        var btns = $$('button', g);
        var i = btns.findIndex(function (b) { return b.getAttribute('aria-checked') === 'true'; });
        var next = btns[(i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? btns.length - 1 : 1)) % btns.length];
        setPref(g.dataset.pref, next.dataset.value);
        next.focus();
      });
    });

    $('[data-clear-keywords]').addEventListener('click', function () {
      state.keywords.clear();
      renderResults(true);
      var first = $('.chip', els.drawer);
      if (first) first.focus();
    });

    $$('[data-clear-all]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.keywords.clear();
        state.query = '';
        els.q.value = '';
        els.clearSearch.hidden = true;
        renderResults(true);
        $('#results').focus({ preventScroll: true });
      });
    });

    els.activeList.addEventListener('click', function (e) {
      var b = e.target.closest('[data-remove]');
      if (!b) return;
      state.keywords.delete(b.dataset.remove);
      renderResults(true);
      var next = $('[data-remove]', els.activeList) || els.filterBtn;
      next.focus();
    });

    els.railList.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cat]');
      if (!a) return;
      e.preventDefault();
      scrollToCat(a.dataset.cat);
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { updateActiveCat(true); });
  }

  cache();
  $('meta[name="theme-color"]').content = state.theme === 'light' ? '#e9eae2' : '#22171d';
  renderAll(true);
  bind();
  onScroll();
})();
