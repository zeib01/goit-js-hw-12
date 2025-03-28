import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', // Використовуємо текст з атрибута alt як підпис
  captionDelay: 250, // Затримка перед показом підпису
  showCounter: true, // Відображення лічильника зображень
});

const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');

export function showLoader() {
  loader.style.display = 'block';
}

export function hideLoader() {
  loader.style.display = 'none';
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function renderImages(images) {
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

export function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const itemHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({ top: itemHeight * 2, behavior: 'smooth' });
  }
}
