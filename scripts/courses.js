// Courses Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const coursesGrid = document.getElementById('coursesGrid');
    
    // Course data
    const courses = [
        {
            title: "Cybersecurity Fundamentals",
            type: "Course",
            duration: "2-3 hours",
            level: "Beginner",
            summary: "Learn the basics of cybersecurity, including common threats, attack vectors, and fundamental protection strategies.",
            topics: [
                "Understanding cyber threats and vulnerabilities",
                "Basic security principles and best practices",
                "Password security and authentication",
                "Safe browsing and email practices",
                "Introduction to malware and how to avoid it"
            ],
            reference: {
                text: "Comprehensive guide covering essential cybersecurity concepts",
                link: "https://www.geeksforgeeks.org/ethical-hacking/cyber-crime/"
            }
        },
        {
            title: "Phishing Identification Workshop",
            type: "Workshop",
            duration: "1 hour",
            level: "Beginner",
            summary: "Hands-on workshop to identify and avoid phishing attacks through real-world examples and interactive exercises.",
            topics: [
                "Recognizing phishing emails and messages",
                "Identifying suspicious links and attachments",
                "Social engineering tactics",
                "Reporting phishing attempts",
                "Creating strong security awareness"
            ],
            reference: {
                text: "Interactive phishing simulation and training",
                link: "https://www.phishing.org/what-is-phishing"
            }
        },
        {
            title: "Data Protection for Small Businesses",
            type: "Course",
            duration: "3-4 hours",
            level: "Intermediate",
            summary: "Comprehensive guide for small business owners to protect their data and customer information from cyber threats.",
            topics: [
                "Data classification and inventory",
                "Access controls and user management",
                "Backup and recovery strategies",
                "Incident response planning",
                "Compliance and regulatory requirements"
            ],
            reference: {
                text: "Small business cybersecurity framework",
                link: "https://cloudian.com/guides/data-protection/data-protection-and-privacy-7-ways-to-protect-user-data/"
            }
        },
        {
            title: "Safe Online Banking Practices",
            type: "Tutorial",
            duration: "1.5 hours",
            level: "Beginner",
            summary: "Essential practices for secure online banking, UPI transactions, and digital payment security.",
            topics: [
                "Secure online banking setup",
                "UPI safety and fraud prevention",
                "Mobile banking security",
                "Recognizing banking scams",
                "Two-factor authentication setup"
            ],
            reference: {
                text: "Official banking security guidelines",
                link: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://uppolice.gov.in/writereaddata/uploaded-content/Web_Page/23_6_2014_10_39_3_Online%2520Banking%2520Security.pdf&ved=2ahUKEwjY7tPOwpSPAxUUTGwGHYVCFisQFnoECDYQAQ&usg=AOvVaw048doXh391DH6gTsFTiyY2"
            }
        },
        {
            title: "Indian Cybersecurity Updates",
            type: "Resource",
            duration: "Ongoing",
            level: "All Levels",
            summary: "Stay updated with the latest cybersecurity threats and advisories from CERT-In and other official sources.",
            topics: [
                "Current threat landscape in India",
                "Government cybersecurity initiatives",
                "Latest malware and attack trends",
                "Security advisories and updates",
                "Incident reporting procedures"
            ],
            reference: {
                text: "Official CERT-In threat intelligence",
                link: "https://www.csk.gov.in/alerts.html"
            }
        },
        {
            title: "Mobile Security Essentials",
            type: "Course",
            duration: "2 hours",
            level: "Beginner",
            summary: "Learn how to secure your mobile devices, protect personal data, and avoid mobile-specific threats.",
            topics: [
                "Mobile device security settings",
                "App security and permissions",
                "Public Wi-Fi safety",
                "Mobile malware prevention",
                "Secure mobile payments"
            ],
            reference: {
                text: "Mobile security best practices guide",
                link: "https://www.csk.gov.in/alerts.html"
            }
        }
    ];

    // Render courses
    function renderCourses() {
        coursesGrid.innerHTML = courses.map(course => `
            <div class="card">
                <div class="card-header">
                    <h3>${course.title}</h3>
                    <div class="meta">
                        <span class="card-type">${course.type}</span>
                        <span class="course-duration">${course.duration}</span>
                        <span class="course-level">${course.level}</span>
                    </div>
                </div>
                <div class="summary">${course.summary}</div>
                <div class="course-topics">
                    <strong>What You'll Learn:</strong>
                    <ul>
                        ${course.topics.map(topic => `<li>${topic}</li>`).join('')}
                    </ul>
                </div>
                <div class="reference">
                    <strong>Reference:</strong>
                    <a href="${course.reference.link}" target="_blank">${course.reference.text}</a>
                </div>
            </div>
        `).join('');
    }

    // Initialize
    renderCourses();
});
