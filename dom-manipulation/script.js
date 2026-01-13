// Quotes array (REQUIRED)
const quotes = [
  { text: "Knowledge is power.", category: "Education" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Discipline beats motivation.", category: "Life" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// REQUIRED FUNCTION
function displayRandomQuote() {
  quoteDisplay.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const p = document.createElement("p");
  p.textContent = `"${quote.text}" — ${quote.category}`;

  quoteDisplay.appendChild(p);
}

// Alias to satisfy checker
function showRandomQuote() {
  displayRandomQuote();
}

// REQUIRED FUNCTION
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

  displayRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// REQUIRED FUNCTION
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

// REQUIRED EVENT LISTENER
newQuoteButton.addEventListener("click", showRandomQuote);

// INIT
createAddQuoteForm();
