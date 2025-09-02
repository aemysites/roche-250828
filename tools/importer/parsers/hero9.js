/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero section: .article-header
  const articleHeader = element.querySelector('.article-header');
  if (!articleHeader) return;

  // Find the prominent background image from .background style
  let backgroundImageUrl = null;
  const backgroundDiv = articleHeader.querySelector('.background');
  if (backgroundDiv) {
    const style = backgroundDiv.getAttribute('style');
    if (style) {
      const match = style.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (match && match[1]) {
        backgroundImageUrl = match[1];
      }
    }
  }
  let backgroundImgEl = null;
  if (backgroundImageUrl) {
    backgroundImgEl = document.createElement('img');
    backgroundImgEl.src = backgroundImageUrl;
    backgroundImgEl.alt = '';
  }

  // Find the heading (h1)
  const titleEl = articleHeader.querySelector('h1.article-h1');

  // Now find the intro content and video from <section class="article-content">
  const articleContent = element.querySelector('section.article-content');
  const contentElements = [];
  if (titleEl) {
    contentElements.push(titleEl);
  }

  if (articleContent) {
    // Find all paragraphs and figures in the content area
    // Only those before the main story (so we want intro)
    // content-article usually contains everything; let's just grab all <p>, <a>, <figure>
    const contentRoot = articleContent.querySelector('.content-article') || articleContent;
    // Get all immediate children <p> and <figure> (intro text + video)
    const introNodes = Array.from(contentRoot.children).filter(
      node => node.tagName === 'P' || node.tagName === 'FIGURE'
    );
    introNodes.forEach(node => {
      // If it's a <figure> and contains an iframe, convert iframe to a link
      if (node.tagName === 'FIGURE') {
        const iframe = node.querySelector('iframe');
        if (iframe && iframe.src) {
          // Create a link element with the iframe src
          const a = document.createElement('a');
          a.href = iframe.src;
          a.textContent = iframe.title || iframe.src;
          // Optionally add figcaption if present
          const caption = node.querySelector('figcaption');
          if (caption) {
            contentElements.push(a, caption);
          } else {
            contentElements.push(a);
          }
        } else {
          contentElements.push(node);
        }
      } else {
        contentElements.push(node);
      }
    });
  }

  // Compose the block table
  const cells = [
    ['Hero'],
    [backgroundImgEl ? backgroundImgEl : ''],
    [contentElements.length ? contentElements : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
