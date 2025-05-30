const Book = require('../models/book');

exports.getAllBooks = async (req, res) => {
    const books = await Book.find();
    res.json(books);
};

exports.createBook = async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
};

exports.updateBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
};

exports.deleteBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
};
