/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column items in the carousel structure
  // Each .carousel-item represents one column
  const itemsContainer = element.querySelector('.shared-posts__items');
  let items = [];
  if (itemsContainer) {
    items = Array.from(itemsContainer.children);
  } else {
    items = Array.from(element.querySelectorAll('.carousel-item'));
  }
  // Fallback: If no .carousel-item found, treat all direct child divs as columns
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope > div'));
  }
  // Build content for each column
  const columns = items.map((item) => {
    // Collect all direct children (including text nodes)
    const children = [];
    item.childNodes.forEach((node) => {
      if (node.nodeType === 3) { // text node
        if (node.textContent.trim()) {
          const div = document.createElement('div');
          div.textContent = node.textContent.trim();
          children.push(div);
        }
      } else if (node.nodeType === 1) { // element node
        children.push(node);
      }
    });
    // If only one child, use that, else use array
    if (children.length === 1) return children[0];
    if (children.length > 1) return children;
    // If nothing found, return an empty string (edge case)
    return '';
  });

  // Header row - matches the example exactly
  const headerRow = ['Columns (columns23)'];

  // Table structure: header row, then a single row with columns
  const rows = [headerRow, columns];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
