import os
import re

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="Jeevan Chakra - Life Infrastructure">

    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%230F4C5C'/><circle cx='50' cy='50' r='25' fill='none' stroke='%231B9C85' stroke-width='3'/><circle cx='50' cy='20' r='4' fill='%23F4A261'/></svg>">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/tailwind-config.js"></script>

    <!-- Global Styles & Loader -->
    <link rel="stylesheet" href="/styles.css">
    <script src="/scripts/header-footer-loader.js" defer></script>

    <style>
        body {
            font-family: 'Inter', sans-serif;
            padding-top: 80px;
            background-color: #f9fafb;
        }
    </style>
</head>

<body class="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">

    <!-- HEADER PLACEHOLDER -->
    <div id="header-placeholder"></div>

    <!-- MAIN CONTENT -->
    <main class="flex-grow">
        {content}
    </main>

    <!-- FOOTER PLACEHOLDER -->
    <div id="footer-placeholder"></div>

</body>
</html>"""

def standardize_file(file_path):
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract Title
    title_match = re.search(r'<title>(.*?)</title>', content)
    title = title_match.group(1) if title_match else "Jeevan Chakra"

    # Extract Main Content
    # Logic: Look for the main container div
    # Usually starts after </nav> and ends before <footer, or looks for the specific container class
    
    # Strategy 1: Find the main container div
    container_pattern = r'(<div class="container mx-auto px-4 py-12 max-w-4xl">.*?)(?=\s*<!-- Footer -->|\s*<footer)'
    content_match = re.search(container_pattern, content, re.DOTALL)
    
    if content_match:
        main_content = content_match.group(1)
        # Remove any "Back to Home" buttons at the bottom if inside the container
        main_content = re.sub(r'<div class="text-center mt-8">.*?Back to Home.*?</div>', '', main_content, flags=re.DOTALL)
    else:
        # Strategy 2: Fallback - grab everything between </nav> and <footer
        print(f"  Warning: Strict container match failed for {file_path}, trying fallback...")
        fallback_pattern = r'</nav>(.*?)<footer'
        fallback_match = re.search(fallback_pattern, content, re.DOTALL)
        if fallback_match:
             main_content = fallback_match.group(1).strip()
        else:
            print(f"  Error: Could not extract content for {file_path}")
            return

    # Create new file content
    new_content = TEMPLATE.replace('{title}', title).replace('{content}', main_content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  Updated {file_path}")

def main():
    # Legal Pages
    legal_dir = 'legal'
    if os.path.exists(legal_dir):
        for filename in os.listdir(legal_dir):
            if filename.endswith('.html'):
                standardize_file(os.path.join(legal_dir, filename))
    
    # Auth Pages
    auth_files = ['components/auth/login.html', 'components/auth/signup.html']
    for file_path in auth_files:
        if os.path.exists(file_path):
             standardize_file(file_path)

if __name__ == '__main__':
    main()
