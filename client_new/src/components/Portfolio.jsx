import React, { useState, useEffect } from "react";
import './style.css';
import profileImage from "../assets/me.jpg";
import resumePDF from "../assets/resume.pdf";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "lucide-react";

// Logger class
class PortfolioLogger {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }
  
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }
  
  log(event, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      event: event,
      data: data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.events.push(logEntry);
    this.sendToServer(logEntry);
    
    console.log('📊 Portfolio Log:', logEntry);
  }
  
  sendToServer(entry) {
    fetch('http://localhost:5000/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(err => console.warn('Logging failed:', err));
  }
}

// Initialize logger
const logger = new PortfolioLogger();

const skills = [
  { skill: "C", percent: 85 },
  { skill: "Java", percent: 75 },
  { skill: "HTML", percent: 90 },
  { skill: "CSS", percent: 85 },
  { skill: "JavaScript", percent: 80 },
  { skill: "MERN Stack", percent: 70 }
];

const TechnicalSkills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [progress, setProgress] = useState({});

  const handleMouseEnter = (index, percent) => {
    setHoveredSkill(index);
    setProgress((prev) => ({ ...prev, [index]: 0 }));
    
    // Log skill hover
    logger.log('skill_hover', {
      skill: skills[index].skill,
      percent: percent,
      timestamp: Date.now()
    });
    
    setTimeout(() => {
      setProgress((prev) => ({ ...prev, [index]: percent }));
    }, 50);
  };

  const handleMouseLeave = (index) => {
    setHoveredSkill(null);
    setProgress((prev) => ({ ...prev, [index]: 0 }));
  };

  return (
    <section id="technical-container">
      <h1>Technical Skills</h1>
      <div id="tech-item-hidden">
        {skills.map((item, index) => (
          <div
            className="skill"
            key={index}
            onMouseEnter={() => handleMouseEnter(index, item.percent)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div
              className="progress-circle"
              style={{
                transition: "background 0.2s ease-in-out",
                background: `conic-gradient(#007bff ${progress[index] || 0}%, white ${progress[index] || 0}%)`
              }}
            >
              {item.percent}%
            </div>
            <p>{item.skill} ({item.percent}%)</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Portfolio = () => {
  const [contactType, setContactType] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Log page view on component mount
  useEffect(() => {
    logger.log('page_view', {
      page: 'portfolio',
      timestamp: Date.now(),
      referrer: document.referrer || 'direct'
    });

    // Log performance metrics
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      logger.log('performance', {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: timing.responseStart - timing.navigationStart
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    // Log contact form start
    logger.log('contact_form_started', {
      name: formData.name,
      email: formData.email,
      messageLength: formData.message.length
    });

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Log successful submission
      logger.log('contact_form_success', {
        name: formData.name,
        email: formData.email,
        timestamp: Date.now()
      });

      setSubmitStatus({ success: true, message: data.message });
      setFormData({ name: "", email: "", message: "" });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error("Error:", error);
      
      // Log error
      logger.log('contact_form_error', {
        error: error.message,
        name: formData.name,
        email: formData.email,
        timestamp: Date.now()
      });

      setSubmitStatus({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
    // Log sidebar toggle
    logger.log('sidebar_toggle', {
      action: isSidebarOpen ? 'close' : 'open',
      timestamp: Date.now()
    });
  };

  const handleNavClick = (section) => {
    setIsSidebarOpen(false);
    
    // Log navigation click
    logger.log('navigation_click', {
      section: section,
      timestamp: Date.now()
    });
  };

  const handleResumeDownload = () => {
    logger.log('resume_download', {
      type: 'pdf',
      action: 'download',
      timestamp: Date.now()
    });
  };

  const handleResumeView = () => {
    logger.log('resume_view', {
      type: 'pdf',
      action: 'view',
      timestamp: Date.now()
    });
  };

  const handleProjectClick = (projectTitle, projectUrl) => {
    logger.log('project_click', {
      project: projectTitle,
      url: projectUrl,
      timestamp: Date.now()
    });
  };

  const handleSocialClick = (platform, url) => {
    logger.log('social_click', {
      platform: platform,
      url: url,
      timestamp: Date.now()
    });
  };

  const handleContactButtonClick = () => {
    setContactType("mail");
    logger.log('contact_button_click', {
      type: 'mail',
      timestamp: Date.now()
    });
  };

  const projects = [
    {
      title: "MediKart",
      desc: "A real-time medicine ordering web app using PHP, React, JS & HTML.",
      url: "https://github.com/kbhavaniprasad/MEDIKART-PHP-"
    },
    {
      title: "Task Manager",
      desc: "Create, organize, and track tasks to boost productivity.",
      url: "https://github.com/kbhavaniprasad/Task-Manager"
    },
    {
      title: "Coupon Distribution (MERN)",
      desc: "Distributes coupons fairly with IP & cookie abuse prevention.",
      url: "https://github.com/kbhavaniprasad/Coupon-Distribution"
    }
  ];

  // Error boundary for logging JavaScript errors
  useEffect(() => {
    const handleError = (error) => {
      logger.log('javascript_error', {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
        timestamp: Date.now()
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div>
      <header id="head">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
        <nav id="navbar" className={isSidebarOpen ? "active" : ""}>
          <h1 id="hh">Portfolio</h1>
          <a href="#contact" onClick={() => handleNavClick('contact')} className="nav-item">Contact</a>
          <a href="#project" onClick={() => handleNavClick('projects')} className="nav-item">Projects</a>
          <a href="#intern" onClick={() => handleNavClick('internships')} className="nav-item">Internships</a>
          <a href="#technical-container" onClick={() => handleNavClick('skills')} className="nav-item">Skills</a>
          <a href="#aboutme" onClick={() => handleNavClick('about')} className="nav-item">About</a>
        </nav>
      </header>

      <main>
        <section id="intro">
          <div id="text">
            <div id="text-content">
              <h1 id="t1">Hello, it's me</h1>
              <h1 id="t1">Kola Bhavani Prasad</h1>
            </div>
            <p id="content">
              Passionate about Full Stack Development and Data Structures & Algorithms, constantly exploring efficient solutions and scalable architectures.
            </p>
          </div>
          <img src={profileImage} id="img1" alt="Profile" />
        </section>

        <section id="aboutme">
          <div className="icons">
            <img src={profileImage} id="img2" alt="Profile" />
            <div className="social-icons">
              <a 
                href="https://www.linkedin.com/in/kola-bhavani-prasad-b5298a296/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('linkedin', 'https://www.linkedin.com/in/kola-bhavani-prasad-b5298a296/')}
              >
                <FaLinkedin className="icon" />
              </a>
              <a 
                href="https://www.instagram.com/_mr.destroyer_/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/_mr.destroyer_/')}
              >
                <FaInstagram className="icon" />
              </a>
            </div>
          </div>
          <div id="para">
            <h1>About Me</h1>
            <h3>Passionate full-stack developer with expertise in the MERN stack and strong DSA knowledge.</h3>
            <div className="resume-buttons">
              <a href={resumePDF} download="Kola_Bhavani_Prasad_Resume.pdf">
                <button className="resume-btn" onClick={handleResumeDownload}>
                  Download Resume
                </button>
              </a>
              <a href={resumePDF} target="_blank" rel="noopener noreferrer">
                <button className="resume-btn" onClick={handleResumeView}>
                  View Resume
                </button>
              </a>
            </div>
          </div>
        </section>

        <section id="intern">
          <h1>Internships</h1>
          <div id="container">
            <div id="box">
              <h3>
                I completed a MERN stack internship at Biztron Softech Ltd. from June 24 to July 20, 2024.
              </h3>
            </div>
          </div>
        </section>

        <section id="project">
          <h1>Projects</h1>
          <div id="container">
            {projects.map((proj, index) => (
              <div id="box1" key={index}>
                <h2 id="p1">{proj.title}</h2>
                <h4 id="p">
                  {proj.desc}
                  <a 
                    href={proj.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    id="link-icon"
                    onClick={() => handleProjectClick(proj.title, proj.url)}
                  >
                    <Link size={18} style={{ marginLeft: "8px", verticalAlign: "middle", color: "#fff" }} />
                  </a>
                </h4>
              </div>
            ))}
          </div>
        </section>

        <TechnicalSkills />

        <section id="contact">
          <h1>Contact Me</h1>
          <div id="contact-info">
            <button
              type="button"
              id="mail-btn"
              onClick={handleContactButtonClick}
            >
              Mail
            </button>
          </div>

          {contactType === "mail" && (
            <div id="contact-form" style={{ display: "block", margin: "0 auto", maxWidth: "350px" }}>
              {submitStatus && (
                <div className={`alert ${submitStatus.success ? 'success' : 'error'}`}>
                  {submitStatus.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <h3>Send me an email</h3>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows="5"
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Portfolio;