/**
 * Advanced Visual Effects and Animations for IQ-Tek
 * Handles loading animations, floating elements, and interactive effects
 */

class VisualEffects {
    constructor() {
        this.floatingElements = [];
        this.isLoaded = false;
        this.init();
    }

    init() {
        this.createLoadingAnimation();
        this.createScrollProgress();
        this.createFloatingCode();
        this.setupIntersectionObserver();
        this.setupParallax();
        
        // Initialize after DOM load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handlePageLoad();
            });
        } else {
            this.handlePageLoad();
        }
    }

    createLoadingAnimation() {
        const loading = document.getElementById('loadingAnimation');
        if (!loading) return;

        // Simulate loading time
        setTimeout(() => {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.remove();
                this.isLoaded = true;
                this.triggerEntryAnimations();
            }, 500);
        }, 1500);
    }

    createScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    createFloatingCode() {
        const container = document.getElementById('floatingElements');
        if (!container) return;

        const codeSnippets = [
            'AES.encrypt(data, key)',
            'crypto.randomBytes(32)',
            'PBKDF2(password, salt)',
            'GCM.authenticate()',
            'HMAC.verify(hash)',
            'SHA256.digest()',
            'SecureRandom.nextBytes()',
            'const iv = Buffer.random(16)',
            'cipher.final()',
            'keyDerivation.run()'
        ];

        setInterval(() => {
            if (this.floatingElements.length < 8) {
                this.createFloatingCodeElement(container, codeSnippets);
            }
        }, 2000);
    }

    createFloatingCodeElement(container, snippets) {
        const element = document.createElement('div');
        element.className = 'floating-code';
        element.textContent = snippets[Math.floor(Math.random() * snippets.length)];
        
        // Random positioning
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(element);
        this.floatingElements.push(element);

        // Remove element after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
                this.floatingElements = this.floatingElements.filter(el => el !== element);
            }
        }, 20000);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation for cards
                    if (entry.target.classList.contains('card')) {
                        this.addStaggeredAnimation(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe fade-in elements
        document.querySelectorAll('.fade-in-up, .card').forEach(el => {
            observer.observe(el);
        });
    }

    addStaggeredAnimation(element) {
        const siblings = element.parentNode.children;
        const index = Array.from(siblings).indexOf(element);
        
        element.style.animationDelay = `${index * 0.2}s`;
        element.classList.add('animate-fade-in-up');
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.parallax');
            
            parallax.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    triggerEntryAnimations() {
        // Trigger hero animations
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease-out forwards';
        }

        const heroTerminal = document.querySelector('.hero-terminal');
        if (heroTerminal) {
            heroTerminal.style.animation = 'fadeInUp 1s ease-out 0.3s forwards';
        }
    }
}

class InteractiveEffects {
    constructor() {
        this.setupButtonEffects();
        this.setupCardEffects();
        this.setupTerminalTyping();
    }

    setupButtonEffects() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            background-color: rgba(255, 255, 255, 0.3);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupCardEffects() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    setupTerminalTyping() {
        const terminalLines = document.querySelectorAll('.terminal-line');
        terminalLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                this.typeText(line);
            }, index * 800);
        });
    }

    typeText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 50);
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.setupCanvas();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle());
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#00d9ff' : '#a855f7'
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// CSS Animations
const additionalCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}

.card {
    transition: transform 0.3s ease;
}

.hero-content, .hero-terminal {
    opacity: 0;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    new VisualEffects();
    new InteractiveEffects();
    
    // Only create particles on larger screens
    if (window.innerWidth > 768) {
        new ParticleSystem();
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualEffects, InteractiveEffects, ParticleSystem };
}
