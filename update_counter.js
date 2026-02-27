const fs = require('fs');
const path = 'components/FoundingMemberCounter.tsx';
let content = fs.readFileSync(path, 'utf8');

// Background array adjustments
content = content.replace(/"bg-red-50 border-red-200"/g, '"bg-[#FF8559]/20 border-[#FF8559]/40"');
content = content.replace(/"bg-amber-50 border-amber-200"/g, '"bg-[#FAE588]/10 border-[#FAE588]/20"');
content = content.replace(/"bg-blue-50 border-blue-200"/g, '"bg-[#1C2023] border-[#353C40]"');

// Text color adjustments
content = content.replace(/"text-red-600"/g, '"text-[#FF8559]"');
content = content.replace(/"text-amber-600"/g, '"text-[#FAE588]"');
content = content.replace(/"text-blue-600"/g, '"text-slate-300"');

content = content.replace(/"text-red-700"/g, '"text-[#FF8559]"');
content = content.replace(/"text-amber-700"/g, '"text-[#FAE588]"');
content = content.replace(/"text-blue-700"/g, '"text-white"');

// Progress bar gradients
content = content.replace(/"bg-gradient-to-r from-red-500 to-red-400"/g, '"bg-gradient-to-r from-[#FF8559] to-[#E66A3D]"');
content = content.replace(/"bg-gradient-to-r from-amber-500 to-orange-400"/g, '"bg-gradient-to-r from-[#FAE588] to-[#FF8559]"');
content = content.replace(/"bg-gradient-to-r from-blue-500 to-blue-400"/g, '"bg-[#353C40]"');

content = content.replace(/bg-white\/60/g, 'bg-[#1C2023]');
content = content.replace(/border-white/g, 'border-[#353C40]');

fs.writeFileSync(path, content);
console.log('Updated FoundingMemberCounter.tsx');
