// ============ MEMORIES DATA ============
// Fixed: Synced paths to use the 'images/' folder and numerical naming format (1.jpg, 2.jpg, etc.)
const memories = [
    {
        image: 'images/1.jpg',
        message: 'The first time I saw you, I knew my life was about to change forever. 💕'
    },
    {
        image: 'images/2.jpg',
        message: 'Every laugh we share makes me fall in love with you all over again. 😊'
    },
    {
        image: 'images/3.jpg',
        message: 'This moment... I wish I could live in it forever with you. ✨'
    },
    {
        image: 'images/4.jpg',
        message: 'You make ordinary days feel like the most beautiful adventures. 🌸'
    },
    {
        image: 'images/5.jpg',
        message: 'Being with you is my favorite place to be. Home is wherever you are. 🏠💗'
    },
    {
        image: 'images/6.jpg',
        message: 'Thank you for loving me, for choosing me, for being mine. I love you endlessly. ❤️'
    }
];

// ============ VARIABLES ============
let currentIndex = 0;
let isTransitioning = false;
let touchStartX = 0;
let touchEndX = 0;
let musicPlaying = false;

// ============ DOM ELEMENTS ============
const envelope = document.getElementById('envelope');
const intro = document.getElementById('intro');
const content = document.getElementById('content');
const slideImage = document.getElementById('slideImage');
const memoryMessage = document.getElementById('memoryMessage');
const progressDots = document.getElementById('progressDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bgMusic = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
const heartsContainer = document.getElementById('hearts');
// Fixed: Grabbed the music tracker that already exists in your HTML instead of creating a duplicate
const musicDisplay = document.getElementById('musicDisplay');

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    createProgressDots();
    createFloatingHearts();
    updateSlide(false);
    setupEventListeners();
    preloadImages();
});

// Preload all images for smooth transitions
function preloadImages() {
    memories.forEach(memory => {
        const img = new Image();
        img.src = memory.image;
    });
}

// ============ FLOATING HEARTS ============
function createFloatingHearts() {
    const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '✨', '🌸'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeart(hearts);
        }, i * 400);
    }
    
    setInterval(() => {
        createHeart(hearts);
    }, 800);
}

function createHeart(hearts) {
    if (!heartsContainer) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (6 + Math.random() * 4) + 's';
    heart.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 12000);
}

// ============ PROGRESS DOTS ============
function createProgressDots() {
    if (!progressDots) return;
    progressDots.innerHTML = '';
    memories.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        progressDots.appendChild(dot);
    });
}

function updateDots() {
    if (!progressDots) return;
    const dots = progressDots.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// ============ ENVELOPE ANIMATION & MUSIC REVEAL ============
function openLetter() {
    envelope.classList.add('open');
    envelope.classList.add('opened');
    playClickSound();
    
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            musicPlaying = true;
            soundToggle.textContent = '🔊';
            showMusicTitle();
        }).catch(error => {
            console.log("Autoplay context restriction caught: ", error);
        });
    }

    setTimeout(() => {
        intro.style.transition = "opacity 0.8s ease";
        intro.style.opacity = "0";
        
        setTimeout(() => {
            intro.classList.add('hidden');
            intro.style.display = "none";
            
            content.classList.add('visible');
            content.style.display = "block";
        }, 800);
    }, 2500);
}

function showMusicTitle() {
    if (!musicDisplay) return;
    musicDisplay.classList.add('show');
    setTimeout(() => {
        musicDisplay.classList.remove('show');
    }, 5000);
}

// ============ SLIDE NAVIGATION ============
function updateSlide(animate = true) {
    if (animate && isTransitioning) return;
    
    const memory = memories[currentIndex];
    
    if (animate) {
        isTransitioning = true;
        
        slideImage.classList.add('transitioning');
        memoryMessage.classList.add('transitioning');
        
        setTimeout(() => {
            slideImage.src = memory.image;
            memoryMessage.textContent = memory.message;
            
            setTimeout(() => {
                slideImage.classList.remove('transitioning');
                memoryMessage.classList.remove('transitioning');
                isTransitioning = false;
            }, 50);
        }, 400);
    } else {
        slideImage.src = memory.image;
        memoryMessage.textContent = memory.message;
    }
    
    updateDots();
}

function nextSlide() {
    if (isTransitioning) return;
    currentIndex = (currentIndex + 1) % memories.length;
    updateSlide();
    playClickSound();
}

function prevSlide() {
    if (isTransitioning) return;
    currentIndex = (currentIndex - 1 + memories.length) % memories.length;
    updateSlide();
    playClickSound();
}

function goToSlide(index) {
    if (isTransitioning || index === currentIndex) return;
    currentIndex = index;
    updateSlide();
    playClickSound();
}

// ============ SOUND EFFECTS ============
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Fallback for audio blockages
    }
}

function toggleSound() {
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        soundToggle.textContent = '🔇';
    } else {
        bgMusic.play().then(() => {
            musicPlaying = true;
            soundToggle.textContent = '🔊';
            showMusicTitle(); 
        }).catch(() => {});
    }
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    if (envelope) envelope.addEventListener('click', openLetter);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (soundToggle) soundToggle.addEventListener('click', toggleSound);
    
    document.addEventListener('keydown', (e) => {
        if (intro.classList.contains('hidden') || intro.style.display === "none") {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            openLetter();
        }
    });
    
    const memoryCard = document.getElementById('memoryCard');
    if (memoryCard) {
        memoryCard.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        memoryCard.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// ============ SPECIAL PAGE SLIDESHOW LOGIC ============
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the container and all the images inside it
    const slideshowContainer = document.getElementById('specialSlideshow');
    const slides = slideshowContainer.querySelectorAll('.slide');
    
    // Safety check: Don't run if there are no slides
    if (slides.length <= 1) return;

    let currentSlideIndex = 0;
    // Set the switch interval (5000 milliseconds = 5 seconds)
    const slideIntervalTime = 5000; 

    // 2. The function that switches the active slide
    function nextSlide() {  
        // Remove the 'active' class from the current image (hides it)
        slides[currentSlideIndex].classList.remove('active');

        // Calculate the index of the next image (loops back to 0 at the end)
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;

        // Add the 'active' class to the next image (shows it)
        slides[currentSlideIndex].classList.add('active');
    }

    // 3. Start the loop!
    // setInterval calls the 'nextSlide' function repeatedly at the set time.
    setInterval(nextSlide, slideIntervalTime);
});