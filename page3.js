// page3.js - complete
document.addEventListener("DOMContentLoaded", () => {
  // ---------- elements & state ----------
  const cards = Array.from(document.querySelectorAll(".card"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const openStoryBtn = document.getElementById("openStoryBtn");
  let current = 0; // index of active card

  // ---------- navigation / UI ----------
  function updateUI() {
    cards.forEach((c, i) => c.classList.toggle("active", i === current));

    // arrows behavior:
    // - on first card: hide both (user uses the button)
    // - from 2nd card onward: show prev and show/hide next depending on last card
    if (current === 0) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
    } else {
      if (prevBtn) prevBtn.style.display = "flex";
      if (nextBtn) nextBtn.style.display = (current === cards.length - 1) ? "none" : "flex";
    }

    // When Card 3 becomes active, trigger animated timers
    const activeCard = cards[current];
    if (activeCard && activeCard.id === "card-3") {
      animateAllTimers();
    }
  }

  // prev / next handlers
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (current > 0) {
        current--;
        updateUI();
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (current < cards.length - 1) {
        current++;
        updateUI();
      }
    });
  }

  // open story button -> go to card 2 (index 1)
  if (openStoryBtn) {
    openStoryBtn.addEventListener("click", () => {
      current = 1;
      updateUI();
    });
  }

  // initial UI
  updateUI();

  // ---------- IMAGE MODAL (Card 2 journey tabs) ----------
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const captionText = document.getElementById("caption");
  const closeBtn = document.querySelector(".modal .close");

  // Map each .journey-tab to an image path + caption
  // <-- replace these with your actual image file paths -->
  const tabImages = [
    { img: "journey1.jpg"},
    { img: "journey2.jpg"},
    { img: "journey3.jpg"},
    { img: "journey4.jpg"},
    { img: "journey5.jpg"},
    { img: "journey6.jpg"}
  ];

  // Attach click listeners to journey tabs
  document.querySelectorAll(".journey-tab").forEach((tab, i) => {
    tab.addEventListener("click", () => {
      if (!modal || !modalImg) return;
      modal.style.display = "flex";
      // guard: if mapping missing, show placeholder
      modalImg.src = (tabImages[i] && tabImages[i].img) ? tabImages[i].img : "";
      captionText.textContent = (tabImages[i] && tabImages[i].caption) ? tabImages[i].caption : "";
    });
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal) modal.style.display = "none";
  });

  // ---------- TIMER (Card 3) with cute boxes + animation ----------
  // keep track of any running intervals so we can clear before new animation
  const activeIntervals = {};

  // calculate years/months/days in a human calendar-aware way
  function calculateTimerValues(startDate) {
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
      // borrow days from previous month
      months--;
      const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += daysInPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
  }

  // safe interval helper
  function safeSetInterval(key, fn, ms) {
    if (activeIntervals[key]) {
      clearInterval(activeIntervals[key]);
      delete activeIntervals[key];
    }
    activeIntervals[key] = setInterval(fn, ms);
    return activeIntervals[key];
  }

  // animate a single numeric box to its final value
  function animateCounter(elementId, endValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    // clear any previous interval for this element
    if (activeIntervals[elementId]) {
      clearInterval(activeIntervals[elementId]);
      delete activeIntervals[elementId];
    }

    if (endValue === 0) {
      el.textContent = "0";
      return;
    }

    let current = 0;
    const steps = 30;
    const increment = Math.max(1, Math.ceil(endValue / steps));
    const delay = 20; // ms

    activeIntervals[elementId] = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        current = endValue;
        el.textContent = String(current);
        clearInterval(activeIntervals[elementId]);
        delete activeIntervals[elementId];
      } else {
        el.textContent = String(current);
      }
    }, delay);
  }

  // create the three cute boxes and start animations
  function animateTimer(startDate, containerId) {
    const { years, months, days } = calculateTimerValues(startDate);
    const container = document.getElementById(containerId);
    if (!container) return;

    // reset any intervals related to this container's children
    ["-years", "-months", "-days"].forEach(suffix => {
      const id = containerId + suffix;
      if (activeIntervals[id]) {
        clearInterval(activeIntervals[id]);
        delete activeIntervals[id];
      }
    });

    // render boxes
    container.innerHTML = `
      <div class="timer-box"><div class="timer-number" id="${containerId}-years">0</div><div class="timer-label">Years</div></div>
      <div class="timer-box"><div class="timer-number" id="${containerId}-months">0</div><div class="timer-label">Months</div></div>
      <div class="timer-box"><div class="timer-number" id="${containerId}-days">0</div><div class="timer-label">Days</div></div>
    `;

    // animate each
    animateCounter(`${containerId}-years`, years);
    animateCounter(`${containerId}-months`, months);
    animateCounter(`${containerId}-days`, days);
  }

  // wrapper to animate all three timers (recalculates on each call)
  function animateAllTimers() {
    // dates (months are 0-indexed for Date(year, monthIndex, day))
    const friendsDate = new Date(2018, 8, 22);     // 22 Sep 2018
    const unofficialDate = new Date(2023, 9, 11);   // 11 Sep 2023
    const officialDate = new Date(2024, 8, 1);     // 1 Sep 2024

    animateTimer(friendsDate, "timer-friends");
    animateTimer(unofficialDate, "timer-unofficial");
    animateTimer(officialDate, "timer-official");
  }

  // optional: refresh timers every 30s while card-3 is active so days update if left open
  let refreshIntervalId = null;
  function startAutoRefreshWhileCard3Active() {
    if (refreshIntervalId) return;
    refreshIntervalId = setInterval(() => {
      // only refresh if card-3 is active
      if (cards[current] && cards[current].id === "card-3") {
        animateAllTimers();
      }
    }, 30000);
  }
  function stopAutoRefresh() {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
  }

  // start auto-refresh (keeps the timers reasonably live if user stays on the card)
  startAutoRefreshWhileCard3Active();

  // ------------------- Card 4 Typewriter Effect -------------------

// Your special message (edit this text as you like 💖)
const messageText = `I can’t put into words how thankful I am for you, for walking into my life and filling it with so much light. Thank you for being the reason behind my smiles, for understanding me like no one else can, and for standing by my side no matter what life throws our way. I’ll always be grateful for the day I found you, and even more grateful that you stayed.
- I love you because you actually put effort into me.
- I love you because nobody has ever given me the love that you have given me.
- I love you because you always make me feel like I am worth something.
- I love you because you have a huge and honest heart.
- I love you, and every little detail about you. ❤️`;

const messageEl = document.getElementById("special-message");
let charIndex = 0;
let typingActive = false;

function typeWriter() {
  if (charIndex < messageText.length) {
    messageEl.textContent += messageText.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, 50); // speed of typing (ms)
  }
}

// Trigger typing when Card 4 becomes visible
const card4 = document.getElementById("card-4");
const observer4 = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !typingActive) {
      typingActive = true;
      typeWriter();
    }
  });
}, { threshold: 0.6 });

observer4.observe(card4);

});
