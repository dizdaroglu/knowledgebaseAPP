
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require('connect-flash');
const session = require('express-session');

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

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,

}));
//express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
//express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

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

// Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);

//Start Server
app.listen(3000, function () {
    console.log("Server started..");
});