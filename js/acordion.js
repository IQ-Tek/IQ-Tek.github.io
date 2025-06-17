/**
 * Enhanced Accordion Component
 * Provides accessible and smooth accordion functionality
 */

class Accordion {
    constructor(selector = '.accordion__toggle') {
        this.toggles = document.querySelectorAll(selector);
        this.activeClass = 'active';
        this.init();
    }

    init() {
        if (this.toggles.length === 0) return;

        this.toggles.forEach(toggle => {
            this.setupToggle(toggle);
        });
    }

    setupToggle(toggle) {
        // Set initial ARIA attributes
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        if (!content) return;

        // Set initial state
        content.classList.toggle(this.activeClass, isExpanded);
        this.updateIcon(toggle, isExpanded);

        // Add click event listener
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleToggle(toggle);
        });

        // Add keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleToggle(toggle);
            }
        });
    }

    handleToggle(toggle) {
        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        
        if (!content) return;

        const isCurrentlyExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const newExpandedState = !isCurrentlyExpanded;

        // Update ARIA attributes
        toggle.setAttribute('aria-expanded', newExpandedState);

        // Toggle content visibility with animation
        if (newExpandedState) {
            this.expand(content);
        } else {
            this.collapse(content);
        }

        // Update icon
        this.updateIcon(toggle, newExpandedState);

        // Optional: Close other accordions (uncomment for single-open behavior)
        // this.closeOthers(toggle);

        // Scroll into view if opening and not fully visible
        if (newExpandedState) {
            setTimeout(() => {
                this.scrollIntoViewIfNeeded(toggle);
            }, 300);
        }
    }

    expand(content) {
        content.classList.add(this.activeClass);
        
        // Smooth height animation
        content.style.height = 'auto';
        const height = content.offsetHeight;
        content.style.height = '0px';
        content.style.overflow = 'hidden';
        
        // Force reflow
        content.offsetHeight;
        
        // Animate to full height
        content.style.transition = 'height 0.3s ease-out';
        content.style.height = height + 'px';
        
        // Clean up after animation
        setTimeout(() => {
            content.style.height = 'auto';
            content.style.overflow = 'visible';
            content.style.transition = '';
        }, 300);
    }

    collapse(content) {
        // Set explicit height before animating
        content.style.height = content.offsetHeight + 'px';
        content.style.overflow = 'hidden';
        content.style.transition = 'height 0.3s ease-out';
        
        // Force reflow
        content.offsetHeight;
        
        // Animate to zero height
        content.style.height = '0px';
        
        // Remove active class after animation
        setTimeout(() => {
            content.classList.remove(this.activeClass);
            content.style.height = '';
            content.style.overflow = '';
            content.style.transition = '';
        }, 300);
    }

    updateIcon(toggle, isExpanded) {
        const icon = toggle.querySelector('.accordion__icon');
        if (icon) {
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            icon.style.transition = 'transform 0.3s ease-out';
        }
    }

    closeOthers(currentToggle) {
        this.toggles.forEach(toggle => {
            if (toggle !== currentToggle && toggle.getAttribute('aria-expanded') === 'true') {
                this.handleToggle(toggle);
            }
        });
    }

    scrollIntoViewIfNeeded(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (!isVisible || rect.top < 100) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Public methods for external control
    expandAll() {
        this.toggles.forEach(toggle => {
            if (toggle.getAttribute('aria-expanded') !== 'true') {
                this.handleToggle(toggle);
            }
        });
    }

    collapseAll() {
        this.toggles.forEach(toggle => {
            if (toggle.getAttribute('aria-expanded') === 'true') {
                this.handleToggle(toggle);
            }
        });
    }

    destroy() {
        this.toggles.forEach(toggle => {
            toggle.removeEventListener('click', this.handleToggle);
            toggle.removeEventListener('keydown', this.handleToggle);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the enhanced accordion
    window.accordionInstance = new Accordion();
    
    // Legacy support for the old implementation
    const legacyToggle = document.querySelector('.accordion-toggle');
    const legacyContent = document.querySelector('.accordion-content');
    
    if (legacyToggle && legacyContent) {
        legacyToggle.addEventListener('click', () => {
            legacyContent.classList.toggle('active');
            const isActive = legacyContent.classList.contains('active');
            legacyToggle.textContent = isActive ? 'Nuestras Apps ▴' : 'Nuestras Apps ▾';
        });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Accordion;
}