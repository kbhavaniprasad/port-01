// import React, { useState, useEffect } from "react";
// import './style.css';
// import profileImage from "../assets/photo.png";
// import resumePDF from "../assets/resume.pdf";
// import { FaLinkedin, FaInstagram, FaJava, FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
// import { Link } from "lucide-react";

// // Backend URL configuration
// const API_BASE_URL = 'https://portfolio-backend-l2ar.onrender.com';

// // Logger class
// class PortfolioLogger {
//   constructor() {
//     this.events = [];
//     this.sessionId = this.generateSessionId();
//     this.startTime = Date.now();
//   }
  
//   generateSessionId() {
//     return 'session_' + Math.random().toString(36).substr(2, 9);
//   }
  
//   log(event, data = {}) {
//     const logEntry = {
//       timestamp: new Date().toISOString(),
//       sessionId: this.sessionId,
//       event: event,
//       data: data,
//       url: window.location.href,
//       userAgent: navigator.userAgent
//     };
    
//     this.events.push(logEntry);
//     this.sendToServer(logEntry);
    
//     console.log('📊 Portfolio Log:', logEntry);
//   }
  
//   sendToServer(entry) {
//     fetch(`${API_BASE_URL}/api/log`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(entry)
//     }).catch(err => console.warn('Logging failed:', err));
//   }
// }

// // Initialize logger
// const logger = new PortfolioLogger();

// const skills = [
//   { skill: "Java", icon: <FaJava />, color: "#f89820" },
//   { skill: "HTML", icon: <FaHtml5 />, color: "#e34f26" },
//   { skill: "CSS", icon: <FaCss3Alt />, color: "#1572b6" },
//   { skill: "JavaScript", icon: <FaJs />, color: "#f7df1e" },
//   { skill: "React", icon: <FaReact />, color: "#61dafb" },
//   { skill: "Node.js", icon: <FaNodeJs />, color: "#68a063" },
//   { skill: "MongoDB", icon: <FaDatabase />, color: "#47a248" }
// ];

// const TechnicalSkills = () => {
//   const [hoveredSkill, setHoveredSkill] = useState(null);

//   const handleMouseEnter = (index) => {
//     setHoveredSkill(index);
    
//     // Log skill hover
//     logger.log('skill_hover', {
//       skill: skills[index].skill,
//       timestamp: Date.now()
//     });
//   };

//   const handleMouseLeave = (index) => {
//     setHoveredSkill(null);
//   };

//   return (
//     <section id="technical-container">
//       <h1>Technical Skills</h1>
//       <div id="skills-grid">
//         {skills.map((item, index) => (
//           <div
//             className={`skill-card ${hoveredSkill === index ? 'hovered' : ''}`}
//             key={index}
//             onMouseEnter={() => handleMouseEnter(index)}
//             onMouseLeave={() => handleMouseLeave(index)}
//           >
//             <div 
//               className="skill-icon"
//               style={{ color: item.color }}
//             >
//               {item.icon}
//             </div>
//             <h3 className="skill-name">{item.skill}</h3>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// const Portfolio = () => {
//   const [contactType, setContactType] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "", message: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   // Log page view on component mount
//   useEffect(() => {
//     logger.log('page_view', {
//       page: 'portfolio',
//       timestamp: Date.now(),
//       referrer: document.referrer || 'direct'
//     });

//     // Log performance metrics
//     if (window.performance && window.performance.timing) {
//       const timing = window.performance.timing;
//       logger.log('performance', {
//         loadTime: timing.loadEventEnd - timing.navigationStart,
//         domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
//         firstPaint: timing.responseStart - timing.navigationStart
//       });
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setSubmitStatus(null);

