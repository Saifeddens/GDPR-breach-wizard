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