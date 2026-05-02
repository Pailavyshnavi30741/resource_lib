import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/UserLayout";
import { buildResourceRatingsMap } from "../../utils/resourceRatings";
import { getAllResources } from "../../utils/resourceStore";
import "../../styles/user.css";

const SearchLive = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [resourceRatings, setResourceRatings] = useState({});
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");

    Promise.all([getAllResources(), buildResourceRatingsMap()])
      .then(([resourceData, ratingData]) => {
        setResources(Array.isArray(resourceData) ? resourceData : []);
        setResourceRatings(ratingData);
      })
      .catch((err) => {
        console.error(err);
        setResources([]);
        setResourceRatings({});
        setErrorMessage("Unable to load resources right now.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(resources.map((resource) => resource.subject).filter(Boolean)),
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.subject === selectedCategory;

    const searchableText = [resource.title, resource.subject, resource.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(query.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <UserLayout>
      <section className="resource-dashboard">
        <h1 className="resource-heading">Search Resources</h1>

        <input
          type="text"
          placeholder="Search by title, subject, type..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="search-toolbar">
          <p className="search-results-count">
            {isLoading
              ? "Loading resources..."
              : `${filteredResources.length} resource${
                  filteredResources.length === 1 ? "" : "s"
                } found`}
          </p>

          {(query || selectedCategory !== "All") && (
            <button
              type="button"
              className="search-reset-btn"
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="resource-category-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`resource-category-btn ${
                selectedCategory === cat ? "active-category" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="resource-grid">
          {errorMessage ? (
            <p className="search-empty-state">{errorMessage}</p>
          ) : isLoading ? (
            <p className="search-empty-state">Fetching resources...</p>
          ) : filteredResources.length === 0 ? (
            <p className="search-empty-state">
              No resources matched your search. Try another keyword or category.
            </p>
          ) : (
            filteredResources.map((resource) => {
              const ratingSummary = resourceRatings[resource.id];

              return (
                <article key={resource.id} className="resource-tile">
                  <span className="resource-pill">{resource.subject || "General"}</span>
                  <h3>{resource.title}</h3>

                  <div className="resource-meta-row">
                    <span>{resource.type || "File"}</span>
                  </div>

                  <p>
                    {ratingSummary
                      ? `Rating: ${ratingSummary.average.toFixed(1)}/5 (${ratingSummary.count} reviews)`
                      : "Rating: No reviews yet"}
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => navigate(`/resource/${resource.id}`)}
                  >
                    View Details
                  </button>
                </article>
              );
            })
          )}
        </div>
      </section>
    </UserLayout>
  );
};

export default SearchLive;
