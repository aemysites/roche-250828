/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container
  const postsContainer = element.querySelector('.block-posts__items');
  const ctas = postsContainer ? postsContainer.querySelectorAll('.block-posts__cta') : [];

  // Table header row as per the example: exactly 'Cards', one cell
  const rows = [['Customized Articles']];

  const items = [];

  ctas.forEach(cta => {
    const cells = [];
    cells.push(['customized-articles-cta']);

    const img = cta.querySelector('img') || '';
    cells.push([img]);

    const text = cta.querySelector('div')?.textContent.trim() || '';
    cells.push([text]);

    const link = cta.querySelector('a') || '';
    cells.push([link]);

    items.push(cells);
  });

  rows.push(...items);

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
