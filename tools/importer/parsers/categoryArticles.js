export default function categoryArticles(element) {
  const cells = [
    [`Category Articles`]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
