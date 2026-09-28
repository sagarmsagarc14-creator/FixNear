"use strict";

/* =========================================================
   ADMIN LOGIN SECURITY
========================================================= */

if (localStorage.getItem("fixnearAdminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const adminTotal = document.getElementById("adminTotal");
    const adminSubmitted = document.getElementById("adminSubmitted");
    const adminProgress = document.getElementById("adminProgress");
    const adminResolved = document.getElementById("adminResolved");

    const analyticsSubmitted =
        document.getElementById("analyticsSubmitted");

    const analyticsProgress =
        document.getElementById("analyticsProgress");

    const analyticsResolved =
        document.getElementById("analyticsResolved");

    const submittedProgress =
        document.getElementById("submittedProgress");

    const progressBar =
        document.getElementById("progressBar");

    const resolvedProgress =
        document.getElementById("resolvedProgress");

    const categoryBreakdown =
        document.getElementById("categoryBreakdown");

    const highPriorityCount =
        document.getElementById("highPriorityCount");

    const resolutionRate =
        document.getElementById("resolutionRate");

    const communityIssues =
        document.getElementById("communityIssues");

    const adminReportsContainer =
        document.getElementById("adminReportsContainer");

    const adminEmpty =
        document.getElementById("adminEmpty");

    const adminSearch =
        document.getElementById("adminSearch");

    const adminCategoryFilter =
        document.getElementById("adminCategoryFilter");

    const adminStatusFilter =
        document.getElementById("adminStatusFilter");

    const adminSeverityFilter =
        document.getElementById("adminSeverityFilter");

    const adminResetFilters =
        document.getElementById("adminResetFilters");

    const refreshReports =
        document.getElementById("refreshReports");

    const adminLogout =
        document.getElementById("adminLogout");

    const adminActivity =
        document.getElementById("adminActivity");

    const activityEmpty =
        document.getElementById("activityEmpty");


    /* =====================================================
       GET REPORTS
    ===================================================== */

    function getReports() {

        try {

            const reports =
                JSON.parse(
                    localStorage.getItem("fixnearReports")
                );

            return Array.isArray(reports)
                ? reports
                : [];

        } catch (error) {

            console.error("Unable to load reports:", error);

            return [];
        }
    }


    /* =====================================================
       SAVE REPORTS
    ===================================================== */

    function saveReports(reports) {

        localStorage.setItem(
            "fixnearReports",
            JSON.stringify(reports)
        );
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Unknown date";
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return escapeHTML(dateValue);
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    /* =====================================================
       CATEGORY ICON
    ===================================================== */

    function getCategoryIcon(category) {

        const icons = {
            "Pothole": "🕳️",
            "Streetlight": "💡",
            "Garbage": "🗑️",
            "Water Leakage": "💧",
            "Road Damage": "🛣️",
            "Other": "📌"
        };

        return icons[category] || "📌";
    }


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    function getStatusClass(status) {

        if (status === "In Progress") {
            return "status-in-progress";
        }

        if (status === "Resolved") {
            return "status-resolved";
        }

        return "status-submitted";
    }


    /* =====================================================
       SEVERITY CLASS
    ===================================================== */

    function getSeverityClass(severity) {

        if (severity === "High") {
            return "severity-high";
        }

        if (severity === "Medium") {
            return "severity-medium";
        }

        return "severity-low";
    }


    /* =====================================================
       UPDATE STATISTICS
    ===================================================== */

    function updateStatistics(reports) {

        const total = reports.length;

        const submitted =
            reports.filter(
                report => report.status === "Submitted"
            ).length;

        const progress =
            reports.filter(
                report => report.status === "In Progress"
            ).length;

        const resolved =
            reports.filter(
                report => report.status === "Resolved"
            ).length;


        if (adminTotal) {
            adminTotal.textContent = total;
        }

        if (adminSubmitted) {
            adminSubmitted.textContent = submitted;
        }

        if (adminProgress) {
            adminProgress.textContent = progress;
        }

        if (adminResolved) {
            adminResolved.textContent = resolved;
        }
    }


    /* =====================================================
       UPDATE ANALYTICS
    ===================================================== */

    function updateAnalytics(reports) {

        const total = reports.length;

        const submitted =
            reports.filter(
                report => report.status === "Submitted"
            ).length;

        const progress =
            reports.filter(
                report => report.status === "In Progress"
            ).length;

        const resolved =
            reports.filter(
                report => report.status === "Resolved"
            ).length;


        if (analyticsSubmitted) {
            analyticsSubmitted.textContent = submitted;
        }

        if (analyticsProgress) {
            analyticsProgress.textContent = progress;
        }

        if (analyticsResolved) {
            analyticsResolved.textContent = resolved;
        }


        const submittedPercent =
            total > 0
                ? (submitted / total) * 100
                : 0;

        const progressPercent =
            total > 0
                ? (progress / total) * 100
                : 0;

        const resolvedPercent =
            total > 0
                ? (resolved / total) * 100
                : 0;


        if (submittedProgress) {
            submittedProgress.style.width =
                `${submittedPercent}%`;
        }

        if (progressBar) {
            progressBar.style.width =
                `${progressPercent}%`;
        }

        if (resolvedProgress) {
            resolvedProgress.style.width =
                `${resolvedPercent}%`;
        }


        /* CATEGORY BREAKDOWN */

        const categories = {};

        reports.forEach(report => {

            const category =
                report.category || "Other";

            categories[category] =
                (categories[category] || 0) + 1;
        });


        if (categoryBreakdown) {

            categoryBreakdown.innerHTML = "";

            const categoryNames =
                Object.keys(categories);

            if (categoryNames.length === 0) {

                categoryBreakdown.innerHTML = `
                    <div class="category-row">
                        <div class="category-row-info">
                            <span class="category-row-name">
                                No reports yet
                            </span>
                        </div>
                    </div>
                `;

            } else {

                categoryNames.forEach(category => {

                    const count =
                        categories[category];

                    const percent =
                        total > 0
                            ? (count / total) * 100
                            : 0;

                    categoryBreakdown.innerHTML += `

                        <div class="category-row">

                            <div class="category-row-icon">
                                ${getCategoryIcon(category)}
                            </div>

                            <div class="category-row-info">

                                <div class="category-row-name">
                                    ${escapeHTML(category)}
                                </div>

                                <div class="category-row-track">

                                    <div
                                        class="category-row-fill"
                                        style="width:${percent}%">
                                    </div>

                                </div>

                            </div>

                            <div class="category-row-count">
                                ${count}
                            </div>

                        </div>

                    `;
                });
            }
        }


        /* QUICK INSIGHTS */

        const highPriority =
            reports.filter(
                report =>
                    report.severity === "High"
            ).length;

        const rate =
            total > 0
                ? Math.round(
                    (resolved / total) * 100
                )
                : 0;


        if (highPriorityCount) {
            highPriorityCount.textContent =
                highPriority;
        }

        if (resolutionRate) {
            resolutionRate.textContent =
                `${rate}%`;
        }

        if (communityIssues) {
            communityIssues.textContent =
                total;
        }
    }


    /* =====================================================
       ACTIVITY SYSTEM
    ===================================================== */

    function getActivities() {

        try {

            const activities =
                JSON.parse(
                    localStorage.getItem(
                        "fixnearActivities"
                    )
                );

            return Array.isArray(activities)
                ? activities
                : [];

        } catch (error) {

            return [];
        }
    }


    function saveActivities(activities) {

        localStorage.setItem(
            "fixnearActivities",
            JSON.stringify(activities)
        );
    }


    function addActivity(
        type,
        title,
        description
    ) {

        const activities = getActivities();

        const newActivity = {

            id:
                Date.now() +
                Math.floor(
                    Math.random() * 1000
                ),

            type: type,

            title: title,

            description: description,

            date: new Date().toISOString()
        };


        activities.unshift(newActivity);


        /* Keep only latest 20 activities */

        const limitedActivities =
            activities.slice(0, 20);

        saveActivities(limitedActivities);

        renderActivities();
    }


    /* =====================================================
       ACTIVITY ICON
    ===================================================== */

    function getActivityIcon(type) {

        if (type === "submitted") {
            return "📝";
        }

        if (type === "progress") {
            return "🔄";
        }

        if (type === "resolved") {
            return "✅";
        }

        if (type === "deleted") {
            return "🗑️";
        }

        return "📌";
    }


    /* =====================================================
       ACTIVITY CLASS
    ===================================================== */

    function getActivityClass(type) {

        if (type === "submitted") {
            return "activity-submitted";
        }

        if (type === "progress") {
            return "activity-progress";
        }

        if (type === "resolved") {
            return "activity-resolved";
        }

        if (type === "deleted") {
            return "activity-deleted";
        }

        return "";
    }


    /* =====================================================
       RENDER ACTIVITIES
    ===================================================== */

    function renderActivities() {

        if (!adminActivity) {
            return;
        }

        const activities =
            getActivities();


        adminActivity.innerHTML = "";


        if (activities.length === 0) {

            if (activityEmpty) {
                activityEmpty.style.display =
                    "block";
            }

            return;
        }


        if (activityEmpty) {
            activityEmpty.style.display =
                "none";
        }


        activities.slice(0, 10).forEach(activity => {

            const item =
                document.createElement("div");

            item.className =
                `activity-item ${getActivityClass(activity.type)}`;


            item.innerHTML = `

                <div class="activity-icon">

                    ${getActivityIcon(activity.type)}

                </div>


                <div class="activity-content">

                    <h3>
                        ${escapeHTML(activity.title)}
                    </h3>

                    <p>
                        ${escapeHTML(activity.description)}
                    </p>

                    <span class="activity-time">

                        🕐
                        ${formatDate(activity.date)}

                    </span>

                </div>

            `;


            adminActivity.appendChild(item);

        });
    }


    /* =====================================================
       CREATE INITIAL ACTIVITIES
    ===================================================== */

    function createInitialActivities(reports) {

        const existingActivities =
            getActivities();

        if (existingActivities.length > 0) {
            return;
        }


        if (reports.length === 0) {
            return;
        }


        const activities = [];


        reports
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.date || 0) -
                    new Date(a.date || 0)
            )
            .slice(0, 10)
            .forEach(report => {

                activities.push({

                    id:
                        Date.now() +
                        Math.random(),

                    type:
                        report.status === "Resolved"
                            ? "resolved"
                            : report.status === "In Progress"
                                ? "progress"
                                : "submitted",

                    title:
                        report.status === "Resolved"
                            ? "Report Resolved"
                            : report.status === "In Progress"
                                ? "Report In Progress"
                                : "New Report Submitted",

                    description:
                        `${report.category || "Community"} issue — ${report.location || "Location unavailable"}`,

                    date:
                        report.date ||
                        new Date().toISOString()
                });

            });


        saveActivities(activities);
    }


    /* =====================================================
       FILTER REPORTS
    ===================================================== */

    function filterReports(reports) {

        const search =
            adminSearch
                ? adminSearch.value
                    .toLowerCase()
                    .trim()
                : "";

        const category =
            adminCategoryFilter
                ? adminCategoryFilter.value
                : "all";

        const status =
            adminStatusFilter
                ? adminStatusFilter.value
                : "all";

        const severity =
            adminSeverityFilter
                ? adminSeverityFilter.value
                : "all";


        return reports.filter(report => {

            const searchableText = `

                ${report.id || ""}

                ${report.category || ""}

                ${report.description || ""}

                ${report.location || ""}

                ${report.status || ""}

                ${report.severity || ""}

            `.toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(search);


            const matchesCategory =
                category === "all" ||
                report.category === category;


            const matchesStatus =
                status === "all" ||
                report.status === status;


            const matchesSeverity =
                severity === "all" ||
                report.severity === severity;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus &&
                matchesSeverity
            );
        });
    }


    /* =====================================================
       RENDER REPORTS
    ===================================================== */

    function renderReports() {

        const allReports =
            getReports();


        updateStatistics(allReports);

        updateAnalytics(allReports);

        createInitialActivities(allReports);

        renderActivities();


        const reports =
            filterReports(allReports);


        if (!adminReportsContainer) {
            return;
        }


        adminReportsContainer.innerHTML = "";


        if (reports.length === 0) {

            if (adminEmpty) {
                adminEmpty.style.display =
                    "block";
            }

            return;
        }


        if (adminEmpty) {
            adminEmpty.style.display =
                "none";
        }


        reports.forEach(report => {

            const card =
                document.createElement("div");

            card.className =
                "admin-report-card";


            const category =
                report.category || "Other";

            const status =
                report.status || "Submitted";

            const severity =
                report.severity || "Low";


            card.innerHTML = `

                <div class="admin-report-top">

                    <div class="admin-report-category">

                        <div class="report-category-icon">

                            ${getCategoryIcon(category)}

                        </div>

                        <div>

                            <div class="report-category-label">

                                ${escapeHTML(category)}

                            </div>

                            <small>
                                ${escapeHTML(report.id || "No ID")}
                            </small>

                        </div>

                    </div>


                    <span class="admin-status-badge ${getStatusClass(status)}">

                        ${escapeHTML(status)}

                    </span>

                </div>


                <div class="admin-report-meta">

                    <div class="admin-meta-item">

                        📍

                        <span>
                            ${escapeHTML(report.location || "Location unavailable")}
                        </span>

                    </div>


                    <div class="admin-meta-item">

                        🕐

                        <span>
                            ${formatDate(report.date)}
                        </span>

                    </div>

                </div>


                <p class="admin-report-description">

                    ${escapeHTML(
                        report.description ||
                        "No description provided."
                    )}

                </p>


                <div class="admin-report-footer">

                    <span class="admin-severity ${getSeverityClass(severity)}">

                        ${escapeHTML(severity)} Priority

                    </span>


                    <div class="admin-actions">

                        <button
                            class="admin-action-btn view-btn"
                            data-action="view"
                            data-id="${escapeHTML(report.id)}">

                            👁 View

                        </button>
<button
    class="admin-action-btn update-btn"
    data-action="update"
    data-id="${escapeHTML(report.id)}">

    🔄 Update

</button>

                        <button
                            class="admin-action-btn update-btn"
                            data-action="update"
                            data-id="${escapeHTML(report.id)}">

                            🔄 Update

                        </button>


                        <button
                            class="admin-action-btn delete-btn"
                            data-action="delete"
                            data-id="${escapeHTML(report.id)}">

                            🗑 Delete

                        </button>

                    </div>

                </div>

            `;


            adminReportsContainer.appendChild(card);

        });
    }


    /* =====================================================
       REPORT ACTIONS
    ===================================================== */

    if (adminReportsContainer) {

        adminReportsContainer.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest("button");


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;

                const id =
                    button.dataset.id;


                const reports =
                    getReports();


                const reportIndex =
                    reports.findIndex(
                        report =>
                            String(report.id) ===
                            String(id)
                    );


                if (reportIndex === -1) {
                    return;
                }


                const report =
                    reports[reportIndex];


                /* VIEW */

                if (action === "view") {

                    window.location.href =
                        `report-details.html?id=${encodeURIComponent(id)}`;

                    return;
                }


                /* UPDATE */

                if (action === "update") {

                    const currentStatus =
                        report.status ||
                        "Submitted";


                    let newStatus;


                    if (currentStatus === "Submitted") {

                        newStatus =
                            "In Progress";

                    } else if (
                        currentStatus === "In Progress"
                    ) {

                        newStatus =
                            "Resolved";

                    } else {

                        newStatus =
                            "Submitted";
                    }


                    report.status =
                        newStatus;


                    reports[reportIndex] =
                        report;


                    saveReports(reports);


                    /* Activity */

                    let activityType =
                        "submitted";


                    if (
                        newStatus ===
                        "In Progress"
                    ) {

                        activityType =
                            "progress";

                    } else if (
                        newStatus ===
                        "Resolved"
                    ) {

                        activityType =
                            "resolved";
                    }


                    addActivity(

                        activityType,

                        `Report ${newStatus}`,

                        `${report.category || "Community"} issue ${report.id || ""} is now ${newStatus}.`

                    );


                    renderReports();

                    return;
                }


                /* DELETE */

                if (action === "delete") {

                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this report?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    reports.splice(
                        reportIndex,
                        1
                    );


                    saveReports(reports);


                    addActivity(

                        "deleted",

                        "Report Deleted",

                        `${report.category || "Community"} report ${report.id || ""} was removed.`

                    );


                    renderReports();
                }

            }
        );
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (adminSearch) {

        adminSearch.addEventListener(
            "input",
            renderReports
        );
    }


    /* =====================================================
       FILTERS
    ===================================================== */

    if (adminCategoryFilter) {

        adminCategoryFilter.addEventListener(
            "change",
            renderReports
        );
    }


    if (adminStatusFilter) {

        adminStatusFilter.addEventListener(
            "change",
            renderReports
        );
    }


    if (adminSeverityFilter) {

        adminSeverityFilter.addEventListener(
            "change",
            renderReports
        );
    }


    /* =====================================================
       RESET FILTERS
    ===================================================== */

    if (adminResetFilters) {

        adminResetFilters.addEventListener(
            "click",
            () => {

                if (adminSearch) {
                    adminSearch.value = "";
                }

                if (adminCategoryFilter) {
                    adminCategoryFilter.value = "all";
                }

                if (adminStatusFilter) {
                    adminStatusFilter.value = "all";
                }

                if (adminSeverityFilter) {
                    adminSeverityFilter.value = "all";
                }

                renderReports();
            }
        );
    }


    /* =====================================================
       REFRESH
    ===================================================== */

    if (refreshReports) {

        refreshReports.addEventListener(
            "click",
            () => {

                renderReports();

            }
        );
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (adminLogout) {

        adminLogout.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    "fixnearAdminLoggedIn"
                );


                window.location.href =
                    "admin-login.html";
            }
        );
    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    renderReports();

});