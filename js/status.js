// ========================================
// FIXNEAR - REPORT STATUS TRACKER
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    var input =
        document.getElementById("reportIdInput");

    var button =
        document.getElementById("trackButton");

    var result =
        document.getElementById("statusResult");


    // ----------------------------------------
    // FIND REPORT
    // ----------------------------------------

    function findReport(id) {

        var saved =
            localStorage.getItem("fixnearReports");

        if (!saved) {
            return null;
        }


        try {

            var reports =
                JSON.parse(saved);


            if (!Array.isArray(reports)) {
                return null;
            }


            return reports.find(function (report) {

                return report &&
                    String(report.id).toLowerCase() ===
                    String(id).toLowerCase();

            });

        } catch (error) {

            console.error(
                "Error reading reports:",
                error
            );

            return null;
        }

    }


    // ----------------------------------------
    // TRACK REPORT
    // ----------------------------------------

    function trackReport() {

        var id =
            input.value.trim();


        if (!id) {

            result.innerHTML =
                "<p class='status-error'>" +
                "Please enter a Report ID." +
                "</p>";

            return;
        }


        var report =
            findReport(id);


        if (!report) {

            result.innerHTML =
                "<div class='status-error'>" +
                "<strong>Report not found</strong>" +
                "<p>Please check your Report ID and try again.</p>" +
                "</div>";

            return;
        }


        displayReport(report);

    }


    // ----------------------------------------
    // DISPLAY REPORT
    // ----------------------------------------

    function displayReport(report) {

        var history =
            Array.isArray(report.statusHistory)
                ? report.statusHistory
                : [];


        var statuses = [
            "Submitted",
            "Under Review",
            "In Progress",
            "Resolved"
        ];


        var currentIndex =
            statuses.indexOf(report.status);


        if (currentIndex < 0) {
            currentIndex = 0;
        }


        var html = "";


        html +=
            "<div class='tracked-report'>";


        html +=
            "<div class='tracked-header'>";


        html +=
            "<div>" +
            "<span class='tracked-id'>" +
            escapeText(report.id) +
            "</span>" +
            "<h2>" +
            escapeText(report.category) +
            "</h2>" +
            "</div>";


        html +=
            "<span class='current-status'>" +
            escapeText(report.status) +
            "</span>";


        html +=
            "</div>";


        html +=
            "<p class='tracked-description'>" +
            escapeText(report.description) +
            "</p>";


        // Timeline

        html +=
            "<div class='status-timeline'>";


        statuses.forEach(function (status, index) {

            var completed =
                index <= currentIndex;


            var historyItem =
                history.find(function (item) {

                    return item &&
                        item.status === status;

                });


            var date =
                historyItem
                    ? historyItem.date
                    : "";


            html +=
                "<div class='timeline-item " +
                (completed ? "completed" : "") +
                "'>";


            html +=
                "<div class='timeline-dot'>";


            if (completed) {
                html += "✓";
            } else {
                html += (index + 1);
            }


            html +=
                "</div>";


            html +=
                "<div class='timeline-content'>";


            html +=
                "<strong>" +
                status +
                "</strong>";


            if (date) {

                html +=
                    "<span>" +
                    escapeText(date) +
                    "</span>";

            } else {

                html +=
                    "<span>Pending</span>";

            }


            html +=
                "</div>";


            html +=
                "</div>";

        });


        html +=
            "</div>";


        // Details

        html +=
            "<div class='tracked-details'>";


        html +=
            "<div>" +
            "<span>📍 Location</span>" +
            "<strong>" +
            escapeText(
                report.location ||
                "Not available"
            ) +
            "</strong>" +
            "</div>";


        html +=
            "<div>" +
            "<span>⚠️ Severity</span>" +
            "<strong>" +
            escapeText(
                report.severity ||
                "Medium"
            ) +
            "</strong>" +
            "</div>";


        html +=
            "</div>";


        html +=
            "</div>";


        result.innerHTML = html;

    }


    // ----------------------------------------
    // ESCAPE TEXT
    // ----------------------------------------

    function escapeText(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ----------------------------------------
    // BUTTON
    // ----------------------------------------

    button.addEventListener(
        "click",
        trackReport
    );


    // Enter key

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                trackReport();
            }

        }
    );

});