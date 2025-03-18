////////// DOM elements
const newQuoteButton = document.getElementById('new-quote-btn');
const quoteContent = document.getElementById('quote-content');
const actionIconsContainer = document.querySelector('.action-icons');
const copyButton = document.getElementById('copy-btn');
const tweetButton = document.getElementById('tweet-btn');
const themeToggleButton = document.getElementById('theme-toggle-btn');

// API URL
const apiUrl = 'https://api.freeapi.app/api/v1/public/quotes/quote/random';

////////// Functions

// Function to fetch a random quote from the API
async function fetchRandomQuote() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

// Function to display the quote on the page
async function displayQuote() {
  try {
    const quote = await fetchRandomQuote();
    if (!quote) {
      quoteContent.innerHTML = `<p id="quote-text">Failed to load quote. Please try again!</p>`;
    } else {
      quoteContent.innerHTML = `
        <p id="quote-text"><span>“</span>${quote.content}<span>”</span></p>
        <p id="quote-author">- ${quote.author || 'Anonymous'}</p>`;
      actionIconsContainer.style.display = 'flex';
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to copy text to clipboard
function copyQuoteToClipboard() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');

  if (!quoteText || !quoteAuthor) {
    console.error('Quote or author not found!');
    return;
  }

  const textToCopy = `${quoteText.textContent} - ${quoteAuthor.textContent}`;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => alert('Quote copied to clipboard!'))
    .catch(() => alert('Failed to copy quote.'));
}

// Function to share quote on Twitter
function shareOnTwitter() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');

  if (!quoteText || !quoteAuthor) {
    console.error('Quote or author not found!');
    return;
  }

  const tweetText = `${quoteText.textContent} - ${quoteAuthor.textContent} ✨\n\n#Inspiration #Motivation #Quotes`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;
  window.open(twitterUrl, '_blank');
}

// Change theme between dark and light mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  themeToggleButton.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

////////// Event listuners
newQuoteButton.addEventListener('click', displayQuote);
copyButton.addEventListener('click', copyQuoteToClipboard);
tweetButton.addEventListener('click', shareOnTwitter);
themeToggleButton.addEventListener('click', toggleDarkMode);

// Check for browser theme preference
const isBrowserDarkMode =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isBrowserDarkMode) {
  document.body.classList.add('dark-mode');
}
themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
