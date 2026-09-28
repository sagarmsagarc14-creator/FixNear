// FixNear main JavaScript

console.log("FixNear is running!");


// Mobile menu

const menuButton = document.getElementById("menuButton");

const navLinks = document.querySelector(".nav-links");

if (menuButton) {

    menuButton.addEventListener("click", function () {

        if (navLinks.style.display === "flex") {

            navLinks.style.display = "none";

        } else {

            navLinks.style.display = "flex";

            navLinks.style.flexDirection = "column";

            navLinks.style.position = "absolute";

            navLinks.style.top = "65px";

            navLinks.style.left = "0";

            navLinks.style.width = "100%";

            navLinks.style.background = "white";

            navLinks.style.padding = "20px";

            navLinks.style.borderBottom = "1px solid #e5e7eb";
        }

    });

}