// ========================================
// FIXNEAR - TRACK REPORT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const reportIdInput =
        document.getElementById("reportIdInput");

    const trackButton =
        document.getElementById("trackButton");

    const trackResult =
        document.getElementById("trackResult");

    const trackError =
        document.getElementById("trackError");


    // ========================================
    // TRACK BUTTON
    // ========================================

    if (trackButton) {

        trackButton.addEventListener(
            "click",
            trackReport
        );

    }


    // ========================================
    // ENTER KEY
    // ========================================

    if (reportIdInput) {

        reportIdInput.addEventListener(
            "keypress",
            function (event) {

                if (event.key === "Enter") {

                    trackReport();

                }

            }
        );

    }


    // ========================================
    // TRACK REPORT
    // ========================================

    function trackReport() {

        hideMessages();


        if (!reportIdInput) {

            showError(
                "Report ID input not found."
            );

            return;

        }


        const enteredId =
            reportIdInput.value.trim();


        // Check empty

        if (!enteredId) {

            showError(
                "Please enter your Report ID."
            );

            return;

        }


        // ====================================
        // GET REPORTS
        // ====================================

        let reports = [];


        try {

            const savedReports =
                localStorage.getItem(
                    "fixnearReports"
                );


            if (savedReports) {

                reports =
                    JSON.parse(savedReports);

            }


            if (!Array.isArray(reports)) {

                reports = [];

            }

        }

        catch (error) {

            console.error(
                "Error reading reports:",
                error
            );


            showError(
                "Unable to load reports."
            );

            return;

        }


        // ====================================
        // FIND REPORT
        // ====================================

        const report =
            reports.find(function (item) {

                return String(item.id || "")
                    .trim()
                    .toLowerCase() ===
                    enteredId.toLowerCase();

            });


        // ====================================
        // REPORT NOT FOUND
        // ====================================

        if (!report) {

            showError(
                "Report not found. Please check your Report ID."
            );

            return;

        }


        // ====================================
        // SHOW REPORT
        // ====================================

        setText(
            "resultId",
            report.id || "N/A"
        );


        setText(
            "resultCategory",
            report.category || "Other"
        );


        setText(
            "resultDescription",
            report.description || "No description"
        );


        setText(
            "resultLocation",
            report.location || "Location unavailable"
        );


        setText(
            "resultSeverity",
            report.severity || "Medium"
        );


        setText(
            "resultPriority",
            (report.priority || 0) + "/100"
        );


        setText(
            "resultDate",
            report.date || "Unknown"
        );


        const status =
            report.status || "Submitted";


        setText(
            "resultStatusText",
            status
        );


        // ====================================
        // STATUS BADGE
        // ====================================

        const statusElement =
            document.getElementById(
                "reportStatus"
            );


        if (statusElement) {

            statusElement.textContent =
                getStatusIcon(status) +
                " " +
                status;


            statusElement.className =
                "report-status";


            statusElement.classList.add(
                getStatusClass(status)
            );

        }


        // ====================================
        // SHOW RESULT
        // ====================================

        if (trackResult) {

            trackResult.style.display =
                "block";

        }

    }


    // ========================================
    // SET TEXT SAFELY
    // ========================================

    function setText(id, value) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;

        }

    }


    // ========================================
    // ERROR
    // ========================================

    function showError(message) {

        if (trackError) {

            trackError.textContent =
                message;

            trackError.style.display =
                "block";

        }

    }


    // ========================================
    // HIDE MESSAGES
    // ========================================

    function hideMessages() {

        if (trackError) {

            trackError.textContent = "";

            trackError.style.display =
                "none";

        }


        if (trackResult) {

            trackResult.style.display =
                "none";

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
                return "🔧";

            case "Under Review":
                return "🔍";

            case "Submitted":
                return "⏳";

            default:
                return "📋";

        }

    }


    // ========================================
    // STATUS CLASS
    // ========================================

    function getStatusClass(status) {

        switch (status) {

            case "Resolved":
                return "status-resolved";

            case "In Progress":
                return "status-progress";

            case "Under Review":
                return "status-review";

            default:
                return "status-submitted";

        }

    }

});