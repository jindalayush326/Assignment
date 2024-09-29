
import React, { useState } from "react";
import MovieDataService from "../service/movie";
import { Link } from "react-router-dom";

const AddReview = props => {
  let initialReviewState = ""
	let initialRatingState = ""

  let editing = false;

  if (props.location.state && props.location.state.currentReview){
    editing = true;
    initialReviewState = props.location.state.currentReview.text
		initialRatingState = props.location.state.currentReview.rating
  }

  const [review, setReview] = useState(initialReviewState);
	const [rating, setRating] = useState(initialRatingState);
  const [submitted, setSubmitted] = useState(false);

  const handleReviewChange = event => {
    setReview(event.target.value);
  };

	const handleRatingChange = event => {
    setRating(event.target.value);
  };

  const saveReview = () => {
    // console.log(props)
    var data = {
			text: review,
			rating: rating,
			name: props.user.name,
			user_id: props.user.id,
			movie_id: props.match.params.id,
      movie_name: props.location.state.movie_name
    };

    if (editing) {
      data.review_id = props.location.state.currentReview._id
      MovieDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      MovieDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/movies/"} className="btn btn-success mx-1">
              Back to Home
            </Link>
            <Link to={"/movies/" + props.match.params.id} className="btn btn-success mx-1">
              Back to {props.location.state.movie_name}
            </Link>
            <Link to={"/movies/reviews"} className="btn btn-success">
              Back to Reviews
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <h4>Movie Review for {props.location.state.movie_name}</h4>
            </div>
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleReviewChange}
                name="text"
              />
            </div>
						<div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Rating (out of 5)</label>
              <input
                type="number"
								min="0"
								max="5"
                className="form-control"
                id="text"
                required
                value={rating}
                onChange={handleRatingChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;