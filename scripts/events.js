import { db } from "./firebase-config.js";
import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";



document.addEventListener('DOMContentLoaded', function() {
    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('eventSearch');
    const EVENTS_COLLECTION = collection(db, "public_events");
    let publicEvents = [];

    function renderEvents(eventList = publicEvents) {
        if (!eventsGrid) return;
        
        if (!eventList || eventList.length === 0) {
            eventsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #95a5a6;">
                    <p>No events available at this time. Check back soon!</p>
                </div>`;
            return;
        }
        
        eventsGrid.innerHTML = eventList.map(event => {
            const safeEvent = {
                title: event.title || "Untitled",
                posterUrl: event.posterUrl || null,
                type: event.type || "Event",
                status: (event.status || "upcoming").toLowerCase(),
                date: event.date || "",
                time: event.time || "",
                location: event.location || "—",
                venue: event.venue || "—",
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
            </div>`;
        }).join('');
        
        observeCards();
    }

    function renderFilters() {
        const filterContainer = document.getElementById('dynamicFilters');
        if (!filterContainer) return;

        const locations = [...new Set(publicEvents.map(event => {
            const loc = event.location.trim();
            return loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase();
        }))].sort();

        let filterHtml = `
            <button class="btn active" data-filter="all">All Events</button>
            <button class="btn" data-filter="upcoming">Upcoming</button>
        `;

        locations.forEach(loc => {
            filterHtml += `<button class="btn" data-filter="${loc.toLowerCase()}">${loc}</button>`;
        });

        filterContainer.innerHTML = filterHtml;

        filterContainer.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterContainer.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterEvents(btn.dataset.filter);
            });
        });
    }

    function formatDate(dateString) {
        if (!dateString) return "TBD";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; 
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function escapeHtml(text) {
        if (!text) return "";
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function filterEvents(filter) {
        let filteredEvents = publicEvents;
        if (filter === 'upcoming') {
            filteredEvents = publicEvents.filter(event => (event.status || "").toLowerCase() === 'upcoming');
        } else if (filter !== 'all') {
            filteredEvents = publicEvents.filter(event => (event.location || "").toLowerCase().includes(filter));
        }
        renderEvents(filteredEvents);
        centerMapOnLocation(filter);
    }

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

    function subscribeToPublicEvents() {
        const q = query(EVENTS_COLLECTION, orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const liveEvents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            publicEvents = [...DUMMY_EVENTS, ...liveEvents];
            renderEvents(publicEvents);
            renderFilters();
        }, (error) => {
            console.error("Subscription error:", error);
            renderEvents(DUMMY_EVENTS);
            renderFilters();
        });
    }

   
    function observeCards() {
   
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
   
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => searchEvents(e.target.value));
    }

  
    subscribeToPublicEvents();
    initializeMap();
});


let map;
let markers = [];

function initializeMap() {
    if (typeof L === 'undefined' || !document.getElementById('map')) return;
    map = L.map('map').setView([15.4909, 73.8278], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    
    const eventLocations = [
        { coords: [15.4909, 73.8278], title: 'Panjim Events', popup: '<b>Panjim</b>', filter: 'panjim' },
        { coords: [15.2736, 73.9589], title: 'Margao Events', popup: '<b>Margao</b>', filter: 'margao' },
        { coords: [15.3866, 73.8154], title: 'Vasco Events', popup: '<b>Vasco</b>', filter: 'vasco' },
        { coords: [15.6029, 73.8114], title: 'Mapusa Events', popup: '<b>Mapusa</b>', filter: 'mapusa' }
    ];
    

    const cyberIcon = L.divIcon({
        className: 'cyber-marker',
        html: '<div style="background: linear-gradient(135deg, #00ff88, #00ccff); width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff;"></div>',
        iconSize: [20, 20]
    });
    
    eventLocations.forEach(location => {
        const marker = L.marker(location.coords, { icon: cyberIcon }).addTo(map).bindPopup(location.popup);
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