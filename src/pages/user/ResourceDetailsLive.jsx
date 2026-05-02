import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserLayout from "../../components/user/UserLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getAverageRating,
  getFeedbackForResource,
  submitFeedback,
} from "../../utils/feedbackStore";
import { getResourceById } from "../../utils/resourceStore";
import "../../styles/user.css";

const ResourceDetailsLive = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [resource, setResource] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [resourceData, feedbackData] = await Promise.all([
          getResourceById(id),
          getFeedbackForResource(id),
        ]);
        setResource(resourceData);
        setFeedbackItems(feedbackData);
      } catch (err) {
        console.error(err);
        setResource(null);
        setFeedbackItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const averageRating = getAverageRating(feedbackItems);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim() || rating === 0 || !resource) {
      alert("Please add both a rating and feedback.");
      return;
    }

    try {
      setIsSubmitting(true);
      const savedFeedback = await submitFeedback({
        name: currentUser?.name || "Anonymous",
        email: currentUser?.email || "",
        resourceId: Number(resource.id),
        resourceTitle: resource.title,
        rating,
        message,
      });

      setFeedbackItems((currentItems) => [savedFeedback, ...currentItems]);
      setMessage("");
      setRating(0);
      alert("Your resource feedback has been submitted.");
    } catch (err) {
      alert(err.message || "Unable to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
const downloadUrl = `https://resourcelibrary-backend-production.up.railway.app/api/resources/download/${resource.id}`;
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.title || 'resource';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download the resource: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="resource-details resource-details-card">
          <h1 className="page-title">Loading Resource</h1>
          <p>Please wait while we fetch the resource details.</p>
        </div>
      </UserLayout>
    );
  }

  if (!resource) {
    return (
      <UserLayout>
        <div className="resource-details resource-details-card">
          <h1 className="page-title">Resource Not Found</h1>
          <p>This resource does not exist or was removed.</p>
          <Link to="/home" className="primary-btn" style={{ width: "fit-content" }}>
            Back to Dashboard
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="resource-details">
        <h1 className="page-title">{resource.title}</h1>

        <div className="resource-info resource-details-card">
          <span className="resource-pill">{resource.subject}</span>

          <div className="resource-details-meta">
            <p><strong>Type:</strong> {resource.type}</p>
            <p><strong>Access:</strong> Download from the link below</p>
            <p>
              <strong>Average Rating:</strong>{" "}
              {feedbackItems.length > 0 ? `${averageRating.toFixed(1)} / 5` : "No ratings yet"}
            </p>
            <p><strong>Total Reviews:</strong> {feedbackItems.length}</p>
          </div>

          <button className="primary-btn" onClick={handleDownload}>
            Download Resource
          </button>
        </div>

        <div className="feedback-section resource-details-card">
          <h3>Rate This Resource</h3>
          <form onSubmit={handleSubmit}>
            <div className="rating" style={{ marginBottom: "12px" }}>
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
              className="feedback-input"
              placeholder="Write your feedback..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>

        <div className="feedback-section resource-details-card">
          <h3>What Other Users Said</h3>
          {feedbackItems.length === 0 ? (
            <p>No reviews yet for this resource.</p>
          ) : (
            feedbackItems.map((item) => (
              <div key={item.id} style={{ marginBottom: "16px" }}>
                <p>
                  <strong>{item.name}</strong> rated it {item.rating}/5
                </p>
                <p>{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default ResourceDetailsLive;
