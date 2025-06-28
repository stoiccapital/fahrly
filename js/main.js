// Main JavaScript for Fahrly Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if it's open (with small delay for visual feedback)
                if (navLinks && navLinks.classList.contains('open')) {
                    setTimeout(() => {
                        closeMobileMenu();
                    }, 100);
                }
                
                // Calculate offset for fixed navigation bar
                const navHeight = 80; // 5rem = 80px
                const targetPosition = target.offsetTop - navHeight;
                
                // Smooth scroll to target with offset
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const elementsToObserve = document.querySelectorAll('.section, .hero h1, .hero p, .hero .cta-button, .hero .hero-image');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    // Add hover effects for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add hover effects for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.borderColor = '#1877F2';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            if (!this.classList.contains('featured')) {
                this.style.borderColor = '#e5e7eb';
            }
        });
    });

    // CTA button click tracking (for analytics)
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Track CTA clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': this.textContent.trim()
                });
            }
        });
    });

    // Mobile menu toggle (if needed in future)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }

    // Lazy loading for images (if needed in future)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Enhanced hamburger menu functionality
    var hamburger = document.querySelector('.mobile-nav-bar .hamburger') || document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    var closeNav = document.querySelector('.nav-links .close-nav');
    var body = document.body;
    var mobileLogo = document.querySelector('.mobile-logo');
    
    // Function to close menu
    function closeMobileMenu() {
        console.log('Closing mobile menu...');
        if (navLinks) {
            navLinks.classList.remove('open');
            console.log('Removed "open" class from nav-links');
        }
        body.classList.remove('menu-open');
        // Re-enable body scroll
        body.style.overflow = '';
        // Update ARIA attributes
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
        if (closeNav) {
            closeNav.setAttribute('aria-expanded', 'false');
        }
        // Focus management - return focus to hamburger button
        if (hamburger) {
            hamburger.focus();
        }
        console.log('Mobile menu closed successfully');
    }
    
    // Function to open menu
    function openMobileMenu() {
        if (navLinks) {
            navLinks.classList.add('open');
        }
        body.classList.add('menu-open');
        // Prevent body scroll when menu is open
        body.style.overflow = 'hidden';
        // Update ARIA attributes
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'true');
        }
        if (closeNav) {
            closeNav.setAttribute('aria-expanded', 'true');
        }
        // Focus management - focus first focusable element in menu
        setTimeout(() => {
            if (navLinks) {
                const firstFocusable = navLinks.querySelector('a, button');
                if (firstFocusable) firstFocusable.focus();
            }
        }, 100);
    }
    
    if (hamburger && navLinks && closeNav) {
        // Debounced resize handler for better performance
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('open')) {
                    closeMobileMenu();
                }
            }, 150);
        }
        
        // Hamburger button click handler
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (navLinks.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close button click handler
        closeNav.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked - closing mobile menu');
            closeMobileMenu();
        });
        
        // Mobile logo click handler (also closes menu)
        if (mobileLogo) {
            mobileLogo.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });
        }
        
        // Initial state: menu closed
        closeMobileMenu();
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
                closeMobileMenu();
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', handleResize);
        
        // Click outside to close
        document.addEventListener('click', function(e) {
            if (navLinks && navLinks.classList.contains('open')) {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && !closeNav.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
        
        // Keyboard navigation support
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
        
        closeNav.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeNav.click();
            }
        });
        
        // Touch gesture support for closing menu
        let touchStartX = 0;
        let touchEndX = 0;
        
        navLinks.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        navLinks.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            // Swipe right to close menu
            if (swipeDistance > swipeThreshold && navLinks.classList.contains('open')) {
                closeMobileMenu();
            }
        }

        // Focus trap for mobile menu
        function trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                }
            });
        }
        
        // Apply focus trap to mobile menu
        trapFocus(navLinks);
    }

    // Scroll-based navigation shadow
    let lastScrollTop = 0;
    const nav = document.querySelector('.nav');
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolling down or when not at the top
        if (scrollTop > 10) {
            nav?.classList.add('scrolled');
            mobileLogo?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
            mobileLogo?.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
}); 