const navLinks = document.querySelector('.nav-links');
const slideover_bg = document.getElementById('slideover-bg');
const buy_btn = document.querySelector('#buy-btn');



function onToggleMenu(e) {
    e.name = e.name === 'menu' ? 'close' : 'menu'


    navLinks.classList.toggle('z-40');
    navLinks.classList.toggle('hidden');

    slideover_bg.classList.toggle('invisible');
    // slideover_bg.classList.toggle('opacity-0');
    slideover_bg.classList.toggle('opacity-50');
    slideover_bg.classList.toggle('z-10');


}