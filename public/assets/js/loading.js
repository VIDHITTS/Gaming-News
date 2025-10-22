// Loading States and Skeleton Screen Management

class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.skeletonElements = new Map();
        this.init();
    }

    init() {
        // Set up loading state tracking
        this.setupLoadingStates();
        this.setupEventListeners();
    }

    setupLoadingStates() {
        // Track loading states for different sections
        this.loadingStates.set('game-views', true);
        this.loadingStates.set('game-images', true);
        this.loadingStates.set('news-content', false);
        this.loadingStates.set('awards-content', false);
    }

    setupEventListeners() {
        // Listen for page load events
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeSkeletons();
        });

        // Listen for window load event
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
    }

    initializeSkeletons() {
        // Create skeleton screens for game containers
        this.createGameContainerSkeletons();
        
        // Create skeleton screens for other content areas
        this.createContentSkeletons();
    }

    createGameContainerSkeletons() {
        const gameContainers = document.querySelectorAll('.game-container');
        
        gameContainers.forEach((container, index) => {
            const skeletonId = `game-skeleton-${index}`;
            const skeleton = this.createGameContainerSkeleton();
            
            // Insert skeleton before the actual content
            container.insertAdjacentHTML('beforebegin', skeleton);
            this.skeletonElements.set(skeletonId, {
                element: document.getElementById(skeletonId),
                container: container
            });
        });
    }

    createGameContainerSkeleton() {
        return `
            <div class="game-container-skeleton skeleton-pulse" id="game-skeleton-${this.skeletonElements.size}">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-overlay">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            </div>
        `;
    }

    createContentSkeletons() {
        // Create skeletons for news items
        this.createNewsItemSkeletons();
        
        // Create skeletons for game cards
        this.createGameCardSkeletons();
    }

    createNewsItemSkeletons() {
        const newsGrids = document.querySelectorAll('.news-grid');
        
        newsGrids.forEach((grid, gridIndex) => {
            // Add skeleton items to news grids
            for (let i = 0; i < 3; i++) {
                const skeletonId = `news-skeleton-${gridIndex}-${i}`;
                const skeleton = this.createNewsItemSkeleton();
                grid.insertAdjacentHTML('beforeend', skeleton);
            }
        });
    }

    createNewsItemSkeleton() {
        return `
            <div class="news-item-skeleton skeleton-pulse">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                </div>
            </div>
        `;
    }

    createGameCardSkeletons() {
        const gameRows = document.querySelectorAll('.game-row');
        
        gameRows.forEach((row, rowIndex) => {
            // Add skeleton cards to game rows
            for (let i = 0; i < 4; i++) {
                const skeletonId = `game-card-skeleton-${rowIndex}-${i}`;
                const skeleton = this.createGameCardSkeleton();
                row.insertAdjacentHTML('beforeend', skeleton);
            }
        });
    }

    createGameCardSkeleton() {
        return `
            <div class="game-card-skeleton skeleton-pulse">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton-info">
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                    </div>
                </div>
            </div>
        `;
    }

    showLoadingState(element, loadingType = 'spinner') {
        if (!element) return;

        const loadingElement = this.createLoadingElement(loadingType);
        element.innerHTML = '';
        element.appendChild(loadingElement);
        element.classList.add('loading-to-content');
    }

    createLoadingElement(type) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-content';

        switch (type) {
            case 'spinner':
                loadingDiv.innerHTML = `
                    <div class="loading-spinner"></div>
                `;
                break;
            case 'dots':
                loadingDiv.innerHTML = `
                    <div class="loading-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                `;
                break;
            case 'bar':
                loadingDiv.innerHTML = `
                    <div class="loading-bar">
                        <div class="progress"></div>
                    </div>
                `;
                break;
            case 'viewers':
                loadingDiv.innerHTML = `
                    <div class="viewers-loading">
                        <div class="loading-spinner small"></div>
                        <span>Loading viewers...</span>
                    </div>
                `;
                break;
            default:
                loadingDiv.innerHTML = `
                    <div class="loading-spinner"></div>
                    <span>Loading...</span>
                `;
        }

        return loadingDiv;
    }

    hideSkeleton(skeletonId) {
        const skeletonData = this.skeletonElements.get(skeletonId);
        if (skeletonData) {
            const { element, container } = skeletonData;
            
            // Fade out skeleton
            element.classList.add('fade-out');
            
            // Show actual content with animation
            container.classList.add('content-loading', 'fade-in');
            
            // Remove skeleton after animation
            setTimeout(() => {
                element.remove();
                this.skeletonElements.delete(skeletonId);
            }, 300);
        }
    }

    updateLoadingState(section, isLoading) {
        this.loadingStates.set(section, isLoading);
        this.updateUI(section);
    }

    updateUI(section) {
        switch (section) {
            case 'game-views':
                this.updateGameViewsLoading();
                break;
            case 'game-images':
                this.updateGameImagesLoading();
                break;
            case 'news-content':
                this.updateNewsContentLoading();
                break;
            case 'awards-content':
                this.updateAwardsContentLoading();
                break;
        }
    }

    updateGameViewsLoading() {
        const viewerElements = document.querySelectorAll('[id$="-viewers"]');
        const isLoading = this.loadingStates.get('game-views');

        viewerElements.forEach((element, index) => {
            if (isLoading) {
                this.showLoadingState(element, 'viewers');
            } else {
                // Hide skeleton for this game
                this.hideSkeleton(`game-skeleton-${index}`);
            }
        });
    }

    updateGameImagesLoading() {
        const gameImages = document.querySelectorAll('.game-container img');
        const isLoading = this.loadingStates.get('game-images');

        gameImages.forEach((img, index) => {
            if (isLoading) {
                img.style.opacity = '0.5';
                img.style.filter = 'blur(2px)';
            } else {
                img.style.opacity = '1';
                img.style.filter = 'none';
                img.classList.add('content-loading', 'fade-in');
            }
        });
    }

    updateNewsContentLoading() {
        const newsItems = document.querySelectorAll('.news-item');
        const isLoading = this.loadingStates.get('news-content');

        if (!isLoading) {
            newsItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('content-loading', 'slide-in');
                }, index * 100); // Staggered animation
            });
        }
    }

    updateAwardsContentLoading() {
        const awardCards = document.querySelectorAll('.award-card');
        const isLoading = this.loadingStates.get('awards-content');

        if (!isLoading) {
            awardCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('content-loading', 'fade-in');
                }, index * 150); // Staggered animation
            });
        }
    }

    handlePageLoad() {
        // Simulate content loading with delays
        setTimeout(() => {
            this.updateLoadingState('news-content', false);
        }, 1000);

        setTimeout(() => {
            this.updateLoadingState('awards-content', false);
        }, 1500);
    }

    showLoadingOverlay(message = 'Loading...', subMessage = 'Please wait while we fetch the latest data') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner large"></div>
                <h3>${message}</h3>
                <p>${subMessage}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }

    hideLoadingOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    // Utility method to simulate loading delays
    simulateLoading(duration = 1000, callback) {
        setTimeout(callback, duration);
    }

    // Method to handle smooth transitions between loading and content
    transitionToContent(loadingElement, contentElement, callback) {
        if (!loadingElement || !contentElement) return;

        // Fade out loading element
        loadingElement.style.opacity = '0';
        loadingElement.style.transform = 'translateY(-10px)';

        // Fade in content element
        contentElement.style.opacity = '0';
        contentElement.style.transform = 'translateY(10px)';
        contentElement.style.display = 'block';

        setTimeout(() => {
            loadingElement.style.display = 'none';
            contentElement.style.opacity = '1';
            contentElement.style.transform = 'translateY(0)';
            
            if (callback) callback();
        }, 300);
    }
}

