// Carousel Auto-rotation
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const carouselDelay = 9000; // ms between auto-rotations

function showSlide(n) {
    if (slides.length === 0) return;

    // Clear active state from all slides
    slides.forEach(s => s.classList.remove('active'));

    // Reset dots appearance if dots exist
    if (dots.length) {
        dots.forEach(d => d.classList.remove('opacity-100'));
        dots.forEach(d => d.classList.add('opacity-50'));
    }

    // Normalize index and activate the requested slide
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');

    // Highlight corresponding dot
    if (dots.length && dots[currentSlide]) {
        dots[currentSlide].classList.remove('opacity-50');
        dots[currentSlide].classList.add('opacity-100');
    }

}

function nextSlide() {
    showSlide(currentSlide + 1);
}
function goToSlide(n) {
    showSlide(n);
}
// Auto-rotate
let carouselInterval = setInterval(nextSlide, carouselDelay);
// Initialize first slide/dot
showSlide(0);

// If dots are present, add click handlers to navigate and reset interval
if (dots.length) {
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, carouselDelay);
        });
    });
}

// Pause auto-rotation when user hovers the hero header
const headerEl = document.querySelector('header');
if (headerEl) {
    headerEl.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    headerEl.addEventListener('mouseleave', () => {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, carouselDelay);
    });
}

// Toggle card details
function toggleCard(cardId) {
    const card = document.getElementById('card-' + cardId);
    const allCards = document.querySelectorAll('[id^="card-"]');
    // Close all other cards
    allCards.forEach(c => {
        if (c.id !== 'card-' + cardId) {
            c.classList.add('hidden');
        }
    });

    if (!card) return;

    // Toggle current card
    card.classList.toggle('hidden');

    // Scroll to card if opening
    if (!card.classList.contains('hidden')) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
