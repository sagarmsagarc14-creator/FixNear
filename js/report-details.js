// ========================================
// FIXNEAR - REPORT DETAILS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------
    // GET REPORT ID FROM URL
    // ------------------------------------

    const params =
        new URLSearchParams(window.location.search);

    const reportId =
        params.get("id");


    // ------------------------------------
    // GET REPORTS FROM LOCAL STORAGE
    // ------------------------------------

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

        console.error(
            "Unable to load reports:",
            error
        );

        reports = [];

    }


    // ------------------------------------
    // FIND SELECTED REPORT
    // ------------------------------------

    const report =
        reports.find(function (item) {

            return String(item.id) ===
                   String(reportId);

        });


    // ------------------------------------
    // REPORT NOT FOUND
    // ------------------------------------

    if (!report) {

        const notFound =
            document.getElementById(
                "reportNotFound"
            );

        if (notFound) {

            notFound.style.display =
                "block";

        }

        return;

    }


    // ------------------------------------
    // NORMALIZE REPORT DATA
    // ------------------------------------

    const category =
        report.category || "Other";

    const severity =
        report.severity || "Not specified";

    const priority =
        report.priority !== undefined &&
        report.priority !== null
            ? report.priority
            : 0;

    const date =
        report.date ||
        formatDate(report.timestamp) ||
        "Unknown";

    const description =
        report.description ||
        "No description available.";

    const location =
        report.location ||
        "Location unavailable";

    const status =
        report.status ||
        "Submitted";


    // ------------------------------------
    // REPORT HEADER
    // ------------------------------------

    setText(
        "reportCategory",
        getIcon(category) +
        " " +
        category
    );


    setText(
        "reportId",
        "Report ID: " +
        (report.id || "Unknown")
    );


    setText(
        "reportStatus",
        status
    );


    // ------------------------------------
    // QUICK SUMMARY CARDS
    // ------------------------------------

    setText(
        "summaryCategory",
        category
    );


    setText(
        "summarySeverity",
        severity
    );


    setText(
        "summaryPriority",
        getPriorityText(priority)
    );


    setText(
        "summaryDate",
        date
    );


    // ------------------------------------
    // ISSUE INFORMATION
    // ------------------------------------

    setText(
        "infoCategory",
        category
    );


    setText(
        "infoSeverity",
        severity
    );


    setText(
        "infoPriority",
        getPriorityText(priority)
    );


    setText(
        "infoDate",
        date
    );


    setText(
        "infoDescription",
        description
    );


    // ------------------------------------
    // LOCATION
    // ------------------------------------

    setText(
        "reportLocation",
        location
    );


    setText(
        "latitude",
        report.latitude !== null &&
        report.latitude !== undefined &&
        report.latitude !== ""
            ? report.latitude
            : "Not available"
    );


    setText(
        "longitude",
        report.longitude !== null &&
        report.longitude !== undefined &&
        report.longitude !== ""
            ? report.longitude
            : "Not available"
    );


    // ------------------------------------
    // PHOTO
    // ------------------------------------

    displayPhoto(
        report.photo
    );


    // ------------------------------------
    // STATUS TIMELINE
    // ------------------------------------

    updateTimeline(
        status
    );


    // ------------------------------------
    // STATUS COLOR
    // ------------------------------------

    updateStatusStyle(
        status
    );

});



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
// FORMAT DATE
// ========================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "";

    }


    try {

        const date =
            new Date(timestamp);


        if (isNaN(date.getTime())) {

            return "";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            }
        );

    } catch (error) {

        return "";

    }

}



// ========================================
// PRIORITY TEXT
// ========================================

function getPriorityText(priority) {

    const score =
        Number(priority);


    if (score === 90) {

        return "90 - High";

    }


    if (score === 60) {

        return "60 - Medium";

    }


    if (score === 30) {

        return "30 - Low";

    }


    return "0 - Normal";

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

        case "Other":
            return "📍";

        default:
            return "📍";

    }

}



// ========================================
// DISPLAY PHOTO
// ========================================

function displayPhoto(photo) {

    const photoContainer =
        document.getElementById(
            "photoContainer"
        );


    if (!photoContainer) {

        return;

    }


    // No photo

    if (!photo) {

        return;

    }


    // Clear existing content

    photoContainer.innerHTML = "";


    const image =
        document.createElement("img");


    image.src =
        photo;


    image.alt =
        "Reported issue photo";


    image.loading =
        "lazy";


    image.onerror =
        function () {

            photoContainer.innerHTML = `
                <div class="no-photo">
                    <div class="no-photo-icon">📷</div>
                    <p>Photo unavailable</p>
                    <span>The uploaded image could not be displayed.</span>
                </div>
            `;

        };


    photoContainer.appendChild(
        image
    );

}



// ========================================
// UPDATE STATUS TIMELINE
// ========================================

function updateTimeline(status) {

    const submitted =
        document.getElementById(
            "submittedTimeline"
        );


    const review =
        document.getElementById(
            "reviewTimeline"
        );


    const progress =
        document.getElementById(
            "progressTimeline"
        );


    const resolved =
        document.getElementById(
            "resolvedTimeline"
        );


    // ------------------------------------
    // RESET TIMELINE
    // ------------------------------------

    const timelineItems = [
        submitted,
        review,
        progress,
        resolved
    ];


    timelineItems.forEach(
        function (item) {

            if (item) {

                item.classList.remove(
                    "active"
                );

            }

        }
    );


    // ------------------------------------
    // SUBMITTED
    // ------------------------------------

    if (
        status === "Submitted"
    ) {

        if (submitted) {

            submitted.classList.add(
                "active"
            );

        }

        return;

    }


    // ------------------------------------
    // UNDER REVIEW
    // ------------------------------------

    if (
        status === "Under Review"
    ) {

        activateTimeline(
            submitted,
            review
        );

        return;

    }


    // ------------------------------------
    // IN PROGRESS
    // ------------------------------------

    if (
        status === "In Progress"
    ) {

        activateTimeline(
            submitted,
            review,
            progress
        );

        return;

    }


    // ------------------------------------
    // RESOLVED
    // ------------------------------------

    if (
        status === "Resolved"
    ) {

        activateTimeline(
            submitted,
            review,
            progress,
            resolved
        );

        return;

    }


    // ------------------------------------
    // UNKNOWN STATUS
    // ------------------------------------

    if (submitted) {

        submitted.classList.add(
            "active"
        );

    }

}



// ========================================
// ACTIVATE TIMELINE ITEMS
// ========================================

function activateTimeline() {

    const items =
        Array.from(arguments);


    items.forEach(
        function (item) {

            if (item) {

                item.classList.add(
                    "active"
                );

            }

        }
    );

}



// ========================================
// STATUS STYLE
// ========================================

function updateStatusStyle(status) {

    const statusElement =
        document.getElementById(
            "reportStatus"
        );


    if (!statusElement) {

        return;

    }


    // Remove previous classes

    statusElement.classList.remove(
        "status-submitted",
        "status-review",
        "status-progress",
        "status-resolved"
    );


    // Add correct class

    switch (status) {

        case "Submitted":

            statusElement.classList.add(
                "status-submitted"
            );

            break;


        case "Under Review":

            statusElement.classList.add(
                "status-review"
            );

            break;


        case "In Progress":

            statusElement.classList.add(
                "status-progress"
            );

            break;


        case "Resolved":

            statusElement.classList.add(
                "status-resolved"
            );

            break;

    }

}
