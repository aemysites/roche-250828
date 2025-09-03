export default function articlesMasonry(element) {
  const tease = 'tease';
  const customization = 'customization';
  const survey = 'survey';
  const testimony = 'testimony';
  const post = 'post';
  const advice = 'advice';
  const instagram = 'instagram';

  const gridItems = element.querySelectorAll('.grid-item');
  const items = [];

  gridItems.forEach((gridItem) => {
    const type = gridItem.classList.contains('insert-survey') ? survey
      : gridItem.classList.contains('customization-push') ? customization
        : tease;

    const cells = [];
    cells.push([type]);

    if (type === 'tease') {
      const img = gridItem.querySelector('.img-container img') || '';
      cells.push([img]);
    } else if (type === 'survey') {
      const img = gridItem.querySelector('img') || '';
      cells.push([img]);
    } else {
      cells.push(['']);
    }

    if (type === 'tease' || type === "customization") {
      const title = gridItem.querySelector('h2') || '';
      cells.push([title]);
    } else if (type === 'survey') {
      const title = gridItem.querySelector('.survey-question') || '';
      cells.push([title]);
    } else {
      cells.push(['']);
    }

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
    autoLoadButton.remove();
  }

  const cells = [
    [`Articles`],
    ...items,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
