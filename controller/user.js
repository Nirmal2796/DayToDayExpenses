const bcrypt = require('bcrypt');

const User = require('../models/user');


exports.postSignupUser = async (req, res) => {

    try {

        email = req.body.email;
        uname = req.body.name;
        password = req.body.password;


        const user = await User.findByPk(email)

        if (user) {
            res.status(403).json('User Already Exists');
        }
        else {

            bcrypt.hash(password, 10, async (err, hash) => {

                if (!err) {
                    const newUser = await User.create({
                        email: email,
                        name: uname,
                        password: hash
                    });

                    res.status(201).json({ newUser: newUser, message: 'User registered Successfully...Please Log In' });
                }
                else {
                    throw new Error('Something went wrong');
                }
            })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }

}


exports.postLoginUser = async (req, res) => {

    try{
        const email = req.body.email;
        const password = req.body.password;
    
        const user = await User.findByPk(email)
    
        if (user) {

            bcrypt.compare(password,user.password,(err,result)=>{

                if(err){
                    throw new Error('Something Went Wrong');
                }
                if(result){
                    res.status(200).json({ message: 'User logged in Successfully' });
                }
                else{
                    res.status(401).json({ message: ' User not authorized' });
                }
            })
           
        }
        else {
            res.status(404).json({ message: 'User not found'});
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }

};