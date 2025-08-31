window.onload = () => {
  // Confetti setup
  const canvas = document.getElementById('confetti-canvas');
  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

  function confettiRain() {
    myConfetti({
      particleCount: 3,
      startVelocity: 20,
      spread: 80,
      origin: { x: Math.random(), y: 0 },
      gravity: 0.6
    });
  }
  setInterval(confettiRain, 100);

  // Show Question
  document.getElementById("showQuestionBtn").addEventListener("click", () => {
    document.getElementById("introBox").style.display = "none";
    document.getElementById("questionCard").style.display = "block";
  });

  // Yes button response
  document.querySelector(".yes-btn").addEventListener("click", () => {
    document.getElementById("questionCard").style.display = "none";
    document.getElementById("yesCard").style.display = "block";

    // Burst of confetti
    myConfetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  });

  // No button response
  document.querySelector(".no-btn").addEventListener("click", () => {
    document.getElementById("questionCard").style.display = "none";
    document.getElementById("noCard").style.display = "block";
  });

  // Go Back button
  document.getElementById("goBackBtn").addEventListener("click", () => {
    document.getElementById("noCard").style.display = "none";
    document.getElementById("questionCard").style.display = "block";
  });

  // More Love button
  document.getElementById("moreLoveBtn").addEventListener("click", () => {
    document.getElementById("yesCard").style.display = "none";
    document.getElementById("secretCard").style.display = "block";
  });

  // Unlock button
  document.getElementById("unlockBtn").addEventListener("click", () => {
    const code = document.getElementById("secretCode").value.trim();

    // Change "mysecret" to whatever code you want 💡
    if (code === "mysecret") {
      window.location.href = "page3.html"; 
    } else {
      alert("❌ Please insert your code correctly!");
    }
  });
};
