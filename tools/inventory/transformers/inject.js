(() => {
  document.querySelector('header')?.remove();
  document.querySelector('footer')?.remove();
  document.querySelector('.yellow-bar')?.remove();
  document.querySelector('#onetrust-consent-sdk')?.remove();
  document.querySelector('.skip-link')?.remove();

  document.querySelectorAll('.header-home, .article-header, .header-page').forEach(el => {
    el.setAttribute('data-block-type', 'hero');
  });
})();
