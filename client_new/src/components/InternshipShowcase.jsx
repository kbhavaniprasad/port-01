// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CalendarDays, ArrowRight } from 'lucide-react';
// import './internship-showcase.css';

// const internships = [
//   {
//     id: 1,
//     company: 'Biztron Softech Ltd',
//     shortName: 'Biztron',
//     role: 'Full Stack Developer Intern',
//     period: 'June � July 2024',
//     duration: '2 Months',
//     description:
//       'Built high-performance web applications with a polished MERN stack interface, delivered responsive user experiences, and collaborated with engineering teams to release seamless product updates.',
//     skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs', 'Git'],
//     highlights: ['Shipped 5 features', 'Fixed 15+ bugs', '98% code review pass'],
//     accentColor: '#61dafb',
//     glowColor: 'rgba(97,218,251,0.22)',
//     number: '01',
//   },
//   {
//     id: 2,
//     company: 'Tech Innovation Labs',
//     shortName: 'TIL',
//     role: 'Software Development Intern',
//     period: 'May � June 2024',
//     duration: '1 Month',
//     description:
//       'Contributed to a precision automation platform by building computer vision pipelines and optimization features that improved accuracy and reduced model latency.',
//     skills: ['Python', 'OpenCV', 'TensorFlow', 'Machine Learning', 'Optimization'],
//     highlights: ['Patent co-inventor', '50k+ images processed', 'Published research'],
//     accentColor: '#a78bfa',
//     glowColor: 'rgba(167,139,250,0.22)',
//     number: '02',
//   },
//   {
//     id: 3,
//     company: 'Web Solutions Startup',
//     shortName: 'WSS',
//     role: 'Frontend Development Intern',
//     period: 'April � May 2024',
//     duration: '1 Month',
//     description:
//       'Designed modern responsive UI systems for an e-commerce experience, improved accessibility, and created reusable component patterns that accelerated product delivery.',
//     skills: ['React.js', 'CSS3', 'JavaScript', 'Figma', 'Responsive Design', 'Accessibility'],
//     highlights: ['WCAG 2.1 AA', '95 PageSpeed score', 'Mobile-first design'],
//     accentColor: '#f59e0b',
//     glowColor: 'rgba(245,158,11,0.22)',
//     number: '03',
//   },
// ];

// const SkillPill = ({ skill, accent, delay }) => (
//   <motion.span
//     className="is-skill-pill"
//     style={{ '--accent': accent }}
//     initial={{ opacity: 0, scale: 0.88, y: 8 }}
//     animate={{ opacity: 1, scale: 1, y: 0 }}
//     transition={{ delay, duration: 0.32, ease: 'easeOut' }}
//   >
//     {skill}
//   </motion.span>
// );

// const Highlight = ({ text, delay }) => (
//   <motion.div
//     className="is-highlight"
//     initial={{ opacity: 0, x: -12 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ delay, duration: 0.28, ease: 'easeOut' }}
//   >
//     <span className="is-check">?</span>
//     <span>{text}</span>
//   </motion.div>
// );

// const InternshipShowcase = () => {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const hasActive = activeIndex !== null;

//   const handleMouseEnter = (index) => setActiveIndex(index);
//   const handleMouseLeave = () => setActiveIndex(null);
//   const handleToggle = (index) => setActiveIndex((current) => (current === index ? null : index));

//   return (
//     <section id="intern" className="is-section">
//       <div className="is-blob is-blob-1" />
//       <div className="is-blob is-blob-2" />
//       <div className="is-blob is-blob-3" />

//       <motion.div
//         className="is-header"
//         initial={{ opacity: 0, y: -26 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: '-80px' }}
//         transition={{ duration: 0.75, ease: 'easeOut' }}
//       >
//         <p className="is-eyebrow">Experience & Growth</p>
//         <h2 className="is-title">Internship Showcase</h2>
//         <p className="is-subtitle">Cinematic internship stories with premium SaaS-style interaction</p>
//         <div className="is-title-bar" />
//       </motion.div>

