// ========================================
// FIXNEAR - EXPLORE ISSUES
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const severityFilter =
        document.getElementById("severityFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const resetButton =
        document.getElementById("resetFilters");

    const reportsContainer =
        document.getElementById("exploreReports");

    const emptyMessage =
        document.getElementById("exploreEmpty");

    const resultsCount =
        document.getElementById("resultsCount");


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
    // DISPLAY REPORTS
    // ========================================

    function displayReports() {

        let filteredReports =
            reports.slice();


        // ------------------------------------
        // SEARCH
        // ------------------------------------

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        if (searchText) {

            filteredReports =
                filteredReports.filter(function (report) {

                    return (

                        String(report.category || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        String(report.description || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        String(report.location || "")
                            .toLowerCase()
                            .includes(searchText)

                    );

                });

        }


        // ------------------------------------
        // CATEGORY
        // ------------------------------------

        if (
            categoryFilter &&
            categoryFilter.value !== "all"
        ) {

            filteredReports =
                filteredReports.filter(function (report) {

                    return report.category ===
                        categoryFilter.value;

                });

        }


        // ------------------------------------
        // SEVERITY
        // ------------------------------------

        if (
            severityFilter &&
            severityFilter.value !== "all"
        ) {

            filteredReports =
                filteredReports.filter(function (report) {

                    return report.severity ===
                        severityFilter.value;

                });

        }


        // ------------------------------------
        // STATUS
        // ------------------------------------

        if (
            statusFilter &&
            statusFilter.value !== "all"
        ) {

            filteredReports =
                filteredReports.filter(function (report) {

                    return report.status ===
                        statusFilter.value;

                });

        }


        // ------------------------------------
        // SORT
        // ------------------------------------

        const sortValue =
            sortFilter
                ? sortFilter.value
                : "newest";


        if (sortValue === "newest") {

            filteredReports.sort(function (a, b) {

                return getTime(b) - getTime(a);

            });

        }


        else if (sortValue === "oldest") {

            filteredReports.sort(function (a, b) {

                return getTime(a) - getTime(b);

            });

        }


        else if (sortValue === "priority") {

            filteredReports.sort(function (a, b) {

                return (
                    Number(b.priority || 0) -
                    Number(a.priority || 0)
                );

            });

        }


        // ====================================
        // RESULTS COUNT
        // ====================================

        if (resultsCount) {

            resultsCount.textContent =
                filteredReports.length +
                (
                    filteredReports.length === 1
                        ? " report found"
                        : " reports found"
                );

        }


        // ====================================
        // EMPTY STATE
        // ====================================

        if (filteredReports.length === 0) {

            reportsContainer.innerHTML = "";

            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }

            return;

        }


        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }


        // ====================================
        // DISPLAY
        // ====================================

        reportsContainer.innerHTML = "";


        filteredReports.forEach(function (report) {

            const card =
                document.createElement("article");

            card.className =
                "explore-report-card";


            const category =
                report.category || "Other";

            const description =
                report.description ||
                "No description provided.";

            const location =
                report.location ||
                "Location unavailable";

            const severity =
                report.severity ||
                "Medium";

            const status =
                report.status ||
                "Submitted";

            const priority =
                Number(report.priority || 0);

            const date =
                report.date ||
                "Unknown";

            const id =
                report.id ||
                "FN-000000";


            card.innerHTML = `

                <div class="explore-card-header">

                    <div class="explore-category">

                        <span class="category-icon">
                            ${getCategoryIcon(category)}
                        </span>

                        <div>

                            <h3>
                                ${escapeHTML(category)}
                            </h3>

                            <small>
                                ${escapeHTML(id)}
                            </small>

                        </div>

                    </div>


                    <span class="explore-status">
                        ${getStatusIcon(status)}
                        ${escapeHTML(status)}
                    </span>

                </div>


                <p class="explore-description">
                    ${escapeHTML(description)}
                </p>


                <div class="explore-details">

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


                <div class="explore-card-footer">

                    <span>
                        Priority: <strong>
                            ${priority}/100
                        </strong>
                    </span>

                </div>

            `;


            reportsContainer.appendChild(card);

        });

    }


    // ========================================
    // GET REPORT TIME
    // ========================================

    function getTime(report) {

        if (report.timestamp) {

            const time =
                new Date(report.timestamp).getTime();

            if (!isNaN(time)) {
                return time;
            }

        }

        return 0;

    }


    // ========================================
    // EVENTS
    // ========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            displayReports
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            displayReports
        );

    }


    if (severityFilter) {

        severityFilter.addEventListener(
            "change",
            displayReports
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            displayReports
        );

    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            displayReports
        );

    }


    // ========================================
    // RESET
    // ========================================

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (categoryFilter) {
                    categoryFilter.value = "all";
                }

                if (severityFilter) {
                    severityFilter.value = "all";
                }

                if (statusFilter) {
                    statusFilter.value = "all";
                }

                if (sortFilter) {
                    sortFilter.value = "newest";
                }

                displayReports();

            }
        );

    }


    // ========================================
    // INITIAL DISPLAY
    // ========================================

    displayReports();

});


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
// SECURITY
// ========================================

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}