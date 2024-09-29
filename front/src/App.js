import React from "react";
import { Route, Link, Routes } from "react-router-dom";

import AddReview from "./components/addReview";
import Login from "./components/login";
import Movie from "./components/movie";
import MoviesList from "./components/movieList";
import Reviews from "./components/review";
import MovieRecs from "./components/movieRecommendation";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/movies" className="navbar-brand">
          Movie Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/movies"} className="nav-link">
              Movies
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <a href="/#" onClick={logout} className="nav-link" style={{ cursor: "pointer" }}>
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
          <li>
            {user && (
              <Link to={"/movies/reviews"} className="nav-link">
                Reviews
              </Link>
            )}
          </li>
          <li>
            {user && (
              <Link to={"/movies/movierecs"} className="nav-link">
                Movie Recs
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/movies/reviews" element={<Reviews />} />
          <Route path="/movies/movierecs" element={<MovieRecs />} />
          <Route
            path="/movies/:id/review"
            element={<AddReview user={user} />}
          />
          <Route path="/movies/:id" element={<Movie user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
