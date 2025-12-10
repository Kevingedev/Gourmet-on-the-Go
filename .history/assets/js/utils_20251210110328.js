const viewport = document.querySelector('.section-productos-destacados__viewport');
const track = document.querySelector('#featured-products-loader');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Only add event listeners if elements exist
if (prevBtn && nextBtn && viewport && track) {
    function getCardWidth() {
        const card = track.querySelector('.section-productos-destacados__item');
        if (!card) return viewport.clientWidth;
        const style = window.getComputedStyle(card);
        const gap = parseFloat(style.marginRight) || 24; // fallback
        return card.offsetWidth + gap;
    }

    prevBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.carousel__slide');
    let current = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    setInterval(function () {
        current = (current + 1) % slides.length;
        showSlide(current);
    }, 5000); // 1000 ms = 1 segundo
});