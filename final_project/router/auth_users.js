const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign({
      data: username
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });
    
    // Save token in session
    req.session.accessToken = accessToken;
    req.session.username = username;
    
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;
  
  // Check if review is provided
  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }
  
  // Find the book by ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);
  
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Initialize reviews object if it doesn't exist or is a string
  if (typeof book.reviews === 'string' || !book.reviews) {
    book.reviews = {};
  }
  
  // Add or modify the review for the current user
  book.reviews[username] = review;
  
  return res.status(200).json({message: "Review added/modified successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
