// Navbar Include Script
// This script dynamically includes the navbar component on any page

async function includeNavbar() {
    try {
        // Load navbar HTML
        const navbarResponse = await fetch('components/navbar/navbar.html');
        const navbarHTML = await navbarResponse.text();
        
        // Insert navbar at the beginning of the body
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        
        // Load navbar CSS
        const navbarCSS = document.createElement('link');
        navbarCSS.rel = 'stylesheet';
        navbarCSS.href = 'components/navbar/navbar.css';
        document.head.appendChild(navbarCSS);
        
        // Load navbar JavaScript
        const navbarJS = document.createElement('script');
        navbarJS.src = 'components/navbar/navbar.js';
        document.body.appendChild(navbarJS);
        
        console.log('Navbar component loaded successfully');
    } catch (error) {
        console.error('Error loading navbar component:', error);
    }
}

// Auto-include navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', includeNavbar); 