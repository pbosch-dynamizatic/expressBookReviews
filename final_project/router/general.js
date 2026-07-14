const express = require('express');
const axios = require('axios'); // Asegúrate de instalar axios: npm install axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ============================================================
// TASK 10: Get the list of books available in the shop
// Usando Promise callbacks con Axios
// ============================================================
public_users.get('/books', function (req, res) {
    // Usando Promise con Axios para obtener los libros
    axios.get('http://localhost:5000/books-list')
        .then(response => {
            // Si el endpoint existe, devolver la respuesta
            return res.status(200).json({
                message: "Books retrieved successfully using Promise",
                books: response.data
            });
        })
        .catch(error => {
            // Si el endpoint no existe, devolver los libros locales
            console.log("Using local books data (endpoint not available)");
            return res.status(200).json({
                message: "Books retrieved successfully (local data)",
                books: books
            });
        });
});

// TASK 10 (Alternativa): Usando async-await con Axios
public_users.get('/books-async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books-list');
        return res.status(200).json({
            message: "Books retrieved successfully using async-await",
            books: response.data
        });
    } catch (error) {
        console.log("Using local books data (endpoint not available)");
        return res.status(200).json({
            message: "Books retrieved successfully (local data using async-await)",
            books: books
        });
    }
});

// ============================================================
// TASK 11: Get book details based on ISBN
// Usando Promise callbacks con Axios
// ============================================================
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Usando Promise con Axios para obtener el libro por ISBN
    axios.get(`http://localhost:5000/book-details/${isbn}`)
        .then(response => {
            return res.status(200).json({
                message: `Book with ISBN ${isbn} retrieved successfully using Promise`,
                book: response.data
            });
        })
        .catch(error => {
            // Si el endpoint no existe, buscar en los datos locales
            console.log(`Using local data for ISBN: ${isbn}`);
            if (books[isbn]) {
                return res.status(200).json({
                    message: `Book with ISBN ${isbn} found (local data)`,
                    book: books[isbn]
                });
            } else {
                return res.status(404).json({ 
                    message: `Book with ISBN ${isbn} not found` 
                });
            }
        });
});

// TASK 11 (Alternativa): Usando async-await con Axios
public_users.get('/isbn-async/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        const response = await axios.get(`http://localhost:5000/book-details/${isbn}`);
        return res.status(200).json({
            message: `Book with ISBN ${isbn} retrieved successfully using async-await`,
            book: response.data
        });
    } catch (error) {
        console.log(`Using local data for ISBN: ${isbn}`);
        if (books[isbn]) {
            return res.status(200).json({
                message: `Book with ISBN ${isbn} found (local data using async-await)`,
                book: books[isbn]
            });
        } else {
            return res.status(404).json({ 
                message: `Book with ISBN ${isbn} not found` 
            });
        }
    }
});

// ============================================================
// TASK 12: Get book details based on Author
// Usando Promise callbacks con Axios
// ============================================================
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    // Usando Promise con Axios para obtener libros por autor
    axios.get(`http://localhost:5000/books-by-author/${encodeURIComponent(author)}`)
        .then(response => {
            return res.status(200).json({
                message: `Books by author "${author}" retrieved successfully using Promise`,
                books: response.data
            });
        })
        .catch(error => {
            // Si el endpoint no existe, buscar en los datos locales
            console.log(`Using local data for author: ${author}`);
            const matchedBooks = [];
            
            for (let isbn in books) {
                if (books[isbn].author && books[isbn].author.toLowerCase() === author.toLowerCase()) {
                    matchedBooks.push({
                        isbn: isbn,
                        ...books[isbn]
                    });
                }
            }
            
            if (matchedBooks.length > 0) {
                return res.status(200).json({
                    message: `Books by author "${author}" found (local data)`,
                    books: matchedBooks
                });
            } else {
                return res.status(404).json({ 
                    message: `No books found by author: ${author}` 
                });
            }
        });
});

