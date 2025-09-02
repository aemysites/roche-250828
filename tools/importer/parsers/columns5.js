/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: collect all direct children, skipping SVG separators
  function getCleanContent(parent) {
    const content = [];
    for (const child of parent.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName.toLowerCase() === 'svg') continue; // skip SVG separators
        if (child.tagName.toLowerCase() === 'ul') {
          // For the menu links: grab all <a> links inside <li>
          const links = [];
          child.querySelectorAll('li').forEach(li => {
            const a = li.querySelector('a');
            if (a) links.push(a);
          });
          if (links.length > 0) content.push(...links);
          continue;
        }
        if (child.tagName.toLowerCase() === 'span' && child.classList.contains('button-cookie')) {
          // For the cookie button, use the button element
          const btn = child.querySelector('button');
          if (btn) content.push(btn);
          continue;
        }
        content.push(child);
      } else if (child.nodeType === Node.TEXT_NODE) {
        const txt = child.textContent.trim();
        if (txt) content.push(document.createTextNode(txt));
      }
    }
    return content;
  }

  // Extract all relevant visible content from the footer
  const footerContent = getCleanContent(element);

  // Compose the columns block as in the example: single row, single cell, all content
  const headerRow = ['Columns (columns5)'];
  const row = [footerContent];
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
