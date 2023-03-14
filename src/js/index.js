import { fetchImages } from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-form-input');
const btnSearch = document.querySelector('.search-form-button');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

btnLoadMore.style.display = 'none';

let pageNumber = 1;

// function getImg(trimmedValue, pageNumber) {
//   fetchImages(trimmedValue, pageNumber).then(foundData => {
//     if (foundData.hits.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//       return;
//     }
//     if (pageNumber === 1) {
//       Notiflix.Notify.success(
//         `Hooray! We found ${foundData.totalHits} images.`
//       );
//     }

//     renderImageList(foundData.hits);
//     if (Math.ceil(foundData.totalHits / 40) === pageNumber) {
//       Notiflix.Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//       btnLoadMore.style.display = 'none';
//       return;
//     }

//     btnLoadMore.style.display = 'block';
//     pageNumber += 1;
//     gallerySimpleLightbox.refresh();
//   });
// }

async function getImg(trimmedValue, pageNumber) {
  try {
    const foundData = await fetchImages(trimmedValue, pageNumber);
    if (foundData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (pageNumber === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${foundData.totalHits} images.`
      );
    }
    renderImageList(foundData.hits);
    if (Math.ceil(foundData.totalHits / 40) === pageNumber) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.style.display = 'none';
      return;
    }
    btnLoadMore.style.display = 'block';
    pageNumber += 1;
    gallerySimpleLightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

btnSearch.addEventListener('click', e => {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    getImg(trimmedValue, pageNumber);
  }
});

btnLoadMore.addEventListener('click', () => {
  pageNumber++;
  const trimmedValue = input.value.trim();
  getImg(trimmedValue, pageNumber);
});

function renderImageList(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-card">

       <a class="gallery__item" href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>

        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}
