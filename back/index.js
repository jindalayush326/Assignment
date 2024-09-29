const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const MoviesController = require("./api/moviesController");
const MoviesDAO = require("./dao/moviesDAO");

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json()); // Middleware to parse incoming requests with JSON payloads

const uri = process.env.MOVIEREVIEWS_DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = process.env.PORT || 5000;

async function startApp() {
  try {
    // Connect to MongoDB
    await client.connect();
    await MoviesDAO.injectDB(client); // Pass the connected client to the DAO

    // Define API routes
    app.get("/api/v1/movies", MoviesController.apiGetMovies);
    app.get("/api/v1/movies/id/:id", MoviesController.apiGetMovieById);
    app.post("/api/v1/movies", MoviesController.apiPostMovie);
    app.get("/api/v1/genres", MoviesController.apiGetMovieGenres);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1); // Exit if connection to MongoDB fails
  }
}

startApp();
