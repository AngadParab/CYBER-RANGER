import { db } from "./firebase-config.js";
import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
// scripts/events.js

const DUMMY_EVENTS = [
    {
        id: "dummy-1",
        title: "Goa Cyber Awareness Workshop",
        posterUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        type: "Workshop",
        status: "upcoming",
        date: "2026-03-10",
        time: "10:00 AM",
        location: "Panjim",
        venue: "BITS Pilani, Goa Campus",
        summary: "An intensive session on identifying phishing attempts and securing personal devices.",
        details: ["Phishing Detection", "2FA Setup", "Secure Browsing"],
        contact: {
            organizer: "Cyber Ranger HQ",
            phone: "0832 244 3201",
            email: "picyber@goapolice.gov.in"
        }
    },
    {
        id: "dummy-2",
        title: "Digital Hygiene Seminar",
        posterUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
        type: "Webinar",
        status: "ongoing",
        date: "2026-02-15",
        time: "02:30 PM",
        location: "Margao",
        venue: "Ravindra Bhavan",
        summary: "Learn the daily habits that keep your digital identity safe from common social engineering.",
        details: ["Social Engineering", "Password Management", "Privacy Settings"],
        contact: {
            organizer: "Cyber Ranger Team",
            phone: "0832 244 3201",
            email: "picyber@goapolice.gov.in"
        }
    }
];
// Events Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('eventSearch');
    const EVENTS_COLLECTION = collection(db, "public_events");
    let publicEvents = [];

    // Render events function
    function renderEvents(eventList = publicEvents) {
        if (!eventsGrid) return;
        
        // Handle empty events list
        if (!eventList || eventList.length === 0) {
            eventsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #95a5a6;">
                    <p>No events available at this time. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        eventsGrid.innerHTML = eventList.map(event => {
            // SAFE DATA MAPPING (Handles missing fields gracefully)
            const safeEvent = {
                title: event.title || "Untitled",
                posterUrl: event.posterUrl || null, // <--- NEW: Image URL
                type: event.type || "Event",
                status: (event.status || "upcoming").toLowerCase(),
                date: event.date || "",
                time: event.time || "",             // <--- NEW: Time
                location: event.location || "—",
                venue: event.venue || "—",          // <--- NEW: Venue
                capacity: event.capacity || "Open",
                summary: event.summary || "",
                details: Array.isArray(event.details) ? event.details : ["General Session"],
                contact: {
                    organizer: event.contact?.organizer || "Cyber Ranger Team",
                    phone: event.contact?.phone || "",
                    email: event.contact?.email || ""
                }
            };

            return `
            <div class="card">
                ${safeEvent.posterUrl 
                  ? `<div class="card-image"><img src="${safeEvent.posterUrl}" alt="${escapeHtml(safeEvent.title)}" loading="lazy"></div>` 
                  : ''
                }

                <div class="card-header">
                    <h3>${escapeHtml(safeEvent.title)}</h3>
                    <div class="event-type">${escapeHtml(safeEvent.type)}</div>
                </div>
                
                <div class="meta">
                    <span class="event-date"><i class="far fa-calendar"></i> ${formatDate(safeEvent.date)}</span>
                    <span class="event-time"><i class="far fa-clock"></i> ${safeEvent.time}</span>
                    <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(safeEvent.location)}</span>
                    <span class="event-status status-${safeEvent.status}">${safeEvent.status}</span>
                </div>
                
                <div class="summary">${escapeHtml(safeEvent.summary)}</div>
                
                <div class="event-details">
                    <strong>What You'll Learn:</strong>
                    <ul>
                        ${safeEvent.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="event-contact">
                    <strong>Venue:</strong> ${escapeHtml(safeEvent.venue)}
                </div>

                <div class="event-contact">
                    <strong>Contact:</strong>
                    <span>${escapeHtml(safeEvent.contact.organizer)}</span><br>
                    ${safeEvent.contact.phone ? `<a href="tel:${safeEvent.contact.phone}"><i class="fas fa-phone"></i> ${safeEvent.contact.phone}</a>` : ''} 
                    ${safeEvent.contact.email ? ` | <a href="mailto:${safeEvent.contact.email}"><i class="fas fa-envelope"></i> Email</a>` : ''}
                </div>
            </div>
        `;
        }).join('');
        
        // Add animation to cards
        observeCards();
    }

    // Format date function
    function formatDate(dateString) {
        if (!dateString) return "TBD";
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString; 
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    // Escape HTML function (Prevents XSS)
    function escapeHtml(text) {
        if (!text) return "";
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Filter events function
    function filterEvents(filter) {
        let filteredEvents = publicEvents;
        
        if (filter === 'upcoming') {
            filteredEvents = publicEvents.filter(event => (event.status || "").toLowerCase() === 'upcoming');
        } else if (['panjim', 'margao', 'vasco', 'mapusa'].includes(filter)) {
            filteredEvents = publicEvents.filter(event => (event.location || "").toLowerCase().includes(filter));
        }
        
        renderEvents(filteredEvents);
        
        // Center map on selected location
        centerMapOnLocation(filter);
    }

    // Search events function
    function searchEvents(searchTerm) {
        if (!searchTerm.trim()) {
            renderEvents(publicEvents);
            return;
        }
        
        const term = searchTerm.toLowerCase();
        const filteredEvents = publicEvents.filter(event => 
            (event.title || "").toLowerCase().includes(term) ||
            (event.summary || "").toLowerCase().includes(term) ||
            (event.location || "").toLowerCase().includes(term) ||
            (event.type || "").toLowerCase().includes(term)
        );
        
        renderEvents(filteredEvents);
    }

    // Real-time Database Subscription


function subscribeToPublicEvents() {
    const q = query(EVENTS_COLLECTION, orderBy("createdAt", "desc"));
    onSnapshot(
        q,
        (snapshot) => {
            // Get real events from Firestore
            const liveEvents = snapshot.docs.map((doc) => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            
            // Combine dummy data with live data
            publicEvents = [...DUMMY_EVENTS, ...liveEvents];
            
            renderEvents(publicEvents);
        },
        (error) => {
            console.error("Failed to subscribe to public events", error);
            // Fallback: Still show dummy data even if the database fails
            renderEvents(DUMMY_EVENTS);
        }
    );
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

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchEvents(e.target.value);
        });
    }

    // Initialize
    subscribeToPublicEvents();
    initializeMap();
});

