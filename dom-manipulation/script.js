// Quote data store
const quotes = [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Discipline beats motivation.", category: "Life" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// Display a random quote
function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteElement = document.createElement("p");
  quoteElement.textContent = `"${quote.text}"`;

  const categoryElement = document.createElement("small");
  categoryElement.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteElement);
  quoteDisplay.appendChild(categoryElement);
}

// Add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  showRandomQuote();
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
