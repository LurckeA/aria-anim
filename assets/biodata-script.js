window.addEventListener('load', () => {
    const aboutElement = document.querySelector('.about');
    const isiAboutElement = document.querySelector('.isi-about');
    const anElement = document.querySelector('.an');

    aboutElement.style.opacity = 1;

    setTimeout(() => {
        isiAboutElement.style.opacity = 1;

        setTimeout(() => {
            anElement.style.opacity = 1;
        }, 200);
    }, 200);
});