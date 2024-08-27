
document.addEventListener('DOMContentLoaded', () => {


    const login_div = document.getElementById('formdiv');
    const login_form = document.querySelector('#login-form');
    const login_email = document.getElementById('login-email');
    const login_password = document.getElementById('login-password');
    const login_msg = document.getElementById('login-msg');
    const login_error = document.getElementById('login-error');

    
    const signup_form = document.getElementById('signup-form');
    const signup_name = document.getElementById('signup-name');
    const signup_email = document.getElementById('signup-email');
    const signup_password = document.getElementById('signup-password');
    const signup_msg = document.getElementById('signup-msg');
    
    const signup_error = document.getElementById('signup-error');

    
    login_form.addEventListener('submit', logInUser);
    signup_form.addEventListener('submit', addUser);
    

    document.getElementById('forgot-link').addEventListener('click', () => {
        login_div.hidden = true;
        forgot_div.hidden = false;
        document.querySelector('#signup-div').hidden = true;
        document.querySelector('#img1').hidden = true;
        document.querySelector('#circle').hidden = true;
    })

    // LOGIN EVENT
    async function logInUser(e) {

        e.preventDefault();

        if (login_email.value == '' || login_password.value == '') {

            login_msg.innerHTML = '<b>Please enter all fields</b>';


            setTimeout(() => {
                login_msg.removeChild(login_msg.firstChild);
            }, 2000);


        }
        else {
            try {

                const User = {
                    email: login_email.value,
                    password: login_password.value
                };

                const result = await axios.post("http://3.88.62.108:3000/login", User);

                // alert('User Logged In Successfully');

                alert(result.data.message);

                // console.log(result.data.token);
                localStorage.setItem('token', result.data.token);
                window.location.href = '../dashboard/home.html';

                login_form.reset();
            }
            catch (err) {

                // login_error.hidden=false;
                login_error.innerHTML = `${err.response.data.message}`;

                setTimeout(() => {
                    login_error.removeChild(login_error.firstChild);
                }, 2000);

                // console.log(err.response.data.message);
                login_form.reset();

            }

        }

    }




    //SIGNUP EVENT 


    async function addUser(e) {

        e.preventDefault();

        if (signup_name.value == '' || signup_email.value == '' || signup_password.value == '') {

            signup_msg.innerHTML = '<b>Please enter all fields</b>';

            setTimeout(() => {
                signup_msg.removeChild(signup_msg.firstChild);
            }, 2000);


        }
        else {
            if (signup_error.firstChild) {
                signup_error.removeChild(signup_error.firstChild);
            }
            try {


                const User = {
                    name: signup_name.value,
                    email: signup_email.value,
                    password: signup_password.value
                };

                // console.log(User)
                const result = await axios.post("http://3.88.62.108:3000/signup", User);
                signup_form.reset();
                // console.log(result);
                
                alert( ` ${result.data.message}`);
                document.getElementById('btn-login-panel').click();
                
            }
            catch (err) {

                signup_error.innerHTML = `Error: ${err.response.data}`;
                // console.log(err);
                signup_form.reset();

            }

        }

    }






})