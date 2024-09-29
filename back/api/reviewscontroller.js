const ReviewsDAO = require("../dao/reviewsDAO");

class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id;
      const movie_name = req.body.movie_name;
      const rating = req.body.rating;
      const review = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();

      const ReviewResponse = await ReviewsDAO.addReview(
        movieId,
        movie_name,
        userInfo,
        rating,
        review,
        date
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const rating = req.body.rating;
      const text = req.body.text;
      const date = new Date();

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        rating,
        text,
        date
      );

      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      const userId = req.body.user_id;
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetAllReviews(req, res, next) {
    const reviewsPerPage =
      req.query.reviewsPerPage ? parseInt(req.query.reviewsPerPage, 10) : 30;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    const { reviewsList, totalNumReviews } = await ReviewsDAO.getAllReviews({
      page,
      reviewsPerPage,
    });

    let response = {
      reviews: reviewsList,
      page: page,
      entries_per_page: reviewsPerPage,
      total_results: totalNumReviews,
    };

    res.json(response);
  }
}

// Exporting the ReviewsController class using CommonJS syntax
module.exports = ReviewsController;
