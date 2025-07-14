// Footer Component JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for footer to be loaded, then fix links
    setTimeout(() => {
        fixFooterLinks();
        initializeFooterFeatures();
    }, 100);
});

// Function to initialize footer features
function initializeFooterFeatures() {
    // Smooth scrolling for footer anchor links
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update copyright year automatically
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
    }

    // Add hover effects for footer links
    const footerSectionLinks = document.querySelectorAll('.footer-section a');
    footerSectionLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// Function to fix footer links based on current page location
function fixFooterLinks() {
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.includes('/tools/');
    const basePath = isInSubdirectory ? '../' : '';
    
    console.log('Fixing footer links:', { currentPath, isInSubdirectory, basePath });
    
    // Get all footer links that need path correction
    const footerLinks = document.querySelectorAll('.footer a[href*=".html"]');
    console.log('Found footer links:', footerLinks.length);
    
    footerLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        
        // Skip if it's already an absolute path or email link
        if (originalHref.startsWith('http') || originalHref.startsWith('mailto:') || originalHref.startsWith('#')) {
            return;
        }
        
        let newHref = originalHref;
        
        // Fix paths for different page types
        if (originalHref.includes('index.html')) {
            // For links to index.html, use the base path
            newHref = basePath + originalHref;
        } else if (originalHref.includes('tools/tools.html')) {
            // For tools link, adjust based on current location
            newHref = isInSubdirectory ? 'tools.html' : 'tools/tools.html';
        } else {
            // For other pages (impressum, datenschutz, agb), use base path
            newHref = basePath + originalHref;
        }
        
        console.log('Fixing link:', originalHref, '→', newHref);
        link.href = newHref;
    });
}
