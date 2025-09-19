// Auto-refresh configuration
const AUTO_REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds
const REFRESH_WARNING_TIME = 30000; // Show warning 30 seconds before refresh

// Initialize status page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeStatusPage();
    setupAutoRefresh();
    updateLastRefreshTime();
    initializeStatusAnimations();
});

// Initialize all status page features
function initializeStatusPage() {
    // Add loaded class for animations
    document.body.classList.add('status-loaded');
    
    // Initialize metric counters
    animateMetrics();
    
    // Setup incident card interactions
    setupIncidentInteractions();
    
    // Setup component status interactions
    setupComponentInteractions();
    
    // Initialize real-time status updates (simulated)
    simulateRealTimeUpdates();
}

// Setup auto-refresh functionality
function setupAutoRefresh() {
    let refreshTimer;
    let warningTimer;
    
    // Create refresh notification element
    const refreshNotification = createRefreshNotification();
    
    function scheduleRefresh() {
        // Clear existing timers
        if (refreshTimer) clearTimeout(refreshTimer);
        if (warningTimer) clearTimeout(warningTimer);
        
        // Show warning before refresh
        warningTimer = setTimeout(() => {
            showRefreshWarning(refreshNotification);
        }, AUTO_REFRESH_INTERVAL - REFRESH_WARNING_TIME);
        
        // Auto-refresh the page
        refreshTimer = setTimeout(() => {
            location.reload();
        }, AUTO_REFRESH_INTERVAL);
    }
    
    // Start the refresh cycle
    scheduleRefresh();
    
    // Add manual refresh button
    addManualRefreshButton();
}

// Create refresh notification element
function createRefreshNotification() {
    const notification = document.createElement('div');
    notification.className = 'refresh-notification';
    notification.style.cssText = `
        position: fixed;
        top: 0px;
        right: 0px;
        background: rgba(33, 150, 243, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        font-size: 0.9rem;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    return notification;
}

// Show refresh warning
function showRefreshWarning(notification) {
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>Page will refresh in 30s</span>
            <button onclick="cancelAutoRefresh()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; margin-left: 10px;">&times;</button>
        </div>
    `;
    notification.style.transform = 'translateX(0)';
    
    // Hide notification after 30 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 30000);
}

// Cancel auto refresh
function cancelAutoRefresh() {
    const notification = document.querySelector('.refresh-notification');
    if (notification) {
        notification.style.transform = 'translateX(100%)';
        notification.innerHTML = '<span>Auto-refresh cancelled</span>';
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
            }, 2000);
        }, 100);
    }
}

