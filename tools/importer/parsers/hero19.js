/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .article-header for the hero block
  const articleHeader = element.querySelector('.article-header');
  if (!articleHeader) return;

  // --- 1. Extract the background image ---
  let bgUrl = null;
  // First try the .background div
  const bgDiv = articleHeader.querySelector('.background');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (match) bgUrl = match[1];
  }
  // Fallback to .paysage-img
  if (!bgUrl) {
    const paysageImg = articleHeader.querySelector('img.paysage-img');
    if (paysageImg && paysageImg.src) bgUrl = paysageImg.src;
  }

  // --- 2. Extract the title (h1) ---
  let titleEl = null;
  const h1 = articleHeader.querySelector('h1, .article-h1');
  if (h1) {
    titleEl = h1;
  }

  // --- 3. Build the table structure as per example ---
  // Row 1: ['Hero']
  // Row 2: [<img> for background]
  // Row 3: [Heading]
  const heroRows = [];
  heroRows.push(['Hero']);

  // Background image row
  let bgCell = '';
  if (bgUrl) {
    // Create a new <img> for the block (to avoid duplicates in DOM)
    const img = document.createElement('img');
    img.src = bgUrl;
    bgCell = img;
  }
  heroRows.push([bgCell]);

  // Title row
  let titleCell = '';
  if (titleEl) {
    // Use the existing heading element, but ensure it's not moved out of content
    // If the element is already attached elsewhere, clone it to not remove from its original position
    const clone = document.createElement('h1');
    clone.textContent = titleEl.textContent;
    titleCell = clone;
  }
  heroRows.push([titleCell]);

  // --- 4. Create the hero block table ---
  const heroTable = WebImporter.DOMUtils.createTable(heroRows, document);

  // --- 5. Replace the original element ---
  element.replaceWith(heroTable);
}
