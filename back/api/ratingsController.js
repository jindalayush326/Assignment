const RatingsDAO = require("../dao/ratingsDao");

class RatingsController {
  static async apiGetAllRatings(req, res, next) {
    const { ratingsList, totalNumRatings } = await RatingsDAO.getAllRatings();

    let response = {
      ratings: ratingsList,
      total_results: totalNumRatings,
    };

    res.json(response);
  }
}

// Exporting the RatingsController class using CommonJS syntax
module.exports = RatingsController;
