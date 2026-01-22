import { db } from "./firebase-config.js";
import { 
    collection, 
    onSnapshot, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('newsGrid');
    const NEWS_COLLECTION = collection(db, "public_news");
    let allNews = [];

    // 1. Subscribe to Real Data
    function subscribeToNews() {
        // Show loading state
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">Loading latest threats...</div>';
        
        const q = query(NEWS_COLLECTION, orderBy("createdAt", "desc"));
        
        onSnapshot(q, (snapshot) => {
            allNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            render(allNews);
        }, (error) => {
            console.error("Error fetching news:", error);
            grid.innerHTML = '<div style="text-align:center;padding:40px;">Unable to load news.</div>';
        });
    }

    // 2. Helper Functions
    function typeLabel(t) {
        const map = {
            'impersonation': 'Scam Alert',
            'website-defacement': 'Hacking Incident',
            'financial-fraud': 'Financial Fraud',
            'ai-phishing': 'AI Threat',
            'sim-swap': 'Identity Theft'
        };
        return map[t] || 'Cyber Incident';
    }

    function escapeHtml(s) {
        if(!s) return "";
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // 3. Render Function
    function render(list) {
        grid.innerHTML = '';
        
        if(list.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">No news updates available.</div>';
            return;
        }

        list.forEach((item, index) => {
            const card = document.createElement('article');
            const isFeatured = index === 0 ? 'featured' : '';
            card.className = `card ${isFeatured}`;
            
            const tipsList = Array.isArray(item.tips) 
                ? item.tips.map(t => `<li>${escapeHtml(t)}</li>`).join('')
                : '<li>Stay vigilant</li>';

            card.innerHTML = `
                <div class="card-image">
                    <img src="${item.image || '../assets/images/phishing.webp'}" alt="News Image" loading="lazy">
                    <div class="card-type-overlay">
                        <i class="fas fa-bolt"></i> ${typeLabel(item.type)}
                    </div>
                </div>
                <div class="card-content">
                    <div class="meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(item.region)}</span>
                        <span>•</span>
                        <span><i class="far fa-calendar"></i> ${item.date}</span>
                    </div>
                    
                    <h3>${escapeHtml(item.title)}</h3>
                    <p class="summary">${escapeHtml(item.summary)}</p>
                    
                    <details class="tips-toggle">
                        <summary>
                            <span><i class="fas fa-shield-alt"></i> How to Protect</span>
                        </summary>
                        <div class="tips-content">
                            <ul>${tipsList}</ul>
                        </div>
                    </details>

                    <div class="card-actions">
                        <a href="${item.reference}" target="_blank" class="read-more">
                            Read Source <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        setTimeout(observeCards, 100);
    }

    // 4. Filtering Logic
    document.querySelectorAll('.controls .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.id === 'shuffle') return;

            document.querySelectorAll('.controls .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const f = btn.dataset.filter;
            if (f === 'all') render(allNews);
            else if (f === 'goa') render(allNews.filter(n => (n.region||"").toLowerCase() === 'goa'));
            else if (f === 'india') render(allNews.filter(n => (n.region||"").toLowerCase() !== 'goa'));
        });
    });

    document.getElementById('shuffle')?.addEventListener('click', () => {
        const arr = [...allNews].sort(() => Math.random() - 0.5);
        render(arr);
    });

    // 5. Animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    function observeCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            cardObserver.observe(card);
        });
    }

    // Initialize
    subscribeToNews();
});