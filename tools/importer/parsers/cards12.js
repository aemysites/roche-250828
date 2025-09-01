/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match the example exactly: ['Cards']
  const table = [['Cards']];

  // Select all cards (articles)
  const cards = Array.from(element.querySelectorAll('article.tease'));

  cards.forEach(card => {
    // Left cell: the image element (if present)
    const img = card.querySelector('img') || '';

    // Right cell: must contain all text content from the card, keeping structure
    // We'll include the whole .post-content block for maximal fidelity and flexibility
    const contentDiv = card.querySelector('.post-content');
    let rightCell;
    if (contentDiv) {
      // Reference the original element, not a clone
      rightCell = contentDiv;
    } else {
      // Fallback: empty string if not found
      rightCell = '';
    }

    table.push([img, rightCell]);
  });

  // Only the cards block is in the example, no Section Metadata table
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
