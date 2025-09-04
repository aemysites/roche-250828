export default function heroParser(element) {
  const headline = element.querySelector('h1')?.textContent.trim() || '';
  const img = element.querySelector('img') || '';
  const tagLine = element.querySelector('p.cat-parent') || '';
  const description = element.querySelector('p:not(.cat-parent)') || '';

  const cells = [
    [`Category Hero`],
    [img],
    [tagLine],
    [headline],
    [description],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
