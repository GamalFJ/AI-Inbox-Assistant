const fs = require('fs');

const filesToUpdate = [
    'app/signup/page.tsx',
    'app/success/page.tsx',
    'app/login/page.tsx',
    'app/onboarding/page.tsx'
];

for (const path of filesToUpdate) {
    if (!fs.existsSync(path)) continue;
    let content = fs.readFileSync(path, 'utf8');

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

    // Border adjustments
    content = content.replace(/border-gray-200/g, 'border-[#353C40]');
    content = content.replace(/border-gray-100/g, 'border-[#353C40]');
    content = content.replace(/border-slate-100/g, 'border-[#353C40]');
    content = content.replace(/border-amber-200/g, 'border-[#FAE588]/20');
    content = content.replace(/border-blue-200/g, 'border-[#FF8559]/20');

    // Brand colors
    content = content.replace(/text-blue-600/g, 'text-[#FF8559]');
    content = content.replace(/text-amber-600/g, 'text-[#FAE588]');
    content = content.replace(/text-blue-500/g, 'text-[#FF8559]');

    // Form & Buttons
    content = content.replace(/bg-blue-600/g, 'bg-[#FF8559]');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#E66A3D]');

    fs.writeFileSync(path, content);
}

console.log('Updated other landing/auth pages for dark theme.');