// Add manual refresh button
function addManualRefreshButton() {
    const refreshButton = document.createElement('button');
    refreshButton.className = 'manual-refresh-btn';
    refreshButton.innerHTML = 'Refresh';
    refreshButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 2rem;
        background: linear-gradient(45deg, #64b5f6, #4a90e2);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(100, 181, 246, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        font-family: 'Inter', sans-serif;
    `;
    
    refreshButton.addEventListener('click', () => {
        refreshButton.innerHTML = 'Refreshing...';
        refreshButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            location.reload();
        }, 500);
    });
    
    refreshButton.addEventListener('mouseenter', () => {
        refreshButton.style.transform = 'translateY(-2px)';
        refreshButton.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.4)';
    });
    
    refreshButton.addEventListener('mouseleave', () => {
        refreshButton.style.transform = 'translateY(0)';
        refreshButton.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.3)';
    });
    
    document.body.appendChild(refreshButton);
}

// Update last refresh time
function updateLastRefreshTime() {
    const now = new Date();
    const refreshNote = document.querySelector('.refresh-note');
    if (refreshNote) {
        const timeString = now.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric'
        }) + ', ' + now.toLocaleTimeString('fr-FR', {
            hour: '2-digit', 
            minute: '2-digit'
        }) + ' UTC';
        
        refreshNote.innerHTML = refreshNote.innerHTML.replace(
            /\d{2} \w+ \d{4}, \d{2}:\d{2} UTC/, 
            timeString
        );
    }
}

// Animate metrics with counting effect
function animateMetrics() {
    const metrics = document.querySelectorAll('.uptime-percentage, .metric-value');
    
    metrics.forEach(metric => {
        const finalValue = metric.textContent;
        const isPercentage = finalValue.includes('%');
        const isTime = finalValue.includes('ms');
        const isMemory = finalValue.includes('MB');
        const isCount = /^\d+$/.test(finalValue);
        
        if (isPercentage) {
            animatePercentage(metric, parseFloat(finalValue));
        } else if (isTime) {
            animateNumber(metric, parseInt(finalValue), 'ms');
        } else if (isMemory) {
            animateNumber(metric, parseInt(finalValue), 'MB');
        } else if (isCount) {
            animateNumber(metric, parseInt(finalValue));
        }
    });
}

// Animate percentage values
function animatePercentage(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(2) + '%';
    }, 40);
}

// Animate number values
function animateNumber(element, target, suffix = '') {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString() + suffix;
    }, 40);
}

// Setup incident card interactions
function setupIncidentInteractions() {
    const incidentCards = document.querySelectorAll('.incident-card');
    
    incidentCards.forEach(card => {
        // Add expand/collapse functionality
        const details = card.querySelector('.incident-details');
        const title = card.querySelector('.incident-title');
        
        if (details && title) {
            // Initially collapse details on mobile
            if (window.innerWidth < 768) {
                details.style.display = 'none';
                title.style.cursor = 'pointer';
                title.addEventListener('click', () => {
                    const isHidden = details.style.display === 'none';
                    details.style.display = isHidden ? 'block' : 'none';
                    card.style.transform = isHidden ? 'translateX(10px)' : 'translateX(5px)';
                });
            }
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
        });
    });
}

// Setup component status interactions
function setupComponentInteractions() {
    const components = document.querySelectorAll('.component-item');
    
    components.forEach(component => {
        component.addEventListener('click', () => {
            // Add click feedback
            component.style.transform = 'translateX(10px) scale(1.02)';
            setTimeout(() => {
                component.style.transform = 'translateX(5px)';
            }, 150);
        });
        
        // Add status pulse animation
        const statusIndicator = component.querySelector('.status-indicator');
        if (statusIndicator && statusIndicator.classList.contains('status-operational')) {
            setInterval(() => {
                statusIndicator.style.opacity = '0.5';
                setTimeout(() => {
                    statusIndicator.style.opacity = '1';
                }, 500);
            }, 3000);
        }
    });
}

// Initialize status animations
function initializeStatusAnimations() {
    // Animate status indicators
    const indicators = document.querySelectorAll('.status-indicator');
    indicators.forEach((indicator, index) => {
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale(0)';
            
            setTimeout(() => {
                indicator.style.transition = 'all 0.3s ease';
                indicator.style.opacity = '1';
                indicator.style.transform = 'scale(1)';
            }, 100);
        }, index * 200);
    });
    
    // Animate cards on scroll
    setupScrollAnimations();
}

// Setup scroll animations
function setupScrollAnimations() {
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

    // Observe status cards
    const cards = document.querySelectorAll('.uptime-card, .incident-card, .performance-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Update response time periodically
    setInterval(() => {
        updateResponseTime();
    }, 30000); // Every 30 seconds
    
    // Update command count
    setInterval(() => {
        updateCommandCount();
    }, 60000); // Every minute
    
    // Simulate occasional status changes (very rare)
    setInterval(() => {
        simulateStatusChange();
    }, 600000); // Every 10 minutes
}

// Update response time with realistic variation
function updateResponseTime() {
    const responseTimeElement = document.querySelector('.performance-card .metric-value');
    if (responseTimeElement && responseTimeElement.textContent.includes('ms')) {
        const currentTime = parseInt(responseTimeElement.textContent);
        const variation = Math.random() * 10 - 5; // ±5ms variation
        const newTime = Math.max(10, Math.round(currentTime + variation));
        
        animateValueChange(responseTimeElement, newTime + 'ms');
    }
}

// Update command count
function updateCommandCount() {
    const commandCountElement = document.querySelector('.performance-card:nth-child(2) .metric-value');
    if (commandCountElement && /^\d{1,3}(,\d{3})*$/.test(commandCountElement.textContent)) {
        const currentCount = parseInt(commandCountElement.textContent.replace(/,/g, ''));
        const increment = Math.floor(Math.random() * 5) + 1; // 1-5 new commands
        const newCount = currentCount + increment;
        
        animateValueChange(commandCountElement, newCount.toLocaleString());
    }
}

// Animate value changes
function animateValueChange(element, newValue) {
    element.style.transition = 'all 0.3s ease';
    element.style.transform = 'scale(1.1)';
    element.style.color = '#81c4ff';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        element.style.color = '#64b5f6';
    }, 150);
}

// Simulate status changes (very rarely)
function simulateStatusChange() {
    console.log('zzz');
}

// Handle visibility change (pause updates when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Status page hidden - pausing updates');
    } else {
        console.log('Status page visible - resuming updates');
        updateLastRefreshTime();
    }
});

// Keyboard shortcuts for status page
document.addEventListener('keydown', (e) => {
    // Press 'R' to refresh
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        location.reload();
    }
    
    // Press 'S' to scroll to status
    if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById('current-status').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
});

// Export functions for potential external use
window.StatusPage = {
    updateLastRefreshTime,
    animateMetrics,
    setupIncidentInteractions,
    setupComponentInteractions,
    cancelAutoRefresh
};