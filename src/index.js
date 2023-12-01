import axios from "axios";
import Notiflix from "notiflix";
import "notiflix/dist/notiflix-3.2.6.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    formEl: document.querySelector("#search-form"),
    inputEl: document.querySelector('input[name="searchQuery"]'),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
}

const API_KEY = "40880317-a4a105d106528f1d9ba952a9b";
const BASE_URL = "https://pixabay.com/api";
let page = 1;
let per_page = 40;
let queryValue = "";
let totalHits = 0;

refs.loadMoreBtn.style.display = "none";

refs.formEl.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMore);

async function onFormSubmit(event) {
    page = 1;
    event.preventDefault();
     queryValue = refs.inputEl.value;
    try {
        clearGallery();
        let dataItems = await getImage(queryValue);
       
        if (dataItems.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
           
            refs.gallery.insertAdjacentHTML("beforeend", createGalleryMarkup(dataItems.hits));

            initLightbox();
            refs.loadMoreBtn.style.display = "flex";
        } else {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
        }
    }
   catch(error) {
            console.log(error.message);
        }
}
async function getImage(query) {
        try {
            const { data } = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
            totalHits = data.totalHits;
            if (data.hits.length > 0) {
                console.log(data.hits);
                return data;
            } else {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
                throw new Error('No images found');
            }
        }
        catch (error) {
            console.log(error.message);
        }
}

async function onLoadMore() {
    page += 1;
        if (page * per_page > totalHits) {
                        
        refs.loadMoreBtn.style.display = "none";
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results');
        return;
        }
    
    const dataLoadMore = await getImage(queryValue)
    refs.gallery.insertAdjacentHTML("beforeend", createGalleryMarkup(dataLoadMore.hits));
    initLightbox();
    }

    function createGalleryMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads
    }) =>
    `<div class="photo-card">
    <a href="${largeImageURL}" class="lightbox-link">
  <img src="${webformatURL}" alt="${tags}" width="305px"  height="200px"  loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`).join("");
}

function clearGallery() {
    refs.inputEl.innerHTML = "";
    refs.gallery.innerHTML = "";
}

function initLightbox() {
  new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
  }).refresh();
}

