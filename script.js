/**
 * Iuni Telecom - Main JavaScript File
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initPlansToggle();
    initCoverageChecker();
    initTestimonialsSlider();
    initScrollAnimations();
    initBackToTop();
    initParticles();
});

/**
 * Header scroll behavior
 */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Plans toggle (Residencial/Empresarial)
 */
function initPlansToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const planCards = document.querySelectorAll('.plan-card');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const type = btn.dataset.type;
            
            // Show/hide plans with animation
            planCards.forEach(card => {
                if (card.dataset.category === type) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Coverage checker with CEP validation
 */
function initCoverageChecker() {
    const form = document.getElementById('coverageForm');
    const cepInput = document.getElementById('cepInput');
    const resultDiv = document.getElementById('coverageResult');
    
    if (!form || !cepInput) return;
    
    // CEP mask
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        
        e.target.value = value;
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const cep = cepInput.value.replace(/\D/g, '');
        
        // Validate CEP
        if (cep.length !== 8) {
            showCoverageResult('error', 'Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if CEP is in coverage area (simulated)
        // In production, this would call your backend API
        const isAvailable = checkCepCoverage(cep);
        
        if (isAvailable) {
            showCoverageResult('success', 
                '🎉 Ótimas notícias! Temos cobertura na sua região. ' +
                '<a href="#planos" style="color: inherit; text-decoration: underline;">Ver planos disponíveis</a>'
            );
        } else {
            showCoverageResult('error', 
                'Ainda não temos cobertura no seu endereço, mas estamos expandindo! ' +
                'Deixe seu contato e avisaremos quando chegarmos até você.'
            );
        }
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
    
    function showCoverageResult(type, message) {
        resultDiv.className = `coverage-result ${type}`;
        resultDiv.innerHTML = message;
        resultDiv.style.display = 'block';
        
        // Animate in
        resultDiv.style.opacity = '0';
        resultDiv.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            resultDiv.style.transition = 'all 0.3s ease';
            resultDiv.style.opacity = '1';
            resultDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Simulated coverage check
    function checkCepCoverage(cep) {
        // For demo purposes: CEPs ending in even numbers have coverage
        // In production, this would check against your coverage database
        const lastDigit = parseInt(cep.slice(-1));
        return lastDigit % 2 === 0;
    }
}

/**
 * Testimonials slider
 */
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const track = slider?.querySelector('.testimonials-track');
    const cards = slider?.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('testimonialsDots');
    
    if (!slider || !track || !cards.length) return;
    
    let currentIndex = 0;
    const totalSlides = cards.length;
    let autoplayInterval;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        }
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    startAutoplay();
}

/**
 * Scroll animations (Intersection Observer)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.dataset.aosDelay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Also animate sections on scroll
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Particle animation in hero section
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(16, 185, 129, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
        
        particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2
        });
    }
    
    // Animate particles
    let animationId;
    let lastTime = 0;
    
    function animate(currentTime) {
        // Throttle to ~30fps for performance
        if (currentTime - lastTime < 33) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        lastTime = currentTime;
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > 100) p.vx *= -1;
            if (p.y < 0 || p.y > 100) p.vy *= -1;
            
            p.element.style.left = p.x + '%';
            p.element.style.top = p.y + '%';
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Only animate when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animationId = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    });
    
    observer.observe(container);
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animationId = requestAnimationFrame(animate);
        }
    });
}

/**
 * Form validation helper
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Handle "Contratar" buttons - show coming soon modal
 */
document.querySelectorAll('.btn-plan, a[href="#"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#') {
            e.preventDefault();
            showNotification('Em breve! Estamos preparando tudo para você.', 'info');
        }
    });
});

/**
 * Notification system
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: var(--bg-card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Active nav link on scroll
 */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNav = throttle(() => {
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, 100);

window.addEventListener('scroll', highlightNav);

/**
 * Preloader (optional)
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/**
 * Console easter egg
 */
console.log('%c🚀 Iuni Telecom', 'font-size: 24px; font-weight: bold; color: #10b981;');
console.log('%cConectando você ao que realmente importa.', 'font-size: 14px; color: #34d399;');
console.log('%cDesenvolvido com ❤️ para sua empresa de telecomunicações.', 'font-size: 12px; color: #6ee7b7;');