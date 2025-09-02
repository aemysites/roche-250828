/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all tab links (each tab label)
  const tabLinks = Array.from(element.querySelectorAll('a'));

  // Prepare rows for Tabs block
  // Header row must match example: 'Tabs'
  const rows = [['Tabs']];

  // Each subsequent row: [tab title, heading(opt), image(opt), content(opt)]
  tabLinks.forEach((a) => {
    // Use the text content for the tab title
    const tabTitle = a.textContent.trim();
    // No heading, image, or content available in this HTML, so set as empty string
    rows.push([tabTitle, '', '', '']);
  });

  // Create tabs block table from extracted rows
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // There is NO Section Metadata block in the example, so do NOT create any metadata table or hr

  // Replace the original element with the new table block only
  element.replaceWith(blockTable);
}
