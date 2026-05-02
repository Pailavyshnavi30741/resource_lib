import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/admin.css";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="admin-title">Dashboard Overview</h1>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Resources</h3>
            <p className="stat-number">124</p>
            <span className="stat-growth positive">+12% this month</span>
          </div>

          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">842</p>
            <span className="stat-growth positive">+8% this month</span>
          </div>

          <div className="stat-card">
            <h3>Feedback Submitted</h3>
            <p className="stat-number">67</p>
            <span className="stat-growth neutral">Stable</span>
          </div>

          <div className="stat-card">
            <h3>Active Categories</h3>
            <p className="stat-number">6</p>
            <span className="stat-growth positive">+2 new</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-section">
          <h2>Recent Activity</h2>

          <ul className="activity-list">
            <li>📘 New resource uploaded: "Advanced React Patterns"</li>
            <li>👤 New user registered: Sneha</li>
            <li>⭐ Feedback received for "Business Strategy Guide"</li>
            <li>📊 Category "Aptitude" updated</li>
          </ul>
        </div>

        {/* Top Categories */}
        <div className="admin-section">
          <h2>Top Categories</h2>

          <div className="category-stats">
            <div>
              <span>Coding</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "80%" }}></div>
              </div>
            </div>

            <div>
              <span>Business</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div>
              <span>Mathematics</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "55%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;