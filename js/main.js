/* ====================================
   HIGHFIELD COUNTRY ESTATE
   Main JavaScript
   ==================================== */

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

// Header is static (scrolls with page, no fixed behavior)

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;

    if (elementTop < window.innerHeight * 0.9 && elementBottom > 0) {
      element.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on page load

// Accordion functionality
const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const content = trigger.nextElementSibling;
    const isActive = trigger.classList.contains('active');

    // Close all other accordions
    accordionTriggers.forEach(t => {
      if (t !== trigger) {
        t.classList.remove('active');
        const otherContent = t.nextElementSibling;
        otherContent.classList.remove('active');
      }
    });

    // Toggle current accordion
    trigger.classList.toggle('active');
    content.classList.toggle('active');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Stagger animation for grid cards
const staggerElements = document.querySelectorAll('.grid-card');
staggerElements.forEach((element, index) => {
  element.style.animationDelay = `${index * 0.1}s`;
});

// Form validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    const inputs = this.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (input.value.trim() === '') {
        input.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });

    if (isValid) {
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        background-color: #5D6B4F;
        color: white;
        padding: 1rem;
        margin-bottom: 2rem;
        border-radius: 2px;
        text-align: center;
      `;
      successMsg.textContent = 'Thank you! We will contact you shortly.';
      this.parentNode.insertBefore(successMsg, this);

      // Reset form
      this.reset();

      // Remove message after 5 seconds
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
    }
  });
}

console.log('Highfield Country Estate - Website Loaded');
