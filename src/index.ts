// Import necessary libraries
import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express from "express";

// Define the User class to represent users of the platform
class User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  constructor(name: string, email: string) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
}

// Define the Book class to represent books available for swap
class Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  description: string;
  createdAt: Date;

  constructor(userId: string, title: string, author: string, description: string) {
    this.id = uuidv4();
    this.userId = userId;
    this.title = title;
    this.author = author;
    this.description = description;
    this.createdAt = new Date();
  }
}

// Define the SwapRequest class to represent swap requests between users
class SwapRequest {
  id: string;
  bookId: string;
  requestedById: string;
  status: string;
  createdAt: Date;

  constructor(bookId: string, requestedById: string, status: string) {
    this.id = uuidv4();
    this.bookId = bookId;
    this.requestedById = requestedById;
    this.status = status;
    this.createdAt = new Date();
  }
}

// Define the Feedback class to represent feedback on swaps
class Feedback {
  id: string;
  userId: string;
  swapRequestId: string;
  rating: number;
  comment: string;
  createdAt: Date;

  constructor(userId: string, swapRequestId: string, rating: number, comment: string) {
    this.id = uuidv4();
    this.userId = userId;
    this.swapRequestId = swapRequestId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = new Date();
  }
}

// Initialize stable maps for storing platform data
const usersStorage = StableBTreeMap<string, User>(0);
const booksStorage = StableBTreeMap<string, Book>(1);
const swapRequestsStorage = StableBTreeMap<string, SwapRequest>(2);
const feedbackStorage = StableBTreeMap<string, Feedback>(3);

// Define the express server
export default Server(() => {
  const app = express();
  app.use(express.json());

  // Endpoint for creating a new user
  app.post("/users", (req, res) => {
    if (
      !req.body.name ||
      typeof req.body.name !== "string" ||
      !req.body.email ||
      typeof req.body.email !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name' and 'email' are provided and are strings.",
      });
      return;
    }

    try {
      const user = new User(
        req.body.name,
        req.body.email
      );
      usersStorage.insert(user.id, user);
      res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    } catch (error) {
      console.error("Failed to create user:", error);
      res.status(500).json({
        error: "Server error occurred while creating the user.",
      });
    }
  });

  // Endpoint for retrieving all users
  app.get("/users", (req, res) => {
    try {
      const users = usersStorage.values();
      res.status(200).json({
        message: "Users retrieved successfully",
        users: users,
      });
    } catch (error) {
      console.error("Failed to retrieve users:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving users.",
      });
    }
  });

  // Endpoint for creating a new book
  app.post("/books", (req, res) => {
    if (
      !req.body.userId ||
      typeof req.body.userId !== "string" ||
      !req.body.title ||
      typeof req.body.title !== "string" ||
      !req.body.author ||
      typeof req.body.author !== "string" ||
      !req.body.description ||
      typeof req.body.description !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'userId', 'title', 'author', and 'description' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const book = new Book(
        req.body.userId,
        req.body.title,
        req.body.author,
        req.body.description
      );
      booksStorage.insert(book.id, book);
      res.status(201).json({
        message: "Book created successfully",
        book: book,
      });
    } catch (error) {
      console.error("Failed to create book:", error);
      res.status(500).json({
        error: "Server error occurred while creating the book.",
      });
    }
  });

  // Endpoint for retrieving all books
  app.get("/books", (req, res) => {
    try {
      const books = booksStorage.values();
      res.status(200).json({
        message: "Books retrieved successfully",
        books: books,
      });
    } catch (error) {
      console.error("Failed to retrieve books:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving books.",
      });
    }
  });

  // Endpoint for creating a new swap request
  app.post("/swapRequests", (req, res) => {
    if (
      !req.body.bookId ||
      typeof req.body.bookId !== "string" ||
      !req.body.requestedById ||
      typeof req.body.requestedById !== "string" ||
      !req.body.status ||
      typeof req.body.status !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'bookId', 'requestedById', and 'status' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const swapRequest = new SwapRequest(
        req.body.bookId,
        req.body.requestedById,
        req.body.status
      );
      swapRequestsStorage.insert(swapRequest.id, swapRequest);
      res.status(201).json({
        message: "Swap request created successfully",
        swapRequest: swapRequest,
      });
    } catch (error) {
      console.error("Failed to create swap request:", error);
      res.status(500).json({
        error: "Server error occurred while creating the swap request.",
      });
    }
  });

  // Endpoint for retrieving all swap requests
  app.get("/swapRequests", (req, res) => {
    try {
      const swapRequests = swapRequestsStorage.values();
      res.status(200).json({
        message: "Swap requests retrieved successfully",
        swapRequests: swapRequests,
      });
    } catch (error) {
      console.error("Failed to retrieve swap requests:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving swap requests.",
      });
    }
  });

  // Endpoint for creating a new feedback
  app.post("/feedback", (req, res) => {
    if (
      !req.body.userId ||
      typeof req.body.userId !== "string" ||
      !req.body.swapRequestId ||
      typeof req.body.swapRequestId !== "string" ||
      !req.body.rating ||
      typeof req.body.rating !== "number" ||
      !req.body.comment ||
      typeof req.body.comment !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'userId', 'swapRequestId', 'rating', and 'comment' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const feedback = new Feedback(
        req.body.userId,
        req.body.swapRequestId,
        req.body.rating,
        req.body.comment
      );
      feedbackStorage.insert(feedback.id, feedback);
      res.status(201).json({
        message: "Feedback created successfully",
        feedback: feedback,
      });
    } catch (error) {
      console.error("Failed to create feedback:", error);
      res.status(500).json({
        error: "Server error occurred while creating the feedback.",
      });
    }
  });

  // Endpoint for retrieving all feedback
  app.get("/feedback", (req, res) => {
    try {
      const feedback = feedbackStorage.values();
      res.status(200).json({
        message: "Feedback retrieved successfully",
        feedback: feedback,
      });
    } catch (error) {
      console.error("Failed to retrieve feedback:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving feedback.",
      });
    }
  });

  // Start the server
  return app.listen();
});
