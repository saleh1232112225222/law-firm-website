import os, re

root = r'C:\Users\saleh\OneDrive\Desktop\law n8n\site\en'
pattern = re.compile(r'<nav class="nav">.*?</nav>', re.DOTALL)

for dirpath, _, filenames in os.walk(root):
    for fn in filenames:
        if fn.lower().endswith('.html'):
            path = os.path.join(dirpath, fn)
            
            # Calculate depth relative to root (en) folder
            rel_dir = os.path.relpath(dirpath, root)
            depth = 0 if rel_dir == '.' else len(rel_dir.replace('\\', '/').split('/'))
            prefix = '../' * depth
            
            new_nav = f'<nav class="nav"><a href="{prefix}index.html">Home</a><a href="{prefix}services.html">Services</a><a href="{prefix}contracts.html">Contracts</a><a href="{prefix}collections.html">Debt Recovery</a><a href="{prefix}blog.html">Blog</a><a href="{prefix}tools/index.html">Calculators</a><a href="{prefix}legal-library/index.html">Legal Library</a><a href="{prefix}legal-templates/index.html">Legal Templates</a><a href="{prefix}booking.html" class="nav-cta">Book a Consultation</a></nav>'
            
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content, count = pattern.subn(new_nav, content)
            if count:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated navigation in: {path}')
