// ---------------- STORAGE ----------------

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : [];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------------- DATA ----------------

let quotes = loadQuotes();

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ---------------- DOM ----------------

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// ---------------- DISPLAY ----------------

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
}

// ---------------- CATEGORIES ----------------

function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) categoryFilter.value = saved;
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  quoteDisplay.innerHTML = "";

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ---------------- ADD QUOTE ----------------

window.addQuote = function () {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) return alert("Both fields required");

  quotes.push({ text, category });
  saveQuotes();

  populateCategories();
  filterQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";
};

// ---------------- JSON IMPORT / EXPORT ----------------

window.importFromJsonFile = function (event) {
  const reader = new FileReader();

  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported");
  };

  reader.readAsText(event.target.files[0]);
};

function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------- SERVER SYNC ----------------

async function syncWithServer() {
  syncStatus.textContent = "Syncing with server...";

  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate quotes from server posts
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const localHash = JSON.stringify(quotes);
    const serverHash = JSON.stringify(serverQuotes);

    if (localHash !== serverHash) {
      quotes = serverQuotes; // SERVER WINS
      saveQuotes();

      populateCategories();
      filterQuotes();

      syncStatus.textContent =
        "Data updated from server (conflict resolved).";
    } else {
      syncStatus.textContent = "Already in sync.";
    }
  } catch (err) {
    syncStatus.textContent = "Sync failed.";
  }
}

// ---------------- AUTO SYNC ----------------

setInterval(syncWithServer, 30000); // every 30 seconds

// ---------------- EVENTS ----------------

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", window.addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// ---------------- INIT ----------------

populateCategories();
filterQuotes();

const last = sessionStorage.getItem("lastQuote");
if (last) {
  const q = JSON.parse(last);
  quoteDisplay.innerHTML = `"${q.text}" <br><small>${q.category}</small>`;
}

