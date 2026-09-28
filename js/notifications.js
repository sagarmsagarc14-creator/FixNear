// ========================================
// FIXNEAR - NOTIFICATIONS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const notificationsContainer =
        document.getElementById("notificationsContainer");

    const emptyNotifications =
        document.getElementById("emptyNotifications");

    const notificationCount =
        document.getElementById("notificationCount");

    const unreadCount =
        document.getElementById("unreadCount");

    const markAllRead =
        document.getElementById("markAllRead");

    const clearNotifications =
        document.getElementById("clearNotifications");


    // ========================================
    // GET REPORTS
    // ========================================

    let reports = getStorage("fixnearReports");


    // ========================================
    // GET NOTIFICATIONS
    // ========================================

    let notifications =
        getStorage("fixnearNotifications");


    // ========================================
    // CREATE / UPDATE NOTIFICATIONS
    // ========================================

    reports.forEach(function (report) {

        const reportId =
            report.id || "unknown";


        // ------------------------------------
        // SUBMITTED NOTIFICATION
        // ------------------------------------

        createNotification(
            report,
            "Submitted",
            "📋",
            "Report Submitted",
            `Your ${report.category || "issue"} report has been submitted successfully.`,
            report.timestamp
        );


        // ------------------------------------
        // UNDER REVIEW
        // ------------------------------------

        if (report.status === "Under Review") {

            createNotification(
                report,
                "Under Review",
                "🔍",
                "Report Under Review",
                `Your ${report.category || "issue"} report is now under review.`,
                report.updatedAt
            );

        }


        // ------------------------------------
        // IN PROGRESS
        // ------------------------------------

        if (report.status === "In Progress") {

            createNotification(
                report,
                "In Progress",
                "🔧",
                "Work Started",
                `Work has started on your ${report.category || "issue"} report.`,
                report.updatedAt
            );

        }


        // ------------------------------------
        // RESOLVED
        // ------------------------------------

        if (report.status === "Resolved") {

            createNotification(
                report,
                "Resolved",
                "✅",
                "Issue Resolved",
                `Your ${report.category || "issue"} report has been resolved.`,
                report.updatedAt
            );

        }

    });


    // ========================================
    // SAVE
    // ========================================

    saveNotifications();


    // ========================================
    // DISPLAY
    // ========================================

    displayNotifications();


    // ========================================
    // MARK ALL READ
    // ========================================

    if (markAllRead) {

        markAllRead.addEventListener(
            "click",
            function () {

                notifications.forEach(
                    function (notification) {

                        notification.read = true;

                    }
                );


                saveNotifications();

                displayNotifications();

            }
        );

    }


    // ========================================
    // CLEAR ALL
    // ========================================

    if (clearNotifications) {

        clearNotifications.addEventListener(
            "click",
            function () {

                if (notifications.length === 0) {

                    alert(
                        "There are no notifications to clear."
                    );

                    return;

                }


                const confirmClear =
                    confirm(
                        "Are you sure you want to clear all notifications?"
                    );


                if (!confirmClear) {
                    return;
                }


                notifications = [];


                saveNotifications();

                displayNotifications();


                alert(
                    "✅ All notifications cleared."
                );

            }
        );

    }


    // ========================================
    // CREATE NOTIFICATION
    // ========================================

    function createNotification(
        report,
        status,
        icon,
        title,
        message,
        date
    ) {

        const reportId =
            report.id || "unknown";


        // Unique key for report + status

        const notificationKey =
            reportId + "_" + status;


        const exists =
            notifications.some(
                function (notification) {

                    return (
                        notification.key ===
                        notificationKey
                    );

                }
            );


        if (exists) {
            return;
        }


        notifications.push({

            id:
                "NOT-" +
                Date.now() +
                Math.floor(
                    Math.random() * 1000
                ),

            key:
                notificationKey,

            reportId:
                reportId,

            title:
                title,

            message:
                message,

            icon:
                icon,

            date:
                date ||
                new Date().toISOString(),

            read:
                false

        });

    }


    // ========================================
    // DISPLAY NOTIFICATIONS
    // ========================================

    function displayNotifications() {

        if (!notificationsContainer) {
            return;
        }


        notificationsContainer.innerHTML = "";


        // Newest first

        const sortedNotifications =
            notifications
                .slice()
                .sort(function (a, b) {

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );

                });


        // ------------------------------------
        // TOTAL COUNT
        // ------------------------------------

        if (notificationCount) {

            notificationCount.textContent =
                notifications.length +
                (
                    notifications.length === 1
                        ? " Notification"
                        : " Notifications"
                );

        }


        // ------------------------------------
        // UNREAD COUNT
        // ------------------------------------

        const unread =
            notifications.filter(
                function (notification) {

                    return !notification.read;

                }
            ).length;


        if (unreadCount) {

            unreadCount.textContent =
                unread +
                (
                    unread === 1
                        ? " unread"
                        : " unread"
                );

        }


        // ------------------------------------
        // EMPTY
        // ------------------------------------

        if (notifications.length === 0) {

            if (emptyNotifications) {

                emptyNotifications.style.display =
                    "block";

            }

            return;

        }


        if (emptyNotifications) {

            emptyNotifications.style.display =
                "none";

        }


        // ------------------------------------
        // CREATE CARDS
        // ------------------------------------

        sortedNotifications.forEach(
            function (notification) {

                const card =
                    document.createElement("div");


                card.className =
                    "notification-card";


                if (!notification.read) {

                    card.classList.add("unread");

                }


                const title =
                    escapeHTML(
                        notification.title
                    );


                const message =
                    escapeHTML(
                        notification.message
                    );


                const time =
                    formatDate(
                        notification.date
                    );


                card.innerHTML = `

                    <div class="notification-icon">

                        ${notification.icon || "🔔"}

                    </div>


                    <div class="notification-content">

                        <h3>
                            ${title}
                        </h3>

                        <p>
                            ${message}
                        </p>

                        <span class="notification-time">

                            ${time}

                        </span>

                    </div>


                    <div class="notification-actions">

                        ${
                            !notification.read
                            ? `
                                <button
                                    class="notification-read-button"
                                    type="button">

                                    ✓ Mark Read

                                </button>
                              `
                            : `
                                <span
                                    class="notification-read-button">

                                    ✓ Read

                                </span>
                              `
                        }

                    </div>

                `;


                // --------------------------------
                // MARK ONE AS READ
                // --------------------------------

                const readButton =
                    card.querySelector(
                        ".notification-read-button"
                    );


                if (
                    readButton &&
                    !notification.read &&
                    readButton.tagName === "BUTTON"
                ) {

                    readButton.addEventListener(
                        "click",
                        function () {

                            notification.read = true;


                            saveNotifications();

                            displayNotifications();

                        }
                    );

                }


                notificationsContainer.appendChild(
                    card
                );

            }
        );

    }


    // ========================================
    // SAVE NOTIFICATIONS
    // ========================================

    function saveNotifications() {

        try {

            localStorage.setItem(
                "fixnearNotifications",
                JSON.stringify(notifications)
            );

        } catch (error) {

            console.error(
                "Unable to save notifications:",
                error
            );

        }

    }


    // ========================================
    // GET LOCAL STORAGE
    // ========================================

    function getStorage(key) {

        try {

            const data =
                localStorage.getItem(key);


            if (!data) {
                return [];
            }


            const parsed =
                JSON.parse(data);


            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "Storage error:",
                error
            );

            return [];

        }

    }


    // ========================================
    // FORMAT DATE
    // ========================================

    function formatDate(date) {

        if (!date) {
            return "Recently";
        }


        const notificationDate =
            new Date(date);


        if (
            isNaN(
                notificationDate.getTime()
            )
        ) {

            return "Recently";

        }


        return notificationDate.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

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