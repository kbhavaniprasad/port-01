const fs = require('fs');
let css = fs.readFileSync('src/components/style.css', 'utf8');

// Update body background
css = css.replace(
  /body\s*\{[\s\S]*?font-family:[^\}]+\}/,
  `body {
  background: #030305;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
  background-attachment: fixed;
  color: #e2e8f0;
  line-height: 1.6;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}`
);

// Update navbar
css = css.replace(
  /#navbar\s*\{[\s\S]*?z-index:\s*100;\r?\n?\}/,
  `#navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 10px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 15px;
  z-index: 100;
  margin: 0 20px;
  transition: all 0.4s ease;
}`
);

// Update nav-item::after
css = css.replace(
  /\.nav-item::after\s*\{[\s\S]*?left\s*0\.4s\s*ease-out;\r?\n?\}/,
  `.nav-item::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.8), transparent);
  transition: width 0.4s ease-out, left 0.4s ease-out;
}`
);

// Update project card
css = css.replace(
  /\.project-card\s*\{[\s\S]*?box-shadow:\s*0\s*10px\s*30px\s*rgba\(0,\s*0,\s*0,\s*0\.2\);\r?\n?\}/,
  `.project-card {
  background: rgba(15, 15, 18, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 35px;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUpFade 0.6s ease forwards;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.02);
}`
);

// Update project card hover
css = css.replace(
  /\.project-card:hover\s*\{[\s\S]*?background:\s*rgba\(30,\s*30,\s*30,\s*0\.5\);\r?\n?\}/,
  `.project-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  background: rgba(20, 20, 25, 0.8);
}`
);

// Update resume button
css = css.replace(
  /\.resume-btn\s*\{[\s\S]*?justify-content:\s*center;\r?\n?\}/,
  `.resume-btn {
  width: 160px;
  height: 44px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}`
);

css = css.replace(
  /\.resume-btn:hover\s*\{[\s\S]*?box-shadow:\s*0\s*4px\s*10px\s*rgba\(0,\s*0,\s*0,\s*0\.3\);\r?\n?\}/,
  `.resume-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 255, 255, 0.05);
  color: #ffffff;
}`
);

fs.writeFileSync('src/components/style.css', css);
console.log('CSS Updated successfully!');
