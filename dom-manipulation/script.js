// Quote data
const quotes = [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Discipline beats motivation.", category: "Life" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// REQUIRED: displayRandomQuote
function displayRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const p = document.createElement("p");
  p.textContent = `"${quote.text}" — ${quote.category}`;

  quoteDisplay.appendChild(p);
}

// REQUIRED: createAddQuoteForm
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

// REQUIRED: addQuote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required");
    return;
  }

  quotes.push({ text, category });

  displayRandomQuote();
}

// REQUIRED: event listener
newQuoteBtn.addEventListener("click", displayRandomQuote);

// Initialize
createAddQuoteForm();
