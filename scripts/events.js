// Events Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('eventSearch');
    
    // Event data with cyber awareness workshops across Goa
    const events = [
        {
            id: 1,
            title: "Cybersecurity Fundamentals Workshop",
            type: "Workshop",
            status: "upcoming",
            date: "2025-02-15",
            time: "10:00 AM - 12:00 PM",
            location: "Panjim",
            venue: "Goa State Central Library, Panjim",
            capacity: "50 participants",
            summary: "Learn the basics of cybersecurity including common threats, password security, and safe online practices. Perfect for beginners and general public.",
            details: [
                "Understanding cyber threats and vulnerabilities",
                "Creating strong passwords and two-factor authentication",
                "Safe browsing and email practices",
                "Recognizing phishing attempts",
                "Mobile device security basics"
            ],
            contact: {
                organizer: "Goa Police Cyber Cell",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://www.csk.gov.in/alerts.html"
        },
        {
            id: 2,
            title: "Digital Banking Security Seminar",
            type: "Seminar",
            status: "upcoming",
            date: "2025-02-20",
            time: "2:00 PM - 4:00 PM",
            location: "Margao",
            venue: "Margao Municipal Council Hall",
            capacity: "75 participants",
            summary: "Comprehensive session on secure online banking, UPI transactions, and protecting yourself from financial fraud.",
            details: [
                "Secure online banking setup and best practices",
                "UPI safety and fraud prevention techniques",
                "Mobile banking security measures",
                "Recognizing banking scams and fake apps",
                "Two-factor authentication setup"
            ],
            contact: {
                organizer: "Cyber Ranger Team",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://uppolice.gov.in/writereaddata/uploaded-content/Web_Page/23_6_2014_10_39_3_Online%2520Banking%2520Security.pdf"
        },
        {
            id: 3,
            title: "Senior Citizens Cyber Safety Program",
            type: "Program",
            status: "ongoing",
            date: "2025-02-10",
            time: "9:00 AM - 11:00 AM",
            location: "Vasco",
            venue: "Vasco Municipal Council",
            capacity: "30 participants",
            summary: "Specialized program designed for senior citizens to learn about cyber threats and safe digital practices.",
            details: [
                "Understanding common scams targeting seniors",
                "Safe use of smartphones and tablets",
                "Protecting personal information online",
                "Recognizing fake calls and messages",
                "Emergency contacts and reporting procedures"
            ],
            contact: {
                organizer: "Goa Police Cyber Cell",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://timesofindia.indiatimes.com/city/goa/cybercrimes-against-seniors-rise-36-victims-in-9-months/articleshow/121855180.cms"
        },
        {
            id: 4,
            title: "Small Business Cybersecurity Training",
            type: "Training",
            status: "upcoming",
            date: "2025-02-25",
            time: "3:00 PM - 5:00 PM",
            location: "Mapusa",
            venue: "Mapusa Municipal Council",
            capacity: "40 participants",
            summary: "Essential cybersecurity training for small business owners and entrepreneurs to protect their business data and customer information.",
            details: [
                "Data protection and privacy regulations",
                "Secure payment processing and POS security",
                "Employee cybersecurity training",
                "Backup and recovery strategies",
                "Incident response planning"
            ],
            contact: {
                organizer: "Cyber Ranger Team",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://cloudian.com/guides/data-protection/data-protection-and-privacy-7-ways-to-protect-user-data/"
        },
        {
            id: 5,
            title: "Student Cyber Awareness Workshop",
            type: "Workshop",
            status: "completed",
            date: "2025-01-28",
            time: "10:00 AM - 12:00 PM",
            location: "Panjim",
            venue: "Goa University Campus",
            capacity: "100 participants",
            summary: "Interactive workshop for college students covering social media safety, online privacy, and cyberbullying prevention.",
            details: [
                "Social media privacy settings and safety",
                "Online reputation management",
                "Cyberbullying prevention and reporting",
                "Safe online gaming and entertainment",
                "Digital citizenship and responsible online behavior"
            ],
            contact: {
                organizer: "Goa Police Cyber Cell",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://www.geeksforgeeks.org/ethical-hacking/cyber-crime/"
        },
        {
            id: 6,
            title: "Phishing Awareness and Prevention Workshop",
            type: "Workshop",
            status: "upcoming",
            date: "2025-03-05",
            time: "11:00 AM - 1:00 PM",
            location: "Margao",
            venue: "Margao Railway Station Community Hall",
            capacity: "60 participants",
            summary: "Hands-on workshop to identify and avoid phishing attacks through real-world examples and interactive exercises.",
            details: [
                "Recognizing phishing emails and messages",
                "Identifying suspicious links and attachments",
                "Social engineering tactics and prevention",
                "Reporting phishing attempts",
                "Creating strong security awareness"
            ],
            contact: {
                organizer: "Cyber Ranger Team",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://www.phishing.org/what-is-phishing"
        },
        {
            id: 7,
            title: "Mobile Security Essentials Workshop",
            type: "Workshop",
            status: "upcoming",
            date: "2025-03-10",
            time: "2:00 PM - 4:00 PM",
            location: "Vasco",
            venue: "Vasco Railway Station Community Center",
            capacity: "45 participants",
            summary: "Learn how to secure your mobile devices, protect personal data, and avoid mobile-specific threats.",
            details: [
                "Mobile device security settings and updates",
                "App security and permission management",
                "Public Wi-Fi safety and VPN usage",
                "Mobile malware prevention",
                "Secure mobile payments and banking"
            ],
            contact: {
                organizer: "Goa Police Cyber Cell",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://www.csk.gov.in/alerts.html"
        },
        {
            id: 8,
            title: "Cyber Crime Reporting and Legal Awareness",
            type: "Seminar",
            status: "upcoming",
            date: "2025-03-15",
            time: "10:00 AM - 12:00 PM",
            location: "Mapusa",
            venue: "Mapusa Police Station Community Hall",
            capacity: "80 participants",
            summary: "Learn about cybercrime reporting procedures, legal aspects, and how to seek help when you become a victim.",
            details: [
                "Cybercrime reporting procedures and helplines",
                "Legal framework and cyber laws in India",
                "Evidence collection and preservation",
                "Victim support and recovery resources",
                "Prevention strategies and best practices"
            ],
            contact: {
                organizer: "Goa Police Cyber Cell",
                phone: "0832 244 3201",
                email: "picyber@goapolice.gov.in"
            },
            reference: "https://cybercrime.gov.in/"
        }
    ];

    // Render events function
    function renderEvents(eventList = events) {
        eventsGrid.innerHTML = eventList.map(event => `
            <div class="card">
                <div class="card-header">
                    <h3>${escapeHtml(event.title)}</h3>
                    <div class="event-type">${event.type}</div>
                </div>
                <div class="meta">
                    <span class="event-date">${formatDate(event.date)}</span>
                    <span class="event-time">${event.time}</span>
                    <span class="event-location">${event.location}</span>
                    <span class="event-capacity">${event.capacity}</span>
                    <span class="event-status status-${event.status}">${event.status}</span>
                </div>
                <div class="summary">${escapeHtml(event.summary)}</div>
                <div class="event-details">
                    <strong>What You'll Learn:</strong>
                    <ul>
                        ${event.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}
                    </ul>
                </div>
                <div class="event-contact">
                    <strong>Contact:</strong>
                    <span>${escapeHtml(event.contact.organizer)}</span><br>
                    <a href="tel:${event.contact.phone}">${event.contact.phone}</a> | 
                    <a href="mailto:${event.contact.email}">${event.contact.email}</a>
                </div>
                <div class="event-contact">
                    <strong>Venue:</strong> ${escapeHtml(event.venue)}
                </div>
            </div>
        `).join('');
        
        // Add animation to cards
        observeCards();
    }

    // Format date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    // Escape HTML function
    function escapeHtml(text) {
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Filter events function
    function filterEvents(filter) {
        let filteredEvents = events;
        
        if (filter === 'upcoming') {
            filteredEvents = events.filter(event => event.status === 'upcoming');
        } else if (filter === 'panjim') {
            filteredEvents = events.filter(event => event.location.toLowerCase() === 'panjim');
        } else if (filter === 'margao') {
            filteredEvents = events.filter(event => event.location.toLowerCase() === 'margao');
        } else if (filter === 'vasco') {
            filteredEvents = events.filter(event => event.location.toLowerCase() === 'vasco');
        } else if (filter === 'mapusa') {
            filteredEvents = events.filter(event => event.location.toLowerCase() === 'mapusa');
        }
        
        renderEvents(filteredEvents);
        
        // Center map on selected location
        centerMapOnLocation(filter);
    }

    // Search events function
    function searchEvents(searchTerm) {
        if (!searchTerm.trim()) {
            renderEvents();
            return;
        }
        
        const filteredEvents = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        renderEvents(filteredEvents);
    }

    // Card animation observer
    function observeCards() {
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

        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }

    // Event listeners
    document.querySelectorAll('.filters .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filters .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filterEvents(filter);
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchEvents(e.target.value);
    });

    // Initialize
    renderEvents();
    
    // Initialize map
    initializeMap();
});

// Map functionality
let map;
let markers = [];

function initializeMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.warn('Leaflet library not loaded');
        return;
    }
    
    map = L.map('map').setView([15.4909, 73.8278], 12); // Panjim coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Add markers for different event locations with custom icons
    const eventLocations = [
        { 
            coords: [15.4909, 73.8278], 
            title: 'Panjim Events', 
            popup: 'Cyber Awareness Events - Panjim',
            filter: 'panjim'
        },
        { 
            coords: [15.2736, 73.9589], 
            title: 'Margao Events', 
            popup: 'Cyber Awareness Events - Margao',
            filter: 'margao'
        },
        { 
            coords: [15.3866, 73.8154], 
            title: 'Vasco Events', 
            popup: 'Cyber Awareness Events - Vasco',
            filter: 'vasco'
        },
        { 
            coords: [15.6029, 73.8114], 
            title: 'Mapusa Events', 
            popup: 'Cyber Awareness Events - Mapusa',
            filter: 'mapusa'
        }
    ];
    
    // Create custom marker icon
    const cyberIcon = L.divIcon({
        className: 'cyber-marker',
        html: '<div style="background: linear-gradient(135deg, #00ff88, #00ccff); width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    eventLocations.forEach(location => {
        const marker = L.marker(location.coords, { icon: cyberIcon })
            .addTo(map)
            .bindPopup(location.popup)
            .openTooltip();
        
        // Store marker with filter info for highlighting
        marker.filter = location.filter;
        markers.push(marker);
    });
}

// Function to center map on specific location
function centerMapOnLocation(filter) {
    if (!map) return;
    
    const locations = {
        'panjim': [15.4909, 73.8278],
        'margao': [15.2736, 73.9589],
        'vasco': [15.3866, 73.8154],
        'mapusa': [15.6029, 73.8114],
        'all': [15.4909, 73.8278] // Default to Panjim for 'all'
    };
    
    const coords = locations[filter];
    if (coords) {
        map.setView(coords, 13);
        
        // Highlight the relevant marker
        markers.forEach(marker => {
            if (filter === 'all' || marker.filter === filter) {
                marker.setOpacity(1);
                marker.bringToFront();
            } else {
                marker.setOpacity(0.5);
            }
        });
    }
}
