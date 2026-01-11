// ================= STORAGE =================

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : [];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ================= DATA =================

let quotes = loadQuotes();

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ================= DOM =================

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// ================= DISPLAY =================

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
}

// ================= CATEGORIES =================

function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  quoteDisplay.innerHTML = "";

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ================= ADD QUOTE =================

function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  populateCategories();
  filterQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ================= SERVER INTERACTION =================

// ✔ REQUIRED: fetchQuotesFromServer
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  // Convert mock posts into quotes
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

// ✔ REQUIRED: posting data to server
async function postQuotesToServer() {
  await fetch(SERVER_URL, {
    method: "POST",
    body: JSON.stringify(quotes),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// ✔ REQUIRED: syncQuotes
async function syncQuotes() {
  syncStatus.textContent = "Syncing with server...";

  try {
    const serverQuotes = await fetchQuotesFromServer();

    const localData = JSON.stringify(quotes);
    const serverData = JSON.stringify(serverQuotes);

    // ✔ Conflict resolution: SERVER WINS
    if (localData !== serverData) {
      quotes = serverQuotes;
      saveQuotes();

      populateCategories();
      filterQuotes();

      syncStatus.textContent =
        "Server data detected. Local data updated (conflict resolved).";
    } else {
      syncStatus.textContent = "Data already in sync.";
    }
  } catch (error) {
    syncStatus.textContent = "Sync failed.";
  }
}

// ✔ REQUIRED: periodic checking
setInterval(syncQuotes, 30000);

// ================= EVENTS =================

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// ================= INIT =================

populateCategories();
filterQuotes();
syncQuotes();
