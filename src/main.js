import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const gallery = document.querySelector(".gallery");
const form = document.querySelector(".form");
const input = document.querySelector("input[name='search-text']");
const loadMoreBtn = document.querySelector(".load-more");
const loader = document.querySelector(".loader");

const API_KEY = "33475610-696620aeee3e1938961deeefe";
const BASE_URL = "https://pixabay.com/api/";
let currentPage = 1;
let currentQuery = "";
let totalHits = 0;

loadMoreBtn.style.display = "none";
loader.style.display = "none";

async function fetchImages(query, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 15,
        page,
      },
    });
    totalHits = response.data.totalHits;
    return response.data.hits;
  } catch (error) {
    console.error("Error fetching images:", error);
    iziToast.error({
      title: "Error",
      message: "Failed to fetch images. Please try again later.",
      position: "topRight",
      timeout: 5000,
    });
    return [];
  }
}

function renderImages(images) {
  const markup = images
    .map(
      (image) => `
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
    .join("");
  gallery.insertAdjacentHTML("beforeend", markup);
}

function smoothScroll() {
  const galleryItem = document.querySelector(".gallery-item");
  if (galleryItem) {
    const itemHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({ top: itemHeight * 2, behavior: "smooth" });
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  currentQuery = input.value.trim();
  currentPage = 1;

  if (!currentQuery) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search term.",
      position: "topRight",
      timeout: 5000,
    });
    return;
  }

  gallery.innerHTML = "";
  loadMoreBtn.style.display = "none";
  loader.style.display = "block";

  const images = await fetchImages(currentQuery, currentPage);
  loader.style.display = "none";

  if (images.length === 0) {
    iziToast.warning({
      title: "Warning",
      message: "Sorry, there are no images matching your search query. Please try again!",
      position: "topRight",
      timeout: 5000,
    });
    return;
  }

  renderImages(images);
  loadMoreBtn.style.display = "block";
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1;
  loader.style.display = "block";
  const images = await fetchImages(currentQuery, currentPage);
  loader.style.display = "none";
  renderImages(images);
  smoothScroll();

  if (currentPage * 15 >= totalHits) {
    loadMoreBtn.style.display = "none";
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
      position: "topRight",
      timeout: 5000,
    });
  }
});
