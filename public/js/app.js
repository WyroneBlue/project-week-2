import { fetchPoetry } from "./poem.js";

const sectionBlocks = document.querySelector('.blocks');
const blocks = document.querySelectorAll('.block');
const sectionLanding = document.querySelector('.landing');
const headingGenre = document.querySelector('.heading-genre');
const sectionGenre = document.querySelector('.genres');
const genreItems = document.querySelectorAll('section.genres ul li');
const nextBtn = document.querySelector('.nextBtn');
const main = document.querySelector('main');
const headingThemes = document.querySelector('.heading-themes');
const body = document.querySelector('body');
const sectionThemes = document.querySelector('.themes');
const themeItems = document.querySelectorAll('section.themes ul li');
const finalNextBtn = document.querySelector('.finalNextBtn');
const sectionPoem = document.querySelector('.poem');

let genre = '';
let themes = [];

nextBtn.addEventListener('click', () => {

    headingGenre.classList.add('fade-out');
    sectionGenre.classList.add('out-screen');

    setTimeout(() => {
        headingGenre.classList.add('remove');
        sectionGenre.classList.add('remove');

        nextBtn.classList.add('fade-out');

        headingThemes.classList.add('block');
        sectionThemes.classList.add('block');
        setTimeout(() => {
            headingThemes.classList.add('fade-in');
            nextBtn.classList.add('remove');
            finalNextBtn.classList.add('block');

            setTimeout(() => {
                sectionThemes.classList.add('fall');
            }, 1000);
        }, 1000);
    }, 1800);
});

finalNextBtn.addEventListener('click', () => {
    headingThemes.classList.add('fade-out');
    sectionThemes.classList.add('out-screen');

    setTimeout(() => {
        headingThemes.classList.add('remove');
        sectionThemes.classList.add('remove');

        setTimeout(() => {
            sectionPoem.classList.add('show');
            finalNextBtn.classList.add('remove');

            fetchPoetry(genre, themes);
        }, 1000);
    }, 1800);
});

const resetGenreItems = () => {
    genreItems.forEach(genreItem => {
        genreItem.classList.remove('active');
        body.classList.remove(genreItem.dataset.genreClass);
    })
}

genreItems.forEach(genreItem => {
    genreItem.addEventListener('click', (e) => {
        resetGenreItems();
        const name = e.target.dataset.genreName;
        const className = e.target.dataset.genreClass;

        // console.log(className, name);
        genre = name;
        body.classList.add(className);
        genreItem.classList.add('active');
        nextBtn.classList.add('fade-in');
    });
});

themeItems.forEach(themeItem => {
    themeItem.addEventListener('click', (e) => {

        if (!themes.includes(e.target.dataset.themeName)) {
            themes.push(e.target.dataset.themeName);
            themeItem.classList.add('active');
            finalNextBtn.classList.add('fade-in');
            return;
        } else {
            themes = themes.filter(theme => theme !== e.target.dataset.themeName);
            themeItem.classList.remove('active');
        }
    });
});

sectionBlocks.addEventListener('click', () => {
    sectionLanding.classList.add('fade-out');

    blocks.forEach(block => {
        block.classList.add('fall');

        sectionBlocks.addEventListener('animationend', () => {
            sectionBlocks.classList.add('remove');
            sectionLanding.classList.add('remove');

            main.classList.add('flex');
            headingGenre.classList.add('block');

            setTimeout(() => {
                headingGenre.classList.add('fade-in');

                setTimeout(() => {
                    sectionGenre.classList.add('fall');
                }, 1000);
            }, 1000);
        });

    });
});