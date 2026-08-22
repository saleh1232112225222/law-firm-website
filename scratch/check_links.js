const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
console.log('Scanning directory:', ROOT_DIR);

// Exclude these directories
const EXCLUDE_DIRS = ['.git', 'node_modules', 'lighthouse-report', 'scratch'];

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(file)) {
                getAllHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Simple parser for href and src
function extractLinks(content) {
    const links = [];
    // Match href="..." and src="..."
    const hrefRegex = /href=["']([^"']+)["']/g;
    const srcRegex = /src=["']([^"']+)["']/g;
    
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        links.push({ type: 'href', value: match[1], index: match.index });
    }
    while ((match = srcRegex.exec(content)) !== null) {
        links.push({ type: 'src', value: match[1], index: match.index });
    }
    return links;
}

// Parse redirects file to resolve clean URLs if necessary
const redirects = [];
try {
    const redirectsContent = fs.readFileSync(path.join(ROOT_DIR, '_redirects'), 'utf8');
    redirectsContent.split('\n').forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
            redirects.push({
                from: parts[0],
                to: parts[1],
                code: parts[2] || ''
            });
        }
    });
} catch (e) {
    console.log('No _redirects file found or error reading it:', e.message);
}

// Utility to find if a file exists locally
function checkLocalPath(linkVal, currentFileDir) {
    // Strip query parameters and anchors
    let cleanUrl = linkVal.split('?')[0].split('#')[0];
    if (!cleanUrl) return { exists: true, resolved: '' }; // Just an anchor or query on the current page
    
    let targetPath;
    if (cleanUrl.startsWith('/')) {
        targetPath = path.join(ROOT_DIR, cleanUrl);
    } else {
        targetPath = path.join(currentFileDir, cleanUrl);
    }
    
    // Check direct match
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
        return { exists: true, resolved: targetPath };
    }
    
    // If it's a directory, check for index.html inside it
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
        const indexHtml = path.join(targetPath, 'index.html');
        if (fs.existsSync(indexHtml)) {
            return { exists: true, resolved: indexHtml };
        }
    }
    
    // Check if adding .html helps (Clean URLs: e.g. /services -> services.html)
    const withHtml = targetPath + '.html';
    if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) {
        return { exists: true, resolved: withHtml };
    }
    
    // Check if it's in the redirects map
    // e.g. /services -> /services.html
    const normalizedCleanUrl = cleanUrl.startsWith('/') ? cleanUrl : '/' + path.relative(ROOT_DIR, path.join(currentFileDir, cleanUrl)).replace(/\\/g, '/');
    const redirectMatch = redirects.find(r => r.from === normalizedCleanUrl || r.to === normalizedCleanUrl);
    if (redirectMatch) {
        // Resolve the redirect target
        let redirectTarget = redirectMatch.to;
        if (!redirectTarget.endsWith('.html') && !redirectTarget.includes('.')) {
            // E.g. /services -> check /services.html
            const redirectFile = path.join(ROOT_DIR, redirectTarget + '.html');
            if (fs.existsSync(redirectFile)) {
                return { exists: true, resolved: redirectFile };
            }
        } else {
            const redirectFile = path.join(ROOT_DIR, redirectTarget);
            if (fs.existsSync(redirectFile)) {
                return { exists: true, resolved: redirectFile };
            }
        }
    }
    
    return { exists: false, resolved: targetPath };
}

// Keep track of anchors for each file to verify anchor links
const fileAnchorCache = {};

function checkAnchor(filePath, anchor) {
    if (!anchor) return true;
    
    let content;
    if (fileAnchorCache[filePath]) {
        content = fileAnchorCache[filePath];
    } else {
        try {
            content = fs.readFileSync(filePath, 'utf8');
            fileAnchorCache[filePath] = content;
        } catch (e) {
            return false;
        }
    }
    
    // Match id="anchor" or name="anchor"
    // Using a flexible regex for quotes
    const idRegex = new RegExp(`id=["']${anchor}["']`, 'i');
    const nameRegex = new RegExp(`name=["']${anchor}["']`, 'i');
    
    return idRegex.test(content) || nameRegex.test(content);
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);
console.log(`Found ${htmlFiles.length} HTML files.`);

