import React, { useState } from "react";
import './style.css';
import profileImage from "../assets/me.jpg";
import resumePDF from "../assets/resume.pdf";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "lucide-react";

const Portfolio = () => {
  const [contactType, setContactType] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");

    const url = contactType === "mail" ? "https://port-01.onrender.com" : "https://port-01.onrender.com";
    const payload = contactType === "mail"
      ? { name: formData.name, email: formData.email, message: formData.message }
      : { name: formData.name, phone: formData.phone, message: formData.message };
    console.log("payload being sent:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.success);
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setResponseMessage(data.error);
        alert("Failed to send message! Please try again.");
      }
    } catch (error) {
      setResponseMessage("Failed to send message");
      alert("Failed to send message! Please check your network and try again.");
    }
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close Sidebar on Nav Link Click
  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <header id="head">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
        <nav id="navbar" className={isSidebarOpen ? "active" : ""}>
          <h1 id="hh">Portfolio</h1>
          <a href="#contact" onClick={handleNavClick}><h1 className="nav-item">Contact</h1></a>
          <a href="#project" onClick={handleNavClick}><h1 className="nav-item">Projects</h1></a>
          <a href="#intern" onClick={handleNavClick}><h1 className="nav-item">Internships</h1></a>
          <a href="#technical-container" onClick={handleNavClick}><h1 className="nav-item">Skills</h1></a>
          <a href="#aboutme" onClick={handleNavClick}><h1 className="nav-item">About</h1></a>
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
              <a href="https://www.linkedin.com/in/kola-bhavani-prasad-b5298a296/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="icon" />
              </a>
              <a href="https://www.instagram.com/_mr.destroyer_/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="icon" />
              </a>
            </div>
          </div>
          <div id="para">
            <h1>About Me</h1>
            <h3>Passionate full-stack developer with expertise in the MERN stack and a strong grasp of Data Structures & Algorithms (DSA). Skilled in designing and developing scalable web applications with efficient backend logic and optimized database management.</h3>
            <div className="resume-buttons">
              <a href={resumePDF} download="Kola_Bhavani_Prasad_Resume.pdf">
                <button className="resume-btn">Download Resume</button>
              </a>
              <a href={resumePDF} target="_blank" rel="noopener noreferrer">
                <button className="resume-btn">View Resume</button>
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
            <div id="box1">
              <h2 id="p1">MediKart</h2>
              <h4 id="p">Designed and developed a dynamic, real-time web application for online medicine ordering using PHP, HTML, and JavaScript, featuring interactive user interfaces, responsive design, and seamless functionality for browsing, ordering, and managing medical products online.
                <a href="https://github.com/kbhavaniprasad/MEDIKART-PHP-" target="_blank" rel="noopener noreferrer" id="link-icon">
                  <Link size={18} style={{ marginLeft: "8px", verticalAlign: "middle", color: "#fff", cursor: "pointer" }} />
                </a>
              </h4>
            </div>
            <div id="box1">
              <h2 id="p1">Task Manager</h2>
              <h4 id="p">
                A Task Manager is a tool that helps users create, track, edit, and organize tasks efficiently, improving productivity. It typically includes features like task prioritization, deadlines, status tracking, and collaboration options.
                <a href="https://taskmanager-zfc6.onrender.com" target="_blank" rel="noopener noreferrer" id="link-icon">
                  <Link size={18} style={{ marginLeft: "8px", verticalAlign: "middle", color: "#fff", cursor: "pointer" }} />
                </a>
              </h4>
            </div>
            <div id="box1">
              <h2 id="p1">Coupon Distribution (MERN)</h2>
              <h4 id="p">
                A live web application for round-robin coupon distribution with abuse prevention, ensuring fair allocation through IP and cookie tracking while allowing guest access and providing user feedback.
                <a href="https://assignment-1-f84r.onrender.com" target="_blank" rel="noopener noreferrer" id="link-icon">
                  <Link size={18} style={{ marginLeft: "8px", verticalAlign: "middle", color: "#fff", cursor: "pointer" }} />
                </a>
              </h4>
            </div>
          </div>
        </section>

        <TechnicalSkills/>

        <section id="contact">
          <h1>Contact Me</h1>
          <div id="contact-info">
            <button type="button" id="mail-btn" onClick={() => setContactType("mail")}>Mail</button>
          </div>

          {contactType && (
            <div id="contact-form" style={{ display: "block" }}>
              <form onSubmit={handleSubmit}>
                <h3>{contactType === "mail" ? "Send an Email" : "Contact via Phone"}</h3>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
                
                {contactType === "mail" && (
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
                )}

                {contactType === "phone" && (
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your Phone Number" required />
                )}

                <input type="text" name="message" value={formData.message} onChange={handleChange} placeholder="Message" required />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

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

export default Portfolio;