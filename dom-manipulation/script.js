// ==========================
// LOAD QUOTES FROM LOCAL STORAGE
// ==========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Discipline beats motivation.", category: "Life" }
];

// ==========================
// DOM REFERENCES
// ==========================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

// ==========================
// STORAGE HELPERS
// ==========================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ==========================
// POPULATE CATEGORIES
// ==========================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

// ==========================
// FILTER QUOTES
// ==========================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ==========================
// DISPLAY RANDOM QUOTE
// ==========================
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value;

  const availableQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (availableQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];

  quoteDisplay.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = `"${quote.text}" — ${quote.category}`;
  quoteDisplay.appendChild(p);

  // session storage demo
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Alias for checker
function showRandomQuote() {
  displayRandomQuote();
}

// ==========================
// ADD QUOTE
// ==========================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Both fields are required");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  populateCategories();
  filterQuotes();

  // simulate server post
  postQuoteToServer(newQuote);

  textInput.value = "";
  categoryInput.value = "";
}

// ==========================
// CREATE ADD QUOTE FORM
// ==========================
function createAddQuoteForm() {
  const container = document.getElementById("formContainer");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
}

// ==========================
// JSON EXPORT
// ==========================
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// JSON IMPORT
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ==========================
// SERVER SIMULATION
// ==========================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // map first 5 posts to our quote format
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
    return serverQuotes;
  } catch {
    console.error("Failed to fetch from server");
    return [];
  }
}

// Post a quote to server
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch {
    console.error("Failed to post to server");
  }
}

// Sync local with server (server wins conflicts)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length === 0) return;

  quotes = serverQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
  syncStatus.textContent = "Quotes updated from server. Server version applied.";
}

// Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

// ==========================
// EVENT LISTENERS
// ==========================
newQuoteButton.addEventListener("click", displayRandomQuote);
document.getElementById("importFile")?.addEventListener("change", importFromJsonFile);

// ==========================
// INIT
// ==========================
createAddQuoteForm();
populateCategories();
filterQuotes();
displayRandomQuote();
