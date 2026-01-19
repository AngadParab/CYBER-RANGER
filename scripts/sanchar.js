// Sanchar Saathi Page JavaScript - Interactive App Showcase
console.log('Sanchar Saathi page loaded');

document.addEventListener('DOMContentLoaded', function() {
    
    // Select Elements
    const featureCards = document.querySelectorAll('.feature-card'); // Sidebar buttons
    const appViews = document.querySelectorAll('.app-view'); // Phone screens
    const appIcons = document.querySelectorAll('.app-icon'); // Icons inside the phone

    // Function to switch screens
    function switchScreen(screenId) {
        // 1. Sidebar: Update active state
        featureCards.forEach(card => card.classList.remove('active'));
        const activeCard = document.querySelector(`.feature-card[data-screen="${screenId}"]`);
        if (activeCard) activeCard.classList.add('active');
        
        // 2. Phone Screen: Switch view
        appViews.forEach(view => view.classList.remove('active'));
        const targetScreen = document.getElementById(`screen-${screenId}`);
        
        if (targetScreen) {
            // Small delay to ensure CSS animation replays correctly
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 10);
        }
    }

    // --- Interaction Listeners ---

    // 1. Sidebar Clicks
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) switchScreen(screenId);
        });
    });

    // 2. Phone Icon Clicks (This is the part you were missing!)
    appIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Read the label text (e.g., "CEIR")
            const labelElement = this.querySelector('.icon-label');
            if (labelElement) {
                const label = labelElement.innerText.trim().toUpperCase();
                
                // Switch to the correct screen based on the icon label
                if (label === 'CEIR') switchScreen('block');
                else if (label === 'TAFCOP') switchScreen('connections');
                else if (label === 'CHAKSHU') switchScreen('fraud');
                else if (label === 'KYI') switchScreen('kyi');
            }
        });
    });
    
    // 3. Back Button Clicks
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchScreen('home');
        });
    });
    
    console.log('Sanchar Saathi interactive showcase initialized 🚀');
});