import { auth, db, storage } from "./firebase-config.js";
import { 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const LOGIN_PATH = "/login.html";
const EVENTS_COLLECTION = collection(db, "public_events");
const NEWS_COLLECTION = collection(db, "public_news"); // New Collection

const state = {
  activeSection: "dashboard",
  events: [],
  news: [],
  profile: { name: "Ambassador", email: "", photoURL: "" }
};

const elements = {};

function init() {
  cacheElements();
  wireNavigation();
  wireQuickActions();
  wireLogout();
  wireEventsModal();
  wireNewsModal(); // New Wire
  guardRoute();
  renderProfile();
  subscribeToEvents();
  subscribeToNews(); // New Sub
}

function cacheElements() {
  elements.navLinks = Array.from(document.querySelectorAll(".nav-link"));
  elements.sections = Array.from(document.querySelectorAll(".section"));
  elements.quickActionButtons = Array.from(document.querySelectorAll("[data-section-target]"));
  elements.logoutButton = document.getElementById("logout-btn");
  
  elements.profile = {
    avatar: document.getElementById("profile-avatar"),
    name: document.getElementById("profile-name"),
    email: document.getElementById("profile-email")
  };

  elements.event = {
    openModal: document.getElementById("open-event-modal"),
    closeModal: document.getElementById("close-event-modal"),
    cancelModal: document.getElementById("cancel-event-modal"),
    modal: document.getElementById("event-modal"),
    form: document.getElementById("event-form"),
    tableBody: document.getElementById("events-table-body"),
    count: document.getElementById("event-count")
  };

  // New News Elements
  elements.news = {
    openModal: document.getElementById("open-news-modal"),
    closeModal: document.getElementById("close-news-modal"),
    cancelModal: document.getElementById("cancel-news-modal"),
    modal: document.getElementById("news-modal"),
    form: document.getElementById("news-form"),
    tableBody: document.getElementById("news-table-body"),
    count: document.getElementById("news-count"),
    metric: document.getElementById("metric-news")
  };
}

// ... (Navigation, Logout, Guard Route, Profile functions remain same) ...
function wireNavigation() {
    elements.navLinks.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.section;
        if (target) showSection(target);
      });
    });
}
  
function wireQuickActions() {
    elements.quickActionButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
        const target = btn.dataset.sectionTarget;
        if (target) showSection(target);
        });
    });
}

function showSection(sectionName) {
    state.activeSection = sectionName;
    elements.sections.forEach((section) => {
      section.classList.toggle("is-visible", section.dataset.section === sectionName);
    });
    elements.navLinks.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.section === sectionName);
    });
}

function wireLogout() {
    elements.logoutButton?.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = LOGIN_PATH;
      } catch (error) {
        console.error("Logout failed", error);
      }
    });
}
  
function guardRoute() {
    if (!auth) return;
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = LOGIN_PATH;
        return;
      }
      state.profile.name = user.displayName || "Ambassador";
      state.profile.email = user.email;
      renderProfile();
    });
}

function renderProfile() {
    elements.profile.name.textContent = state.profile.name;
    elements.profile.email.textContent = state.profile.email;
}

// --- EVENT LOGIC (Kept same) ---
function wireEventsModal() {
  const { openModal, closeModal, cancelModal, modal, form } = elements.event;
  const close = () => { modal.classList.remove("is-open"); form.reset(); };
  openModal?.addEventListener("click", () => modal.classList.add("is-open"));
  closeModal?.addEventListener("click", close);
  cancelModal?.addEventListener("click", close);
  form?.addEventListener("submit", handleEventSubmit);
}

