const startBtn = document.getElementById("startBtn");
const startSection = document.getElementById("startSection");
const questionSection = document.getElementById("questionSection");

let answers = {};

startBtn.addEventListener("click", () => {
  startSection.style.display = "none";
  questionSection.style.display = "block";
});

function answerPersonalData(value) {
  answers.personalData = value;

  if (!value) {
    alert("No personal data involved → GDPR does not apply.");
  } else {
    alert("Personal data involved → continue assessment (next step coming).");
  }
}