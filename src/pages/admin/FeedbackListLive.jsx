import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllFeedback } from "../../utils/feedbackStore";
import "../../styles/admin.css";

const FeedbackListLive = () => {
  const [search, setSearch] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        setError("");
        const feedback = await getAllFeedback();
        setFeedbackData(feedback);
      } catch (err) {
        setError(err.message || "Unable to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  const filteredFeedback = feedbackData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="feedback-header">
          <div>
            <h2>User Feedback</h2>
            <p>See what users are saying about EduNexus</p>
          </div>

          <input
            type="text"
            placeholder="Search user..."
            className="feedback-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="no-data">{error}</p>}
        {loading && <p className="no-data">Loading feedback...</p>}

        <div className="feedback-grid">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="feedback-card">
              <div className="feedback-top">
                <div className="avatar-circle">{item.name.charAt(0)}</div>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.email}</p>
                </div>
              </div>

              {item.resourceTitle && <p>Resource: {item.resourceTitle}</p>}

              <div className="rating-display">
                {"*".repeat(item.rating)}
                {"-".repeat(5 - item.rating)}
              </div>

              <p className="feedback-message">"{item.message}"</p>
            </div>
          ))}
        </div>

        {!loading && filteredFeedback.length === 0 && (
          <p className="no-data">No feedback found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeedbackListLive;
