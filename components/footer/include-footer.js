// Footer Include Script
// This script dynamically includes the footer component on any page

async function includeFooter() {
    try {
        // Determine the correct path based on current page location
        const currentPath = window.location.pathname;
        const isInSubdirectory = currentPath.includes('/tools/');
        const basePath = isInSubdirectory ? '../' : '';
        
        // Load footer HTML
        const footerResponse = await fetch(basePath + 'components/footer/footer.html');
        const footerHTML = await footerResponse.text();
        
        // Insert footer before the closing body tag
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        // Load footer CSS
        const footerCSS = document.createElement('link');
        footerCSS.rel = 'stylesheet';
        footerCSS.href = basePath + 'components/footer/footer.css';
        document.head.appendChild(footerCSS);
        
        // Load footer JavaScript
        const footerJS = document.createElement('script');
        footerJS.src = basePath + 'components/footer/footer.js';
        footerJS.onload = function() {
            // Ensure footer links are fixed after footer JS is loaded
            if (typeof fixFooterLinks === 'function') {
                setTimeout(fixFooterLinks, 50);
            }
        };
        document.body.appendChild(footerJS);
        
        console.log('Footer component loaded successfully');
    } catch (error) {
        console.error('Error loading footer component:', error);
    }
}

// Auto-include footer when DOM is loaded
document.addEventListener('DOMContentLoaded', includeFooter); 