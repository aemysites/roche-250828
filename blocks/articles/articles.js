export default async function decorate(block) {
  const items = block.querySelectorAll(':scope > div');
  items.forEach((item) => {
    const type = item.querySelector(':scope > div:first-child');
    item.classList.add('articles__item', type.textContent.trim());
  });
}
