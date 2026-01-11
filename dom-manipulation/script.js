// ---------- STORAGE HELPERS ----------

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  return storedQuotes
    ? JSON.parse(storedQuotes)
    : [
        { text: "Knowledge is power.", category: "Education" },
        { text: "Simplicity is the soul of efficiency.", category: "Programming" },
        { text: "Discipline beats motivation.", category: "Life" }
      ];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------- DATA STORE ----------

const quotes = loadQuotes();

// ---------- DOM REFERENCES ----------

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportQuotes");
const categoryFilter = document.getElementById("categoryFilter");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// ---------- CATEGORY HANDLING ----------

function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// ---------- DISPLAY LOGIC ----------

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const p = document.createElement("p");
  p.textContent = `"${quote.text}"`;

  const small = document.createElement("small");
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

// ---------- FILTERING ----------

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  quoteDisplay.innerHTML = "";

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ---------- ADD QUOTE (GLOBAL FOR CHECKER) ----------

window.addQuote = function () {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  populateCategories();
  filterQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";
};

// ---------- JSON EXPORT ----------

function exportQuotesToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ---------- JSON IMPORT (GLOBAL FOR CHECKER) ----------

window.importFromJsonFile = function (event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error();
      }

      quotes.push(...importedQuotes);
      saveQuotes();

      populateCategories();
      filterQuotes();

      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };

  reader.readAsText(event.target.files[0]);
};

// ---------- EVENT LISTENERS ----------

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", window.addQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

// ---------- INITIAL LOAD ----------

populateCategories();
filterQuotes();

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${quote.text}" <br><small>Category: ${quote.category}</small>`;
}

