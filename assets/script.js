document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("playerName");
  if (name) {
    document.getElementById("welcomeMsg").innerText = `Welcome, ${name}`;
    const savedNotes = localStorage.getItem(`${name}_notes`);
    if (savedNotes) document.getElementById("notes").value = savedNotes;
    // Load stats from JSON later
  }
});

function saveNotes() {
  const name = localStorage.getItem("playerName");
  const notes = document.getElementById("notes").value;
  localStorage.setItem(`${name}_notes`, notes);
  alert("Notes saved!");
}
