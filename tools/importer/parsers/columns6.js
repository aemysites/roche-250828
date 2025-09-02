/* global WebImporter */
export default function parse(element, { document }) {
  // To maintain correct ordering and include all SVG separators, collect left column content as per childNodes
  const leftColContent = [];
  Array.from(element.childNodes).forEach((node) => {
    if (
      node.nodeType === 1 && // Element node
      (node.tagName === 'SPAN' || node.tagName === 'SVG' || node.tagName === 'UL')
    ) {
      leftColContent.push(node);
    } else if (node.nodeType === 3 && node.textContent.trim() !== '') {
      // For non-empty text nodes, wrap in a span (though this example likely doesn't have any)
      const span = document.createElement('span');
      span.textContent = node.textContent;
      leftColContent.push(span);
    }
  });

  // Right column: cookie button if present
  let rightCol = '';
  const cookiePrefSpan = element.querySelector('span.button-cookie');
  if (cookiePrefSpan) {
    rightCol = cookiePrefSpan;
  }

  // Ensure header row is exactly one column (not two!)
  const cells = [
    ['Columns (columns6)'],
    [leftColContent, rightCol]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
