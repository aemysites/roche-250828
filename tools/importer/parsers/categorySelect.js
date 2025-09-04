export default function heroParser(element) {
  const cells = [
    [`Category Select`],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