//     // Log contact form start
//     logger.log('contact_form_started', {
//       name: formData.name,
//       email: formData.email,
//       messageLength: formData.message.length
//     });

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/send-email`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Something went wrong");
//       }

//       // Log successful submission
//       logger.log('contact_form_success', {
//         name: formData.name,
//         email: formData.email,
//         timestamp: Date.now()
//       });

//       setSubmitStatus({ success: true, message: data.message });
//       setFormData({ name: "", email: "", message: "" });
      
//       // Auto-hide success message after 5 seconds
//       setTimeout(() => {
//         setSubmitStatus(null);
//       }, 5000);

//     } catch (error) {
//       console.error("Error:", error);
      
//       // Log error
//       logger.log('contact_form_error', {
//         error: error.message,
//         name: formData.name,
//         email: formData.email,
//         timestamp: Date.now()
//       });

//       setSubmitStatus({ success: false, message: error.message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
    
//     // Log sidebar toggle
//     logger.log('sidebar_toggle', {
//       action: isSidebarOpen ? 'close' : 'open',
//       timestamp: Date.now()
//     });
//   };

//   const handleNavClick = (section) => {
//     setIsSidebarOpen(false);
    
//     // Log navigation click
//     logger.log('navigation_click', {
//       section: section,
//       timestamp: Date.now()
//     });
//   };

//   const handleResumeDownload = () => {
//     logger.log('resume_download', {
//       type: 'pdf',
//       action: 'download',
//       timestamp: Date.now()
//     });
//   };

//   const handleResumeView = () => {
//     logger.log('resume_view', {
//       type: 'pdf',
//       action: 'view',
//       timestamp: Date.now()
//     });
//   };

//   const handleProjectClick = (projectTitle, projectUrl) => {
//     logger.log('project_click', {
//       project: projectTitle,
//       url: projectUrl,
//       timestamp: Date.now()
//     });
//   };

//   const handleSocialClick = (platform, url) => {
//     logger.log('social_click', {
//       platform: platform,
//       url: url,
//       timestamp: Date.now()
//     });
//   };

//   const handleContactButtonClick = () => {
//     setContactType("mail");
//     logger.log('contact_button_click', {
//       type: 'mail',
//       timestamp: Date.now()
//     });
//   };

//   const projects = [
//     {
//       title: "REAL-TIME SIGN LANGUAGE TO SPEECH ON MULTIPLE LANGUAGES",
//       desc: "Developed a real-time sign-language-to-speech system with multilingual translation and integrated eye-tracking for hands-free accessibility using standard, low-cost hardware",
//       //url: "https://github.com/kbhavaniprasad/MEDIKART-PHP-"
//     },
//     {
//       title: "Task Manager",
//       desc: "A Task Manager is a tool that helps users create, track, edit, and organize tasks efficiently, improving productivity. It typically includes features like task prioritization, deadlines, status tracking, and collaboration options.",
//       url: "https://github.com/kbhavaniprasad/Task-Manager"
//     },
//     {
//       title: "Coupon Distribution (MERN)",
//       desc: "A live web application for round-robin coupon distribution with abuse prevention, ensuring fair allocation through IP and cookie tracking while allowing guest access and providing user feedback.",
//       url: "https://github.com/kbhavaniprasad/Coupon-Distribution"
//     },
//     {
//       title: "AI-Powered Smart Drone System and Method for Precision Pesticide Spraying in Agriculture",
//       desc: "Processed 50k+ crop images with CV models to detect infections.Designed spraying automation logic reducing pesticide use by 40%.Co-inventor in published patent for AI-driven drone spraying.",
//       //url:""
//     }
//   ];

//   // Error boundary for logging JavaScript errors
//   useEffect(() => {
//     const handleError = (error) => {
//       logger.log('javascript_error', {
//         message: error.message,
//         filename: error.filename,
//         lineno: error.lineno,
//         colno: error.colno,
//         timestamp: Date.now()
//       });
//     };

//     window.addEventListener('error', handleError);
//     return () => window.removeEventListener('error', handleError);
//   }, []);

//   return (
//     <div>
//       <header id="head">
//         <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
//         <nav id="navbar" className={isSidebarOpen ? "active" : ""}>
//           <h1 id="hh">Portfolio</h1>
//           <a href="#contact" onClick={() => handleNavClick('contact')} className="nav-item">Contact</a>
//           <a href="#project" onClick={() => handleNavClick('projects')} className="nav-item">Projects</a>
//           <a href="#intern" onClick={() => handleNavClick('internships')} className="nav-item">Internships</a>
//           <a href="#technical-container" onClick={() => handleNavClick('skills')} className="nav-item">Skills</a>
//           <a href="#aboutme" onClick={() => handleNavClick('about')} className="nav-item">About</a>
//         </nav>
//       </header>

//       <main>
//         <section id="intro">
//           <div id="text">
//             <div id="text-content">
//               <h1 id="t1">Hello, it's me</h1>
//               <h1 id="t1">Kola Bhavani Prasad</h1>
//             </div>
//             <p id="content">
//               Passionate about Full Stack Development and Data Structures & Algorithms, constantly exploring efficient solutions and scalable architectures. Excited to build innovative web applications while optimizing performance through algorithmic problem-solving.
//             </p>
//           </div>
//           <img src={profileImage} id="img1" alt="Profile" />
//         </section>

//         <section id="aboutme">
//           <div className="icons">
//             <img src={profileImage} id="img2" alt="Profile" />
//             <div className="social-icons">
//               <a 
//                 href="https://www.linkedin.com/in/kola-bhavani-prasad-b5298a296/" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 onClick={() => handleSocialClick('linkedin', 'https://www.linkedin.com/in/kola-bhavani-prasad-b5298a296/')}
//               >
//                 <FaLinkedin className="icon" />
//               </a>
//               <a 
//                 href="https://www.instagram.com/_mr.destroyer_/" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/_mr.destroyer_/')}
//               >
//                 <FaInstagram className="icon" />
//               </a>
//             </div>
//           </div>
//           <div id="para">
//             <h1>About Me</h1>
//             <h3>Passionate full-stack developer with expertise in the MERN stack and a strong grasp of Data Structures & Algorithms (DSA). Skilled in designing and developing scalable web applications with efficient backend logic and optimized database management.</h3>
//             <div className="resume-buttons">
//               <a href={resumePDF} download="Kola_Bhavani_Prasad_Resume.pdf">
//                 <button className="resume-btn" onClick={handleResumeDownload}>
//                   Download Resume
//                 </button>
//               </a>
//               <a href={resumePDF} target="_blank" rel="noopener noreferrer">
//                 <button className="resume-btn" onClick={handleResumeView}>
//                   View Resume
//                 </button>
//               </a>
//             </div>
//           </div>
//         </section>

//         <section id="intern">
//           <h1>Internships</h1>
//           <div id="container">
//             <div id="box">
//               <h3>
//                 I completed a MERN stack internship at Biztron Softech Ltd. from June 24 to July 20, 2024, where I gained hands-on experience in MongoDB, Express.js, React.js, and Node.js.
//               </h3>
//             </div>
//           </div>
//         </section>

//         <section id="project">
//           <h1>Projects</h1>
//           <div id="container">
//             {projects.map((proj, index) => (
//               <div id="box1" key={index}>
//                 <h2 id="p1">{proj.title}</h2>
//                 <h4 id="p">
//                   {proj.desc}
//                   {proj.url && (
//                     <a 
//                       href={proj.url} 
//                       target="_blank" 
//                       rel="noopener noreferrer" 
//                       id="link-icon"
//                       onClick={() => handleProjectClick(proj.title, proj.url)}
//                     >
//                       <Link size={18} style={{ marginLeft: "8px", verticalAlign: "middle", color: "#fff" }} />
//                     </a>
//                   )}
//                 </h4>
//               </div>
//             ))}
//           </div>
//         </section>

//         <TechnicalSkills />

//         <section id="contact">
//           <h1>Contact Me</h1>
//           <div id="contact-info">
//             <button
//               type="button"
//               id="mail-btn"
//               onClick={handleContactButtonClick}
//             >
//               Mail
//             </button>
//           </div>

//           {contactType === "mail" && (
//             <div id="contact-form" style={{ display: "block", margin: "0 auto", maxWidth: "350px" }}>
//               {submitStatus && (
//                 <div className={`alert ${submitStatus.success ? 'success' : 'error'}`}>
//                   {submitStatus.message}
//                 </div>
//               )}
//               <form onSubmit={handleSubmit}>
//                 <h3>Send me an email</h3>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Your Name"
//                   required
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Your Email"
//                   required
//                 />
//                 <textarea
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Your Message"
//                   required
//                   rows="5"
//                 />
//                 <button type="submit" disabled={isLoading}>
//                   {isLoading ? "Sending..." : "Send Message"}
//                 </button>
//               </form>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Portfolio;








import React, { useState, useEffect, useRef } from "react";
import './style.css';
import profileImage from "../assets/photo.png";
import resumePDF from "../assets/resume.pdf";
import { FaLinkedin, FaInstagram, FaJava, FaPython, FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaDatabase, FaExternalLinkAlt, FaRocket, FaMedal, FaTrophy, FaLightbulb, FaEnvelope, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { Link, Zap, Target } from "lucide-react";

// Backend URL configuration
const API_BASE_URL = 'https://portfolio-backend-l2ar.onrender.com';

// Enhanced Logger class with better error handling
class PortfolioLogger {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }
  
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Portfolio Log:', logEntry);
    }
  }
  
  async sendToServer(entry) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/log`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(entry)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Silently fail for logging errors to avoid disrupting user experience
      if (process.env.NODE_ENV === 'development') {
        console.warn('Logging failed:', error);
      }
    }
  }
}

