/**
 * Main website controller class that handles all interactive features
 * including navigation, animations, quote builder, and form submissions
 */
class WebsiteController {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.quoteData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeNavigation();
        this.initializeQuoteBuilder();
    }

    setupEventListeners() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    this.scrollToSection(targetId);

                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            });
        });

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => this.handleQuoteForm(e));
        }

        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeAnimations() {
        this.observeElements();
        this.animateCounters();
        this.startFloatingShapes();
    }

    initializeNavigation() {
        this.updateNavbarOnScroll();
        this.highlightActiveSection();
    }

    initializeQuoteBuilder() {
        this.setupQuoteSteps();
        this.updateProgressBar();
    }

    /**
     * Smoothly scrolls to a specific section with proper navbar offset
     */
    scrollToSection(targetId) {
        const element = document.getElementById(targetId);
        if (element) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = element.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Updates navbar styling and transparency based on scroll position
     */
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;

        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        this.highlightActiveSection();
    }

    /**
     * Highlights the currently visible section in the navigation menu
     */
    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Sets up intersection observer for smooth scroll-triggered animations
     */
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Creates smooth counting animation for statistics numbers
     */
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / 50;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('%') ? '%' : '');
                }
            };

            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /**
     * Adds subtle floating movement to background shape elements
     */
    startFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');

        shapes.forEach((shape, index) => {
            const moveShape = () => {
                const x = Math.sin(Date.now() / 1000 + index) * 10;
                const y = Math.cos(Date.now() / 1000 + index) * 15;
                shape.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(moveShape);
            };
            moveShape();
        });
    }

    /**
     * Configures all interactive elements in the quote builder
     */
    setupQuoteSteps() {
        const optionCards = document.querySelectorAll('.option-card, .choice-card, .platform-card');

        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                const parent = card.closest('.quote-step');
                const siblings = parent.querySelectorAll('.option-card, .choice-card, .platform-card');

                siblings.forEach(sibling => sibling.classList.remove('selected'));
                card.classList.add('selected');

                const value = card.getAttribute('data-value');
                const stepId = parent.getAttribute('id');

                this.updateQuoteData(stepId, value);
                this.handleSpecialSelections(stepId, value);
            });
        });
    }

    /**
     * Handles conditional logic for deployment platform selection
     */
    handleSpecialSelections(stepId, value) {
        if (stepId === 'step-3' && value === 'deployed') {
            const platformSection = document.querySelector('.deployment-platforms');
            if (platformSection) {
                platformSection.style.display = 'block';
                setTimeout(() => {
                    platformSection.style.opacity = '1';
                }, 100);
            }
        } else if (stepId === 'step-3' && value === 'code-only') {
            const platformSection = document.querySelector('.deployment-platforms');
            if (platformSection) {
                platformSection.style.display = 'none';
            }
        }
    }

    /**
     * Updates internal quote data and recalculates pricing
     */
    updateQuoteData(stepId, value) {
        const stepMapping = {
            'step-1': 'projectType',
            'step-2': 'needsBackend',
            'step-3': 'deliveryMethod'
        };

        const key = stepMapping[stepId];
        if (key) {
            this.quoteData[key] = value;
        }

        if (stepId === 'step-3' && document.querySelector('.platform-card.selected')) {
            this.quoteData.platform = document.querySelector('.platform-card.selected').getAttribute('data-value');
        }

        this.updatePriceEstimate();
    }

    /**
     * Calculates estimated price based on selected features and complexity
     */
    updatePriceEstimate() {
        let basePrice = 1500;
        let maxPrice = 3000;

        if (this.quoteData.projectType === 'ecommerce') {
            basePrice += 2000;
            maxPrice += 4000;
        } else if (this.quoteData.projectType === 'business') {
            basePrice += 500;
            maxPrice += 1500;
        }

        if (this.quoteData.needsBackend === 'yes') {
            basePrice += 1500;
            maxPrice += 3000;
        }

        if (this.quoteData.deliveryMethod === 'deployed') {
            basePrice += 500;
            maxPrice += 1000;
        }

        const priceElement = document.getElementById('estimated-price');
        if (priceElement) {
            priceElement.textContent = `$${basePrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
        }
    }

    /**
     * Updates the project summary display with user selections
     */
    updateQuoteSummary() {
        const typeMapping = {
            'business': 'Business Website',
            'ecommerce': 'E-commerce Store',
            'portfolio': 'Portfolio Site',
            'blog': 'Blog/Content Site'
        };

        const deliveryMapping = {
            'code-only': 'Source Code Only',
            'deployed': 'Fully Deployed'
        };

        const platformMapping = {
            'aws': 'Amazon AWS',
            'vercel': 'Vercel',
            'netlify': 'Netlify',
            'digitalocean': 'DigitalOcean',
            'other': 'Other Platform'
        };

        document.getElementById('summary-type').textContent = typeMapping[this.quoteData.projectType] || 'Not specified';
        document.getElementById('summary-backend').textContent = this.quoteData.needsBackend === 'yes' ? 'Yes' : 'No';
        document.getElementById('summary-delivery').textContent = deliveryMapping[this.quoteData.deliveryMethod] || 'Not specified';

        const platformSummary = document.querySelector('.platform-summary');
        if (this.quoteData.platform && this.quoteData.deliveryMethod === 'deployed') {
            platformSummary.style.display = 'flex';
            document.getElementById('summary-platform').textContent = platformMapping[this.quoteData.platform] || 'Not specified';
        } else {
            platformSummary.style.display = 'none';
        }
    }

    /**
     * Moves to the next step in the quote builder if current step is valid
     */
    nextStep() {
        if (this.currentStep < this.maxSteps) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateProgressBar();

                if (this.currentStep === 4) {
                    this.updateQuoteSummary();
                }
            }
        }
    }

    /**
     * Returns to the previous step in the quote builder
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgressBar();
        }
    }

    /**
     * Ensures user has made a selection before allowing step progression
     */
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const hasSelection = currentStepElement.querySelector('.selected');

        if (!hasSelection) {
            this.showNotification('Please make a selection before continuing', 'warning');
            return false;
        }

        return true;
    }

    /**
     * Updates UI to show the current active step
     */
    updateStepDisplay() {
        document.querySelectorAll('.quote-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= this.currentStep);
        });

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn.style.display = this.currentStep === 1 ? 'none' : 'flex';
        nextBtn.style.display = this.currentStep === this.maxSteps ? 'none' : 'flex';
    }

    /**
     * Updates the visual progress indicator
     */
    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const percentage = (this.currentStep / this.maxSteps) * 100;

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    /**
     * Processes contact form submission with validation
     */
    handleContactForm(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };

        if (this.validateContactForm(formData)) {
            this.submitContactForm(formData);
        }
    }

    /**
     * Processes quote form submission with project data
     */
    handleQuoteForm(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value,
            details: document.getElementById('project-details').value,
            quoteData: this.quoteData
        };

        if (this.validateQuoteForm(formData)) {
            this.submitQuoteForm(formData);
        }
    }

    /**
     * Validates all required fields in the contact form
     */
    validateContactForm(data) {
        if (!data.name.trim()) {
            this.showNotification('Please enter your name', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (!data.subject) {
            this.showNotification('Please select a subject', 'error');
            return false;
        }

        if (!data.message.trim()) {
            this.showNotification('Please enter your message', 'error');
            return false;
        }

        return true;
    }

    /**
     * Validates required fields in the quote request form
     */
    validateQuoteForm(data) {
        if (!data.name.trim()) {
            this.showNotification('Please enter your name', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    /**
     * Checks if email format is valid using regex pattern
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simulates sending contact form data to server
     */
    async submitContactForm(data) {
        try {
            this.showNotification('Sending message...', 'info');

            await this.simulateApiCall(2000);

            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            document.getElementById('contact-form').reset();

        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        }
    }

    /**
     * Simulates sending quote request data to server
     */
    async submitQuoteForm(data) {
        try {
            this.showNotification('Generating your detailed quote...', 'info');

            await this.simulateApiCall(3000);

            this.showNotification('Quote request submitted! Check your email for details.', 'success');
            document.getElementById('quote-form').reset();

            setTimeout(() => {
                this.scrollToSection('contact');
            }, 2000);

        } catch (error) {
            this.showNotification('Failed to submit quote request. Please try again.', 'error');
        }
    }

    /**
     * Creates artificial delay to simulate real API calls
     */
    simulateApiCall(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, delay);
        });
    }

    /**
     * Displays user feedback messages with appropriate styling
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    /**
     * Returns the appropriate FontAwesome icon for each notification type
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Smoothly removes notification from the screen
     */
    hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Adjusts layout and styling when window size changes
     */
    handleResize() {
        this.updateNavbarOnScroll();
    }

    /**
     * Updates navbar padding based on screen size
     */
    updateNavbarOnScroll() {
        const navContainer = document.querySelector('.nav-container');

        if (window.innerWidth <= 768) {
            navContainer.style.padding = '0 15px';
        } else {
            navContainer.style.padding = '0 20px';
        }
    }
}

/**
 * Scrolls to the quote section when called from buttons
 */
function scrollToQuote() {
    const controller = window.websiteController;
    if (controller) {
        controller.scrollToSection('quote');
    }
}

/**
 * Scrolls to the portfolio section when called from buttons
 */
function scrollToPortfolio() {
    const controller = window.websiteController;
    if (controller) {
        controller.scrollToSection('portfolio');
    }
}

/**
 * CSS styles for notification popup system
 */
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
    border-left: 4px solid var(--primary-color);
}

.notification.show {
    transform: translateX(0);
}

.notification.hide {
    transform: translateX(400px);
    opacity: 0;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
}

.notification-content i {
    font-size: 1.2rem;
    flex-shrink: 0;
}

.notification-success {
    border-left-color: var(--accent-color);
}

.notification-success i {
    color: var(--accent-color);
}

.notification-error {
    border-left-color: #ef4444;
}

.notification-error i {
    color: #ef4444;
}

.notification-warning {
    border-left-color: var(--secondary-color);
}

.notification-warning i {
    color: var(--secondary-color);
}

.notification-info i {
    color: var(--primary-color);
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-secondary);
    margin-left: auto;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    color: var(--text-primary);
}

@media (max-width: 480px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
    
    .notification.hide {
        transform: translateY(-100px);
    }
}
`;

/**
 * Initializes the website when DOM content is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

    window.websiteController = new WebsiteController();
});

/**
 * Pauses animations when page becomes hidden to save resources
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.querySelectorAll('.shape').forEach(shape => {
            shape.style.animationPlayState = 'paused';
        });
    } else {
        document.querySelectorAll('.shape').forEach(shape => {
            shape.style.animationPlayState = 'running';
        });
    }
});