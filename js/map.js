// ========================================
// FIXNEAR - ISSUE MAP
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const mapReports =
        document.getElementById("mapReports");

    const mapEmpty =
        document.getElementById("mapEmpty");

    const reportCount =
        document.getElementById("reportCount");

    const osmMap =
        document.getElementById("osmMap");


    // ========================================
    // LOAD REPORTS
    // ========================================

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
            "Error loading reports:",
            error
        );

        reports = [];

    }


    // ========================================
    // ONLY REPORTS WITH LOCATION
    // ========================================

    const locationReports =
        reports.filter(function (report) {

            return (
                report.latitude !== null &&
                report.latitude !== undefined &&
                report.longitude !== null &&
                report.longitude !== undefined &&
                !isNaN(Number(report.latitude)) &&
                !isNaN(Number(report.longitude))
            );

        });


    // ========================================
    // REPORT COUNT
    // ========================================

    if (reportCount) {

        reportCount.textContent =
            locationReports.length +
            (
                locationReports.length === 1
                    ? " report"
                    : " reports"
            );

    }


    // ========================================
    // EMPTY STATE
    // ========================================

    if (locationReports.length === 0) {

        if (mapReports) {

            mapReports.innerHTML = "";

        }

        if (mapEmpty) {

            mapEmpty.style.display = "block";

        }

        return;

    }


    if (mapEmpty) {

        mapEmpty.style.display = "none";

    }


    // ========================================
    // DISPLAY REPORTS
    // ========================================

    if (mapReports) {

        mapReports.innerHTML = "";

    }


    locationReports
        .slice()
        .reverse()
        .forEach(function (report) {

            const item =
                document.createElement("div");

            item.className =
                "map-report-item";


            const category =
                report.category || "Other";

            const description =
                report.description ||
                "No description";

            const location =
                report.location ||
                "Location unavailable";

            const status =
                report.status ||
                "Submitted";

            const severity =
                report.severity ||
                "Medium";


            item.innerHTML = `

                <div class="map-report-icon">
                    ${getCategoryIcon(category)}
                </div>

                <div class="map-report-content">

                    <h3>
                        ${escapeHTML(category)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    <small>
                        📍 ${escapeHTML(location)}
                    </small>

                    <span class="map-report-status">
                        ${getStatusIcon(status)}
                        ${escapeHTML(status)}
                    </span>

                    <span class="map-report-severity">
                        ${getSeverityIcon(severity)}
                        ${escapeHTML(severity)}
                    </span>

                </div>

            `;


            // ====================================
            // CLICK REPORT
            // ====================================

            item.addEventListener(
                "click",
                function () {

                    const latitude =
                        Number(report.latitude);

                    const longitude =
                        Number(report.longitude);


                    showLocation(
                        latitude,
                        longitude
                    );

                }
            );


            if (mapReports) {

                mapReports.appendChild(item);

            }

        });


    // ========================================
    // SHOW LOCATION ON OPENSTREETMAP
    // ========================================

    function showLocation(latitude, longitude) {

        if (!osmMap) {
            return;
        }


        const zoom = 0.01;


        const bbox =
            (
                longitude - zoom
            ) + "," +
            (
                latitude - zoom
            ) + "," +
            (
                longitude + zoom
            ) + "," +
            (
                latitude + zoom
            );


        osmMap.src =
            "https://www.openstreetmap.org/export/embed.html" +
            "?bbox=" +
            encodeURIComponent(bbox) +
            "&layer=mapnik" +
            "&marker=" +
            latitude +
            "," +
            longitude;

    }


    // ========================================
    // CATEGORY ICON
    // ========================================

    function getCategoryIcon(category) {

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
                return "🔧";

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

});