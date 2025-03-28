import { fetchImages } from './js/pixabay-api';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  showLoader,
  hideLoader,
  clearGallery,
  renderImages,
  smoothScroll,
} from './js/render-functions';

const form = document.querySelector('.form');
const input = document.querySelector("input[name='search-text']");
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let currentTotalHits = 0;

function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}

hideLoadMoreBtn();
hideLoader();

form.addEventListener('submit', async event => {
  event.preventDefault();
  currentQuery = input.value.trim();
  currentPage = 1;

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term.',
      position: 'topRight',
      timeout: 5000,
    });
    return;
  }

  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  let result;
  try {
    result = await fetchImages(currentQuery, currentPage);
  } catch (error) {
    // console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
      timeout: 5000,
    });
    return;
  } finally {
    hideLoader();
  }
  const { totalHits, images } = result;
  currentTotalHits = totalHits;

  if (images.length === 0) {
    iziToast.warning({
      title: 'Warning',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
      timeout: 5000,
    });
    return;
  }

  renderImages(images);

  if (currentTotalHits <= 15) {
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
      timeout: 5000,
    });
  } else {
    showLoadMoreBtn();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  const nextPage = currentPage + 1;
  showLoader();
  let result;
  try {
    result = await fetchImages(currentQuery, nextPage);
  } catch (error) {
    // console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
      timeout: 5000,
    });
    return;
  } finally {
    hideLoader();
  }
  // Оновлювати поточну сторінку тільки в разі успішного запиту
  currentPage = nextPage;
  const { images } = result;

  renderImages(images);
  smoothScroll();

  if (currentPage * 15 >= currentTotalHits) {
    hideLoadMoreBtn();
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
      timeout: 5000,
    });
  }
});