// TASK 12 (Alternativa): Usando async-await con Axios
public_users.get('/author-async/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
        const response = await axios.get(`http://localhost:5000/books-by-author/${encodeURIComponent(author)}`);
        return res.status(200).json({
            message: `Books by author "${author}" retrieved successfully using async-await`,
            books: response.data
        });
    } catch (error) {
        console.log(`Using local data for author: ${author}`);
        const matchedBooks = [];
        
        for (let isbn in books) {
            if (books[isbn].author && books[isbn].author.toLowerCase() === author.toLowerCase()) {
                matchedBooks.push({
                    isbn: isbn,
                    ...books[isbn]
                });
            }
        }
        
        if (matchedBooks.length > 0) {
            return res.status(200).json({
                message: `Books by author "${author}" found (local data using async-await)`,
                books: matchedBooks
            });
        } else {
            return res.status(404).json({ 
                message: `No books found by author: ${author}` 
            });
        }
    }
});

// ============================================================
// TASK 13: Get book details based on Title
// Usando Promise callbacks con Axios
// ============================================================
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    // Usando Promise con Axios para obtener libros por título
    axios.get(`http://localhost:5000/books-by-title/${encodeURIComponent(title)}`)
        .then(response => {
            return res.status(200).json({
                message: `Books with title containing "${title}" retrieved successfully using Promise`,
                books: response.data
            });
        })
        .catch(error => {
            // Si el endpoint no existe, buscar en los datos locales
            console.log(`Using local data for title: ${title}`);
            const matchedBooks = [];
            
            for (let isbn in books) {
                if (books[isbn].title && books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
                    matchedBooks.push({
                        isbn: isbn,
                        ...books[isbn]
                    });
                }
            }
            
            if (matchedBooks.length > 0) {
                return res.status(200).json({
                    message: `Books with title containing "${title}" found (local data)`,
                    books: matchedBooks
                });
            } else {
                return res.status(404).json({ 
                    message: `No books found with title containing: ${title}` 
                });
            }
        });
});

// TASK 13 (Alternativa): Usando async-await con Axios
public_users.get('/title-async/:title', async function (req, res) {
    const title = req.params.title;
    
    try {
        const response = await axios.get(`http://localhost:5000/books-by-title/${encodeURIComponent(title)}`);
        return res.status(200).json({
            message: `Books with title containing "${title}" retrieved successfully using async-await`,
            books: response.data
        });
    } catch (error) {
        console.log(`Using local data for title: ${title}`);
        const matchedBooks = [];
        
        for (let isbn in books) {
            if (books[isbn].title && books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
                matchedBooks.push({
                    isbn: isbn,
                    ...books[isbn]
                });
            }
        }
        
        if (matchedBooks.length > 0) {
            return res.status(200).json({
                message: `Books with title containing "${title}" found (local data using async-await)`,
                books: matchedBooks
            });
        } else {
            return res.status(404).json({ 
                message: `No books found with title containing: ${title}` 
            });
        }
    }
});

// ============================================================
// ENDPOINTS INTERNOS (para simular la API con Axios)
// ============================================================

// Endpoint interno para obtener todos los libros
public_users.get('/books-list', function (req, res) {
    return res.status(200).json(books);
});

// Endpoint interno para obtener libro por ISBN
public_users.get('/book-details/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Endpoint interno para obtener libros por autor
public_users.get('/books-by-author/:author', function (req, res) {
    const author = req.params.author;
    const matchedBooks = [];
    
    for (let isbn in books) {
        if (books[isbn].author && books[isbn].author.toLowerCase() === author.toLowerCase()) {
            matchedBooks.push({
                isbn: isbn,
                ...books[isbn]
            });
        }
    }
    
    if (matchedBooks.length > 0) {
        return res.status(200).json(matchedBooks);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

// Endpoint interno para obtener libros por título
public_users.get('/books-by-title/:title', function (req, res) {
    const title = req.params.title;
    const matchedBooks = [];
    
    for (let isbn in books) {
        if (books[isbn].title && books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            matchedBooks.push({
                isbn: isbn,
                ...books[isbn]
            });
        }
    }
    
    if (matchedBooks.length > 0) {
        return res.status(200).json(matchedBooks);
    } else {
        return res.status(404).json({ message: "No books found" });
    }
});

// ============================================================
// OTROS ENDPOINTS (funcionalidades existentes)
// ============================================================

// Get book review (Task 5)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        if (books[isbn].reviews) {
            return res.status(200).json({
                message: "Reviews found",
                isbn: isbn,
                reviews: books[isbn].reviews
            });
        } else {
            return res.status(200).json({
                message: "No reviews found for this book",
                isbn: isbn,
                reviews: {}
            });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

module.exports.general = public_users;