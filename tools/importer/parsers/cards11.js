/* global WebImporter */
export default function parse(element, { document }) {
  // Find all articles representing cards
  const articles = Array.from(element.querySelectorAll('.block-posts__items > article'));
  const cells = [['Cards']]; // header row, exactly as required

  articles.forEach(article => {
    // Image cell
    const img = article.querySelector('img') || '';
    // Text content cell should include ALL content from .post-content (including headings, paragraphs and any text nodes)
    const postContent = article.querySelector('.post-content');
    let textContent = [];
    if (postContent) {
      // Include all child nodes (elements AND text nodes with text) from .post-content
      textContent = Array.from(postContent.childNodes).filter(node => {
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
    }
    // If there's additional description or other elements outside .post-content, include those as well
    // For robustness, also check if there's text nodes after .post-content in the card structure
    // But in current source, .post-content contains all text, so this is sufficient
    cells.push([
      img,
      textContent
    ]);
  });

  // Create the block table using helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with the block table
  element.replaceWith(block);
}
