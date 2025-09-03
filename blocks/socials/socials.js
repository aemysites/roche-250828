export default function decorate(block) {
  if (block.classList.contains('text')) {
    block.querySelectorAll('a').forEach((link) => {
      const span = document.createElement('span');
      span.classList.add('socials_text__link__text');
      span.textContent = link.textContent;
      link.textContent = '';
      link.append(span);
    });
  }
}
