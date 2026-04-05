const startBtn = document.getElementById("startBtn");
const startSection = document.getElementById("startSection");
const questionSection = document.getElementById("questionSection");

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");

let step = 1;
let answers = {};

startBtn.addEventListener("click", () => {
  startSection.style.display = "none";
  questionSection.style.display = "block";
});

function handleAnswer(value) {
  if (step === 1) {
    answers.personalData = value;

    if (!value) {
      alert("No personal data → GDPR does not apply.");
      return;
    }

    // move to step 2
    step = 2;
    questionTitle.innerText = "Step 2: Sensitive Data";
    questionText.innerText =
      "Does the breach involve sensitive data (health, biometric, financial, etc.)?";
  } else if (step === 2) {
    answers.sensitiveData = value;

    // simple decision
    if (answers.sensitiveData) {
      alert(
        "High risk → You likely must notify BOTH the authority and affected individuals (GDPR Art. 33 & 34)."
      );
    } else {
      alert(
        "Lower risk → You may need to notify the authority, but not necessarily the individuals."
      );
    }
  }
}