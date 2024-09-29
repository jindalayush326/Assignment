import React, { useState, useEffect } from "react";
import MovieDataService from "../service/movie";
import { Link } from "react-router-dom";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchReleaseYear, setSearchReleaseYear] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [genres, setGenres] = useState(["All Genres"]);

  useEffect(() => {
    retrieveMovies();
    retrieveGenres();
  }, []);

  const onChangeSearchName = (e) => {
    setSearchName(e.target.value);
  };

  const onChangeSearchReleaseYear = (e) => {
    setSearchReleaseYear(e.target.value);
  };

  const onChangeSearchGenre = (e) => {
    setSearchGenre(e.target.value);
  };

  const retrieveMovies = () => {
    MovieDataService.getAll()
      .then((response) => {
        console.log("API Response:", response);  // Log response for debugging
        console.log(response.movies[0])
        if ( response.movies) {
          setMovies(response.movies);  // Set the movies array from the response
        } else {
          console.error("Movies data is not in the expected format:", response);
          setMovies([]);  // If format is incorrect, reset movies array
        }
      })
      .catch((e) => {
        console.log("Error fetching movies:", e);
      });
  };

  const retrieveGenres = () => {
    MovieDataService.getGenres()
      .then((response) => {
        console.log("Genres Response:", response); // Log genres response
        setGenres(["All Genres", ...response.data || []]); // Set genres
      })
      .catch((e) => {
        console.log("Error fetching genres:", e);
      });
  };

  const refreshList = () => {
    retrieveMovies();
  };

  const find = (query, by) => {
    MovieDataService.find(query, by)
      .then((response) => {
        console.log("Find Response:", response); // Log find response
        if (response.data && response.data.movies) {
          setMovies(response.data.movies); // Set movies state
        } else {
          console.error("Find response is not in the expected format:", response);
          setMovies([]); // Prevent further errors
        }
      })
      .catch((e) => {
        console.log("Error finding movies:", e);
      });
  };

  const findByName = () => {
    find(searchName, "name");
  };

  const findByReleaseYear = () => {
    find(searchReleaseYear, "release_year");
  };

  const findByGenre = () => {
    if (searchGenre === "All Genres") {
      refreshList();
    } else {
      find(searchGenre, "genre");
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Release Year"
            value={searchReleaseYear}
            onChange={onChangeSearchReleaseYear}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByReleaseYear}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchGenre}>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre.substr(0, 20)}
              </option>
            ))}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByGenre}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Movie list displays */}
      <div className="row">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={index} className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  <p className="card-text">
                    <strong>Genre: </strong>{movie.genre}<br />
                    <strong>Year: </strong>{movie.release_year}<br />
                    <strong>Overview: </strong>{movie.description.substr(0, 80) + "..."}
                  </p>
                  <div className="row">
                    <Link
                      to={"/movies/" + movie._id}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Reviews
                    </Link>
                    <a
                      href={"https://www.imdb.com/title/" + movie.imdb_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      IMDB
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
