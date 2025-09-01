import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const label = document.createElement('span');
  label.textContent = placeholders.socialsLabel;
  block.prepend(label);
}
