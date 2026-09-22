(() => {
  'use strict';
  const data = window.COOKBOOK_DATA;
  const $ = (id) => document.getElementById(id);
  const storageKey = 'proposal-01:preferences';
  const words = {
    en: {
      skip:'Skip to recipes', brandCaption:'A personal recipe collection', display:'Settings', appearance:'Appearance', light:'Light', dark:'Dark', textSize:'Text size', normal:'Normal', large:'Large', saved:'Saved for this proposal.', collection:'Browse by category', reference:'Kitchen reference', cookingBasics:'Cooking Basics', ingredientPrices:'Ingredient Prices', about:'About', compare:'Compare proposals', homeCooking:'Pull up a recipe', heading:'What are we cooking?', searchLabel:'Search recipes or ingredients', searchPlaceholder:'Search recipes or ingredients…', category:'Category', filters:'Filters', filterHelp:'Choose any in each group. Match across groups.', clearFilters:'Clear filters', showResults:'Show recipes', group:'Group by category', sort:'Sort', backTop:'Back to top', all:'All recipes', meatType:'Meat & vegetarian', cookType:'Cooking method', ingredient:'Ingredients', language:'Language', clearSearch:'Clear search', recipes:'recipes', recipe:'recipe', categories:'categories', of:'of', clearAll:'Reset all', remove:'Remove filter', noResults:'Nothing on the menu. Yet.', noResultsHelp:'Try another ingredient, or loosen your filters to explore the collection.', reset:'Show all recipes', openNewTab:'Opens recipe in a new tab', opensNewTab:'opens in a new tab', time:'Recipe time', serving:'serving', servings:'servings', priceComplete:'Estimated cost', pricePartial:'Partial estimate', priceUnavailable:'Cost unavailable', perServing:'RON per serving', unpriced:'ingredients not priced', unpricedOne:'ingredient not priced', endnote:'All on the table', matching:'matching recipes', sortCollection:'Collection order', sortNameAsc:'Name · A–Z', sortNameDesc:'Name · Z–A', sortTimeAsc:'Time · shortest first', sortTimeDesc:'Time · longest first', sortPriceAsc:'Price · low to high', sortPriceDesc:'Price · high to low', findRecipes:'Find recipes', home:'Paul’s Cookbook home', photoUnavailable:'Photograph unavailable'
    },
    ro: {
      skip:'Sari la rețete', brandCaption:'O colecție personală de rețete', display:'Setări', appearance:'Aspect', light:'Luminos', dark:'Întunecat', textSize:'Mărimea textului', normal:'Normal', large:'Mare', saved:'Salvat pentru această propunere.', collection:'Alege o categorie', reference:'În bucătărie', cookingBasics:'Bazele gătitului', ingredientPrices:'Prețuri ingrediente', about:'Despre', compare:'Compară propunerile', homeCooking:'Alege o rețetă', heading:'Ce gătim astăzi?', searchLabel:'Caută rețete sau ingrediente', searchPlaceholder:'Caută rețete sau ingrediente…', category:'Categorie', filters:'Filtre', filterHelp:'Oricare opțiune dintr-un grup. Toate grupurile selectate.', clearFilters:'Șterge filtrele', showResults:'Arată rețetele', group:'Grupează pe categorii', sort:'Sortare', backTop:'Înapoi sus', all:'Toate rețetele', meatType:'Carne și vegetarian', cookType:'Mod de preparare', ingredient:'Ingrediente', language:'Limbă', clearSearch:'Șterge căutarea', recipes:'rețete', recipe:'rețetă', categories:'categorii', of:'din', clearAll:'Resetează tot', remove:'Elimină filtrul', noResults:'Nicio rețetă. Deocamdată.', noResultsHelp:'Încearcă alt ingredient sau elimină câteva filtre pentru a explora colecția.', reset:'Arată toate rețetele', openNewTab:'Deschide rețeta într-o filă nouă', opensNewTab:'se deschide într-o filă nouă', time:'Timpul rețetei', serving:'porție', servings:'porții', priceComplete:'Cost estimat', pricePartial:'Estimare parțială', priceUnavailable:'Cost indisponibil', perServing:'RON per porție', unpriced:'ingrediente fără preț', unpricedOne:'ingredient fără preț', endnote:'Toate la îndemână', matching:'rețete găsite', sortCollection:'Ordinea colecției', sortNameAsc:'Nume · A–Z', sortNameDesc:'Nume · Z–A', sortTimeAsc:'Timp · crescător', sortTimeDesc:'Timp · descrescător', sortPriceAsc:'Preț · crescător', sortPriceDesc:'Preț · descrescător', findRecipes:'Găsește rețete', home:'Pagina principală Paul’s Cookbook', photoUnavailable:'Fotografie indisponibilă'
    }
  };
  const sortOptions = [
    ['collection','sortCollection'], ['name-asc','sortNameAsc'], ['name-desc','sortNameDesc'],
    ['time-asc','sortTimeAsc'], ['time-desc','sortTimeDesc'], ['price-asc','sortPriceAsc'], ['price-desc','sortPriceDesc']
  ];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* file:// or private mode can deny storage. */ }
  const state = {
    language: saved.language === 'ro' ? 'ro' : 'en',
    theme: saved.theme === 'dark' ? 'dark' : 'light',
    textSize: saved.textSize === 'large' ? 'large' : 'normal',
    sort: sortOptions.some(([id]) => id === saved.sort) ? saved.sort : 'collection',
    grouped: saved.grouped === true,
    category:'all', query:'', keywords:new Set(), filtersOpen:false
  };
  const t = (key) => words[state.language][key] || key;
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  // Unicode NFD separates Romanian diacritics; discard combining marks, not letters.
  const searchText = (value) => Array.from(String(value).normalize('NFD')).filter((char) => { const code = char.codePointAt(0); return code < 768 || code > 879; }).join('').toLowerCase();
  const icon = (name) => {
    const paths = {
      clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
      people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-2-4"/>',
      money:'<rect x="2" y="5" width="20" height="14" rx="1"/><circle cx="12" cy="12" r="3"/><path d="M5 9h1m12 6h1"/>',
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + paths[name] + '</svg>';
  };
  const categories = new Map(data.categories.map((category) => [category.id, category]));
  const categoryCounts = new Map(data.categories.map((category) => [category.id, data.recipes.filter((recipe) => recipe.category === category.id).length]));
  const searchIndex = new Map(data.recipes.map((recipe) => [recipe.id, searchText([recipe.title.en, recipe.title.ro, ...recipe.ingredients.flatMap((ingredient) => [ingredient.en, ingredient.ro])].join(' '))]));
  const filterTypes = ['meatType', 'cookType', 'ingredient'];

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({language:state.language, theme:state.theme, textSize:state.textSize, sort:state.sort, grouped:state.grouped})); } catch { /* Preferences still work for this visit. */ }
  }
  function applyPreferences() {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.text = state.textSize;
    document.documentElement.lang = state.language;
    document.querySelectorAll('input[name="theme"]').forEach((input) => { input.checked = input.value === state.theme; });
    document.querySelectorAll('input[name="textSize"]').forEach((input) => { input.checked = input.value === state.textSize; });
    $('group-toggle').checked = state.grouped;
  }
  function renderLanguage() {
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-language]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.language === state.language)); });
    $('search').placeholder = t('searchPlaceholder');
    $('clear-search').setAttribute('aria-label', t('clearSearch'));
    $('language-control').setAttribute('aria-label', t('language'));
    document.querySelector('.display-trigger').setAttribute('aria-label', t('display'));
    document.querySelector('.brand').setAttribute('aria-label', t('home'));
    $('discovery').setAttribute('aria-label', t('findRecipes'));
    $('recipes').setAttribute('aria-label', t('recipes'));
    document.querySelectorAll('[data-reference]').forEach((nav) => nav.setAttribute('aria-label', t('reference')));
    $('collection-total').innerHTML = '<strong>' + data.recipes.length + '</strong> ' + t('recipes') + '<br><strong>' + data.categories.length + '</strong> ' + t('categories');
    $('sort').innerHTML = sortOptions.map(([id, key]) => '<option value="' + id + '">' + escape(t(key)) + '</option>').join('');
    $('sort').value = state.sort;
    renderCategories(); renderFilters();
  }
  function renderCategories() {
    const options = [{id:'all', name:{en:words.en.all,ro:words.ro.all}}, ...data.categories];
    $('category-list').innerHTML = options.map((category) => {
      const count = category.id === 'all' ? data.recipes.length : categoryCounts.get(category.id);
      return '<button type="button" class="category-button" data-category="' + escape(category.id) + '" aria-pressed="' + (state.category === category.id) + '"><span class="category-name">' + escape(category.name[state.language]) + '</span><span class="category-count">' + count + '</span></button>';
    }).join('');
  }
  function renderFilters() {
    $('filter-groups').innerHTML = filterTypes.map((type) => '<fieldset><legend>' + escape(t(type)) + '</legend><div class="filter-options">' + data.filters.filter((filter) => filter.type === type).map((filter) => '<label class="filter-option"><input type="checkbox" value="' + escape(filter.id) + '" ' + (state.keywords.has(filter.id) ? 'checked' : '') + '><span>' + escape(filter.label[state.language]) + '</span></label>').join('') + '</div></fieldset>').join('');
  }
  function filteredRecipes() {
    const tokens = searchText(state.query.trim()).split(/\s+/).filter(Boolean);
    const activeGroups = filterTypes.map((type) => data.filters.filter((filter) => filter.type === type && state.keywords.has(filter.id)).map((filter) => filter.id));
    const filtered = data.recipes.filter((recipe) => {
      if (state.category !== 'all' && recipe.category !== state.category) return false;
      if (!tokens.every((token) => searchIndex.get(recipe.id).includes(token))) return false;
      return activeGroups.every((ids) => ids.length === 0 || ids.some((id) => recipe.keywords.includes(id)));
    });
    if (state.sort === 'collection') return filtered;
    const [field, direction] = state.sort.split('-');
    const sign = direction === 'desc' ? -1 : 1;
    const collator = new Intl.Collator(state.language, {sensitivity:'base',numeric:true});
    return filtered.sort((a,b) => {
      let result = 0;
      if (field === 'name') result = collator.compare(a.title[state.language], b.title[state.language]);
      if (field === 'time') result = a.minutes - b.minutes;
      if (field === 'price') {
        // Missing prices always sort last; zero is a valid numeric price.
        if (a.price === null && b.price !== null) return 1;
        if (a.price !== null && b.price === null) return -1;
        result = (a.price ?? 0) - (b.price ?? 0);
      }
      return sign * result || collator.compare(a.title[state.language], b.title[state.language]);
    });
  }
  function priceLabel(recipe) {
    if (recipe.price === null) return t('priceUnavailable');
    const cost = recipe.price.toFixed(2) + ' ' + t('perServing');
    if (recipe.priceStatus === 'partial') return t('pricePartial') + ': ' + cost + '; ' + recipe.unpricedCount + ' ' + t(recipe.unpricedCount === 1 ? 'unpricedOne' : 'unpriced');
    return t('priceComplete') + ': ' + cost;
  }
  function recipeCard(recipe, index) {
    const title = recipe.title[state.language];
    const cost = priceLabel(recipe);
    const yieldLabel = recipe.servings + ' ' + t(recipe.servings === 1 ? 'serving' : 'servings');
    const headingTag = state.grouped ? 'h3' : 'h2';
    return '<article class="recipe-card" data-recipe-id="' + escape(recipe.id) + '"><a class="recipe-link" href="' + escape(data.recipeBase + recipe.id) + '" target="_blank" rel="noopener" title="' + escape(t('openNewTab')) + '">' +
      '<div class="recipe-image"><img src="../shared/images/' + encodeURIComponent(recipe.image) + '" width="480" height="336" alt="" loading="' + (index < 6 ? 'eager' : 'lazy') + '" decoding="async"></div>' +
      '<div class="recipe-info">' + (state.grouped ? '' : '<p class="recipe-category">' + escape(categories.get(recipe.category).name[state.language]) + '</p>') +
      '<' + headingTag + ' class="recipe-title">' + escape(title) + '</' + headingTag + '>' +
      '<div class="recipe-meta"><span title="' + escape(t('time') + ': ' + recipe.minutes + ' min') + '">' + icon('clock') + '<span>' + recipe.minutes + ' min</span></span>' +
      '<span class="recipe-yield" role="img" aria-label="' + escape(yieldLabel) + '" title="' + escape(yieldLabel) + '">' + icon('people') + '<span aria-hidden="true">' + recipe.servings + '</span></span>' +
      '<span class="recipe-price" role="img" aria-label="' + escape(cost) + '" title="' + escape(cost) + '">' + icon('money') + '<span aria-hidden="true">' + (recipe.price === null ? '—' : recipe.price.toFixed(2)) + '</span></span></div></div><span class="sr-only">' + escape(t('opensNewTab')) + '</span></a></article>';
  }
  function renderSelection() {
    document.querySelectorAll('[data-category]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.category === state.category)); });
    document.querySelectorAll('#filter-groups input').forEach((input) => { input.checked = state.keywords.has(input.value); });
    $('filter-count').hidden = state.keywords.size === 0;
    $('filter-count').textContent = String(state.keywords.size);
    $('refine-button').classList.toggle('has-filters', state.keywords.size > 0);
    $('clear-filters').disabled = state.keywords.size === 0;
    $('clear-search').hidden = state.query.length === 0;
    document.querySelector('.search-shortcut').hidden = state.query.length > 0;
    const hasCriteria = state.query.length > 0 || state.category !== 'all' || state.keywords.size > 0;
    $('active-filters').hidden = !hasCriteria;
    let selected = '';
    if (state.category !== 'all') selected += '<button type="button" class="active-filter" data-remove-category aria-label="' + escape(t('remove') + ': ' + categories.get(state.category).name[state.language]) + '"><span>' + escape(categories.get(state.category).name[state.language]) + '</span><span aria-hidden="true">×</span></button>';
    selected += data.filters.filter((filter) => state.keywords.has(filter.id)).map((filter) => '<button type="button" class="active-filter" data-remove="' + escape(filter.id) + '" aria-label="' + escape(t('remove') + ': ' + filter.label[state.language]) + '"><span>' + escape(filter.label[state.language]) + '</span><span aria-hidden="true">×</span></button>').join('');
    $('active-filters').innerHTML = selected + (hasCriteria ? '<button type="button" class="text-button" data-reset>' + escape(t('clearAll')) + '</button>' : '');
  }
  function renderRecipes() {
    const recipes = filteredRecipes();
    const count = recipes.length;
    $('result-count').innerHTML = '<strong>' + count + '</strong> ' + (count === data.recipes.length ? t('recipes') : t('of') + ' ' + data.recipes.length + ' ' + t('recipes'));
    $('filter-results').textContent = count + ' ' + (count === 1 ? t('recipe') : t('matching'));
    $('endnote-count').textContent = t('endnote') + ' · ' + count + ' ' + t(count === 1 ? 'recipe' : 'recipes');
    $('endnote').hidden = count === 0;
    if (!count) {
      $('recipes').innerHTML = '<div class="empty-state">' + icon('search') + '<h2>' + escape(t('noResults')) + '</h2><p>' + escape(t('noResultsHelp')) + '</p><button type="button" class="apply-button" data-reset>' + escape(t('reset')) + '</button></div>';
    } else if (state.grouped) {
      let index = 0;
      $('recipes').innerHTML = data.categories.map((category) => {
        const group = recipes.filter((recipe) => recipe.category === category.id);
        if (!group.length) return '';
        return '<section class="recipe-section" aria-labelledby="heading-' + escape(category.id) + '"><h2 class="group-heading" id="heading-' + escape(category.id) + '">' + escape(category.name[state.language]) + '<span>' + group.length + '</span></h2><div class="recipe-grid">' + group.map((recipe) => recipeCard(recipe, index++)).join('') + '</div></section>';
      }).join('');
    } else {
      $('recipes').innerHTML = '<div class="recipe-grid">' + recipes.map(recipeCard).join('') + '</div>';
    }
    renderSelection();
  }
  function setFiltersOpen(open) {
    state.filtersOpen = open;
    $('filter-panel').hidden = !open;
    $('refine-button').setAttribute('aria-expanded', String(open));
  }
  function reset() {
    state.category = 'all'; state.query = ''; state.keywords.clear(); $('search').value = '';
    renderRecipes(); $('search').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-app-link]').forEach((link) => {
    link.href = data.appBase + link.dataset.appLink; link.target = '_blank'; link.rel = 'noopener';
  });
  $('search').addEventListener('input', (event) => { state.query = event.target.value; renderRecipes(); });
  $('clear-search').addEventListener('click', () => { state.query = ''; $('search').value = ''; renderRecipes(); $('search').focus(); });
  $('category-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (button) { state.category = button.dataset.category; renderRecipes(); }
  });
  $('refine-button').addEventListener('click', () => setFiltersOpen(!state.filtersOpen));
  $('show-results').addEventListener('click', () => { setFiltersOpen(false); $('refine-button').focus({preventScroll:true}); });
  $('clear-filters').addEventListener('click', () => { state.keywords.clear(); renderRecipes(); document.querySelector('#filter-groups input').focus({preventScroll:true}); });
  $('filter-groups').addEventListener('change', (event) => {
    const input = event.target;
    if (input.checked) state.keywords.add(input.value); else state.keywords.delete(input.value);
    renderRecipes();
  });
  $('active-filters').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.hasAttribute('data-reset')) return;
    if (button.hasAttribute('data-remove-category')) state.category = 'all';
    if (button.dataset.remove) state.keywords.delete(button.dataset.remove);
    renderRecipes();
    ($('active-filters').querySelector('button') || $('refine-button')).focus({preventScroll:true});
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-reset]')) reset();
    const menu = $('display-menu');
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => {
    state.language = button.dataset.language; applyPreferences(); renderLanguage(); renderRecipes(); persist();
  }));
  document.querySelectorAll('input[name="theme"], input[name="textSize"]').forEach((input) => input.addEventListener('change', () => {
    if (input.name === 'theme') state.theme = input.value; else state.textSize = input.value;
    applyPreferences(); persist();
  }));
  $('sort').addEventListener('change', (event) => { state.sort = event.target.value; renderRecipes(); persist(); });
  $('group-toggle').addEventListener('change', (event) => { state.grouped = event.target.checked; renderRecipes(); persist(); });
  document.addEventListener('keydown', (event) => {
    const isTyping = event.target.matches('input, textarea, select, [contenteditable="true"]');
    if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); $('search').focus(); }
    if (event.key === 'Escape') {
      if ($('display-menu').open) { $('display-menu').open = false; document.querySelector('.display-trigger').focus(); }
      else if (state.filtersOpen && ($('filter-panel').contains(event.target) || event.target === $('refine-button'))) { setFiltersOpen(false); $('refine-button').focus(); }
      else if (event.target === $('search') && state.query) { state.query = ''; $('search').value = ''; renderRecipes(); }
    }
  });
  // An image failure never removes a recipe or its readable title.
  $('recipes').addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG') { event.target.alt = t('photoUnavailable'); event.target.classList.add('image-unavailable'); }
  }, true);
  applyPreferences(); renderLanguage(); renderRecipes();
})();
