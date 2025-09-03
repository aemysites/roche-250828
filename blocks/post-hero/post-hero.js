export default function decorate(block) {
  const pictures = block.querySelectorAll('picture');

  // see if the block has a small image
  let smallImage;
  if (pictures.length === 2) {
    [, smallImage] = pictures;
    smallImage.classList.add('mini');
  }

  // create a flex container to wrap the text and small image
  const wrapper = document.createElement('div');
  wrapper.classList.add('post-hero__wrapper');

  // add the text to the wrapper
  wrapper.append(block.querySelector(':scope > div:nth-child(3)'));

  // add the small image to the wrapper
  if (smallImage) {
    wrapper.append(smallImage);
  }

  block.append(wrapper);
}
