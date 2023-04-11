const poetryButton = document.querySelector('button:first-of-type');
const type = document.querySelector('label:first-of-type input');
const theme = document.querySelector('label:last-of-type input');

const keywordsButton = document.querySelector('button:last-of-type');

const output = document.querySelector('span');

let paragraph = '';
const fetchPoetry = async () => {
    console.log(type.value);
    console.log(theme.value);
    const response = await fetch('/api/poetry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: type.value,
            theme: theme.value,
        }),
    })

    const { data } = await response.json();
    paragraph = data.paragraph;
    output.textContent = paragraph;
}

const fetchKeywords = async () => {
    const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paragraph,
        }),
    })
    const data = await response.json();
    console.log(data);
}

const replaceWord = async () => {
    const oldWord = 'the';
    const newWord = 'a';

    const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldWord,
            newWord,
        }),
    })

    const { data } = await response.json();
    paragraph = data.paragraph;
    output.textContent = paragraph;
}



poetryButton.addEventListener('click', fetchPoetry);
keywordsButton.addEventListener('click', fetchKeywords);