// Cyber News JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Static dataset: each item must have a unique `type` to avoid duplicates of same kind
    const news = [
        {
            id: 1,
            type: 'impersonation',
            region: 'Goa',
            title: 'Digital Arrest Scam — Victim in Canacona Loses Large Sum',
            date: '2025-08-12',
            summary: 'Victims received messages and calls impersonating officials (crime branch, public prosecutor) and were coerced to transfer money under the threat of legal action. High-value transfers followed.',
            reference: 'https://timesofindia.indiatimes.com/city/goa/digital-arrest-case-canacona-manloses-rs-80l-nagpur-youth-arrested/articleshow/123929074.cms?utm_source=chatgpt.com',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center',
            imageAlt: 'Digital arrest scam illustration showing phone and warning signs',
            tips: [
                'Never transfer money to unknown callers claiming to be police; verify by calling local police station directly.',
                'Do not share OTPs or bank details over phone or chat.',
                'Ask for official documents and verify through official channels.'
            ]
        },
        {
            id: 2,
            type: 'website-defacement',
            region: 'Goa',
            title: 'Goa Government Website Defaced with Ads (WCD Site)',
            date: '2025-07-30',
            summary: 'A content-management vulnerability led to the Women & Child Development department site being replaced with gambling/ casino ads. An FIR was filed and sites were taken down for audit.',
            reference: 'https://www.thegoan.net/goa-news/wcd-dept-website-hit-by-cyberattack-affirms-minister/130353.html?utm_source=chatgpt.com#google_vignette',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center',
            imageAlt: 'Website defacement showing hacked government website',
            tips: [
                'Keep CMS and plugins updated and remove unused admin accounts.',
                'Use HTTPS with valid certificates and Content Security Policy (CSP).',
                'Perform regular backups and security audits; use a web application firewall.'
            ]
        },
        {
            id: 3,
            type: 'financial-fraud',
            region: 'India',
            title: 'Online Share‑Trading Racket — Investors Duped Across India',
            date: '2025-09-02',
            summary: 'Fake trading apps and groups lured investors with promises of high returns; initial small payouts built trust before large sums were blocked and victims could not withdraw.',
            reference: 'https://timesofindia.indiatimes.com/city/pune/online-share-trading-racket-behind-cheating-150-investors-of-over-rs20cr-busted-five-held/articleshow/124131518.cms',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center',
            imageAlt: 'Financial fraud showing fake trading app interface',
            tips: [
                'Verify trading platforms; check regulator (SEBI) registration and credible reviews.',
                'Avoid schemes promising guaranteed high returns and pressure to invest quickly.',
                'Use two-factor authentication on finance accounts and monitor bank statements.'
            ]
        },
        {
            id: 4,
            type: 'sim-aadhaar-misuse',
            region: 'India',
            title: 'Fake SIMs & Aadhaar Misuse Network Busted',
            date: '2025-08-20',
            summary: 'Law enforcement arrested suspects who created fake SIM cards and bank accounts using stolen Aadhaar data, later used for money transfers and fraud.',
            reference: 'https://timesofindia.indiatimes.com/city/jaipur/1-8cr-cyber-scam-trail-leads-to-jhalawar-1-held/articleshow/124168235.cms',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center',
            imageAlt: 'SIM card and identity theft illustration',
            tips: [
                'Do not share Aadhaar details or photos on untrusted platforms.',
                'Enable mobile number lock/port-out protection with telecom providers.',
                'Regularly check credit reports for unknown accounts.'
            ]
        },
        {
            id: 5,
            type: 'ai-phishing-trend',
            region: 'India',
            title: 'AI‑Driven Phishing & Deepfake Tactics on the Rise',
            date: '2025-08-07',
            summary: 'Security reports note increased use of AI to craft believable phishing messages and deepfake audio to impersonate executives or relatives to coerce payments.',
            reference: 'https://www.business-standard.com/technology/tech-news/ai-driven-deepfake-enabled-cyberattacks-to-increase-in-2025-report-124120401060_1.html?utm_source=chatgpt.com',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
            imageAlt: 'AI and deepfake technology showing artificial intelligence',
            tips: [
                'Treat unexpected urgent requests with suspicion — verify through a separate known channel.',
                'Train teams and family members on the signs of advanced social engineering.',
                'Use email authentication (SPF, DKIM, DMARC) for organisations.'
            ]
        },
        {
            id: 6,
            type: 'senior-targeted',
            region: 'Goa',
            title: 'Seniors Targeted in "Digital Arrest" & Phone Scams',
            date: '2025-06-15',
            summary: 'A spike in scams targeting elderly Goans resulted in dozens reporting financial losses after being threatened or manipulated over calls and messages.',
            reference: 'https://timesofindia.indiatimes.com/city/goa/cybercrimes-against-seniors-rise-36-victims-in-9-months/articleshow/121855180.cms?utm_source=chatgpt.com',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&crop=center',
            imageAlt: 'Senior citizen using smartphone with security concerns',
            tips: [
                'Teach seniors to never share bank info or OTPs; designate a trusted family member to verify suspicious calls.',
                'Use caller ID apps and register on Do Not Disturb (DND) services.',
                'Report threats immediately to local police and the national cybercrime portal.'
            ]
        }
    ];

    // Render function
    const grid = document.getElementById('newsGrid');
    
    function render(list) {
        grid.innerHTML = '';
        list.forEach(item => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-image">
                    <img src="${item.image}" alt="${item.imageAlt}" loading="lazy">
                    <div class="card-type-overlay">${item.type.toUpperCase()}</div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <div>
                            <h3>${escapeHtml(item.title)}</h3>
                            <div class="meta">
                                <span>${item.region}</span>
                                <span>•</span>
                                <span>${item.date}</span>
                                <span style="margin-left:8px" class="tag">${typeLabel(item.type)}</span>
                            </div>
                        </div>
                    </div>
                    <p class="summary">${escapeHtml(item.summary)}</p>
                    <div class="tips">
                        <strong>How to protect</strong>
                        <ul>${item.tips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
                    </div>
                    <div class="reference">
                        <strong>Source:</strong> <a href="${item.reference}" target="_blank" rel="noopener noreferrer">Read full article</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function typeLabel(t) {
        const map = {
            impersonation: 'Impersonation Scam',
            'website-defacement': 'Website Hack',
            'financial-fraud': 'Financial Fraud',
            'sim-aadhaar-misuse': 'SIM / Aadhaar Misuse',
            'ai-phishing-trend': 'AI / Phishing Trend',
            'senior-targeted': 'Seniors Targeted'
        };
        return map[t] || t;
    }

    // Simple XSS-safe escape
    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Initial render (mostly Goa prioritized)
    const priority = news.filter(n => n.region === 'Goa').concat(news.filter(n => n.region !== 'Goa'));
    render(priority);

    // Filters
    document.querySelectorAll('.controls .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.controls .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            if (f === 'all') render(priority);
            else if (f === 'goa') render(news.filter(n => n.region.toLowerCase() === 'goa'));
            else if (f === 'india') render(news.filter(n => n.region.toLowerCase() !== 'goa'));
        });
    });

    // Shuffle functionality
    document.getElementById('shuffle').addEventListener('click', () => {
        const arr = [...news].sort(() => Math.random() - 0.5);
        render(arr);
    });

    // Add animation to cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards after they're rendered
    function observeCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }

    // Call observeCards after initial render
    setTimeout(observeCards, 100);

    // Re-observe cards after filtering/shuffling
    const originalRender = render;
    render = function(list) {
        originalRender(list);
        setTimeout(observeCards, 100);
    };

});
