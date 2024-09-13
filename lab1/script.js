const linkMenuItems = document.querySelectorAll(".link-menu-item a");
const currentUrl = window.location.href;

linkMenuItems.forEach(link => {
    link.addEventListener("click", (event) => {
        linkMenuItems.forEach(item => {
            item.style.color = "var(--white-transparent)";
        });

        event.target.style.color = "white";
    });

    if (link.href === currentUrl) {
        link.style.color = "white";
    } else {
        link.style.color = "var(--white-transparent)";
    }
});
