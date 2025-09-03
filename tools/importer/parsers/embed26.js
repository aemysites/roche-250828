export default function embed26Parser(element) {
  let uri = element.querySelector('figure iframe').src;

  if (uri) {
    const u = new URL(uri);
    u.searchParams.delete('origin');
    uri = u.toString();
  }

  const contentCell = document.createElement('div');
  contentCell.innerHTML += `<!-- field:embed_uri -->${uri}`;

  const cells = [
    [`Embed`],
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
