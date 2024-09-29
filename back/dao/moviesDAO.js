const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

/** Stores reference to our database */
let movies;

class MoviesDAO {
  /** Call this method as soon as the server starts to get a reference to our DB */
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      // Ensure the correct database name is passed in the env variable MOVIEREVIEWS_NS
      movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("metadata");
    } catch (e) {
      console.error(`Unable to establish a collection handle in MoviesDAO: ${e}`);
    }
  }

  /** Function to retrieve movies with filters, pagination, and search */
  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
  } = {}) {
    let query = {};

    if (filters) {
      // Filter by name using MongoDB's text search, ensure text index is created
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
      // Filter by exact release year
      else if ("release_year" in filters) {
        query = { release_year: { $eq: filters["release_year"] } };
      }
      // Filter by genre (assuming $text index is also set up on genre field)
      else if ("genre" in filters) {
        query = { $text: { $search: filters["genre"] } };
      }
    }

    let cursor;
    try {
      /** Perform query on the 'movies' collection */
      cursor = await movies.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }

    // Pagination: limit and skip for pagination
    const displayCursor = cursor.limit(moviesPerPage).skip(moviesPerPage * page);

    try {
      // Convert the cursor into an array and get the total number of results
      const moviesList = await displayCursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);

      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
  }

  /** Function to retrieve a movie by its ID */
  static async getMovieByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$movie_id", "$$id"],
                  },
                },
              },
              {
                $sort: { date: -1 },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      return await movies.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getMovieByID: ${e}`);
      throw e;
    }
  }

  /** Function to add a new movie to the collection */
  static async addMovie(movie) {
    try {
      const response = await movies.insertOne(movie);
      return response;
    } catch (e) {
      console.error(`Unable to post movie: ${e}`);
      throw e;
    }
  }

  /** Function to get distinct genres */
  static async getGenres() {
    let genres = [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama',
      'Family', 'Fantasy', 'Foreign', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
      'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
    ];
    try {
      // If needed, you can use distinct() to fetch unique genres dynamically
      // genres = await movies.distinct("genre");
      return genres;
    } catch (e) {
      console.error(`Unable to get genres, ${e}`);
      return genres;
    }
  }
}

module.exports = MoviesDAO;
