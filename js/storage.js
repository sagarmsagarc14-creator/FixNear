// ========================================
// FIXNEAR - STORAGE
// ========================================

const STORAGE_KEY = "fixnearReports";

// Get all reports
function getReports() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];
    } catch (error) {
        console.error("Storage error:", error);
        return [];
    }
}

// Save reports
function saveReports(reports) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
    );
}

// Add a report
function addReport(report) {
    const reports = getReports();

    reports.push(report);

    saveReports(reports);
}

// Make functions available
console.log("FixNear storage.js loaded");