/* global WebImporter */
export default function parse(element, { document }) {
  // Find the article header section for the Hero block
  const articleHeader = element.querySelector('.article-header');
  if (!articleHeader) return;

  // Get background image from .background style
  let bgImgUrl = null;
  const bgDiv = articleHeader.querySelector('.background');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    // backgroundImage: url('...')
    const match = bgDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      bgImgUrl = match[1];
    }
  }

  // Get main heading
  let heading = null;
  const headingDiv = articleHeader.querySelector('.article-header__title h1');
  if (headingDiv) {
    heading = headingDiv;
  }

  // Get paysage image
  let paysageImg = articleHeader.querySelector('img.paysage-img');

  // Compose image cell: prefer background image, fallback to paysage image
  let imageCell = null;
  if (bgImgUrl) {
    // Use background image as image element for cell
    const imgEl = document.createElement('img');
    imgEl.src = bgImgUrl;
    imgEl.alt = '';
    imageCell = imgEl;
  } else if (paysageImg) {
    imageCell = paysageImg;
  }

  // Compose headline cell (use heading)
  let headlineCell = null;
  if (heading) {
    headlineCell = heading;
  }

  // Build table cells
  const cells = [
    ['Hero'],
    [imageCell],
    [headlineCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element
  element.replaceWith(table);
}
