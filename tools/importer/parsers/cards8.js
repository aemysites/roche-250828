/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card area container
  const itemsContainer = element.querySelector('.block-posts__items');
  if (!itemsContainer) {
    // fallback: if the structure changes
    element.replaceWith(WebImporter.DOMUtils.createTable([['Cards']], document));
    return;
  }
  const ctaBlock = itemsContainer.querySelector('.block-posts__cta');

  // Compose the image cell: reference the original <img> element
  let imgEl = null;
  if (ctaBlock) {
    imgEl = ctaBlock.querySelector('img');
  }

  // Compose the text content cell: reference content blocks directly
  // Collect all child nodes except <img>
  let textCellContent = [];
  if (ctaBlock) {
    Array.from(ctaBlock.childNodes).forEach((child) => {
      if (!(child.nodeType === 1 && child.tagName === 'IMG')) {
        if (
          child.nodeType === 1 ||
          (child.nodeType === 3 && child.textContent.trim().length > 0)
        ) {
          textCellContent.push(child);
        }
      }
    });
    // Ensure at least some content is present (if all were empty text nodes)
    if (textCellContent.length === 0) {
      textCellContent.push(document.createTextNode(''));
    }
  }

  // Final cards table. Header must be exactly 'Cards' per the example, and only one column in the header row.
  const cells = [
    ['Cards'],
    [imgEl, textCellContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // There is NO Section Metadata block in the example markdown for this HTML
  // No <hr> section break is needed

  // Replace the original element
  element.replaceWith(block);
}