const brokenLinks = [];
const externalLinks = [];
const summary = {
    totalLinks: 0,
    internalLinks: 0,
    externalLinks: 0,
    brokenInternal: 0,
    brokenAnchors: 0
};

htmlFiles.forEach(file => {
    const fileRelative = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const links = extractLinks(content);
    const fileDir = path.dirname(file);
    
    links.forEach(link => {
        summary.totalLinks++;
        const val = link.value.trim();
        
        // Skip telephone, mail, javascript links
        if (val.startsWith('tel:') || val.startsWith('mailto:') || val.startsWith('javascript:') || val === '#') {
            return;
        }
        
        // External link check
        if (val.startsWith('http://') || val.startsWith('https://')) {
            // If it's our own domain, treat it as internal
            if (val.startsWith('https://saleh-lawyer.com/') || val.startsWith('http://saleh-lawyer.com/') || val.startsWith('https://saleh-lawyer.com') || val.startsWith('http://saleh-lawyer.com')) {
                let localPart = val.replace(/^https?:\/\/saleh-lawyer\.com/, '');
                if (!localPart.startsWith('/')) localPart = '/' + localPart;
                
                // Parse anchor
                const anchorParts = localPart.split('#');
                const cleanLocalPart = anchorParts[0];
                const anchor = anchorParts[1];
                
                const check = checkLocalPath(cleanLocalPart, fileDir);
                summary.internalLinks++;
                if (!check.exists) {
                    summary.brokenInternal++;
                    brokenLinks.push({
                        file: fileRelative,
                        link: val,
                        type: link.type,
                        reason: 'File does not exist (custom domain reference)'
                    });
                } else if (anchor && check.resolved) {
                    const anchorExists = checkAnchor(check.resolved, anchor);
                    if (!anchorExists) {
                        summary.brokenAnchors++;
                        brokenLinks.push({
                            file: fileRelative,
                            link: val,
                            type: link.type,
                            reason: `Anchor #${anchor} not found in ${path.relative(ROOT_DIR, check.resolved).replace(/\\/g, '/')}`
                        });
                    }
                }
            } else {
                summary.externalLinks++;
                externalLinks.push({
                    file: fileRelative,
                    link: val,
                    type: link.type
                });
            }
            return;
        }
        
        // Internal link
        summary.internalLinks++;
        const anchorParts = val.split('#');
        const cleanVal = anchorParts[0];
        const anchor = anchorParts[1];
        
        // Resolve path
        const check = checkLocalPath(cleanVal, fileDir);
        if (!check.exists) {
            summary.brokenInternal++;
            brokenLinks.push({
                file: fileRelative,
                link: val,
                type: link.type,
                reason: 'File does not exist'
            });
        } else if (anchor) {
            // Check anchor in the file
            const resolvedFile = check.resolved || file; // If cleanVal is empty, anchor is on current file
            const anchorExists = checkAnchor(resolvedFile, anchor);
            if (!anchorExists) {
                summary.brokenAnchors++;
                brokenLinks.push({
                    file: fileRelative,
                    link: val,
                    type: link.type,
                    reason: `Anchor #${anchor} not found in ${path.relative(ROOT_DIR, resolvedFile).replace(/\\/g, '/')}`
                });
            }
        }
    });
});

console.log('\n--- SCAN COMPLETE ---');
console.log('Total Links Processed:', summary.totalLinks);
console.log('Internal Links:', summary.internalLinks);
console.log('External Links:', summary.externalLinks);
console.log('Broken Internal Links:', summary.brokenInternal);
console.log('Broken Anchors:', summary.brokenAnchors);

if (brokenLinks.length > 0) {
    console.log('\n--- BROKEN LINKS FOUND ---');
    brokenLinks.forEach((item, index) => {
        console.log(`${index + 1}. File: ${item.file}`);
        console.log(`   Link: [${item.type}] "${item.link}"`);
        console.log(`   Reason: ${item.reason}`);
        console.log('------------------------');
    });
} else {
    console.log('\n✅ No broken internal links or anchors found!');
}

// Write the output to a JSON file for analysis
fs.writeFileSync(
    path.join(__dirname, 'link_check_results.json'),
    JSON.stringify({ summary, brokenLinks, externalLinks }, null, 2),
    'utf8'
);
console.log('Results written to scratch/link_check_results.json');
