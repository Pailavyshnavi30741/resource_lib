import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-overlay">
        <div className="footer-content">

          {/* Column 1 */}
          <div className="footer-column">
            <h2>EduNexus</h2>
            <p>Your digital gateway to structured educational resources.</p>
          </div>

          {/* Column 2 */}
          <div className="footer-column">
            <h3>Categories</h3>
            <ul>
              <li>Coding</li>
              <li>Business</li>
              <li>Mathematics</li>
              <li>Languages</li>
              <li>Aptitude</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>Email: support@edunexus.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: India</p>
          </div>

          {/* Column 4 */}
          <div className="footer-column">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <span>📘</span>
              <span>📸</span>
              <span>🐦</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 EduNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;