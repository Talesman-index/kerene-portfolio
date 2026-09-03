/* ==========================================================================
   APP CONTROLLER — PORTFOLIO KÉRÈNE OROU ZIME
   Mode switching, Deck navigation, Progress & Keyboard controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    mode: 'scroll', // 'scroll' or 'slides'
    currentSlide: 1,
    totalSlides: 10
  };

  const sections = document.querySelectorAll('.page-section');
  const scrollProgress = document.getElementById('scroll-progress');
  const pageIndicator = document.getElementById('current-page-num');
  const deckCounter = document.getElementById('deck-counter');
  const modeScrollBtn = document.getElementById('btn-mode-scroll');
  const modeSlidesBtn = document.getElementById('btn-mode-slides');
  const modeScrollBtnMob = document.getElementById('btn-mode-scroll-mob');
  const modeSlidesBtnMob = document.getElementById('btn-mode-slides-mob');
  const btnPrevSlide = document.getElementById('btn-prev-slide');
  const btnNextSlide = document.getElementById('btn-next-slide');
  const floatingDots = document.querySelectorAll('.dot-nav-item');
  const contactModal = document.getElementById('contact-modal');

  // Disable browser scroll restoration so page refresh always starts cleanly at the top (Hero)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Initialize
  checkInitialHashOrStorage();
  initScrollSpy();
  initDeckNavigation();
  initContactModal();
  initMobileDrawer();
  initImageSwapManager();

  // Mode switching
  function setMode(mode, shouldScroll = false) {
    state.mode = mode;
    localStorage.setItem('kerene_portfolio_mode', mode);

    if (mode === 'slides') {
      document.body.classList.add('mode-slides');
      modeSlidesBtn?.classList.add('active');
      modeScrollBtn?.classList.remove('active');
      modeSlidesBtnMob?.classList.add('active');
      modeScrollBtnMob?.classList.remove('active');
      showSlide(state.currentSlide);
    } else {
      document.body.classList.remove('mode-slides');
      modeScrollBtn?.classList.add('active');
      modeSlidesBtn?.classList.remove('active');
      modeScrollBtnMob?.classList.add('active');
      modeSlidesBtnMob?.classList.remove('active');
      
      if (shouldScroll) {
        const targetSec = document.getElementById(`page-${state.currentSlide}`);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  modeScrollBtn?.addEventListener('click', () => setMode('scroll', true));
  modeSlidesBtn?.addEventListener('click', () => setMode('slides'));
  modeScrollBtnMob?.addEventListener('click', () => setMode('scroll', true));
  modeSlidesBtnMob?.addEventListener('click', () => setMode('slides'));

  function checkInitialHashOrStorage() {
    const savedMode = localStorage.getItem('kerene_portfolio_mode');
    
    // Always start at Hero (Page 1) on initial visit or refresh
    state.currentSlide = 1;

    if (savedMode === 'slides') {
      setMode('slides');
    } else {
      setMode('scroll', false);
      window.scrollTo(0, 0);
    }

    // Clean URL hash on initial load so reload doesn't trigger hash jumps
    if (window.location.hash && window.location.hash.startsWith('#page-')) {
      history.replaceState(null, null, window.location.pathname);
    }
  }

  // Slide navigation
  function showSlide(index) {
    if (index < 1) index = 1;
    if (index > state.totalSlides) index = state.totalSlides;

    state.currentSlide = index;

    sections.forEach((sec, idx) => {
      if (idx + 1 === index) {
        sec.classList.add('active-slide');
        sec.scrollTop = 0;
      } else {
        sec.classList.remove('active-slide');
      }
    });

    updateCounters(index);
    updateDots(index);
    history.replaceState(null, null, `#page-${index}`);
  }

  // Expose to window for global access
  window.showSlide = showSlide;
  window.setPortfolioMode = setMode;

  function updateCounters(index) {
    if (pageIndicator) pageIndicator.textContent = `${index} / ${state.totalSlides}`;
    if (deckCounter) deckCounter.textContent = `${index} / ${state.totalSlides}`;
  }

  function updateDots(index) {
    floatingDots.forEach((dot, idx) => {
      if (idx + 1 === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function initDeckNavigation() {
    btnPrevSlide?.addEventListener('click', () => showSlide(state.currentSlide - 1));
    btnNextSlide?.addEventListener('click', () => showSlide(state.currentSlide + 1));

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (contactModal && contactModal.classList.contains('open')) {
        if (e.key === 'Escape') closeContactModal();
        return;
      }

      if (state.mode === 'slides') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Space') {
          e.preventDefault();
          showSlide(state.currentSlide + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          showSlide(state.currentSlide - 1);
        }
      }
    });

    // Touch Swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (state.mode !== 'slides') return;
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left -> Next
          showSlide(state.currentSlide + 1);
        } else {
          // Swipe right -> Prev
          showSlide(state.currentSlide - 1);
        }
      }
    }
  }

  // Scrollspy for Scroll Mode
  function initScrollSpy() {
    window.addEventListener('scroll', () => {
      if (state.mode === 'slides') return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      if (scrollProgress) scrollProgress.style.width = `${scrollPercent}%`;

      const header = document.getElementById('site-header');
      if (scrollTop > 20) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      // Find current section in view
      sections.forEach((sec, idx) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
          const pageNum = idx + 1;
          state.currentSlide = pageNum;
          updateCounters(pageNum);
          updateDots(pageNum);
        }
      });
    }, { passive: true });

    // Floating dots click
    floatingDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const pageNum = idx + 1;
        if (state.mode === 'slides') {
          showSlide(pageNum);
        } else {
          const target = document.getElementById(`page-${pageNum}`);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Contact Modal
  function initContactModal() {
    const openBtns = document.querySelectorAll('.trigger-contact-modal');
    const closeBtns = document.querySelectorAll('.trigger-close-modal');

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      contactModal?.classList.add('open');
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeContactModal));

    contactModal?.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }

  function closeContactModal() {
    contactModal?.classList.remove('open');
  }

  // Print PDF helper
  window.printPortfolio = function() {
    window.print();
  };

  // Image Swap Helper for custom personal photos
  function initImageSwapManager() {
    const photoModal = document.getElementById('photo-modal');
    const openBtn = document.getElementById('btn-open-photo-manager');
    const closeBtns = document.querySelectorAll('.trigger-close-photo-modal');
    const resetBtn = document.getElementById('btn-reset-photos');
    const fileInputs = document.querySelectorAll('.custom-photo-input');

    openBtn?.addEventListener('click', () => {
      photoModal?.classList.add('open');
    });

    closeBtns.forEach(btn => btn.addEventListener('click', () => {
      photoModal?.classList.remove('open');
    }));

    photoModal?.addEventListener('click', (e) => {
      if (e.target === photoModal) photoModal.classList.remove('open');
    });

    // Load saved photos from localStorage
    const savedPhotos = JSON.parse(localStorage.getItem('kerene_custom_photos') || '{}');
    Object.keys(savedPhotos).forEach(id => {
      const el = document.getElementById(id);
      if (el && savedPhotos[id]) {
        el.src = savedPhotos[id];
      }
    });

    // Handle file input changes
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const targetId = input.getAttribute('data-target');
        if (!file || !targetId) return;

        const reader = new FileReader();
        reader.onload = function(event) {
          const base64 = event.target.result;
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.src = base64;
            const currentSaved = JSON.parse(localStorage.getItem('kerene_custom_photos') || '{}');
            currentSaved[targetId] = base64;
            localStorage.setItem('kerene_custom_photos', JSON.stringify(currentSaved));
          }
        };
        reader.readAsDataURL(file);
      });
    });

    // Reset to default
    resetBtn?.addEventListener('click', () => {
      localStorage.removeItem('kerene_custom_photos');
      const defaultMap = {
        'img-cover-portrait': 'assets/images/portrait_kerene.jpg',
        'img-skin-before': 'assets/images/skin_before.jpg',
        'img-skin-after': 'assets/images/skin_after.jpg'
      };
      Object.keys(defaultMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.src = defaultMap[id];
      });
      fileInputs.forEach(input => input.value = '');
      photoModal?.classList.remove('open');
    });
  }

  // Mobile Drawer Controller
  function initMobileDrawer() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openDrawer() {
      hamburgerBtn?.classList.add('is-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
      mobileDrawer?.classList.add('is-open');
      mobileDrawer?.setAttribute('aria-hidden', 'false');
      mobileBackdrop?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      hamburgerBtn?.classList.remove('is-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
      mobileDrawer?.classList.remove('is-open');
      mobileDrawer?.setAttribute('aria-hidden', 'true');
      mobileBackdrop?.classList.remove('is-open');
      if (!document.body.classList.contains('mode-slides')) {
        document.body.style.overflow = '';
      }
    }

    hamburgerBtn?.addEventListener('click', () => {
      if (mobileDrawer?.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    mobileDrawerClose?.addEventListener('click', closeDrawer);
    mobileBackdrop?.addEventListener('click', closeDrawer);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Handle link clicks inside mobile drawer
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const pageNum = parseInt(link.getAttribute('data-page'), 10);
        closeDrawer();

        if (document.body.classList.contains('mode-slides')) {
          e.preventDefault();
          showSlide(pageNum);
        } else {
          // Continuous scroll mode: let browser scroll smoothly
          const target = document.getElementById(`page-${pageNum}`);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            history.replaceState(null, null, `#page-${pageNum}`);
          }
        }
      });
    });
  }
});