// Initialize logger
const logger = new PortfolioLogger();

const skills = [
  { skill: "Java", icon: <FaJava />, color: "#f89820" },
  { skill: "Python", icon: <FaPython />, color: "#3776AB" },
  { skill: "HTML", icon: <FaHtml5 />, color: "#e34f26" },
  { skill: "CSS", icon: <FaCss3Alt />, color: "#1572b6" },
  { skill: "JavaScript", icon: <FaJs />, color: "#f7df1e" },
  { skill: "React", icon: <FaReact />, color: "#61dafb" },
  { skill: "Node.js", icon: <FaNodeJs />, color: "#68a063" },
  { skill: "MongoDB", icon: <FaDatabase />, color: "#47a248" },
  { skill: "SQL", icon: <FaDatabase />, color: "#336791" }
];

const certificationsData = [
  {
    id: 1,
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2025",
    image: "/assets/certifications/aws-cert.jpg",
    credentialUrl: "#"
  },
  {
    id: 2,
    title: "Salesforce Developer",
    issuer: "SmartBridge",
    date: "2025",
    image: "/assets/certifications/salesforce-cert.jpg",
    credentialUrl: "#"
  },
  {
    id: 3,
    title: "Smart Coder Certification",
    issuer: "Smart Interviews",
    date: "2024",
    image: "/assets/certifications/smartcoder-cert.jpg",
    credentialUrl: "#"
  },
  {
    id: 4,
    title: "ServiceNow CSA Certified",
    issuer: "ServiceNow",
    date: "2025",
    image: "/assets/certifications/servicenow-cert.jpg",
    credentialUrl: "#"
  }
];

