// Sanchar Saathi Page JavaScript - Advanced Interactive Showcase
console.log('Sanchar Saathi page loaded');

document.addEventListener('DOMContentLoaded', function() {
    /* --- PART 1: Screen Switching Logic (Existing) --- */
    const featureCards = document.querySelectorAll('.feature-card');
    const appViews = document.querySelectorAll('.app-view');
    
    // Set default active state
    const defaultFeature = document.querySelector('.feature-card[data-screen="home"]');
    if (defaultFeature) defaultFeature.classList.add('active');
    
    function switchScreen(screenId) {
        featureCards.forEach(card => card.classList.remove('active'));
        appViews.forEach(view => view.classList.remove('active'));
        
        const clickedCard = document.querySelector(`.feature-card[data-screen="${screenId}"]`);
        if (clickedCard) clickedCard.classList.add('active');
        
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) {
            // Small delay to allow CSS animation to reset
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 10);
        }
    }
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) switchScreen(screenId);
        });
    });
    
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchScreen('home');
        });
    });

   
   
});