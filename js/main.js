// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for animations
    document.body.classList.add('loaded');
    
    // Initialize all features
    createParticles();
    initScrollTop();
    initSmoothScrolling();
    initCommandCardEffects();
    initQAInteractions();
    
    // Add some delay for smooth page load effect
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Create floating particles background
function createParticles() {
    // Check if particles container already exists
    let particlesContainer = document.getElementById('particles');
    
    // Create particles container if it doesn't exist
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.id = 'particles';
        document.body.insertBefore(particlesContainer, document.body.firstChild);
    }
    
    const particleCount = window.innerWidth < 768 ? 30 : 50; // Fewer particles on mobile
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation timing
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Random size variation
        const size = Math.random() * 2 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize scroll to top functionality
function initScrollTop() {
    // Create scroll to top button if it doesn't exist
    let scrollTop = document.getElementById('scrollTop');
    
    if (!scrollTop) {
        scrollTop = document.createElement('div');
        scrollTop.className = 'scroll-top';
        scrollTop.id = 'scrollTop';
        document.body.appendChild(scrollTop);
    }

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    // Add smooth scrolling to all links with hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize command card hover effects
function initCommandCardEffects() {
    const commandCards = document.querySelectorAll('.command-card');
    
    commandCards.forEach(card => {
        // Enhanced hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add click effect for better mobile interaction
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
}

// Initialize Q&A interactions
function initQAInteractions() {
    const questions = document.querySelectorAll('.question');
    const answers = document.querySelectorAll('.answer');
    
    // Add click handlers for questions and answers
    [...questions, ...answers].forEach(element => {
        element.addEventListener('click', function() {
            // Add a subtle pulse effect
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'translateX(8px)';
            }, 100);
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Add intersection observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
}

// Initialize theme-related features
function initThemeFeatures() {
    // Add dynamic color changes based on time of day
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 6 && hour < 18) {
        // Subtle day theme adjustments
        body.style.setProperty('--particle-opacity', '0.2');
    } else {
        // Night theme (default)
        body.style.setProperty('--particle-opacity', '0.4');
    }
}

// Performance optimization for mobile devices
function optimizeForMobile() {
    if (window.innerWidth < 768) {
        // Reduce particle count and effects on mobile
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.remove(); // Remove every other particle
            }
        });
        
        // Disable some heavy animations on mobile
        const commandCards = document.querySelectorAll('.command-card');
        commandCards.forEach(card => {
            card.style.transition = 'transform 0.2s ease';
        });
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    // Recreate particles on significant resize
    if (window.innerWidth !== window.lastWidth) {
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            createParticles();
        }
        window.lastWidth = window.innerWidth;
    }
});

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initScrollAnimations();
    initThemeFeatures();
    optimizeForMobile();
});

// Preload critical resources
function preloadResources() {
    // Preload any critical images or fonts
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.as = 'style';
    document.head.appendChild(link);
}

// Initialize preloading
preloadResources();

// Export functions for potential external use
window.KernelBot = {
    createParticles,
    initScrollTop,
    initSmoothScrolling,
    initCommandCardEffects,
    initQAInteractions
};