const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let reviews;

class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.MOVIEREVIEWS_DB_URI).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addReview(movieId, movie_name, user, rating, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        rating: rating,
        text: review,
        movie_id: ObjectId(movieId),
        movie_name: movie_name
      };

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async updateReview(reviewId, userId, rating, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId) },
        { $set: { text: text, rating: rating, date: date } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }

  static async getAllReviews({
    page = 0,
    reviewsPerPage = 30,
  } = {}) {
    /** Find all reviews */
    let cursor;
    try {
      cursor = await reviews.find();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return { reviewsList: [], totalNumReviews: 0 };
    }

    /** Limit reviews per page, skip to get to actual page number */
    const displayCursor = cursor.limit(reviewsPerPage).skip(reviewsPerPage * page);

    try {
      /** Set review list to an array and then return the array */
      const reviewsList = await displayCursor.toArray();
      const totalNumReviews = await reviews.countDocuments();

      return { reviewsList, totalNumReviews };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { reviewsList: [], totalNumReviews: 0 };
    }
  }
}

module.exports = ReviewsDAO; // Export the class using CommonJS syntax
