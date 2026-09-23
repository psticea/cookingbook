(function () {
  'use strict';

  var C = window.COOKBOOK;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var STORE = 'pcb-market-grid';

  // Strings the shared ui table does not provide.
  var LOCAL = {
    ro: {
      skip: 'Sari la rețete', search: 'Caută rețete', clearSearch: 'Șterge căutarea', controls: 'Sortare și grupare',
      sort: 'Sortează după', removeFilter: 'Elimină filtrul', recipeOne: 'rețetă', recipeMany: 'rețete', of: 'din',
      searchPlaceholder: 'Caută rețete…', openMenu: 'Deschide meniul', searchFor: 'Căutare'
    },
    en: {
      skip: 'Skip to recipes', search: 'Search recipes', clearSearch: 'Clear search', controls: 'Sort and grouping',
      sort: 'Sort by', removeFilter: 'Remove filter', recipeOne: 'recipe', recipeMany: 'recipes', of: 'of',
      searchPlaceholder: 'Search recipes…', openMenu: 'Open menu', searchFor: 'Search'
    }
  };

  var prefs = {};
  try { prefs = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { prefs = {}; }

  var state = {
    lang: prefs.lang === 'en' ? 'en' : (root.lang === 'en' ? 'en' : 'ro'),
    theme: root.dataset.theme === 'dark' ? 'dark' : 'light',
    text: root.dataset.text === 'large' ? 'large' : 'normal',
    query: '',
    filters: new Set(),
    sortField: 'name',
    sortOrder: 'asc',
    grouped: true
  };

  function savePrefs() {
    try { localStorage.setItem(STORE, JSON.stringify({ lang: state.lang, theme: state.theme, text: state.text })); } catch (e) {}
  }

  function t(key) {
    var ui = C.ui[state.lang] || {};
    var v = ui[key];
    // The shared snapshot has a mis-encoded RO placeholder ("Caut? re?ete..."); fall back to a clean string.
    if (key === 'searchPlaceholder' && (!v || v.indexOf('?') !== -1)) v = LOCAL[state.lang].searchPlaceholder;
    if (v == null) v = LOCAL[state.lang][key];
    return v == null ? key : v;
  }
  function plural(n) { return n === 1 ? LOCAL[state.lang].recipeOne : LOCAL[state.lang].recipeMany; }
  function fold(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var ICON = {
    arrowUp: '<svg class="sort__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>',
    down: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>'
  };

  /* ---------- Numbers as typography ---------- */
  function priceParts(p) {
    var s = p.toFixed(2).split('.');
    return { int: s[0], dec: (state.lang === 'ro' ? ',' : '.') + s[1] };
  }
  function priceText(r) {
    if (r.pricePerServing == null || r.priceStatus === 'unavailable') return t('costUnavailable');
    var pp = priceParts(r.pricePerServing);
    var s = pp.int + pp.dec + ' ' + t('perServing');
    if (r.priceStatus === 'partial') s += ' (' + t('partialEstimate') + ')';
    return s;
  }
  function tagHTML(r) {
    if (r.pricePerServing == null || r.priceStatus === 'unavailable') {
      return '<span class="tag tag--none" title="' + esc(t('costUnavailable')) + '"><span class="tag__int num">—</span></span>';
    }
    var pp = priceParts(r.pricePerServing);
    var partial = r.priceStatus === 'partial';
    var title = partial ? t('partialEstimate') + ' · ' + t('knownSubtotal') : t('estimatedCost');
    return '<span class="tag" title="' + esc(title) + '">' +
      '<span class="tag__int num">' + pp.int + '</span>' +
      '<span class="tag__side"><span class="tag__dec num">' + pp.dec + (partial ? '<b>+</b>' : '') + '</span>' +
      '<span class="tag__unit">lei</span></span></span>';
  }
  function timeHTML(r) {
    return '<span class="time"><span class="num">' + r.prepTime + '</span><span class="unit">min</span></span>';
  }

  /* ---------- Data logic ---------- */
  function matches(r, filters, q) {
    for (var f of filters) if (r.keywords.indexOf(f) === -1) return false;
    if (q.length >= 2) {
      var hay = fold(r.title[state.lang] + ' ' + r.title[state.lang === 'ro' ? 'en' : 'ro']);
      if (hay.indexOf(fold(q)) === -1) return false;
    }
    return true;
  }
  function filtered() {
    var q = state.query.trim();
    return C.recipes.filter(function (r) { return matches(r, state.filters, q); });
  }
  function sortList(list) {
    var dir = state.sortOrder === 'asc' ? 1 : -1;
    var byName = function (a, b) { return a.title[state.lang].localeCompare(b.title[state.lang], state.lang, { sensitivity: 'base' }); };
    return list.slice().sort(function (a, b) {
      if (state.sortField === 'name') return byName(a, b) * dir;
      if (state.sortField === 'prepTime') return (a.prepTime - b.prepTime) * dir || byName(a, b);
      var pa = a.pricePerServing, pb = b.pricePerServing;
      if (pa == null && pb == null) return byName(a, b);
      if (pa == null) return 1;
      if (pb == null) return -1;
      return (pa - pb) * dir || byName(a, b);
    });
  }
  function activeCount() { return state.filters.size; }
  function hasQuery() { return state.query.trim().length >= 2; }

  /* ---------- Cards (cached per language for FLIP) ---------- */
  var cards = new Map();
  var eagerLeft = 0;
  function buildCard(r) {
    var li = el('li');
    li.dataset.id = r.id;
    var a = el('a', 'card');
    a.href = C.recipeHref(r.id);
    var img = new Image();
    img.alt = '';
    img.width = 600; img.height = 600;
    img.decoding = 'async';
    if (eagerLeft > 0) { eagerLeft--; } else { img.loading = 'lazy'; }
    img.className = 'is-loading';
    img.addEventListener('load', function () { img.classList.remove('is-loading'); });
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      img.src = C.imageBase + r.image;
    });
    img.src = C.imageBase + r.thumb;
    var media = el('div', 'card__media');
    media.appendChild(img);
    var label = el('div', 'card__label',
      '<h3 class="card__title">' + esc(r.title[state.lang]) + '</h3>' +
      '<div class="card__meta" aria-hidden="true">' + timeHTML(r) + tagHTML(r) + '</div>' +
      '<span class="sr-only">' + r.prepTime + ' ' + esc(t('minutes')) + ', ' + esc(priceText(r)) + '</span>');
    a.appendChild(media);
    a.appendChild(label);
    li.appendChild(a);
    return li;
  }
  function card(r) {
    var c = cards.get(r.id);
    if (!c) { c = buildCard(r); cards.set(r.id, c); }
    return c;
  }

  /* ---------- Render ---------- */
  var catalog = $('catalog');
  var firstRender = true;

  function render(opts) {
    opts = opts || {};
    var animate = opts.animate !== false && !firstRender && !reduceMotion.matches && 'animate' in Element.prototype;
    var list = sortList(filtered());
    var before = new Map();
    if (animate) {
      var vh = window.innerHeight;
      cards.forEach(function (li, id) {
        if (!li.isConnected) return;
        var r = li.getBoundingClientRect();
        if (r.bottom > -200 && r.top < vh + 200) before.set(id, r);
      });
    }

    var frag = document.createDocumentFragment();
    if (list.length) {
      if (state.grouped) {
        C.categories.forEach(function (cat) {
          var items = list.filter(function (r) { return r.category === cat.id; });
          if (!items.length) return;
          var sec = el('section', 'cat');
          sec.id = 'cat-' + cat.id;
          sec.setAttribute('aria-labelledby', 'h-' + cat.id);
          sec.innerHTML = '<header class="cat__head"><h2 class="cat__title" id="h-' + cat.id + '">' + esc(cat.name[state.lang]) + '</h2>' +
            '<p class="cat__count"><span class="num">' + items.length + '</span> ' + plural(items.length) + '</p></header>';
          var ul = el('ul', 'grid');
          ul.setAttribute('role', 'list');
          items.forEach(function (r) { ul.appendChild(card(r)); });
          sec.appendChild(ul);
          frag.appendChild(sec);
        });
      } else {
        var h = el('h2', 'sr-only', esc(t('recipes')));
        frag.appendChild(h);
        var ul = el('ul', 'grid grid--flat');
        ul.setAttribute('role', 'list');
        list.forEach(function (r) { ul.appendChild(card(r)); });
        frag.appendChild(ul);
      }
    }
    catalog.replaceChildren(frag);
    $('empty').hidden = list.length > 0;

    if (animate) {
      var vh2 = window.innerHeight;
      list.forEach(function (r) {
        var li = cards.get(r.id);
        var now = li.getBoundingClientRect();
        if (now.bottom < -200 || now.top > vh2 + 200) return;
        var was = before.get(r.id);
        if (was) {
          var dx = was.left - now.left, dy = was.top - now.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
          li.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
            { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' });
        } else {
          li.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
            { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
        }
      });
    }
    firstRender = false;
    renderStatus(list.length);
    renderChips();
    renderCatList(list);
  }

  function renderStatus(n) {
    var total = C.recipes.length;
    var filteredNow = n !== total || activeCount() > 0 || hasQuery();
    $('count').innerHTML =
      '<span class="count__num num">' + n + '</span>' +
      (filteredNow ? '<span class="count__of num">/' + total + '</span>' : '') +
      '<span class="count__label">' + plural(filteredNow ? total : n) + '</span>' +
      '<span class="sr-only">' + (filteredNow ? ' (' + n + ' ' + LOCAL[state.lang].of + ' ' + total + ')' : '') + '</span>';

    var af = $('activeFilters');
    af.replaceChildren();
    var any = activeCount() > 0 || hasQuery();
    af.hidden = !any;
    if (any) {
      if (hasQuery()) {
        var qb = el('button', 'fpill', '<span>„' + esc(state.query.trim()) + '”</span>' + ICON.close);
        qb.type = 'button';
        qb.setAttribute('aria-label', LOCAL[state.lang].clearSearch + ': ' + state.query.trim());
        qb.addEventListener('click', function () { setQuery(''); $('q').focus(); });
        af.appendChild(qb);
      }
      state.filters.forEach(function (id) {
        var k = C.filterKeywords.find(function (f) { return f.id === id; });
        var b = el('button', 'fpill', '<span>' + esc(k.label[state.lang]) + '</span>' + ICON.close);
        b.type = 'button';
        b.setAttribute('aria-label', LOCAL[state.lang].removeFilter + ': ' + k.label[state.lang]);
        b.addEventListener('click', function () { state.filters.delete(id); render(); });
        af.appendChild(b);
      });
      var clr = el('button', 'textbtn', esc(t('clearFilters')));
      clr.type = 'button';
      clr.addEventListener('click', clearAll);
      af.appendChild(clr);
    }

    var badge = $('menuBadge');
    badge.hidden = activeCount() === 0;
    badge.textContent = activeCount() || '';
    $('menuBtn').setAttribute('aria-label', t('menu') + (activeCount() ? ' · ' + t('filters') + ': ' + activeCount() : ''));
    $('clearAll').hidden = activeCount() === 0;
    $('showResults').innerHTML = '<span><span class="num">' + n + '</span> ' + plural(n) + '</span>' + ICON.down;
  }

  function clearAll() {
    state.filters.clear();
    setQuery('', true);
    render();
  }

  /* ---------- Sort + grouping ---------- */
  var SORTS = [
    { field: 'name', key: 'sortByName' },
    { field: 'prepTime', key: 'sortByPrepTime' },
    { field: 'price', key: 'sortByPrice' }
  ];
  function renderSort() {
    var box = $('sort');
    box.setAttribute('aria-label', LOCAL[state.lang].sort);
    box.replaceChildren();
    SORTS.forEach(function (s) {
      var b = el('button');
      b.type = 'button';
      var active = state.sortField === s.field;
      b.setAttribute('aria-pressed', String(active));
      b.dataset.field = s.field;
      b.dataset.dir = active ? state.sortOrder : 'asc';
      b.innerHTML = '<span>' + esc(t(s.key)) + '</span>' + ICON.arrowUp;
      if (active) b.setAttribute('aria-label', t(s.key) + ', ' + t(state.sortOrder === 'asc' ? 'ascending' : 'descending'));
      b.addEventListener('click', function () {
        if (state.sortField === s.field) state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        else { state.sortField = s.field; state.sortOrder = 'asc'; }
        updateSortButtons();
        render();
      });
      box.appendChild(b);
    });
  }
  function updateSortButtons() {
    $('sort').querySelectorAll('button').forEach(function (b) {
      var s = SORTS.find(function (x) { return x.field === b.dataset.field; });
      var active = state.sortField === s.field;
      b.setAttribute('aria-pressed', String(active));
      b.dataset.dir = active ? state.sortOrder : 'asc';
      if (active) b.setAttribute('aria-label', t(s.key) + ', ' + t(state.sortOrder === 'asc' ? 'ascending' : 'descending'));
      else b.removeAttribute('aria-label');
    });
  }
  $('groupToggle').addEventListener('click', function () {
    state.grouped = !state.grouped;
    this.setAttribute('aria-pressed', String(state.grouped));
    render();
  });

  /* ---------- Search ---------- */
  var q = $('q');
  var searchForm = $('searchForm');
  function setQuery(v, silent) {
    state.query = v;
    q.value = v;
    $('searchClear').hidden = !v;
    searchForm.classList.toggle('has-value', !!v);
    if (!silent) render({ animate: false });
  }
  q.addEventListener('input', function () {
    var prevActive = hasQuery();
    state.query = q.value;
    $('searchClear').hidden = !q.value;
    searchForm.classList.toggle('has-value', !!q.value);
    if (hasQuery() || prevActive) render({ animate: false });
  });
  q.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && q.value) { e.stopPropagation(); setQuery(''); }
    if (e.key === 'Enter') { q.blur(); }
  });
  $('searchClear').addEventListener('click', function () { setQuery(''); q.focus(); });

  // Tablet keeps search in the top bar; phone and desktop give it the masthead.
  var tabletMq = window.matchMedia('(min-width: 48em) and (max-width: 63.99em)');
  function placeSearch() {
    var target = tabletMq.matches ? $('searchSlotTop') : $('searchSlotMast');
    if (searchForm.parentNode !== target) target.appendChild(searchForm);
    $('searchSlotMast').hidden = tabletMq.matches;
    updateSearchJump();
  }
  tabletMq.addEventListener('change', placeSearch);

  var mastVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mastVisible = entries[0].isIntersecting;
      updateSearchJump();
    }, { rootMargin: '-56px 0px 0px 0px' }).observe($('searchSlotMast'));
  }
  function updateSearchJump() { $('searchJump').hidden = tabletMq.matches || mastVisible; }
  $('searchJump').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    q.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !drawerOpen && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      if (!tabletMq.matches) window.scrollTo({ top: 0 });
      q.focus();
    }
  });

  $('brand').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
  $('footBrand').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  /* ---------- Feature (dish of the day, desktop) ---------- */
  function renderFeature() {
    var pool = C.recipes.filter(function (r) { return r.category !== 'basics'; });
    var now = new Date();
    var day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
    var r = pool[day % pool.length];
    var f = $('feature');
    f.href = C.recipeHref(r.id);
    f.innerHTML =
      '<div class="feature__media"><img src="' + esc(C.imageBase + r.image) + '" alt="" width="1200" height="800" decoding="async"></div>' +
      '<div class="feature__label"><h2 class="feature__title">' + esc(r.title[state.lang]) + '</h2>' +
      '<div class="feature__meta" aria-hidden="true">' + timeHTML(r) + tagHTML(r) + '</div></div>' +
      '<span class="sr-only">' + r.prepTime + ' ' + esc(t('minutes')) + ', ' + esc(priceText(r)) + '</span>';
  }

  /* ---------- Drawer contents ---------- */
  var GROUPS = [
    { type: 'meatType', key: 'meatType' },
    { type: 'cookType', key: 'cookType' },
    { type: 'ingredient', key: 'ingredient', limit: 12 }
  ];
  function renderFilterGroups() {
    var wrap = $('filterGroups');
    wrap.replaceChildren();
    GROUPS.forEach(function (g) {
      var kws = C.filterKeywords.filter(function (k) { return k.type === g.type; });
      if (g.limit) kws = kws.slice(0, g.limit);
      var box = el('div', 'fgroup');
      var hid = 'fg-' + g.type;
      box.innerHTML = '<h4 id="' + hid + '">' + esc(t(g.key)) + '</h4>';
      var chips = el('div', 'chips');
      chips.setAttribute('role', 'group');
      chips.setAttribute('aria-labelledby', hid);
      kws.forEach(function (k) {
        var b = el('button', 'chip');
        b.type = 'button';
        b.dataset.kw = k.id;
        b.innerHTML = '<span>' + esc(k.label[state.lang]) + '</span><span class="num" aria-hidden="true"></span>';
        b.addEventListener('click', function () {
          if (state.filters.has(k.id)) state.filters.delete(k.id); else state.filters.add(k.id);
          render({ animate: false });
        });
        chips.appendChild(b);
      });
      box.appendChild(chips);
      wrap.appendChild(box);
    });
  }
  function renderChips() {
    var qv = state.query.trim();
    $('filterGroups').querySelectorAll('.chip').forEach(function (b) {
      var id = b.dataset.kw;
      var on = state.filters.has(id);
      var set = new Set(state.filters); set.add(id);
      var n = C.recipes.filter(function (r) { return matches(r, set, qv); }).length;
      b.setAttribute('aria-pressed', String(on));
      b.disabled = !on && n === 0;
      b.querySelector('.num').textContent = n;
      b.setAttribute('aria-label', b.firstChild.textContent + ', ' + n + ' ' + plural(n));
    });
  }
  function renderCatList(list) {
    var ul = $('catList');
    ul.replaceChildren();
    C.categories.forEach(function (cat) {
      var n = list.filter(function (r) { return r.category === cat.id; }).length;
      var li = el('li');
      var b = el('button', 'row');
      b.type = 'button';
      b.disabled = n === 0;
      b.innerHTML = '<span>' + esc(cat.name[state.lang]) + '</span><span class="num" aria-label="' + n + ' ' + plural(n) + '">' + n + '</span>';
      b.addEventListener('click', function () { jumpTo(cat.id); });
      li.appendChild(b);
      ul.appendChild(li);
    });
  }
  function jumpTo(catId) {
    closeDrawer(true);
    if (!state.grouped) {
      state.grouped = true;
      $('groupToggle').setAttribute('aria-pressed', 'true');
      render({ animate: false });
    }
    var sec = $('cat-' + catId);
    if (!sec) return;
    requestAnimationFrame(function () {
      sec.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      var h = sec.querySelector('h2');
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    });
  }
  function renderLinks() {
    var more = $('moreLinks');
    var foot = $('footLinks');
    more.replaceChildren(); foot.replaceChildren();
    C.menuLinks.forEach(function (l) {
      var li = el('li');
      li.innerHTML = '<a class="row" href="' + esc(l.href) + '"><span>' + esc(t(l.id)) + '</span>' + ICON.right + '</a>';
      more.appendChild(li);
    });
    ['about', 'cookingBasics', 'ingredientPrices'].forEach(function (id) {
      var l = C.menuLinks.find(function (x) { return x.id === id; });
      if (!l) return;
      var li = el('li');
      li.innerHTML = '<a href="' + esc(l.href) + '">' + esc(t(id)) + '</a>';
      foot.appendChild(li);
    });
  }

  var PREFS = [
    { key: 'lang', label: 'language', options: [['ro', 'RO'], ['en', 'EN']] },
    { key: 'theme', label: 'theme', options: [['light', 'light'], ['dark', 'dark']] },
    { key: 'text', label: 'textSize', options: [['normal', 'normal'], ['large', 'large']] }
  ];
  function renderPrefs() {
    var box = $('prefs');
    box.replaceChildren();
    PREFS.forEach(function (p) {
      var row = el('div', 'pref');
      var lid = 'pref-' + p.key;
      row.innerHTML = '<span class="pref__label" id="' + lid + '">' + esc(t(p.label)) + '</span>';
      var seg = el('div', 'seg');
      seg.setAttribute('role', 'radiogroup');
      seg.setAttribute('aria-labelledby', lid);
      p.options.forEach(function (o) {
        var b = el('button');
        b.type = 'button';
        b.setAttribute('role', 'radio');
        var on = state[p.key] === o[0];
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
        b.textContent = p.key === 'lang' ? o[1] : t(o[1]);
        if (p.key === 'lang') b.lang = o[0];
        b.addEventListener('click', function () { setPref(p.key, o[0]); });
        b.addEventListener('keydown', function (e) {
          var idx = p.options.findIndex(function (x) { return x[0] === state[p.key]; });
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % p.options.length;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + p.options.length) % p.options.length;
          if (next != null) {
            e.preventDefault();
            setPref(p.key, p.options[next][0]);
            var btns = $('prefs').querySelectorAll('[aria-labelledby="' + lid + '"] [role=radio]');
            btns[next].focus();
          }
        });
        seg.appendChild(b);
      });
      row.appendChild(seg);
      box.appendChild(row);
    });
  }
  function setPref(key, val) {
    if (state[key] === val) return;
    state[key] = val;
    savePrefs();
    if (key === 'theme') applyTheme();
    if (key === 'text') root.dataset.text = val;
    if (key === 'lang') applyLang();
    else renderPrefs();
  }
  function applyTheme() {
    root.dataset.theme = state.theme;
  }

  /* ---------- i18n ---------- */
  function applyLang() {
    root.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll('[data-i18n-label]').forEach(function (n) { n.setAttribute('aria-label', t(n.dataset.i18nLabel)); });
    q.placeholder = t('searchPlaceholder');
    cards.clear();
    eagerLeft = firstRender ? 4 : 0;
    renderSort();
    renderFilterGroups();
    renderLinks();
    renderPrefs();
    renderFeature();
    render({ animate: false });
    if (drawerOpen) {
      var first = $('prefs').querySelector('[role=radio][aria-checked=true]');
      if (first) first.focus();
    }
  }

  /* ---------- Drawer behaviour ---------- */
  var drawer = $('drawer'), scrim = $('scrim'), menuBtn = $('menuBtn');
  var drawerOpen = false, lastFocus = null, closeTimer = null;
  var outside = [$('topbar'), document.querySelector('main'), $('footer')];

  function openDrawer() {
    if (drawerOpen) return;
    drawerOpen = true;
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    var sbw = window.innerWidth - root.clientWidth;
    root.classList.add('is-locked');
    if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
    drawer.hidden = false; scrim.hidden = false;
    outside.forEach(function (n) { n.inert = true; });
    menuBtn.setAttribute('aria-expanded', 'true');
    void drawer.offsetWidth;
    root.classList.add('is-drawer-open');
    $('drawerBody').scrollTop = 0;
    $('drawerClose').focus({ preventScroll: true });
  }
  function closeDrawer(skipFocus) {
    if (!drawerOpen) return;
    drawerOpen = false;
    root.classList.remove('is-drawer-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    outside.forEach(function (n) { n.inert = false; });
    root.classList.remove('is-locked');
    document.body.style.paddingRight = '';
    closeTimer = setTimeout(function () { drawer.hidden = true; scrim.hidden = true; }, reduceMotion.matches ? 0 : 500);
    if (!skipFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', function () { drawerOpen ? closeDrawer() : openDrawer(); });
  $('drawerClose').addEventListener('click', function () { closeDrawer(); });
  scrim.addEventListener('click', function () { closeDrawer(); });
  $('clearAll').addEventListener('click', function () { state.filters.clear(); render({ animate: false }); $('filterGroups').querySelector('.chip').focus(); });
  $('showResults').addEventListener('click', function () {
    closeDrawer(true);
    var target = $('controls');
    var top = target.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(root).scrollPaddingTop || 0);
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    $('catalog').focus({ preventScroll: true });
  });
  document.addEventListener('keydown', function (e) {
    if (!drawerOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key === 'Tab') {
      var f = Array.prototype.filter.call(drawer.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])'),
        function (n) { return !n.disabled && n.offsetParent !== null && n.tabIndex !== -1; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  $('emptyClear').addEventListener('click', function () { clearAll(); q.focus(); });

  /* ---------- Boot ---------- */
  eagerLeft = 4;
  placeSearch();
  applyTheme();
  root.dataset.text = state.text;
  applyLang();
  eagerLeft = 0;
})();
