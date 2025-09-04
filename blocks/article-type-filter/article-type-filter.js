export default function decorate(block) {
  const urlPostTypeQuery = new URLSearchParams(window.location.search).get('post_type');
  [...block.children].forEach((item) => {
    const link = document.createElement('a');
    link.classList.add('article-type-filter__link');
    const type = item.querySelector(':scope > div:nth-child(1)').textContent;
    link.href = `?post_type=${type}`;
    link.textContent = item.querySelector(':scope > div:nth-child(2)').textContent;
    if (urlPostTypeQuery === type) {
      link.classList.add('article-type-filter__link_active');
    }
    item.replaceWith(link);
  });
}
