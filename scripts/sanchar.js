// Sanchar Saathi Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const sancharGrid = document.getElementById('sancharGrid');
    
    // Sanchar Saathi content data
    const sancharContent = [
        {
            title: "About Sanchar Saathi",
            type: "Information",
            summary: "Sanchar Saathi is a citizen-centric initiative by the Department of Telecommunications (DoT), Government of India. Launched in May 2023, it empowers mobile subscribers to secure their connections and increase awareness about telecom-related cyber threats.",
            features: [
                "Launched by Department of Telecommunications (DoT)",
                "Citizen-centric initiative for mobile security",
                "Available in multiple Indian languages",
                "Free to use for all mobile subscribers"
            ],
            reference: {
                text: "Official Sanchar Saathi portal",
                link: "https://sancharsaathi.gov.in/"
            }
        },
        {
            title: "Key Features",
            type: "Features",
            summary: "Comprehensive set of tools to help citizens secure their mobile connections and report telecom fraud.",
            features: [
                "Chakshu – Report Suspected Fraud Communications",
                "Block Lost/Stolen Mobile Handset",
                "Know Mobile Connections in Your Name",
                "Know Genuineness of Your Mobile Handset",
                "Report Incoming International Call with Indian Number",
                "Know Your Wireline Internet Service Provider"
            ],
            reference: {
                text: "Complete feature guide",
                link: "https://sancharsaathi.gov.in/"
            }
        },
        {
            title: "Impact Statistics",
            type: "Impact",
            summary: "Significant impact in securing mobile connections and reducing telecom fraud across India.",
            features: [
                "Recovered over 5.35 lakh lost or stolen mobile handsets",
                "Disconnected more than 1 crore unauthorized mobile connections",
                "Deactivated over 29 lakh mobile numbers flagged through Chakshu",
                "Over 16.7 crore visits to the Sanchar Saathi portal"
            ],
            reference: {
                text: "Official impact report",
                link: "https://sancharsaathi.gov.in/"
            }
        },
        {
            title: "Download the App",
            type: "Download",
            summary: "The Sanchar Saathi app is available for Android and iOS, with features accessible in multiple Indian languages.",
            features: [
                "Available on Google Play Store and Apple App Store",
                "Supports multiple Indian languages",
                "Free to download and use",
                "Regular updates with new features"
            ],
            reference: {
                text: "Download from official stores",
                link: "https://sancharsaathi.gov.in/"
            }
        }
    ];

    // Render Sanchar Saathi content
    function renderSancharContent() {
        sancharGrid.innerHTML = sancharContent.map(content => `
            <div class="card">
                <div class="card-header">
                    <h3>${content.title}</h3>
                    <div class="meta">
                        <span class="card-type">${content.type}</span>
                        ${content.type === 'Features' ? '<span class="feature-type">Features</span>' : ''}
                        ${content.type === 'Impact' ? '<span class="impact-type">Impact</span>' : ''}
                        ${content.type === 'Download' ? '<span class="feature-type">Download</span>' : ''}
                    </div>
                </div>
                <div class="summary">${content.summary}</div>
                <div class="tips">
                    <strong>Key Points:</strong>
                    <ul>
                        ${content.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ${content.type === 'Download' ? `
                <div class="download-buttons">
                    <a href="https://play.google.com/store/apps/details?id=com.dot.app.sancharsaathi" target="_blank" class="download-btn">
                        <i class="fab fa-google-play"></i>
                        Download for Android
                    </a>
                    <a href="https://apps.apple.com/in/app/sanchar-saathi/id6739700695" target="_blank" class="download-btn">
                        <i class="fab fa-apple"></i>
                        Download for iOS
                    </a>
                </div>
                ` : ''}
                <div class="reference">
                    <strong>Reference:</strong>
                    <a href="${content.reference.link}" target="_blank">${content.reference.text}</a>
                </div>
            </div>
        `).join('');
    }

    // Initialize
    renderSancharContent();
});
