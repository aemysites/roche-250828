/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image (first img in block)
  const img = element.querySelector('img');

  // Find text container and collect relevant children
  const textContainer = element.querySelector('.text-container');
  const cellContents = [];
  const h1Row = [];
  const graphicLineRow = []

  if (textContainer) {
    // Find label (subheading)
    const label = textContainer.querySelector('.label-hp');
    if (label) cellContents.push(label);
    // Find h1 (main headline)
    const h1 = textContainer.querySelector('h1');
    if (h1) h1Row.push(h1);
    // Find graphic line (svg)
    const graphicLine = textContainer.querySelector('.graphic-line');
    if (graphicLine) graphicLineRow.push(graphicLine);
  }

  // Table rows based on example structure
  const rows = [
    ['Hero'], // Table header: exactly matches example
    [img], // Image row
    [cellContents],
    [h1Row], // heading row
    [graphicLineRow]
  ];

  // Create table using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the block table
  element.replaceWith(table);
}
