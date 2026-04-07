import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Stylesheets/landing.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <div className="landing-frame">
        <header className="landing-topbar">
          <div className="landing-brand">
            <span className="landing-brand-dot" aria-hidden="true">◉</span>
            <span className="landing-brand-name">Secondbrain</span>
            <span className="landing-brand-sub">/ITD</span>
          </div>

          <nav className="landing-nav" aria-label="Main navigation">
            <button type="button">Home</button>
            <button type="button">Features</button>
            <button type="button">Pricing</button>
            <button type="button" className="landing-sign-btn" onClick={() => navigate('/register')}>
              Sign Here
            </button>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="landing-hero-copy">
            <h1>
              Unlock Insights from
              <br />
              Your Spreadsheet Data
            </h1>
            <p>
              Upload your Excel or CSV files to analyze, visualize,
              <br />
              and gain valuable insights using powerful tools.
            </p>

            <div className="landing-hero-actions">
              <button type="button" className="hero-primary" onClick={() => navigate('/register')}>
                Get Started
              </button>
              <button type="button" className="hero-secondary" onClick={() => navigate('/login')}>
                Learn More
              </button>
            </div>
          </div>

          <div className="landing-hero-preview" aria-hidden="true">
            <div className="preview-mock-window">
              <div className="preview-sidebar" />
              <div className="preview-content">
                <div className="preview-card" />
                <div className="preview-row">
                  <span className="preview-bar bar-a" />
                  <span className="preview-bar bar-b" />
                  <span className="preview-bar bar-c" />
                  <span className="preview-bar bar-d" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <h2>Upload & Analyze Data</h2>
          <p>
            Upload your Excel or CSV files to analyze, visualize, and gain insights
            <br />
            using this secure platform.
          </p>

          <div className="landing-feature-grid">
            <article className="landing-feature-card">
              <div className="feature-icon-box">folder</div>
              <h3>Upload & Analyze Data</h3>
              <p>Keep your files in one place and run instant checks.</p>
            </article>

            <article className="landing-feature-card">
              <div className="feature-icon-box">chart</div>
              <h3>Interactive Charts</h3>
              <p>Create readable visuals with clean dashboard output.</p>
            </article>

            <article className="landing-feature-card">
              <div className="feature-icon-box">ai</div>
              <h3>AI Powered Insights</h3>
              <p>Get fast suggestions and understand data trends quickly.</p>
            </article>
          </div>

          <div className="landing-tools" aria-hidden="true">
            <span>xlsx</span>
            <span>csv</span>
            <span>sheet</span>
            <span>drive</span>
            <span>cloud</span>
          </div>
        </section>
      </div>
    </div>
  );
}
