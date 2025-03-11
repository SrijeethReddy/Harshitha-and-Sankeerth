// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Mobile Navigation
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');
const nav = document.querySelector('nav');

mobileNavToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileNavToggle.querySelector('i').classList.toggle('fa-bars');
    mobileNavToggle.querySelector('i').classList.toggle('fa-times');
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileNavToggle.querySelector('i').classList.add('fa-bars');
        mobileNavToggle.querySelector('i').classList.remove('fa-times');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar color change on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('2024-12-31 00:00:00').getTime(); // Update with your wedding date
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelector('.days').textContent = days.toString().padStart(2, '0');
    document.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
    document.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
    document.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// GSAP Animations
gsap.from('.hero-content', {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power3.out'
});

// Animate sections on scroll
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGcgqBxbPGTjUXXqvKxAMGcgGHqS7xPjA",
    authDomain: "wedding-rsvp-d0d73.firebaseapp.com",
    databaseURL: "https://wedding-rsvp-d0d73-default-rtdb.firebaseio.com",
    projectId: "wedding-rsvp-d0d73",
    storageBucket: "wedding-rsvp-d0d73.appspot.com",
    messagingSenderId: "1098355717051",
    appId: "1:1098355717051:web:b8d89c6c569f1e4c6f7c7e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// RSVP Form Handling
const rsvpForm = document.getElementById('rsvpForm');

async function submitRSVP(formData) {
    try {
        // Generate a unique key for the RSVP
        const newRsvpRef = database.ref('rsvps').push();
        
        // Save the data
        await newRsvpRef.set({
            ...formData,
            submittedAt: firebase.database.ServerValue.TIMESTAMP
        });

        return { status: 'success' };
    } catch (error) {
        console.error('RSVP Submission Error:', error);
        throw new Error('Failed to save your RSVP. Please try again.');
    }
}

function showSuccessMessage(form) {
    form.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Thank you for your RSVP!</h3>
            <p>We've received your response and look forward to celebrating with you.</p>
            <div class="success-details">
                <p>We'll send updates to your email address.</p>
                <button onclick="location.reload()" class="btn-submit">
                    <span>Submit Another Response</span>
                </button>
            </div>
        </div>
    `;
}

function showErrorMessage(form, error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>Sorry, there was an error submitting your RSVP: ${error}</p>
        <p>Please try again or contact us directly.</p>
    `;
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Clear any existing error messages
    const existingError = rsvpForm.querySelector('.alert-error');
    if (existingError) {
        existingError.remove();
    }

    try {
        // Disable form and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        Array.from(rsvpForm.elements).forEach(element => {
            element.disabled = true;
        });

        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            attendance: document.getElementById('attendance').value,
            guests: document.getElementById('guests').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate form data
        if (!formData.name || !formData.email || !formData.attendance) {
            throw new Error('Please fill in all required fields');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Submit to Firebase
        await submitRSVP(formData);
        showSuccessMessage(rsvpForm);

    } catch (error) {
        console.error('Error:', error);
        
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        Array.from(rsvpForm.elements).forEach(element => {
            element.disabled = false;
        });

        // Show error message
        showErrorMessage(rsvpForm, error.message);
    }
});

// Add form validation
const guestInput = document.getElementById('guests');
const attendanceSelect = document.getElementById('attendance');

attendanceSelect.addEventListener('change', () => {
    if (attendanceSelect.value === 'no') {
        guestInput.value = '0';
        guestInput.disabled = true;
    } else {
        guestInput.disabled = false;
    }
});

guestInput.addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) e.target.value = 0;
    if (value > 10) e.target.value = 10; // Set maximum guests
});

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 50px 0px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        observer.unobserve(img);
    });
}, imageOptions);

images.forEach(img => imageObserver.observe(img)); 