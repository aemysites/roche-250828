export default function decorate(block) {
  const heading = block.querySelector(':scope > div:nth-child(1)');
  const label = block.querySelector(':scope > div:nth-child(2)');
  const para = block.querySelector(':scope > div:nth-child(3)');
  const imgContainer = block.querySelector(':scope > div:nth-child(4)');
  imgContainer.classList.add('hero__image');
  const secondaryImgContainer = block.querySelector(':scope > div:nth-child(5)');
  if (secondaryImgContainer.querySelector('img')) {
    secondaryImgContainer.classList.add('hero__secondary-image');
  } else {
    secondaryImgContainer.remove();
  }
  const textContainer = document.createElement('div');
  textContainer.append(label, heading, para);
  textContainer.classList.add('hero__text-container');

  block.prepend(textContainer);
}
