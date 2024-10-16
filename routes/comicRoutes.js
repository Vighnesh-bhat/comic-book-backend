const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');

const validateComic = require('../middleware/validateComic'); 
const validateEditedComic = require('../middleware/validateEditedComic'); 

// Comic CRUD routes
router.post('/addbook', validateComic, comicController.createBook);
router.put('/updatebook/:id', validateEditedComic,comicController.updateBook);
router.delete('/deletebook/:id', comicController.deleteBook);
router.get('/getallbooks', comicController.getAllBooks);
router.get('/getbook/:id', comicController.getBookById);

module.exports = router;
