const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf8');

code = code.replace(/\.success-card \{[\s\S]*?\}/m, `.success-card {
  background: rgba(28, 32, 35, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(68, 77, 83, 0.7);
  border-radius: 2rem;
  padding: 3rem 2.5rem;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.2),
    0 24px 64px rgba(0, 0, 0, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.1) inset;
}`);

code = code.replace(/\.signup-card \{[\s\S]*?\}/m, `.signup-card {
  background: rgba(28, 32, 35, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(68, 77, 83, 0.7);
  border-radius: 2rem;
  padding: 2.5rem 2rem;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.2),
    0 24px 64px rgba(0, 0, 0, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.1) inset;
}`);

code = code.replace(/\.signup-input \{[\s\S]*?\}/m, `.signup-input {
  border: 1.5px solid #444D53;
  border-radius: 0.75rem;
  background: #2A3034;
  color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}`);

code = code.replace(/\.signup-price-box \{[\s\S]*?\}/m, `.signup-price-box {
  background: linear-gradient(135deg, rgba(28, 32, 35, 1) 0%, rgba(42, 48, 52, 1) 100%);
  border: 1.5px solid #444D53;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
}`);

fs.writeFileSync('app/globals.css', code);
console.log('Fixed cards in globals.css');
