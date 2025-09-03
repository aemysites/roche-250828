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
    cells.push([`articles-${type}`]);

    // Tease Field Count 1
    // Customization Field Count 1
    // Survey Field Count 1

    if (type === 'tease') {
      const img = gridItem.querySelector('.img-container img') || '';
      cells.push([img]);
    } else if (type === 'survey') {
      const img = gridItem.querySelector('img') || '';
      cells.push([img]);
    }

    // Tease Field Count 2
    // Customization Field Count 1
    // Survey Field Count 2

    if (type === 'tease' || type === "customization") {
      const title = gridItem.querySelector('h2') || '';
      cells.push([title]);
    } else if (type === 'survey') {
      const title = gridItem.querySelector('.survey-question') || '';
      cells.push([title]);
    }

    // Tease Field Count 3
    // Customization Field Count 2
    // Survey Field Count 3

    if (type === 'tease') {
      const link = gridItem.querySelector('a');
      cells.push([link]);

      const postType = gridItem.classList.contains('tease-testimony') ? testimony
        : gridItem.classList.contains('tease-post') ? post
        : gridItem.classList.contains('tease-advice') ? advice
        : gridItem.classList.contains('tease-instagram') ? instagram
          : '';
      cells.push([postType])
    }

    // Tease Field Count 5
    // Customization Field Count 2
    // Survey Field Count 3

    if (type === 'customization') {
      const text = gridItem.querySelector('.customization-push__text');
      cells.push([text]);

      gridItem.querySelectorAll('.customization-push__button, .customization-push__button--active').forEach((pushButton) => {
        cells.push([pushButton.textContent.trim()]);
      });
    }

    // Tease Field Count 5
    // Customization Field Count 5
    // Survey Field Count 3

    if (type === 'survey') {
      cells.push([''], [''])
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
