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
  
    track.style.transform = `translate3d(${curTranform - posDelta}px, 0px, 0px)`;
};

let swipeEnd = function() {
    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);
    
    if (posCurrent !== posInitial) {
        let posDelta = posCurrent - posInitial;

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






// Слайдер отзывов
const reviewsContainer = document.querySelector('.reviews__wrapper');
const reviewsTrack = document.querySelector('.reviews__track');
const reviewsCards = document.querySelectorAll('.reviews__card');
const reviewsDotsWrapper = document.querySelector('.reviews__dots-wrapper');

let reviewsCount = reviewsCards.length;
let currentReview = 0;
let reviewsByPage = (screen.width <= 767 ? 1 : 2);
let reviewsDotsCount = Math.ceil(reviewsCount / reviewsByPage);
let reviewWidth = reviewsCards[0].offsetWidth;
let reviewMarginRight = +getComputedStyle(reviewsCards[0]).marginRight.match(pxRegExp)[0];
let reviewsPosInitial = 0, reviewsPosCurrent = 0;
let reviewsPosThreshold = (reviewWidth * reviewsByPage + reviewMarginRight) * .35;

reviewsDotsWrapper.innerHTML = '';
for (let i = 0; i < reviewsDotsCount; i++) {
    reviewsDotsWrapper.innerHTML += '<div class="reviews__dot"></div>';
}
const reviewsDots = document.querySelectorAll('.reviews__dot');

let setReview = function(index = currentReview) {
    currentReview = index - index % reviewsByPage;
    let pointIndex = 0;
    while (pointIndex * reviewsByPage < currentReview) {
        pointIndex++;
    }
    for (let dot of reviewsDots) {
        dot.classList.remove('active');
    }
    reviewsDots[pointIndex].classList.add('active');
    reviewsTrack.style.transition = 'all 0.3s ease';
    reviewsTrack.style.transform = `translate3d(${
        - currentReview * (reviewWidth + reviewMarginRight)
    }px, 0px, 0px)`;
}
setReview(0);

for (let dot of reviewsDots) {
    dot.addEventListener('click', function() {
        let dotIndex = 0;
        for (let i = 0; i < reviewsDots.length; i++) {
            if (reviewsDots[i] == this) {
                dotIndex = i;
                break;
            }
        }
        setReview(dotIndex * reviewsByPage);
    });
}

let reviewsSwipeStart = function() {
    let evt = getEvent();
  
    reviewsPosInitial = reviewsPosCurrent = evt.clientX;
    reviewsTrack.style.transition = '';
  
    document.addEventListener('touchmove', reviewsSwipeAction);
    document.addEventListener('touchend', reviewsSwipeEnd);
    document.addEventListener('mousemove', reviewsSwipeAction);
    document.addEventListener('mouseup', reviewsSwipeEnd);
};

let reviewsSwipeAction = function() {
    let evt = getEvent();
    let curTranform = +reviewsTrack.style.transform.match(pxRegExp)[0];
  
    let posDelta = reviewsPosCurrent - evt.clientX;
    reviewsPosCurrent = evt.clientX;
  
    reviewsTrack.style.transform = `translate3d(${curTranform - posDelta}px, 0px, 0px)`;
};

let reviewsSwipeEnd = function() {
    document.removeEventListener('touchmove', reviewsSwipeAction);
    document.removeEventListener('mousemove', reviewsSwipeAction);
    document.removeEventListener('touchend', reviewsSwipeEnd);
    document.removeEventListener('mouseup', reviewsSwipeEnd);
    
    if (reviewsPosCurrent !== reviewsPosInitial) {
        let posDelta = reviewsPosCurrent - reviewsPosInitial;

        while (Math.abs(posDelta) >= reviewsByPage * (reviewWidth + reviewMarginRight)) {
            if (posDelta > 0) {
                // Left swipe -->
                currentReview = Math.max(0, currentReview - reviewsByPage);
                posDelta -= reviewsByPage * (reviewWidth + reviewMarginRight);
            }
            else {
                // Right swipe <--
                currentReview = Math.min((reviewsCount - 1) - (reviewsCount - 1) % reviewsByPage, currentReview + reviewsByPage);
                posDelta += reviewsByPage * (reviewWidth + reviewMarginRight);
            }
        }
        if (Math.abs(posDelta) > reviewsPosThreshold) {
            if (posDelta > 0) {
                // Left swipe -->
                currentReview = Math.max(0, currentReview - reviewsByPage);
                posDelta -= reviewsByPage * (reviewWidth + reviewMarginRight);
            }
            else {
                // Right swipe <--
                currentReview = Math.min((reviewsCount - 1) - (reviewsCount - 1) % reviewsByPage, currentReview + reviewsByPage);
                posDelta += reviewsByPage * (reviewWidth + reviewMarginRight);
            }
        }

        setReview();
    }
};

reviewsTrack.addEventListener('touchstart', reviewsSwipeStart);
reviewsTrack.addEventListener('mousedown', reviewsSwipeStart);






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
    this.addEventListener('click', unlikePost);
};
let unlikePost = function() {
    let postIndex = 0;
    for (let i = 0; i < postLikeButtons.length; i++) {
        if (postLikeButtons[i] == this) {
            postIndex = i;
            break;
        }
    }
    postLikes[postIndex].innerHTML--;
    postHeartIcons[postIndex].classList.remove('fas');
    postHeartIcons[postIndex].classList.add('far');
    this.removeEventListener('click', unlikePost);
    this.addEventListener('click', likePost);
};

for (let item of postLikeButtons) {
    item.addEventListener('click', likePost);
}




// Плавная прокрутка до якоря
const anchorLinks = document.querySelectorAll('.nav a');

for (let item of anchorLinks) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const id = this.getAttribute('href');
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}





// Выставляем автоматически ширину полоски на ценнике
let priceCardWidth = document.querySelector('.price__card').offsetWidth;
let priceCardLabels = document.querySelectorAll('.price__label');

for (let item of priceCardLabels) {
    item.style.width = priceCardWidth + 'px';
}