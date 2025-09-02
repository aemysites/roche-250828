/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container
  const postsContainer = element.querySelector('.block-posts__items');
  const articles = postsContainer ? postsContainer.querySelectorAll('article.tease') : [];

  // Table header row as per the example: exactly 'Cards', one cell
  const rows = [['Cards']];

  articles.forEach(article => {
    // First cell: image (reference the image element directly)
    const img = article.querySelector('img');
    const imgCell = img || '';

    // Second cell: all text content for the card
    // Gather all relevant children from post-content div
    const postContent = article.querySelector('.post-content');
    const textItems = [];
    if (postContent) {
      Array.from(postContent.childNodes).forEach(node => {
        // Only add Elements or Text nodes with non-whitespace text
        if (node.nodeType === Node.ELEMENT_NODE) {
          textItems.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          // Wrap text in a span to preserve it as a DOM element
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textItems.push(span);
        }
      });
    }
    // If somehow nothing is present, make it empty string (shouldn't happen)
    const textCell = textItems.length > 0 ? textItems : '';

    rows.push([imgCell, textCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