//       <motion.p
//         className="is-hint"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.45, duration: 0.55 }}
//       >
//         Hover a card to expand
//       </motion.p>

//       <motion.div
//         className="is-strip"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-80px' }}
//         variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
//       >
//         {internships.map((item, idx) => {
//           const isActive = activeIndex === idx;
//           const isShrunk = hasActive && !isActive;

//           return (
//             <motion.div
//               key={item.id}
//               className={`is-panel ${isActive ? 'is-panel--active' : ''} ${isShrunk ? 'is-panel--shrunk' : ''}`}
//               style={{
//                 '--accent': item.accentColor,
//                 '--glow': item.glowColor,
//                 zIndex: isActive ? 20 : 10 - idx,
//               }}
//               onMouseEnter={() => handleMouseEnter(idx)}
//               onMouseLeave={handleMouseLeave}
//               onClick={() => handleToggle(idx)}
//               layout
//               transition={{ layout: { type: 'spring', stiffness: 280, damping: 32 }, opacity: { duration: 0.28 } }}
//             >
//               <div className="is-panel-glow" />
//               <div className="is-panel-overlay" />

//               <div className={`is-preview ${isActive ? 'is-preview--hidden' : ''}`}>
//                 <div className="is-preview-logo">{item.shortName.slice(0, 2)}</div>
//                 <p className="is-preview-company">{item.shortName}</p>
//                 <p className="is-preview-role">{item.role}</p>
//                 <span className="is-preview-accent" />
//               </div>

//               <AnimatePresence mode="wait">
//                 {isActive && (
//                   <motion.div
//                     className="is-expanded"
//                     key="expanded"
//                     initial={{ opacity: 0, y: 12 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 12 }}
//                     transition={{ duration: 0.32, ease: 'easeOut' }}
//                   >
//                     <div className="is-expanded-grid">
//                       <div className="is-expanded-left">
//                         <div className="is-expanded-logo-block" style={{ '--accent': item.accentColor }}>
//                           <span>{item.shortName.slice(0, 2)}</span>
//                         </div>
//                         <div className="is-expanded-copy">
//                           <p className="is-expanded-label">Premium Internship</p>
//                           <h3 className="is-expanded-company">{item.company}</h3>
//                         </div>
//                       </div>

//                       <div className="is-expanded-right">
//                         <div className="is-expanded-headline">
//                           <div>
//                             <p className="is-expanded-role">{item.role}</p>
//                             <div className="is-meta-row">
//                               <CalendarDays className="is-icon-calendar" size={18} />
//                               <span>{item.period} � {item.duration}</span>
//                             </div>
//                           </div>
//                           <div className="is-cta-icon">
//                             <ArrowRight size={18} />
//                           </div>
//                         </div>

//                         <div className="is-divider" />

//                         <p className="is-expanded-desc">{item.description}</p>

//                         <div className="is-tech-section">
//                           <p className="is-section-label">
//                             <span className="is-label-dot" style={{ background: item.accentColor }} />
//                             Tech Stack
//                           </p>
//                           <div className="is-skills-row">
//                             {item.skills.map((skill, i) => (
//                               <SkillPill key={skill} skill={skill} accent={item.accentColor} delay={0.30 + i * 0.06} />
//                             ))}
//                           </div>
//                         </div>

//                         <div className="is-highlights-section">
//                           <p className="is-section-label">
//                             <span className="is-label-dot" style={{ background: item.accentColor }} />
//                             Key Highlights
//                           </p>
//                           <div className="is-highlights-row">
//                             {item.highlights.map((highlight, i) => (
//                               <Highlight key={highlight} text={highlight} delay={0.35 + i * 0.06} />
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           );
//         })}
//       </motion.div>

//       <motion.div
//         className="is-stats"
//         initial={{ opacity: 0, y: 24 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6, delay: 0.3 }}
//       >
//         {[
//           { val: '4+', label: 'Months Experience' },
//           { val: '3', label: 'Companies' },
//           { val: '12+', label: 'Tech Skills' },
//           { val: '1', label: 'Patent Filed' },
//         ].map((stat) => (
//           <div key={stat.label} className="is-stat-item">
//             <span className="is-stat-val">{stat.val}</span>
//             <span className="is-stat-label">{stat.label}</span>
//           </div>
//         ))}
//       </motion.div>
//     </section>
//   );
// };

