const jobElement = document.querySelector('.job');

//Personal
jobElement.addEventListener('animationend', () => {
    jobElement.classList.add('slide-in-done');
    jobElement.style.animation = 'none';
});