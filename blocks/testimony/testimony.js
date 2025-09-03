export default function decorate(block) {
  const imageAndAuthor = document.createElement('div');
  imageAndAuthor.classList.add('image-and-author');

  const image = block.querySelector(':scope > div:nth-child(1)');
  const label = block.querySelector(':scope > div:nth-child(2)');
  label.classList.add('label');
  const person = block.querySelector(':scope > div:nth-child(3)');
  person.classList.add('person');

  const wrapper = document.createElement('div');
  wrapper.classList.add('author-and-label');
  wrapper.append(label, person);

  imageAndAuthor.append(image, wrapper);

  // imageAndAuthor.append(wrapper);

  block.prepend(imageAndAuthor);
}
