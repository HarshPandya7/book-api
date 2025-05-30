const express = require('express');
const controller = require('../controllers/bookController');
const router = express.Router();

router.get('/books', controller.getAllBooks);
router.post('/books', controller.createBook);
router.put('/books/:id', controller.updateBook);
router.delete('/books/:id', controller.deleteBook);

module.exports = router;
