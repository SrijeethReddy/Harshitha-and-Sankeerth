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

// Firebase initialization
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

// Use the global Firebase instance
const app = window.firebase.app;
const database = window.firebase.database;

// Form validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const events = document.querySelectorAll('input[name^="event"]:checked');
    
    if (!name) {
        alert('Please enter your name');
        return false;
    }
    
    if (!email) {
        alert('Please enter your email');
        return false;
    }
    
    if (events.length === 0) {
        alert('Please select at least one event');
        return false;
    }
    
    return true;
}

// Form submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        events: {}
    };
    
    // Collect event attendance
    document.querySelectorAll('input[name^="event"]').forEach(input => {
        const eventName = input.name;
        formData.events[eventName] = input.checked;
    });
    
    // Collect guest information
    document.querySelectorAll('input[name^="guest"]').forEach(input => {
        const guestNumber = input.name.match(/\d+/)[0];
        if (!formData.guests) {
            formData.guests = {};
        }
        if (!formData.guests[guestNumber]) {
            formData.guests[guestNumber] = {};
        }
        formData.guests[guestNumber][input.name.split('_')[1]] = input.value.trim();
    });
    
    // Push data to Firebase
    const rsvpRef = database.ref('rsvps');
    rsvpRef.push(formData)
        .then(() => {
            alert('Thank you for your RSVP! We look forward to celebrating with you.');
            document.getElementById('rsvpForm').reset();
        })
        .catch(error => {
            console.error('Error submitting RSVP:', error);
            alert('There was an error submitting your RSVP. Please try again later.');
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

        // Prevent guest count changes when event is declined
        guestsInput.addEventListener('input', (e) => {
            if (attendanceSelect.value === 'no') {
                e.target.value = '0';
                return;
            }
            
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 0) {
                e.target.value = '0';
            } else if (value > 10) {
                e.target.value = '10';
            }
        });

        // Add validation on blur
        guestsInput.addEventListener('blur', (e) => {
            if (attendanceSelect.value === 'no') {
                e.target.value = '0';
                return;
            }
            
            if (!e.target.value) {
                e.target.value = '1';
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