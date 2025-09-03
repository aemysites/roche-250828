export default function testimony27Parser(element) {
  const img = element.querySelector('img');
  const label = element.querySelector('.testimony-intro__info .label').textContent;
  const name = element.querySelector('h2').textContent;
  const description = element.querySelector('.description').textContent;

  const cells = [
    [`Testimony`],
    [img],
    [label],
    [name],
    [description],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
