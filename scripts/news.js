import { db } from "./firebase-config.js";
import { 
    collection, 
    onSnapshot, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
const DUMMY_NEWS = [
    {
        id: "news-4",
        title: "Goa Police Blocks 507 Fraudulent Websites in 2025",
        date: "2025-11-30",
        region: "Goa",
        type: "website-defacement",
        summary: "In a continuous effort to secure the digital landscape, the Goa Police Cyber Cell has successfully blocked 507 fraudulent websites and over 767 scam mobile numbers used to target residents this year. The action targeted platforms used for phishing and impersonation scams.",
        reference: "https://www.prudentmedia.in/crime/goa-police-blocks-507-fraudulent-websites-767-scam-mobile-numbers-in-2025/35062.html",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51",
        tips: [
            "Use the 'Chakshu' portal on Sanchar Saathi to report suspicious messages.",
            "Verify unknown numbers at cybercrime.gov.in before responding.",
            "Avoid clicking links in SMS alerts regarding bank account 'KYC updates'."
        ]
    },
    {
        id: "news-5",
        title: "RBI Panaji Conducts Cyber Fraud Awareness Programs",
        date: "2025-12-24",
        region: "Goa",
        type: "financial-fraud",
        summary: "The Reserve Bank of India (RBI) in Panaji has organized a series of financial literacy and cyber fraud awareness programs for students and citizens across Goa. The sessions focus on safe digital banking practices and identifying evolving online threats.",
        reference: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2208182",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
        tips: [
            "Never share your OTP or banking PIN with anyone claiming to be a bank official.",
            "Check for official bank communication through verified apps only.",
            "Report any unauthorized transaction to your bank within 24 hours."
        ]
    },
    {
        id: "news-6",
        title: "UP Native Arrested for Child Safety Violations in Goa",
        date: "2026-01-17",
        region: "Goa",
        type: "impersonation",
        summary: "The Goa Cyber Crime Police arrested a 28-year-old native of Uttar Pradesh for illegal digital activities involving restricted content. This arrest highlights the state's increased surveillance and strict enforcement of the IT Act regarding digital safety.",
        reference: "https://digitalgoa.com/goa-police-cyber-cell-blocks-672-online-platforms-linked-to-fraud-vice-activities-in-last-9-months/",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        tips: [
            "Be cautious about the content you download or share online.",
            "Install parental control software on devices used by minors.",
            "Report illegal or harmful digital content to the Cyber Crime Police Station at Ribandar."
        ]
    }
];

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
// scripts/news.js

function subscribeToNews() {
    const q = query(NEWS_COLLECTION, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        // Get real news from Firestore
        const liveNews = snapshot.docs.map((doc) => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        
        // Combine with dummy data
        const allNews = [...DUMMY_NEWS, ...liveNews];
        
        // Pass to your rendering function
        renderNews(allNews); 
    });
}
});