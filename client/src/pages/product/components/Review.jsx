import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import styles from "./Review.module.scss";

import Message from "../../../components/ui/Message";
import Rating from "../../../components/Rating";
import { formatRelativeDate } from "../../../utilities/formaters";
import { useSelector } from "react-redux";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import {
  useCreateReviewMutation,
  useGetProductReviewsQuery,
} from "../../../redux/products/productsApiSlice";

function Review() {
  const params = useParams();
  const location = useLocation();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLogedIn = !!userInfo;

  const from = location.pathname;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: { reviews } = {},
    error: fetchError,
    refetch,
  } = useGetProductReviewsQuery(params.id);

  const [createReview, { isLoading, error }] = useCreateReviewMutation();

  async function submitHandler(e) {
    e.preventDefault();

    try {
      await createReview({
        id: params.id,
        data: { rating, comment },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
    setRating(0);
    setComment("");
  }

  return (
    <div className={styles.review}>
      <div className={styles["review-form"]}>
        <h1>Write a review</h1>

        {error && (
          <ErrorMessage>{error.data.message || error.message}</ErrorMessage>
        )}

        {isLogedIn ? (
          <form onSubmit={submitHandler}>
            <div className={styles["form-group"]}>
              <label>Rating</label>
              <select
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              >
                <option value="" hidden>
                  Select
                </option>
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label>Comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>

            <button disabled={isLoading}>Submit</button>
          </form>
        ) : (
          <Message>
            Please,{" "}
            <Link
              className={styles["link-btn"]}
              to={`/login?redirect=${from}`}
              state={{ from }}
            >
              sign in
            </Link>{" "}
            to write a review
          </Message>
        )}
      </div>

      <div className={styles["review-list"]}>
        <h1>reviews</h1>

        {reviews && reviews.length < 1 && <Message>No Reviews</Message>}

        {fetchError && (
          <ErrorMessage>
            {fetchError.data.message || fetchError.message}
          </ErrorMessage>
        )}

        <ul>
          {reviews &&
            reviews.map((review) => (
              <li key={review._id}>
                <strong>{review.user.name}</strong>
                <Rating className={styles.rating} value={review.rating} />
                <span>
                  {formatRelativeDate(new Date(`${review.createdAt}`)) ===
                    "now" && "Just "}
                  {formatRelativeDate(new Date(`${review.createdAt}`))}
                </span>
                <p>{review.comment}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Review;
