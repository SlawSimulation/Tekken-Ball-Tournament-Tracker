// Shared script for all pages
function loadProfile() {
  const name = document.getElementById('profileName').value.trim();
  if (!name) return alert("Enter your player name");
  localStorage.setItem("playerName", name);
  window.location.href = "profile.html";
}

// On notes.html
if (window.location.pathname.includes("notes.html")) {
  const name = localStorage.getItem("playerName");
  const notesArea = document.getElementById("notesArea");
  const noAccess = document.getElementById("noAccess");

  if (!name) {
    notesArea.style.display = "none";
    noAccess.style.display = "block";
  } else {
    document.getElementById("notes").value = localStorage.getItem(`notes_${name}`) || "";
    notesArea.style.display = "block";
    noAccess.style.display = "none";
  }
}

function savePrivateNotes() {
  const name = localStorage.getItem("playerName");
  if (!name) return;
  const notes = document.getElementById("notes").value;
  localStorage.setItem(`notes_${name}`, notes);
  alert("Notes saved securely to your browser.");
}
