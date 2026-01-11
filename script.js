// Carousel Auto-rotation
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const carouselDelay = 9000; // ms between auto-rotations

function showSlide(n) {
    if (slides.length === 0) return;

    // Clear active state from all slides
    slides.forEach(s => s.classList.remove('active'));

    // Normalize index and activate the requested slide
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function goToSlide(n) {
    showSlide(n);
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, carouselDelay);
}

// Auto-rotate
let carouselInterval = setInterval(nextSlide, carouselDelay);

// Initialize first slide
showSlide(0);

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
