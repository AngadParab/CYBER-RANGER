/**
 * Cyber Ranger Ambassador Login Script
 * Handles Firebase authentication and input validation for a single-mode form.
 */

// Firebase Configuration - Replace with real project values
const firebaseConfig = {
  apiKey: "AIzaSyDRMJNDa0__NPI7p9-3LIeX2q228liz0F8",
    authDomain: "cyber-ranger.firebaseapp.com",
    projectId: "cyber-ranger",
    storageBucket: "cyber-ranger.firebasestorage.app",
    messagingSenderId: "783225495647",
    appId: "1:783225495647:web:7efb25367c38d388963bea",
};

let auth = null;
try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.log("Firebase initialization skipped - running in demo mode:", error.message);
}

const state = {
  isSubmitting: false,
  formData: {
    email: "",
    password: ""
  },
  errors: {
    email: "",
    password: ""
  }
};

const elements = {
  form: null,
  emailInput: null,
  passwordInput: null,
  emailError: null,
  passwordError: null,
  submitButton: null
};

function initApp() {
  cacheElements();

  if (!elements.form) {
    console.warn("Ambassador form not found. Aborting initialization.");
    return;
  }

  setupEventListeners();
  setInitialFocus();

  if (auth) {
    auth.onAuthStateChanged(handleAuthStateChange);
  }

  console.log("Cyber Ranger Ambassador Login ready");
}

function cacheElements() {
  elements.form = document.getElementById("ambassador-form");
  elements.emailInput = document.getElementById("ambassador-email");
  elements.passwordInput = document.getElementById("ambassador-password");
  elements.emailError = document.getElementById("email-error");
  elements.passwordError = document.getElementById("password-error");
  elements.submitButton = document.getElementById("sign-in-btn");
}

function setupEventListeners() {
  elements.form?.addEventListener("submit", handleAmbassadorLogin);

  elements.emailInput?.addEventListener("input", (event) => validateField("email", event.target.value));
  elements.emailInput?.addEventListener("blur", (event) => validateField("email", event.target.value));

  elements.passwordInput?.addEventListener("input", (event) => validateField("password", event.target.value));
  elements.passwordInput?.addEventListener("blur", (event) => validateField("password", event.target.value));

  elements.emailInput?.addEventListener("focus", () => clearError("email"));
  elements.passwordInput?.addEventListener("focus", () => clearError("password"));
}

function setInitialFocus() {
  elements.emailInput?.focus();
}

function handleAuthStateChange(user) {
  if (user) {
    showNotification(`Welcome back, ${user.displayName || user.email}!`, "success");
  }
}

function handleAmbassadorLogin(event) {
  event.preventDefault();
  if (state.isSubmitting) return;

  const formData = new FormData(elements.form);
  state.formData.email = formData.get("email")?.trim() || "";
  state.formData.password = formData.get("password") || "";

  if (!validateForm()) {
    console.log("Ambassador form validation failed");
    return;
  }

  setFormLoading(true);
  authenticateWithFirebase();
}

function validateForm() {
  const isEmailValid = validateField("email", state.formData.email);
  const isPasswordValid = validateField("password", state.formData.password);
  return isEmailValid && isPasswordValid;
}

function validateField(fieldName, rawValue) {
  const value = rawValue?.toString().trim() || "";

  if (fieldName === "email") {
    return validateEmail(value);
  }

  if (fieldName === "password") {
    return validatePassword(value);
  }

  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError("email", "Email is required");
    return false;
  }
  if (!emailRegex.test(email)) {
    showError("email", "Please enter a valid email address");
    return false;
  }
  clearError("email");
  return true;
}

function validatePassword(password) {
  if (!password) {
    showError("password", "Password is required");
    return false;
  }
  if (password.length < 8) {
    showError("password", "Password must be at least 8 characters");
    return false;
  }
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  if (!hasNumber || !hasLetter) {
    showError("password", "Password must contain both letters and numbers");
    return false;
  }
  clearError("password");
  return true;
}

function showError(fieldName, message) {
  state.errors[fieldName] = message;

  const errorElement = fieldName === "email" ? elements.emailError : elements.passwordError;
  const inputElement = fieldName === "email" ? elements.emailInput : elements.passwordInput;

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.opacity = "1";
  }

  if (inputElement) {
    inputElement.setAttribute("aria-invalid", "true");
    inputElement.style.borderColor = "var(--error-color)";
  }
}

function clearError(fieldName) {
  state.errors[fieldName] = "";

  const errorElement = fieldName === "email" ? elements.emailError : elements.passwordError;
  const inputElement = fieldName === "email" ? elements.emailInput : elements.passwordInput;

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.opacity = "0";
  }

  if (inputElement) {
    inputElement.removeAttribute("aria-invalid");
    inputElement.style.borderColor = "";
  }
}

function setFormLoading(isLoading) {
  state.isSubmitting = isLoading;

  elements.emailInput && (elements.emailInput.disabled = isLoading);
  elements.passwordInput && (elements.passwordInput.disabled = isLoading);

  setButtonLoading(elements.submitButton, isLoading);
}

function setButtonLoading(button, isLoading) {
  if (!button) return;

  const spinner = button.querySelector(".loading-spinner");
  const btnText = button.querySelector(".btn-text") || button;

  if (isLoading) {
    button.disabled = true;
    if (spinner) spinner.hidden = false;
    if (btnText) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = btnText.textContent;
      }
      btnText.textContent = "Processing...";
    }
  } else {
    button.disabled = false;
    if (spinner) spinner.hidden = true;
    if (btnText && button.dataset.originalText) {
      btnText.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
}

async function authenticateWithFirebase() {
  if (!auth) {
    simulateFirebaseAuth();
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      state.formData.email,
      state.formData.password
    );
    const user = userCredential.user;
    showNotification(`Welcome back, Ambassador ${user.displayName || user.email}!`, "success");
    setFormLoading(false);
    // window.location.href = "/ambassador-dashboard";
  } catch (error) {
    console.error("Firebase authentication error:", error);
    let errorMessage = "Authentication failed. Please try again.";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email address.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address format.";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection.";
        break;
    }

    showError("password", errorMessage);
    showNotification(errorMessage, "error");
    setFormLoading(false);
  }
}

function simulateFirebaseAuth() {
  const outcomes = ["success", "invalid-credentials", "server-error"];
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  switch (outcome) {
    case "success":
      showNotification(
        `Welcome back, Ambassador ${state.formData.email}! Authentication successful.`,
        "success"
      );
      break;
    case "invalid-credentials":
      showError("password", "Invalid email or password");
      showNotification("Authentication failed. Please check your credentials.", "error");
      break;
    case "server-error":
      showNotification("Authentication service unavailable. Please try again later.", "error");
      break;
  }

  setFormLoading(false);
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "polite");

  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "8px",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "14px",
    zIndex: "1000",
    minWidth: "280px",
    maxWidth: "420px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    backgroundColor:
      type === "success"
        ? "var(--accent-color)"
        : type === "error"
        ? "var(--error-color)"
        : "var(--text-secondary)"
  });

  document.body.appendChild(notification);
  requestAnimationFrame(() => {
    notification.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function cleanup() {
  elements.form?.removeEventListener("submit", handleAmbassadorLogin);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

window.addEventListener("beforeunload", cleanup);

window.CyberRangerLogin = {
  validateField,
  firebaseConfig
};