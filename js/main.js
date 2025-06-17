/**
 * Main JavaScript file for IQ-Tek website
 * Handles smooth scrolling, animations, and interactive features
 */

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          this.scrollToElement(targetElement);
        }
      });
    });
  }

  scrollToElement(element, offset = 80) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.observerOptions
      );
      
      // Observe elements that should animate on scroll
      document.querySelectorAll('.card, .section h2, .section p').forEach(el => {
        el.classList.add('animate-on-scroll');
        this.observer.observe(el);
      });
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ===== ENHANCED ACCORDION =====
class EnhancedAccordion {
  constructor() {
    this.accordions = document.querySelectorAll('.accordion__toggle');
    this.init();
  }

  init() {
    this.accordions.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        this.handleToggle(e.target);
      });

      // Add keyboard support
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleToggle(e.target);
        }
      });
    });
  }

  handleToggle(toggle) {
    const content = document.querySelector(toggle.getAttribute('aria-controls'));
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const icon = toggle.querySelector('.accordion__icon');

    // Close all other accordions (optional - remove for multiple open accordions)
    this.accordions.forEach(otherToggle => {
      if (otherToggle !== toggle) {
        otherToggle.setAttribute('aria-expanded', 'false');
        const otherContent = document.querySelector(otherToggle.getAttribute('aria-controls'));
        if (otherContent) {
          otherContent.classList.remove('active');
        }
      }
    });

    // Toggle current accordion
    toggle.setAttribute('aria-expanded', !isExpanded);
    if (content) {
      content.classList.toggle('active', !isExpanded);
    }

    // Animate icon
    if (icon) {
      icon.style.transform = !isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Scroll to accordion if opening and not fully visible
    if (!isExpanded) {
      setTimeout(() => {
        const rect = toggle.getBoundingClientRect();
        if (rect.top < 100) {
          toggle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Log Core Web Vitals
    if ('web-vital' in window) {
      this.measureWebVitals();
    }

    // Monitor loading performance
    window.addEventListener('load', () => {
      this.logLoadPerformance();
    });
  }

  logLoadPerformance() {
    if ('performance' in window) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    }
  }

  measureWebVitals() {
    // This would integrate with web-vitals library if needed
    // For now, just basic performance logging
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.addSkipLink();
    this.enhanceKeyboardNavigation();
    this.addAriaLabels();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceKeyboardNavigation() {
    // Add focus indicators for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  addAriaLabels() {
    // Add missing aria labels
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && !emailLink.getAttribute('aria-label')) {
      emailLink.setAttribute('aria-label', 'Enviar email a contacto.iqtek@gmail.com');
    }
  }
}

// ===== THEME SYSTEM (for future dark mode) =====
class ThemeSystem {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// ===== ANALYTICS & TRACKING =====
class Analytics {
  constructor() {
    this.events = [];
    this.init();
  }

  init() {
    this.trackPageView();
    this.trackInteractions();
  }

  trackPageView() {
    this.logEvent('page_view', {
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }

  trackInteractions() {
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.logEvent('button_click', {
          button_text: e.target.textContent.trim(),
          button_href: e.target.href || null
        });
      });
    });

    // Track accordion interactions
    document.querySelectorAll('.accordion__toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        this.logEvent('accordion_toggle', {
          accordion_title: toggle.textContent.trim()
        });
      });
    });

    // Track download link clicks specifically
    document.querySelectorAll('a[href*="play.google.com"]').forEach(link => {
      link.addEventListener('click', (e) => {
        this.logEvent('app_download_click', {
          app_name: 'Pass Wallet',
          platform: 'Google Play',
          link_text: e.target.textContent.trim(),
          page: window.location.pathname
        });
      });
    });

    // Track external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener('click', (e) => {
        this.logEvent('external_link_click', {
          url: e.target.href,
          link_text: e.target.textContent.trim()
        });
      });
    });
  }

  logEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      data: data,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    this.events.push(event);
    
    // In production, you would send this to your analytics service
    console.log('Analytics Event:', event);
  }
}

// ===== INITIALIZATION =====
class App {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.smoothScroll = new SmoothScroll();
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.accordion = new EnhancedAccordion();
      this.components.accessibility = new AccessibilityEnhancements();
      this.components.theme = new ThemeSystem();
      this.components.analytics = new Analytics();
      this.components.performance = new PerformanceMonitor();

      console.log('IQ-Tek website initialized successfully');
    } catch (error) {
      console.error('Error initializing components:', error);
    }
  }
}

// ===== CSS FOR SCROLL ANIMATIONS =====
const scrollAnimationCSS = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .using-keyboard *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
  }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = scrollAnimationCSS;
document.head.appendChild(style);

// Initialize the application
window.IQTekApp = new App();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, SmoothScroll, EnhancedAccordion, ThemeSystem };
}
