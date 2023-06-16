import Pagination from 'tui-pagination';

const container = document.getElementById('tui-pagination-container');

const options = {
  totalItems: 500,
  itemsPerPage: 10,
  visiblePages: 5,
  centerAlign: true,
};
const pagination = new Pagination(container, options);
export { pagination };
