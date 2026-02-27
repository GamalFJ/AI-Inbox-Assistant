const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;

    // General light-to-dark adjustments
    content = content.replace(/text-gray-900/g, 'text-white');
    content = content.replace(/text-gray-800/g, 'text-white');
    content = content.replace(/text-gray-700/g, 'text-slate-200');
    content = content.replace(/text-gray-600/g, 'text-slate-300');
    content = content.replace(/text-gray-500/g, 'text-slate-400');
    content = content.replace(/text-slate-900/g, 'text-white');
    content = content.replace(/text-slate-800/g, 'text-white');
    content = content.replace(/text-slate-700/g, 'text-slate-200');
    content = content.replace(/text-slate-600/g, 'text-slate-300');
    content = content.replace(/text-slate-500/g, 'text-slate-400');

    // Background adjustments
    content = content.replace(/bg-white\/80/g, 'bg-[#1C2023]/80');
    content = content.replace(/bg-white/g, 'bg-[#2A3034]');
    content = content.replace(/bg-slate-50/g, 'bg-[#1C2023]');
    content = content.replace(/bg-slate-100/g, 'bg-[#353C40]');
    content = content.replace(/bg-slate-900/g, 'bg-[#1C2023]');
    content = content.replace(/bg-gray-50/g, 'bg-[#1C2023]');
    content = content.replace(/bg-gray-100/g, 'bg-[#353C40]');

    // Border adjustments
    content = content.replace(/border-gray-200/g, 'border-[#353C40]');
    content = content.replace(/border-gray-100/g, 'border-[#353C40]');
    content = content.replace(/border-slate-200/g, 'border-[#353C40]');
    content = content.replace(/border-slate-100/g, 'border-[#353C40]');
    content = content.replace(/border-amber-200/g, 'border-[#FAE588]/20');
    content = content.replace(/border-blue-200/g, 'border-[#FF8559]/20');

    // Component specific colors
    content = content.replace(/text-blue-700/g, 'text-white');
    content = content.replace(/text-blue-600/g, 'text-[#FF8559]');
    content = content.replace(/text-amber-600/g, 'text-[#FAE588]');
    content = content.replace(/text-blue-500/g, 'text-[#FF8559]');

    content = content.replace(/bg-blue-[0-9]+\/10/g, 'bg-[#FF8559]/10');
    content = content.replace(/bg-amber-[0-9]+\/10/g, 'bg-[#FAE588]/10');

    // Form & Buttons
    content = content.replace(/bg-blue-600/g, 'bg-[#FF8559]');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#E66A3D]');

    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log('Updated:', filePath);
    }
}

walkDir('app', processFile);
walkDir('components', processFile);
console.log('Completed global update!');
