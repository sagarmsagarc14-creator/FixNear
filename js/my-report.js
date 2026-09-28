// ========================================
// FIXNEAR - MY REPORTS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    loadReports();

});


// ========================================
// LOAD REPORTS
// ========================================

function loadReports() {

    const reportsContainer =
        document.getElementById("reportsContainer");

    const emptyReports =
        document.getElementById("emptyReports");

    const totalReports =
        document.getElementById("totalReports");

    const submittedReports =
        document.getElementById("submittedReports");

    const resolvedReports =
        document.getElementById("resolvedReports");


    // Get reports

    let reports = [];

    try {

        const savedReports =
            localStorage.getItem("fixnearReports");

        if (savedReports) {
            reports = JSON.parse(savedReports);
        }

        if (!Array.isArray(reports)) {
            reports = [];
        }

    } catch (error) {

        console.error("Error loading reports:", error);

        reports = [];

    }


    // ========================================
    // UPDATE COUNTERS
    // ========================================

    if (totalReports) {
        totalReports.textContent = reports.length;
    }

    if (submittedReports) {

        submittedReports.textContent =
            reports.filter(function (report) {

                return report.status === "Submitted";

            }).length;

    }

    if (resolvedReports) {

        resolvedReports.textContent =
            reports.filter(function (report) {

                return report.status === "Resolved";

            }).length;

    }


    // ========================================
    // EMPTY REPORTS
    // ========================================

    if (reports.length === 0) {

        if (reportsContainer) {
            reportsContainer.innerHTML = "";
        }

        if (emptyReports) {
            emptyReports.style.display = "block";
        }

        return;
    }


    if (emptyReports) {
        emptyReports.style.display = "none";
    }


    if (!reportsContainer) {
        return;
    }


    reportsContainer.innerHTML = "";


    // ========================================
    // DISPLAY REPORTS
    // ========================================

    reports
        .slice()
        .reverse()
        .forEach(function (report) {

            const card =
                document.createElement("div");

            card.className =
                "my-report-card";


            const category =
                report.category || "Other";

            const description =
                report.description || "No description";

            const location =
                report.location || "Location unavailable";

            const severity =
                report.severity || "Medium";

            const status =
                report.status || "Submitted";

            const date =
                report.date || "Unknown";

            const priority =
                report.priority || 0;

            const reportId =
                report.id || "FN-000000";


            // ========================================
            // REPORT CARD
            // ========================================

            card.innerHTML = `

                <div class="report-card-top">

                    <div>

                        <span class="report-id">
                            ${escapeHTML(reportId)}
                        </span>

                        <h3>

                            ${getIcon(category)}

                            ${escapeHTML(category)}

                        </h3>

                    </div>


                    <span class="status-badge">

                        ${getStatusIcon(status)}

                        ${escapeHTML(status)}

                    </span>

                </div>


                <p class="report-description">

                    ${escapeHTML(description)}

                </p>


                <div class="report-details">

                    <span>
                        📍 ${escapeHTML(location)}
                    </span>

                    <span>
                        ${getSeverityIcon(severity)}
                        ${escapeHTML(severity)}
                    </span>

                    <span>
                        📅 ${escapeHTML(date)}
                    </span>

                </div>


                <div class="report-priority">

                    <strong>
                        Priority Score
                    </strong>

                    <span>
                        ${priority}/100
                    </span>

                </div>


                <div class="report-actions">

                    <button
                        class="view-report-button"
                        onclick="viewReport('${encodeURIComponent(reportId)}')">

                        View Details →

                    </button>


                    <button
                        class="delete-report-button"
                        onclick="deleteReport('${encodeURIComponent(reportId)}')">

                        🗑️ Delete

                    </button>

                </div>

            `;


            reportsContainer.appendChild(card);

        });

}


// ========================================
// DELETE ONE REPORT
// ========================================

function deleteReport(reportId) {

    const decodedId =
        decodeURIComponent(reportId);


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this report?"
        );


    if (!confirmDelete) {
        return;
    }


    let reports = [];


    try {

        const savedReports =
            localStorage.getItem("fixnearReports");

        if (savedReports) {

            reports =
                JSON.parse(savedReports);

        }

        if (!Array.isArray(reports)) {
            reports = [];
        }

    } catch (error) {

        console.error(
            "Error reading reports:",
            error
        );

        return;

    }


    // Remove selected report

    reports =
        reports.filter(function (report) {

            return report.id !== decodedId;

        });


    // Save updated reports

    localStorage.setItem(
        "fixnearReports",
        JSON.stringify(reports)
    );


    alert(
        "✅ Report deleted successfully."
    );


    // Reload My Reports

    loadReports();

}


// ========================================
// VIEW REPORT
// ========================================

function viewReport(reportId) {

    window.location.href =
        "report-details.html?id=" + reportId;

}


// ========================================
// CATEGORY ICON
// ========================================

function getIcon(category) {

    switch (category) {

        case "Pothole":
            return "🕳️";

        case "Streetlight":
            return "💡";

        case "Garbage":
            return "🗑️";

        case "Water Leakage":
            return "💧";

        case "Road Damage":
            return "🚧";

        default:
            return "📍";

    }

}


// ========================================
// STATUS ICON
// ========================================

function getStatusIcon(status) {

    switch (status) {

        case "Resolved":
            return "✅";

        case "In Progress":
            return "⚙️";

        case "Under Review":
            return "🔍";

        default:
            return "⏳";

    }

}


// ========================================
// SEVERITY ICON
// ========================================

function getSeverityIcon(severity) {

    switch (severity) {

        case "High":
            return "🔴";

        case "Low":
            return "🟢";

        default:
            return "🟡";

    }

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}