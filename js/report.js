// ========================================
// FIXNEAR - REPORT ISSUE
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("reportForm");
    const photoInput = document.getElementById("issuePhoto");
    const imagePreview = document.getElementById("imagePreview");

    const locationButton = document.getElementById("locationButton");
    const locationInput = document.getElementById("location");
    const locationMessage = document.getElementById("locationMessage");

    let photoData = "";
    let selectedLatitude = null;
    let selectedLongitude = null;


    // ========================================
    // PHOTO PREVIEW
    // ========================================

    if (photoInput) {

        photoInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) {
                photoData = "";

                if (imagePreview) {
                    imagePreview.src = "";
                    imagePreview.style.display = "none";
                }

                return;
            }

            if (!file.type.startsWith("image/")) {

                alert("Please select a valid image file.");

                this.value = "";

                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                photoData = event.target.result;

                if (imagePreview) {

                    imagePreview.src = photoData;
                    imagePreview.style.display = "block";

                }

            };

            reader.readAsDataURL(file);

        });

    }


    // ========================================
    // CURRENT LOCATION
    // ========================================

    if (locationButton) {

        locationButton.addEventListener("click", function () {

            if (!navigator.geolocation) {

                if (locationMessage) {
                    locationMessage.textContent =
                        "Geolocation is not supported by your browser.";
                }

                return;
            }

            if (locationMessage) {
                locationMessage.textContent =
                    "Getting your location...";
            }

            locationButton.disabled = true;

            navigator.geolocation.getCurrentPosition(

                function (position) {

                    selectedLatitude =
                        position.coords.latitude;

                    selectedLongitude =
                        position.coords.longitude;

                    if (locationInput) {

                        locationInput.value =
                            `Latitude: ${selectedLatitude.toFixed(6)}, Longitude: ${selectedLongitude.toFixed(6)}`;

                    }

                    if (locationMessage) {

                        locationMessage.textContent =
                            "✓ Location detected successfully.";

                    }

                    locationButton.disabled = false;

                },

                function (error) {

                    console.error(
                        "Location error:",
                        error
                    );

                    if (locationMessage) {

                        locationMessage.textContent =
                            "Unable to get location. Please enter it manually.";

                    }

                    locationButton.disabled = false;

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }

            );

        });

    }


    // ========================================
    // SUBMIT REPORT
    // ========================================

    if (form) {

        form.addEventListener("submit", function (event) {

            event.preventDefault();


            // --------------------------------
            // CATEGORY
            // --------------------------------

            const categoryElement =
                document.querySelector(
                    'input[name="category"]:checked'
                );

            if (!categoryElement) {

                alert("Please select an issue category.");

                return;
            }

            const category =
                categoryElement.value;


            // --------------------------------
            // DESCRIPTION
            // --------------------------------

            const descriptionElement =
                document.getElementById("description");

            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";

            if (!description) {

                alert("Please enter a description.");

                return;
            }


            // --------------------------------
            // LOCATION
            // --------------------------------

            const location =
                locationInput
                    ? locationInput.value.trim()
                    : "";

            if (!location) {

                alert(
                    "Please enter the location or use current location."
                );

                return;
            }


            // --------------------------------
            // SEVERITY
            // --------------------------------

            const severityElement =
                document.querySelector(
                    'input[name="severity"]:checked'
                );

            if (!severityElement) {

                alert("Please select the severity.");

                return;
            }

            const severity =
                severityElement.value;


            // --------------------------------
            // CREATE REPORT
            // --------------------------------

            const report = {

                id: generateReportId(),

                category: category,

                description: description,

                location: location,

                severity: severity,

                priority: calculatePriority(severity),

                status: "Submitted",

                date: new Date().toLocaleDateString(),

                timestamp: new Date().toISOString(),

                latitude: selectedLatitude,

                longitude: selectedLongitude,

                photo: photoData

            };


            // --------------------------------
            // GET EXISTING REPORTS
            // --------------------------------

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

                reports = [];

            }


            // --------------------------------
            // ADD NEW REPORT
            // --------------------------------

            reports.push(report);


            // --------------------------------
            // SAVE REPORT
            // --------------------------------

            try {

                localStorage.setItem(
                    "fixnearReports",
                    JSON.stringify(reports)
                );
                console.log("REPORT SAVED:", reports);

            } catch (error) {

                console.error(
                    "Error saving report:",
                    error
                );

                alert(
                    "Unable to save the report. Try using a smaller image."
                );

                return;
            }


            // --------------------------------
            // SUCCESS
            // --------------------------------

            alert(
                "✅ Report submitted successfully!"
            );


            // --------------------------------
            // RESET
            // --------------------------------

            form.reset();

            photoData = "";

            selectedLatitude = null;

            selectedLongitude = null;


            if (imagePreview) {

                imagePreview.src = "";

                imagePreview.style.display = "none";

            }


            if (locationMessage) {

                locationMessage.textContent = "";

            }


            // --------------------------------
            // GO TO MY REPORTS
            // --------------------------------

            window.location.href =
                "my-reports.html";

        });

    }

});


// ========================================
// GENERATE REPORT ID
// ========================================

function generateReportId() {

    const timestamp =
        Date.now().toString().slice(-6);

    const random =
        Math.floor(
            100 + Math.random() * 900
        );

    return "FN-" + timestamp + random;
}


// ========================================
// CALCULATE PRIORITY
// ========================================

function calculatePriority(severity) {

    switch (severity) {

        case "High":
            return 90;

        case "Medium":
            return 60;

        case "Low":
            return 30;

        default:
            return 0;

    }

}


// ========================================
// SMART CATEGORY DETECTION
// ========================================

function detectCategory(description) {

    const text =
        String(description || "").toLowerCase();


    if (
        text.includes("pothole") ||
        text.includes("road pit") ||
        text.includes("road hole")
    ) {

        return "Pothole";

    }


    if (
        text.includes("streetlight") ||
        text.includes("street light") ||
        text.includes("lamp") ||
        text.includes("light not working")
    ) {

        return "Streetlight";

    }


    if (
        text.includes("garbage") ||
        text.includes("waste") ||
        text.includes("trash") ||
        text.includes("rubbish")
    ) {

        return "Garbage";

    }


    if (
        text.includes("water leak") ||
        text.includes("water leakage") ||
        text.includes("pipe leak") ||
        text.includes("leaking pipe")
    ) {

        return "Water Leakage";

    }


    if (
        text.includes("road damage") ||
        text.includes("broken road") ||
        text.includes("damaged road") ||
        text.includes("road crack")
    ) {

        return "Road Damage";

    }


    return "Other";

}