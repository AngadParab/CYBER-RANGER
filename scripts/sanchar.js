// Sanchar Saathi Page JavaScript - Interactive App Showcase
console.log('Sanchar Saathi page loaded');

// Initialize the app showcase
document.addEventListener('DOMContentLoaded', function() {
    // Get all feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Get all app views (screens)
    const appViews = document.querySelectorAll('.app-view');
    
    // Set default active state (home screen)
    const defaultFeature = document.querySelector('.feature-card[data-screen="home"]');
    if (defaultFeature) {
        defaultFeature.classList.add('active');
    }
    
    // Function to switch screens
    function switchScreen(screenId) {
        // Remove active class from all feature cards
        featureCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all app views
        appViews.forEach(view => {
            view.classList.remove('active');
        });
        
        // Add active class to clicked feature card
        const clickedCard = document.querySelector(`.feature-card[data-screen="${screenId}"]`);
        if (clickedCard) {
            clickedCard.classList.add('active');
        }
        
        // Show the matching screen
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            // Small delay for smooth animation
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 50);
        }
    }
    
    // Add click event listeners to feature cards
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) {
                switchScreen(screenId);
            }
        });
    });
    
    // Add click event listeners to back buttons (if they exist)
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchScreen('home');
        });
    });
    
    console.log('Sanchar Saathi interactive showcase initialized');
});
