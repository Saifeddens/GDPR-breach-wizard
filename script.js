const startBtn = document.getElementById("startBtn");
const startSection = document.getElementById("startSection");
const questionSection = document.getElementById("questionSection");
const resultSection = document.getElementById("resultSection");

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");

const resultDecision = document.getElementById("resultDecision");
const resultExplanation = document.getElementById("resultExplanation");

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
      showResult(
        "GDPR does NOT apply",
        "No personal data was involved, so GDPR notification rules are not triggered."
      );
      return;
    }

    step = 2;
    questionTitle.innerText = "Step 2: Sensitive Data";
    questionText.innerText =
      "Does the breach involve sensitive data (health, biometric, financial, etc.)?";
  } else if (step === 2) {
    answers.sensitiveData = value;

    if (answers.sensitiveData) {
      showResult(
        "High Risk Breach",
        "Sensitive personal data is involved. Under GDPR Articles 33 and 34, you must notify both the supervisory authority and the affected individuals."
      );
    } else {
      showResult(
        "Moderate Risk Breach",
        "Personal data is involved but not sensitive. You likely need to notify the supervisory authority (Article 33), but notifying individuals may not be required."
      );
    }
  }
}

function showResult(decision, explanation) {
  questionSection.style.display = "none";
  resultSection.style.display = "block";

  resultDecision.innerText = decision;
  resultExplanation.innerText = explanation;

  // 🔥 FIX: hide notification box initially
  const notificationBox = document.getElementById("notificationBox");
  notificationBox.style.display = "none";
}

function restart() {
  step = 1;
  answers = {};

  resultSection.style.display = "none";
  startSection.style.display = "block";

  questionTitle.innerText = "Step 1: Personal Data";
  questionText.innerText = "Was personal data involved in the breach?";

  const notificationBox = document.getElementById("notificationBox");
  notificationBox.style.display = "none";

  // 🔥 bring button back
  const generateBtn = document.getElementById("generateBtn");
  generateBtn.style.display = "block";
}

function generateNotification() {
  const notificationBox = document.getElementById("notificationBox");
  const notificationText = document.getElementById("notificationText");
  const generateBtn = document.getElementById("generateBtn");

  let text = "";

  if (answers.sensitiveData) {
    text = `
We regret to inform you that a data breach involving sensitive personal data has occurred.

The incident may pose a high risk to your rights and freedoms. In accordance with GDPR Articles 33 and 34, we have notified the relevant supervisory authority.

We recommend that you take appropriate precautions.

We sincerely apologize for this incident.
    `;
  } else {
    text = `
We would like to inform you of a data breach involving personal data.

The breach has been assessed and reported to the supervisory authority in accordance with GDPR Article 33.

At this time, the risk to individuals is considered limited.

We remain committed to protecting your data.
    `;
  }

  notificationText.innerText = text;
  notificationBox.style.display = "block";

  // 🔥 NEW: hide the button after clicking
  generateBtn.style.display = "none";
}