import axios from 'axios';
import genres from '../genres.json';
axios.defaults.baseURL = 'https://api.themoviedb.org/3';
const KEY = '53502f2051b49635b4821c401e9fb0d7';

export default class MovieApiServices {
  constructor() {
    this.currentPage = 1;
    this.searchQuery = '';
    this.counttotalResults = 0;
  }

  async getTrendingMovies() {
    const response = await axios.get(
      `/trending/movie/day?api_key=${KEY}&page=${this.currentPage}`
    );
    this.counttotalResults += 20;
    return response.data;
  }

  async getSearchMovies(query) {
    const response = await axios.get(
      `/search/movie?api_key=${KEY}&query=${encodeURIComponent(
        query
      ).replaceAll('%20', '+')}&page=${this.currentPage}&language=en-US`
    );
    this.counttotalResults += 20;
    return response.data;
  }

  async getMovieById(movieId) {
    const response = await axios.get(`/movie/${movieId}?api_key=${KEY}`);
    return response.data;
  }

  async getMovieByIdVideo(movieId) {
    const response = await axios.get(
      `/movie/${movieId}/videos?api_key=${KEY}&language=en-US'`
    );
    return response.data;
  }

  getGenres(genresId) {
    const findGenre = genres.find(genre => genre.id === genresId);
    return findGenre.name;
  }

  getcurrentPage() {
    return this.currentPage;
  }

  setcurrentPage(newPage) {
    this.currentPage = newPage;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get totalResults() {
    return this.counttotalResults;
  }

  set totalResults(newCountTotal) {
    this.counttotalResults = newCountTotal;
  }
}

/* export const getTrendingMovies = async () => {
  const response = await axios.get(`/trending/movie/day?api_key=${KEY}`)
  return response.data;
};

export const getSearchMovies = async (query) => {
  const response = await axios.get(`/search/movie?api_key=${KEY}&query=${encodeURIComponent(query).replaceAll('%20', '+')}&language=en-US`)
  return response.data;
};

export const getMovieById = async (movieId) => {
  const response = await axios.get(`/movie/${movieId}?api_key=${KEY}`)
  return response.data;
};

export const getMovieByIdVideo = async (movieId) => {
  const response = await axios.get(`/movie/${movieId}/videos?api_key=${KEY}&language=en-US'`)
  return response.data;
} */

/* export const getCreditsMovie = async (movieId) => {
  const response = await axios.get(`/movie/${movieId}/credits?api_key=${KEY}`)
  return response.data;
};

export const getReviewsMovie = async (movieId) => {
  const response = await axios.get(`/movie/${movieId}/reviews?api_key=${KEY}`)
  return response.data;
}; */