// export default InternshipShowcase;











import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Atom,
  BarChart3,
  Braces,
  BrainCircuit,
  CalendarDays,
  Code2,
  Database,
  Hexagon,
  LayoutGrid,
  Leaf,
  MousePointerClick,
  Palette,
  ShieldCheck,
  Smartphone,
  Workflow,
  Wind,
  Bot,
  ScanSearch,
  Blocks,
} from 'lucide-react';
import './internship-showcase.css';

const internships = [
  {
    id: 1,
    company: 'Tata Consultancy Services',
    shortName: 'tcs',
    role: 'Software Development Intern',
    period: 'May 2024 – July 2024',
    description:
      'Worked on developing and optimizing internal tools using the MERN stack. Collaborated with cross-functional teams to build scalable features and improve user experience.',
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS'],
    accent: '#7c6cff',
    glow: 'rgba(124, 108, 255, 0.26)',
    logoGradient:
      'linear-gradient(120deg, #f59e0b 0%, #ef4444 35%, #d946ef 68%, #8b5cf6 100%)',
    logoBg: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(236,240,248,0.82))',
    logoBorder: 'rgba(255,255,255,0.55)',
    number: '01',
  },
  {
    id: 2,
    company: 'ZS Associates',
    shortName: 'ZS',
    role: 'Data Science Intern',
    period: 'Jan 2024 – Mar 2024',
    description:
      'Built data analysis workflows, explored business datasets, and helped transform raw inputs into usable insights for analytical decision-making.',
    skills: ['Python', 'Pandas', 'SQL', 'Machine Learning'],
    accent: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.22)',
    logoGradient: 'linear-gradient(180deg, #1f2937 0%, #0f172a 100%)',
    logoBg: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(236,240,248,0.82))',
    logoBorder: 'rgba(255,255,255,0.45)',
    number: '02',
  },
  {
    id: 3,
    company: 'Virtusa',
    shortName: 'virtusa',
    role: 'Software Engineer Intern',
    period: 'Sept 2023 – Nov 2023',
    description:
      'Contributed to scalable product modules, improved application performance, and worked with modern frontend and backend patterns in a collaborative team environment.',
    skills: ['Java', 'Spring Boot', 'REST APIs', 'Git'],
    accent: '#6d7cff',
    glow: 'rgba(109, 124, 255, 0.22)',
    logoGradient: 'linear-gradient(180deg, #1f2937 0%, #0f172a 100%)',
    logoBg: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(236,240,248,0.82))',
    logoBorder: 'rgba(255,255,255,0.45)',
    number: '03',
  },
  {
    id: 4,
    company: 'Zoho',
    shortName: 'ZOHO',
    role: 'Web Developer Intern',
    period: 'Jun 2023 – Aug 2023',
    description:
      'Designed responsive interfaces, polished component behavior, and worked on UI improvements that enhanced usability across different screen sizes.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.22)',
    logoGradient: 'linear-gradient(180deg, #1f2937 0%, #0f172a 100%)',
    logoBg: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(236,240,248,0.82))',
    logoBorder: 'rgba(255,255,255,0.45)',
    number: '04',
  },
];

const techIcons = {
  MongoDB: Leaf,
  'Express.js': Braces,
  React: Atom,
  'Node.js': Hexagon,
  'Tailwind CSS': Wind,
  Python: Code2,
  Pandas: Database,
  SQL: Database,
  'Machine Learning': BrainCircuit,
  Java: Code2,
  'Spring Boot': Blocks,
  'REST APIs': Workflow,
  Git: Workflow,
  HTML5: Code2,
  CSS3: Palette,
  JavaScript: Code2,
  'Responsive Design': Smartphone,
};

