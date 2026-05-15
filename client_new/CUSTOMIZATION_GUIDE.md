# Internship Showcase - Customization Guide

## How to Customize

### Adding More Internships

Edit `InternshipShowcase.jsx` and modify the `internships` array:

```javascript
const internships = [
  // Add new internship objects here
  {
    id: 4,  // Unique ID
    company: 'Your Company Name',
    role: 'Your Job Role',
    period: 'Month Year - Month Year',
    duration: 'Duration text',
    description: 'Detailed description of your internship...',
    skills: ['Skill1', 'Skill2', 'Skill3'],
    achievements: 'Key metric or achievement',
    logo: '🎯', // Emoji or icon representation
    highlights: ['Highlight 1', 'Highlight 2', 'Highlight 3']
  }
];
```

### Changing Colors

Edit `internship-showcase.css` and modify these color variables:

```css
/* Primary Cyan */
#61dafb → Your color

/* Secondary Gold */
#ffd700 → Your color

/* Pink Accent */
#ff6b9d → Your color
```

### Adjusting Animation Speed

In `InternshipShowcase.jsx`:

```javascript
// Increase for slower animations
animate={{
  type: 'spring',
  stiffness: 300,  // Higher = faster
  damping: 30      // Higher = less bouncy
}}

// Adjust container stagger
transition: {
  staggerChildren: 0.1,  // Increase for slower stagger
}
```

### Modifying Card Width

In `internship-showcase.css`:

```css
/* Compressed state */
.internship-card {
  width: 200px;  /* Change this */
}

/* Expanded state - Desktop */
.internship-card-wrapper.hovered .internship-card {
  width: 600px;  /* Change this */
}

/* Tablet (1024px) */
@media (max-width: 1024px) {
  .internship-card-wrapper.hovered .internship-card {
    width: 450px;  /* Change this */
  }
}
```

### Changing Font Sizes

All responsive font sizes are defined per breakpoint:

```css
/* Main title */
.showcase-title {
  font-size: 3.5rem;  /* Desktop */
}

@media (max-width: 1024px) {
  .showcase-title {
    font-size: 2.5rem;  /* Tablet */
  }
}

@media (max-width: 768px) {
  .showcase-title {
    font-size: 2rem;  /* Mobile */
  }
}
```

### Modifying Layout

**To make cards vertical stack instead of horizontal:**

```css
.internship-cards-container {
  flex-direction: column;  /* Add this line */
  align-items: center;
}
```

**To disable horizontal scroll:**

```css
.internship-cards-container {
  overflow-x: visible;  /* Change from 'auto' */
  flex-wrap: wrap;
}
```

### Changing Glassmorphism Effect

In `internship-showcase.css`, adjust:

```css
.internship-card {
  backdrop-filter: blur(20px);  /* Increase for more blur */
  background: rgba(255, 255, 255, 0.03);  /* Change opacity */
  border: 1px solid rgba(255, 255, 255, 0.08);  /* Border visibility */
}
```

### Customizing Skill Badge Style

```css
.skill-badge {
  background: linear-gradient(135deg, rgba(97, 218, 251, 0.1), rgba(255, 215, 0, 0.05));
  color: #61dafb;
  padding: 6px 14px;  /* Adjust size */
  border-radius: 20px;  /* Change roundness */
}
```

---

## Styling Options

### Option 1: Dark Theme (Current)
Already implemented with dark gradient background and light text.

### Option 2: Light Theme
Replace color scheme:
- Background: `#f5f5f5` instead of dark gradient
- Text: `#333` instead of white
- Accents: Keep cyan and gold or switch to darker versions

### Option 3: Company Colors
Replace accent colors with your brand colors:
```css
--primary-color: #yourColor;
--secondary-color: #yourColor2;
--tertiary-color: #yourColor3;
```

### Option 4: Minimal Style
Reduce effects:
```css
.internship-card {
  backdrop-filter: blur(5px);  /* Less blur */
  border: 1px solid rgba(255, 255, 255, 0.05);  /* Subtle border */
  box-shadow: none;  /* Remove shadow */
}
```

---

## Advanced Customization

### Adding Company Logos
Replace emoji logos with actual images:

```javascript
logo: require('../assets/company-logo.png'),  // Use image path
// In JSX:
<img src={internship.logo} alt={internship.company} className="logo-image" />
```

### Adding Links/CTAs
Add to each internship object:

```javascript
{
  // ... other properties
  certificateLink: 'https://certificate-url.com',
  linkedinUrl: 'https://linkedin-url.com',
  websiteUrl: 'https://company-website.com'
}
```

Then in the component:
```jsx
{internship.certificateLink && (
  <a href={internship.certificateLink} className="certificate-link">
    View Certificate
  </a>
)}
```

### Filtering/Sorting
Add filter buttons above the cards:

```jsx
const [filter, setFilter] = useState('all');

const filteredInternships = internships.filter(i => {
  if (filter === 'all') return true;
  return i.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()));
});
```

### Adding Internship Categories
```javascript
const internships = [
  {
    // ... properties
    category: 'MERN Stack',  // Add category
    level: 'Intermediate'    // Add level
  }
];
```

---

## Performance Tuning

### Reducing Animation Complexity
```javascript
// Disable individual skill animations
animate={{
  opacity: hoveredIndex === index ? 1 : 0,
  // Remove scale animation
}}
```

### Lazy Loading Cards
```javascript
whileInView="visible"  // Already implemented
viewport={{ once: true, margin: '-100px' }}  // Adjust margin
```

### Reducing Decorative Elements
Comment out in the JSX:
```jsx
{/* Background Decorative Elements */}
{/* <div className="showcase-decorations">
  ... decorations code ...
</div> */}
```

---

## Mobile-First Customization

### Touch Interactions
Add to InternshipShowcase.jsx:

```javascript
const [isTouchDevice, setIsTouchDevice] = useState(false);

useEffect(() => {
  setIsTouchDevice(() => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  });
}, []);

// Then use isTouchDevice to adjust behavior
```

### Swipe Support
Integrate with react-swipeable:
```bash
npm install react-swipeable
```

---

## Responsive Testing

### Viewport Sizes to Test:
- Desktop: 1920px, 1440px, 1024px
- Tablet: 768px, 1024px (landscape)
- Mobile: 480px, 360px
- Extra Small: 320px

### Test Interactions:
- Hover on desktop
- Touch/tap on mobile
- Scroll behavior on all devices
- Animation performance on low-end devices

---

## Troubleshooting

### Animations Lag
- Reduce blur effect: `backdrop-filter: blur(10px);`
- Disable decorations
- Reduce stagger delay: `staggerChildren: 0.05;`

### Cards Not Expanding
- Check browser DevTools Console for errors
- Verify Framer Motion is installed: `npm list framer-motion`
- Check CSS media query breakpoints

### Text Overflow
- Reduce padding in card-content
- Decrease font sizes
- Set max-height limits

### Poor Mobile Experience
- Ensure viewport meta tag in HTML
- Test on actual mobile devices
- Adjust touch/tap areas

---

## Browser Compatibility

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 15+  
⚠️ IE 11 (Requires polyfills)

---

## Questions or Issues?

Refer to:
- Framer Motion docs: https://www.framer.com/motion
- React docs: https://react.dev
- CSS Tricks Glassmorphism: https://css-tricks.com/
