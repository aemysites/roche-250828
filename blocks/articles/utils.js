import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

function areImagesLoaded(container) {
  const images = Array.from(container.querySelectorAll('img'));
  return images.map((img) => new Promise((resolve, reject) => {
    if (img.complete) {
      resolve();
      return;
    }
    img.onload = resolve;
    img.onerror = reject;
  }));
}

export function buildTease(href, type, title, imgSrc, eager = false) {
  const optimisedPicture = createOptimizedPicture(imgSrc, '', eager);
  const tease = document.createElement('div');
  tease.classList.add('articles__item', 'articles-tease');

  const wrapper = document.createElement('div');
  const para = document.createElement('p');
  const link = document.createElement('a');
  const imageDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const postTypeDiv = document.createElement('div');
  const h2 = document.createElement('h2');
  const h2Span = document.createElement('span');
  const postType = document.createElement('p');

  wrapper.append(para);
  para.append(link);

  link.append(imageDiv, titleDiv, postTypeDiv);
  link.href = href;

  imageDiv.append(optimisedPicture);

  postTypeDiv.append(postType);
  postTypeDiv.classList.add('articles__item__post-type');
  postType.textContent = type;

  titleDiv.append(h2);
  h2.id = toClassName(title);
  h2.append(h2Span);
  h2Span.textContent = title;
  h2Span.classList.add('articles__item__h2__text');

  tease.append(wrapper);

  return tease;
}

export function buildTeaseFromCustomizationResponse(article, block) {
  const range = document.createRange();
  range.selectNode(block);
  const documentFragment = range.createContextualFragment(article);
  const { href } = documentFragment.querySelector('a');
  const type = documentFragment.querySelector('.post-type').textContent.trim();
  const imgSrc = documentFragment.querySelector('img').src;
  const title = documentFragment.querySelector('h2').textContent.trim();

  return buildTease(href, type, title, imgSrc);
}

export function isMasonrySupported(container) {
  return getComputedStyle(container).gridTemplateRows === 'masonry';
}

export async function handleMasonryItems(container, items) {
  try {
    // Wait for ALL images to load before recalculating masonry
    const imagePromises = areImagesLoaded(container);
    await Promise.all(imagePromises);
  } catch (e) {
    // Continue even if some images fail to load
  }

  // Batch DOM reads and writes to prevent multiple reflows
  const colGap = parseFloat(getComputedStyle(container).columnGap) || 20;
  
  // Read all heights first (batched reads)
  const measurements = items.map(item => ({
    item,
    height: item.getBoundingClientRect().height
  }));

  // Apply all changes in one batch (batched writes)
  measurements.forEach(({ item, height }) => {
    item.style.gridRowEnd = `span ${Math.round(height + colGap)}`;
  });
}

export function configureMasonryContainer(container) {
  container.style.gridAutoRows = '0px';
  container.style.setProperty('row-gap', '1px');
}
