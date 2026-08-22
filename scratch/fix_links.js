const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
console.log('Fixing links in workspace:', ROOT_DIR);

function fixEnglishNav() {
    console.log('\n--- Fixing English navigation links dynamically ---');
    const enDir = path.join(ROOT_DIR, 'en');
    
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git') {
                    walkDir(filePath);
                }
            } else if (file.endsWith('.html')) {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Compute depth relative to 'en/' directory
                const relPath = path.relative(enDir, dir);
                const depth = relPath === '' ? 0 : relPath.replace(/\\/g, '/').split('/').length;
                const prefix = '../'.repeat(depth);
                
                const navPattern = /<nav class="nav">[\s\S]*?<\/nav>/;
                const newNav = `<nav class="nav"><a href="${prefix}index.html">Home</a><a href="${prefix}services.html">Services</a><a href="${prefix}contracts.html">Contracts</a><a href="${prefix}collections.html">Debt Recovery</a><a href="${prefix}blog.html">Blog</a><a href="${prefix}tools/index.html">Calculators</a><a href="${prefix}legal-library/index.html">Legal Library</a><a href="${prefix}legal-templates/index.html">Legal Templates</a><a href="${prefix}booking.html" class="nav-cta">Book a Consultation</a></nav>`;
                
                if (navPattern.test(content)) {
                    content = content.replace(navPattern, newNav);
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated nav in: en/${path.relative(enDir, filePath).replace(/\\/g, '/')}`);
                }
            }
        });
    }
    walkDir(enDir);
}

function updatePythonScript() {
    console.log('\n--- Updating en/update_nav.py helper script ---');
    const pyPath = path.join(ROOT_DIR, 'en', 'update_nav.py');
    const pyContent = `import os, re

root = r'C:\\Users\\saleh\\OneDrive\\Desktop\\law n8n\\site\\en'
pattern = re.compile(r'<nav class="nav">.*?</nav>', re.DOTALL)

for dirpath, _, filenames in os.walk(root):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            
            # Calculate depth relative to root (en) folder
            rel_dir = os.path.relpath(dirpath, root)
            depth = 0 if rel_dir == '.' else len(rel_dir.replace('\\\\', '/').split('/'))
            prefix = '../' * depth
            
            new_nav = f'<nav class="nav"><a href="{prefix}index.html">Home</a><a href="{prefix}services.html">Services</a><a href="{prefix}contracts.html">Contracts</a><a href="{prefix}collections.html">Debt Recovery</a><a href="{prefix}blog.html">Blog</a><a href="{prefix}tools/index.html">Calculators</a><a href="{prefix}legal-library/index.html">Legal Library</a><a href="{prefix}legal-templates/index.html">Legal Templates</a><a href="{prefix}booking.html" class="nav-cta">Book a Consultation</a></nav>'
            
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content, count = pattern.subn(new_nav, content)
            if count:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated navigation in: {path}')
`;
    fs.writeFileSync(pyPath, pyContent, 'utf8');
    console.log('Successfully updated en/update_nav.py');
}

function fixAssetsAndMisc() {
    console.log('\n--- Fixing specific files and asset paths ---');
    
    // 1. en/blog/commercial-debt-collection.html & partnership-agreements-ksa.html (JS Path)
    const blogFiles = [
        path.join(ROOT_DIR, 'en', 'blog', 'commercial-debt-collection.html'),
        path.join(ROOT_DIR, 'en', 'blog', 'partnership-agreements-ksa.html')
    ];
    blogFiles.forEach(file => {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            content = content.replace('src="../assets/js/main.js"', 'src="../../assets/js/main.js"');
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed assets JS path in: ${path.relative(ROOT_DIR, file)}`);
        }
    });

    // 2. en/legal-library/index.html (CSS and JS Path + specific body links)
    const enLibFile = path.join(ROOT_DIR, 'en', 'legal-library', 'index.html');
    if (fs.existsSync(enLibFile)) {
        let content = fs.readFileSync(enLibFile, 'utf8');
        content = content.replace('href="../assets/css/style.css"', 'href="../../assets/css/style.css"');
        content = content.replace('src="../assets/js/main.js"', 'src="../../assets/js/main.js"');
        
        // Fix body links that have extra "../en/"
        content = content.replace(/href="\.\.\/en\/index\.html"/g, 'href="../index.html"');
        content = content.replace(/href="\.\.\/en\/booking\.html"/g, 'href="../booking.html"');
        content = content.replace(/href="\.\.\/en\/collections\.html"/g, 'href="../collections.html"');
        
        fs.writeFileSync(enLibFile, content, 'utf8');
        console.log('Fixed assets CSS/JS paths and body links in en/legal-library/index.html');
    }

    // 3. landing.html (Arabic language toggle)
    const landingFile = path.join(ROOT_DIR, 'landing.html');
    if (fs.existsSync(landingFile)) {
        let content = fs.readFileSync(landingFile, 'utf8');
        content = content.replace('href="landing-en.html"', 'href="en/landing-en.html"');
        fs.writeFileSync(landingFile, content, 'utf8');
        console.log('Fixed landing page language switcher in landing.html');
    }

    // 4. en/contracts.html (Drafting index page inner contract links)
    const enContractsFile = path.join(ROOT_DIR, 'en', 'contracts.html');
    if (fs.existsSync(enContractsFile)) {
        let content = fs.readFileSync(enContractsFile, 'utf8');
        content = content.replace('href="construction.html"', 'href="contracts/construction.html"');
        content = content.replace('href="partnership.html"', 'href="contracts/partnership.html"');
        content = content.replace('href="supply.html"', 'href="contracts/supply.html"');
        fs.writeFileSync(enContractsFile, content, 'utf8');
        console.log('Fixed sub-contract link targets in en/contracts.html');
    }

    // 5. Language switches in 3 Arabic blog files that lack translations
    const missingTranslBlogFiles = [
        {
            file: path.join(ROOT_DIR, 'blog', 'perjury-penalty-saudi-arabia.html'),
            origLink1: '../en/blog/perjury-penalty-saudi-arabia.html',
            origLink2: 'https://saleh-lawyer.com/en/blog/perjury-penalty-saudi-arabia'
        },
        {
            file: path.join(ROOT_DIR, 'blog', 'execution-court-riyadh.html'),
            origLink1: '../en/blog/execution-court-riyadh.html',
            origLink2: null
        },
        {
            file: path.join(ROOT_DIR, 'blog', 'financial-claim-form-riyadh.html'),
            origLink1: '../en/blog/financial-claim-form-riyadh.html',
            origLink2: null
        }
    ];

    missingTranslBlogFiles.forEach(item => {
        if (fs.existsSync(item.file)) {
            let content = fs.readFileSync(item.file, 'utf8');
            content = content.replace(new RegExp(item.origLink1.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '../en/blog.html');
            if (item.origLink2) {
                content = content.replace(new RegExp(item.origLink2.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), 'https://saleh-lawyer.com/en/blog.html');
            }
            fs.writeFileSync(item.file, content, 'utf8');
            console.log(`Updated language switch target to fallback in: ${path.relative(ROOT_DIR, item.file)}`);
        }
    });

    // 6. Arabic legal-library/index.html (Navigation and Quick links to parent directory)
    const arLibFile = path.join(ROOT_DIR, 'legal-library', 'index.html');
    if (fs.existsSync(arLibFile)) {
        let content = fs.readFileSync(arLibFile, 'utf8');
        
        // Fix header navigation links
        const arNavPattern = /<nav class="nav">[\s\S]*?<\/nav>/;
        const correctArNav = `<nav class="nav"><a href="../index.html">الرئيسية</a><a href="../services.html">خدمات الشركات</a><a href="../contracts.html">العقود التجارية</a><a href="../collections.html">التحصيل والتنفيذ</a><a href="../blog.html">المدونة</a><a href="../booking.html" class="nav-cta">احجز استشارة</a></nav>`;
        content = content.replace(arNavPattern, correctArNav);

        // Fix header logo
        content = content.replace('href="index.html" class="logo"', 'href="../index.html" class="logo"');

        // Fix language toggle (point to English library index rather than generic en/services)
        content = content.replace('href="../en/services.html" class="lang-toggle"', 'href="../en/legal-library/index.html" class="lang-toggle"');

        // Fix footer quick links
        // We find the footer content area and prefix quick links
        const footerSectionPattern = /<h4>روابط سريعة<\/h4>\s*<ul>([\s\S]*?)<\/ul>/;
        const footerMatch = footerSectionPattern.exec(content);
        if (footerMatch) {
            let footerList = footerMatch[1];
            // Prefix index.html, services.html, contracts.html, collections.html, blog.html with ../
            footerList = footerList.replace(/href="index.html"/g, 'href="../index.html"');
            footerList = footerList.replace(/href="services.html"/g, 'href="../services.html"');
            footerList = footerList.replace(/href="contracts.html"/g, 'href="../contracts.html"');
            footerList = footerList.replace(/href="collections.html"/g, 'href="../collections.html"');
            footerList = footerList.replace(/href="blog.html"/g, 'href="../blog.html"');
            content = content.replace(footerMatch[0], `<h4>روابط سريعة</h4>\r\n<ul>${footerList}</ul>`);
        }

        // Fix footer services list
        const footerServicesPattern = /<h4>الخدمات<\/h4>\s*<ul>([\s\S]*?)<\/ul>/;
        const servicesMatch = footerServicesPattern.exec(content);
        if (servicesMatch) {
            let servicesList = servicesMatch[1];
            servicesList = servicesList.replace(/href="contracts.html"/g, 'href="../contracts.html"');
            servicesList = servicesList.replace(/href="compliance.html"/g, 'href="../compliance.html"');
            servicesList = servicesList.replace(/href="services.html"/g, 'href="../services.html"');
            servicesList = servicesList.replace(/href="collections.html"/g, 'href="../collections.html"');
            servicesList = servicesList.replace(/href="booking.html"/g, 'href="../booking.html"');
            content = content.replace(servicesMatch[0], `<h4>الخدمات</h4>\r\n<ul>${servicesList}</ul>`);
        }

        fs.writeFileSync(arLibFile, content, 'utf8');
        console.log('Fixed navigation, language toggle, and footer links in legal-library/index.html');
    }
}

fixEnglishNav();
updatePythonScript();
fixAssetsAndMisc();

console.log('\n✅ All fixes applied successfully.');
