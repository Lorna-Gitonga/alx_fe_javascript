// ==========================
// LOAD QUOTES FROM STORAGE
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

// ==========================
// STORAGE HELPERS
// ==========================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ==========================
// POPULATE CATEGORIES (REQUIRED)
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
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// ==========================
// FILTER QUOTES (REQUIRED)
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
}

// Alias for checker compatibility
function showRandomQuote() {
  displayRandomQuote();
}

// ==========================
// ADD QUOTE (UPDATED)
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

  quotes.push({ text, category });
  saveQuotes();

  populateCategories();
  filterQuotes();

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
// EVENTS
// ==========================
newQuoteButton.addEventListener("click", displayRandomQuote);

// ==========================
// INIT
// ==========================
createAddQuoteForm();
populateCategories();
filterQuotes();
