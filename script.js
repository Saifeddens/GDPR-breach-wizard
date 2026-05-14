function saveIncident() {
  const incident = {
    title: document.getElementById("incidentTitle").value,
    date: document.getElementById("incidentDate").value,
    department: document.getElementById("incidentDepartment").value,
    category: document.getElementById("incidentCategory").value,
    count: document.getElementById("incidentCount").value,
    urgency: document.getElementById("incidentUrgency").value,
    description: document.getElementById("incidentDescription").value,
  };

  localStorage.setItem("gdprIncident", JSON.stringify(incident));
  window.location.href = "assessment.html";
}

window.addEventListener("load", () => {
  const riskList = document.getElementById("riskList");
  const mitigationList = document.getElementById("mitigationList");

  const risks = JSON.parse(localStorage.getItem("gdprRisks")) || [];
  const mitigations = JSON.parse(localStorage.getItem("gdprMitigations")) || [];
  const incident = JSON.parse(localStorage.getItem("gdprIncident"));
  const assessment = JSON.parse(localStorage.getItem("gdprAssessment"));

  const incidentBox = document.getElementById("incidentReport");
  const assessmentBox = document.getElementById("assessmentReport");
  const actionList = document.getElementById("actionList");

  const severityData = JSON.parse(localStorage.getItem("gdprSeverity"));

  const reportSeverityScore = document.getElementById("reportSeverityScore");
  const reportSeverityLevel = document.getElementById("reportSeverityLevel");

  const reportRiskList = document.getElementById("reportRiskList");
  const reportMitigationList = document.getElementById("reportMitigationList");

  const savedRisks = JSON.parse(localStorage.getItem("gdprRisks")) || [];
  const savedMitigations = JSON.parse(localStorage.getItem("gdprMitigations")) || [];


  const severityScore = localStorage.getItem("gdprSeverity");
  const severityScoreBox = document.getElementById("severityScore");
  const severityBadge = document.getElementById("severityBadge");

  const obligationList = document.getElementById("obligationList");

  if (!incidentBox || !incident || !assessment) return;

  if (severityScoreBox && severityBadge) {
    severityScoreBox.innerText = `${severityScore || 0}/100`;

    if (severityScore >= 70) {
      severityBadge.innerText = "High Severity";
      severityBadge.className = "badge high";
    } else if (severityScore >= 35) {
      severityBadge.innerText = "Moderate Severity";
      severityBadge.className = "badge moderate";
    } else {
      severityBadge.innerText = "Low Severity";
      severityBadge.className = "badge low";
    }
  }

  incidentBox.innerHTML = `
    <h2>Incident Summary</h2>
    <p><strong>Title:</strong> ${incident.title}</p>
    <p><strong>Date:</strong> ${incident.date}</p>
    <p><strong>Department:</strong> ${incident.department}</p>
    <p><strong>Category:</strong> ${incident.category}</p>
    <p><strong>Affected:</strong> ${incident.count}</p>
    <p><strong>Urgency:</strong> ${incident.urgency}</p>
    <p><strong>Description:</strong> ${incident.description}</p>
  `;

  assessmentBox.innerHTML = `
    <h2>Legal Assessment</h2>
    <p><strong>Decision:</strong> ${assessment.decision}</p>
    <p>${assessment.explanation}</p>
  `;

  if (severityData) {
    reportSeverityScore.innerText = severityData.score + "/100";
    reportSeverityLevel.innerText = severityData.level;
  }

  reportRiskList.innerHTML = savedRisks
    .map(risk => `<li>${risk}</li>`)
    .join("");

  reportMitigationList.innerHTML = savedMitigations
    .map(item => `<li>${item}</li>`)
    .join("");


  let actions = "";

  if (assessment.decision === "High Risk Breach") {
    actions += "<li>Notify supervisory authority within 72 hours</li>";
    actions += "<li>Notify affected individuals</li>";
    actions += "<li>Document mitigation actions</li>";
  } else if (assessment.decision === "Moderate Risk Breach") {
    actions += "<li>Notify supervisory authority</li>";
    actions += "<li>Conduct further internal review</li>";
  } else {
    actions += "<li>Document incident internally</li>";
    actions += "<li>Monitor situation</li>";
  }

  let obligations = "";

  if (assessment.decision === "High Risk Breach") {
    obligations += "<li>Supervisory authority notification: Required</li>";
    obligations += "<li>Affected individuals notification: Required</li>";
  } else if (assessment.decision === "Moderate Risk Breach") {
    obligations += "<li>Supervisory authority notification: Likely required</li>";
    obligations += "<li>Affected individuals notification: Not automatically required</li>";
  } else {
    obligations += "<li>Supervisory authority notification: Not required</li>";
    obligations += "<li>Affected individuals notification: Not required</li>";
  }

  obligationList.innerHTML = obligations;

  actionList.innerHTML = actions;
  riskList.innerHTML = risks.length
    ? risks.map(risk => `<li>${risk}</li>`).join("")
    : "<li>No specific risks identified.</li>";

  mitigationList.innerHTML = mitigations.length
    ? mitigations.map(item => `<li>${item}</li>`).join("")
    : "<li>No additional mitigation measures suggested.</li>";
});

window.addEventListener("load", () => {
  const history = JSON.parse(localStorage.getItem("gdprAssessmentHistory")) || [];

  const totalAssessments = document.getElementById("totalAssessments");
  const highRiskCases = document.getElementById("highRiskCases");
  const notificationsGenerated = document.getElementById("notificationsGenerated");
  const notificationRequired = document.getElementById("notificationRequired");

  if (!totalAssessments) return;

  const total = history.length;
  const highRisk = history.filter(item => item.decision === "High Risk Breach").length;

  const notifications = history.filter(item =>
    item.decision === "High Risk Breach" ||
    item.decision === "Moderate Risk Breach"
  ).length;

  totalAssessments.innerText = total;
  highRiskCases.innerText = highRisk;
  notificationsGenerated.innerText = notifications;
  notificationRequired.innerText = notifications;
});