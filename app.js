const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config= require('./config/database');

mongoose.connect(config.database);
const db = mongoose.connection;

//Check for connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Bring in models
let Article = require('./models/article');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));


//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//Home route
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
        res.render('index', {
        title:'Articles',
        articles: articles
            });
        }
    });    
}); 

//Layout route
app.get('/layout', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
        res.render('layout', {
        title:'Portfolio',
        articles: articles
            });
        }
    });    
}); 

//Images route
app.get('/img/welcome.gif', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'welcome.gif'))
});

app.get('/img/contact-img.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'contact-img.jpg'))
});

app.get('/img/education-img.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'education-img.jpg'))
});

app.get('/img/experience-img.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'experience-img.jpg'))
});

app.get('/img/quotes-bg.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'quotes-bg.jpg'))
});

app.get('/img/cg.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'cg.jpg'))
});

app.get('/img/sti.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'sti.jpg'))
});

app.get('/img/isr.jpg', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'isr.jpg'))
});

app.get('/img/pdf.png', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'img', 'pdf.png'))
});

//Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//Start server
app.listen(process.env.PORT, function(){
    console.log('Server started  on port 3000!')
});