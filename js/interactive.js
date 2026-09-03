/* ==========================================================================
   INTERACTIVE COMPONENTS — PORTFOLIO KÉRÈNE OROU ZIME
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initActivesFilter();
  initHolisticFactors();
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

  // Pointer events (works for mouse and touch seamlessly)
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
