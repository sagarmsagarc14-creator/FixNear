// ========================================
// FIXNEAR - USER DASHBOARD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------
    // GET REPORTS
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
            "Error loading reports:",
            error
        );

        reports = [];

    }


    // ------------------------------------
    // STATISTICS
    // ------------------------------------

    const total =
        reports.length;


    const submitted =
        reports.filter(function (report) {

            return report.status === "Submitted";

        }).length;


    const progress =
        reports.filter(function (report) {

            return (
                report.status === "In Progress" ||
                report.status === "Under Review"
            );

        }).length;


    const resolved =
        reports.filter(function (report) {

            return report.status === "Resolved";

        }).length;


    setText(
        "totalReports",
        total
    );


    setText(
        "submittedReports",
        submitted
    );


    setText(
        "progressReports",
        progress
    );


    setText(
        "resolvedReports",
        resolved
    );



    // ------------------------------------
    // RECENT REPORTS
    // ------------------------------------

    const recentContainer =
        document.getElementById(
            "recentReports"
        );


    const emptyContainer =
        document.getElementById(
            "noRecentReports"
        );


    if (reports.length === 0) {

        recentContainer.innerHTML = "";

        emptyContainer.style.display =
            "block";

    } else {

        emptyContainer.style.display =
            "none";


        const recentReports =
            reports.slice()
                   .reverse()
                   .slice(0, 5);


        recentContainer.innerHTML = "";


        recentReports.forEach(
            function (report) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "recent-report";


                const icon =
                    getCategoryIcon(
                        report.category
                    );


                const category =
                    escapeHTML(
                        report.category ||
                        "Other"
                    );


                const description =
                    escapeHTML(
                        report.description ||
                        "No description"
                    );


                const status =
                    escapeHTML(
                        report.status ||
                        "Submitted"
                    );


                item.innerHTML = `

                    <div class="recent-icon">
                        ${icon}
                    </div>

                    <div class="recent-content">

                        <strong>
                            ${category}
                        </strong>

                        <p>
                            ${description}
                        </p>

                    </div>

                    <span class="recent-status">
                        ${status}
                    </span>

                `;


                recentContainer.appendChild(
                    item
                );

            }
        );

    }



    // ------------------------------------
    // CATEGORY COUNTS
    // ------------------------------------

    const categories = {

        Pothole: {
            count: 0,
            bar: "potholeBar",
            text: "potholeCount"
        },

        Streetlight: {
            count: 0,
            bar: "streetlightBar",
            text: "streetlightCount"
        },

        Garbage: {
            count: 0,
            bar: "garbageBar",
            text: "garbageCount"
        },

        "Water Leakage": {
            count: 0,
            bar: "waterBar",
            text: "waterCount"
        },

        "Road Damage": {
            count: 0,
            bar: "roadBar",
            text: "roadCount"
        }

    };


    reports.forEach(function (report) {

        const category =
            report.category;


        if (
            categories[category]
        ) {

            categories[category].count++;

        }

    });


    let maxCount = 0;


    Object.keys(categories).forEach(
        function (category) {

            if (
                categories[category].count >
                maxCount
            ) {

                maxCount =
                    categories[category].count;

            }

        }
    );


    Object.keys(categories).forEach(
        function (category) {

            const data =
                categories[category];


            setText(
                data.text,
                data.count
            );


            let percentage = 0;


            if (maxCount > 0) {

                percentage =
                    (data.count / maxCount) * 100;

            }


            const bar =
                document.getElementById(
                    data.bar
                );


            if (bar) {

                bar.style.width =
                    percentage + "%";

            }

        }
    );



    // ------------------------------------
    // IMPACT SCORE
    // ------------------------------------

    let impactScore = 0;


    reports.forEach(function (report) {

        if (report.status === "Resolved") {

            impactScore += 25;

        } else if (
            report.status === "In Progress"
        ) {

            impactScore += 15;

        } else if (
            report.status === "Under Review"
        ) {

            impactScore += 10;

        } else {

            impactScore += 5;

        }

    });


    setText(
        "impactScore",
        impactScore
    );



    // ------------------------------------
    // IMPACT MESSAGE
    // ------------------------------------

    const impactMessage =
        document.getElementById(
            "impactMessage"
        );


    if (impactScore === 0) {

        impactMessage.textContent =
            "Start reporting local issues to make an impact.";

    } else if (impactScore < 50) {

        impactMessage.textContent =
            "Great start! Keep helping your community.";

    } else if (impactScore < 100) {

        impactMessage.textContent =
            "You're making a real contribution to your community!";

    } else {

        impactMessage.textContent =
            "Amazing work! Your reports are helping make your community better.";

    }

});



// ========================================
// HELPER FUNCTIONS
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
// SECURITY - ESCAPE TEXT
// ========================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}