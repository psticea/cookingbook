(() => {
  'use strict';

  const data = window.COOKBOOK_DATA;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const storeKey = 'pauls-cookbook:homepage-v2:proposal-02';
  const canStore = (() => {
    try {
      const key = `${storeKey}:probe`;
      window.localStorage.setItem(key, '1');
      window.localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  })();

  const proposalCopy = {
    en: {
      tagline: 'No ads. Just dinner.',
      surfaceLabel: 'Proposal 02 · Tactile Depth',
      heroTitle: 'A cinematic shelf for 33 real recipes.',
      heroText: 'Dark surfaces, warm copper controls, glowing photography, and a browsing cockpit that stays close without stealing the meal.',
      searchLabel: 'Search recipes by title',
      clearSearch: 'Clear search',
      selectedCount: count => `${count} selected`,
      jumpLabel: 'Jump to section',
      moreLabel: 'Reference',
      prefsLabel: 'Make it yours',
      drawerKicker: 'Control surface',
      footerText: 'Built as a static design mock from the real catalogue.',
      backToTop: 'Back to top',
      allShown: 'showing',
      of: 'of',
      clearActive: 'Clear search and filters',
      priceUnavailableShort: '—',
      completeShort: 'Estimate',
      partialShort: 'Known subtotal',
      priceSuffix: 'serving',
      sectionRecipes: count => `${count} ${count === 1 ? 'recipe' : 'recipes'}`,
      minuteUnit: 'min',
      ronUnit: 'RON',
      categoryCount: count => `${count} recipes`,
      openRecipe: 'Open recipe',
      sortLabel: (field, dir) => `Sort by ${field}, ${dir}`,
      noFilters: 'No filters selected',
      remove: 'Remove',
      priceLegend: '~ marks a known subtotal; — means cost unavailable.'
    },
    ro: {
      tagline: 'Fără reclame. Doar cină.',
      surfaceLabel: 'Propunere 02 · Tactile Depth',
      heroTitle: 'Un raft cinematic pentru 33 de rețete reale.',
      heroText: 'Suprafețe întunecate, controale cupru, fotografii luminoase și un cockpit de navigare care rămâne aproape fără să acopere mâncarea.',
      searchLabel: 'Caută rețete după titlu',
      clearSearch: 'Șterge căutarea',
      selectedCount: count => `${count} selectate`,
      jumpLabel: 'Sari la secțiune',
      moreLabel: 'Referințe',
      prefsLabel: 'Personalizează',
      drawerKicker: 'Panou de control',
      footerText: 'Mock static construit din catalogul real.',
      backToTop: 'Înapoi sus',
      allShown: 'afișate',
      of: 'din',
      clearActive: 'Șterge căutarea și filtrele',
      priceUnavailableShort: '—',
      completeShort: 'Estimare',
      partialShort: 'Subtotal cunoscut',
      priceSuffix: 'porție',
      sectionRecipes: count => `${count} ${count === 1 ? 'rețetă' : 'rețete'}`,
      minuteUnit: 'min',
      ronUnit: 'RON',
      categoryCount: count => `${count} rețete`,
      openRecipe: 'Deschide rețeta',
      sortLabel: (field, dir) => `Sortează după ${field}, ${dir}`,
      noFilters: 'Niciun filtru selectat',
      remove: 'Elimină',
      priceLegend: '~ marchează subtotalul cunoscut; — înseamnă cost indisponibil.'
    }
  };

  const translationFallbacks = {
    en: {
      searchPlaceholder: 'Search recipes...'
    },
    ro: {
      searchPlaceholder: 'Caută rețete...'
    }
  };

  const warnedMissingTranslations = new Set();
  const state = readState();
  let lastFocus = null;
  let closeTimer = 0;

  function readState() {
    let saved = {};
    if (canStore) {
      try { saved = JSON.parse(window.localStorage.getItem(storeKey) || '{}') || {}; } catch (_) { saved = {}; }
    }
    return {
      lang: saved.lang === 'ro' ? 'ro' : 'en',
      theme: saved.theme === 'light' ? 'light' : 'dark',
      textSize: saved.textSize === 'large' ? 'large' : 'normal',
      search: '',
      selectedFilters: new Set(),
      grouped: true,
      sortField: 'name',
      sortDirections: {
        name: saved.nameDirection === 'desc' ? 'desc' : 'asc',
        minutes: saved.minutesDirection === 'desc' ? 'desc' : 'asc',
        price: saved.priceDirection === 'desc' ? 'desc' : 'asc'
      }
    };
  }

  function saveState() {
    if (!canStore) return;
    try {
      window.localStorage.setItem(storeKey, JSON.stringify({
        lang: state.lang,
        theme: state.theme,
        textSize: state.textSize,
        nameDirection: state.sortDirections.name,
        minutesDirection: state.sortDirections.minutes,
        priceDirection: state.sortDirections.price
      }));
    } catch (_) { /* Preference persistence is optional. */ }
  }

  function t(key) {
    const catalogueValue = data.translations[state.lang] && data.translations[state.lang][key];
    const fallbackValue = translationFallbacks[state.lang] && translationFallbacks[state.lang][key];
    const proposalValue = proposalCopy[state.lang] && proposalCopy[state.lang][key];
    if (catalogueValue !== undefined) return catalogueValue;
    if (fallbackValue !== undefined) return fallbackValue;
    if (proposalValue !== undefined) return typeof proposalValue === 'function' ? proposalValue() : proposalValue;
    if (!warnedMissingTranslations.has(key) && window.console && typeof window.console.warn === 'function') {
      warnedMissingTranslations.add(key);
      window.console.warn(`Missing translation for "${key}"`);
    }
    return humanizeKey(key);
  }

  function c(key, ...args) {
    const value = proposalCopy[state.lang][key];
    if (value !== undefined) return typeof value === 'function' ? value(...args) : value;
    if (!warnedMissingTranslations.has(key) && window.console && typeof window.console.warn === 'function') {
      warnedMissingTranslations.add(key);
      window.console.warn(`Missing proposal copy for "${key}"`);
    }
    return humanizeKey(key);
  }

  function humanizeKey(key) {
    return String(key).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, char => char.toUpperCase());
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function normalize(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(state.lang === 'ro' ? 'ro-RO' : 'en-GB').trim();
  }

  function locale() {
    return state.lang === 'ro' ? 'ro-RO' : 'en-GB';
  }

  function formatPrice(value) {
    return Number(value).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function categoryById(id) {
    return data.categories.find(category => category.id === id);
  }

  function filterById(id) {
    return data.filters.find(filter => filter.id === id);
  }

  function imageSrc(recipe) {
    return `../../../${recipe.image}`;
  }

  function isUnavailable(recipe) {
    return recipe.priceStatus === 'unavailable' || recipe.price === null || recipe.price === undefined;
  }

  function priceLabel(recipe) {
    if (isUnavailable(recipe)) return t('costUnavailable');
    const amount = formatPrice(recipe.price);
    if (recipe.priceStatus === 'partial') {
      const missing = recipe.unpricedCount > 0 ? ` · ${recipe.unpricedCount} ${t(recipe.unpricedCount === 1 ? 'ingredientNotPriced' : 'ingredientsNotPriced').replace('{count}', recipe.unpricedCount)}` : '';
      return `${t('partialEstimate')} · ${t('knownSubtotal')}: ${amount} ${t('perServing')}${missing}`;
    }
    return `${t('estimatedCost')}: ${amount} ${t('perServing')}`;
  }

  function shortPriceStatus(recipe) {
    if (isUnavailable(recipe)) return t('costUnavailable');
    return recipe.priceStatus === 'partial' ? t('knownSubtotal') : t('estimatedCost');
  }

  function priceNumberHTML(recipe) {
    if (isUnavailable(recipe)) return `<span class="number">—</span><span class="unit"></span>`;
    const mark = recipe.priceStatus === 'partial' ? '<span class="price-mark" aria-hidden="true">~</span>' : '';
    return `${mark}<span class="number">${escapeHTML(formatPrice(recipe.price))}</span><span class="unit">${escapeHTML(c('ronUnit'))}</span>`;
  }

  function getFilteredRecipes() {
    const query = state.search.trim();
    return data.recipes.filter(recipe => {
      if (query.length >= 2 && !normalize(recipe.title[state.lang]).includes(normalize(query))) return false;
      for (const filterId of state.selectedFilters) {
        if (!recipe.keywords.includes(filterId)) return false;
      }
      return true;
    });
  }

  function sortRecipes(recipes) {
    const field = state.sortField;
    const direction = state.sortDirections[field];
    const sign = direction === 'asc' ? 1 : -1;
    const collator = new Intl.Collator(locale(), { numeric: true, sensitivity: 'base' });
    return [...recipes].sort((a, b) => {
      const nameCompare = collator.compare(a.title[state.lang], b.title[state.lang]);
      if (field === 'name') return nameCompare * sign;
      if (field === 'minutes') return ((a.minutes || 0) - (b.minutes || 0)) * sign || nameCompare;
      if (field === 'price') {
        const aUnavailable = isUnavailable(a);
        const bUnavailable = isUnavailable(b);
        if (aUnavailable && bUnavailable) return nameCompare;
        if (aUnavailable) return 1;
        if (bUnavailable) return -1;
        return (Number(a.price) - Number(b.price)) * sign || nameCompare;
      }
      return 0;
    });
  }

  function groupedRecipes(recipes) {
    return data.categories.map(category => ({
      category,
      recipes: recipes.filter(recipe => recipe.category === category.id)
    })).filter(group => group.recipes.length > 0);
  }

  function renderHeroPhotos() {
    const root = $('#hero-photo-stack');
    root.innerHTML = data.recipes.slice(14, 17).map(recipe => `
      <div class="hero-photo"><img src="${escapeHTML(imageSrc(recipe))}" alt="" loading="eager" decoding="async"></div>
    `).join('');
    $('#hero-count').textContent = String(data.recipes.length);
  }

  function applyPreferences() {
    document.documentElement.lang = state.lang;
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.textSize = state.textSize;
    $$('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === state.lang)));
    $$('[data-theme]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === state.theme)));
    $$('[data-text]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.text === state.textSize)));
  }

  function translateStatic() {
    $$('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    $$('[data-copy]').forEach(element => { element.textContent = c(element.dataset.copy); });
    $$('[data-copy-aria]').forEach(element => { element.setAttribute('aria-label', c(element.dataset.copyAria)); });
    $$('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
    $('#recipe-search').placeholder = t('searchPlaceholder');
    $('#recipe-search').setAttribute('aria-label', c('searchLabel'));
    $('#category-list').setAttribute('aria-label', t('categories'));
    $('#more-list').setAttribute('aria-label', t('more'));
    $('#open-drawer').setAttribute('aria-expanded', String(isDrawerOpen()));
  }

  function renderSortControls() {
    $$('.sort-chip').forEach(button => {
      const field = button.dataset.sortField;
      const active = field === state.sortField;
      const direction = state.sortDirections[field];
      button.setAttribute('aria-pressed', String(active));
      button.dataset.direction = direction;
      button.querySelector('b').textContent = direction === 'asc' ? '↑' : '↓';
      const label = button.querySelector('span').textContent;
      button.setAttribute('aria-label', c('sortLabel', label, t(direction === 'asc' ? 'ascending' : 'descending')));
    });
  }

  function renderFilterGroups() {
    const grouped = ['meatType', 'cookType', 'ingredient'].map(type => {
      const filters = data.filters.filter(filter => filter.type === type).slice(0, type === 'ingredient' ? 12 : Infinity);
      const chips = filters.map(filter => {
        const pressed = state.selectedFilters.has(filter.id);
        return `<button type="button" class="filter-chip" data-filter-id="${escapeHTML(filter.id)}" aria-pressed="${pressed}">${escapeHTML(filter.label[state.lang])}</button>`;
      }).join('');
      return `<fieldset class="filter-group"><legend>${escapeHTML(t(type))}</legend><div class="chip-wrap">${chips}</div></fieldset>`;
    }).join('');
    $('#filter-groups').innerHTML = grouped;
    $('#selected-filter-count').textContent = state.selectedFilters.size ? c('selectedCount', state.selectedFilters.size) : c('noFilters');
    $('#drawer-clear-filters').disabled = state.selectedFilters.size === 0;
  }

  function renderCategories() {
    $('#category-list').innerHTML = data.categories.map(category => {
      const count = data.recipes.filter(recipe => recipe.category === category.id).length;
      return `<button type="button" class="drawer-row" data-category-id="${escapeHTML(category.id)}"><span>${escapeHTML(category.name[state.lang])}</span><small>${count}</small></button>`;
    }).join('');
  }

  function renderMoreLinks() {
    const links = [
      { key: 'cookingBasics', href: `${data.appBase}cooking-basics` },
      { key: 'ingredientPrices', href: `${data.appBase}prices` },
      { key: 'about', href: `${data.appBase}about` }
    ];
    $('#more-list').innerHTML = links.map(link => `<a class="drawer-row" href="${escapeHTML(link.href)}"><span>${escapeHTML(t(link.key))}</span><span class="arrow" aria-hidden="true">↗</span></a>`).join('');
  }

  function recipeCard(recipe, index) {
    const category = categoryById(recipe.category);
    const categoryName = category ? category.name[state.lang] : '';
    const title = recipe.title[state.lang];
    const unavailable = isUnavailable(recipe);
    const priceState = unavailable ? 'unavailable' : recipe.priceStatus === 'partial' ? 'partial' : 'complete';
    const priceDescription = priceLabel(recipe);
    const loading = index < 4 ? 'eager' : 'lazy';
    const fetchPriority = index === 0 ? ' fetchpriority="high"' : '';
    return `<article class="recipe-card" data-recipe-id="${escapeHTML(recipe.id)}">
      <a class="recipe-link" href="${escapeHTML(data.recipeBase + recipe.id)}" aria-label="${escapeHTML(`${c('openRecipe')}: ${title}`)}">
        <div class="recipe-media">
          <img src="${escapeHTML(imageSrc(recipe))}" alt="${escapeHTML(title)}" loading="${loading}" decoding="async"${fetchPriority}>
        </div>
        <div class="recipe-body">
          <p class="recipe-kicker"><span>${escapeHTML(categoryName)}</span><code>${String(index + 1).padStart(2, '0')}</code></p>
          <h3 class="recipe-title">${escapeHTML(title)}</h3>
          <div class="recipe-meta">
            <span class="meta-pair"><span class="number">${recipe.minutes}</span><span class="unit">${escapeHTML(c('minuteUnit'))}</span></span>
            <span class="meta-pair price-measure ${priceState}" data-price-status="${priceState}" title="${escapeHTML(priceDescription)}" aria-label="${escapeHTML(priceDescription)}">${priceNumberHTML(recipe)}</span>
            ${unavailable ? `<span class="meta-note">${escapeHTML(t('costUnavailable'))}</span>` : ''}
            <span class="recipe-open" aria-hidden="true">↗</span>
          </div>
        </div>
      </a>
    </article>`;
  }

  function renderResults() {
    const filtered = getFilteredRecipes();
    const sorted = sortRecipes(filtered);
    $('#result-count').innerHTML = `<strong>${sorted.length}</strong> ${escapeHTML(c('of'))} ${data.recipes.length} ${escapeHTML(t('recipes').toLocaleLowerCase(locale()))}`;
    $('#group-toggle').setAttribute('aria-checked', String(state.grouped));
    $('#clear-search').hidden = state.search.length === 0;
    const root = $('#recipe-results');
    $('#empty-state').hidden = sorted.length !== 0;
    root.hidden = sorted.length === 0;

    if (sorted.length === 0) {
      root.innerHTML = '';
    } else if (state.grouped) {
      let renderedIndex = 0;
      root.innerHTML = groupedRecipes(sorted).map(group => {
        const cards = group.recipes.map(recipe => recipeCard(recipe, renderedIndex++)).join('');
        return `<section class="category-section" id="category-${escapeHTML(group.category.id)}" aria-labelledby="heading-${escapeHTML(group.category.id)}">
          <div class="section-head"><h2 id="heading-${escapeHTML(group.category.id)}">${escapeHTML(group.category.name[state.lang])}</h2><span class="section-count">${escapeHTML(c('sectionRecipes', group.recipes.length))}</span></div>
          <div class="recipe-grid">${cards}</div>
        </section>`;
      }).join('');
    } else {
      root.innerHTML = `<section class="category-section flat-section" aria-label="${escapeHTML(t('allRecipes'))}"><div class="recipe-grid">${sorted.map((recipe, index) => recipeCard(recipe, index)).join('')}</div></section>`;
    }

    syncGridColumnHint();
    renderActiveStrip();
    renderSortControls();
    renderFilterGroups();
  }

  function syncGridColumnHint() {
    const mobile = window.innerWidth <= 640;
    $$('.recipe-grid').forEach(grid => {
      grid.style.gridTemplateColumns = mobile ? 'repeat(2, minmax(0, 1fr))' : '';
    });
  }

  function renderActiveStrip() {
    const active = [];
    if (state.search.trim().length > 0) active.push({ type: 'search', id: 'search', label: `“${state.search.trim()}”` });
    state.selectedFilters.forEach(id => {
      const filter = filterById(id);
      if (filter) active.push({ type: 'filter', id, label: filter.label[state.lang] });
    });
    const strip = $('#active-strip');
    strip.hidden = active.length === 0;
    strip.innerHTML = active.map(item => `<span class="active-pill"><span>${escapeHTML(item.label)}</span><button type="button" data-remove-type="${item.type}" data-remove-id="${escapeHTML(item.id)}" aria-label="${escapeHTML(`${c('remove')} ${item.label}`)}">×</button></span>`).join('') + (active.length ? `<button class="text-button" type="button" id="clear-all-active">${escapeHTML(c('clearActive'))}</button>` : '');
  }

  function clearAll() {
    state.search = '';
    state.selectedFilters.clear();
    $('#recipe-search').value = '';
    renderAll();
  }

  function renderAll() {
    applyPreferences();
    translateStatic();
    renderHeroPhotos();
    renderCategories();
    renderMoreLinks();
    renderResults();
    saveState();
  }

  function isDrawerOpen() {
    return $('#side-drawer').classList.contains('is-open');
  }

  function focusableInDrawer() {
    return $$('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])', $('#side-drawer')).filter(element => element.offsetParent !== null || element === $('#side-drawer'));
  }

  function openDrawer() {
    window.clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    const drawer = $('#side-drawer');
    const backdrop = $('#drawer-backdrop');
    backdrop.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    $('#open-drawer').setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
      drawer.classList.add('is-open');
      const targets = focusableInDrawer();
      (targets[0] || drawer).focus();
    });
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    const drawer = $('#side-drawer');
    const backdrop = $('#drawer-backdrop');
    backdrop.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    $('#open-drawer').setAttribute('aria-expanded', 'false');
    closeTimer = window.setTimeout(() => { backdrop.hidden = true; }, 260);
    if (restoreFocus && lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function scrollToCategory(categoryId) {
    if (!state.grouped) {
      state.grouped = true;
      renderResults();
    }
    closeDrawer({ restoreFocus: false });
    window.setTimeout(() => {
      const target = $(`#category-${CSS.escape(categoryId)}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  function bindEvents() {
    $('#brand-home').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    $('#open-drawer').addEventListener('click', openDrawer);
    $('#close-drawer').addEventListener('click', () => closeDrawer());
    $('#drawer-backdrop').addEventListener('click', () => closeDrawer());
    $('#recipe-search').addEventListener('input', event => {
      state.search = event.target.value;
      renderResults();
    });
    $('#recipe-search').addEventListener('keydown', event => {
      if (event.key === 'Escape' && state.search) {
        state.search = '';
        event.currentTarget.value = '';
        renderResults();
      }
    });
    $('#clear-search').addEventListener('click', () => {
      state.search = '';
      $('#recipe-search').value = '';
      renderResults();
      $('#recipe-search').focus();
    });
    $('#sort-cluster').addEventListener('click', event => {
      const button = event.target.closest('[data-sort-field]');
      if (!button) return;
      const field = button.dataset.sortField;
      if (state.sortField === field) {
        state.sortDirections[field] = state.sortDirections[field] === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
      }
      renderResults();
      saveState();
    });
    $('#group-toggle').addEventListener('click', () => {
      state.grouped = !state.grouped;
      renderResults();
    });
    $('#filter-groups').addEventListener('click', event => {
      const button = event.target.closest('[data-filter-id]');
      if (!button) return;
      const id = button.dataset.filterId;
      if (state.selectedFilters.has(id)) state.selectedFilters.delete(id);
      else state.selectedFilters.add(id);
      renderResults();
    });
    $('#drawer-clear-filters').addEventListener('click', () => {
      state.selectedFilters.clear();
      renderResults();
    });
    $('#category-list').addEventListener('click', event => {
      const button = event.target.closest('[data-category-id]');
      if (!button) return;
      scrollToCategory(button.dataset.categoryId);
    });
    $('#language-toggle').addEventListener('click', event => {
      const button = event.target.closest('[data-lang]');
      if (!button) return;
      state.lang = button.dataset.lang;
      renderAll();
    });
    $('#theme-toggle').addEventListener('click', event => {
      const button = event.target.closest('[data-theme]');
      if (!button) return;
      state.theme = button.dataset.theme;
      renderAll();
    });
    $('#text-toggle').addEventListener('click', event => {
      const button = event.target.closest('[data-text]');
      if (!button) return;
      state.textSize = button.dataset.text;
      renderAll();
    });
    $('#active-strip').addEventListener('click', event => {
      if (event.target.closest('#clear-all-active')) {
        clearAll();
        return;
      }
      const button = event.target.closest('[data-remove-type]');
      if (!button) return;
      if (button.dataset.removeType === 'search') {
        state.search = '';
        $('#recipe-search').value = '';
      }
      if (button.dataset.removeType === 'filter') state.selectedFilters.delete(button.dataset.removeId);
      renderResults();
    });
    $('#empty-clear').addEventListener('click', clearAll);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && isDrawerOpen()) {
        event.preventDefault();
        closeDrawer();
      }
      if (event.key === 'Tab' && isDrawerOpen()) {
        const targets = focusableInDrawer();
        if (!targets.length) return;
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    window.addEventListener('scroll', () => {
      $('#control-dock').classList.toggle('is-condensed', window.scrollY > 120);
    }, { passive: true });
    window.addEventListener('resize', syncGridColumnHint, { passive: true });
  }

  function init() {
    bindEvents();
    renderAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
