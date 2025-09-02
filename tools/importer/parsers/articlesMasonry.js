export default function articlesMasonry(element) {
  const tease = 'tease';
  const customization = 'customization';
  const survey = 'survey';

  const gridItems = element.querySelectorAll('.grid-item');
  const items = [];

  gridItems.forEach((gridItem) => {
    const type = gridItem.classList.contains('insert-survey') ? survey
      : gridItem.classList.contains('customization-push') ? customization
        : tease;

    const cells = [];
    cells.push([type]);

    const img = gridItem.querySelector('.img-container img');
    cells.push([img]);

    const title = gridItem.querySelector('h2.title');
    cells.push([title]);

    const link = gridItem.querySelector('a');
    cells.push([link]);

    if (type === 'tease') {
      const postType = gridItem.querySelector('.post-type').textContent.trim();
      cells.push([postType])
    }

    items.push(cells);
  })

  const cells = [
    [`Articles (masonry)`],
    ...items,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