async function handleEventSubmit(e) {
    e.preventDefault();
    // (Copy your existing Event Submit logic here if needed, or I can assume it's same)
    // For brevity, I'll focus on the NEWS logic below, but ensure this exists!
    const form = elements.event.form;
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = "Uploading..."; btn.disabled = true;

    try {
        const formData = new FormData(form);
        let posterUrl = "";
        const file = document.getElementById('event-poster')?.files[0];
        if(file) {
            const snap = await uploadBytes(ref(storage, `events/${Date.now()}_${file.name}`), file);
            posterUrl = await getDownloadURL(snap.ref);
        }
        
        await addDoc(EVENTS_COLLECTION, {
            title: formData.get("title"),
            date: formData.get("date"),
            location: formData.get("location"),
            status: formData.get("status"),
            posterUrl,
            // ... other fields
            createdAt: new Date().toISOString()
        });
        form.reset();
        elements.event.modal.classList.remove("is-open");
        alert("Event Added!");
    } catch(err) { alert(err.message); }
    finally { btn.innerHTML = "Publish Event"; btn.disabled = false; }
}

function subscribeToEvents() {
    onSnapshot(query(EVENTS_COLLECTION, orderBy("createdAt", "desc")), (snap) => {
        state.events = snap.docs.map(d => d.data());
        const html = state.events.map(e => `
            <div class="table__row">
                <span>${e.title}</span><span>${e.date}</span>
                <span>${e.location}</span><span>${e.status}</span>
            </div>`).join('');
        elements.event.tableBody.innerHTML = html || '<div class="table__row"><span>No events</span></div>';
        elements.event.count.textContent = `${state.events.length} events`;
        document.getElementById('metric-events').textContent = state.events.length;
    });
}

// --- NEW NEWS LOGIC ---
function wireNewsModal() {
  const { openModal, closeModal, cancelModal, modal, form } = elements.news;
  const close = () => { modal.classList.remove("is-open"); form.reset(); };
  
  openModal?.addEventListener("click", () => modal.classList.add("is-open"));
  closeModal?.addEventListener("click", close);
  cancelModal?.addEventListener("click", close);
  
  form?.addEventListener("submit", handleNewsSubmit);
}

async function handleNewsSubmit(e) {
  e.preventDefault();
  const form = elements.news.form;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Posting...';
  submitButton.disabled = true;

  try {
    const formData = new FormData(form);
    
    // 1. Upload Image
    let imageUrl = "";
    const file = document.getElementById('news-image')?.files[0];
    if (file) {
      const storageRef = ref(storage, `news/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // 2. Process Tips (Split by lines)
    const rawTips = formData.get("tips")?.toString() || "";
    const tipsArray = rawTips.split('\n').filter(line => line.trim() !== "");

    // 3. Create Object
    const newArticle = {
      title: formData.get("title"),
      date: formData.get("date"),
      region: formData.get("region"),
      type: formData.get("type"),
      summary: formData.get("summary"),
      reference: formData.get("reference"),
      image: imageUrl,
      tips: tipsArray,
      createdAt: new Date().toISOString()
    };

    // 4. Save to Firestore
    await addDoc(NEWS_COLLECTION, newArticle);
    
    form.reset();
    elements.news.modal.classList.remove("is-open");
    alert("News Article Posted Successfully!");
    
  } catch (error) {
    console.error("News Error:", error);
    alert("Failed to post news: " + error.message);
  } finally {
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

function subscribeToNews() {
  const q = query(NEWS_COLLECTION, orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    state.news = snapshot.docs.map((doc) => doc.data());
    renderNews();
  });
}

function renderNews() {
  const list = state.news || [];
  const html = list.map(item => `
    <div class="table__row">
      <span>${item.title}</span>
      <span>${item.date}</span>
      <span>${item.region}</span>
      <span style="text-transform:capitalize">${item.type}</span>
    </div>
  `).join('');
  
  elements.news.tableBody.innerHTML = html || '<div class="table__row is-placeholder"><span>No articles yet</span></div>';
  elements.news.count.textContent = `${list.length} articles`;
  if(elements.news.metric) elements.news.metric.textContent = list.length;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}