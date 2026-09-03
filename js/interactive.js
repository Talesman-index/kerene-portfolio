/* ==========================================================================
   INTERACTIVE & MOTION EXPERIENCES — PORTFOLIO KÉRÈNE OROU ZIME
   Built following Emil Kowalski's Design Engineering & Apple Motion Standards
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initActivesFilter();
  initHolisticFactors();
  initScrollReveals();
  init3DCardTilts();
  initSparkleInteractions();
  initAnimatedCounters();
});

/**
 * Interactive Before / After Split Slider
 * High performance hardware-accelerated clipping
 */
function initBeforeAfterSlider() {
  const container = document.getElementById('skin-comparison');
  if (!container) return;

  const overlay = container.querySelector('.comparison-overlay');
  const handle = container.querySelector('.comparison-handle');
  if (!overlay || !handle) return;

  let isDragging = false;

  function updateSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let positionX = x - rect.left;
    positionX = Math.max(0, Math.min(positionX, rect.width));

    const percentage = (positionX / rect.width) * 100;
    const clipPercentage = 100 - percentage;

    overlay.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
    handle.style.left = `${percentage}%`;
  }

  function onPointerDown(e) {
    isDragging = true;
    updateSliderPosition(e.clientX || (e.touches && e.touches[0].clientX));
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    updateSliderPosition(e.clientX || (e.touches && e.touches[0].clientX));
  }

  function onPointerUp() {
    isDragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  container.addEventListener('pointerdown', onPointerDown);

  // Initial position at 50%
  overlay.style.clipPath = 'inset(0 50% 0 0)';
  handle.style.left = '50%';
}

/**
 * Filter for Active Ingredients Explorer (Page 6)
 */
function initActivesFilter() {
  const tabButtons = document.querySelectorAll('.active-tab-btn');
  const activeCards = document.querySelectorAll('.active-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      activeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 250ms cubic-bezier(0.23, 1, 0.32, 1) forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Holistic Factors Interactive Cards (Page 5)
 */
function initHolisticFactors() {
  const factorCards = document.querySelectorAll('.factor-card');
  factorCards.forEach(card => {
    card.addEventListener('click', () => {
      factorCards.forEach(c => c.classList.remove('active-factor'));
      card.classList.add('active-factor');
    });
  });
}

/**
 * IntersectionObserver Scroll Reveal & Stagger Animation
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(
    '.section-center-header, .section-intro-split > div, .transformation-split > div, .lumiere-card, .skill-card-column, .insight-card, .actives-table-wrapper, .appointment-banner'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-init');
    
    // Assign stagger classes for grid children
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('feature-cards-grid') || parent.classList.contains('skills-columns-grid') || parent.style.display === 'grid')) {
      const siblings = Array.from(parent.children);
      const itemIndex = (siblings.indexOf(el) % 7) + 1;
      el.classList.add(`stagger-${itemIndex}`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 3D Physics Tilt Effect on Desktop Card Hover
 */
function init3DCardTilts() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const tiltCards = document.querySelectorAll('.lumiere-card, .skill-card-column, .insight-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Interactive Sparkle Burst Particle Effect on Click
 */
function initSparkleInteractions() {
  const interactiveButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .trigger-contact-modal');

  interactiveButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      createSparkleBurst(e.clientX, e.clientY);
    });
  });
}

function createSparkleBurst(x, y) {
  if (!x || !y) return;
  const particleCount = 10;
  const colors = ['#D8E678', '#E6EFBE', '#D4AF37', '#18201C', '#2A4736'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';
    
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4);
    const distance = 35 + Math.random() * 45;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 700);
  }
}

/**
 * Animated Number Counter for Metrics on Scroll
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1200;
        const stepTime = 20;
        const step = target / (duration / stepTime);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.innerText = target;
            clearInterval(timer);
          } else {
            el.innerText = Math.floor(current);
          }
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

