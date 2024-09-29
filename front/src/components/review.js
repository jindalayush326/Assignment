import React, { useState, useEffect } from "react";
import MovieDataService from "../service/movie";
import { Link } from "react-router-dom";

const Reviews = props => {

	const [reviews, setReviews] = useState([]);

  	/**Tells React what to do after rendering */
	useEffect(() => {
		retrieveReviews();
	}, );


  const retrieveReviews = () => {
    MovieDataService.getReviews()
			.then(response => {
				console.log(response.data);
				setReviews(response.data.reviews);
			})
			.catch(e => {
				console.log(e);
			});
  };

  return (
    <div>
			<h1>Reviews</h1>
			<div className="row">
				{reviews.map((review, index) => {
					return (
						<div className="col-lg-4 pb-1" key={index}>
							<div className="card">
								<div className="card-body">
									<p className="card-text">
										{/* ISSUE HERE */}
										<strong>Movie: </strong>{review.movie_name} <br/>
										<strong>Review: </strong>{review.text}<br/>
										<strong>Rating: </strong>{review.rating}<br/>
										<strong>User: </strong>{review.name}<br/>
										<strong>Date: </strong>{review.date.substring(0,10)}
									</p>
										<div className="row">
											{/* <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a> */}
											<Link to={{
												pathname: "/movies/" + props.match.params.id + "/review",
												state: {
													currentReview: review,
													movie_name: review.movie_name
												}
											}} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
										</div>                   
								</div>
							</div>
						</div>
					);
					})
				}
			</div>
		</div>
  );
};

  
export default Reviews;