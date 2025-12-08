/**
 * Ambassador Dashboard bootstrap
 * - Guards the page with auth (redirects to login if signed out)
 * - Handles simple section toggling via sidebar + quick actions
 * - Provides logout handler
 */

import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const LOGIN_PATH = "/login.html";

const state = {
  activeSection: "dashboard",
  profile: {
    name: "Ambassador",
    email: "email@example.com",
    phone: "—",
    occupation: "—",
    age: "—",
    photoURL: ""
  },
  events: []
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
  renderEvents();
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

function handleEventSubmit(event) {
  event.preventDefault();
  const form = elements.event.form;
  if (!form) return;
  const formData = new FormData(form);
  const newEvent = {
    title: formData.get("title")?.toString().trim() || "Untitled",
    date: formData.get("date")?.toString(),
    location: formData.get("location")?.toString().trim() || "—",
    status: formData.get("status")?.toString() || "Upcoming"
  };
  state.events = [
    newEvent,
    ...state.events
  ];
  renderEvents();
  toggleModal(false);
}

function renderEvents() {
  const { tableBody, count } = elements.event;
  if (!tableBody) return;

  if (!state.events.length) {
    tableBody.innerHTML = `
      <div class="table__row is-placeholder">
        <span>—</span><span>—</span><span>—</span><span>—</span>
      </div>`;
  } else {
    tableBody.innerHTML = state.events
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
    const num = state.events.length;
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

