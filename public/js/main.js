document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.getElementById("darkModeToggle");

  // 1️⃣ Load user preference or default to dark mode
  let saved = localStorage.getItem("darkMode");

  if (saved === null) {
    // default = dark mode enabled
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "true");
    toggle.textContent = "☀️";
  } else if (saved === "true") {
    document.body.classList.add("dark-mode");
    toggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    toggle.textContent = "🌙";
  }

  // 2️⃣ Toggle button
  toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark ? "true" : "false");
    toggle.textContent = isDark ? "☀️" : "🌙";
  });

  // 3️⃣ small message utility
  window.showMessage = (msg, type="info") => {
    const div = document.createElement("div");
    div.textContent = msg;
    div.className = `message ${type}`;
    div.style.cssText = `
      position: fixed;
      top: 25px;
      right: 25px;
      padding: 1rem 1.2rem;
      background: ${type === "error" ? "#dc3545" : "#007bff"};
      color: white;
      border-radius: 6px;
      z-index: 9999;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  };

});
