/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Columns (columns1) table header
  const headerRow = ['Columns (columns1)'];

  // 2. Prepare the two columns for the row
  // LEFT: static info + cookie button
  // RIGHT: footer links (from ul)

  // LEFT column: gather from all children EXCEPT the <ul> (footer links)
  const leftColNodes = [];
  for (const node of element.childNodes) {
    // Exclude the ul (goes to right col)
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL') continue;
    // Everything else (span, svg, text, etc.)
    leftColNodes.push(node);
  }

  // RIGHT column: just the <ul> (footer links)
  let rightColNodes = [];
  const ul = element.querySelector('ul');
  if (ul) {
    // Flatten the <ul>, i.e. keep its children for better semantic (looks like dots and links)
    rightColNodes = Array.from(ul.childNodes);
  }

  // Compose the table
  const cells = [
    headerRow,
    [leftColNodes, rightColNodes]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
