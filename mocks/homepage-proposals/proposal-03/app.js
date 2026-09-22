/* Open Index: dependency-free, disk-safe prototype. All data stays local. */
(() => {
  'use strict';
  const data = window.COOKBOOK_DATA;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  if (!data || !Array.isArray(data.recipes)) {
    $('#recipe-list').innerHTML = '<p role="alert">The shared catalogue could not be loaded. Keep this folder beside the shared folder.</p>';
    return;
  }
  const copy = {
    en: {
      skip: 'Skip to recipes', proposal: 'Design proposal 03 · Open Index', compare: 'Compare proposals',
      basics: 'Cooking Basics', prices: 'Ingredient Prices', about: 'About', preferences: 'Preferences', menu: 'Menu',
      language: 'Language', appearance: 'Appearance', textSize: 'Text size', light: 'Light', dark: 'Dark', normal: 'Normal', large: 'Large',
      personalCollection: 'A personal collection', index: 'Recipe index', searchLabel: 'Search recipe titles and ingredients',
      placeholder: 'A dish, an ingredient…', filters: 'Filters', refine: 'Narrow the collection',
      filterLogic: 'Any match within a group. All selected groups must match.', done: 'Done', reset: 'Reset all',
      collection: 'Collection', collections: 'Collections', all: 'All recipes', spineNote: 'A place for the dishes\nyou come back to.',
      sort: 'Sort recipes', group: 'Group', groupLabel: 'Group recipes by category', previewHint: 'Photos preview. Titles open. ↗',
      onThePage: 'On the page', backToTop: 'Back to top', recipePreview: 'Recipe preview', closePreview: 'Close preview',
      clearSearch: 'Clear search', navLabel: 'Main navigation', categoriesLabel: 'Recipe collections', resultsLabel: 'Recipe results',
      meatType: 'Meat & meat-free', cookType: 'Cooking method', ingredient: 'Ingredients',
      nameAsc: 'Name A–Z', nameDesc: 'Name Z–A', timeAsc: 'Time: low to high', timeDesc: 'Time: high to low',
      priceAsc: 'Price: low to high', priceDesc: 'Price: high to low', recipe: 'recipe', recipes: 'recipes', recipesHeading: 'Recipes',
      preview: 'Preview', openNew: 'opens in a new tab', remove: 'Remove filter', search: 'Search',
      easy: 'Easy', medium: 'Medium', hard: 'Hard', time: 'Time', servings: 'Servings', effort: 'Effort',
      openRecipe: 'Open recipe', ingredients: 'Ingredients', added: 'Added',
      priceLabel: 'Cost per portion', partial: 'Partial estimate', missingPrices: 'ingredients without a price',
      complete: 'All ingredient prices included', unavailable: 'Price unavailable',
      noResults: 'Nothing here. Yet.', noResultsHelp: 'Try another ingredient or loosen your filters. Your collection is still here.',
      emptyPreview: 'A recipe preview will appear here when your search has a match.', home: 'home'
    },
    ro: {
      skip: 'Sari la rețete', proposal: 'Propunere de design 03 · Open Index', compare: 'Compară propunerile',
      basics: 'Bazele Gătitului', prices: 'Prețuri Ingrediente', about: 'Despre', preferences: 'Preferințe', menu: 'Meniu',
      language: 'Limbă', appearance: 'Aspect', textSize: 'Mărimea textului', light: 'Luminos', dark: 'Întunecat', normal: 'Normal', large: 'Mare',
      personalCollection: 'O colecție personală', index: 'Index de rețete', searchLabel: 'Caută după titlul rețetei sau ingrediente',
      placeholder: 'Un preparat, un ingredient…', filters: 'Filtre', refine: 'Restrânge colecția',
      filterLogic: 'Orice opțiune dintr-un grup. Toate grupurile selectate trebuie să corespundă.', done: 'Gata', reset: 'Resetează',
      collection: 'Colecție', collections: 'Colecții', all: 'Toate rețetele', spineNote: 'Un loc pentru preparatele\nla care revii mereu.',
      sort: 'Sortează rețetele', group: 'Grupează', groupLabel: 'Grupează rețetele pe categorii', previewHint: 'Foto: previzualizare. Titlu: rețetă. ↗',
      onThePage: 'Pe pagină', backToTop: 'Înapoi sus', recipePreview: 'Previzualizare rețetă', closePreview: 'Închide previzualizarea',
      clearSearch: 'Șterge căutarea', navLabel: 'Navigare principală', categoriesLabel: 'Colecții de rețete', resultsLabel: 'Rezultate rețete',
      meatType: 'Carne și fără carne', cookType: 'Metodă de gătit', ingredient: 'Ingrediente',
      nameAsc: 'Nume A–Z', nameDesc: 'Nume Z–A', timeAsc: 'Timp: crescător', timeDesc: 'Timp: descrescător',
      priceAsc: 'Preț: crescător', priceDesc: 'Preț: descrescător', recipe: 'rețetă', recipes: 'rețete', recipesHeading: 'Rețete',
      preview: 'Previzualizează', openNew: 'se deschide într-o filă nouă', remove: 'Elimină filtrul', search: 'Căutare',
      easy: 'Ușor', medium: 'Mediu', hard: 'Dificil', time: 'Timp', servings: 'Porții', effort: 'Dificultate',
      openRecipe: 'Deschide rețeta', ingredients: 'Ingrediente', added: 'Adăugată',
      priceLabel: 'Cost per porție', partial: 'Estimare parțială', missingPrices: 'ingrediente fără preț',
      complete: 'Toate prețurile ingredientelor sunt incluse', unavailable: 'Preț indisponibil',
      noResults: 'Nicio rețetă. Deocamdată.', noResultsHelp: 'Încearcă alt ingredient sau mai puține filtre. Colecția ta este tot aici.',
      emptyPreview: 'Previzualizarea unei rețete va apărea aici când căutarea are rezultate.', home: 'acasă'
    }
  };
  const key = 'proposal-03:preferences';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { /* Disk/private browsing can block storage. */ }
  const validSorts = ['name-asc', 'name-desc', 'time-asc', 'time-desc', 'price-asc', 'price-desc'];
  const state = {
    language: saved.language === 'ro' ? 'ro' : 'en',
    theme: saved.theme === 'dark' ? 'dark' : 'light',
    size: saved.size === 'large' ? 'large' : 'normal',
    grouped: saved.grouped === true,
    sort: validSorts.includes(saved.sort) ? saved.sort : 'name-asc',
    query: '', category: 'all', filters: new Set(), selected: null, results: []
  };
  const categoryMap = new Map(data.categories.map(c => [c.id, c]));
  const counts = new Map(data.categories.map(c => [c.id, data.recipes.filter(r => r.category === c.id).length]));
  const filterTypes = ['meatType', 'cookType', 'ingredient'];
  const t = (key) => copy[state.language][key] || key;
  const local = (value) => value[state.language] || value.en;
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  // Index both languages so switching the interface does not invalidate an ingredient search.
  const searchIndex = new Map(data.recipes.map(recipe => [recipe.id, normalize([
    recipe.title.en, recipe.title.ro, ...recipe.ingredients.flatMap(i => [i.en, i.ro])
  ].join(' '))]));
  const clock = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.75" stroke="currentColor"/><path d="M8 4.5v3.8l2.5 1.5" stroke="currentColor"/></svg>';
  const moneyIcon = '<svg viewBox="0 0 20 16" fill="none" aria-hidden="true"><rect x="1.5" y="3" width="17" height="10" rx=".5" stroke="currentColor"/><circle cx="10" cy="8" r="2.5" stroke="currentColor"/><path d="M4 7v2m12-2v2" stroke="currentColor"/></svg>';
  const imageURL = (recipe) => '../shared/images/' + encodeURIComponent(recipe.image);
  const recipeURL = (recipe) => data.recipeBase + recipe.id;
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ language: state.language, theme: state.theme, size: state.size, grouped: state.grouped, sort: state.sort })); } catch { /* Nonessential persistence. */ }
  }
  function priceMarkup(recipe) {
    const known = recipe.price !== null && recipe.priceStatus !== 'unavailable';
    const amount = known ? new Intl.NumberFormat(state.language === 'ro' ? 'ro-RO' : 'en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(recipe.price) : '—';
    const status = recipe.priceStatus === 'partial'
      ? `${t('partial')}; ${recipe.unpricedCount} ${t('missingPrices')}`
      : recipe.priceStatus === 'complete' ? t('complete') : t('unavailable');
    const label = `${t('priceLabel')}: ${amount}. ${status}`;
    return `<span class="money" role="img" data-partial="${recipe.priceStatus === 'partial'}" title="${escape(label)}" aria-label="${escape(label)}">${moneyIcon}<span aria-hidden="true">${amount}</span></span>`;
  }
  function renderPreferences() {
    document.documentElement.lang = state.language;
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.size = state.size;
    $$('[data-language]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.language === state.language)));
    $$('[data-theme]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === state.theme)));
    $$('[data-size]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.size === state.size)));
  }
  function renderCopy() {
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $('.spine-note').style.whiteSpace = 'pre-line';
    $('#search').placeholder = t('placeholder');
    $('#clear-search').setAttribute('aria-label', t('clearSearch'));
    $('#close-preview').setAttribute('aria-label', t('closePreview'));
    $('#group-toggle').setAttribute('aria-label', t('groupLabel'));
    $('#group-toggle').checked = state.grouped;
    $('#categories').setAttribute('aria-label', t('categoriesLabel'));
    $('#results').setAttribute('aria-label', t('resultsLabel'));
    $('.brand').setAttribute('aria-label', `${data.brand} — ${t('home')}`);
    $$('.main-nav, .mobile-nav').forEach(el => el.setAttribute('aria-label', t('navLabel')));
    $$('[data-route]').forEach(a => { a.href = data.appBase + a.dataset.route; });
    $('#collection-total').textContent = data.recipes.length;
    document.title = `${t('index')} — ${data.brand} · Open Index`;
    const sortLabels = ['nameAsc', 'nameDesc', 'timeAsc', 'timeDesc', 'priceAsc', 'priceDesc'];
    $('#sort').innerHTML = validSorts.map((value, index) => `<option value="${value}">${t(sortLabels[index])}</option>`).join('');
    $('#sort').value = state.sort;
    renderPreferences();
    renderCategories();
    renderFilters();
  }
  function renderCategories() {
    const items = [{id:'all', name: {en: copy.en.all, ro: copy.ro.all}}, ...data.categories];
    $('#categories').innerHTML = items.map((category, index) => {
      const count = category.id === 'all' ? data.recipes.length : counts.get(category.id);
      return `<button type="button" class="category-button ${index === 0 ? 'all-category' : ''}" data-category="${escape(category.id)}" aria-pressed="${state.category === category.id}"><span class="category-number" aria-hidden="true">${index === 0 ? '—' : String(index).padStart(2, '0')}</span><span>${escape(local(category.name))}</span><span class="category-count">${String(count).padStart(2, '0')}</span></button>`;
    }).join('');
    $('#category-select').innerHTML = items.map(c => `<option value="${escape(c.id)}">${escape(local(c.name))} (${c.id === 'all' ? data.recipes.length : counts.get(c.id)})</option>`).join('');
    $('#category-select').value = state.category;
  }
  function renderFilters() {
    $('#filter-groups').innerHTML = filterTypes.map(type => `<fieldset><legend>${t(type)}</legend><div class="filter-choices">${data.filters.filter(f => f.type === type).map(f => `<button class="filter-choice" type="button" data-filter="${escape(f.id)}" aria-pressed="${state.filters.has(f.id)}">${escape(local(f.label))}</button>`).join('')}</div></fieldset>`).join('');
  }
  function filterResults() {
    const tokens = normalize(state.query).split(/\s+/).filter(Boolean);
    const selectedGroups = filterTypes.map(type => data.filters.filter(f => f.type === type && state.filters.has(f.id)).map(f => f.id));
    const list = data.recipes.filter(recipe =>
      (state.category === 'all' || recipe.category === state.category) &&
      tokens.every(token => searchIndex.get(recipe.id).includes(token)) &&
      selectedGroups.every(group => !group.length || group.some(id => recipe.keywords.includes(id)))
    );
    const [field, direction] = state.sort.split('-');
    const factor = direction === 'asc' ? 1 : -1;
    const collator = new Intl.Collator(state.language, {sensitivity:'base', numeric:true});
    list.sort((a, b) => {
      if (field === 'price') {
        const aUnknown = a.price === null || a.priceStatus === 'unavailable';
        const bUnknown = b.price === null || b.priceStatus === 'unavailable';
        if (aUnknown !== bUnknown) return aUnknown ? 1 : -1;
      }
      const difference = field === 'name' ? collator.compare(local(a.title), local(b.title))
        : field === 'time' ? a.minutes - b.minutes : (a.price ?? 0) - (b.price ?? 0);
      return difference * factor || collator.compare(local(a.title), local(b.title));
    });
    return list;
  }
  function renderActive() {
    const chips = [];
    if (state.query.trim()) chips.push({id:'query', label:`${t('search')}: ${state.query}`});
    if (state.category !== 'all') chips.push({id:'category', label:local(categoryMap.get(state.category).name)});
    data.filters.filter(f => state.filters.has(f.id)).forEach(f => chips.push({id:f.id,label:local(f.label)}));
    $('#active-filters').innerHTML = chips.map(chip => `<button type="button" class="active-chip" data-remove="${escape(chip.id)}" aria-label="${escape(t('remove') + ': ' + chip.label)}">${escape(chip.label)}<span aria-hidden="true">×</span></button>`).join('');
    $('#active-bar').hidden = chips.length === 0;
    $('#clear-search').hidden = !state.query;
    $('#filter-total').hidden = state.filters.size === 0;
    $('#filter-total').textContent = state.filters.size;
    $('#filter-toggle').classList.toggle('has-filters', state.filters.size > 0);
    $$('.filter-choice').forEach(b => b.setAttribute('aria-pressed', String(state.filters.has(b.dataset.filter))));
    $$('.category-button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === state.category)));
    $('#category-select').value = state.category;
  }
  function rowMarkup(recipe, index) {
    const title = local(recipe.title);
    const category = categoryMap.get(recipe.category);
    const isSelected = state.selected === recipe.id;
    return `<article class="recipe-row${isSelected ? ' is-selected' : ''}" data-recipe="${escape(recipe.id)}">
      <button class="photo-button" type="button" data-preview="${escape(recipe.id)}" aria-label="${escape(t('preview') + ': ' + title)}" aria-pressed="${isSelected}" aria-controls="${matchMedia('(max-width:1080px)').matches ? 'preview-dialog' : 'preview-content'}" title="${escape(t('preview') + ': ' + title)}"><img src="${imageURL(recipe)}" alt="" width="96" height="96" loading="${index < 5 ? 'eager' : 'lazy'}" decoding="async"></button>
      <div class="recipe-text">${state.grouped ? '' : `<span class="recipe-category">${escape(local(category.name))}</span>`}<h3 class="recipe-title"><a href="${escape(recipeURL(recipe))}" target="_blank" rel="noopener" aria-label="${escape(title + ' — ' + t('openNew'))}">${escape(title)}</a></h3>
      <div class="recipe-meta"><span class="meta-time">${clock}${recipe.minutes} min</span><span class="meta-effort">${escape(t(recipe.effort))}</span>${priceMarkup(recipe)}</div></div>
    </article>`;
  }
  function renderResults() {
    const filtered = filterResults();
    state.results = state.grouped
      ? data.categories.flatMap(category => filtered.filter(recipe => recipe.category === category.id))
      : filtered;
    if (!state.results.some(recipe => recipe.id === state.selected)) state.selected = state.results[0]?.id || null;
    const total = state.results.length;
    $('#result-count').innerHTML = `${total}${total === data.recipes.length ? '' : `<span class="count-total"> / ${data.recipes.length}</span>`} ${t(total === 1 ? 'recipe' : 'recipes')}`;
    if (!total) {
      $('#recipe-list').innerHTML = `<div class="empty-state"><span class="empty-symbol" aria-hidden="true">∅</span><h2>${t('noResults')}</h2><p>${t('noResultsHelp')}</p><button type="button" class="open-recipe" data-reset>${t('reset')} <span aria-hidden="true">↗</span></button></div>`;
    } else if (state.grouped) {
      let index = 0;
      $('#recipe-list').innerHTML = data.categories.map(category => {
        const recipes = state.results.filter(r => r.category === category.id);
        return recipes.length ? `<section class="recipe-group" aria-labelledby="group-${category.id}"><h2 class="group-heading" id="group-${category.id}">${escape(local(category.name))}<span>${String(recipes.length).padStart(2,'0')}</span></h2>${recipes.map(r => rowMarkup(r,index++)).join('')}</section>` : '';
      }).join('');
    } else $('#recipe-list').innerHTML = state.results.map(rowMarkup).join('');
    renderActive();
    renderPreview();
  }
  function previewMarkup(recipe, dialog = false) {
    const category = categoryMap.get(recipe.category);
    const title = local(recipe.title);
    const date = new Intl.DateTimeFormat(state.language === 'ro' ? 'ro-RO' : 'en-GB', {day:'numeric',month:'short',year:'numeric'}).format(new Date(recipe.dateAdded + 'T12:00:00'));
    return `<img class="preview-photo" src="${imageURL(recipe)}" alt="${escape(title)}" width="480" height="400" decoding="async" fetchpriority="high">
      <p class="preview-category">${escape(local(category.name))}</p>
      <h2 class="preview-title"${dialog ? ' id="dialog-recipe-title"' : ''}>${escape(title)}</h2>
      <dl class="preview-facts"><div><dt>${t('time')}</dt><dd>${recipe.minutes} min</dd></div><div><dt>${t('servings')}</dt><dd>${recipe.servings}</dd></div><div><dt>${t('effort')}</dt><dd>${escape(t(recipe.effort))}</dd></div></dl>
      <div class="recipe-action"><a class="open-recipe" href="${escape(recipeURL(recipe))}" target="_blank" rel="noopener" aria-label="${escape(t('openRecipe') + ': ' + title + ' — ' + t('openNew'))}">${t('openRecipe')}<span aria-hidden="true">↗</span></a>${priceMarkup(recipe)}</div>
      <details class="ingredients-details"><summary><span>${t('ingredients')}<span class="ingredient-count">${recipe.ingredients.length}</span></span></summary><ul>${recipe.ingredients.map(ingredient => `<li>${escape(local(ingredient))}</li>`).join('')}</ul></details>
      <p class="preview-date">${t('added')} ${escape(date)}</p>`;
  }
  function renderPreview() {
    const recipe = state.results.find(recipe => recipe.id === state.selected);
    if (!recipe) {
      $('#preview-content').innerHTML = `<p class="preview-placeholder">${t('emptyPreview')}</p>`;
      $('#preview-position').textContent = '—';
      if ($('#preview-dialog').open) $('#preview-dialog').close();
      return;
    }
    $('#preview-content').innerHTML = previewMarkup(recipe);
    $('#preview-position').textContent = `${String(state.results.indexOf(recipe) + 1).padStart(2,'0')} / ${String(state.results.length).padStart(2,'0')}`;
    if ($('#preview-dialog').open) $('#dialog-content').innerHTML = previewMarkup(recipe, true);
  }
  function selectRecipe(id) {
    state.selected = id;
    const recipe = state.results.find(recipe => recipe.id === id);
    if (!recipe) return;
    $$('.recipe-row').forEach(row => row.classList.toggle('is-selected', row.dataset.recipe === id));
    $$('.photo-button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.preview === id)));
    renderPreview();
    if (matchMedia('(max-width:1080px)').matches) {
      $('#dialog-content').innerHTML = previewMarkup(recipe, true);
      $('#preview-dialog').showModal();
    } else $('#preview-status').textContent = `${t('recipePreview')}: ${local(recipe.title)}`;
  }
  function reset() {
    state.query = ''; state.category = 'all'; state.filters.clear();
    $('#search').value = '';
    renderResults();
    $('#search').focus();
  }
  function toggleFilters(open) {
    $('#filter-panel').hidden = !open;
    $('#filter-toggle').setAttribute('aria-expanded', String(open));
  }
  $('#search').addEventListener('input', (event) => { state.query = event.target.value; renderResults(); });
  $('#clear-search').addEventListener('click', () => { state.query = ''; $('#search').value = ''; renderResults(); $('#search').focus(); });
  $('#filter-toggle').addEventListener('click', () => toggleFilters($('#filter-panel').hidden));
  $('#close-filters').addEventListener('click', () => { toggleFilters(false); $('#filter-toggle').focus(); });
  $('#filter-groups').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const id = button.dataset.filter;
    state.filters.has(id) ? state.filters.delete(id) : state.filters.add(id);
    renderResults();
  });
  $('#categories').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    renderResults();
  });
  $('#category-select').addEventListener('change', event => { state.category = event.target.value; renderResults(); });
  $('#sort').addEventListener('change', event => { state.sort = event.target.value; persist(); renderResults(); });
  $('#group-toggle').addEventListener('change', event => { state.grouped = event.target.checked; persist(); renderResults(); });
  $('#reset').addEventListener('click', reset);
  $('#active-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    const id = button.dataset.remove;
    if (id === 'query') { state.query = ''; $('#search').value = ''; }
    else if (id === 'category') state.category = 'all';
    else state.filters.delete(id);
    renderResults();
    const nextChip = $('#active-filters button');
    (nextChip || $('#search')).focus();
  });
  $('#recipe-list').addEventListener('click', event => {
    const preview = event.target.closest('[data-preview]');
    if (preview) selectRecipe(preview.dataset.preview);
    if (event.target.closest('[data-reset]')) reset();
  });
  $('#preferences').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.language) {
      state.language = button.dataset.language;
      renderCopy(); renderResults();
    }
    if (button.dataset.theme) { state.theme = button.dataset.theme; renderPreferences(); }
    if (button.dataset.size) { state.size = button.dataset.size; renderPreferences(); }
    persist();
  });
  document.addEventListener('click', event => {
    if (!$('#preferences').contains(event.target)) $('#preferences').open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('#preferences').open) {
      $('#preferences').open = false;
      $('#preferences summary').focus();
    } else if (event.key === 'Escape' && !$('#filter-panel').hidden && !$('#preview-dialog').open) {
      toggleFilters(false); $('#filter-toggle').focus();
    }
  });
  $('#close-preview').addEventListener('click', () => $('#preview-dialog').close());
  $('#preview-dialog').addEventListener('click', event => {
    if (event.target !== $('#preview-dialog')) return;
    const bounds = $('#preview-dialog').getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) $('#preview-dialog').close();
  });
  matchMedia('(max-width:1080px)').addEventListener('change', event => {
    if (!event.matches && $('#preview-dialog').open) $('#preview-dialog').close();
    $$('.photo-button').forEach(button => button.setAttribute('aria-controls', event.matches ? 'preview-dialog' : 'preview-content'));
  });
  renderCopy();
  renderResults();
})();