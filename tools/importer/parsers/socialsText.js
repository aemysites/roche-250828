/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the direct <a> children (social links)
  const links = Array.from(element.querySelectorAll(':scope > a'));
  // Each cell in the second row is a reference to the original link element
  const contentRow = links;
  // Header row must be a single column with the block name
  const table = WebImporter.DOMUtils.createTable([
    ['Socials (text)'],
    [''],
    [contentRow],
  ], document);
  element.replaceWith(table);
}
