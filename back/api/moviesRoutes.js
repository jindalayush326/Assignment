const express = require("express");
const MoviesController = require("./moviesController.js");
const ReviewsController = require("./reviewscontroller.js");
const RatingsController = require("./ratingsController.js");

const router = express.Router();

router
  .route("/")
  .get(MoviesController.apiGetMovies);

/** Return movie by id */
router.route("/id/:id").get(MoviesController.apiGetMovieById);

/** Return a list of genres */
router.route("/genres").get(MoviesController.apiGetMovieGenres);

router.route("/postmovies").post(MoviesController.apiPostMovie);

router
  .route("/review")
  .get(ReviewsController.apiGetAllReviews)
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview);



router
  .route("/ratings")
  .get(RatingsController.apiGetAllRatings);

module.exports = router;
