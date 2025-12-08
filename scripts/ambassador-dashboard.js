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
  activeSection: "dashboard"
};

const elements = {
  navLinks: [],
  sections: [],
  quickActionButtons: [],
  logoutButton: null
};

function init() {
  cacheElements();
  wireNavigation();
  wireQuickActions();
  wireLogout();
  guardRoute();
}

function cacheElements() {
  elements.navLinks = Array.from(document.querySelectorAll(".nav-link"));
  elements.sections = Array.from(document.querySelectorAll(".section"));
  elements.quickActionButtons = Array.from(document.querySelectorAll("[data-section-target]"));
  elements.logoutButton = document.getElementById("logout-btn");
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
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = LOGIN_PATH;
    }
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

