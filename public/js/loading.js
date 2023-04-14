const loadingScreen = document.querySelector('section.loading');
let subjects;

const setRandomTarget = () => {
    const fullWidth = window.innerWidth;
    const fullHeight = window.innerHeight;

    const randomTop = Math.round(Math.random() * fullHeight);
    const randomLeft = Math.round(Math.random() * fullWidth);

    loadingScreen.style.setProperty('--loading-top', randomTop-100 + 'px');
    loadingScreen.style.setProperty('--loading-left', randomLeft-50 + 'px');
}

export const bubbleJump = (e) => {

    setRandomTarget();
    const random = Math.floor(Math.random() * subjects.length);

    const bubble = document.createElement('span');
    bubble.classList.add('bubble');
    bubble.textContent = subjects[random];
    loadingScreen.appendChild(bubble);

    const currentBubble = loadingScreen.querySelector('.bubble:last-child');
    currentBubble.style.setProperty('--bubble-top', e.clientY-200 + 'px');
    currentBubble.style.setProperty('--bubble-left', e.clientX-100 + 'px');

    currentBubble.classList.add('jump');
}

export function showLoading(keywords) {
    subjects = keywords;

    setRandomTarget();

    loadingScreen.classList.add('show');

    const target = document.querySelector('section.loading.show div');
    target.addEventListener('click', bubbleJump);
}

export function removeLoading() {
    loadingScreen.classList.remove('show');

    const spans = loadingScreen.querySelectorAll('span');
    spans.forEach(span => {
        span.remove();
    });
    loadingScreen.removeEventListener('click', bubbleJump);
}

