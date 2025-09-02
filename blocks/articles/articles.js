export default async function decorate(block) {
  const items = block.querySelectorAll(':scope > div');
  items.forEach((item) => {
    const typeContainer = item.querySelector(':scope > div:first-child');
    const type = typeContainer.textContent.trim();
    item.classList.add('articles__item', type);

    const postType = item.querySelector(':scope > div:nth-child(5)');
    postType.classList.add('articles__item__post-type');

    if (type === 'tease') {
      const linkContainer = item.querySelector(':scope > div:nth-child(4)');
      const link = linkContainer.querySelector('a');
      link.textContent = '';
      link.parentElement.classList.remove('button-container');
      link.classList.remove('button');
      link.append(...([...item.children].filter((el) => el !== linkContainer)));
    }

    typeContainer.remove();
  });
}
