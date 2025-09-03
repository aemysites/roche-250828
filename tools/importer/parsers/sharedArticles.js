/* global WebImporter */
export default function parse(element, { document }) {
  const cta = 'cta';
  const post = 'post';

  const gridItems = element.querySelectorAll('.carousel-item');
  const items = [];

  gridItems.forEach((gridItem) => {
    const type = gridItem.querySelector('.shared-posts__cta') ? cta
      : gridItem.querySelector('.shared-post') ? post : null;

    const cells = [];
    cells.push([type]);

    const img = gridItem.querySelector('img') || '';
    cells.push([img]);

    const text = gridItem.querySelector('p')?.textContent.trim() || '';
    cells.push([text]);

    const link = gridItem.querySelector('a') || '';
    if (type === post) {
      const linkDiv = gridItem.querySelector('.link');
      link.textContent = '';
      link.append(linkDiv);
    }
    cells.push([link]);

    items.push(cells);
  });

  const cells = [
    [`Shared Articles`],
    ...items,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
