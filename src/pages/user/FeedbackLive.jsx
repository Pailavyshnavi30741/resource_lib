import { useState } from "react";
import UserLayout from "../../components/user/UserLayout";
import { useAuth } from "../../context/AuthContext";
import { submitFeedback } from "../../utils/feedbackStore";
import "../../styles/user.css";

const FeedbackLive = () => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || rating === 0) {
      alert("Please provide rating and feedback.");
      return;
    }

    try {
      setSubmitting(true);
      await submitFeedback({
        name: currentUser?.name || "Anonymous",
        email: currentUser?.email || "",
        rating,
        message,
      });

      alert("Thank you for your feedback!");
      setRating(0);
      setMessage("");
    } catch (err) {
      alert(err.message || "Unable to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="feedback-container">
        <h2>Give Your Feedback</h2>
        <p>Help us improve EduNexus</p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star active" : "star"}
                onClick={() => setRating(star)}
              >
                *
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" className="submit-feedback" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </UserLayout>
  );
};

export default FeedbackLive;
