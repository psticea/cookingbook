(() => {
  'use strict';

  const data = window.COOKBOOK_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  if (!data || !Array.isArray(data.recipes)) {
    const results = $('#results');
    if (results) results.innerHTML = '<p role="alert">Cookbook data could not be loaded.</p>';
    return;
  }

  const proposalCopy = {
    en: {
      skipToRecipes: 'Skip to recipes',
      searchLabel: 'Search title',
      searchPlaceholder: 'Type 2+ letters',
      proposalLabel: 'Homepage proposal · Precision Grid',
      title: 'Recipe index engineered for repeat cooking.',
      thesis: 'Thirty-three recipes, eight categories, no ornament beyond the grid. Filter, sort, and read the collection as a precise cooking system.',
      matching: 'Matching',
      activeFilters: 'Active filters',
      allClear: 'None',
      allRecipes: 'All recipes',
      noMatches: 'No matching strata.',
      noMatchesMessage: 'The current search and filters produce an empty index. Clear them and the full cookbook returns.',
      backToTop: 'Back to top',
      footerNote: 'Static proposal using the real catalogue.',
      opensRecipe: 'Open recipe',
      selectedFilter: 'Selected filter',
      removeFilter: 'Remove filter',
      partialShort: 'Known subtotal',
      unavailableShort: 'Unavailable',
      priceLegend: '~ marks known subtotal pricing; unmarked prices include all ingredient costs.'
    },
    ro: {
      skipToRecipes: 'Sari la rețete',
      searchLabel: 'Caută titlu',
      searchPlaceholder: 'Scrie minimum 2 litere',
      proposalLabel: 'Propunere homepage · Precision Grid',
      title: 'Index de rețete proiectat pentru gătit repetat.',
      thesis: 'Treizeci și trei de rețete, opt categorii, fără ornament în afara grilei. Filtrează, sortează și citește colecția ca pe un sistem precis de gătit.',
      matching: 'Rezultate',
      activeFilters: 'Filtre active',
      allClear: 'Niciunul',
      allRecipes: 'Toate rețetele',
      noMatches: 'Niciun strat potrivit.',
      noMatchesMessage: 'Căutarea și filtrele curente produc un index gol. Șterge-le și întreaga colecție revine.',
      backToTop: 'Înapoi sus',
      footerNote: 'Propunere statică folosind catalogul real.',
      opensRecipe: 'Deschide rețeta',
      selectedFilter: 'Filtru selectat',
      removeFilter: 'Elimină filtrul',
      partialShort: 'Subtotal cunoscut',
      unavailableShort: 'Indisponibil',
      priceLegend: '~ marchează subtotalul cunoscut; prețurile fără marcaj includ toate ingredientele.'
    }
  };

  const storageKey = 'homepage-v2:proposal-03:precision-grid';
  const categoryMap = new Map(data.categories.map((category) => [category.id, category]));
  const categoryTotals = new Map(data.categories.map((category) => [
    category.id,
    data.recipes.filter((recipe) => recipe.category === category.id).length
  ]));
  const filterTypes = ['meatType', 'cookType', 'ingredient'];

  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
  } catch {
    saved = {};
  }

  const state = {
    lang: saved.lang === 'ro' ? 'ro' : 'en',
    theme: saved.theme === 'dark' ? 'dark' : 'light',
    size: saved.size === 'large' ? 'large' : 'normal',
    query: '',
    selectedFilters: new Set(),
    grouped: saved.grouped === false ? false : true,
    sortField: ['name', 'time', 'price'].includes(saved.sortField) ? saved.sortField : 'name',
    sortDir: saved.sortDir === 'desc' ? 'desc' : 'asc',
    drawerOpen: false,
    lastFocused: null
  };

  const locale = () => (state.lang === 'ro' ? 'ro-RO' : 'en-GB');
  const tr = (key, fallback = key) => {
    const table = data.translations[state.lang] || {};
    return table[key] || proposalCopy[state.lang][key] || fallback;
  };
  const local = (value) => value?.[state.lang] || value?.en || '';
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
  const normalize = (value) => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        lang: state.lang,
        theme: state.theme,
        size: state.size,
        grouped: state.grouped,
        sortField: state.sortField,
        sortDir: state.sortDir
      }));
    } catch {
      // Preferences are nonessential in the static mock.
    }
  }

  function formatPrice(recipe) {
    if (recipe.priceStatus === 'unavailable' || recipe.price === null) return '—';
    return new Intl.NumberFormat(locale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(recipe.price);
  }

  function priceLabel(recipe) {
    if (recipe.priceStatus === 'unavailable' || recipe.price === null) {
      return tr('costUnavailable');
    }

    if (recipe.priceStatus === 'partial') {
      return `${tr('partialEstimate')}: ${tr('knownSubtotal')} ${formatPrice(recipe)} ${tr('perServing')}`;
    }

    return `${tr('estimatedCost')}: ${formatPrice(recipe)} ${tr('perServing')}`;
  }

  function getFilteredRecipes() {
    const query = normalize(state.query);
    const selected = Array.from(state.selectedFilters);
    const collator = new Intl.Collator(state.lang, { sensitivity: 'base', numeric: true });

    const filtered = data.recipes.filter((recipe) => {
      if (query.length >= 2 && !normalize(local(recipe.title)).includes(query)) return false;
      if (selected.length && !selected.every((filterId) => recipe.keywords.includes(filterId))) return false;
      return true;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (state.sortField === 'name') {
        comparison = collator.compare(local(a.title), local(b.title));
      } else if (state.sortField === 'time') {
        comparison = a.minutes - b.minutes;
      } else {
        const aMissing = a.priceStatus === 'unavailable' || a.price === null;
        const bMissing = b.priceStatus === 'unavailable' || b.price === null;
        if (aMissing !== bMissing) return aMissing ? 1 : -1;
        comparison = (a.price || 0) - (b.price || 0);
      }

      const directed = comparison * (state.sortDir === 'asc' ? 1 : -1);
      return directed || collator.compare(local(a.title), local(b.title));
    });

    return filtered;
  }

  function renderStaticCopy() {
    document.documentElement.lang = state.lang;
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.size = state.size;
    document.title = `Precision Grid — ${data.brand}`;

    $$('[data-i18n]').forEach((node) => {
      node.textContent = tr(node.dataset.i18n, node.textContent);
    });
    $$('[data-copy]').forEach((node) => {
      node.textContent = tr(node.dataset.copy, node.textContent);
    });

    const search = $('#search');
    search.placeholder = tr('searchPlaceholder');
    $('.brand').setAttribute('aria-label', `${data.brand} — ${tr('home')}`);
    $('.sort-options').setAttribute('aria-label', `${tr('sortBy')} ${tr('recipes').toLowerCase()}`);
    $('#results').setAttribute('aria-label', tr('recipes'));
    $('#drawer-categories').setAttribute('aria-label', tr('categories'));
    $$('.more-links a').forEach((link) => {
      link.href = data.appBase + link.dataset.route;
    });
  }

  function renderPreferences() {
    $$('[data-pref="lang"]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.value === state.lang));
    });
    $$('[data-pref="theme"]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.value === state.theme));
    });
    $$('[data-pref="size"]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.value === state.size));
    });
  }

  function renderFilters() {
    const grouped = filterTypes.map((type) => {
      const filters = data.filters
        .filter((filter) => filter.type === type)
        .slice(0, type === 'ingredient' ? 12 : undefined);
      const chips = filters.map((filter) => {
        const pressed = state.selectedFilters.has(filter.id);
        return `<button type="button" class="filter-chip" data-filter="${escapeHtml(filter.id)}" aria-pressed="${pressed}" aria-label="${escapeHtml(`${tr('filter')}: ${local(filter.label)}`)}">${escapeHtml(local(filter.label))}</button>`;
      }).join('');
      return `<div class="filter-group">
        <h4 class="filter-group-title">${escapeHtml(tr(type))}</h4>
        <div class="filter-chip-list">${chips}</div>
      </div>`;
    }).join('');

    $('#filter-groups').innerHTML = grouped;
    $$('[data-action="clear-filters"]').forEach((button) => {
      button.hidden = state.selectedFilters.size === 0;
    });
  }

  function renderDrawerCategories() {
    $('#drawer-categories').innerHTML = data.categories.map((category, index) => (
      `<button type="button" class="category-link" data-category="${escapeHtml(category.id)}">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <span>${escapeHtml(local(category.name))}</span>
        <span>${String(categoryTotals.get(category.id) || 0).padStart(2, '0')}</span>
      </button>`
    )).join('');
  }

  function renderActiveFilters() {
    const active = [];
    if (state.query.trim().length >= 2) {
      active.push({ type: 'query', id: 'query', label: `${tr('searchLabel')}: ${state.query.trim()}` });
    }
    data.filters.forEach((filter) => {
      if (state.selectedFilters.has(filter.id)) {
        active.push({ type: 'filter', id: filter.id, label: local(filter.label) });
      }
    });

    $('#active-filters').innerHTML = active.length
      ? active.map((item) => `<button type="button" class="active-chip" data-remove="${escapeHtml(item.id)}" aria-label="${escapeHtml(`${tr('removeFilter')}: ${item.label}`)}">${escapeHtml(item.label)}<span aria-hidden="true">×</span></button>`).join('')
      : `<span class="micro-label">${escapeHtml(tr('allClear'))}</span>`;

    $$('[data-action="clear-all"]').forEach((button) => {
      button.hidden = !active.length;
    });
  }

  function recipeCard(recipe, index) {
    const title = local(recipe.title);
    const priceClass = recipe.priceStatus === 'unavailable' || recipe.price === null
      ? 'price--unavailable'
      : recipe.priceStatus === 'partial'
        ? 'price--partial'
        : 'price--complete';
    const priceTerm = tr('price');
    const pricePrefix = recipe.priceStatus === 'partial'
      ? `<span class="partial-prefix" aria-hidden="true">~</span>`
      : '';
    const loading = index < 6 ? 'eager' : 'lazy';

    return `<a class="recipe-card" href="${escapeHtml(data.recipeBase + recipe.id)}" data-recipe-id="${escapeHtml(recipe.id)}" aria-label="${escapeHtml(`${tr('opensRecipe')}: ${title}`)}">
      <img class="recipe-photo" src="${escapeHtml('../../../' + recipe.image)}" alt="${escapeHtml(title)}" loading="${loading}" decoding="async">
      <div class="recipe-body">
        <h3 class="recipe-title">${escapeHtml(title)}</h3>
        <dl class="metric-line" aria-label="${escapeHtml(`${tr('prepTime')}; ${tr('estimatedCost')}`)}">
          <div class="metric">
            <dt>${escapeHtml(tr('prepTimeShort'))}</dt>
            <dd><span class="metric-number">${recipe.minutes}</span><span class="metric-unit">min</span></dd>
          </div>
          <div class="metric ${priceClass}" title="${escapeHtml(priceLabel(recipe))}">
            <dt>${escapeHtml(priceTerm)}</dt>
            <dd aria-label="${escapeHtml(priceLabel(recipe))}">${pricePrefix}<span class="metric-number">${escapeHtml(formatPrice(recipe))}</span><span class="metric-unit">RON</span></dd>
          </div>
        </dl>
      </div>
    </a>`;
  }

  function sectionMarkup(category, recipes, categoryIndex) {
    return `<section class="category-section" id="category-${escapeHtml(category.id)}" data-category-section="${escapeHtml(category.id)}" aria-labelledby="heading-${escapeHtml(category.id)}">
      <header class="category-head">
        <span class="category-index">${String(categoryIndex + 1).padStart(2, '0')}</span>
        <h2 id="heading-${escapeHtml(category.id)}">${escapeHtml(local(category.name))}</h2>
        <span class="category-count">${String(recipes.length).padStart(2, '0')} ${escapeHtml(tr(recipes.length === 1 ? 'recipe' : 'recipes').toLowerCase())}</span>
      </header>
      <div class="recipe-grid">${recipes.map(recipeCard).join('')}</div>
    </section>`;
  }

  function renderResults() {
    const recipes = getFilteredRecipes();
    $('#result-count').innerHTML = `${recipes.length}<span> / ${data.recipes.length}</span>`;

    const groupToggle = $('[data-action="toggle-group"]');
    groupToggle.setAttribute('aria-checked', String(state.grouped));

    $$('.sort-button').forEach((button) => {
      const active = button.dataset.sort === state.sortField;
      button.setAttribute('aria-pressed', String(active));
      const direction = button.querySelector('.sort-direction');
      direction.textContent = active ? (state.sortDir === 'asc' ? '↑' : '↓') : '↕';
      button.setAttribute('aria-label', `${button.textContent.trim()} ${active ? tr(state.sortDir === 'asc' ? 'ascending' : 'descending') : ''}`.trim());
    });

    renderActiveFilters();
    renderFilters();

    if (!recipes.length) {
      $('#results').innerHTML = `<section class="empty-state" aria-live="polite">
        <h2>${escapeHtml(tr('noMatches'))}</h2>
        <p>${escapeHtml(tr('noMatchesMessage'))}</p>
        <button type="button" data-action="clear-all">${escapeHtml(tr('clearFilters'))}</button>
      </section>`;
      return;
    }

    if (!state.grouped) {
      $('#results').innerHTML = `<section class="category-section" data-flat-results aria-labelledby="flat-heading">
        <header class="category-head">
          <span class="category-index">Σ</span>
          <h2 id="flat-heading">${escapeHtml(tr('allRecipes'))}</h2>
          <span class="category-count">${String(recipes.length).padStart(2, '0')} ${escapeHtml(tr('recipes').toLowerCase())}</span>
        </header>
        <div class="recipe-grid">${recipes.map(recipeCard).join('')}</div>
      </section>`;
      return;
    }

    $('#results').innerHTML = data.categories.map((category, index) => {
      const categoryRecipes = recipes.filter((recipe) => recipe.category === category.id);
      return categoryRecipes.length ? sectionMarkup(category, categoryRecipes, index) : '';
    }).join('');
  }

  function renderAll() {
    renderStaticCopy();
    renderPreferences();
    renderDrawerCategories();
    renderResults();
    persist();
  }

  function clearAll() {
    state.query = '';
    state.selectedFilters.clear();
    $('#search').value = '';
    renderResults();
  }

  function setDrawer(open) {
    state.drawerOpen = open;
    const drawer = $('#side-drawer');
    const backdrop = $('.drawer-backdrop');
    const menuButton = $('[data-action="open-menu"]');

    if (open) {
      state.lastFocused = document.activeElement;
      backdrop.hidden = false;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      menuButton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('drawer-open');
      setTimeout(() => $('.icon-button', drawer).focus(), 0);
    } else {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('drawer-open');
      backdrop.hidden = true;
      if (state.lastFocused && typeof state.lastFocused.focus === 'function') state.lastFocused.focus();
    }
  }

  function focusableInDrawer() {
    return $$('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])', $('#side-drawer'))
      .filter((element) => element.offsetParent !== null || element === document.activeElement);
  }

  function scrollToCategory(categoryId) {
    if (!state.grouped) {
      state.grouped = true;
      renderResults();
    }
    setDrawer(false);
    requestAnimationFrame(() => {
      const section = document.getElementById(`category-${categoryId}`);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.addEventListener('click', (event) => {
    const actionNode = event.target.closest('[data-action]');
    if (actionNode) {
      const action = actionNode.dataset.action;
      if (action === 'open-menu') setDrawer(true);
      if (action === 'close-menu') setDrawer(false);
      if (action === 'toggle-group') {
        state.grouped = !state.grouped;
        renderResults();
      }
      if (action === 'clear-all') clearAll();
      if (action === 'clear-filters') {
        state.selectedFilters.clear();
        renderResults();
      }
      if (action === 'top') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) {
      const id = filterButton.dataset.filter;
      if (state.selectedFilters.has(id)) state.selectedFilters.delete(id);
      else state.selectedFilters.add(id);
      renderResults();
    }

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
      const id = removeButton.dataset.remove;
      if (id === 'query') {
        state.query = '';
        $('#search').value = '';
      } else {
        state.selectedFilters.delete(id);
      }
      renderResults();
    }

    const sortButton = event.target.closest('[data-sort]');
    if (sortButton) {
      const field = sortButton.dataset.sort;
      if (state.sortField === field) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      else {
        state.sortField = field;
        state.sortDir = 'asc';
      }
      renderResults();
      persist();
    }

    const categoryButton = event.target.closest('[data-category]');
    if (categoryButton) scrollToCategory(categoryButton.dataset.category);

    const prefButton = event.target.closest('[data-pref]');
    if (prefButton) {
      const pref = prefButton.dataset.pref;
      const value = prefButton.dataset.value;
      if (pref === 'lang') state.lang = value;
      if (pref === 'theme') state.theme = value;
      if (pref === 'size') state.size = value;
      renderAll();
    }
  });

  $('#search').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderResults();
  });

  document.addEventListener('keydown', (event) => {
    if (!state.drawerOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setDrawer(false);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = focusableInDrawer();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  renderAll();
})();
