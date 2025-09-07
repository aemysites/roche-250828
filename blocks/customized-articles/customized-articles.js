export default function decorate(block) {
  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('customized-articles__items');

  const items = [...block.querySelectorAll(':scope > div')];

  const title = items[0];
  title.classList.add('customized-articles__title');

  items.slice(1).forEach((item) => {
    const typeContainer = item.querySelector(':scope > div:first-child');
    const type = typeContainer.textContent.trim();
    item.classList.add('customized-articles__item', type);

    typeContainer.remove();
  });

  itemsContainer.append(...items.slice(1));
  block.append(itemsContainer);
}
