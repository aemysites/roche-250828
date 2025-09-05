import { fetchPageIndex } from '../../scripts/utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  configureMasonryContainer,
  handleMasonryItems,
  isMasonrySupported,
} from '../articles/utils.js';

// Decorate category articles
export default async function decorate(block) {
  const index = await fetchPageIndex();
  const category = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const postTypes = searchParams.get('post_type')
    ? [searchParams.get('post_type')]
    : ['post', 'advice', 'instagram', 'testimony'];

  console.log(postTypes);
  const filteredIndexes = index
    .filter((item) => {
      const itemCategories = item.category.split(', ')
        .filter((itemCategory) => itemCategory);
      return itemCategories.some((cat) => category.endsWith(cat));
    })
    .filter((item) => postTypes.includes(item.template));

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('category-articles__items');

  const cards = filteredIndexes.map((item) => {
    const card = document.createElement('a');
    card.href = item.path;
    const type = document.createElement('div');
    type.classList.add('category-articles__item__post-type');
    type.textContent = item.template;
    const title = document.createElement('h2');
    title.classList.add('category-articles__item__h2');
    const titleText = document.createElement('span');
    titleText.classList.add('category-articles__item__h2__text');
    titleText.textContent = item.title;
    title.append(titleText);
    const imgSrc = item['poster-image'];
    const img = createOptimizedPicture(imgSrc);
    img.classList.add('category-articles__item__image');
    card.append(type);
    card.append(title);
    card.append(img);
    card.classList.add('category-articles__item');
    return card;
  });

  let resizeObserver;
  if (!isMasonrySupported(block)) {
    configureMasonryContainer(cardsContainer);

    resizeObserver = new ResizeObserver(async () => {
      await handleMasonryItems(cardsContainer, cards);
    });
    resizeObserver.observe(cardsContainer);
  }

  cardsContainer.append(...cards);
  block.append(cardsContainer);
}
