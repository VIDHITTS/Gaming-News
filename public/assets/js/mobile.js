/**
 * Mobile Responsiveness and Touch Optimization
 * Handles mobile navigation, touch interactions, and responsive behavior
 */

class MobileManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        this.isTouch = 'ontouchstart' in window;
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupTouchOptimizations();
        this.setupResponsiveHandlers();
        this.setupScrollOptimizations();
        this.setupOrientationHandlers();
    }

    setupMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const sidebar = document.getElementById('sidebar');
        
        if (!mobileMenuToggle || !mobileMenuOverlay || !sidebar) return;

        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when overlay is clicked
        mobileMenuOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        
        // Close mobile menu when navigation link is clicked
        const navLinks = document.querySelectorAll('.connect li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        sidebar.classList.toggle('mobile-open');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        sidebar.classList.remove('mobile-open');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupTouchOptimizations() {
        if (!this.isTouch) return;

        // Add touch-friendly classes
        document.body.classList.add('touch-device');

        // Optimize touch targets
        const touchTargets = document.querySelectorAll('button, .game-container, .game-card, .news-item, .award-card');
        touchTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });

        // Improve touch scrolling
        const scrollableElements = document.querySelectorAll('.box-main, .game_of_year, .game-row, .scroll-container');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.scrollBehavior = 'smooth';
        });

        // Add touch feedback
        const interactiveElements = document.querySelectorAll('.game-container, .game-card, .news-item, .award-card, button');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    setupResponsiveHandlers() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });
    }

    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        const newIsTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            this.isTablet = newIsTablet;
            
            if (!this.isMobile) {
                this.closeMobileMenu();
            }
            
            this.updateLayout();
        }
    }

    handleOrientationChange() {
        // Recalculate layout after orientation change
        this.updateLayout();
        
        // Close mobile menu if open
        if (this.isMobile) {
            this.closeMobileMenu();
        }
    }

    updateLayout() {
        // Update responsive classes
        document.body.classList.toggle('mobile-layout', this.isMobile);
        document.body.classList.toggle('tablet-layout', this.isTablet);
        
        // Update viewport height for mobile browsers
        if (this.isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }

    setupScrollOptimizations() {
        // Smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(() => {
                this.handleScroll();
            });
        });
    }

    handleScroll() {
        // Add scroll-based classes for performance optimization
        const scrollY = window.scrollY;
        
        document.body.classList.toggle('scrolled', scrollY > 50);
        
        // Hide/show mobile menu toggle based on scroll
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle && this.isMobile) {
            mobileMenuToggle.classList.toggle('scroll-hidden', scrollY > 100);
        }
    }

    setupOrientationHandlers() {
        // Handle orientation-specific adjustments
        const handleOrientation = () => {
            if (this.isMobile) {
                const isLandscape = window.innerWidth > window.innerHeight;
                document.body.classList.toggle('landscape', isLandscape);
                document.body.classList.toggle('portrait', !isLandscape);
            }
        };

        window.addEventListener('orientationchange', handleOrientation);
        window.addEventListener('resize', handleOrientation);
        handleOrientation(); // Initial call
    }

    // Utility methods
    isDevice(device) {
        switch (device) {
            case 'mobile':
                return this.isMobile;
            case 'tablet':
                return this.isTablet;
            case 'desktop':
                return !this.isMobile && !this.isTablet;
            case 'touch':
                return this.isTouch;
            default:
                return false;
        }
    }

    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isTouch: this.isTouch,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
    }
}

// Initialize mobile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileManager = new MobileManager();
});

// Export for use in other scripts
window.MobileManager = MobileManager;
