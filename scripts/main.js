// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {

    // 🚨 FIX: DEFINE THE BASE URL FOR CLOUD FUNCTIONS 🚨
    // Project ID is 'cyber-ranger', Functions are in 'us-central1'
    const FUNCTIONS_BASE_URL = 'https://us-central1-cyber-ranger.cloudfunctions.net';

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Use event delegation so any anchor added dynamically will close the mobile menu
        navLinks.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            // If a link inside nav-links was clicked, close the mobile menu
            if (target && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }


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

    // Home Page - Threat Animation Logic
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

    // ----------------------------------------------------
    // 🚨 FIX 2: CONTACT FORM SUBMISSION LOGIC 🚨
    // ----------------------------------------------------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const form = e.target;
            const button = form.querySelector('button[type="submit"]');
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
                    const result = await response.json();
                    alert(result.message || 'Contact message sent successfully!');
                    form.reset();
                    button.textContent = 'Sent! ✅';
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message || response.statusText}`);
                    button.textContent = 'Failed ❌';
                }

            } catch (error) {
                console.error('Network Error:', error);
                alert('A network error occurred. Check the console.');
                button.textContent = 'Error ❌';
            } finally {
                // Restore button state after a delay
                setTimeout(() => {
                    button.textContent = originalButtonText;
                    button.disabled = false;
                }, 3000);
            }
        });
    }

    // ----------------------------------------------------
    // 🚨 FIX 3: NEWSLETTER FORM SUBMISSION LOGIC 🚨
    // ----------------------------------------------------
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
                    const result = await response.json();
                    alert(result.message || 'Subscription successful!');
                    emailInput.value = ''; // Clear input on success
                    button.textContent = 'Subscribed! 🎉';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Subscription failed. Try again.'}`);
                    button.textContent = 'Failed ❌';
                }

            } catch (error) {
                console.error('Network Error:', error);
                button.textContent = 'Error ❌';
                alert('A network error occurred.');
            } finally {
                 // Restore button state after a delay
                 setTimeout(() => {
                    button.textContent = originalButtonText;
                    button.disabled = false;
                }, 3000);
            }
        });
    }
});
