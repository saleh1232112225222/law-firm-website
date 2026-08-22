const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, 'link_check_results.json');
if (!fs.existsSync(resultsPath)) {
    console.error('link_check_results.json not found!');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const broken = data.brokenLinks;

console.log(`Analyzing ${broken.length} broken links...`);

const grouped = {};
broken.forEach(b => {
    if (!grouped[b.reason]) grouped[b.reason] = [];
    grouped[b.reason].push(b);
});

console.log('\n--- Grouped by Reason ---');
for (const reason in grouped) {
    console.log(`- ${reason}: ${grouped[reason].length} occurrences`);
}

// Analyze the English paths issue (../../en/... vs ../en/...)
const enBlogIssues = broken.filter(b => b.file.startsWith('en/') && b.link.includes('/en/'));
console.log(`\n- English subdirectory navigation issues: ${enBlogIssues.length}`);
if (enBlogIssues.length > 0) {
    console.log('  Example file:', enBlogIssues[0].file);
    console.log('  Example link:', enBlogIssues[0].link);
}

// Analyze other broken links (e.g. files that are missing or referenced wrongly)
const otherIssues = broken.filter(b => !enBlogIssues.includes(b));
console.log(`\n- Other issues: ${otherIssues.length}`);
const fileStats = {};
otherIssues.forEach(b => {
    fileStats[b.file] = (fileStats[b.file] || 0) + 1;
});
console.log('  Files containing other broken links (top 10):');
Object.entries(fileStats).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([file, count]) => {
    console.log(`    * ${file}: ${count} broken links`);
});

// Let's print some of these other broken links to understand them
console.log('\n  Examples of other broken links:');
otherIssues.slice(0, 15).forEach(b => {
    console.log(`    * In "${b.file}": Link "${b.link}" (${b.reason})`);
});
