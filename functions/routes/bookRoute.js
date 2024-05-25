const express = require('express');
const Book= require('../models/bookModel');
const router = express.Router();

//get
router.get('/', async (req,res)=>{
  try{
    const books = await Book.find();
    res.json(books);
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

//get books by id
router.get('/:id', getBook,(req,res)=>{
  res.json(res.book);
})

//create
router.post('/', async (req,res)=>{
  try{
    //validate request body
    if(!req.body.title || !req.body.author || !req.body.publishedDate){
      return res.status(400).json({message:'Title, author and published date are required'})
    }

    //check if the book's title already exists
    const existingTitle = await Book.findOne({title: req.body.title});
    if(!existingTitle){
      return res.status(400).json({message:'Book title is already exists'})
    }

    const book = new Book(req.body);
    const newBook = await book.save();

    res
      .status(200)
      .json({message: 'Author created successfully', AddedBook:newBook});
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

router.put('/:id',getBook, async (req, res)=>{
  try{
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.json(updatedBook);
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

//delete books by id
router.delete('/:id', getBook, async (req,res)=>{
  try{
    await Book.findByIdAndDelete(req.params.id);
    res.json({message: 'Book deleted successfully'});
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

//middleware function to get a single book by id
async function getBook(req,res,next){
  try{
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
      return res.status(404).json({message:'Book not found'});
    }
    res.book = book;
    next();
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports = router;