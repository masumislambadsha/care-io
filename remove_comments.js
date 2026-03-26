const fs = require('fs');
const path = require('path');

function removeComments(content) {
    // Remove the JSX style comments: {/* ... */}
    let newContent = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // Remove the multi-line JS comments: /* ... */
    newContent = newContent.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove the single-line comments: // ...
    // Using a negative lookbehind (?<!:) to ignore URLs like http:// or https://
    newContent = newContent.replace(/(?<!:)\/\/.*$/gm, '');
    
    // Replace consecutive blank lines with a structured layout
    newContent = newContent.replace(/\n{3,}/g, '\n\n');
    
    return newContent;
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = removeComments(content);
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Removed comments in: ${fullPath}`);
            }
        }
    }
}

const srcDir = path.join(process.cwd(), 'src');
if (fs.existsSync(srcDir)) {
    console.log('Starting comment removal in the src directory...');
    processDirectory(srcDir);
    console.log('Done!');
} else {
    console.log('src directory not found.');
}
