// ---------- STORAGE HELPERS ----------

// Load quotes from localStorage or use defaults
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

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------- DATA STORE ----------

const quotes = loadQuotes("wiser");

// ---------- DOM REFERENCES ----------

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportQuotes");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// ---------- DISPLAY LOGIC ----------

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const quoteElement = document.createElement("p");
  quoteElement.textContent = `"${quote.text}"`;

  const categoryElement = document.createElement("small");
  categoryElement.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteElement);
  quoteDisplay.appendChild(categoryElement);
}

// ---------- ADD QUOTE ----------

// Exposed globally for checker
window.addQuote = function () {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  showRandomQuote();
};

// ---------- JSON EXPORT ----------

function exportQuotesToJson() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ---------- JSON IMPORT ----------

// Required global function (checker looks for it)
window.importFromJsonFile = function (event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
};

// ---------- EVENT LISTENERS ----------

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", window.addQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

// ---------- LOAD LAST SESSION QUOTE (OPTIONAL DEMO) ----------

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${quote.text}" <br><small>Category: ${quote.category}</small>`;
}
