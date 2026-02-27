const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors
const yellow = '#FAE588';
const orange = '#FF8559';
const slate = '#545F66';
const darkCard = '#353C40';

// General light-to-dark adjustments
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/text-gray-600/g, 'text-slate-300');
content = content.replace(/text-gray-500/g, 'text-slate-400');
content = content.replace(/text-slate-800/g, 'text-white');
content = content.replace(/text-slate-600/g, 'text-slate-300');
content = content.replace(/text-slate-500/g, 'text-slate-400');

// Background adjustments
content = content.replace(/bg-white\/80/g, 'bg-[#1C2023]/80');
content = content.replace(/bg-white/g, 'bg-[#2A3034]');
content = content.replace(/bg-slate-50/g, 'bg-[#1C2023]');
content = content.replace(/bg-slate-900/g, 'bg-[#1C2023]');
content = content.replace(/bg-gray-50/g, 'bg-[#1C2023]');
content = content.replace(/bg-gray-100/g, 'bg-[#353C40]');
content = content.replace(/bg-amber-50/g, 'bg-[#FF8559]/10');
content = content.replace(/bg-blue-50/g, 'bg-[#FF8559]/10');

// Border adjustments
content = content.replace(/border-gray-200/g, 'border-[#353C40]');
content = content.replace(/border-gray-100/g, 'border-[#353C40]');
content = content.replace(/border-slate-100/g, 'border-[#353C40]');
content = content.replace(/border-amber-200/g, 'border-[#FAE588]/20');
content = content.replace(/border-blue-200/g, 'border-[#FF8559]/20');

// Component specific colors
content = content.replace(/bg-amber-100/g, 'bg-[#FAE588]/10');
content = content.replace(/text-amber-800/g, 'text-[#FAE588]');
content = content.replace(/text-amber-700/g, 'text-[#FAE588]');
content = content.replace(/text-amber-600/g, 'text-[#FAE588]');
content = content.replace(/text-amber-500/g, 'text-[#FAE588]');
content = content.replace(/fill-amber-500/g, 'fill-[#FAE588]');
content = content.replace(/text-amber-400/g, 'text-[#FAE588]');
content = content.replace(/border-amber-[0-9]+\/20/g, 'border-[#FAE588]/20');
content = content.replace(/bg-amber-[0-9]+\/10/g, 'bg-[#FAE588]/10');

content = content.replace(/text-blue-700/g, 'text-[#FF8559]');
content = content.replace(/text-blue-600/g, 'text-[#FF8559]');
content = content.replace(/text-blue-500/g, 'text-[#FF8559]');
content = content.replace(/text-blue-400/g, 'text-[#FF8559]');
content = content.replace(/bg-blue-[0-9]+\/10/g, 'bg-[#FF8559]/10');
content = content.replace(/bg-blue-500\/20/g, 'bg-[#FF8559]/20');
content = content.replace(/border-blue-[0-9]+\/20/g, 'border-[#FF8559]/20');

// Adjust pricing box
content = content.replace(/border-blue-500\/20/g, 'border-[#FF8559]/20');

// Button / CTA replacements if they don't use custom CSS classes
content = content.replace(/bg-blue-600/g, 'bg-[#FF8559]');
content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#E66A3D]');

fs.writeFileSync(path, content);
console.log('App/page.tsx updated with dark theme classes.');
