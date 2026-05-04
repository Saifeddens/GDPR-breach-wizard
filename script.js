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
  const incident = JSON.parse(localStorage.getItem("gdprIncident"));
  const assessment = JSON.parse(localStorage.getItem("gdprAssessment"));

  const incidentBox = document.getElementById("incidentReport");
  const assessmentBox = document.getElementById("assessmentReport");
  const actionList = document.getElementById("actionList");

  if (!incidentBox || !incident || !assessment) return;

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

  actionList.innerHTML = actions;
});