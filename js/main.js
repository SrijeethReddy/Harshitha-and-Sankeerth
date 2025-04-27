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

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9Ou9CJCkbm32of11uIXa4kRw1Kyp8JNU",
    authDomain: "harshithasankeerth-c9df5.firebaseapp.com",
    databaseURL: "https://harshithasankeerth-c9df5-default-rtdb.firebaseio.com",
    projectId: "harshithasankeerth-c9df5",
    storageBucket: "harshithasankeerth-c9df5.firebasestorage.app",
    messagingSenderId: "706915122780",
    appId: "1:706915122780:web:b70b1549257d36b8597099",
    measurementId: "G-Z5YPFN75Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Form validation function
function validateForm(formData) {
    const errors = [];
    
    // Validate name
    if (!formData.name.trim()) {
        errors.push('Please enter your name');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate at least one event is selected
    const hasSelectedEvent = Object.values(formData.events).some(event => event.attendance === 'yes');
    if (!hasSelectedEvent) {
        errors.push('Please select at least one event to attend');
    }
    
    return errors;
}

// Form submission handler
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        events: {
            haldi: {
                attendance: document.getElementById('haldi_attendance').value,
                guests: document.getElementById('haldi_guests').value || '0'
            },
            cocktail: {
                attendance: document.getElementById('cocktail_attendance').value,
                guests: document.getElementById('cocktail_guests').value || '0'
            },
            mehendi: {
                attendance: document.getElementById('mehendi_attendance').value,
                guests: document.getElementById('mehendi_guests').value || '0'
            },
            bridegroom: {
                attendance: document.getElementById('bridegroom_attendance').value,
                guests: document.getElementById('bridegroom_guests').value || '0'
            },
            wedding: {
                attendance: document.getElementById('wedding_attendance').value,
                guests: document.getElementById('wedding_guests').value || '0'
            }
        },
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Validate form data
    const errors = validateForm(formData);
    if (errors.length > 0) {
        // Show error messages
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        this.insertBefore(errorDiv, this.firstChild);
        
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
        return;
    }

    console.log('Submitting form data:', formData);

    // Push data to Firebase
    const rsvpRef = ref(database, 'rsvps');
    push(rsvpRef, formData)
        .then(() => {
            console.log('RSVP successfully saved to Firebase');
            // Show success message
            const formContainer = document.querySelector('.rsvp-form');
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your RSVP!</h3>
                    <p>We've received your responses for each event.</p>
                    <div class="success-details">
                        <p>We'll send the event details to your email address.</p>
                        <button onclick="location.reload()" class="btn-submit">
                            <span>Submit Another Response</span>
                        </button>
                    </div>
                </div>
            `;
        })
        .catch((error) => {
            console.error('Error saving RSVP:', error);
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-error';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Sorry, there was an error submitting your RSVP: ${error.message}</p>
                <p>Please try again or contact us directly.</p>
            `;
            this.insertBefore(errorDiv, this.firstChild);
            
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        });
});

// Handle guest input fields for each event
const events = ['haldi', 'cocktail', 'mehendi', 'bridegroom', 'wedding'];
events.forEach(event => {
    const attendanceSelect = document.getElementById(`${event}_attendance`);
    const guestsInput = document.getElementById(`${event}_guests`);

    if (attendanceSelect && guestsInput) {
        // Set initial state
        if (attendanceSelect.value === 'no') {
            guestsInput.value = '0';
            guestsInput.disabled = true;
        }

        attendanceSelect.addEventListener('change', () => {
            if (attendanceSelect.value === 'no') {
                guestsInput.value = '0';
                guestsInput.disabled = true;
            } else {
                guestsInput.disabled = false;
                if (!guestsInput.value || guestsInput.value === '0') {
                    guestsInput.value = '1';
                }
            }
        });

        guestsInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 0) {
                e.target.value = '0';
            } else if (value > 10) {
                e.target.value = '10';
            }
        });

        // Add validation on blur
        guestsInput.addEventListener('blur', (e) => {
            if (!e.target.value) {
                e.target.value = '0';
            }
        });
    }
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