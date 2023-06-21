import Pagination from 'tui-pagination';

const container = document.getElementById('tui-pagination-container');

const options = {
  totalItems: 200,
  visiblePages: 4,
  itemsPerPage: 20,
  page: 1,
  centerAlign: true,
};
const pagination = new Pagination(container, options);
export { pagination };
