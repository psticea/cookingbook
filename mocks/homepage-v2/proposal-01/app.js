(() => {
  'use strict';

  const data = window.COOKBOOK_DATA;
  const $ = (id) => document.getElementById(id);
  const storageKey = 'homepage-v2:proposal-01:editorial-gallery';

  const fallback = {
    ro: {
      skipToRecipes: 'Sari la rețete',
      mastheadCaption: 'Un index personal de farfurii de zi cu zi, baze de cămară și capitole lente de duminică.',
      contents: 'Cuprins',
      searchLabel: 'Caută după titlul rețetei',
      searchPlaceholder: 'Scrie cel puțin 2 litere…',
      currentSelection: 'Selecția curentă',
      proposalIndex: 'Index tipărit',
      drawerTitle: 'Cuprins / Index',
      meatType: 'Carne',
      cookType: 'Metodă',
      ingredient: 'Ingrediente',
      time: 'Timp',
      priceDirection: 'direcție',
      ascendingShort: 'Asc',
      descendingShort: 'Desc',
      active: 'activ',
      inactive: 'inactiv',
      remove: 'Elimină',
      clear: 'Șterge',
      clearAll: 'Resetează tot',
      partialNote: 'estimare parțială',
      categoryCount: 'rețete',
      noResultsTitle: 'Pagina rămâne goală.',
      noResultsBody: 'Elimină filtrele sau caută un alt titlu din colecție.',
      showAllRecipes: 'Arată toate rețetele'
    },
    en: {
      skipToRecipes: 'Skip to recipes',
      mastheadCaption: 'A personal index of weekday plates, pantry staples, and slow Sunday chapters.',
      contents: 'Contents',
      searchLabel: 'Search by recipe title',
      searchPlaceholder: 'Type at least 2 letters…',
      currentSelection: 'Current selection',
      proposalIndex: 'Printed index',
      drawerTitle: 'Contents / Index',
      meatType: 'Meat',
      cookType: 'Method',
      ingredient: 'Ingredients',
      time: 'Time',
      priceDirection: 'direction',
      ascendingShort: 'Asc',
      descendingShort: 'Desc',
      active: 'active',
      inactive: 'inactive',
      remove: 'Remove',
      clear: 'Clear',
      clearAll: 'Reset all',
      partialNote: 'partial estimate',
      categoryCount: 'recipes',
      noResultsTitle: 'The page stays blank.',
      noResultsBody: 'Clear filters or search for another title in the collection.',
      showAllRecipes: 'Show all recipes'
    }
  };

  const sortLabels = {
    name: 'sortByName',
    time: 'sortByPrepTime',
    price: 'sortByPrice'
  };
  const filterTypes = ['meatType', 'cookType', 'ingredient'];
  const categoryMap = new Map(data.categories.map((category) => [category.id, category]));
  const collators = {
    ro: new Intl.Collator('ro', { sensitivity: 'base', numeric: true }),
    en: new Intl.Collator('en', { sensitivity: 'base', numeric: true })
  };
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
  } catch {
    saved = {};
  }

  const state = {
    language: saved.language === 'en' ? 'en' : 'ro',
    theme: saved.theme === 'dark' ? 'dark' : 'light',
    textSize: saved.textSize === 'large' ? 'large' : 'normal',
    grouped: saved.grouped === false ? false : true,
    sortField: ['name', 'time', 'price'].includes(saved.sortField) ? saved.sortField : 'name',
    sortDirection: saved.sortDirection === 'desc' ? 'desc' : 'asc',
    query: '',
    filters: new Set(),
    drawerOpen: false,
    previousFocus: null
  };

  function t(key) {
    return (data.translations[state.language] && data.translations[state.language][key]) ||
      fallback[state.language][key] ||
      key;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function normalize(value) {
    return String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase(state.language);
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        language: state.language,
        theme: state.theme,
        textSize: state.textSize,
        grouped: state.grouped,
        sortField: state.sortField,
        sortDirection: state.sortDirection
      }));
    } catch {
      // Preferences remain session-local when storage is unavailable.
    }
  }

  function countByCategory(categoryId, recipes = data.recipes) {
    return recipes.filter((recipe) => recipe.category === categoryId).length;
  }

  function isUnavailable(recipe) {
    return recipe.priceStatus === 'unavailable' || recipe.price === null || Number.isNaN(Number(recipe.price));
  }

  function formatPrice(recipe) {
    if (isUnavailable(recipe)) {
      return {
        label: t('costUnavailable'),
        value: '—',
        note: '',
        marker: ''
      };
    }

    const value = Number(recipe.price).toFixed(2);
    if (recipe.priceStatus === 'partial') {
      return {
        label: t('knownSubtotal'),
        value,
        note: t('partialEstimate'),
        marker: '~'
      };
    }

    return {
      label: t('estimatedCost'),
      value,
      note: '',
      marker: ''
    };
  }

  function getFilteredRecipes() {
    const query = state.query.trim();
    const activeQuery = query.length >= 2 ? normalize(query) : '';
    const selected = Array.from(state.filters);

    return data.recipes.filter((recipe) => {
      if (activeQuery && !normalize(recipe.title[state.language]).includes(activeQuery)) {
        return false;
      }
      return selected.every((filterId) => recipe.keywords.includes(filterId));
    });
  }

  function sortRecipes(recipes) {
    const sign = state.sortDirection === 'desc' ? -1 : 1;
    const collator = collators[state.language];

    return [...recipes].sort((a, b) => {
      let result = 0;
      if (state.sortField === 'name') {
        result = collator.compare(a.title[state.language], b.title[state.language]);
      } else if (state.sortField === 'time') {
        result = a.minutes - b.minutes;
      } else if (state.sortField === 'price') {
        const aMissing = isUnavailable(a);
        const bMissing = isUnavailable(b);
        if (aMissing && !bMissing) return 1;
        if (!aMissing && bMissing) return -1;
        if (aMissing && bMissing) {
          result = 0;
        } else {
          result = Number(a.price) - Number(b.price);
        }
      }

      return (result * sign) || collator.compare(a.title[state.language], b.title[state.language]);
    });
  }

  function recipesForDisplay() {
    return sortRecipes(getFilteredRecipes());
  }

  function renderStaticLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
      node.setAttribute('aria-label', t(node.dataset.i18nAria));
    });
    $('search-input').placeholder = t('searchPlaceholder');
    document.querySelector('.brand-mark').setAttribute('aria-label', `${data.brand} ${t('home')}`);
    $('drawer-categories').setAttribute('aria-label', t('categories'));
    document.querySelectorAll('.footer-links, .more-links').forEach((nav) => {
      nav.setAttribute('aria-label', t('more'));
    });
  }

  function renderSortButtons() {
    const directionLabel = state.sortDirection === 'asc' ? t('ascending') : t('descending');
    const directionShort = state.sortDirection === 'asc' ? '↑' : '↓';
    document.querySelectorAll('[data-sort-field]').forEach((button) => {
      const field = button.dataset.sortField;
      const pressed = field === state.sortField;
      button.setAttribute('aria-pressed', String(pressed));
      button.setAttribute(
        'aria-label',
        `${t(sortLabels[field])}: ${directionLabel}; ${pressed ? t('active') : t('inactive')}`
      );
      button.innerHTML = `<span>${escapeHtml(t(sortLabels[field]))} ${directionShort}</span><span>${escapeHtml(directionLabel)}</span>`;
    });
  }

  function renderFilterGroups() {
    const groups = filterTypes.map((type) => {
      const filters = data.filters
        .filter((filter) => filter.type === type)
        .slice(0, type === 'ingredient' ? 12 : undefined);
      const chips = filters.map((filter) => {
        const active = state.filters.has(filter.id);
        return `<button class="chip-button" type="button" data-filter-id="${escapeHtml(filter.id)}" aria-pressed="${active}" aria-label="${escapeHtml(t('filter'))}: ${escapeHtml(filter.label[state.language])}">${escapeHtml(filter.label[state.language])}</button>`;
      }).join('');
      return `<div class="filter-group"><h4>${escapeHtml(t(type))}</h4><div class="chip-list">${chips}</div></div>`;
    }).join('');

    $('filter-groups').innerHTML = groups;
    $('clear-filters').disabled = state.filters.size === 0 && state.query.trim() === '';
  }

  function renderDrawerCategories() {
    $('drawer-categories').innerHTML = data.categories.map((category, index) => {
      const count = countByCategory(category.id);
      return `<button class="index-link" type="button" data-scroll-category="${escapeHtml(category.id)}"><strong>${escapeHtml(category.name[state.language])}</strong><span>${String(index + 1).padStart(2, '0')} / ${count}</span></button>`;
    }).join('');
  }

  function renderPreferences() {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.textSize = state.textSize;
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === state.language));
    });
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === state.theme));
    });
    document.querySelectorAll('[data-text-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.textChoice === state.textSize));
    });
    $('group-toggle').setAttribute('aria-checked', String(state.grouped));
  }

  function renderActiveLedger() {
    const active = [];
    if (state.query.trim().length >= 2) {
      active.push(`<button class="filter-pill" type="button" data-clear-search-pill><span>${escapeHtml(state.query.trim())}</span><span aria-hidden="true">×</span></button>`);
    }
    data.filters.forEach((filter) => {
      if (state.filters.has(filter.id)) {
        active.push(`<button class="filter-pill" type="button" data-remove-filter="${escapeHtml(filter.id)}"><span>${escapeHtml(filter.label[state.language])}</span><span aria-hidden="true">×</span></button>`);
      }
    });

    $('active-ledger').hidden = active.length === 0;
    $('active-ledger').innerHTML = active.join('') + (active.length ? `<button class="text-action" type="button" data-reset-all>${escapeHtml(t('clearAll'))}</button>` : '');
    $('clear-search').hidden = state.query.length === 0;
  }

  function recipeCard(recipe, index) {
    const price = formatPrice(recipe);
    const category = categoryMap.get(recipe.category);
    const loading = index < 6 ? 'eager' : 'lazy';
    const priceValue = `${price.marker}${price.value}`;
    const priceTitle = price.note ? `${price.label}: ${price.value} ${t('perServing')} (${price.note})` : `${price.label}: ${price.value} ${t('perServing')}`;
    return `
      <article class="recipe-card" data-recipe-id="${escapeHtml(recipe.id)}">
        <a class="recipe-link" href="${escapeHtml(data.recipeBase + recipe.id)}">
          <figure class="recipe-photo">
            <img src="../../../${escapeHtml(recipe.image)}" width="640" height="800" alt="${escapeHtml(recipe.title[state.language])}" loading="${loading}" decoding="async">
          </figure>
          <div class="recipe-body">
            <p class="recipe-category">${escapeHtml(category.name[state.language])}</p>
            <h3 class="recipe-title">${escapeHtml(recipe.title[state.language])}</h3>
            <dl class="recipe-meta" aria-label="${escapeHtml(t('recipe'))}">
              <div class="meta-item">
                <dt>${escapeHtml(t('time'))}</dt>
                <dd>${recipe.minutes} min</dd>
              </div>
              <div class="meta-item meta-item--price" title="${escapeHtml(priceTitle)}">
                <dt>${escapeHtml(isUnavailable(recipe) ? t('costUnavailable') : t('price'))}</dt>
                <dd>${escapeHtml(priceValue)}</dd>
              </div>
            </dl>
          </div>
        </a>
      </article>
    `;
  }

  function chapterMarkup(category, recipes, index) {
    return `
      <section class="chapter" id="category-${escapeHtml(category.id)}" aria-labelledby="heading-${escapeHtml(category.id)}" tabindex="-1">
        <div class="chapter-opener">
          <span class="chapter-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <h2 class="chapter-title" id="heading-${escapeHtml(category.id)}">${escapeHtml(category.name[state.language])}</h2>
          <span class="chapter-count">${recipes.length} ${escapeHtml(t('categoryCount'))}</span>
        </div>
        <div class="recipe-grid">${recipes.map(recipeCard).join('')}</div>
      </section>
    `;
  }

  function renderRecipes() {
    const recipes = recipesForDisplay();
    const countText = `${recipes.length} ${recipes.length === 1 ? t('recipe') : t('recipes')}`;
    $('result-count').textContent = countText;

    if (recipes.length === 0) {
      $('recipes').innerHTML = `
        <div class="empty-state">
          <p class="micro-label">${escapeHtml(t('noRecipesFound'))}</p>
          <h2>${escapeHtml(t('pantryEmpty'))}</h2>
          <p>${escapeHtml(t('pantryEmptyMessage') || t('noResultsBody'))}</p>
          <button class="primary-action" type="button" data-reset-all>${escapeHtml(t('clearFilters'))}</button>
        </div>
      `;
    } else if (state.grouped) {
      const priceLegend = `${t('price')}: ${t('perServing')}; ~ ${t('partialEstimate').toLocaleLowerCase(state.language)} (${t('knownSubtotal').toLocaleLowerCase(state.language)}).`;
      const chapters = data.categories.map((category, index) => {
        const group = recipes.filter((recipe) => recipe.category === category.id);
        return group.length ? chapterMarkup(category, group, index) : '';
      }).join('');
      $('recipes').innerHTML = chapters + `<p class="price-legend">${escapeHtml(priceLegend)}</p>`;
    } else {
      const priceLegend = `${t('price')}: ${t('perServing')}; ~ ${t('partialEstimate').toLocaleLowerCase(state.language)} (${t('knownSubtotal').toLocaleLowerCase(state.language)}).`;
      $('recipes').innerHTML = `<div class="recipe-grid recipe-grid--flat">${recipes.map(recipeCard).join('')}</div><p class="price-legend">${escapeHtml(priceLegend)}</p>`;
    }

    renderActiveLedger();
    renderSortButtons();
    renderFilterGroups();
  }

  function resetAll() {
    state.query = '';
    state.filters.clear();
    $('search-input').value = '';
    renderRecipes();
  }

  function setDrawer(open) {
    state.drawerOpen = open;
    $('drawer-backdrop').hidden = !open;
    $('side-drawer').hidden = !open;
    $('open-drawer').setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('drawer-open', open);

    if (open) {
      state.previousFocus = document.activeElement;
      window.setTimeout(() => $('close-drawer').focus({ preventScroll: true }), 0);
    } else if (state.previousFocus && typeof state.previousFocus.focus === 'function') {
      state.previousFocus.focus({ preventScroll: true });
      state.previousFocus = null;
    }
  }

  function drawerFocusable() {
    return Array.from($('side-drawer').querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.closest('[hidden]') && (element.getClientRects().length > 0 || element === document.activeElement));
  }

  function handleDrawerKeydown(event) {
    if (!state.drawerOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setDrawer(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = drawerFocusable();
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
  }

  function scrollToCategory(categoryId) {
    if (!state.grouped) {
      state.grouped = true;
      renderPreferences();
      renderRecipes();
      persist();
    }

    setDrawer(false);
    window.setTimeout(() => {
      const target = $(`category-${categoryId}`);
      if (target) {
        target.scrollIntoView({
          behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
          block: 'start'
        });
        target.focus({ preventScroll: true });
      }
    }, 40);
  }

  function bindEvents() {
    document.querySelectorAll('[data-app-link]').forEach((link) => {
      link.href = data.appBase + link.dataset.appLink;
    });

    $('search-input').addEventListener('input', (event) => {
      state.query = event.target.value;
      renderRecipes();
    });

    $('clear-search').addEventListener('click', () => {
      state.query = '';
      $('search-input').value = '';
      renderRecipes();
      $('search-input').focus();
    });

    $('group-toggle').addEventListener('click', () => {
      state.grouped = !state.grouped;
      renderPreferences();
      renderRecipes();
      persist();
    });

    $('sort-board').addEventListener('click', (event) => {
      const button = event.target.closest('[data-sort-field]');
      if (!button) return;
      const field = button.dataset.sortField;
      if (state.sortField === field) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
      }
      renderRecipes();
      persist();
    });

    $('filter-groups').addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter-id]');
      if (!button) return;
      const id = button.dataset.filterId;
      if (state.filters.has(id)) state.filters.delete(id);
      else state.filters.add(id);
      renderRecipes();
    });

    $('active-ledger').addEventListener('click', (event) => {
      const remove = event.target.closest('[data-remove-filter]');
      if (remove) {
        state.filters.delete(remove.dataset.removeFilter);
        renderRecipes();
        return;
      }
      if (event.target.closest('[data-clear-search-pill]')) {
        state.query = '';
        $('search-input').value = '';
        renderRecipes();
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-reset-all]')) {
        resetAll();
      }
    });

    $('clear-filters').addEventListener('click', resetAll);
    $('open-drawer').addEventListener('click', () => setDrawer(true));
    $('close-drawer').addEventListener('click', () => setDrawer(false));
    $('drawer-backdrop').addEventListener('click', () => setDrawer(false));
    document.addEventListener('keydown', handleDrawerKeydown);

    $('drawer-categories').addEventListener('click', (event) => {
      const button = event.target.closest('[data-scroll-category]');
      if (button) scrollToCategory(button.dataset.scrollCategory);
    });

    document.querySelectorAll('[data-language]').forEach((button) => {
      button.addEventListener('click', () => {
        state.language = button.dataset.language;
        renderAll();
        persist();
      });
    });

    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        state.theme = button.dataset.themeChoice;
        renderPreferences();
        persist();
      });
    });

    document.querySelectorAll('[data-text-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        state.textSize = button.dataset.textChoice;
        renderPreferences();
        persist();
      });
    });

    document.addEventListener('keydown', (event) => {
      const isTyping = event.target.matches('input, textarea, select, [contenteditable="true"]');
      if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        $('search-input').focus();
      }
    });
  }

  function renderAll() {
    renderStaticLanguage();
    renderPreferences();
    renderDrawerCategories();
    renderRecipes();
  }

  function init() {
    $('search-input').value = state.query;
    bindEvents();
    renderAll();
  }

  init();
})();
