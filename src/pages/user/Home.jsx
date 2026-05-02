import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/UserLayout";
import "../../styles/user.css";
import { getAllResources } from "../../utils/resourceStore";

const Home = () => {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  const resourceCategories = [
    "All",
    ...new Set(resources.map((resource) => resource.subject).filter(Boolean)),
  ];

  const banners = [
    {
      title: "Master Modern Coding",
      subtitle: "Build real-world applications with structured coding resources",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      title: "Business & Strategy Essentials",
      subtitle: "Learn finance, management and growth strategies",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    },
    {
      title: "Aptitude & Interview Preparation",
      subtitle: "Prepare confidently with curated practice materials",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    },
  ];

  // 🔷 Fetch resources
  useEffect(() => {
    getAllResources()
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setResources([]);
      });
  }, []);

  // 🔷 Banner auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // 🔷 Filter
  const filteredResources =
    selectedCategory === "All"
      ? resources
      : resources.filter(
          (resource) => resource.subject === selectedCategory
        );

  return (
    <UserLayout>
      <section className="resource-dashboard">

        {/* 🔷 Banner */}
        <div
          className="highlight-banner"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${banners[currentSlide].image})`,
          }}
        >
          <div className="banner-left">
            <h2>{banners[currentSlide].title}</h2>
            <p>{banners[currentSlide].subtitle}</p>
            <button className="primary-btn">Explore Now</button>

            <div className="banner-dots">
              {banners.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    currentSlide === index ? "active-dot" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 🔷 Heading */}
        <h1 className="resource-heading">Explore Educational Resources</h1>

        {/* 🔷 Categories */}
        <div className="resource-category-row">
          {resourceCategories.map((category) => (
            <button
              key={category}
              className={`resource-category-btn ${
                selectedCategory === category ? "active-category" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 🔷 Resources Grid */}
        <div className="resource-grid">
          {filteredResources.length === 0 ? (
            <p>No resources found</p>
          ) : (
            filteredResources
              .slice(0, 5) // 🔥 LIMIT TO 5 CARDS
              .map((resource) => (
                <article key={resource.id} className="resource-tile">
                  <span className="resource-pill">
                    {resource.subject}
                  </span>

                  <h3>{resource.title}</h3>

                  <div className="resource-meta-row">
                    <span>📄 {resource.type}</span>
                  </div>

                  {/* 🔥 FIXED BUTTON */}
                  <button
                    className="primary-btn"
                    onClick={() => navigate(`/resource/${resource.id}`)}
                  >
                    View Details
                  </button>
                </article>
              ))
          )}
        </div>

        {/* 🔷 View All Button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="primary-btn"
            onClick={() => navigate("/search")}
          >
            View All Resources
          </button>
        </div>

      </section>
    </UserLayout>
  );
};

export default Home;
