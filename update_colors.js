const fs = require('fs');

const tailwindConfigPath = 'tailwind.config.ts';
let tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');

tailwindConfig = tailwindConfig.replace('extend: {', `extend: {
            colors: {
                brand: {
                    yellow: "#FAE588",
                    orange: "#FF8559",
                    slate: "#545F66",
                    dark: "#2A3034",
                    darker: "#1C2023",
                    card: "#353C40",
                    border: "#444D53"
                }
            },`);

fs.writeFileSync(tailwindConfigPath, tailwindConfig);

const globalsCssPath = 'app/globals.css';
let globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

globalsCss = globalsCss.replace(/:root \{[^}]+\}/m, `:root {
  --background: #2A3034;
  --foreground: #ffffff;
}`);

globalsCss = globalsCss.replace(/@media \(prefers-color-scheme: dark\) \{[^}]+\}/m, `@media (prefers-color-scheme: dark) {
  :root {
    --background: #1C2023;
    --foreground: #ffffff;
  }
}`);

// Update hero section
globalsCss = globalsCss.replace(/linear-gradient\(135deg, #eff6ff 0%, #f0f4ff 40%, #faf5ff 70%, #ffffff 100%\)/g, 'linear-gradient(135deg, #2A3034 0%, #1C2023 100%)');
globalsCss = globalsCss.replace(/rgba\(99, 102, 241/g, 'rgba(255, 133, 89'); // indigo -> orange
globalsCss = globalsCss.replace(/rgba\(59, 130, 246/g, 'rgba(250, 229, 136'); // blue -> yellow

globalsCss = globalsCss.replace(/\.hero-gradient-text \{[\s\S]*?\}/m, `.hero-gradient-text {
  background: linear-gradient(135deg, #FF8559 0%, #FAE588 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`);

globalsCss = globalsCss.replace(/\.cta-button \{[\s\S]*?\}/m, `.cta-button {
  background: linear-gradient(135deg, #FF8559 0%, #E66A3D 100%);
  position: relative;
  overflow: hidden;
}`);

globalsCss = globalsCss.replace(/\.how-it-works-bg \{[\s\S]*?\}/m, `.how-it-works-bg {
  background: linear-gradient(180deg, #1C2023 0%, #2A3034 100%);
}`);

globalsCss = globalsCss.replace(/\.step-number \{[\s\S]*?\}/m, `.step-number {
  background: linear-gradient(135deg, #FF8559 0%, #FAE588 100%);
  box-shadow: 0 4px 14px rgba(255, 133, 89, 0.3);
}`);

globalsCss = globalsCss.replace(/\.cta-section \{[\s\S]*?\}/m, `.cta-section {
  background: linear-gradient(135deg, #FF8559 0%, #E66A3D 50%, #CC5020 100%);
  position: relative;
  overflow: hidden;
}`);

globalsCss = globalsCss.replace(/\.success-page-bg \{[\s\S]*?\}/m, `.success-page-bg {
  background: linear-gradient(135deg, #2A3034 0%, #1C2023 100%);
  position: relative;
  overflow: hidden;
}`);

globalsCss = globalsCss.replace(/\.signup-bg \{[\s\S]*?\}/m, `.signup-bg {
  background: linear-gradient(135deg, #2A3034 0%, #1C2023 100%);
  position: relative;
  overflow: hidden;
}`);

fs.writeFileSync(globalsCssPath, globalsCss);
console.log('Updated tailwind config and globals.css');
