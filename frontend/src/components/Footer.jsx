import { TrainFront } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-brand">
        <div className="footer-logo">
          <TrainFront size={28} />
        </div>

        <div>
          <strong>Railway Complaint</strong>
          <br />
          <strong>Classification System</strong>
        </div>
      </div>

      <p className="copyright">
        © 2026 Railway Complaint Classification System. All rights reserved.
      </p>

      <div className="footer-links">
        <a href="/#privacy">Privacy Policy</a>
        <span>|</span>
        <a href="/#terms">Terms of Service</a>
        <span>|</span>
        <a href="mailto:support@example.com">Contact</a>
      </div>
    </footer>
  );
}

export default Footer;
