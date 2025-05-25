const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	// Check if username and password are provided
	if (!username || !password) {
		return res.status(400).json({message: "Username and password are required"});
	}

	// Check if username already exists
	const userExists = users.find(user => user.username === username);
	if (userExists) {
		return res.status(409).json({message: "Username already exists"});
	}

	// Register the new user
	users.push({username: username, password: password});
	return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
	try {
		// Simulate server request with 2 second timeout
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Simulate axios request (since we're simulating, we'll just return the books data)
		const response = await new Promise((resolve) => {
			setTimeout(() => {
				resolve({ data: books });
			}, 0);
		});
		
		res.status(200).json(response.data);
	} catch (error) {
		res.status(500).json({ message: "Error fetching books" });
	}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	const book = Object.values(books).find(book => book.isbn === isbn);
	if (book) {
		return res.status(200).json(book);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	const author = req.params.author;
	const bookKeys = Object.keys(books);
	const booksByAuthor = [];

	for (let key of bookKeys) {
		if (books[key].author === author) {
			booksByAuthor.push(books[key]);
		}
	}

	if (booksByAuthor.length > 0) {
		return res.status(200).json(booksByAuthor);
	} else {
		return res.status(404).json({message: "No books found by this author"});
	}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];
  
  for (let key of bookKeys) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	const book = Object.values(books).find(book => book.isbn === isbn);
	
	if (book) {
		return res.status(200).json(book.reviews);
	} else {
		return res.status(404).json({message: "Book not found"});
	}
});

module.exports.general = public_users;