// Enhanced fetch function with loading states
function fetchWithLoading(url, options = {}, loadingManager) {
    return new Promise((resolve, reject) => {
        // Show loading state if loading manager is provided
        if (loadingManager) {
            loadingManager.updateLoadingState('game-views', true);
        }

        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                // Hide loading state
                if (loadingManager) {
                    loadingManager.updateLoadingState('game-views', false);
                }
                resolve(data);
            })
            .catch(error => {
                // Hide loading state on error
                if (loadingManager) {
                    loadingManager.updateLoadingState('game-views', false);
                }
                reject(error);
            });
    });
}

// Initialize loading manager when DOM is ready
let loadingManager;
document.addEventListener('DOMContentLoaded', () => {
    loadingManager = new LoadingManager();
    
    // Add page loading progress bar
    addPageLoadingProgress();
    
    // Initialize page transition loading
    initializePageTransitions();
});

// Add page loading progress bar
function addPageLoadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress';
    progressBar.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => progressBar.remove(), 500);
            }, 300);
        }
        progressBar.querySelector('.progress-bar').style.width = progress + '%';
    }, 100);
}

// Initialize page transition loading
function initializePageTransitions() {
    // Add loading state to all links
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only handle internal navigation
            if (link.hostname === window.location.hostname) {
                showPageLoadingOverlay();
            }
        });
    });
}

// Show page loading overlay
function showPageLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-loading-overlay';
    overlay.innerHTML = `
        <div class="page-loading-content">
            <div class="loading-spinner large"></div>
            <h2>Loading Page...</h2>
            <p>Please wait while we load the content</p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Remove overlay after a short delay (simulating page load)
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 500);
    }, 800);
}

// Enhanced loading state management
function enhanceGameViewersLoading() {
    // Override the existing updateGameViews function with enhanced loading
    if (window.updateGameViews) {
        const originalUpdateGameViews = window.updateGameViews;
        window.updateGameViews = function(game) {
            const viewerElement = document.getElementById(`${game}-viewers`);
            const gameContainer = document.querySelector(`[data-game="${game}"]`);
            
            // Enhanced loading state
            viewerElement.innerHTML = `
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <span>Loading viewers...</span>
            `;
            viewerElement.className = 'game-text viewers-loading';
            
            if (gameContainer) {
                gameContainer.classList.add('loading');
            }
            
            // Call original function with enhanced error handling
            fetch(`data/${game}_views.txt`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    // Smooth transition to loaded content
                    viewerElement.style.opacity = '0';
                    viewerElement.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        viewerElement.innerHTML = data;
                        viewerElement.className = 'game-text viewers-loaded';
                        viewerElement.style.opacity = '1';
                        viewerElement.style.transform = 'translateY(0)';
                        
                        if (gameContainer) {
                            gameContainer.classList.remove('loading');
                            gameContainer.classList.add('loaded');
                        }
                    }, 400);
                })
                .catch(error => {
                    console.error('Error loading viewers:', error);
                    viewerElement.innerHTML = "Error loading viewers";
                    viewerElement.className = 'game-text viewers-error';
                    viewerElement.style.opacity = '1';
                    viewerElement.style.transform = 'translateY(0)';
                    
                    if (gameContainer) {
                        gameContainer.classList.remove('loading');
                    }
                });
        };
    }
}

// Initialize enhanced loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    enhanceGameViewersLoading();
});

// Export for use in other scripts
window.LoadingManager = LoadingManager;
window.loadingManager = loadingManager;
window.showPageLoadingOverlay = showPageLoadingOverlay;
