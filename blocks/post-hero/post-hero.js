export default function decorate(block) {
  const smallImage = block.querySelector('img:nth-child(2)');

  // wrap the second div and the picture element in a div
  const wrapper = document.createElement('div');
  wrapper.classList.add('post-hero__wrapper');
  wrapper.append(block.querySelector(':scope > div:nth-child(2)'), smallImage);
  block.append(wrapper);
}
