import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/admin.css";

const FeedbackList = () => {
  const [search, setSearch] = useState("");

  const feedbackData = [
    { id: 1, name: "Akash", rating: 5, message: "Very helpful notes!" },
    { id: 2, name: "Rahul", rating: 3, message: "Please upload more OS content." },
    { id: 3, name: "Sneha", rating: 4, message: "Great resource library." },
    { id: 4, name: "Priya", rating: 5, message: "Amazing UI and experience!" },
  ];

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

        <div className="feedback-grid">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="feedback-card">
              <div className="feedback-top">
                <div className="avatar-circle">
                  {item.name.charAt(0)}
                </div>
                <h4>{item.name}</h4>
              </div>

              <div className="rating-display">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>

              <p className="feedback-message">
                "{item.message}"
              </p>
            </div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <p className="no-data">No feedback found.</p>
        )}

      </div>
    </AdminLayout>
  );
};

export default FeedbackList;