const achievementsData = [
  {
    id: 1,
    title: "National Level AI Hackathon Winner",
    description: "Winner at VR Siddhartha College for ML-based smart drone prototype.",
    year: "2025",
    icon: <FaTrophy />
  },
  {
    id: 2,
    title: "Research Paper Accepted",
    description: "Research paper accepted and presented at ICICT Conference; received proceedings and certification.",
    year: "2025",
    icon: <FaMedal />
  },
  {
    id: 3,
    title: "Patent Published",
    description: "Published patent on AI-based precision pesticide spraying system.",
    year: "2025",
    icon: <FaLightbulb />
  }
];

const TechnicalSkills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredSkill(index);
    
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

const Certifications = () => {
  const [hoveredCert, setHoveredCert] = useState(null);

  const handleCertHover = (id) => {
    setHoveredCert(id);
    logger.log('certification_hover', { id, timestamp: Date.now() });
  };

  const handleCertLeave = () => {
    setHoveredCert(null);
  };

  const handleCertClick = (cert) => {
    logger.log('certification_click', {
      title: cert.title,
      url: cert.credentialUrl,
      timestamp: Date.now()
    });
    
    if (cert.credentialUrl && cert.credentialUrl !== "#") {
      window.open(cert.credentialUrl, '_blank');
    }
  };

  return (
    <section id="certifications">
      <div className="section-header">
        <h1>Certifications</h1>
        <p className="section-subtitle">Professional certifications and completed courses</p>
      </div>

      <div className="certifications-container">
        <div className="certifications-grid">
          {certificationsData.map((cert) => (
            <div 
              key={cert.id}
              className={`certification-card ${hoveredCert === cert.id ? 'hovered' : ''}`}
              onMouseEnter={() => handleCertHover(cert.id)}
              onMouseLeave={handleCertLeave}
              onClick={() => handleCertClick(cert)}
            >
              <div className="certification-image-container">
                <div className="certification-image-wrapper">
                  <img 
                    src={cert.image} 
                    alt={cert.title}
                    className="certification-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="certification-fallback" style={{display: 'none'}}>
                    <span>{cert.title.split(' ').map(word => word[0]).join('')}</span>
                  </div>
                </div>
                <div className="certification-overlay">
                  <span className="view-text">View Certificate</span>
                </div>
              </div>
              <div className="certification-content">
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <p className="cert-date">{cert.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  const [hoveredAchievement, setHoveredAchievement] = useState(null);

  const handleAchievementHover = (id) => {
    setHoveredAchievement(id);
    logger.log('achievement_hover', { id, timestamp: Date.now() });
  };

  const handleAchievementLeave = () => {
    setHoveredAchievement(null);
  };

  return (
    <section id="achievements">
      <div className="section-header">
        <h1>Achievements</h1>
        <p className="section-subtitle">Notable accomplishments and recognitions</p>
      </div>

      <div className="achievements-container">
        <div className="achievements-grid">
          {achievementsData.map((achievement) => (
            <div 
              key={achievement.id}
              className={`achievement-card ${hoveredAchievement === achievement.id ? 'hovered' : ''}`}
              onMouseEnter={() => handleAchievementHover(achievement.id)}
              onMouseLeave={handleAchievementLeave}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className="achievement-year">{achievement.year}</div>
              </div>
              <div className="achievement-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Project Card Component
const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    logger.log('project_hover', {
      project: project.title,
      timestamp: Date.now()
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleProjectClick = () => {
    if (project.url) {
      logger.log('project_click', {
        project: project.title,
        url: project.url,
        timestamp: Date.now()
      });
      window.open(project.url, '_blank');
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`project-card ${isHovered ? 'hovered' : ''} ${isVisible ? 'visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleProjectClick}
    >
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        {project.url && (
          <div className="project-link">
            <FaExternalLinkAlt />
          </div>
        )}
      </div>
      <p className="project-description">{project.desc}</p>
      <div className="project-tech-stack">
        <span className="tech-tag">MERN</span>
        <span className="tech-tag">React</span>
        <span className="tech-tag">Node.js</span>
      </div>
      <div className="project-hover-content">
        <div className="project-stats">
          <div className="stat">
            <Target size={16} />
            <span>Completed</span>
          </div>
          <div className="stat">
            <FaRocket size={16} />
            <span>Live</span>
          </div>
        </div>
      </div>
      <div className="project-glow"></div>
    </div>
  );
};

const internshipsData = [
  {
    company: "Biztron Softech Ltd.",
    role: "MERN Stack Intern",
    period: "Jun 2024 - Jul 2024",
    description: "Developed reusable React components and improved UI responsiveness. Integrated REST APIs and optimized application performance.",
    skills: ["MongoDB", "Express.js", "React.js", "Node.js", "REST APIs"]
  },
  {
    company: "SmartBridge (APSCHE)",
    role: "AI & ML Virtual Intern",
    period: "Jan 2025 - Apr 2025",
    description: "Learned supervised and unsupervised learning techniques with practical implementation. Performed data preprocessing, feature engineering, and model evaluation. Developed an end-to-end machine learning project.",
    skills: ["Python", "Machine Learning", "Data Preprocessing", "Feature Engineering"]
  },
  {
    company: "SmartBridge",
    role: "Salesforce Developer Intern",
    period: "May 2025 - Jul 2025",
    description: "Developed Lightning Web Components and Apex-based backend logic. Implemented business workflows using Salesforce platform tools.",
    skills: ["Salesforce", "LWC", "Apex"]
  }
];

// Enhanced Internship Card Component
const InternshipCard = ({ internship }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    logger.log('internship_hover', { company: internship.company, timestamp: Date.now() });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      ref={cardRef}
      className={`internship-card ${isHovered ? 'hovered' : ''} ${isVisible ? 'visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="internship-header">
        <div className="internship-info">
          <h3 className="company-name">{internship.company}</h3>
          <p className="internship-role">{internship.role}</p>
          <p className="internship-period">{internship.period}</p>
        </div>
      </div>
      <div className="internship-content">
        <p className="internship-description">
          {internship.description}
        </p>
        <div className="internship-skills">
          {internship.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
      <div className="internship-glow"></div>
    </div>
  );
};

// Enhanced Contact Form Component
const ContactForm = ({ onSubmit, isLoading, status }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div id="contact-form">
      {status && (
        <div className={`alert ${status.success ? 'success' : 'error'}`}>
          <div className="alert-icon">
            {status.success ? <FaCheck /> : <FaExclamationTriangle />}
          </div>
          <div className="alert-content">
            <strong>{status.success ? 'Success!' : 'Error'}</strong>
            <p>{status.message}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <h3>
          <FaEnvelope style={{ marginRight: '10px' }} />
          Send me a message
        </h3>
        
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message..."
            required
            rows="6"
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Sending...
            </>
          ) : (
            <>
              <FaEnvelope style={{ marginRight: '8px' }} />
              Send Message
            </>
          )}
        </button>
        
        <div className="form-footer">
          <p>💡 I'll get back to you within 24 hours</p>
        </div>
      </form>
    </div>
  );
};

const Portfolio = () => {
  const [contactType, setContactType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);

  // Log page view on component mount
  useEffect(() => {
    logger.log('page_view', {
      page: 'portfolio',
      timestamp: Date.now(),
      referrer: document.referrer || 'direct'
    });

    // Check backend health
    checkBackendHealth();

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

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      setBackendHealth(data);
      
      logger.log('health_check', {
        status: data.success ? 'healthy' : 'unhealthy',
        environment: data.environment,
        emailConfigured: data.emailConfigured
      });
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setBackendHealth({ success: false, error: error.message });
      
      logger.log('health_check_failed', {
        error: error.message,
        timestamp: Date.now()
      });
    }
  };

  const handleFormSubmit = async (formData) => {
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
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
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
        timestamp: Date.now(),
        message: data.message
      });

      setSubmitStatus({ success: true, message: data.message });
      
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 8000);

    } catch (error) {
      console.error("Contact form error:", error);
      
      // Log error
      logger.log('contact_form_error', {
        error: error.message,
        name: formData.name,
        email: formData.email,
        timestamp: Date.now()
      });

      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to send message. Please try again later or email me directly at kolaprasad001@gmail.com'
      });
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
      title: "Real-Time Sign Language Recognition",
      desc: "Developed CBAM-enhanced MobileNetV2 model with MediaPipe keypoint fusion. Achieved 98.8% accuracy with real-time CPU inference (50–100 ms latency). Designed dual-branch architecture combining visual and geometric features.",
    },
    {
      title: "AI-Powered Smart Drone System",
      desc: "Processed 50,000+ images for pest detection using computer vision. Implemented precision spraying system reducing pesticide overuse. Co-inventor of a published patent.",
    },
    {
      title: "Coupon Distribution Platform (MERN)",
      desc: "Built full-stack system with secure authentication and fair allocation logic, ensuring round-robin coupon distribution with abuse prevention.",
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

    const handleUnhandledRejection = (event) => {
      logger.log('unhandled_promise_rejection', {
        reason: event.reason?.message || event.reason,
        timestamp: Date.now()
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div>
      <header id="head">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
        <nav id="navbar" className={isSidebarOpen ? "active" : ""}>
          <h1 id="hh">Portfolio</h1>
          <a href="#contact" onClick={() => handleNavClick('contact')} className="nav-item">Contact</a>
          <a href="#achievements" onClick={() => handleNavClick('achievements')} className="nav-item">Achievements</a>
          <a href="#certifications" onClick={() => handleNavClick('certifications')} className="nav-item">Certifications</a>
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
          <div className="section-header">
            <h1>Internships</h1>
            <p className="section-subtitle">Professional experience and hands-on learning</p>
          </div>
          <div className="internship-container">
            <div className="internships-grid">
              {internshipsData.map((internship, index) => (
                <InternshipCard key={index} internship={internship} />
              ))}
            </div>
          </div>
        </section>

        <section id="project">
          <div className="section-header">
            <h1>Projects</h1>
            <p className="section-subtitle">Innovative solutions and real-world applications</p>
          </div>
          <div className="projects-container">
            <div className="projects-grid">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={index} 
                  project={project} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <TechnicalSkills />

        <Certifications />

        <Achievements />

        <section id="contact">
          <h1>Contact Me</h1>
          <div id="contact-info">
            <button
              type="button"
              id="mail-btn"
              onClick={handleContactButtonClick}
            >
              <FaEnvelope style={{ marginRight: '8px' }} />
              Send Message
            </button>
          </div>

          {contactType === "mail" && (
            <ContactForm 
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              status={submitStatus}
            />
          )}
          
          {/* Backend status indicator (hidden in production) */}
          {process.env.NODE_ENV === 'development' && backendHealth && (
            <div className="backend-status">
              <small>
                Backend: {backendHealth.success ? '✅ Healthy' : '❌ Unhealthy'}
                {backendHealth.emailConfigured && ' | 📧 Email Configured'}
              </small>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Portfolio;