
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import axios from 'axios';
import './book-store.css'
import { useAuthContext } from "@asgardeo/auth-react";
interface Book {
    id: number;
    book_title: string;
    author: string;
    category: string;
    published_year: number;
    price: number;
    copies_in_stock: number;
  }

export const BookStore: FunctionComponent = (): ReactElement => {
  const {
    getAccessToken,
  } = useAuthContext();
    const [books, setBooks] = useState<Book[]>([]);
    const [newBook, setNewBook] = useState<Book>({
      id: 0,
      book_title: '',
      author: '',
      category: '',
      published_year: 0,
      price: 0,
      copies_in_stock: 0
    });
    const [updatedBook, setUpdatedBook] = useState<Book>({
      id: 0,
      book_title: '',
      author: '',
      category: '',
      published_year: 0,
      price: 0,
      copies_in_stock: 0
    });
    const [bookIdToDelete, setBookIdToDelete] = useState<number>(0);
    const [bookIdToGet, setBookIdToGet] = useState<number>(0);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // const API = process.env.BACKEND_ENDPOINT


  
    useEffect(() => {
      fetchBooks();
    }, []);
  
    const fetchBooks = async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await axios.get<Book[]>('https://04ef0bb4-e44c-469a-b881-d5e935130fb2-prod.e1-us-east-azure.choreoapis.dev/kqrg/bookstorebackend/endpoint-9090-803/v1/books', {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-jwt-assertion": accessToken,
          }
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    
  
    const addBook = async () => {
      const accessToken = await getAccessToken();
      try {
        await axios.post('https://04ef0bb4-e44c-469a-b881-d5e935130fb2-prod.e1-us-east-azure.choreoapis.dev/kqrg/bookstorebackend/endpoint-9090-803/v1/books', newBook, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-jwt-assertion": accessToken,
          }
        });
        setNewBook({
          id: 0,
          book_title: '',
          author: '',
          category: '',
          published_year: 2020,
          price: 0.0,
          copies_in_stock: 0
        });
        fetchBooks();
      } catch (error) {
        console.error('Error adding book:', error);
      }
    };
  
    const getBookById = async () => {
      const accessToken = await getAccessToken();
      try {
        const response = await axios.get<Book>(`https://04ef0bb4-e44c-469a-b881-d5e935130fb2-prod.e1-us-east-azure.choreoapis.dev/kqrg/bookstorebackend/endpoint-9090-803/v1/books/${bookIdToGet}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-jwt-assertion": accessToken,
          }
        });
        setSelectedBook(response.data);
      } catch (error) {
        console.error('Error fetching book by ID:', error);
      }
    };
  
    const updateBook = async () => {
      const accessToken = await getAccessToken();
      try {
        await axios.put('https://04ef0bb4-e44c-469a-b881-d5e935130fb2-prod.e1-us-east-azure.choreoapis.dev/kqrg/bookstorebackend/endpoint-9090-803/v1/books', updatedBook, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-jwt-assertion": accessToken,
          }
        });
        setUpdatedBook({
          id: 0,
          book_title: '',
          author: '',
          category: '',
          published_year: 0,
          price: 0,
          copies_in_stock: 0
        });
        fetchBooks();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    };
  
    const deleteBook = async () => {
      const accessToken = await getAccessToken();
      try {
        await axios.delete(`https://04ef0bb4-e44c-469a-b881-d5e935130fb2-prod.e1-us-east-azure.choreoapis.dev/kqrg/bookstorebackend/endpoint-9090-803/v1/books/${bookIdToDelete}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-jwt-assertion": accessToken,
          }
        });
        setBookIdToDelete(0);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    };

 
    return (
        <>
           <div className="container">
      <div className="add-update-delete">
        <div className="add-book">
        <h2>Add Book</h2>
          <label>ID:</label>
          <input
            type="number"
            value={newBook.id}
            onChange={e => setNewBook({ ...newBook, id: parseInt(e.target.value) })}
            placeholder="ID"
          />
          <label>Title:</label>
          <input
            type="text"
            value={newBook.book_title}
            onChange={e => setNewBook({ ...newBook, book_title: e.target.value })}
            placeholder="Title"
          />
          <label>Author:</label>
          <input
            type="text"
            value={newBook.author}
            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
            placeholder="Author"
          />
          <label>Category:</label>
           <input
            type="text"
            value={newBook.category}
            onChange={e => setNewBook({ ...newBook, category: e.target.value })}
            placeholder="Category"
          />
          <label>Number of Copies:</label>
          <input
            type="number"
            value={newBook.copies_in_stock}
            onChange={e => setNewBook({ ...newBook, copies_in_stock: parseInt(e.target.value) })}
            placeholder="Number of Copies"
          />
          <label>LKR:</label>
          <input
            type="number"
            value={newBook.price}
            onChange={e => setNewBook({ ...newBook, price: parseInt(e.target.value) })}
            placeholder="LKR"
          />
          <label>Year:</label>
          <input
            type="number"
            value={newBook.published_year}
            onChange={e => setNewBook({ ...newBook, published_year: parseInt(e.target.value) })}
            placeholder="Year"
          />
          <button onClick={addBook}>Add Book</button>
        </div>
        <div className="get-book">
          <h2>Get Book By ID</h2>
          <label>ID:</label>
          <input
            type="number"
            value={bookIdToGet}
            onChange={e => setBookIdToGet(parseInt(e.target.value))}
            placeholder="Book ID"
          />
          <button onClick={getBookById}>Get Book</button>
          {selectedBook && (
            <div>
              <h3>{selectedBook.book_title}</h3>
              <p>Author: {selectedBook.author}</p>
              <p>Category: {selectedBook.category}</p>
              <p>Published Year: {selectedBook.published_year}</p>
              <p>Price: {selectedBook.price}</p>
              <p>Copies in Stock: {selectedBook.copies_in_stock}</p>
            </div>
          )}
        </div>
        <div className="update-book">
          <h2>Update Book</h2>
          <label>ID:</label>
          <input
            type="number"
            value={updatedBook.id}
            onChange={e => setUpdatedBook({ ...updatedBook, id: parseInt(e.target.value) })}
            placeholder="ID"
          />
          <label>Title:</label>
          <input
            type="text"
            value={updatedBook.book_title}
            onChange={e => setUpdatedBook({ ...updatedBook, book_title: e.target.value })}
            placeholder="Title"
          />
          <label>Author:</label>
          <input
            type="text"
            value={updatedBook.author}
            onChange={e => setUpdatedBook({ ...updatedBook, author: e.target.value })}
            placeholder="Author"
          />
           <label>Category:</label>
           <input
            type="text"
            value={updatedBook.category}
            onChange={e => setUpdatedBook({ ...updatedBook, category: e.target.value })}
            placeholder="Category"
          />
          <label>Number of Copies:</label>
          <input
            type="number"
            value={updatedBook.copies_in_stock}
            onChange={e => setUpdatedBook({ ...updatedBook, copies_in_stock: parseInt(e.target.value) })}
            placeholder="Number of Copies"
          />
          <label>LKR:</label>
          <input
            type="number"
            value={updatedBook.price}
            onChange={e => setUpdatedBook({ ...updatedBook, price: parseInt(e.target.value) })}
            placeholder="LKR"
          />
          <label>Year:</label>
          <input
            type="number"
            value={updatedBook.published_year}
            onChange={e => setUpdatedBook({ ...updatedBook, published_year: parseInt(e.target.value) })}
            placeholder="Year"
          />
          <button onClick={updateBook}>Update Book</button>
        </div>
        <div className="delete-book">
          <h2>Delete Book</h2>
          <label>ID:</label>
          <input
            type="number"
            value={bookIdToDelete}
            onChange={e => setBookIdToDelete(parseInt(e.target.value))}
            placeholder="ID"
          />
          <button onClick={deleteBook}>Delete Book</button>
        </div>
      </div>
      <h1>Books</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Published Year</th>
            <th>Price</th>
            <th>Copies in Stock</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.book_title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.published_year}</td>
              <td>{book.price}</td>
              <td>{book.copies_in_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
    );
};
