const bubbleContainer = document.querySelector('section.loading');
let subjects;

export const bubbleJump = (e) => {

    const random = Math.floor(Math.random() * subjects.length);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = subjects[random];
    bubbleContainer.appendChild(bubble);

    const currentBubble = bubbleContainer.querySelector('.bubble:last-child');
    currentBubble.style.setProperty('--bubble-top', e.clientY-200 + 'px');
    currentBubble.style.setProperty('--bubble-left', e.clientX-100 + 'px');

    currentBubble.classList.add('jump');
}

export function showLoading(keywords) {
    subjects = keywords;
    bubbleContainer.classList.add('show');
    bubbleContainer.addEventListener('click', bubbleJump);
}

export function removeLoading() {
    bubbleContainer.classList.remove('show');
    bubbleContainer.innerHTML = '';
    bubbleContainer.removeEventListener('click', bubbleJump);
}

