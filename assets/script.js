// --- AUTH ---
function registerUser() {
  const username = document.getElementById("registerName").value.trim();
  const password = document.getElementById("registerPassword").value;
  if (!username || !password) return alert("Please enter both username and password.");

  if (localStorage.getItem(`user_${username}`)) {
    return alert("Username already exists.");
  }

  localStorage.setItem(`user_${username}`, password);
  alert("Registration successful! Please log in.");
}

function loginUser() {
  const username = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value;
  const storedPassword = localStorage.getItem(`user_${username}`);

  if (!storedPassword || storedPassword !== password) {
    return alert("Invalid username or password.");
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "profile.html";
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// --- PROFILE ---
if (window.location.pathname.includes("profile.html")) {
  const name = localStorage.getItem("currentUser");
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
  const name = localStorage.getItem("currentUser");
  const winsKey = `wins_${name}`;
  const newWins = (parseInt(localStorage.getItem(winsKey)) || 0) + 1;
  localStorage.setItem(winsKey, newWins);
  loadStats(name);
}

function addLoss() {
  const name = localStorage.getItem("currentUser");
  const lossesKey = `losses_${name}`;
  const newLosses = (parseInt(localStorage.getItem(lossesKey)) || 0) + 1;
  localStorage.setItem(lossesKey, newLosses);
  loadStats(name);
}

// --- NOTES PAGE ---
if (window.location.pathname.includes("notes.html")) {
  const name = localStorage.getItem("currentUser");
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
  const name = localStorage.getItem("currentUser");
  if (!name) return;
  const notes = document.getElementById("notes").value;
  localStorage.setItem(`notes_${name}`, notes);
  alert("Notes saved securely to your browser.");
}

// --- LEADERBOARD PAGE ---
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

// --- FRIEND TRACKER PAGE ---
if (window.location.pathname.includes("tracker.html")) {
  const list = document.getElementById("friendItems");
  const name = localStorage.getItem("currentUser");
  const friendKey = `friends_${name}`;
  const friends = JSON.parse(localStorage.getItem(friendKey)) || [];

  function renderFriends() {
    list.innerHTML = "";
    friends.forEach(friend => {
      const wins = parseInt(localStorage.getItem(`wins_${friend}`)) || 0;
      const losses = parseInt(localStorage.getItem(`losses_${friend}`)) || 0;
      const total = wins + losses;
      const ratio = total > 0 ? Math.round((wins / total) * 100) : 0;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${friend}</strong> — Wins: ${wins}, Losses: ${losses}, Win Ratio: ${ratio}%
        <button onclick="removeFriend('${friend}')">Remove</button>
      `;
      list.appendChild(li);
    });
  }

  window.addFriend = function () {
    const input = document.getElementById("friendName");
    const friend = input.value.trim();
    if (friend && !friends.includes(friend)) {
      friends.push(friend);
      localStorage.setItem(friendKey, JSON.stringify(friends));
      input.value = "";
      renderFriends();
    }
  }

  window.removeFriend = function (friend) {
    const index = friends.indexOf(friend);
    if (index > -1) {
      friends.splice(index, 1);
      localStorage.setItem(friendKey, JSON.stringify(friends));
      renderFriends();
    }
  }

  renderFriends();
}

// --- TOURNAMENTS PAGE ---
if (window.location.pathname.includes("tournaments.html")) {
  const name = localStorage.getItem("currentUser");
  const list = document.getElementById("tournamentList");

  if (!name) {
    list.innerHTML = "<p>Please log in to your profile first.</p>";
  } else {
    const key = `tournaments_${name}`;
    let tournaments = JSON.parse(localStorage.getItem(key)) || [];

    function renderTournaments() {
      list.innerHTML = "";
      tournaments.forEach((t, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${t.name}</strong> — ${t.date} at ${t.location}
          <button onclick="removeTournament(${index})">Remove</button>
        `;
        list.appendChild(li);
      });
    }

    window.addTournament = function () {
      const nameInput = document.getElementById("tournamentName");
      const dateInput = document.getElementById("tournamentDate");
      const locationInput = document.getElementById("tournamentLocation");

      const tData = {
        name: nameInput.value.trim(),
        date: dateInput.value,
        location: locationInput.value.trim()
      };

      if (!tData.name || !tData.date || !tData.location) {
        return alert("Please fill in all fields.");
      }

      tournaments.push(tData);
      localStorage.setItem(key, JSON.stringify(tournaments));
      nameInput.value = "";
      dateInput.value = "";
      locationInput.value = "";
      renderTournaments();
    };

    window.removeTournament = function (index) {
      tournaments.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(tournaments));
      renderTournaments();
    };

    renderTournaments();
  }
}
