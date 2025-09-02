/* global WebImporter */
export default function parse(element, { document }) {
  // Find all article cards
  const articles = element.querySelectorAll('article.tease');
  // Create the header row exactly as in the example
  const rows = [
    ['Cards']
  ];

  articles.forEach(article => {
    // Image extraction (first cell)
    const img = article.querySelector('img');
    const imageCell = img || '';

    // Post type (eg. Témoignages)
    let postTypeNode = '';
    const postType = article.querySelector('.post-type');
    if (postType && postType.textContent.trim()) {
      postTypeNode = document.createElement('p');
      postTypeNode.textContent = postType.textContent.trim();
    }

    // Title extraction (second cell)
    let titleNode = '';
    const h2 = article.querySelector('h2, .title, .h2');
    if (h2 && h2.textContent.trim()) {
      // For bolding: use <strong> inside a <p>, to match the semantic meaning
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent.trim();
      p.appendChild(strong);
      titleNode = p;
    }

    // Compose right cell content
    const contentNodes = [];
    if (postTypeNode) contentNodes.push(postTypeNode);
    if (titleNode) contentNodes.push(titleNode);

    // Wrap with link if link is present
    const link = article.querySelector('a[href]');
    let rightCell;
    if (link && contentNodes.length > 0) {
      const a = document.createElement('a');
      a.href = link.href;
      contentNodes.forEach(n => a.appendChild(n));
      rightCell = a;
    } else if (contentNodes.length > 0) {
      rightCell = contentNodes;
    } else {
      rightCell = '';
    }

    rows.push([imageCell, rightCell]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
