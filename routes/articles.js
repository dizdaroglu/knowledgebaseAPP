const express = require("express");
const router = express.Router();


//Bring in Article Model
let Article = require('../models/article');


//Load edit Form
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: "Edit Article",
            article: article
        });
    });
});

//update submit POST Route
router.post('/edit/:id', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: "Add Article",
            errors: errors
        });
    } else {
        let article = {};
        article.title = req.body.title;
        article.body = req.body.body;
        article.author = req.body.author;
        let query = { _id: req.params.id }

        Article.update(query, article, (err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Updated');
                res.redirect("/");
            }
        });
    }
});

router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }

    Article.remove(query, (err) => {
        if (err)
            console.log(err);

        res.send('Success');
    });
});

//add Route
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});
// add submit  POST route
router.post('/add', (req, res) => {

    let article = new Article(req.body);


    const promise = article.save();

    promise.then((data) => {
        req.flash('success', 'Article Added')
        res.redirect('/');
    }).catch((err) => {
        res.json(err);
    });
});


router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (req, article) => {
        res.render('article', {
            article: article
        });
    });
});

module.exports = router;