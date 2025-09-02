function isMasonrySupported(container) {
  return getComputedStyle(container).gridTemplateRows === 'masonry';
}

function areImagesLoaded(container) {
  const images = Array.from(container.querySelectorAll('img'));
  return images.map((img) => new Promise((resolve, reject) => {
    if (img.complete) return;
    img.onload = resolve;
    img.onerror = reject;
  }));
}

async function masonry(block, items) {
  try {
    await Promise.all([areImagesLoaded(block)]);
  } catch (e) {
    // Do nothing
  }

  block.style.gridAutoRows = '0px';
  block.style.setProperty('row-gap', '1px');
  const colGap = parseFloat(getComputedStyle(block).columnGap);

  items.forEach((item) => {
    const ib = item.getBoundingClientRect();
    item.style.gridRowEnd = `span ${Math.round(ib.height + colGap)}`;
  });
}

export default async function decorate(block) {
  const items = block.querySelectorAll(':scope > div');
  items.forEach((item) => {
    const typeContainer = item.querySelector(':scope > div:first-child');
    const type = typeContainer.textContent.trim();
    item.classList.add('articles__item', type);

    const title = item.querySelector('h2');
    const postType = item.querySelector(':scope > div:nth-child(5)');

    if (type === 'tease') {
      postType.classList.add('articles__item__post-type');

      const linkContainer = item.querySelector(':scope > div:nth-child(4)');
      const link = linkContainer.querySelector('a');
      link.textContent = '';
      link.parentElement.classList.remove('button-container');
      link.classList.remove('button');
      link.append(...([...item.children].filter((el) => el !== linkContainer)));

      if (title) {
        const span = document.createElement('span');
        span.classList.add('articles__item__h2__text');
        span.textContent = title.textContent;
        title.textContent = '';
        title.append(span);
      }
    } else {
      postType.remove();
    }

    typeContainer.remove();
  });

  if (!isMasonrySupported(block)) {
    const resizeObserver = new ResizeObserver(async (entries) => {
      if (entries[0].contentRect.height > 0) {
        await masonry(block, items);
      }
    });
    resizeObserver.observe(block);
  }
}
