/**
 * Ambassador Dashboard bootstrap
 * - Guards the page with auth (redirects to login if signed out)
 * - Handles simple section toggling via sidebar + quick actions
 * - Provides logout handler
 */

import { auth, db, storage } from "./firebase-config.js"; // Added storage
import { 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js"; // New Storage Imports
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const LOGIN_PATH = "/login.html";
const EVENTS_COLLECTION = collection(db, "public_events");

const state = {
  activeSection: "dashboard",
  profile: {
    name: "Ambassador",
    email: "email@example.com",
    phone: "—",
    occupation: "—",
    age: "—",
    photoURL: ""
  }
};

const elements = {
  navLinks: [],
  sections: [],
  quickActionButtons: [],
  logoutButton: null,
  profile: {},
  event: {}
};

function init() {
  cacheElements();
  wireNavigation();
  wireQuickActions();
  wireLogout();
  wireEventsModal();
  guardRoute();
  renderProfile();
  subscribeToEvents();
}

function cacheElements() {
  elements.navLinks = Array.from(document.querySelectorAll(".nav-link"));
  elements.sections = Array.from(document.querySelectorAll(".section"));
  elements.quickActionButtons = Array.from(document.querySelectorAll("[data-section-target]"));
  elements.logoutButton = document.getElementById("logout-btn");
  elements.profile = {
    avatar: document.getElementById("profile-avatar"),
    name: document.getElementById("profile-name"),
    email: document.getElementById("profile-email"),
    emailDuplicate: document.getElementById("profile-email-duplicate"),
    phone: document.getElementById("profile-phone"),
    occupation: document.getElementById("profile-occupation"),
    age: document.getElementById("profile-age")
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
}

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

function wireLogout() {
  elements.logoutButton?.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = LOGIN_PATH;
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed. Please try again.");
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
    hydrateProfile(user);
  });
}

function showSection(sectionName) {
  state.activeSection = sectionName;
  elements.sections.forEach((section) => {
    const isMatch = section.dataset.section === sectionName;
    section.classList.toggle("is-visible", isMatch);
  });

  elements.navLinks.forEach((btn) => {
    const isMatch = btn.dataset.section === sectionName;
    btn.classList.toggle("is-active", isMatch);
  });
}

function hydrateProfile(user) {
  state.profile.name = user.displayName || user.email?.split("@")[0] || "Ambassador";
  state.profile.email = user.email || "email@example.com";
  state.profile.phone = user.phoneNumber || "—";
  state.profile.photoURL = user.photoURL || "";
  // Placeholder demo values; replace with Firestore data if available
  state.profile.occupation = state.profile.occupation === "—" ? "Cyber Ambassador" : state.profile.occupation;
  state.profile.age = state.profile.age === "—" ? "—" : state.profile.age;
  renderProfile();
}

function renderProfile() {
  const { avatar, name, email, emailDuplicate, phone, occupation, age } = elements.profile;
  if (!avatar) return;
  name.textContent = state.profile.name;
  email.textContent = state.profile.email;
  emailDuplicate.textContent = state.profile.email;
  phone.textContent = state.profile.phone;
  occupation.textContent = state.profile.occupation;
  age.textContent = state.profile.age;

  if (state.profile.photoURL) {
    avatar.style.backgroundImage = `url(${state.profile.photoURL})`;
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.textContent = "";
  } else {
    avatar.style.backgroundImage = "";
    avatar.textContent = (state.profile.name || "A").slice(0, 2).toUpperCase();
  }
}

function wireEventsModal() {
  const { openModal, closeModal, cancelModal, modal, form } = elements.event;
  const close = () => toggleModal(false);
  openModal?.addEventListener("click", () => toggleModal(true));
  closeModal?.addEventListener("click", close);
  cancelModal?.addEventListener("click", close);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  form?.addEventListener("submit", handleEventSubmit);
}

function toggleModal(isOpen) {
  const { modal, form } = elements.event;
  if (!modal) return;
  modal.classList.toggle("is-open", isOpen);
  modal.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    form?.reset();
  }
}

async function handleEventSubmit(event) {
  event.preventDefault();
  const form = elements.event.form;
  const submitButton = form?.querySelector('button[type="submit"]');
  
  if (!form) return;

  // 1. Show Loading State
  const originalButtonText = submitButton?.innerHTML || "";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
  }

  try {
    const formData = new FormData(form);
    
    // 2. Handle Image Upload
    let posterUrl = ""; // Default empty if no image
    const fileInput = document.getElementById('event-poster');
    const file = fileInput?.files[0];

    if (file) {
        // Create unique path: events/timestamp_filename
        const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        posterUrl = await getDownloadURL(snapshot.ref);
    }

    // 3. Process Details (Split text area by new lines)
    const rawDetails = formData.get("details")?.toString() || "";
    const detailsArray = rawDetails.split('\n').filter(line => line.trim() !== "");

    // 4. Create Full Event Object
    const newEvent = {
      title: formData.get("title")?.toString().trim(),
      date: formData.get("date"),
      time: formData.get("time"),
      type: formData.get("type"),
      location: formData.get("location"),
      venue: formData.get("venue"),
      summary: formData.get("summary"),
      details: detailsArray.length ? detailsArray : ["Cyber Safety Basics"],
      status: formData.get("status"),
      posterUrl: posterUrl, // Save the image URL
      contact: {
          organizer: formData.get("organizer") || "Cyber Ranger Team",
          phone: formData.get("phone") || "",
          email: state.profile.email
      },
      createdAt: new Date().toISOString()
    };

    // 5. Save to Firestore
    await addDoc(EVENTS_COLLECTION, newEvent);
    
    form.reset();
    toggleModal(false);
    alert("Event Published Successfully!");
    
  } catch (error) {
    console.error("Failed to add event", error);
    alert("Error: " + error.message);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }
}

function subscribeToEvents() {
  const q = query(EVENTS_COLLECTION, orderBy("createdAt", "desc"));
  onSnapshot(
    q,
    (snapshot) => {
      state.events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      renderEvents();
    },
    (error) => {
      console.error("Failed to subscribe to events", error);
    }
  );
}

function renderEvents() {
  const { tableBody, count } = elements.event;
  if (!tableBody) return;
  const events = state.events || [];

  if (!events.length) {
    tableBody.innerHTML = `
      <div class="table__row is-placeholder">
        <span>—</span><span>—</span><span>—</span><span>—</span>
      </div>`;
  } else {
    tableBody.innerHTML = events
      .map(
        (evt) => `
      <div class="table__row">
        <span>${escapeHtml(evt.title)}</span>
        <span>${formatDate(evt.date)}</span>
        <span>${escapeHtml(evt.location)}</span>
        <span>${escapeHtml(evt.status)}</span>
      </div>`
      )
      .join("");
  }

  if (count) {
    const num = events.length;
    count.textContent = `${num} event${num === 1 ? "" : "s"}`;
  }
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

