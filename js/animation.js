document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in");

    elements.forEach(el => {
        el.classList.add("opacity-0", "translate-y-4");
    });

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.remove("opacity-0", "translate-y-4");
                el.classList.add("opacity-100", "translate-y-0", "transition-all", "duration-700");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});
