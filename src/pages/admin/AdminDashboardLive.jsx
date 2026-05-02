import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  deleteResourceById,
  getAllResources,
  isResourceOwnedByUser,
} from "../../utils/resourceStore";
import { getAllUsers } from "../../utils/userStore";
import "../../styles/admin.css";

const AdminDashboardLive = () => {
  const { currentUser } = useAuth();
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("All");
  const [dashboardData, setDashboardData] = useState({
    resources: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [resources, users] = await Promise.all([
          getAllResources(),
          getAllUsers(),
        ]);

        setDashboardData({ resources, users });
      } catch (err) {
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const { resources, users } = dashboardData;
  const ownedResources = resources.filter((resource) =>
    isResourceOwnedByUser(resource, currentUser)
  );
  const manageableResources = ownedResources.length > 0 ? ownedResources : resources;
  const filteredOwnedResources = manageableResources.filter((resource) => {
    const matchesSearch = [resource.title, resource.subject, resource.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(resourceSearch.toLowerCase());

    const matchesCategory =
      resourceFilter === "All" || (resource.subject || "General") === resourceFilter;

    return matchesSearch && matchesCategory;
  });
  const totalResources = resources.length;
  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const activeCategories = new Set(
    resources.map((resource) => (resource.subject || "General").trim()).filter(Boolean)
  ).size;

  const categoryCounts = resources.reduce((counts, resource) => {
    const subject = (resource.subject || "General").trim() || "General";
    counts[subject] = (counts[subject] || 0) + 1;
    return counts;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);

  const largestCategoryCount = topCategories[0]?.[1] || 1;

  const recentResources = [...resources]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3)
    .map((resource) => `New resource uploaded: "${resource.title}"`);

  const recentUsers = [...users]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 2)
    .map((user) => `New user registered: ${user.name}`);

  const recentActivity = [...recentResources, ...recentUsers].slice(0, 5);
  const resourceCategories = [
    "All",
    ...new Set(manageableResources.map((resource) => resource.subject || "General")),
  ];

  const handleDeleteResource = async (resourceId) => {
    try {
      await deleteResourceById(resourceId);
      setDashboardData((currentData) => ({
        ...currentData,
        resources: currentData.resources.filter((resource) => resource.id !== resourceId),
      }));
    } catch (err) {
      setError(err.message || "Unable to delete resource.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="admin-title">Dashboard Overview</h1>

        {error && <p className="no-data">{error}</p>}
        {loading && <p className="no-data">Loading live dashboard data...</p>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Resources</h3>
            <p className="stat-number">{totalResources}</p>
            <span className="stat-growth positive">Live count from uploaded resources</span>
          </div>

          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{totalUsers}</p>
            <span className="stat-growth positive">Live count from registered accounts</span>
          </div>

          <div className="stat-card">
            <h3>Admin Accounts</h3>
            <p className="stat-number">{adminUsers}</p>
            <span className="stat-growth neutral">Users with admin role</span>
          </div>

          <div className="stat-card">
            <h3>Active Categories</h3>
            <p className="stat-number">{activeCategories}</p>
            <span className="stat-growth positive">Distinct resource subjects</span>
          </div>
        </div>

        <div className="admin-section">
          <h2>Recent Activity</h2>

          <ul className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => <li key={activity}>{activity}</li>)
            ) : (
              <li>No live activity yet.</li>
            )}
          </ul>
        </div>

        <div className="admin-section">
          <h2>Top Categories</h2>

          <div className="category-stats">
            {topCategories.length > 0 ? (
              topCategories.map(([category, count]) => (
                <div key={category}>
                  <span>
                    {category} ({count})
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.max((count / largestCategoryCount) * 100, 10)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No category data available yet.</p>
            )}
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>My Uploaded Resources</h2>
              <p className="page-subtitle">
                Edit or delete your uploaded resources. If uploader info is missing from the API,
                all resources are shown so you can still manage them.
              </p>
            </div>
            <Link to="/admin/upload" className="secondary-btn">
              Add New
            </Link>
          </div>

          <div className="table-controls">
            <input
              type="text"
              placeholder="Search resource..."
              className="search-input"
              value={resourceSearch}
              onChange={(event) => setResourceSearch(event.target.value)}
            />

            <select
              className="filter-select"
              value={resourceFilter}
              onChange={(event) => setResourceFilter(event.target.value)}
            >
              {resourceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {manageableResources.length > 0 ? (
            <div className="table-card admin-resource-table">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwnedResources.map((resource) => (
                    <tr key={resource.id}>
                      <td>{resource.title}</td>
                      <td>{resource.subject || "General"}</td>
                      <td>{resource.type || "File"}</td>
                      <td>
                        <Link
                          to={`/admin/resources/${resource.id}/edit`}
                          className="table-action-link"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="delete-btn resource-delete-btn"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOwnedResources.length === 0 && (
                <p className="no-data">No resources match the current filter.</p>
              )}
            </div>
          ) : (
            <p className="no-data">
              No resources were found yet.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardLive;