function TechChip({ label, accent }) {
  const Icon = techIcons[label] || LayoutGrid;

  return (
    <motion.span
      className="is-tech-chip"
      style={{ '--accent': accent }}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Icon size={15} />
      <span>{label}</span>
    </motion.span>
  );
}

function LogoMark({ item, size = 'small' }) {
  return (
    <div
      className={`is-logo-mark is-logo-mark--${size}`}
      style={{
        '--logo-gradient': item.logoGradient,
        '--logo-bg': item.logoBg,
        '--logo-border': item.logoBorder,
      }}
    >
      <span>{item.shortName}</span>
    </div>
  );
}

const InternshipShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activate = (index) => setActiveIndex(index);

  const resetToFirst = () => setActiveIndex(0);

  return (
    <section id="intern" className="is-section">
      <div className="is-glow is-glow-1" />
      <div className="is-glow is-glow-2" />
      <div className="is-noise" />

      <div className="is-container">
        <motion.header
          className="is-header"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="is-title">
            Internship <span>Showcase</span>
          </h2>
          <p className="is-subtitle">
            A glimpse of my internship experiences and the impact I made.
          </p>
          <div className="is-title-divider" />
        </motion.header>

        <motion.div
          className="is-hint-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <span className="is-hint-line" />
          <div className="is-hint-copy">
            <MousePointerClick size={18} />
            <span>Hover over a card to reveal more</span>
          </div>
          <span className="is-hint-line" />
        </motion.div>

        <div className="is-strip">
          {internships.map((item, index) => {
            const isActive = activeIndex === index;
            const isDimmed = activeIndex !== index;

            return (
              <motion.article
                key={item.id}
                className={`is-card ${isActive ? 'is-card--active' : ''}`}
                style={{
                  '--accent': item.accent,
                  '--glow': item.glow,
                  zIndex: isActive ? 30 : 10 - index,
                  width: isActive ? 'var(--expanded-width)' : 'var(--compact-width)',
                }}
                onMouseEnter={() => activate(index)}
                onFocus={() => activate(index)}
                onMouseLeave={resetToFirst}
                onClick={() => activate(index)}
                tabIndex={0}
                initial={false}
                animate={{
                  opacity: isDimmed ? 0.94 : 1,
                  scale: isActive ? 1 : 0.995,
                }}
                transition={{
                  width: { type: 'spring', stiffness: 240, damping: 30 },
                  opacity: { duration: 0.22 },
                  scale: { duration: 0.22 },
                }}
              >
                <div className="is-card-glow" />
                <div className="is-card-sheen" />

                <AnimatePresence mode="wait">
                  {!isActive ? (
                    <motion.div
                      key="preview"
                      className="is-preview"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <span className="is-preview-number">{item.number}</span>
                      <LogoMark item={item} size="small" />
                      <div className="is-preview-copy">
                        <h3 className="is-preview-company">{item.company}</h3>
                        <p className="is-preview-role">{item.role}</p>
                      </div>
                      <span className="is-preview-accent" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="expanded"
                      className="is-expanded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <div className="is-expanded-grid">
                        <div className="is-expanded-left">
                          <LogoMark item={item} size="large" />

                          <div className="is-expanded-left-copy">
                            <p className="is-kicker">Premium Internship</p>
                            <h3 className="is-company-name">{item.company}</h3>
                          </div>
                        </div>

                        <div className="is-expanded-right">
                          <div className="is-headline-row">
                            <div className="is-headline-copy">
                              <p className="is-role">{item.role}</p>
                              <div className="is-meta">
                                <CalendarDays size={16} />
                                <span>{item.period}</span>
                              </div>
                            </div>

                            <div className="is-arrow">
                              <ArrowRight size={18} />
                            </div>
                          </div>

                          <div className="is-divider" />

                          <p className="is-description">{item.description}</p>

                          <div className="is-section-block">
                            <p className="is-section-label">Tech Stack</p>
                            <div className="is-tech-list">
                              {item.skills.map((skill) => (
                                <TechChip key={skill} label={skill} accent={item.accent} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InternshipShowcase;