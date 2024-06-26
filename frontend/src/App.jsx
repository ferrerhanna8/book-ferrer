import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', publishedDate: '' });
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://serverless-api-ferrer.netlify.app/.netlify/functions/api');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://serverless-api-ferrer.netlify.app/.netlify/functions/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const data = await response.json();
        setBooks([...books, data.book]); // Add the new book to the state
        setNewBook({ title: '', author: '', publishedDate: '' }); // Clear the input fields
      } else {
        const errorData = await response.json();
        console.error('Error adding book:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleUpdate = async (updatedBook) => {
    try {
      const response = await fetch(`https://serverless-api-ferrer.netlify.app/.netlify/functions/api/${updatedBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });

      if (response.ok) {
        const updatedBooks = books.map((book) => (book._id === updatedBook._id ? updatedBook : book));
        setBooks(updatedBooks);
        setEditingBook(null);
      } else {
        console.error('Error updating book:', response.status);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const response = await fetch(`https://serverless-api-ferrer.netlify.app/.netlify/functions/api/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedBooks = books.filter((book) => book._id !== bookId);
        setBooks(updatedBooks);
      } else {
        console.error('Error deleting book:', response.status);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>ADD BOOKS</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            placeholder="Author"
            required
          />
          <input
            type="date"
            name="publishedDate"
            value={newBook.publishedDate}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book._id}</td>
                <td>
                  {editingBook && editingBook._id === book._id ? (
                    <input
                      type="text"
                      value={editingBook.title}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td>
                  {editingBook && editingBook._id === book._id ? (
                    <input
                      type="text"
                      value={editingBook.author}
                      onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    />
                  ) : (
                    book.author
                  )}
                </td>
                <td>
                  {editingBook && editingBook._id === book._id ? (
                    <input
                      type="date"
                      value={editingBook.publishedDate.split('T')[0]} // Handle date format
                      onChange={(e) => setEditingBook({ ...editingBook, publishedDate: e.target.value })}
                    />
                  ) : (
                    new Date(book.publishedDate).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editingBook && editingBook._id === book._id ? (
                    <button className="save" onClick={() => handleUpdate(editingBook)}>Save</button>
                  ) : (
                    <>
                      <button className="edit" onClick={() => handleEdit(book)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(book._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
