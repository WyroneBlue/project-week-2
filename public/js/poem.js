import { showLoading, removeLoading } from './loading.js';
import { testPoetry, testRewrite } from './testObject.js';

const main = document.querySelector('main');
const aside = document.querySelector('aside');

const output = document.querySelector('.poem p');

let paragraphString;

let chosenThemes = '';
let newWord = '';

const displayPoetry = (data) => {
    paragraphString = '';

    const { paragraph, keywords } = data;

    const cutParagraph = paragraph.split(' ');
    cutParagraph.forEach(word => {
        const keyword = keywords.find(keyword => keyword.keyword === word);
        if (keyword) {
            paragraphString += `
            <span class="keyword" data-alternatives="${keyword.alternatives.join(',')}">${word}</span>
            `;
        } else {
            paragraphString += `${word} `;
        }
    });
    output.innerHTML = paragraphString.trim();

    const spans = output.querySelectorAll('span');
    spans.forEach(span => {
        span.addEventListener('click', showWordAlternatives);
    });
}

const selectWord = (e) => {
    const siblings = e.target.parentElement.childNodes;
    siblings.forEach(sibling => {
        sibling.classList.remove('active');
    })

    newWord = e.target.textContent;
    e.target.classList.add('active');
}

const hideAside = () => {
    aside.classList.remove('show');
    aside.innerHTML = '';
}

export const rewritePoem = async (e) => {

    hideAside();

    const item = e.target;
    const oldWord = item.dataset.oldWord;

    const keywords = chosenThemes.replace(oldWord, newWord).split(',');
    showLoading(keywords);

    const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldWord,
            newWord,
            paragraph: output.textContent,
        }),
    })

    const { data } = await response.json();
    displayPoetry(data);
    removeLoading();
}

const showWordAlternatives = (e) => {

    const siblings = e.target.parentElement.childNodes;
    siblings.forEach(child => {
        if(child.classList){
            child.classList.remove('active');
        }
    });

    const currentWord = e.target;
    currentWord.classList.add('active');

    aside.innerHTML = '';

    const { alternatives } = e.target.dataset;
    const alternativesArray = alternatives.split(',');

    // create element
    const ul = document.createElement('ul');
    alternativesArray.forEach(alternative => {

        const li = document.createElement('li');
        li.textContent = alternative;
        li.dataset.oldWord = e.target.textContent.trim();
        ul.appendChild(li);
    });

    aside.classList.add('show');

    // create h3
    const h3 = document.createElement('h3');
    h3.textContent = 'Kies een alternatief';
    aside.appendChild(h3);

    // append ul
    aside.appendChild(ul);

    // create button
    const button = document.createElement('button');
    button.textContent = 'Schrijf nieuw gedicht';

    // append button
    aside.appendChild(button);

    // add event listener
    button.addEventListener('click', rewritePoem);

    main.appendChild(aside);

    const replacements = document.querySelectorAll('aside ul li');
    replacements.forEach(replacement => {
        replacement.addEventListener('click', selectWord);
    });
}

export const fetchPoetry = async (genre, themes) => {

    const themesString = themes.join(',');
    chosenThemes = themesString;

    showLoading(themes);
    const response = await fetch('/api/poetry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: genre,
            theme: themesString,
        }),
    })


    const { data } = await response.json();
    displayPoetry(data);
    removeLoading();
}

window.addEventListener('click', (event) => {
    if (aside.classList.contains('show') && event.target.tagName === 'MAIN') {
        hideAside();
    }
});