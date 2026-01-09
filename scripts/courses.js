// Courses Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const coursesGrid = document.getElementById('coursesGrid');
    const topicDetailView = document.getElementById('topicDetailView');
    const topicContent = document.getElementById('topicContent');
    const backToLevelsBtn = document.getElementById('backToLevels');

    // Learning levels data
    const learningLevels = [
        {
            id: 1,
            title: "The Essentials",
            topics: ["Phishing", "False Urgency", "Strong Passwords", "MFA"],
            resources: [
                { title: "Phishing Awareness Training", type: "Video", link: "https://www.youtube.com/watch?v=example1" },
                { title: "Password Security Guide", type: "Guide", link: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing" },
                { title: "Multi-Factor Authentication Setup", type: "Tool", link: "https://www.microsoft.com/en-us/security/blog/2020/11/17/how-to-secure-your-accounts-with-microsoft-authenticator/" }
            ]
        },
        {
            id: 2,
            title: "Social & Financial",
            topics: ["UPI/QR scams", "Social Media Privacy", "Public Wi-Fi traps"],
            resources: [
                { title: "UPI Fraud Prevention", type: "Video", link: "https://www.youtube.com/watch?v=example2" },
                { title: "Social Media Privacy Settings", type: "Guide", link: "https://www.ftc.gov/business-guidance/resources/protecting-your-business-social-media" },
                { title: "Public Wi-Fi Safety Checklist", type: "Tool", link: "https://www.consumer.ftc.gov/articles/how-avoid-online-holiday-scams" }
            ]
        },
        {
            id: 3,
            title: "Modern AI Threats",
            topics: ["Deepfakes", "Voice Cloning", "Malicious App Permissions"],
            resources: [
                { title: "Understanding Deepfakes", type: "Video", link: "https://www.youtube.com/watch?v=example3" },
                { title: "AI Voice Cloning Detection", type: "Guide", link: "https://www.dhs.gov/sites/default/files/publications/ia_21-304a1_deepfakes_508.pdf" },
                { title: "App Permission Analyzer", type: "Tool", link: "https://www.privacyguides.org/en/tools/" }
            ]
        },
        {
            id: 4,
            title: "Corporate & Community",
            topics: ["Tailgating", "Physical Security", "Software Updates", "Reporting Cybercrime"],
            resources: [
                { title: "Physical Security Best Practices", type: "Video", link: "https://www.youtube.com/watch?v=example4" },
                { title: "Software Update Management", type: "Guide", link: "https://www.cisa.gov/uscert/ncas/tips/ST04-006" },
                { title: "Cybercrime Reporting Portal", type: "Tool", link: "https://cybercrime.gov.in/" }
            ]
        }
    ];

    // Render learning levels grid
    function renderLevels() {
        coursesGrid.innerHTML = learningLevels.map(level => `
            <div class="card" data-level-id="${level.id}">
                <div class="level-badge">Level ${level.id}</div>
                <div class="card-header">
                    <h3>${level.title}</h3>
                </div>
                <div class="summary">Master essential cybersecurity skills to protect yourself and others in the digital world.</div>
                <div class="course-topics">
                    <strong>Key Topics:</strong>
                    <ul>
                        ${level.topics.map(topic => `<li>${topic}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    // Show topic detail view
    function showTopicDetail(levelId) {
        const level = learningLevels.find(l => l.id === levelId);
        if (!level) return;

        topicContent.innerHTML = `
            <h2>Level ${level.id}: ${level.title}</h2>
            <div class="topics-list">
                ${level.topics.map(topic => `
                    <div class="topic-item">
                        <h3>${topic}</h3>
                        <p>Learn actionable strategies to protect against ${topic.toLowerCase()} threats.</p>
                    </div>
                `).join('')}
            </div>
            <div class="resources">
                <h3>Recommended Resources</h3>
                <div class="resource-grid">
                    ${level.resources.map(resource => `
                        <div class="resource-item">
                            <span class="resource-type">${resource.type}</span>
                            <h4>${resource.title}</h4>
                            <a href="${resource.link}" target="_blank">Access Resource <i class="fas fa-external-link-alt"></i></a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        coursesGrid.style.display = 'none';
        topicDetailView.style.display = 'block';
        topicDetailView.scrollIntoView({ behavior: 'smooth' });
    }

    // Hide topic detail view
    function hideTopicDetail() {
        topicDetailView.style.display = 'none';
        coursesGrid.style.display = 'grid';
        coursesGrid.scrollIntoView({ behavior: 'smooth' });
    }

    // Event listeners
    coursesGrid.addEventListener('click', function(e) {
        const card = e.target.closest('.card');
        if (card) {
            const levelId = parseInt(card.dataset.levelId);
            showTopicDetail(levelId);
        }
    });

    backToLevelsBtn.addEventListener('click', hideTopicDetail);

    // Initialize
    renderLevels();
});
