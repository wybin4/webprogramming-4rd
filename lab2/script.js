const headerNavItems = document.querySelectorAll(".header-nav li a");
const currentUrl = window.location.href;

headerNavItems.forEach(link => {
    link.addEventListener("click", (event) => {
        headerNavItems.forEach(item => {
            item.style.color = "var(--white-transparent-color)";
        });

        event.target.style.color = "white";
    });

    if (link.href === currentUrl) {
        link.style.color = "white";
    } else {
        link.style.color = "var(--white-transparent-color)";
    }
});


const topButton = document.getElementById("top");

topButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

$('#carouselExampleIndicators').on('slide.bs.carousel', function () {
    $(this).carousel('pause');
});

const buttons = document.querySelectorAll('.section-card-button');
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const headerText = event.target.dataset.cardHeader;
        const bodyText = "...";

        document.querySelector('#infoModalLabel').textContent = headerText;
        document.querySelector('#infoModal .modal-body').textContent = bodyText;
    });
});