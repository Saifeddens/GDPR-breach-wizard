const startBtn = document.getElementById("startBtn");
const startSection = document.getElementById("startSection");
const questionSection = document.getElementById("questionSection");
const resultSection = document.getElementById("resultSection");

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");

const resultDecision = document.getElementById("resultDecision");
const resultExplanation = document.getElementById("resultExplanation");

const answerButtons = document.getElementById("answerButtons");

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
  }

  else if (step === 2) {
    answers.sensitiveData = value;

    step = 3;
    questionTitle.innerText = "Step 3: Encryption";
    questionText.innerText =
      "Was the personal data encrypted or otherwise protected?";
  }

  else if (step === 3) {
    answers.encrypted = value;

    step = 4;
    questionTitle.innerText = "Step 4: Scale of Impact";
    questionText.innerText = "How many individuals were affected?";

    answerButtons.innerHTML = `
      <button onclick="selectScale('none')">No Individuals Affected</button>
      <button onclick="selectScale('single')">Single Individual</button>
      <button onclick="selectScale('multiple')">Multiple Individuals</button>
      <button onclick="selectScale('large')">Large-scale Breach</button>
    `;
  }

  

  else if (step === 5) {
    answers.individualRisk = value;
    evaluateRisk();
  }
}

function showResult(decision, explanation) {
  questionSection.style.display = "none";
  resultSection.style.display = "block";

  resultDecision.innerText = decision;
  resultExplanation.innerText = explanation;

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

  const generateBtn = document.getElementById("generateBtn");
  generateBtn.style.display = "block";

  answerButtons.innerHTML = `
  <button onclick="handleAnswer(true)">Yes</button>
  <button onclick="handleAnswer(false)">No</button>
`;
}

function evaluateRisk() {
  let decision = "";
  let explanation = "";

  if (
    answers.sensitiveData &&
    !answers.encrypted &&
    (answers.scale === "multiple" || answers.scale === "large" || answers.individualRisk)
  ) {
    decision = "High Risk Breach";
    explanation =
      "Sensitive data combined with lack of protection and risk to individuals creates a high risk scenario. Under GDPR Articles 33 and 34, both the supervisory authority and affected individuals must be notified.";
  }

  else if (answers.sensitiveData || answers.scale === "multiple" || answers.scale === "large") {
    decision = "Moderate Risk Breach";
    explanation =
      "Some risk factors are present such as sensitive data or multiple individuals affected. Notification to the supervisory authority is likely required under Article 33.";
  }

  else if (answers.encrypted && answers.individualRisk !== true) {
    decision = "Low Risk Breach";
    explanation =
      "The data was protected and risk to individuals is low. Notification may not be required.";
  }

  else {
    decision = "Unclear Risk";
    explanation =
      "The situation requires further legal assessment based on additional factors.";
  }

  showResult(decision, explanation);
}

function generateNotification() {
  const notificationBox = document.getElementById("notificationBox");
  const notificationText = document.getElementById("notificationText");
  const generateBtn = document.getElementById("generateBtn");

  let text = "";

  if (answers.sensitiveData) {
    text = `We regret to inform you that a data breach involving sensitive personal data has occurred...`;
  } else {
    text = `We would like to inform you of a data breach involving personal data...`;
  }

  notificationText.innerText = text;
  notificationBox.style.display = "block";

  generateBtn.style.display = "none";
}

function selectScale(type) {
  answers.scale = type;

  if (type === "none") {
    showResult(
      "No Impact",
      "No individuals were affected, so notification is not required."
    );
    return;
  }

  if (type === "single") {
    step = 5;
    questionTitle.innerText = "Step 5: Risk to Individual";
    questionText.innerText =
      "Is there a likely risk of harm to this individual?";

    answerButtons.innerHTML = `
      <button onclick="handleAnswer(true)">Yes</button>
      <button onclick="handleAnswer(false)">No</button>
    `;
  } else {
    evaluateRisk();
  }
}