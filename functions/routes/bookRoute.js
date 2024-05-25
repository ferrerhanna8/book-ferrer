const express = require('express');
const Book = require('../models/bookModel');
const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by ID
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, publishedDate } = req.body;

    // Validate request body
    if (!title || !author || !publishedDate) {
      return res.status(400).json({ message: 'Title, author, and published date are required' });
    }

    // Check if the book's title already exists
    const existingTitle = await Book.findOne({ title: title });
    if (existingTitle) {
      return res.status(400).json({ message: 'Book title already exists' });
    }

    // Create a new book
    const book = new Book(req.body);
    const newBook = await book.save();

    // Respond with the created book
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a book
router.put('/:id', getBook, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a book by ID
router.delete('/:id', getBook, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single book by ID
async function getBook(req, res, next) {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.book = book;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = router;
