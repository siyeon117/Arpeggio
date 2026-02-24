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

// SAFE STACK CAROUSEL
if (posters.length > 0 && carousel) {
    let current = 0;
    let startX = 0;
    let dragOffset = 0;
    let isDragging = false;

    const updateCarousel = (drag = 0) => {
        const dragRatio = drag / carousel.offsetWidth;
        const dragOffsetIndex = dragRatio * 1.5;

        posters.forEach((poster, index) => {
            let offset = index - current - dragOffsetIndex;

            // 순환 처리
            if (offset > posters.length / 2) offset -= posters.length;
            if (offset < -posters.length / 2) offset += posters.length;

            const absOffset = Math.abs(offset);

            // 3장 이상 멀어지면 숨김
            if (absOffset > 3) {
                poster.style.opacity = "0";
                return;
            }

            const translateX = offset * 85;
            const translateZ = -absOffset * 10;
            const scale = 1 - absOffset * 0.15;

            poster.style.transform =
                `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`;

            poster.style.zIndex = 100 - Math.round(absOffset);
            poster.style.opacity = "1";

            // blur 효과 계산
            let blur = 0;

            if (absOffset === 1) blur = 2;
            else if (absOffset === 2) blur = 4;
            else if (absOffset >= 3) blur = 6;

            poster.style.filter = `blur(${blur}px)`;
        });
    };

    const moveSlides = (count) => {
        current = (current + count + posters.length) % posters.length;
        updateCarousel();
    };

    carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carousel.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        dragOffset = e.touches[0].clientX - startX;
        updateCarousel(dragOffset);
    });

    carousel.addEventListener("touchend", () => {
        isDragging = false;

        const threshold = carousel.offsetWidth * 0.2;
        const move = Math.round(dragOffset / threshold);

        if (move !== 0) {
            moveSlides(-move);
        } else {
            updateCarousel();
        }

        dragOffset = 0;
    });

    updateCarousel();
}
