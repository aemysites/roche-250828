/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns12)'];

  // ---
  // We want two columns:
  // Left: copyright info and dates (all direct <span> children)
  // Right: menu links (ul), and cookie button
  // ---

  // Get all direct <span> children (copyright info and date)
  const leftSpans = Array.from(element.childNodes).filter(
    node => node.nodeType === 1 && node.tagName === 'SPAN' && !node.classList.contains('button-cookie')
  );

  // Build left cell: append all these spans, separated by a space
  const leftCell = document.createElement('div');
  leftSpans.forEach((span, idx) => {
    leftCell.append(span);
    if (idx < leftSpans.length - 1) {
      leftCell.append(document.createTextNode(' '));
    }
  });

  // ---
  // Right column construction: menu links and cookie button
  // ---
  const rightCell = document.createElement('div');

  // Get the <ul> (menu links and svg dots)
  const menuUl = element.querySelector('ul');
  if (menuUl) {
    // Copy all children as-is (svg separators and li with links)
    Array.from(menuUl.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'SVG') {
        rightCell.append(node);
        rightCell.append(document.createTextNode(' '));
      } else if (node.nodeType === 1 && node.tagName === 'LI') {
        rightCell.append(node);
        rightCell.append(document.createTextNode(' '));
      }
    });
  }
  // Find the <span class="button-cookie">, which contains the cookie button
  const cookiePrefSpan = element.querySelector('span.button-cookie');
  if (cookiePrefSpan) {
    rightCell.append(cookiePrefSpan);
  }

  // Table cells: one row with two columns
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
