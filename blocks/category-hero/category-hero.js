export default function decorate(block) {
  const imgContainer = block.querySelector(':scope > div:nth-child(1)');
  imgContainer.classList.add('category-hero__image');
  const tagLine = block.querySelector(':scope > div:nth-child(2)');
  tagLine.classList.add('category-hero__tagline');
  const heading = block.querySelector(':scope > div:nth-child(3)');
  heading.classList.add('category-hero__heading');
  const para = block.querySelector(':scope > div:nth-child(4)');
  para.classList.add('category-hero__description');
}