// Map functionality
let map;
let markers = [];

function initializeMap() {
    if (typeof L === 'undefined') {
        console.warn('Leaflet library not loaded');
        return;
    }
    
    // Check if map container exists
    if (!document.getElementById('map')) return;

    map = L.map('map').setView([15.4909, 73.8278], 11); // Centered on Goa
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Add markers for different event locations
    const eventLocations = [
        { coords: [15.4909, 73.8278], title: 'Panjim Events', popup: '<b>Panjim</b><br>Cyber Hub', filter: 'panjim' },
        { coords: [15.2736, 73.9589], title: 'Margao Events', popup: '<b>Margao</b><br>South District Center', filter: 'margao' },
        { coords: [15.3866, 73.8154], title: 'Vasco Events', popup: '<b>Vasco</b><br>Port Town Center', filter: 'vasco' },
        { coords: [15.6029, 73.8114], title: 'Mapusa Events', popup: '<b>Mapusa</b><br>North District Hub', filter: 'mapusa' }
    ];
    
    // Custom Cyber Marker
    const cyberIcon = L.divIcon({
        className: 'cyber-marker',
        html: '<div style="background: linear-gradient(135deg, #00ff88, #00ccff); width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #00ff88;"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    eventLocations.forEach(location => {
        const marker = L.marker(location.coords, { icon: cyberIcon })
            .addTo(map)
            .bindPopup(location.popup);
        
        marker.filter = location.filter;
        markers.push(marker);
    });
}

function centerMapOnLocation(filter) {
    if (!map) return;
    
    const locations = {
        'panjim': [15.4909, 73.8278],
        'margao': [15.2736, 73.9589],
        'vasco': [15.3866, 73.8154],
        'mapusa': [15.6029, 73.8114],
        'all': [15.4909, 73.8278]
    };
    
    const coords = locations[filter] || locations['all'];
    map.setView(coords, filter === 'all' ? 11 : 13);
}