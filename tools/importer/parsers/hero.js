export default function heroParser(element) {
  let variant = 'default';
  if (element.classList.contains('header-home')) variant = 'home';
  if (element.classList.contains('article-header')) variant = 'article';
  if (element.classList.contains('header-page')) variant = 'page';

  const headline = element.querySelector('h1')?.textContent.trim() || '';
  const label = element.querySelector('.label-hp')?.textContent.trim() || '';
  const p = element.querySelector('p')?.textContent.trim() || '';
  const img = element.querySelector('img')?.getAttribute('src') || '';
  const graphic = element.querySelector('.graphic-line')?.innerHTML || '';

  const cells = [
    [`Hero (${variant})`], [headline], [label], [p], [img], [graphic]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
