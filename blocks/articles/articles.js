import { fetchPlaceholders } from '../../scripts/aem.js';
import {
  buildTeaseFromCustomizationResponse,
  configureMasonryContainer,
  handleMasonryItems,
  isMasonrySupported,
} from './utils.js';

const loadMoreEndpoint = 'https://www.lumieresurlasep.fr/wp-json/lsls/v1/customized-request';

async function fetchArticles(page) {
  try {
    const response = await fetch(`${loadMoreEndpoint}?count=0&page=${page}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

async function addArticles(block, itemsContainer, items, articles, resizeObserver) {
  const newItems = [...articles]
    .map((article) => buildTeaseFromCustomizationResponse(article, block));
  itemsContainer.textContent = '';
  items.push(...newItems);
  itemsContainer.append(...items);

  if (resizeObserver) {
    // Required to observe to each new article as otherwise image loading is an issue
    newItems.forEach((item) => {
      resizeObserver.observe(item);
    });
  }
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();

  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('articles__items');

  const items = [...block.querySelectorAll(':scope > div')];
  let teaseCount = 0;

  items.forEach((item) => {
    const typeContainer = item.querySelector(':scope > div:first-child');
    const type = typeContainer.textContent.trim();
    item.classList.add('articles__item', type);

    if (type === 'articles-tease') {
      teaseCount += 1;

      const title = item.querySelector('h2');
      const postType = item.querySelector(':scope > div:nth-child(5)');
      postType.classList.add('articles__item__post-type');

      const linkContainer = item.querySelector(':scope > div:nth-child(4)');
      const link = linkContainer.querySelector('a');
      link.textContent = '';
      link.parentElement.classList.remove('button-container');
      link.classList.remove('button');
      link.append(...([...item.children].filter((el) => el !== linkContainer)));

      // Set first 6 articles to eager loading (above the fold)
      const img = item.querySelector('img');
      if (img && teaseCount <= 6) {
        img.setAttribute('loading', 'eager');
        // Add fetchpriority for the first 3 most critical images
        if (teaseCount <= 3) {
          img.setAttribute('fetchpriority', 'high');
        }
      }

      const span = document.createElement('span');
      span.classList.add('articles__item__h2__text');
      span.textContent = title.textContent;
      title.textContent = '';
      title.append(span);
    } else if (type === 'articles-customization') {
      const linkLabelContainer = item.querySelector(':scope > div:nth-child(4)');
      const linkLabelAfterContainer = item.querySelector(':scope > div:nth-child(5)');

      const beforeButton = document.createElement('a');
      beforeButton.classList.add('button', 'articles-customization__push-before');
      beforeButton.textContent = linkLabelContainer.textContent;
      beforeButton.href = '#customize';

      const afterButton = document.createElement('a');
      afterButton.classList.add('articles-customization__push-after');
      afterButton.textContent = linkLabelAfterContainer.textContent;
      afterButton.href = '#customize';

      linkLabelContainer.replaceWith(beforeButton);
      linkLabelAfterContainer.replaceWith(afterButton);
    }

    typeContainer.remove();

    itemsContainer.append(item);
  });
  block.prepend(itemsContainer);

  let resizeObserver;
  if (!isMasonrySupported(block)) {
    configureMasonryContainer(itemsContainer);

    resizeObserver = new ResizeObserver(async () => {
      await handleMasonryItems(itemsContainer, items);
    });
    resizeObserver.observe(itemsContainer);

    // Wait for initial layout calculation, then show the articles
    setTimeout(async () => {
      try {
        await handleMasonryItems(itemsContainer, items);
        // Small delay to ensure layout is truly stable
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Initial masonry calculation failed:', error);
      }
      itemsContainer.classList.add('stable');
    }, 50);

    // Failsafe: ensure articles show after 1 second no matter what
    setTimeout(() => {
      if (!itemsContainer.classList.contains('stable')) {
        itemsContainer.classList.add('stable');
      }
    }, 500);
  } else {
    // For browsers with native masonry support, show immediately
    itemsContainer.classList.add('stable');
  }

  let page = 1;
  const loadMoreButtonWrapper = document.createElement('div');
  loadMoreButtonWrapper.classList.add('articles__load-more');
  const loadMoreButton = document.createElement('button');
  loadMoreButton.classList.add('button', 'articles__load-more__cta');
  loadMoreButton.textContent = placeholders.loadMoreArticles;
  loadMoreButtonWrapper.append(loadMoreButton);
  loadMoreButton.addEventListener('click', async () => {
    const nextPage = page + 1;
    itemsContainer.classList.add('loading');
    const result = await fetchArticles(nextPage);
    if (result) {
      await addArticles(block, itemsContainer, items, result.posts, resizeObserver);
      page += 1;
      itemsContainer.classList.remove('loading');
    }
  });

  block.append(loadMoreButtonWrapper);
}
