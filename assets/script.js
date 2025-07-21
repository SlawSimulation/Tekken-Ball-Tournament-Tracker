// Shared script for all pages
function loadProfile() {
  const name = document.getElementById('profileName').value.trim();
  if (!name) return alert("Enter your player name");
  localStorage.setItem("playerName", name);
  window.location.href = "profile.html";
}

// NOTES PAGE
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

// PROFILE PAGE
if (window.location.pathname.includes("profile.html")) {
  const name = localStorage.getItem("playerName");
  const section = document.getElementById("profileSection");
  const noAccess = document.getElementById("noAccess");

  if (!name) {
    section.style.display = "none";
    noAccess.style.display = "block";
  } else {
    document.getElementById("playerTitle").textContent = `${name}'s Profile`;
    section.style.display = "block";
    noAccess.style.display = "none";
    loadStats(name);
  }
}

function loadStats(name) {
  const wins = parseInt(localStorage.getItem(`wins_${name}`)) || 0;
  const losses = parseInt(localStorage.getItem(`losses_${name}`)) || 0;
  document.getElementById("wins").textContent = wins;
  document.getElementById("losses").textContent = losses;
  const total = wins + losses;
  const ratio = total > 0 ? Math.round((wins / total) * 100) : 0;
  document.getElementById("ratio").textContent = `${ratio}%`;
}

function addWin() {
  const name = localStorage.getItem("playerName");
  const winsKey = `wins_${name}`;
  const newWins = (parseInt(localStorage.getItem(winsKey)) || 0) + 1;
  localStorage.setItem(winsKey, newWins);
  loadStats(name);
}

function addLoss() {
  const name = localStorage.getItem("playerName");
  const lossesKey = `losses_${name}`;
  const newLosses = (parseInt(localStorage.getItem(lossesKey)) || 0) + 1;
  localStorage.setItem(lossesKey, newLosses);
  loadStats(name);
}

if (window.location.pathname.includes("leaderboard.html")) {
  const tbody = document.getElementById("leaderboardBody");

  const players = Object.keys(localStorage)
    .filter(key => key.startsWith("wins_"))
    .map(key => key.replace("wins_", ""));

  const rows = players.map(name => {
    const wins = parseInt(localStorage.getItem(`wins_${name}`)) || 0;
    const losses = parseInt(localStorage.getItem(`losses_${name}`)) || 0;
    const total = wins + losses;
    const ratio = total > 0 ? Math.round((wins / total) * 100) : 0;
    return { name, wins, losses, ratio };
  });

  rows.sort((a, b) => b.ratio - a.ratio);

  for (const row of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.wins}</td>
      <td>${row.losses}</td>
      <td>${row.ratio}%</td>
    `;
    tbody.appendChild(tr);
  }
}
