import { pagination } from './js/pagination';
import renderApi from './js/gallery';
import API from './js/api';

const instanceAPI = new API();

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  galleryItem: document.querySelector('.gallery__item'),
  searchInput: document.querySelector('.shearch-text'),
  errorSearch: document.querySelector('.error-search-message'),
  preloaderElem: document.querySelector('.preloader'),
  paginationElem: document.querySelector('.tui-pagination'),
};
console.dir(pagination);
window.addEventListener('load', getTrend);

pagination.on('beforeMove', event => {
  instanceAPI.setcurrentPage(event.page);
  prepareGallery();
  const func = instanceAPI.c_method
    ? instanceAPI.getSearchMovies
    : instanceAPI.getTrendingMovies;
  getData(func, instanceAPI.c_method);
});
refs.searchForm.addEventListener('submit', onSearch);
refs.searchInput.addEventListener('focus', onFocus);
refs.galleryItem.addEventListener('click', onClick);

function onClick() {}

function onFocus(evt) {
  evt.target.value = '';
  instanceAPI.setcurrentPage(1);
  pagination.reset();
}

function onSearch(evt) {
  evt.preventDefault();
  refs.searchInput.blur();
  instanceAPI.searchQuery = evt.currentTarget.elements[0].value.trim();
  if (instanceAPI.searchQuery) {
    prepareGallery();
    getData(instanceAPI.getSearchMovies, 1);
  }
}

function getTrend() {
  prepareGallery();
  getData(instanceAPI.getTrendingMovies, 0);
}

async function getData(funct, method) {
  try {
    const response = await funct();
    pagination.setTotalItems(response.total_results);
    console.dir(pagination);
    const data = response.results;
    if (data.length === 0) {
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.errorSearch.classList.remove('is-hidden');
      refs.paginationElem.classList.add('is-hidden');
    } else {
      instanceAPI.c_method = method;
      parseData(data);
      refs.preloaderElem.classList.toggle('is-hidden');
      renderContent(data);
      refs.paginationElem.classList.remove('is-hidden');
    }
  } catch (error) {}
}

function prepareGallery() {
  renderApi.clearContent(refs.gallery);
  refs.preloaderElem.classList.toggle('is-hidden');
}

function parseData(data) {
  data.forEach((element, i) => {
    data[i].vote_average = element.vote_average.toFixed(1);
    data[i].genre_ids.forEach(
      (el, ind, arr) =>
        (arr[ind] =
          ind === arr.length - 1
            ? instanceAPI.getGenres(el)
            : instanceAPI.getGenres(el) + ',')
    );
  });
}

function renderContent(content) {
  refs.errorSearch.classList.add('is-hidden');
  const markup = renderApi.creatGalleryItems(content);
  renderApi.makeupContent(markup, refs.gallery);
}
