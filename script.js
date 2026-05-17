function saveIncident() {
  const title = document.getElementById("incidentTitle").value.trim();
  const date = document.getElementById("incidentDate").value;
  const department = document.getElementById("incidentDepartment").value;
  const category = document.getElementById("incidentCategory").value;
  const count = document.getElementById("incidentCount").value;
  const urgency = document.getElementById("incidentUrgency").value;
  const description = document.getElementById("incidentDescription").value.trim();

  if (title.length < 5) {
    alert("Please enter a clearer incident title.");
    return;
  }

  if (!date) {
    alert("Please select the date the incident was discovered.");
    return;
  }

  if (!count || Number(count) < 1) {
    alert("Please enter a valid number of affected individuals.");
    return;
  }

  if (description.length < 15) {
    alert("Please provide a more detailed incident description.");
    return;
  }

  const caseId =
    "CASE-" + Math.floor(1000 + Math.random() * 9000);

  const incident = {
    caseId: caseId,
    title: title,
    date: date,
    department: department,
    category: category,
    count: count,
    urgency: urgency,
    description: description
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


  const aiSummaryText = document.getElementById("aiSummaryText");
  const aiSummary = localStorage.getItem("gdprAiSummary");


  const assessmentTimestamp =
  localStorage.getItem("gdprLastAssessmentDate");

  const assessmentTimestampText =
    document.getElementById("assessmentTimestamp");


  const severityData = JSON.parse(localStorage.getItem("gdprSeverity"));

  const reportSeverityScore = document.getElementById("reportSeverityScore");
  const reportSeverityLevel = document.getElementById("reportSeverityLevel");

  const reportRiskList = document.getElementById("reportRiskList");
  const reportMitigationList = document.getElementById("reportMitigationList");

  const savedRisks = JSON.parse(localStorage.getItem("gdprRisks")) || [];
  const savedMitigations = JSON.parse(localStorage.getItem("gdprMitigations")) || [];

  

  const obligationList = document.getElementById("obligationList");

  if (!incidentBox || !incident || !assessment) return;

  incidentBox.innerHTML = `
    <p><strong>Case ID:</strong> ${incident.caseId}</p>
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

    reportSeverityLevel.className = "severity-badge";

    if (severityData.level === "Low") {
      reportSeverityLevel.classList.add("severity-low");
    }
    else if (severityData.level === "Moderate") {
      reportSeverityLevel.classList.add("severity-moderate");
    }
    else if (severityData.level === "High") {
      reportSeverityLevel.classList.add("severity-high");
    }
    else if (severityData.level === "Critical") {
      reportSeverityLevel.classList.add("severity-critical");
    }
  }

  reportRiskList.innerHTML = savedRisks
    .map(risk => `<li>${risk}</li>`)
    .join("");

  reportMitigationList.innerHTML = savedMitigations
    .map(item => `<li>${item}</li>`)
    .join("");

  if (aiSummaryText && aiSummary) {
    aiSummaryText.innerText = aiSummary;
  }

  if (assessmentTimestampText && assessmentTimestamp) {
    assessmentTimestampText.innerText = assessmentTimestamp;
  }



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

});

window.addEventListener("load", () => {
  const history = JSON.parse(localStorage.getItem("gdprAssessmentHistory")) || [];

  const totalAssessments = document.getElementById("totalAssessments");
  const highRiskCases = document.getElementById("highRiskCases");
  const notificationsGenerated = document.getElementById("notificationsGenerated");
  const notificationRequired = document.getElementById("notificationRequired");
  const historyTableBody = document.getElementById("historyTableBody");

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
  if (historyTableBody) {
    if (history.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="3">No assessments completed yet.</td>
        </tr>
      `;
    } else {
      historyTableBody.innerHTML = history
        .slice()
        .reverse()
        .map(item => `
          <tr>
            <td>${item.caseId}</td>
            <td>${item.date}</td>
            <td>${item.decision}</td>
            <td>${item.explanation.substring(0, 90)}...</td>
          </tr>
        `)
        .join("");
    }
  }
});

function downloadReportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const incident = JSON.parse(localStorage.getItem("gdprIncident"));
  const assessment = JSON.parse(localStorage.getItem("gdprAssessment"));
  const severity = JSON.parse(localStorage.getItem("gdprSeverity"));
  const risks = JSON.parse(localStorage.getItem("gdprRisks")) || [];
  const mitigations = JSON.parse(localStorage.getItem("gdprMitigations")) || [];
  const aiSummary = localStorage.getItem("gdprAiSummary");
  const timestamp = localStorage.getItem("gdprLastAssessmentDate");

  let y = 15;

  doc.setFontSize(16);
  doc.text("GDPR Compliance Report", 15, y);
  y += 12;

  doc.setFontSize(11);
  doc.text(`Generated: ${timestamp || "N/A"}`, 15, y);
  y += 10;

  doc.text("Incident Summary", 15, y);
  y += 8;

  doc.text(`Title: ${incident?.title || "N/A"}`, 15, y); y += 7;
  doc.text(`Date: ${incident?.date || "N/A"}`, 15, y); y += 7;
  doc.text(`Department: ${incident?.department || "N/A"}`, 15, y); y += 7;
  doc.text(`Category: ${incident?.category || "N/A"}`, 15, y); y += 7;
  doc.text(`Affected: ${incident?.count || "N/A"}`, 15, y); y += 10;

  doc.text("Legal Assessment", 15, y);
  y += 8;
  doc.text(`Decision: ${assessment?.decision || "N/A"}`, 15, y); y += 7;

  const explanationLines = doc.splitTextToSize(assessment?.explanation || "N/A", 180);
  doc.text(explanationLines, 15, y);
  y += explanationLines.length * 7 + 5;

  doc.text(`Severity: ${severity?.score || 0}/100 (${severity?.level || "N/A"})`, 15, y);
  y += 10;

  doc.text("Identified Risks:", 15, y);
  y += 8;
  risks.forEach(risk => {
    doc.text(`- ${risk}`, 20, y);
    y += 7;
  });

  y += 4;
  doc.text("Mitigation Measures:", 15, y);
  y += 8;
  mitigations.forEach(item => {
    doc.text(`- ${item}`, 20, y);
    y += 7;
  });

  y += 4;
  doc.text("AI-style Incident Summary:", 15, y);
  y += 8;

  const summaryLines = doc.splitTextToSize(aiSummary || "N/A", 180);
  doc.text(summaryLines, 15, y);

  doc.save("gdpr-compliance-report.pdf");
}
async function generateGeminiReview() {
  const API_KEY = "your key";

  const incident = JSON.parse(localStorage.getItem("gdprIncident"));
  const assessment = JSON.parse(localStorage.getItem("gdprAssessment"));
  const severity = JSON.parse(localStorage.getItem("gdprSeverity"));
  const risks = JSON.parse(localStorage.getItem("gdprRisks")) || [];
  const mitigations = JSON.parse(localStorage.getItem("gdprMitigations")) || [];

  const output = document.getElementById("geminiReviewText");
  output.innerText = "Generating AI review...";

  const fallbackReview = `
Live Gemini API review could not be generated because the API quota or connection limit was reached.

Fallback compliance review:
Based on the rule-based assessment, this incident should be handled according to the displayed GDPR notification decision, severity score, identified risks, and mitigation measures. The rule-based result remains the official output of the PoC.

Note: This AI review is an assistive explanation only and does not replace legal advice.
  `;

  const prompt = `
You are assisting with an academic GDPR data breach proof of concept.

Based on the following incident and rule-based assessment, write a short compliance review in plain English.

Do not override the rule-based decision. Treat it as the official result.

Incident:
Title: ${incident?.title}
Department: ${incident?.department}
Category: ${incident?.category}
Affected individuals: ${incident?.count}
Description: ${incident?.description}

Assessment:
Decision: ${assessment?.decision}
Explanation: ${assessment?.explanation}
Severity: ${severity?.score}/100 (${severity?.level})

Identified risks:
${risks.join(", ")}

Recommended mitigations:
${mitigations.join(", ")}

Write:
1. a short summary
2. the main legal/compliance concern
3. suggested next step
4. a disclaimer that this is not legal advice
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      output.innerText = fallbackReview;
      return;
    }

    const aiText =
      data.choices?.[0]?.message?.content ||
      fallbackReview;

    output.innerText = aiText;

  } catch (error) {
    output.innerText = fallbackReview;
  }
}

function downloadHistory() {
  const history =
    JSON.parse(localStorage.getItem("gdprAssessmentHistory")) || [];

  if (history.length === 0) {
    alert("No assessment history available.");
    return;
  }

  let content = "GDPR Assessment History\n\n";

  history.forEach((item, index) => {
    content += `Case ${index + 1}\n`;
    content += `Decision: ${item.decision}\n`;
    content += `Explanation: ${item.explanation}\n`;
    content += `Date: ${item.date}\n`;
    content += `--------------------------\n`;
  });

  const blob = new Blob([content], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  link.download = "gdpr-assessment-history.txt";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}