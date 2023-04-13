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


console.log(headingThemes);


nextBtn.addEventListener('click', () => {
    headingGenre.classList.add('fade-out');
    sectionGenre.classList.add('out-screen');

    setTimeout(() => {
        headingGenre.classList.add('remove');
        sectionGenre.classList.add('remove');

        nextBtn.classList.add('fade-out');

        headingThemes.classList.add('block');
        setTimeout(() => {
            headingThemes.classList.add('fade-in');
        }, 1000);
    }, 1800);
});

genreItems.forEach(genreItem => {
    genreItem.addEventListener('click', (e) => {
        const style = e.target.dataset.style;

        body.classList.toggle(style);

        genreItem.classList.toggle('active');
        nextBtn.classList.add('fade-in');
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
                    console.log("nu moeten de genres komen");
                }, 1000);
            }, 1000);
        });

    });
    console.log("nu wordt er op mij geklikt")
});