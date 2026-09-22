(() => {
  'use strict';
  const data = window.COOKBOOK_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKey = 'pauls-cookbook:proposal-02:settings:v1';
  const validSorts = ['name-asc', 'name-desc', 'time-asc', 'time-desc', 'price-asc', 'price-desc'];
  const words = {
    en: {
      skip: 'Skip to recipes', proposal: 'Design proposal 02', compare: 'Compare designs', basics: 'Cooking Basics', prices: 'Ingredient Prices', about: 'About',
      display: 'Display', appearance: 'Appearance', textSize: 'Text size', light: 'Light', dark: 'Dark', normal: 'Normal', large: 'Large',
      browse: 'The index', personal: 'A personal recipe collection', indexNote: 'Good food starts with a little inspiration.',
      collectionEyebrow: 'Paul’s Cookbook / Recipes', collectionTitle: 'The collection', searchLabel: 'Search recipes and ingredients', searchPlaceholder: 'A dish, an ingredient…', clearSearch: 'Clear search',
      filters: 'Filters', refine: 'Refine your collection', clearFilters: 'Clear filters', filterHelp: 'Match any choice within a group, and every selected group.',
      group: 'Group by category', sort: 'Sort', all: 'All recipes', recipes: 'recipes', categories: 'categories', recipe: 'recipe', of: 'of',
      meatType: 'Meat & diet', cookType: 'Cooking method', ingredient: 'Ingredients',
      'name-asc': 'Name: A–Z', 'name-desc': 'Name: Z–A', 'time-asc': 'Time: low–high', 'time-desc': 'Time: high–low', 'price-asc': 'Price: low–high', 'price-desc': 'Price: high–low',
      emptyTitle: 'Nothing on the menu. Yet.', emptyText: 'Try another ingredient or give your filters a little room.', resetAll: 'Reset search & filters', reset: 'Reset all',
      priceUnit: 'RON / serving', priceKey: 'RON per serving · estimates may be partial', timeKey: 'Times as listed in each recipe', footerNote: 'A little less deciding. A little more cooking.', backTop: 'Back to top',
      easy: 'Easy', medium: 'Medium', hard: 'Hard', serving: 'serving', servings: 'servings', minutes: 'min', prep: 'Listed preparation time',
      perServing: 'RON per serving', partial: 'Partial estimate', complete: 'Complete estimate', unpriced: 'ingredients without a price', noPrice: 'Price unavailable',
      openRecipe: 'Opens recipe in a new tab', remove: 'Remove', activeFilters: 'Active filters', resources: 'Cookbook resources', categoryNav: 'Recipe categories',
      displaySettings: 'Display settings', colorTheme: 'Color theme', language: 'Language', filterRecipes: 'Filter recipes'
    },
    ro: {
      skip: 'Mergi la rețete', proposal: 'Propunere de design 02', compare: 'Compară variantele', basics: 'Baze de Gătit', prices: 'Prețuri Ingrediente', about: 'Despre',
      display: 'Afișare', appearance: 'Aspect', textSize: 'Mărimea textului', light: 'Luminos', dark: 'Întunecat', normal: 'Normal', large: 'Mare',
      browse: 'Indexul', personal: 'O colecție personală de rețete', indexNote: 'Mâncarea bună începe cu puțină inspirație.',
      collectionEyebrow: 'Paul’s Cookbook / Rețete', collectionTitle: 'Colecția', searchLabel: 'Caută rețete și ingrediente', searchPlaceholder: 'Un preparat, un ingredient…', clearSearch: 'Șterge căutarea',
      filters: 'Filtre', refine: 'Restrânge selecția', clearFilters: 'Șterge filtrele', filterHelp: 'Orice opțiune dintr-un grup; toate grupurile selectate.',
      group: 'Grupează pe categorii', sort: 'Sortează', all: 'Toate rețetele', recipes: 'rețete', categories: 'categorii', recipe: 'rețetă', of: 'din',
      meatType: 'Carne și dietă', cookType: 'Metodă de gătit', ingredient: 'Ingrediente',
      'name-asc': 'Nume: A–Z', 'name-desc': 'Nume: Z–A', 'time-asc': 'Timp: crescător', 'time-desc': 'Timp: descrescător', 'price-asc': 'Preț: crescător', 'price-desc': 'Preț: descrescător',
      emptyTitle: 'Încă nimic în meniu.', emptyText: 'Încearcă alt ingredient sau o selecție mai largă de filtre.', resetAll: 'Resetează căutarea și filtrele', reset: 'Resetează tot',
      priceUnit: 'RON / porție', priceKey: 'RON per porție · estimările pot fi parțiale', timeKey: 'Timpii indicați în fiecare rețetă', footerNote: 'Mai puține decizii. Mai mult gătit.', backTop: 'Înapoi sus',
      easy: 'Ușor', medium: 'Mediu', hard: 'Dificil', serving: 'porție', servings: 'porții', minutes: 'min', prep: 'Timp de preparare indicat',
      perServing: 'RON per porție', partial: 'Estimare parțială', complete: 'Estimare completă', unpriced: 'ingrediente fără preț', noPrice: 'Preț indisponibil',
      openRecipe: 'Deschide rețeta într-o filă nouă', remove: 'Elimină', activeFilters: 'Filtre active', resources: 'Resurse de gătit', categoryNav: 'Categorii de rețete',
      displaySettings: 'Setări de afișare', colorTheme: 'Tema de culoare', language: 'Limbă', filterRecipes: 'Filtrează rețetele'
    }
  };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* file:// or restricted storage: use safe defaults. */ }
  const state = {
    language: saved.language === 'ro' ? 'ro' : 'en',
    theme: saved.theme === 'dark' ? 'dark' : 'light',
    text: saved.text === 'large' ? 'large' : 'normal',
    sort: validSorts.includes(saved.sort) ? saved.sort : 'name-asc',
    grouped: saved.grouped === true,
    category: 'all', query: '', filters: new Set()
  };
  const t = key => words[state.language][key] || key;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’'\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const categories = new Map(data.categories.map(category => [category.id, category]));
  const filterById = new Map(data.filters.map(filter => [filter.id, filter]));
  const searchable = new Map(data.recipes.map(recipe => [recipe.id, normalize([
    recipe.title.en, recipe.title.ro, ...recipe.ingredients.flatMap(ingredient => [ingredient.en, ingredient.ro])
  ].join(' '))]));
  const catalogueNumbers = new Map(data.recipes.map((recipe, index) => [recipe.id, String(index + 1).padStart(2, '0')]));
  const moneyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="1"/><circle cx="12" cy="12" r="3"/><path d="M6 12h1m10 0h1"/></svg>';
  const clockIcon = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="8" cy="8" r="6.1"/><path d="M8 4v4l2.5 1.5"/></svg>';
  function save() {
    const { language, theme, text, sort, grouped } = state;
    try { localStorage.setItem(storageKey, JSON.stringify({ language, theme, text, sort, grouped })); } catch { /* Persistence is optional. */ }
  }
  function renderSettings() {
    document.documentElement.lang = state.language;
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.text = state.text;
    $$('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === state.language)));
    $$('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === state.theme)));
    $$('[data-text-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.textChoice === state.text)));
  }
  function translateInterface() {
    $$('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    $('#collection-title').insertAdjacentHTML('beforeend', '<span class="heading-dot" aria-hidden="true">.</span>');
    $('#collection-total').innerHTML = `${data.recipes.length} ${t('recipes')}<br>${data.categories.length} ${t('categories')}`;
    $('#search').placeholder = t('searchPlaceholder');
    $('#clear-search').setAttribute('aria-label', t('clearSearch'));
    for (const [selector, key] of Object.entries({ '#resource-nav': 'resources', '#category-nav': 'categoryNav', '#display-summary': 'displaySettings', '#theme-control': 'colorTheme', '#text-control': 'textSize', '#language-control': 'language', '#filter-panel': 'filterRecipes', '#active-filters': 'activeFilters' })) $(selector).setAttribute('aria-label', t(key));
    $('#sort').innerHTML = validSorts.map(value => `<option value="${value}">${t(value)}</option>`).join('');
    $('#sort').value = state.sort;
    $('#grouped').checked = state.grouped;
    renderSettings();
    renderCategories();
    renderFilterGroups();
    renderResults();
  }
  function renderCategories() {
    const buttons = [{ id: 'all', name: t('all'), count: data.recipes.length }, ...data.categories.map(category => ({
      id: category.id, name: category.name[state.language], count: data.recipes.filter(recipe => recipe.category === category.id).length
    }))];
    $('#category-nav').innerHTML = buttons.map(category => `<button type="button" class="category-button" data-category="${category.id}" aria-pressed="${state.category === category.id}"><span class="category-name">${escapeHTML(category.name)}</span><span class="category-count" aria-label="${category.count} ${t('recipes')}">${String(category.count).padStart(2, '0')}</span></button>`).join('');
  }
  function updateCategorySelection() {
    $$('.category-button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === state.category)));
  }
  function renderFilterGroups() {
    $('#filter-groups').innerHTML = ['meatType', 'cookType', 'ingredient'].map(type => `<fieldset class="filter-group"><legend>${t(type)}</legend><div class="filter-options">${data.filters.filter(filter => filter.type === type).map(filter => `<label class="filter-option"><input type="checkbox" value="${filter.id}" ${state.filters.has(filter.id) ? 'checked' : ''}><span>${escapeHTML(filter.label[state.language])}</span></label>`).join('')}</div></fieldset>`).join('');
  }
  function synchronizeFilters() {
    $$('#filter-groups input').forEach(input => { input.checked = state.filters.has(input.value); });
    $('#clear-filters').disabled = state.filters.size === 0;
    $('#filter-count').hidden = state.filters.size === 0;
    $('#filter-count').textContent = String(state.filters.size);
  }
  function filteredRecipes() {
    const tokens = normalize(state.query).split(' ').filter(Boolean);
    const selectedGroups = ['meatType', 'cookType', 'ingredient'].map(type => [...state.filters].filter(id => filterById.get(id).type === type)).filter(group => group.length);
    return data.recipes.filter(recipe => (state.category === 'all' || recipe.category === state.category)
      && tokens.every(token => searchable.get(recipe.id).includes(token))
      && selectedGroups.every(group => group.some(id => recipe.keywords.includes(id))));
  }
  function sortedRecipes(recipes) {
    const [field, direction] = state.sort.split('-');
    const sign = direction === 'asc' ? 1 : -1;
    const collator = new Intl.Collator(state.language, { sensitivity: 'base', numeric: true });
    return [...recipes].sort((a, b) => {
      const byName = collator.compare(a.title[state.language], b.title[state.language]);
      if (field === 'name') return byName * sign;
      const aValue = field === 'time' ? a.minutes : a.price;
      const bValue = field === 'time' ? b.minutes : b.price;
      // Unknown prices remain at the end in both directions; zero is a real numeric estimate.
      if (aValue == null && bValue == null) return byName;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      return (aValue - bValue) * sign || byName;
    });
  }
  function priceDescription(recipe) {
    if (recipe.price == null) return t('noPrice');
    const number = recipe.price.toLocaleString(state.language === 'ro' ? 'ro-RO' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const status = recipe.priceStatus === 'partial' ? `${t('partial')}; ${recipe.unpricedCount} ${t('unpriced')}` : t('complete');
    return `${number} ${t('perServing')}; ${status}`;
  }
  function recipeCard(recipe, index) {
    const title = escapeHTML(recipe.title[state.language]);
    const price = recipe.price == null ? '—' : recipe.price.toLocaleString(state.language === 'ro' ? 'ro-RO' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const priceLabel = escapeHTML(priceDescription(recipe));
    const category = escapeHTML(categories.get(recipe.category).name[state.language]);
    const servings = `${recipe.servings} ${t(recipe.servings === 1 ? 'serving' : 'servings')}`;
    return `<article class="recipe-card" data-recipe-id="${escapeHTML(recipe.id)}">
      <a class="recipe-link" href="${escapeHTML(data.recipeBase + recipe.id)}" target="_blank" rel="noopener noreferrer" aria-labelledby="title-${recipe.id}" aria-describedby="newtab-${recipe.id}">
        <div class="recipe-visual"><img src="../shared/images/${escapeHTML(recipe.image)}" alt="${title}" width="480" height="480" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}>
          <span class="price-stamp" role="img" aria-label="${priceLabel}" title="${priceLabel}">${moneyIcon}<span aria-hidden="true">${price}</span></span>
        </div>
        <div class="recipe-caption"><p class="recipe-eyebrow"><span class="recipe-number" aria-hidden="true">${catalogueNumbers.get(recipe.id)}</span><span class="eyebrow-divider" aria-hidden="true">/</span><span>${category}</span></p>
          <div class="recipe-title-row"><h3 class="recipe-title" id="title-${recipe.id}">${title}</h3><span class="open-recipe" aria-hidden="true">↗</span></div>
          <div class="recipe-meta"><span class="meta-time" title="${t('prep')}" aria-label="${t('prep')}: ${recipe.minutes} ${t('minutes')}">${clockIcon}${recipe.minutes} ${t('minutes')}</span><span class="meta-effort">${t(recipe.effort)}</span><span class="meta-servings">${servings}</span></div>
        </div><span class="sr-only" id="newtab-${recipe.id}">${t('openRecipe')}. ${priceLabel}</span>
      </a>
    </article>`;
  }
  function renderActiveFilters() {
    const active = [];
    if (state.category !== 'all') active.push({ kind: 'category', value: state.category, label: categories.get(state.category).name[state.language] });
    if (state.query.trim()) active.push({ kind: 'query', value: '', label: `“${state.query.trim()}”` });
    for (const id of state.filters) active.push({ kind: 'filter', value: id, label: filterById.get(id).label[state.language] });
    $('#active-filters').hidden = active.length === 0;
    $('#active-filters').innerHTML = active.map(item => `<button type="button" class="active-tag" data-remove="${item.kind}" data-value="${item.value}" aria-label="${escapeHTML(t('remove') + ' ' + item.label)}"><span>${escapeHTML(item.label)}</span><span aria-hidden="true">×</span></button>`).join('') + (active.length ? `<button type="button" class="text-button" data-reset>${t('reset')}</button>` : '');
  }
  function renderResults() {
    const recipes = sortedRecipes(filteredRecipes());
    $('#result-count').innerHTML = `<strong>${recipes.length}</strong> ${t('of')} ${data.recipes.length} ${t('recipes')}`;
    $('#empty-state').hidden = recipes.length !== 0;
    $('#recipe-results').hidden = recipes.length === 0;
    if (state.grouped) {
      let index = 0;
      $('#recipe-results').innerHTML = data.categories.map(category => {
        const members = recipes.filter(recipe => recipe.category === category.id);
        if (!members.length) return '';
        return `<section class="category-section" aria-labelledby="group-${category.id}"><h2 class="group-heading" id="group-${category.id}">${escapeHTML(category.name[state.language])}<span>${String(members.length).padStart(2, '0')}</span></h2><div class="recipe-grid">${members.map(recipe => recipeCard(recipe, index++)).join('')}</div></section>`;
      }).join('');
    } else {
      $('#recipe-results').innerHTML = `<h2 class="sr-only">${t('recipes')}</h2><div class="recipe-grid">${recipes.map(recipeCard).join('')}</div>`;
    }
    $('#clear-search').hidden = !state.query;
    synchronizeFilters();
    renderActiveFilters();
  }
  function reset() {
    state.query = ''; state.category = 'all'; state.filters.clear();
    $('#search').value = '';
    updateCategorySelection();
    renderResults();
  }
  $$('[data-route]').forEach(link => { link.href = data.appBase + link.dataset.route; });
  $('#search').addEventListener('input', event => { state.query = event.target.value; renderResults(); });
  $('#search').addEventListener('keydown', event => { if (event.key === 'Escape' && state.query) { state.query = ''; event.target.value = ''; renderResults(); } });
  $('#clear-search').addEventListener('click', () => { state.query = ''; $('#search').value = ''; renderResults(); $('#search').focus(); });
  $('#category-nav').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    updateCategorySelection();
    renderResults();
  });
  $('#filter-toggle').addEventListener('click', () => {
    const open = $('#filter-toggle').getAttribute('aria-expanded') !== 'true';
    $('#filter-toggle').setAttribute('aria-expanded', String(open));
    $('#filter-panel').hidden = !open;
  });
  $('#filter-groups').addEventListener('change', event => {
    const input = event.target;
    if (!input.matches('input[type="checkbox"]')) return;
    if (input.checked) state.filters.add(input.value); else state.filters.delete(input.value);
    renderResults();
  });
  $('#clear-filters').addEventListener('click', () => { state.filters.clear(); renderResults(); $('#filter-toggle').focus(); });
  $('#active-filters').addEventListener('click', event => {
    if (event.target.closest('[data-reset]')) { reset(); $('#search').focus(); return; }
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    const next = button.nextElementSibling;
    const nextKind = next?.dataset.remove, nextValue = next?.dataset.value;
    if (button.dataset.remove === 'category') state.category = 'all';
    if (button.dataset.remove === 'query') { state.query = ''; $('#search').value = ''; }
    if (button.dataset.remove === 'filter') state.filters.delete(button.dataset.value);
    updateCategorySelection(); renderResults();
    const nextButton = nextKind ? $$('#active-filters [data-remove]').find(element => element.dataset.remove === nextKind && element.dataset.value === nextValue) : null;
    (nextButton || $('#search')).focus();
  });
  $('#empty-reset').addEventListener('click', () => { reset(); $('#search').focus(); });
  $('#sort').addEventListener('change', event => { state.sort = event.target.value; save(); renderResults(); });
  $('#grouped').addEventListener('change', event => { state.grouped = event.target.checked; save(); renderResults(); });
  $$('[data-language]').forEach(button => button.addEventListener('click', () => {
    state.language = button.dataset.language; save(); translateInterface();
  }));
  $$('[data-theme-choice]').forEach(button => button.addEventListener('click', () => { state.theme = button.dataset.themeChoice; save(); renderSettings(); }));
  $$('[data-text-choice]').forEach(button => button.addEventListener('click', () => { state.text = button.dataset.textChoice; save(); renderSettings(); }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if ($('#display-settings').open) { $('#display-settings').open = false; $('#display-summary').focus(); }
    else if ($('#filter-toggle').getAttribute('aria-expanded') === 'true' && $('#filter-panel').contains(document.activeElement)) { $('#filter-panel').hidden = true; $('#filter-toggle').setAttribute('aria-expanded', 'false'); $('#filter-toggle').focus(); }
  });
  document.addEventListener('click', event => { if (!$('#display-settings').contains(event.target)) $('#display-settings').open = false; });
  translateInterface();
})();
