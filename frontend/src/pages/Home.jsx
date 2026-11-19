import { Link } from "react-router-dom";
import "./Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import {
  Pencil,
  Search,
  ShieldCheck,
  Clock,
  Users,
  Brain,
  MonitorCheck,
  ArrowRight,
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: <ShieldCheck size={32} />,
      title: "AI-Powered Classification",
      description:
        "Complaints are automatically categorised for faster action.",
    },
    {
      icon: <Clock size={32} />,
      title: "Track in Real Time",
      description: "Stay updated on your complaint status anytime, anywhere.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Transparent Process",
      description: "Get clear updates and resolution details.",
    },
    {
      icon: <Users size={32} />,
      title: "Better Railways",
      description: "Your feedback helps us improve services for everyone.",
    },
  ];

  const steps = [
    {
      number: "1",
      icon: <Pencil size={35} />,
      title: "Submit Your Complaint",
      description:
        "Fill in the details about your journey and the issue you faced.",
    },
    {
      number: "2",
      icon: <Brain size={35} />,
      title: "AI Classification",
      description:
        "Our system analyses the complaint and predicts the category using ML.",
    },
    {
      number: "3",
      icon: <MonitorCheck size={35} />,
      title: "Track & Get Updates",
      description:
        "Use your complaint ID to track the status and receive timely updates.",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-main">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-label">YOUR VOICE BUILDS A BETTER RAILWAY</p>

            <h1>
              Railway Complaint
              <span>Classification System</span>
            </h1>

            <p className="hero-description">
              Report issues, track your complaints, and help us improve your
              railway journey. Our system uses AI to classify complaints and
              ensure faster resolution.
            </p>

            <div className="hero-buttons">
              <Link to="/submit-complaint" className="hero-primary-btn">
                <Pencil size={21} />
                Submit a Complaint
              </Link>

              <Link to="/track-complaint" className="hero-secondary-btn">
                <Search size={21} />
                Track Complaint
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section" id="about">
          {features.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-icon">{feature.icon}</div>

              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="how-section">
          <div className="section-heading">
            <p className="section-label">HOW IT WORKS</p>
            <h2>It's Simple. Just 3 Steps.</h2>
          </div>

          <div className="steps-container">
            {steps.map((step, index) => (
              <div className="step-item" key={index}>
                <div className="step-top">
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon">{step.icon}</div>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>

                {index !== 2 && <ArrowRight className="step-arrow" size={21} />}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
