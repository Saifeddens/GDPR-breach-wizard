const startBtn = document.getElementById("startBtn");
const startSection = document.getElementById("startSection");
const questionSection = document.getElementById("questionSection");
const resultSection = document.getElementById("resultSection");

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");

const resultDecision = document.getElementById("resultDecision");
const resultExplanation = document.getElementById("resultExplanation");

const answerButtons = document.getElementById("answerButtons");
const dynamicOptions = document.getElementById("dynamicOptions");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const authorityBtn = document.getElementById("authorityBtn");
const userBtn = document.getElementById("userBtn");
const notificationTitle = document.getElementById("notificationTitle");

let step = 1;
let answers = {};

startBtn.addEventListener("click", () => {
  startSection.style.display = "none";
  questionSection.style.display = "block";

  updateProgress();
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
    updateProgress();
    questionTitle.innerText = "Step 2: Sensitive Data";
    questionText.innerText =
      "Does the breach involve sensitive data (health, biometric, financial, etc.)?";
  }

  else if (step === 2) {
    answers.sensitiveData = value;

    step = 3;
    updateProgress();
    questionTitle.innerText = "Step 3: Encryption";
    questionText.innerText =
      "Was the personal data encrypted or otherwise protected?";
  }

  else if (step === 3) {
  answers.encrypted = value;

  step = 4;
  updateProgress();

  questionTitle.innerText = "Step 4: Nature of Breach";

  questionText.innerText =
    "What type of personal data breach occurred?";

  answerButtons.style.display = "none";

  dynamicOptions.innerHTML = `
    <button class="primary-btn" onclick="selectBreachType('unauthorized')">
      Unauthorized Access
    </button>

    <button class="primary-btn" onclick="selectBreachType('disclosure')">
      Accidental Disclosure
    </button>

    <button class="primary-btn" onclick="selectBreachType('device')">
      Lost / Stolen Device
    </button>

    <button class="primary-btn" onclick="selectBreachType('ransomware')">
      Ransomware Attack
    </button>
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
  localStorage.setItem(
  "gdprAssessment",
    JSON.stringify({
        decision,
        explanation
    })
    );

  const notificationBox = document.getElementById("notificationBox");
  notificationBox.style.display = "none";

  // 🔥 CONTROL BUTTONS
  if (decision === "GDPR does NOT apply" || decision === "No Impact") {
    authorityBtn.style.display = "none";
    userBtn.style.display = "none";
  } else if (decision === "Moderate Risk Breach") {
    authorityBtn.style.display = "block";
    userBtn.style.display = "none";
  } else {
    authorityBtn.style.display = "block";
    userBtn.style.display = "block";
  }

  document.getElementById("reportBtn").style.display = "inline-block";
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

  authorityBtn.style.display = "block";
  userBtn.style.display = "block";

  answerButtons.innerHTML = `
  <button class="primary-btn" onclick="handleAnswer(true)">Yes</button>
  <button class="primary-btn" onclick="handleAnswer(false)">No</button>
`;
  progressFill.style.width = "0%";
  progressText.innerText = "Step 1 of 5";

  authorityBtn.style.display = "block";
  userBtn.style.display = "block";
}

function evaluateRisk() {
  let decision = "";
  let explanation = "";

  let reasons = [];

  // here we collect the information and reasons
  if (answers.sensitiveData) {
    reasons.push("sensitive data is involved");
  }

  if (!answers.encrypted) {
    reasons.push("data was not protected (no encryption)");
  }

  if (answers.scale === "multiple") {
    reasons.push("multiple individuals were affected");
  }

  if (answers.scale === "large") {
    reasons.push("a large number of individuals were affected");
  }

  if (answers.individualRisk) {
    reasons.push("there is a risk of harm to the individual");
  }

  // it gives high risk here
  if (
    answers.sensitiveData &&
    !answers.encrypted &&
    (answers.scale === "multiple" || answers.scale === "large" || answers.individualRisk)
  ) {
    decision = "High Risk Breach";
    explanation =
      "This is considered a high risk breach because " +
      reasons.join(", ") +
      ". Under GDPR Articles 33 and 34, both the supervisory authority and affected individuals must be notified.";
  }

  // it gives moderate risk here
  else if (
    answers.sensitiveData ||
    answers.scale === "multiple" ||
    answers.scale === "large"
  ) {
    decision = "Moderate Risk Breach";
    explanation =
      "This is considered a moderate risk breach because " +
      reasons.join(", ") +
      ". Notification to the supervisory authority is likely required under Article 33.";
  }

  // it gives low risk here
  else if (answers.encrypted && !answers.individualRisk) {
    decision = "Low Risk Breach";
    explanation =
      "This is considered a low risk breach because the data was protected and no significant risk factors were identified.";
  }

  // if none of the above 
  else {
    decision = "Unclear Risk";
    explanation =
      "The situation requires further legal assessment based on additional factors.";
  }

  showResult(decision, explanation);
}

function generateAuthorityNotification() {
  const notificationBox = document.getElementById("notificationBox");
  const notificationText = document.getElementById("notificationText");

    notificationTitle.innerText = "Notification to Supervisory Authority";

    notificationText.innerText = `
  This notification is submitted pursuant to Article 33 of the GDPR.

  A personal data breach has occurred involving ${
      answers.sensitiveData ? "sensitive personal data" : "personal data"
    }.

  The breach affects ${
      answers.scale === "large"
        ? "a large number of individuals"
        : answers.scale === "multiple"
        ? "multiple individuals"
        : "a single individual"
    }.

  The data protection measures were ${
      answers.encrypted ? "in place (encrypted)" : "not sufficient"
    }.

  We are taking appropriate measures to mitigate the impact and prevent recurrence.
    `;

  notificationBox.style.display = "block";
}

function generateUserNotification() {
  const notificationBox = document.getElementById("notificationBox");
  const notificationText = document.getElementById("notificationText");

  notificationTitle.innerText = "Notification to Affected Individual(s)";

  notificationText.innerText = `
We regret to inform you that a data breach has occurred involving your personal data.

The incident ${
    answers.sensitiveData
      ? "may pose a risk to your rights and freedoms"
      : "has been assessed as having limited risk"
  }.

  We recommend that you remain cautious and monitor any unusual activity.

  We sincerely apologize for this incident and are taking steps to ensure it does not happen again.
  `;

  notificationBox.style.display = "block";
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
    step = 6;
    updateProgress();
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

function selectBreachType(type) {
  answers.breachType = type;

  step = 5;
  updateProgress();

  questionTitle.innerText = "Step 5: Scale of Impact";
  questionText.innerText = "How many individuals were affected?";

  dynamicOptions.innerHTML = `
    <button class="primary-btn" onclick="selectScale('none')">
      No Individuals Affected
    </button>

    <button class="primary-btn" onclick="selectScale('single')">
      Single Individual
    </button>

    <button class="primary-btn" onclick="selectScale('multiple')">
      Multiple Individuals
    </button>

    <button class="primary-btn" onclick="selectScale('large')">
      Large-scale Breach
    </button>
  `;
}

function updateProgress() {
  const totalSteps = 6;

  progressText.innerText = `Step ${step} of ${totalSteps}`;

  const percent = (step / totalSteps) * 100;
  progressFill.style.width = percent + "%";
}

window.addEventListener("load", () => {
  const savedIncident = JSON.parse(localStorage.getItem("gdprIncident"));

  if (savedIncident) {
    document.getElementById("caseSummary").style.display = "block";

    document.getElementById("caseInfo").innerHTML = `
      <strong>Title:</strong> ${savedIncident.title}<br>
      <strong>Department:</strong> ${savedIncident.department}<br>
      <strong>Category:</strong> ${savedIncident.category}<br>
      <strong>Affected Individuals:</strong> ${savedIncident.count}<br>
      <strong>Urgency Level:</strong> ${savedIncident.urgency}
    `;
  }
});