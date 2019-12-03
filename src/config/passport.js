7  
const passport = require('passport'); //This module allow to authentication the user and save it in a session.
const LocalStrategy = require('passport-local').Strategy; // local authentication 

const mongoose = require('mongoose');
const User = require('../models/User'); 

//to define a new local authentication
passport.use(new LocalStrategy({
  usernameField: 'email' //for which field I want to the user is authenticated.
}, async (email, password, done) => {
  // Match Email's User
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Not User found.' });
  } else {
    // Match Password's User
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }

}));


passport.serializeUser((user, done) => {
  done(null, user.id);
}); //it is for save the user's id in a session

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  }); //and this method is for take the id that we got before and look for the user and use their data.
});