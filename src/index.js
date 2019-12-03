const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport'); //*

//Initiazations
const app= express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));//Indicates where the views file is.
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //direccion of the file
    partialsDir:  path.join(app.get('views'), 'partials'), 
    extname: '.hbs' //extensions of our files
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false})) //this works when some form wants to send me something, I can understand.   extended : false:  is avoid the send of images o videos.
app.use(methodOverride('_method'));
app.use(session(({
    secret: 'mysecretapp', //key word
    resave: true,
    saveUninitialized: true //default values.
})));
app.use(passport.initialize()); //*
app.use(passport.session()); //*
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //*
    res.locals.user = req.user || null; //this allow us to save the data from the user and use it in all the app
    next();
});

//Routes
app.use(require('./routes/index')); 
app.use(require('./routes/notes')); 
app.use(require('./routes/users')); 

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listen
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});

