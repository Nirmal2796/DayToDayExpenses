const forgot_form = document.getElementById('forgot-form');
    const forgot_email = document.getElementById('forgot-email');
    const forgot_msg = document.getElementById('forgot-msg');
    const forgot_error = document.getElementById('forgot-error');

    forgot_form.addEventListener('submit', forgotPassword);

      //FORGOT PASSWORD

      async function forgotPassword(e) {
        e.preventDefault();

        if (forgot_email.value == '') {

            forgot_msg.innerHTML = '<b>Please enter all fields</b>';

            setTimeout(() => {
                forgot_msg.removeChild(msg.firstChild);
            }, 2000);


        }
        else {
            try {

                const Email = {
                    email: forgot_email.value,

                };

                // console.log(Email);

                const result = await axios.post("http://3.88.62.108:3000/forgotpassword", Email);

                // console.log(result);

                forgot_form.reset();
            }
            catch (err) {

                forgot_error.innerHTML = `Error: ${err.message} , ${err.response.data}`;

                setTimeout(() => {
                    forgot_error.removeChild(forgot_error.firstChild);
                }, 2000);

                // console.log(err.message);
                forgot_form.reset();

            }

        }

    }

