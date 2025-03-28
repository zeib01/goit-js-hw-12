import axios from 'axios';

const API_KEY = '33475610-696620aeee3e1938961deeefe';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 15,
      page,
    },
  });
  return { totalHits: response.data.totalHits, images: response.data.hits };
}
