import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const imgSourceLink = block.querySelector(':scope > div:nth-child(4) a');
  if (imgSourceLink) {
    const img = createOptimizedPicture(imgSourceLink.href, '', true);
    imgSourceLink.replaceWith(img);
  }

  const heading = block.querySelector(':scope > div:nth-child(1)');
  const label = block.querySelector(':scope > div:nth-child(2)');
  const para = block.querySelector(':scope > div:nth-child(3)');
  const textContainer = document.createElement('div');
  textContainer.append(label, heading, para);
  textContainer.classList.add('hero__text-container');

  block.prepend(textContainer);
}
