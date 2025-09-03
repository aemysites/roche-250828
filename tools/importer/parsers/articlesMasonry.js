export default function articlesMasonry(element) {
  const tease = 'tease';
  const customization = 'customization';
  const survey = 'survey';
  const testimony = 'testimony';
  const post = 'post';
  const advice = 'advice';
  const instagram = 'instagram';

  let variantClasses = 'masonry';

  const gridItems = element.querySelectorAll('.grid-item');
  const items = [];

  gridItems.forEach((gridItem) => {
    const type = gridItem.classList.contains('insert-survey') ? survey
      : gridItem.classList.contains('customization-push') ? customization
        : tease;

    const cells = [];
    cells.push([type]);

    const img = gridItem.querySelector('img') || '';
    cells.push([img]);

    const title = gridItem.querySelector('h2') || '';
    cells.push([title]);

    if (type === 'tease') {
      const link = gridItem.querySelector('a');
      cells.push([link]);

      const postType = gridItem.classList.contains('tease-testimony') ? testimony
        : gridItem.classList.contains('tease-post') ? post
        : gridItem.classList.contains('tease-advice') ? advice
        : gridItem.classList.contains('tease-instagram') ? instagram
          : '';
      cells.push([postType])
    } else {
      cells.push([''],['']);
    }

    items.push(cells);
  });

  const autoLoadButton = element.nextElementSibling?.classList.contains('auto-load-button')
    ? element.nextElementSibling
    : null ?? element.querySelector('.auto-load-button');
  if (autoLoadButton) {
    variantClasses += ', load-more'
    autoLoadButton.remove();
  }

  const cells = [
    [`Articles (${variantClasses})`],
    ...items,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
