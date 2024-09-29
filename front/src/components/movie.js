
import React, { useState, useEffect } from "react";
import MovieDataService from "../service/movie";
import { Link } from "react-router-dom";

const Movie = props => {
  const initialMovieState = {
    id: null,
    name: "",
    release_year: "",
    genre: "",
    reviews: []
  };
  const [movie, setMovie] = useState(initialMovieState);

  // Loads the movie
  const getMovie = id => {
    MovieDataService.get(id)
      .then(response => {
        setMovie(response.data);
        // console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // Only calls the getMovie if the id is updated
  useEffect(() => {
    getMovie(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  function editOrAddReview(movie) {
    /** If there is review present can only EDIT, cannot ADD */
    for(let i=0; i<movie.reviews.length; i++) {
      if (props.user && props.user.id === movie.reviews[i].user_id) {
        return "EDIT";
      }
    }
    return "ADD";
  }

  return (
    <div>
      {movie ? (
        <div>
          <h4>{movie.name}</h4>
          <p>
            <strong>Genre: </strong>{movie.genres}<br/>
            <strong>Release Year: </strong>{movie.release_year}<br/>
            <strong>Overview: </strong>{movie.overview + "..."}
          </p>

          { 
            /** If there is review present can only EDIT, cannot ADD */
            editOrAddReview(movie) === "ADD" &&
              <Link 
                to={{
                  pathname: "/movies/" + props.match.params.id + "/review",
                  state:{
                    movie_name: movie.name
                  }
                }} className="btn btn-primary">
                Add Review
              </Link>
          }
          
          <h4> Reviews </h4>
          <div className="row">
            {movie.reviews.length > 0 ? (
             movie.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>Rating: </strong>{review.rating}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date.substring(0,10)}
                       </p>
                       {props.user && props.user.id === review.user_id &&
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link 
                              to={{
                                pathname: "/movies/" + props.match.params.id + "/review",
                                state: {
                                  currentReview: review,
                                  movie_name: movie.name
                                }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No movie selected.</p>
        </div>
      )}
    </div>
  );
};

export default Movie;