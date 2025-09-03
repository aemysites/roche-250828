export default function decorate(block) {
  const itemsContainer = document.createElement('div');
  const carouselWrapper = document.createElement('div');
  const carousel = document.createElement('div');
  itemsContainer.classList.add('shared-articles__items');
  carouselWrapper.classList.add('shared-articles__items__carousel-wrapper');
  carousel.classList.add('shared-articles__items__carousel');

  const items = [...block.querySelectorAll(':scope > div')];
  items.forEach((item, index) => {
    const typeContainer = item.querySelector(':scope > div:first-child');
    const type = typeContainer.textContent.trim();
    item.classList.add('shared-articles__item', type);
    item.id = `shared-article-${index}`;

    typeContainer.remove();
    carousel.append(item);
    const clone = item.cloneNode(true);
    items.push(clone);
    carousel.append(clone);
  });

  const pageSize = 3;
  const numberOfPages = Math.ceil(items.length / pageSize);
  const carouselControls = document.createElement('div');
  carouselControls.classList.add('shared-articles__items__carousel-controls');
  carousel.style.width = `${numberOfPages * 100}%`;
  for (let i = 0; i < numberOfPages; i += 1) {
    const pageButton = document.createElement('button');
    pageButton.classList.add('shared-articles__items__carousel-controls__button');
    pageButton.addEventListener('click', () => {
      carousel.style.transform = `translateX(-${(i / numberOfPages) * 100}%)`;
      carouselControls.querySelector('.active').classList.remove('active');
      pageButton.classList.add('active');
    });

    if (i === 0) {
      pageButton.classList.add('active');
    }

    carouselControls.append(pageButton);
  }

  carouselWrapper.append(carousel);
  itemsContainer.append(carouselWrapper, carouselControls);
  block.prepend(itemsContainer);
}
