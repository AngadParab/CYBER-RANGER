// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Mobile dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        dropbtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation for threat level bars
    const threatCards = document.querySelectorAll('.threat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelFill = entry.target.querySelector('.level-fill');
                const width = levelFill.style.width;
                levelFill.style.width = '0';
                
                setTimeout(() => {
                    levelFill.style.transition = 'width 1.5s ease-in-out';
                    levelFill.style.width = width;
                }, 300);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    threatCards.forEach(card => {
        observer.observe(card);
    });
    
   // Form function logic 
const FUNCTIONS_BASE_URL = 'YOUR_FIREBASE_FUNCTIONS_BASE_URL'; 

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const button = form.querySelector('button');
        const originalButtonText = button.textContent;

        const data = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value
        };

        button.textContent = 'Sending...';
        button.disabled = true;

        try {
            const response = await fetch(`${FUNCTIONS_BASE_URL}/submitContact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                button.textContent = 'Sent! ✅';
                form.reset();
                setTimeout(() => {
                    button.textContent = originalButtonText;
                    button.disabled = false;
                }, 3000);
            } else {
                const errorData = await response.json();
                button.textContent = 'Failed ❌';
                alert(`Error: ${errorData.message || 'Please try again later.'}`);
                button.disabled = false;
            }

        } catch (error) {
            console.error('Network Error:', error);
            button.textContent = 'Error ❌';
            alert('A network error occurred. Please check your connection.');
            button.disabled = false;
        }
    });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = form.elements.email;
        const button = form.querySelector('button');
        const originalButtonText = button.textContent;

        const data = {
            email: emailInput.value
        };

        button.textContent = 'Subscribing...';
        button.disabled = true;

        try {
            const response = await fetch(`${FUNCTIONS_BASE_URL}/subscribeNewsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                button.textContent = 'Subscribed! 🎉';
                emailInput.value = '';
                setTimeout(() => {
                    button.textContent = originalButtonText;
                    button.disabled = false;
                }, 3000);
            } else {
                const errorData = await response.json();
                button.textContent = 'Failed ❌';
                alert(`Error: ${errorData.message || 'Subscription failed. Try again.'}`);
                button.disabled = false;
            }

        } catch (error) {
            console.error('Network Error:', error);
            button.textContent = 'Error ❌';
            alert('A network error occurred.');
            button.disabled = false;
        }
    });
}
});
