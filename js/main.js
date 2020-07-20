'use strict'

// Слайдер в галлереи
const container = document.querySelector('.gallery__container');
const track = document.querySelector('.gallery__track');
const photos = document.querySelectorAll('.gallery__photo');
const prevButton = document.querySelector('.gallery__prev');
const nextButton = document.querySelector('.gallery__next');

let photoCount = photos.length;
let photoWidth = photos[0].offsetWidth;
let containerWidth = container.offsetWidth;
let str = getComputedStyle(photos[0]).marginRight;
let photoMarginRight = str.slice(0, str.length - 2); // cutting 'px'
let currentPhoto = Math.floor(photoCount / 2);
let photosToScroll = 1;
let centerPosition = (containerWidth - photoWidth) / 2;

let setPhoto = function(ind = currentPhoto) {
    currentPhoto = ind;
    track.style.transform = `translate3d(${
        centerPosition - (currentPhoto * photoWidth) - currentPhoto * photoMarginRight
    }px, 0px, 0px)`;
    prevButton.classList.toggle('disabled', currentPhoto === 0);
    nextButton.classList.toggle('disabled', currentPhoto === photoCount - 1);
}

prevButton.addEventListener('click', function() {
    if (currentPhoto > 0)
        currentPhoto--;
    setPhoto();
});
nextButton.addEventListener('click', function() {
    if (currentPhoto < photoCount - 1)
        currentPhoto++;
    setPhoto();
});

setPhoto();