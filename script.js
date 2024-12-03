document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');

    // Handle navigation
    function navigateToPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // Set up click handlers for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            navigateToPage(pageId);
            // Update URL without page reload
            window.history.pushState({}, '', `#${pageId}`);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const pageId = window.location.hash.substring(1) || 'home';
        navigateToPage(pageId);
    });

    // Initial page load
    const initialPage = window.location.hash.substring(1) || 'home';
    navigateToPage(initialPage);
});