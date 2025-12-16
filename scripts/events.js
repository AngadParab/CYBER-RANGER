import { db } from "./firebase-config.js";
import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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
            const safeEvent = {
                title: event.title || "Untitled",
                type: event.type || "—",
                status: (event.status || "upcoming").toLowerCase(),
                date: event.date || "",
                time: event.time || "",
                location: event.location || "—",
                venue: event.venue || "—",
                capacity: event.capacity || "",
                summary: event.summary || "",
                details: Array.isArray(event.details) ? event.details : [],
                contact: {
                    organizer: event.contact?.organizer || "—",
                    phone: event.contact?.phone || "",
                    email: event.contact?.email || ""
                }
            };

            return `
            <div class="card">
                <div class="card-header">
                    <h3>${escapeHtml(safeEvent.title)}</h3>
                    <div class="event-type">${safeEvent.type}</div>
                </div>
                <div class="meta">
                    <span class="event-date">${formatDate(safeEvent.date)}</span>
                    <span class="event-time">${safeEvent.time}</span>
                    <span class="event-location">${safeEvent.location}</span>
                    <span class="event-capacity">${safeEvent.capacity}</span>
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
                    <strong>Contact:</strong>
                    <span>${escapeHtml(safeEvent.contact.organizer)}</span><br>
                    <a href="tel:${safeEvent.contact.phone}">${safeEvent.contact.phone}</a> | 
                    <a href="mailto:${safeEvent.contact.email}">${safeEvent.contact.email}</a>
                </div>
                <div class="event-contact">
                    <strong>Venue:</strong> ${escapeHtml(safeEvent.venue)}
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
        if (Number.isNaN(date.getTime())) return dateString; // Return original if invalid
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
        let filteredEvents = publicEvents;
        
        if (filter === 'upcoming') {
            filteredEvents = publicEvents.filter(event => event.status === 'upcoming');
        } else if (filter === 'panjim') {
            filteredEvents = publicEvents.filter(event => (event.location || "").toLowerCase() === 'panjim');
        } else if (filter === 'margao') {
            filteredEvents = publicEvents.filter(event => (event.location || "").toLowerCase() === 'margao');
        } else if (filter === 'vasco') {
            filteredEvents = publicEvents.filter(event => (event.location || "").toLowerCase() === 'vasco');
        } else if (filter === 'mapusa') {
            filteredEvents = publicEvents.filter(event => (event.location || "").toLowerCase() === 'mapusa');
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
        
        const term = searchTerm.toLowerCase();
        const filteredEvents = publicEvents.filter(event => 
            (event.title || "").toLowerCase().includes(term) ||
            (event.summary || "").toLowerCase().includes(term) ||
            (event.location || "").toLowerCase().includes(term) ||
            (event.type || "").toLowerCase().includes(term)
        );
        
        renderEvents(filteredEvents);
    }

    function subscribeToPublicEvents() {
        // Order by createdAt descending to show newest events first
        // If you prefer to order by event date, use: orderBy("date", "asc")
        const q = query(EVENTS_COLLECTION, orderBy("createdAt", "desc"));
        onSnapshot(
            q,
            (snapshot) => {
                publicEvents = snapshot.docs.map((doc) => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                renderEvents(publicEvents);
            },
            (error) => {
                console.error("Failed to subscribe to public events", error);
                // Show error message to user if needed
                if (eventsGrid) {
                    eventsGrid.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: #e74c3c;">
                            <p>Unable to load events. Please refresh the page.</p>
                        </div>
                    `;
                }
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

    searchInput.addEventListener('input', (e) => {
        searchEvents(e.target.value);
    });

    // Initialize
    subscribeToPublicEvents();
    
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