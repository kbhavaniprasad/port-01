import React, { useState, useEffect } from "react";
import './style.css';
import profileImage from "../assets/photo.png";
import resumePDF from "../assets/resume.pdf";
import { FaLinkedin, FaInstagram, FaJava, FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { Link } from "lucide-react";

// Backend URL configuration
const API_BASE_URL = 'https://portfolio-backend-l2ar.onrender.com';

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
    fetch(`${API_BASE_URL}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(err => console.warn('Logging failed:', err));
  }
}

// Initialize logger
const logger = new PortfolioLogger();

const skills = [
  { skill: "Java", icon: <FaJava />, color: "#f89820" },
  { skill: "HTML", icon: <FaHtml5 />, color: "#e34f26" },
  { skill: "CSS", icon: <FaCss3Alt />, color: "#1572b6" },
  { skill: "JavaScript", icon: <FaJs />, color: "#f7df1e" },
  { skill: "React", icon: <FaReact />, color: "#61dafb" },
  { skill: "Node.js", icon: <FaNodeJs />, color: "#68a063" },
  { skill: "MongoDB", icon: <FaDatabase />, color: "#47a248" }
];

const TechnicalSkills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredSkill(index);
    
    // Log skill hover
    logger.log('skill_hover', {
      skill: skills[index].skill,
      timestamp: Date.now()
    });
  };

  const handleMouseLeave = (index) => {
    setHoveredSkill(null);
  };

  return (
    <section id="technical-container">
      <h1>Technical Skills</h1>
      <div id="skills-grid">
        {skills.map((item, index) => (
          <div
            className={`skill-card ${hoveredSkill === index ? 'hovered' : ''}`}
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div 
              className="skill-icon"
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
            <h3 className="skill-name">{item.skill}</h3>
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
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
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
      title: "REAL-TIME SIGN LANGUAGE TO SPEECH ON MULTIPLE LANGUAGES",
      desc: "Developed a real-time sign-language-to-speech system with multilingual translation and integrated eye-tracking for hands-free accessibility using standard, low-cost hardware",
      //url: "https://github.com/kbhavaniprasad/MEDIKART-PHP-"
    },
    {
      title: "Task Manager",
      desc: "A Task Manager is a tool that helps users create, track, edit, and organize tasks efficiently, improving productivity. It typically includes features like task prioritization, deadlines, status tracking, and collaboration options.",
      url: "https://github.com/kbhavaniprasad/Task-Manager"
    },
    {
      title: "Coupon Distribution (MERN)",
      desc: "A live web application for round-robin coupon distribution with abuse prevention, ensuring fair allocation through IP and cookie tracking while allowing guest access and providing user feedback.",
      url: "https://github.com/kbhavaniprasad/Coupon-Distribution"
    },
    {
      title: "AI-Powered Smart Drone System and Method for Precision Pesticide Spraying in Agriculture",
      desc: "Processed 50k+ crop images with CV models to detect infections.Designed spraying automation logic reducing pesticide use by 40%.Co-inventor in published patent for AI-driven drone spraying.",
      //url:""
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
              Passionate about Full Stack Development and Data Structures & Algorithms, constantly exploring efficient solutions and scalable architectures. Excited to build innovative web applications while optimizing performance through algorithmic problem-solving.
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
            <h3>Passionate full-stack developer with expertise in the MERN stack and a strong grasp of Data Structures & Algorithms (DSA). Skilled in designing and developing scalable web applications with efficient backend logic and optimized database management.</h3>
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
                I completed a MERN stack internship at Biztron Softech Ltd. from June 24 to July 20, 2024, where I gained hands-on experience in MongoDB, Express.js, React.js, and Node.js.
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
                  {proj.url && (
                    <a 
                      href={proj.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      id="link-icon"
                      onClick={() => handleProjectClick(proj.title, proj.url)}
                    >
                      <Link size={18} style={{ marginLeft: "8px", verticalAlign: "middle", color: "#fff" }} />
                    </a>
                  )}
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