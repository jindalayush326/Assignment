import http from "../http-common";

class MovieDataService {
  async getAll(page = 0) {
    try {
      const response = await http.get(`/movies?page=${page}`);
      return response.data; // Assuming response.data contains the movies list
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw error; // Rethrow the error for further handling
    }
  }

  async get() {
    try {
      const response = await http.get(`/movies`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  }

  async find(query, by = "name", page = 0) {
    try {
      const response = await http.get(`/movies?${by}=${query}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error finding movies:", error);
      throw error;
    }
  }

  async getReviews() {
    try {
      const response = await http.get(`/movies/review`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  async createReview(data) {
    try {
      const response = await http.post("/movies/review", data);
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  async updateReview(data) {
    try {
      const response = await http.put("/movies/review", data);
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  async deleteReview(id, userId) {
    try {
      const response = await http.delete(`/movies/review?id=${id}`, { data: { user_id: userId } });
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  async getGenres() {
    try {
      const response = await http.get(`/movies/genres`);
      return response.data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  }
}

export default new MovieDataService();
