import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const imgClone = block.querySelector('img').cloneNode(true);
  const optimized = createOptimizedPicture(imgClone.src, imgClone.alt, false, [{ width: '750' }]);
  optimized.classList.add('mini');
  block.append(optimized);
}
