'use strict'


// Слайдер в галлереи
const container = document.querySelector('.gallery__container');
const track = document.querySelector('.gallery__track');
const photos = document.querySelectorAll('.gallery__photo');
const prevButton = document.querySelector('.gallery__prev');
const nextButton = document.querySelector('.gallery__next');

let pxRegExp = /[-0-9.]+(?=px)/;

let photoCount = photos.length;
let photoWidth = photos[0].offsetWidth;
let containerWidth = container.offsetWidth;
let photoMarginRight = +getComputedStyle(photos[0]).marginRight.match(pxRegExp)[0];
let currentPhoto = Math.floor(photoCount / 2);
let photosToScroll = 1;
let centerPosition = (containerWidth - photoWidth) / 2;
let posInitial = 0, posCurrent = 0;
let posThreshold = photoWidth * .35;

track.style.transform = `translate3d(${
    centerPosition - (currentPhoto * photoWidth) - currentPhoto * photoMarginRight
}px, 0px, 0px)`;

let setPhoto = function(ind = currentPhoto) {
    currentPhoto = ind;
    track.style.transition = 'all 0.3s ease';
    track.style.transform = `translate3d(${
        centerPosition - (currentPhoto * photoWidth) - currentPhoto * photoMarginRight
    }px, 0px, 0px)`;
    prevButton.classList.toggle('disabled', currentPhoto === 0);
    nextButton.classList.toggle('disabled', currentPhoto === photoCount - 1);
};

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

let getEvent = function() {
    return (event.type.search('touch') !== -1 ? event.touches[0] : event);
};

let swipeStart = function() {
    let evt = getEvent();
  
    posInitial = posCurrent = evt.clientX;
    track.style.transition = '';
  
    document.addEventListener('touchmove', swipeAction);
    document.addEventListener('touchend', swipeEnd);
    document.addEventListener('mousemove', swipeAction);
    document.addEventListener('mouseup', swipeEnd);
};

let swipeAction = function() {
    let evt = getEvent();
    let curTranform = +track.style.transform.match(pxRegExp)[0];
  
    let posDelta = posCurrent - evt.clientX;
    posCurrent = evt.clientX;

    console.log('init: ' + posInitial + ', cur: ' + posCurrent);
  
    track.style.transform = `translate3d(${curTranform - posDelta}px, 0px, 0px)`;
};

let swipeEnd = function() {
    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);
    
    if (posCurrent !== posInitial) {
        let posDelta = posCurrent - posInitial;

        console.log('init: ' + posInitial + ', cur: ' + posCurrent);
        console.log('delta: ' + posDelta);

        while (Math.abs(posDelta) >= photoWidth + photoMarginRight) {
            if (posDelta > 0) {
                // Left swipe -->
                if (currentPhoto > 0)
                    currentPhoto--;
                posDelta -= photoWidth + photoMarginRight;
            }
            else {
                // Right swipe <--
                if (currentPhoto < photoCount - 1)
                    currentPhoto++;
                posDelta += photoWidth + photoMarginRight;
            }
            console.log('delta: ' + posDelta);
        }
        if (Math.abs(posDelta) > posThreshold) {
            if (posDelta > 0) {
                // Left swipe -->
                if (currentPhoto > 0)
                    currentPhoto--;
            }
            else {
                // Right swipe <--
                if (currentPhoto < photoCount - 1)
                    currentPhoto++;
            }
        }

        setPhoto();
    }
};

track.addEventListener('touchstart', swipeStart);
track.addEventListener('mousedown', swipeStart);





// Лайк в посте
const postLikes = document.querySelectorAll('.post__likes-count');
const postLikeButtons = document.querySelectorAll('.post__heart');
const postHeartIcons = document.querySelectorAll('.post__heart i');

let likePost = function() {
    let postIndex = 0;
    for (let i = 0; i < postLikeButtons.length; i++) {
        if (postLikeButtons[i] == this) {
            postIndex = i;
            break;
        }
    }
    postLikes[postIndex].innerHTML++;
    postHeartIcons[postIndex].classList.remove('far');
    postHeartIcons[postIndex].classList.add('fas');
    this.removeEventListener('click', likePost);
};

for (let item of postLikeButtons) {
    item.addEventListener('click', likePost);
}

