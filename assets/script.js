function loadProfile() {
  const name = document.getElementById('profileName').value.trim();
  if (!name) return alert("Enter your player name");

  // Save to localStorage and redirect
  localStorage.setItem("playerName", name);
  window.location.href = "profile.html";
}
