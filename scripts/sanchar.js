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

    /* --- PART 2: ADVANCED 3D TILT EFFECT --- */
    const phoneFrame = document.querySelector('.phone-frame');
    const showcaseSection = document.querySelector('.app-showcase');

    if (phoneFrame && showcaseSection) {
        showcaseSection.addEventListener('mousemove', (e) => {
            // 1. Calculate mouse position relative to the section
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25; // Divide to control sensitivity
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            // 2. Rotate the phone based on mouse position
            phoneFrame.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // 3. Reset position when mouse leaves
        showcaseSection.addEventListener('mouseleave', () => {
            phoneFrame.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    console.log('Sanchar Saathi: 3D Tilt & Animations Active 🚀');
});