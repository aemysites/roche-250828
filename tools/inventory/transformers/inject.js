(() => {
  document.querySelector('header')?.remove();
  document.querySelector('footer')?.remove();
  document.querySelector('.yellow-bar')?.remove();
  document.querySelector('#onetrust-consent-sdk')?.remove();
  document.querySelector('.skip-link')?.remove();

  // SELECTORS to group as "Hero" blocks
  const heroSelectors = [
    '.header-home',
    '.article-header',
    '.header-page',
  ];

  // For robustness, apply a unique class and marker attribute for block detection and visual differentiation.
  heroSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      // Add a standard marker class (block-hero); agent will use this for clustering.
      el.classList.add('block-hero');
      // Add a data attribute for further clustering compatibility.
      el.setAttribute('data-block-type', 'hero');
      // Optionally add a unique block variant to avoid accidental merging.
      el.setAttribute('data-block-key', `hero-${idx}-${sel.replace('.', '')}`);
      // (Optional) Give a border so the snapshot can visually distinguish the block -- REMOVE before production.
      el.style.outline = "2px solid #FF0000";
    });
  });
})();
