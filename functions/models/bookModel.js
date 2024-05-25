const mongoose = require('mongoose');
const bookSchema = require('../schema/bookSchema');

const BookModel = mongoose.model('Book',bookSchema);

module.exports = BookModel;