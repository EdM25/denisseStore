// Banner
document.addEventListener("DOMContentLoaded", function () { 
    const banner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("accept-cookies");

    if(!localStorage.getItem("cookiesAccepted")) {
        banner.classList.remove("hidden");
    }

    acceptButton.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "true");
        banner.classList.add("hidden");
    });
});