export default function decorate(block) {
  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('customized-articles__items');

  const items = [...block.querySelectorAll(':scope > div')];
  items.forEach((item) => {
    const typeContainer = item.querySelector(':scope > div:first-child');
    const type = typeContainer.textContent.trim();
    item.classList.add('customized-articles__item', type);

    typeContainer.remove();
  });

  block.prepend(itemsContainer);
}
