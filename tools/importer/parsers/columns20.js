/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the main content area
  const content = element.querySelector('.content-header-page');

  // Get the image element
  let imgEl = null;
  const imgDiv = content.querySelector('.image');
  if (imgDiv) {
    imgEl = imgDiv.querySelector('img');
  }
  const imageCell = imgEl ? [imgEl] : [];

  // Get the heading
  const headingEl = content.querySelector('h1');
  // Get the .cat-parent as subheading (optional)
  const catParentEl = content.querySelector('.cat-parent');
  // Get the main descriptive paragraph
  const paragraphs = content.querySelectorAll('p');
  let mainParagraph = null;
  // Looking for paragraph after cat-parent
  if (paragraphs.length > 1) {
    mainParagraph = paragraphs[1];
  } else if (paragraphs.length === 1 && (!catParentEl || paragraphs[0] !== catParentEl)) {
    mainParagraph = paragraphs[0];
  }

  // Compose the content cell: cat-parent, heading, paragraph (in order)
  const textCell = [];
  if (catParentEl) textCell.push(catParentEl);
  if (headingEl) textCell.push(headingEl);
  if (mainParagraph) textCell.push(mainParagraph);

  // Construct the table cells as per the Hero block structure
  const tableCells = [
    ['Hero'],
    [imageCell],
    [textCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // There is no Section Metadata table in the example, so we only replace with the Hero block table
  element.replaceWith(table);
}
