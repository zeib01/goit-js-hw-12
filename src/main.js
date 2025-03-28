import { fetchImages } from './js/pixabay-api';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', // Використовуємо текст з атрибута alt як підпис
  captionDelay: 250, // Затримка перед показом підпису
  showCounter: true, // Відображення лічильника зображень
});

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.form');
const input = document.querySelector("input[name='search-text']");
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';
let currentTotalHits = 0;

loadMoreBtn.style.display = 'none';
loader.style.display = 'none';

function renderImages(images) {
  const markup = images
    .map(
      image => `
      <li class="gallery-item">
        <a href="${image.largeImageURL}" target="_blank">
          <img src="${image.webformatURL}" alt="${image.tags}" width="300"/>
        </a>
        <div class="info">
          <p><b>Likes:</b> ${image.likes}</p>
          <p><b>Views:</b> ${image.views}</p>
          <p><b>Comments:</b> ${image.comments}</p>
          <p><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </li>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const itemHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({ top: itemHeight * 2, behavior: 'smooth' });
  }
}

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

  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  loader.style.display = 'block';

  try {
    const { totalHits, images } = await fetchImages(currentQuery, currentPage);
    currentTotalHits = totalHits;
    loader.style.display = 'none';

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
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
      timeout: 5000,
    });
  }
  loadMoreBtn.style.display = 'block';
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  loader.style.display = 'block';
  const { totalHits, images } = await fetchImages(currentQuery, currentPage);
  currentTotalHits = totalHits;
  loader.style.display = 'none';
  renderImages(images);
  smoothScroll();

  if (currentPage * 15 >= currentTotalHits) {
    loadMoreBtn.style.display = 'none';
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
      timeout: 5000,
    });
  }
});
