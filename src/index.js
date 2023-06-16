import { pagination } from './js/pagination';
import renderApi from './js/gallery';

import API from './js/api';
const instanceAPI = new API();

window.addEventListener('load', getTrend);
pagination.on('afterMove', event => {
  instanceAPI.setcurrentPage(event.page);
  getTrend();
});
pagination.on('beforeMove', event => {
  if (event.page === 10) {
    return false;
  }
});

async function getTrend() {
  try {
    const response = await instanceAPI.getTrendingMovies();
    if (response.total_results > instanceAPI.totalResults) {
      const data = response.results;
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
      renderContent(data);
    }
  } catch (error) {}
}
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  searchInput: document.querySelector('.shearch-text'),
};
/* 
let instanceAPI;
//refs.searchForm.addEventListener('submit', onSearch);
refs.searchInput.addEventListener('focus', onGotFocus);
refs.btnLoadMore.addEventListener('click', onShowMore);
let gallery;

async function onSearch(evt) {
  evt.preventDefault();
  console.log('from onsearch');
  //refs.btnLoadMore.classList.add('is-hidden');
  renderAPI.clearContent(refs.gallery);
  instanceAPI = new API();
  instanceAPI.query = evt.currentTarget.searchQuery.value;
  evt.currentTarget.searchQuery.blur();
  try {
    const response = await instanceAPI.getSearchMovies(query);
    if (response.total_results.length > 0) {
      renderContent(response.results);
    } else {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  } catch {
    refs.btnLoadMore.classList.add('is-hidden');
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }
}

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
