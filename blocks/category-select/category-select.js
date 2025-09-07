import { fetchCategories } from '../../scripts/utils.js';

export default async function decorate(block) {
  const categories = await fetchCategories();
  const parentCategory = window.location.pathname.replace('/category/', '').split('/')[0];

  const select = document.createElement('select');
  select.classList.add('category-select__select');
  select.id = 'category-select__select';
  const filteredCategories = categories
    .filter((category) => category.Category.startsWith(parentCategory));

  if (filteredCategories.length === 0) {
    return;
  }

  filteredCategories.forEach((category) => {
    const option = document.createElement('option');
    option.textContent = category.Label;
    option.value = category.URL;
    option.name = category.URL;

    if (category.Category.split('/').length > 2) {
      option.textContent = `- ${option.textContent}`;
    }

    if (window.location.pathname === option.value) {
      option.selected = true;
    }

    select.append(option);
  });

  select.addEventListener('change', () => {
    window.location = select.value;
  });

  block.append(select);
}
