import { pagination } from './js/pagination';
import renderApi from './js/gallery';
import API from './js/api';

const instanceAPI = new API();

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  searchInput: document.querySelector('.shearch-text'),
  errorSearch: document.querySelector('.error-search-message'),
  preloaderElem: document.querySelector('.preloader'),
};

window.addEventListener('load', getTrend);
pagination.on('afterMove', event => {
  instanceAPI.setcurrentPage(event.page);
  prepareGallery();
  const func = instanceAPI.c_method
    ? instanceAPI.getSearchMovies
    : instanceAPI.getTrendingMovies;
  getData(func, instanceAPI.c_method);
});
pagination.on('beforeMove', event => {
  if (event.page === 10) {
    return false;
  }
});
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();
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
    const data = response.results;
    if (data.total_results === 0) {
      refs.errorSearch.classList.remove('is-hidden');
    } else {
      instanceAPI.c_method = method;
      parseData(data);
      refs.preloaderElem.classList.toggle('is-hidden');
      renderContent(data);
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

/*
function onGotFocus(evt) {
  console.log('from onGotFocus');
  evt.currentTarget.value = '';
}

async function onShowMore() {
  instanceAPI.incrementPage();
  try {
    const response = await instanceAPI.getImages();

    renderContent(response.data.hits);
    smoothScrolling();
    gallery.refresh();
    if (instanceAPI.countHits >= response.totalHits) {
      throw error;
    }
  } catch (error) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
} */

function renderContent(content) {
  const markup = renderApi.creatGalleryItems(content);
  renderApi.makeupContent(markup, refs.gallery);
}
