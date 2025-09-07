export default function pageMeta(element) {
  const cells = [
    [`Page Meta`],
    [element.textContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
