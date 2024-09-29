

import React, { useState, useEffect } from "react";
import MovieDataService from "../service/movie";
import { Link } from "react-router-dom";

const MovieRec = props => {
	const [movies, setMovies] = useState([]);

	/**Tells React what to do after rendering */
	useEffect(() => {
		retrieveMovies();
	}, []);

  const retrieveMovies = () => {
    MovieDataService.getAll()
			.then(response => {
				console.log(response.data.movies.slice(6));
				setMovies(response.data.movies.slice(6));
			})
			.catch(e => {
				console.log(e);
			});
  };

  return (
    <div>
    <h1>Movie Recommendations</h1>
		{/* Movie list displays */}
			<div className="row">
				{movies.map((movie, index) => {
					return (
						<div key={index} className="col-lg-4 pb-1">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">{movie.name}</h5>
									<p className="card-text">
										<strong>Genre: </strong>{movie.genres}<br/>
										<strong>Year: </strong>{movie.release_year}<br/>
										<strong>Overview: </strong>{movie.overview.substr(0,80) + "..."}
									</p>
									<div className="row">
									<Link 
										to={"/movies/"+movie._id} 
										className="btn btn-primary col-lg-5 mx-1 mb-1">
										View Reviews
									</Link>
									<a 
										href={"https://www.imdb.com/title/"+movie.imdb_id}
										target="_blank" 
										rel="noopener noreferrer"
										className="btn btn-primary col-lg-5 mx-1 mb-1">
										IMDB
									</a>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
    </div>
  );

}

export default MovieRec;