/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as specified
  const headerRow = ['Columns (columns17)'];

  // Collect all immediate children as potential columns
  const columns = Array.from(element.children);

  // If there are exactly two direct children, use them as columns
  // Else, fallback: try to split left/right by common header patterns
  let col1, col2;
  if (columns.length === 2) {
    col1 = columns[0];
    col2 = columns[1];
  } else {
    // Fallback: try find known left and right containers
    col1 = element.querySelector('.logo') || '';
    col2 = element.querySelector('.header-container__right') || '';
    // If either is not found, try to combine all children into col1
    if (!col1 && !col2 && columns.length) {
      col1 = columns;
      col2 = '';
    }
  }

  // Compose the row for the columns block
  const columnsRow = [col1, col2];

  // Assemble table cells
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
