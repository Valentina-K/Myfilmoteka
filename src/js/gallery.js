import itemTemplate from '../templates/itemTemplate.hbs';

function clearContent(elem) {
  elem.innerHTML = '';
}

function creatGalleryItems(items) {
  console.log(itemTemplate);
  /* return `
  <p>Ggggg</p>`; */
  /* const markup = test(); */
  const markup = itemTemplate(items);
  console.log(markup);
  return markup;
}

function makeupContent(markup, elem) {
  elem.insertAdjacentHTML('beforeend', markup);
}

export default { clearContent, creatGalleryItems, makeupContent };
