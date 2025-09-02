/* global WebImporter */
export default function parse(element, { document }) {
  // Get all card articles
  const cards = Array.from(element.querySelectorAll('.block-posts__items > article.tease'));
  const table = [];
  // Table header as in example markdown
  table.push(['Cards']);

  cards.forEach((card) => {
    // First cell: image
    let imageCell = '';
    const img = card.querySelector('img');
    if (img) imageCell = img;

    // Second cell: gather ALL content from .post-content (post-type, h2, description, etc.)
    const postContent = card.querySelector('.post-content');
    let textCell = [];
    if (postContent) {
      // Get ALL child nodes, including text, elements, descriptions, etc.
      textCell = Array.from(postContent.childNodes).filter((n) => {
        return n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '';
      });
    }
    // If .post-content is missing, fallback to the card's text
    if (!textCell.length) {
      textCell = [card.textContent.trim()];
    }
    // Compose the row for the card
    table.push([imageCell, textCell]);
  });

  // Replace element with block table
  const blockTable = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(blockTable);
}
