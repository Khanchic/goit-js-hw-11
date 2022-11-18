import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';
import 'simplelightbox/dist/simple-lightbox.min.css';
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

const KEY = '31339711-72da964270697c18a030d30f9';
// axios.defaults.baseURL = 'https://pixabay.com/api/';
async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
function renderGallery(images) {
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    console.log('пусто');
    return;
  }
  console.log(query);
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      console.log(data);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        console.log(data.hits);

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
});
loadMoreBtn.addEventListener('click', e => {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
});

arrowTop.onclick = function () {
  window.scrollTo(pageXOffset, 0);
  // после scrollTo возникнет событие "scroll", так что стрелка автоматически скроется
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = pageYOffset < document.documentElement.clientHeight;
});
