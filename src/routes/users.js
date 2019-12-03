const express = require('express');
const passport = require('passport');
const router = express.Router();


// Models
const User = require('../models/User');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    let errors = [];
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match.' });
    }
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters.' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
    } else {
        const emailUser = await User.findOne({ email: email }); //find if there is a email in the database equal to the new email.
        if (emailUser) {
            req.flash('errors_msg', 'The email is already registered');
            res.redirect('/users/signup');
            
        } else{
            //Saving a New User
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
            
        }
    }

});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true //send message flash
}));

router.get('/users/logout', (req, res) => {
    req.logout(); //method from passport
    req.flash('success_msg', 'You are logged out now.');
    res.redirect('/users/signin');
});

module.exports = router;