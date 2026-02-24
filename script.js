// 요소 선택
const onBtn = document.getElementById("onBtn");
const offBtn = document.getElementById("offBtn");
const onSection = document.getElementById("onSection");
const offSection = document.getElementById("offSection");
const posters = document.querySelectorAll(".poster");
const carousel = document.querySelector(".carousel");

// 유틸 함수
const stopVideos = (section) => {
    if (!section) return;

    section.querySelectorAll("iframe").forEach((iframe) => {
        iframe.src = iframe.src;
    });
};

const toggleSection = (show, hide, activeBtn, inactiveBtn) => {
    if (!show || !hide) return;

    stopVideos(hide);

    show.style.display = "flex";
    hide.style.display = "none";

    activeBtn?.classList.add("active");
    inactiveBtn?.classList.remove("active");
};

// 버튼 이벤트
onBtn?.addEventListener("click", () => {
    toggleSection(onSection, offSection, onBtn, offBtn);
});

offBtn?.addEventListener("click", () => {
    toggleSection(offSection, onSection, offBtn, onBtn);
});

// 초기 상태
toggleSection(onSection, offSection, onBtn, offBtn);

// 포스터
if (posters.length > 0 && carousel) {

    let current = 0;
    let startX = 0;
    let dragOffset = 0;
    let isDragging = false;

    const CARD_WIDTH = 85;

    const updateCarousel = (drag = 0) => {

        const dragOffsetIndex = drag / CARD_WIDTH;

        posters.forEach((poster, index) => {
            let offset = index - current + dragOffsetIndex;

            if (offset > posters.length / 2) offset -= posters.length;
            if (offset < -posters.length / 2) offset += posters.length;

            const abs = Math.abs(offset);

            if (abs > 3) {
                poster.style.opacity = "0";
                return;
            }

            poster.style.transform =
                `translateX(${offset * CARD_WIDTH}px)
                translateZ(${-abs * 10}px)
                scale(${1 - abs * 0.15})`;

            poster.style.zIndex = 100 - Math.round(abs);
            poster.style.opacity = "1";
            poster.style.filter =
                abs === 1 ? "blur(2px)" :
                    abs === 2 ? "blur(4px)" :
                        abs >= 3 ? "blur(6px)" :
                            "blur(0px)";
        });
    };

    const moveSlides = (step) => {
        current = (current + step + posters.length) % posters.length;
        updateCarousel();
    };

    posters.forEach((poster, index) => {
        poster.addEventListener("click", () => {
            let diff = index - current;

            if (diff > posters.length / 2) diff -= posters.length;
            if (diff < -posters.length / 2) diff += posters.length;

            if (Math.abs(diff) === 1) {
                moveSlides(diff);
            }
        });
    });

    carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carousel.addEventListener("touchmove", (e) => {
        if (!isDragging) return;

        e.preventDefault();
        dragOffset = e.touches[0].clientX - startX;
        updateCarousel(dragOffset);
    }, { passive: false });

    carousel.addEventListener("touchend", () => {
        if (!isDragging) return;
        isDragging = false;

        const move = Math.round(dragOffset / CARD_WIDTH);

        if (move !== 0) {
            moveSlides(-move);
        } else {
            updateCarousel();
        }

        dragOffset = 0;
    });

    updateCarousel();
}