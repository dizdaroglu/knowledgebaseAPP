
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', () => {
    console.log("Connected to MongoDB");
});
// check for db errors
db.on('error', (err) => {
    console.log(err);
});

//Inıt app
const app = express();

//Bring in Models
let Article = require('./models/article');
//parse application
app.use(bodyParser.urlencoded({ extended: false }));
//parse application json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home Route
app.get('/', (req, res) => {
    const promise = Article.find({});
    promise.then((data) => {
        res.render('index', {
            title: 'Articles',
            articles: data
        });
    }).catch((err) => {
        res.json(err);
    });


});

app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (req, article) => {
        res.render('article', {
            article: article
        });
    });
});


//add Route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'add'
    });
});
// add submit  POST route
app.post('/articles/add', (req, res) => {

    let article = new Article(req.body);


    const promise = article.save();

    promise.then((data) => {
        res.redirect('/');
    }).catch((err) => {
        res.json(err);
    });
});

//Start Server
app.listen(3000, function () {
    console.log("Server started..");
});