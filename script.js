// Wait for 3 seconds (loading duration)
setTimeout(() => {
  // Add fade-out effect
  document.body.classList.add("fade-out");

  // Wait for the fade-out transition (1s), then redirect
  setTimeout(() => {
    window.location.href = "page2.html"; // change this to your actual page
  }, 1000);
}, 6000);
