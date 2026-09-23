/* The Light Table — homepage behaviour (plain JS, no dependencies). */
(function () {
  'use strict';

  var C = window.COOKBOOK;
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Small strings with no key in the shared ui table.
  var EXTRA = {
    ro: { another: 'Altă rețetă', remove: 'Elimină', openSearch: 'Caută', closeSearch: 'Închide căutarea', sort: 'Sortare', romanian: 'Română', english: 'English', recipe: 'rețetă' },
    en: { another: 'Another recipe', remove: 'Remove', openSearch: 'Search', closeSearch: 'Close search', sort: 'Sort', romanian: 'Română', english: 'English', recipe: 'recipe' }
  };

  var state = {
    lang: root.lang === 'en' ? 'en' : 'ro',
    theme: root.dataset.theme === 'dark' ? 'dark' : 'light',
    text: root.dataset.text === 'large' ? 'large' : 'normal',
    q: '',
    kw: new Set(),
    sort: 'name',
    dir: 'asc',
    grouped: true,
    featurePos: 0
  };

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key) {
    var v = C.ui[state.lang][key];
    // The shared snapshot's RO placeholder lost its diacritics ("Caut? re?ete..."); repair it locally.
    if (key === 'searchPlaceholder' && (!v || v.indexOf('?') !== -1)) return state.lang === 'ro' ? 'Caută rețete…' : 'Search recipes…';
    return v == null ? key : v;
  }
  function x(key) { return EXTRA[state.lang][key]; }
  function norm(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function price(r) { return r.priceStatus === 'unavailable' || r.pricePerServing == null ? null : r.pricePerServing; }
  function savePrefs() { try { localStorage.setItem('lt-prefs', JSON.stringify({ lang: state.lang, theme: state.theme, text: state.text })); } catch (e) {} }
  function behavior() { return reduced.matches ? 'auto' : 'smooth'; }
  function numFmt() { return new Intl.NumberFormat(state.lang === 'ro' ? 'ro-RO' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function thumb(r) { return C.imageBase + r.thumb; }
  function full(r) { return C.imageBase + r.image; }
  function catName(id) { var c = C.categories.find(function (c) { return c.id === id; }); return c ? c.name[state.lang] : id; }
  function recipesWord(n) { return n === 1 ? x('recipe') : t('recipes').toLowerCase(); }

  function metaHTML(r) {
    var mins = '<span><span aria-hidden="true">' + r.prepTime + '<span class="meta__unit"> min</span></span>' +
      '<span class="sr">' + esc(t('prepTime')) + ': ' + r.prepTime + ' ' + esc(t('minutes')) + '.</span></span>';
    var p = price(r), cost;
    if (p == null) {
      cost = '<span title="' + esc(t('costUnavailable')) + '"><span aria-hidden="true">—<span class="meta__unit"> lei</span></span><span class="sr">' + esc(t('costUnavailable')) + '.</span></span>';
    } else {
      var v = numFmt().format(p);
      var partial = r.priceStatus === 'partial';
      var label = partial ? t('partialEstimate') : t('estimatedCost');
      cost = '<span' + (partial ? ' title="' + esc(t('partialEstimate')) + '"' : '') + '><span aria-hidden="true">' +
        (partial ? '<span class="meta__approx">≈</span>' : '') + v + '<span class="meta__unit"> lei</span></span>' +
        '<span class="sr">' + esc(label) + ': ' + v + ' ' + esc(t('perServing')) + '.</span></span>';
    }
    return mins + cost;
  }

  /* ---------- data ---------- */

  function isFiltered() { return state.kw.size > 0 || state.q.trim().length >= 2; }

  function filtered() {
    var list = C.recipes;
    if (state.kw.size) {
      var kws = Array.from(state.kw);
      list = list.filter(function (r) { return kws.every(function (k) { return r.keywords.indexOf(k) !== -1; }); });
    }
    var q = state.q.trim();
    if (q.length >= 2) {
      var n = norm(q);
      list = list.filter(function (r) { return norm(r.title[state.lang]).indexOf(n) !== -1; });
    }
    return list;
  }

  function sorted(list) {
    var m = state.dir === 'asc' ? 1 : -1;
    var coll = new Intl.Collator(state.lang, { sensitivity: 'base' });
    var byName = function (a, b) { return coll.compare(a.title[state.lang], b.title[state.lang]); };
    return list.slice().sort(function (a, b) {
      if (state.sort === 'name') return m * byName(a, b);
      if (state.sort === 'prepTime') return m * (a.prepTime - b.prepTime) || byName(a, b);
      var pa = price(a), pb = price(b);
      if (pa == null && pb == null) return byName(a, b);
      if (pa == null) return 1;
      if (pb == null) return -1;
      return m * (pa - pb) || byName(a, b);
    });
  }

  /* ---------- collection ---------- */

  var loaded = new Set();
  var collection = $('recipes');

  function plateHTML(r) {
    var src = thumb(r);
    var cls = loaded.has(src) ? '' : ' class="is-loading"';
    return '<li class="plate" style="view-transition-name:p-' + r.id + '">' +
      '<a class="plate__link" href="' + esc(C.recipeHref(r.id)) + '">' +
      '<figure class="plate__print"><img' + cls + ' src="' + esc(src) + '" data-full="' + esc(full(r)) + '" alt="" width="480" height="480" decoding="async"></figure>' +
      '<div class="plate__label"><h3 class="plate__title">' + esc(r.title[state.lang]) + '</h3>' +
      '<p class="meta">' + metaHTML(r) + '</p></div></a></li>';
  }

  function renderCollection() {
    var list = filtered();
    var html = '';
    if (!list.length) {
      html = '<div class="empty" role="status"><div class="empty__slot" aria-hidden="true"></div>' +
        '<h2>' + esc(t('pantryEmpty')) + '</h2><p>' + esc(t('pantryEmptyMessage')) + '</p>' +
        '<button type="button" class="btn" data-clear-all><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>' + esc(t('clearFilters')) + '</button></div>';
    } else if (state.grouped) {
      C.categories.forEach(function (c) {
        var items = list.filter(function (r) { return r.category === c.id; });
        if (!items.length) return;
        html += '<section class="room" id="category-' + c.id + '" aria-labelledby="h-' + c.id + '">' +
          '<div class="room__head"><h2 class="room__title" id="h-' + c.id + '" tabindex="-1">' + esc(c.name[state.lang]) + '</h2>' +
          '<span class="room__count">' + items.length + '<span class="sr"> ' + esc(recipesWord(items.length)) + '</span></span></div>' +
          '<ul class="plates">' + sorted(items).map(plateHTML).join('') + '</ul></section>';
      });
    } else {
      html = '<h2 class="sr">' + esc(t('recipes')) + '</h2><ul class="plates">' + sorted(list).map(plateHTML).join('') + '</ul>';
    }
    collection.innerHTML = html;

    $('count').textContent = list.length;
    $('count-label').textContent = recipesWord(list.length);
    $('opening').hidden = isFiltered();
    renderActive();
    renderCats(list);
  }

  // Image load / fallback, delegated (load & error do not bubble, so capture).
  document.addEventListener('load', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG') return;
    loaded.add(img.getAttribute('src'));
    img.classList.remove('is-loading');
  }, true);
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG' || !img.dataset.full || img.dataset.fell) return;
    img.dataset.fell = '1';
    img.src = img.dataset.full;
  }, true);

  function update(fn, animate) {
    var drawerOpen = !$('drawer').hidden;
    if (animate && !drawerOpen && document.startViewTransition && !reduced.matches) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  }

  /* ---------- controls ---------- */

  function renderControls() {
    var g = $('group-toggle');
    g.setAttribute('aria-checked', String(state.grouped));
    g.setAttribute('aria-label', t('groupByCategories'));
    $('sort').setAttribute('aria-label', x('sort'));
    Array.prototype.forEach.call(document.querySelectorAll('.sort__btn'), function (b) {
      var active = b.dataset.sort === state.sort;
      b.setAttribute('aria-pressed', String(active));
      b.dataset.dir = active ? state.dir : '';
      var dirText = t(state.dir === 'asc' ? 'ascending' : 'descending');
      b.querySelector('.sort__dir').textContent = active ? ', ' + dirText : '';
      if (active) b.title = dirText; else b.removeAttribute('title');
    });
    var n = state.kw.size;
    ['menu-badge', 'filters-badge'].forEach(function (id) {
      var el = $(id);
      el.hidden = !n;
      el.textContent = n;
    });
    $('menu-btn').setAttribute('aria-label', t('menu') + (n ? ' (' + n + ' ' + t('filters').toLowerCase() + ')' : ''));
    $('filters-btn').setAttribute('aria-label', t('filters') + (n ? ' (' + n + ')' : ''));
    $('clear-all').hidden = !n;
  }

  function renderActive() {
    var el = $('active');
    var q = state.q.trim();
    if (!isFiltered()) { el.hidden = true; el.innerHTML = ''; return; }
    var x_ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';
    var html = '';
    if (q.length >= 2) {
      var quoted = state.lang === 'ro' ? '„' + q + '”' : '“' + q + '”';
      html += '<button type="button" class="tag" data-clear-q aria-label="' + esc(x('remove') + ': ' + quoted) + '">' + esc(quoted) + x_ + '</button>';
    }
    state.kw.forEach(function (id) {
      var k = C.filterKeywords.find(function (k) { return k.id === id; });
      if (!k) return;
      html += '<button type="button" class="tag" data-kw="' + esc(id) + '" aria-label="' + esc(x('remove') + ': ' + k.label[state.lang]) + '">' + esc(k.label[state.lang]) + x_ + '</button>';
    });
    html += '<button type="button" class="text-btn" data-clear-all>' + esc(t('clearFilters')) + '</button>';
    el.innerHTML = html;
    el.hidden = false;
  }

  function setSort(field) {
    if (state.sort === field) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    else { state.sort = field; state.dir = 'asc'; }
    renderControls();
    update(renderCollection, true);
  }

  function toggleKeyword(id) {
    if (state.kw.has(id)) state.kw.delete(id); else state.kw.add(id);
    afterFilterChange();
  }

  function clearAll() {
    state.kw.clear();
    state.q = '';
    $('q').value = '';
    $('search').classList.remove('has-value');
    afterFilterChange();
  }

  function afterFilterChange() {
    renderControls();
    renderChips();
    update(function () { renderCollection(); window.scrollTo(0, 0); }, true);
  }

  /* ---------- today's plate ---------- */

  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var r = Math.imul(seed ^ seed >>> 15, 1 | seed);
      r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r;
      return ((r ^ r >>> 14) >>> 0) / 4294967296;
    };
  }
  var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  var order = C.recipes.map(function (_, i) { return i; });
  (function shuffle() {
    var rnd = seeded(day);
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
  })();

  var featImg = document.createElement('img');
  featImg.alt = '';
  featImg.width = 1200;
  featImg.height = 800;
  featImg.setAttribute('fetchpriority', 'high');
  $('feature-print').appendChild(featImg);

  function featureRecipe() { return C.recipes[order[state.featurePos % order.length]]; }

  function renderFeatureText() {
    var r = featureRecipe();
    var href = C.recipeHref(r.id);
    $('feature-link').href = href;
    $('feature-print').href = href;
    $('feature-title').textContent = r.title[state.lang];
    $('feature-meta').innerHTML = metaHTML(r);
    $('feature-next').setAttribute('aria-label', x('another'));
  }

  function showFeature(first) {
    var r = featureRecipe();
    var src = full(r);
    var develop = function () {
      featImg.classList.remove('is-leaving', 'is-developing');
      if (!reduced.matches) { void featImg.offsetWidth; featImg.classList.add('is-developing'); }
    };
    var swap = function () {
      featImg.src = src;
      var p = featImg.decode ? featImg.decode() : Promise.resolve();
      p.then(function () { renderFeatureText(); develop(); }, function () { renderFeatureText(); develop(); });
    };
    if (first || reduced.matches) { renderFeatureText(); swap(); return; }
    featImg.classList.remove('is-developing');
    featImg.classList.add('is-leaving');
    setTimeout(swap, 260);
  }

  /* ---------- drawer ---------- */

  var drawer = $('drawer');
  var lastFocus = null;
  var closeTimer = null;
  var afterClose = null;

  function setInert(on) {
    ['bar', 'top'].forEach(function (id) { $(id).inert = on; });
    document.querySelector('.foot').inert = on;
    document.querySelector('.skip').inert = on;
  }

  function openDrawer(target) {
    if (!drawer.hidden && drawer.classList.contains('is-open')) return;
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    var sbw = window.innerWidth - root.clientWidth;
    document.body.style.paddingRight = sbw ? sbw + 'px' : '';
    root.classList.add('is-locked');
    drawer.hidden = false;
    setInert(true);
    $('menu-btn').setAttribute('aria-expanded', 'true');
    $('drawer-body').scrollTop = 0;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    });
    var focusEl = target === 'filters' ? drawer.querySelector('.chip') : $('drawer-close');
    (focusEl || $('drawer-close')).focus({ preventScroll: true });
  }

  function closeDrawer(then) {
    if (drawer.hidden) { if (then) then(); return; }
    afterClose = then || null;
    drawer.classList.remove('is-open');
    $('menu-btn').setAttribute('aria-expanded', 'false');
    closeTimer = setTimeout(finishClose, reduced.matches ? 0 : 520);
  }

  function finishClose() {
    drawer.hidden = true;
    root.classList.remove('is-locked');
    document.body.style.paddingRight = '';
    setInert(false);
    if (afterClose) { var fn = afterClose; afterClose = null; fn(); }
    else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function buildFilterGroups() {
    var groups = [['meatType', 'meatType'], ['cookType', 'cookType'], ['ingredient', 'ingredient']];
    var html = '';
    groups.forEach(function (g) {
      var kws = C.filterKeywords.filter(function (k) { return k.type === g[0]; });
      if (g[0] === 'ingredient') kws = kws.slice(0, 12);
      html += '<div class="fgroup" role="group" aria-labelledby="fg-' + g[0] + '"><h4 id="fg-' + g[0] + '" data-i18n="' + g[1] + '"></h4><div class="chips">' +
        kws.map(function (k) { return '<button type="button" class="chip" data-kw="' + k.id + '" aria-pressed="false"></button>'; }).join('') +
        '</div></div>';
    });
    $('filter-groups').innerHTML = html;
  }

  function renderChips() {
    Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (b) {
      var k = C.filterKeywords.find(function (k) { return k.id === b.dataset.kw; });
      b.textContent = k.label[state.lang];
      b.setAttribute('aria-pressed', String(state.kw.has(k.id)));
    });
  }

  function renderCats(list) {
    var html = '';
    C.categories.forEach(function (c) {
      var all = C.recipes.filter(function (r) { return r.category === c.id; });
      var n = list.filter(function (r) { return r.category === c.id; }).length;
      var cover = all[0];
      html += '<li><button type="button" class="cat" data-cat="' + c.id + '"' + (n ? '' : ' disabled') + '>' +
        '<img src="' + esc(thumb(cover)) + '" data-full="' + esc(full(cover)) + '" alt="" width="44" height="44" decoding="async">' +
        '<span class="cat__name">' + esc(c.name[state.lang]) + '</span>' +
        '<span class="cat__count">' + n + '<span class="sr"> ' + esc(recipesWord(n)) + '</span></span></button></li>';
    });
    $('cat-list').innerHTML = html;
  }

  function jumpToCategory(id) {
    closeDrawer(function () {
      if (!state.grouped) { state.grouped = true; renderControls(); renderCollection(); }
      var sec = $('category-' + id);
      if (!sec) return;
      sec.scrollIntoView({ behavior: behavior(), block: 'start' });
      var h = sec.querySelector('.room__title');
      if (h) h.focus({ preventScroll: true });
    });
  }

  function buildLinks() {
    var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
    $('more-links').innerHTML = C.menuLinks.map(function (l) {
      return '<li><a href="' + esc(l.href) + '"><span>' + esc(t(l.id)) + '</span>' + arrow + '</a></li>';
    }).join('');
    var order_ = ['about', 'cookingBasics', 'ingredientPrices'];
    $('foot-links').setAttribute('aria-label', t('more'));
    $('foot-links').innerHTML = order_.map(function (id) {
      var l = C.menuLinks.find(function (l) { return l.id === id; });
      return l ? '<a href="' + esc(l.href) + '">' + esc(t(id)) + '</a>' : '';
    }).join('');
  }

  var PREFS = [
    { key: 'lang', label: 'language', opts: [['ro', 'RO', 'romanian'], ['en', 'EN', 'english']] },
    { key: 'theme', label: 'theme', opts: [['light', 'light'], ['dark', 'dark']] },
    { key: 'text', label: 'textSize', opts: [['normal', 'normal'], ['large', 'large']] }
  ];

  function buildPrefs() {
    $('prefs').innerHTML = PREFS.map(function (p) {
      return '<div class="pref"><span class="pref__label" id="pl-' + p.key + '"></span>' +
        '<div class="seg" role="radiogroup" aria-labelledby="pl-' + p.key + '">' +
        p.opts.map(function (o) { return '<button type="button" role="radio" data-pref="' + p.key + '" data-val="' + o[0] + '"></button>'; }).join('') +
        '</div></div>';
    }).join('');
  }

  function renderPrefs() {
    PREFS.forEach(function (p) {
      $('pl-' + p.key).textContent = t(p.label);
      p.opts.forEach(function (o) {
        var b = document.querySelector('[data-pref="' + p.key + '"][data-val="' + o[0] + '"]');
        var on = state[p.key] === o[0];
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
        if (p.key === 'lang') { b.textContent = o[1]; b.setAttribute('aria-label', x(o[2])); b.lang = o[0]; }
        else b.textContent = t(o[1]);
      });
    });
  }

  function setPref(key, val) {
    if (state[key] === val) return;
    state[key] = val;
    if (key === 'lang') { root.lang = val; renderStrings(); renderAll(); }
    if (key === 'theme') root.dataset.theme = val;
    if (key === 'text') root.dataset.text = val;
    renderPrefs();
    savePrefs();
  }

  /* ---------- static strings ---------- */

  function renderStrings() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) { el.textContent = t(el.dataset.i18n); });
    $('q').placeholder = t('searchPlaceholder');
    $('search-open').setAttribute('aria-label', x('openSearch'));
    $('search-close').setAttribute('aria-label', x('closeSearch'));
    $('drawer-close').setAttribute('aria-label', t('close'));
    $('brand').setAttribute('aria-label', "Paul's Cookbook, " + t('home'));
    document.title = "Paul's Cookbook — " + t('greetingTitle');
  }

  function renderAll() {
    renderControls();
    renderChips();
    buildLinks();
    renderFeatureText();
    renderCollection();
  }

  /* ---------- events ---------- */

  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, a');
    if (!el) return;
    if (el.matches('.sort__btn')) return setSort(el.dataset.sort);
    if (el.id === 'group-toggle') {
      state.grouped = !state.grouped;
      renderControls();
      return update(renderCollection, true);
    }
    if (el.id === 'menu-btn') return drawer.hidden ? openDrawer() : closeDrawer();
    if (el.id === 'filters-btn') return openDrawer('filters');
    if (el.hasAttribute('data-close')) return closeDrawer();
    if (el.matches('.chip, .tag[data-kw]')) return toggleKeyword(el.dataset.kw);
    if (el.hasAttribute('data-clear-q')) {
      state.q = ''; $('q').value = ''; $('search').classList.remove('has-value');
      return afterFilterChange();
    }
    if (el.hasAttribute('data-clear-all') || el.id === 'clear-all') return clearAll();
    if (el.matches('.cat')) return jumpToCategory(el.dataset.cat);
    if (el.dataset.pref) return setPref(el.dataset.pref, el.dataset.val);
    if (el.id === 'feature-next') { state.featurePos++; return showFeature(false); }
    if (el.id === 'brand') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: behavior() });
      return;
    }
    if (el.id === 'search-open') {
      $('bar').classList.add('is-searching');
      el.setAttribute('aria-expanded', 'true');
      $('q').focus();
      return;
    }
    if (el.id === 'search-close') {
      var wasFiltered = state.q.trim().length >= 2;
      state.q = ''; $('q').value = ''; $('search').classList.remove('has-value');
      if (window.matchMedia('(max-width: 767px)').matches) {
        $('bar').classList.remove('is-searching');
        $('search-open').setAttribute('aria-expanded', 'false');
        $('search-open').focus();
      } else $('q').focus();
      if (wasFiltered) renderCollection();
    }
  });

  // Close the backdrop on click even though it is a div.
  drawer.querySelector('.drawer__backdrop').addEventListener('click', function () { closeDrawer(); });

  // Arrow keys move within radio groups.
  $('prefs').addEventListener('keydown', function (e) {
    var b = e.target.closest('[role="radio"]');
    if (!b || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
    e.preventDefault();
    var sib = b.nextElementSibling || b.previousElementSibling;
    setPref(sib.dataset.pref, sib.dataset.val);
    sib.focus();
  });

  $('q').addEventListener('input', function (e) {
    var before = isFiltered();
    state.q = e.target.value;
    $('search').classList.toggle('has-value', !!state.q);
    renderCollection();
    if ((before !== isFiltered() || isFiltered()) && window.scrollY > 0) window.scrollTo(0, 0);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!drawer.hidden) { e.preventDefault(); closeDrawer(); return; }
    if ($('bar').classList.contains('is-searching') && document.activeElement === $('q') && !state.q) {
      $('search-close').click();
    }
  });

  // Sticky states + measured control height for scroll offsets.
  var controls = $('controls');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var barH = $('bar').offsetHeight;
      $('bar').classList.toggle('is-scrolled', window.scrollY > 4 && controls.getBoundingClientRect().top > barH + 1);
      controls.classList.toggle('is-stuck', controls.getBoundingClientRect().top <= barH + 1 && window.scrollY > 0);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { root.style.setProperty('--ctl-measured', controls.offsetHeight + 'px'); onScroll(); }).observe(controls);
  }

  /* ---------- boot ---------- */

  buildFilterGroups();
  buildPrefs();
  renderStrings();
  renderPrefs();
  renderAll();
  showFeature(true);
  onScroll();
})();
