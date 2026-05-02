import { useState } from "react";
import UserLayout from "../../components/user/UserLayout";
import "../../styles/user.css";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message || rating === 0) {
      alert("Please provide rating and feedback.");
      return;
    }

    alert("Thank you for your feedback! 🎉");

    setRating(0);
    setMessage("");
  };

  return (
    <UserLayout>
      <div className="feedback-container">
        <h2>Give Your Feedback</h2>
        <p>Help us improve EduNexus 🚀</p>

        <form onSubmit={handleSubmit} className="feedback-form">

          {/* Star Rating */}
          <div className="rating">
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star active" : "star"}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Message */}
          <textarea
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" className="submit-feedback">
            Submit Feedback
          </button>
        </form>
      </div>
    </UserLayout>
  );
};

export default Feedback;