const circle = document.querySelector('#circle')
const signup_div = document.querySelector('#signup-div')
const login_div = document.querySelector('#login-div');
const img1 = document.querySelector('#img1')
const img2 = document.querySelector('#img2')
const formdiv = document.querySelector('#formdiv')
const signup_form = document.querySelector('#signup-form-div')


document.querySelector('#btn-sign-panel').addEventListener('click', () => {

    circle.classList.add('signup-mode-animation');
    circle.classList.add('signup-mode-circle');

    signup_div.classList.add('signup-mode-animation');
    signup_div.classList.add('signup-mode-signup-div');

    login_div.classList.add('signup-mode-animation');
    login_div.classList.add('signup-mode-login-div');

    img1.classList.add('signup-mode-animation');
    img1.classList.add('signup-mode-img1');

    img2.classList.add('signup-mode-animation');
    img2.classList.add('signup-mode-img2');

    formdiv.classList.add('signup-mode-animation');
    formdiv.classList.add('signup-mode-formdiv');

    signup_form.classList.add('signup-mode-animation');
    signup_form.classList.add('signup-mode-signupForm');

})

document.querySelector('#btn-login-panel').addEventListener('click', ()=>{
    circle.classList.remove('signup-mode-circle');

    signup_div.classList.remove('signup-mode-signup-div');

    login_div.classList.remove('signup-mode-login-div');

    img1.classList.remove('signup-mode-img1');

    img2.classList.remove('signup-mode-img2');

    formdiv.classList.remove('signup-mode-formdiv');

    signup_form.classList.remove('signup-mode-signupForm');
});






 