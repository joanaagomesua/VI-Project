import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import Photo from '../../assets/photo.png';

const AboutUs = () => {

  useEffect(() => {
    const sections = document.querySelectorAll('.about-section');
    const options = { root: null, rootMargin: '0px', threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const [showEmail, setShowEmail] = useState({ joana: false, francisco: false });

  const toggleEmail = (person) => {
    setShowEmail((prev) => ({ ...prev, [person]: !prev[person] }));
  };

  return (
    <div className="about-us">
      {/* Navigation Index */}
      <nav className="about-nav">
        <a href="#project">About CineStats</a>
        <a href="#team">Our Team</a>
        <a href="#discipline">The Project</a>
      </nav>

      {/* Sections */}
      <div id="project" className="about-section">
        <h2>About CineStats</h2>
        <p>
          CineStats is an Information Visualization Project that provides insights into the film industry in Portugal. The project leverages
          data from INE (Instituto Nacional de Estatística) to analyze trends in sessions, spectators, and revenue over the years and in
          different regions of Portugal.
        </p>
      </div>

      <div id="team" className="about-section">
        <h2>Our Team</h2>
        <p>Meet Joana and Francisco, the developers of CineStats!</p>
        <div className="team-photos">
        <div className="team-photos">
          {/* Joana */}
          <div className="team-member">
            <img src={Photo} alt="Joana" />
            <p>Joana</p>
            <div className="social-links">
              <a href="https://github.com/joana-github" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <button onClick={() => toggleEmail('joana')}>
                <i className="fas fa-envelope"></i>
              </button>
            </div>
            <p className={`email ${showEmail.joana ? 'show' : ''}`}>
              joanaagomes@ua.pt
            </p>
          </div>

          {/* Francisco */}
          <div className="team-member">
            <img src={Photo} alt="Francisco" />
            <p>Francisco</p>
            <div className="social-links">
              <a href="https://github.com/colleague-github" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <button onClick={() => toggleEmail('francisco')}>
                <i className="fas fa-envelope"></i>
              </button>
            </div>
            <p className={`email ${showEmail.francisco ? 'show' : ''}`}>
              francisco@example.com
            </p>
          </div>
        </div>
        </div>
      </div>

      <div id="discipline" className="about-section">
        <h2>Information Visualization</h2>
        <p>
          This project is part of the Information Visualization Curricular Unit (code: 44156) at the University of Aveiro. The IV course
          explores techniques for creating meaningful and interactive data visualizations.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
