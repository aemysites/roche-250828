/* global WebImporter */
export default function parse(element, { document }) {
  const tabLinks = Array.from(element.querySelectorAll('a'));

  const rows = [['Article Type Filter']];

  tabLinks.forEach((a) => {
    const url = new URL(a.href);
   const params = new URLSearchParams(url.search);
    rows.push([[params.get('post_type')], [a.textContent]]);
  });

  // Create tabs block table from extracted rows
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
