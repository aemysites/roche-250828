/* global WebImporter */
export default function parse(element, { document }) {
  // 1. The block name is always 'Search' (header row)
  // 2. The second row must contain all visible text content and UI from the search area as in the screenshots
  // 3. The second row must also include the canonical search index URL from the block description
  // 4. There is no Section Metadata in the example, so do not create one
  // 5. Do not hardcode any prompt or UI text - always reference from the DOM
  // 6. Reference existing DOM elements (do not clone or create unnecessary wrappers)
  // 7. Maintain semantic meaning (placeholder, visible text, etc)

  // Find the search UI area as broadly as possible (form, nav-search, etc)
  let searchArea;
  // Prefer the nav-search block if present
  searchArea = element.querySelector('.nav-search');
  // If not, look for a form directly
  if (!searchArea) {
    searchArea = element.querySelector('form');
  }

  // If neither, fallback to all direct children of element
  let searchContent = [];
  if (searchArea) {
    // Get all relevant nodes (including text and element nodes that are visible)
    searchContent = Array.from(searchArea.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
  } else {
    // Fallback: use all direct children of element (as last resort)
    searchContent = Array.from(element.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
  }

  // Always include the search index url as the last part of the cell, as per block spec
  const searchIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';

  // Compose the cell value: all UI/text content (as elements/strings), then the url
  const cellContent = [...searchContent, searchIndexUrl];

  // Construct the block table as per the example: header row, 1 content row
  const cells = [
    ['Search'],
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
