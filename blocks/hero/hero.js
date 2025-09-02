export default function decorate(block) {
  const heading = block.querySelector(':scope > div:nth-child(1)');
  const label = block.querySelector(':scope > div:nth-child(2)');
  const para = block.querySelector(':scope > div:nth-child(3)');
  const textContainer = document.createElement('div');
  textContainer.append(label, heading, para);
  textContainer.classList.add('hero__text-container');

  block.prepend(textContainer);
}
