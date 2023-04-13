import { showLoading, removeLoading } from './loading.js';
import { testPoetry, testRewrite } from './testObject.js';

const main = document.querySelector('main');
const aside = document.querySelector('aside');

const poetryButton = document.querySelector('button:first-of-type');
const type = document.querySelector('label:first-of-type input');
const theme = document.querySelector('label:last-of-type input');

const output = document.querySelector('p');

let paragraphString;

const displayPoetry = (data) => {
    paragraphString = '';

    console.log('displayPoetry', data);
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

const replaceWord = async (e) => {

    const item = e.target;
    const oldWord = item.dataset.oldWord;
    const newWord = item.textContent;

    // const response = await fetch('/api/rewrite', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         oldWord,
    //         newWord,
    //         paragraph: output.textContent,
    //     }),
    // })

    // const { data } = await response.json();
    // displayPoetry(data);

    displayPoetry(testRewrite);
}

const showWordAlternatives = (e) => {
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

    aside.innerHTML = ul.outerHTML;
    main.appendChild(aside);

    const replacements = document.querySelectorAll('aside ul li');
    replacements.forEach(replacement => {
        replacement.addEventListener('click', replaceWord);
    });
}

const fetchPoetry = async () => {

    // const response = await fetch('/api/poetry', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         type: type.value,
    //         theme: theme.value,
    //     }),
    // })

    // const { data } = await response.json();
    // console.log('fetchPoetry', data);
    // displayPoetry(data)
    const keywords = theme.value.split(' ');
    showLoading(keywords);
    setTimeout(() => {
        displayPoetry(testPoetry);
        removeLoading();
    }, 10000);
}

poetryButton.addEventListener('click', fetchPoetry);
// window.addEventListener('DOMContentLoaded', makeBubbles);
// window.addEventListener('click', bubbleJump);
