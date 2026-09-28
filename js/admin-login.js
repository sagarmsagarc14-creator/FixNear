// ========================================
// FIXNEAR - ADMIN LOGIN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "adminLoginForm"
            );

        const username =
            document.getElementById(
                "adminUsername"
            );

        const password =
            document.getElementById(
                "adminPassword"
            );

        const message =
            document.getElementById(
                "loginMessage"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const enteredUsername =
                    username.value.trim();

                const enteredPassword =
                    password.value;


                // DEMO ADMIN LOGIN
                const adminUsername =
                    "admin";

                const adminPassword =
                    "admin123";


                if (
                    enteredUsername ===
                    adminUsername &&
                    enteredPassword ===
                    adminPassword
                ) {

                    localStorage.setItem(
                        "fixnearAdminLoggedIn",
                        "true"
                    );


                    message.textContent =
                        "✅ Login successful!";


                    message.className =
                        "login-message success";


                    setTimeout(
                        function () {

                            window.location.href =
                                "admin.html";

                        },
                        500
                    );

                } else {

                    message.textContent =
                        "❌ Invalid username or password.";

                    message.className =
                        "login-message error";

                    password.value = "";

                }

            }
        );

    }
);