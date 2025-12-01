import React from "react";
import { useNavigate } from "react-router-dom";
import "../Stylesheets/landing.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            Transform Your <span>Excel Data</span> into Insights
          </h1>
          <p>
            Upload spreadsheets, analyze patterns, and create stunning
            visualizations effortlessly with AI-powered analytics.
          </p>
          <button className="cta-btn" onClick={() => navigate("/login")}>
            🚀 Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose ExcelAnalytics?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon1">📊</div>
            <h3>Instant Charts</h3>
            <p>Turn rows and columns into beautiful, interactive dashboards.</p>
          </div>
          <div className="feature-card">
            <div className="icon1">⚡</div>
            <h3>Fast Analysis</h3>
            <p>MERN-powered backend crunches Excel files in seconds.</p>
          </div>
          <div className="feature-card">
            <div className="icon1">🔒</div>
            <h3>Enterprise Security</h3>
            <p>Your data stays encrypted and private at every step.</p>
          </div>
          <div className="feature-card">
            <div className="icon1">🎨</div>
            <h3>Beautiful Visuals</h3>
            <p>Modern chart styles that make insights presentation-ready.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} <span>ExcelAnalytics</span> • Crafted
          with ❤️
        </p>
      </footer>
    </div>
  );
}
