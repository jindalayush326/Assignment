const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let ratings;

class RatingsDAO {
  static async injectDB(conn) {
    if (ratings) {
      return;
    }
    try {
      ratings = await conn.db(process.env.MOVIEREVIEWS_DB_URI).collection("ratings");
    } catch (e) {
      console.error(`Unable to establish collection handles in RatingsDAO: ${e}`);
    }
  }

  static async getAllRatings() {
    /** Find all ratings */
    let cursor;
    try {
      cursor = await ratings.find();
    } catch (e) {
      console.error(`Unable to get ratings: ${e}`);
      return { ratingsList: [], totalNumRatings: 0 };
    }

    try {
      /** Set rating list to an array and then return the array */
      const ratingsList = await cursor.toArray();
      const totalNumRatings = await ratings.countDocuments();

      return { ratingsList, totalNumRatings };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { ratingsList: [], totalNumRatings: 0 };
    }
  }
}

// Exporting the RatingsDAO class using CommonJS syntax
module.exports = RatingsDAO;
