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
  console.log(instanceAPI.c_method);
  if (instanceAPI.c_method) onSearch();
  else getTrend();
});
pagination.on('beforeMove', event => {
  if (event.page === 10) {
    return false;
  }
});
refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();
  const search = evt.currentTarget.elements[0].value;
  if (search) {
    renderApi.clearContent(refs.gallery);
    refs.preloaderElem.classList.toggle('is-hidden');
    try {
      const response = await instanceAPI.getSearchMovies(search.trim());
      const data = response.results;
      if (data.total_results === 0) {
        refs.errorSearch.classList.remove('is-hidden');
      } else {
        instanceAPI.c_method = 1;
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
        refs.preloaderElem.classList.toggle('is-hidden');
        renderContent(data);
      }
    } catch (error) {
      /* errorSearch.classList.toggle('is-hidden'); */
    }
    /* searchForm.reset();
    errorSearch.classList.add('is-hidden'); */
  }
}

async function getTrend() {
  renderApi.clearContent(refs.gallery);
  refs.preloaderElem.classList.toggle('is-hidden');
  try {
    const response = await instanceAPI.getTrendingMovies();
    if (response.total_results > instanceAPI.totalResults) {
      const data = response.results;
      instanceAPI.c_method = 0;
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
      refs.preloaderElem.classList.toggle('is-hidden');
      renderContent(data);
    }
  } catch (error) {}
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
