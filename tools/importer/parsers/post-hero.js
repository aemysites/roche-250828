export default function heroParser(element) {
  const heroImage = element.querySelector('.background');
  const headline = element.querySelector('h1')?.textContent.trim() || '';

  // extract the background-image style from the heroImage, and trim url from the string, extract just the url
  // remove the quotes from the url
  const backgroundImage = heroImage.style.backgroundImage.trim().split('url(')[1].split(')')[0].replace(/^"|"$/g, '');
  const backgroundImageEl = document.createElement('img');
  backgroundImageEl.src = backgroundImage;
  backgroundImageEl.alt = '';

  const cells = [
    [`Post Hero`],
    [headline],
    [backgroundImageEl],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
