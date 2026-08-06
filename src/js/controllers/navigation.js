// --- Source: src/js/controllers/navigation.js ---
export const NavigationController = {
  init() {
    this.primaryNav = document.getElementById('primaryNav');
    this.navToggleBtn = document.getElementById('navToggleBtn');
    this.scrollHiders = document.querySelectorAll('.baf-behavior-scroll-hide');

    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 10; // Reduksi sensitivitas pelatuk scroll
    this.inactivityTimer = null;
    this.INACTIVITY_DELAY = 5000; // 5 Detik timeout

    this.bindEvents();
  },

  bindEvents() {
    // Scroll Hide/Show Event Listener (Passive untuk performa 60 FPS)
    window.addEventListener('scroll', () => {
      this.handleScrollHide();
    }, { passive: true });

    if (this.navToggleBtn && this.primaryNav) {
      this.navToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNavigation();
      });

      // Deteksi interaksi pengguna pada menu overlay untuk reset timer
      ['mousemove', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
        this.primaryNav.addEventListener(evt, () => this.resetInactivityTimer(), { passive: true });
      });
    }
  },

  handleScrollHide() {
    const currentScrollY = window.scrollY;
    const diffY = currentScrollY - this.lastScrollY;

    // Abaikan jika selisih gulir terlalu kecil atau menu mobile sedang aktif
    if (Math.abs(diffY) < this.scrollThreshold || (this.primaryNav && this.primaryNav.classList.contains('is-active'))) {
      this.lastScrollY = currentScrollY;
      return;
    }

    if (diffY > 0 && currentScrollY > 100) {
      // Scroll Down -> Sembunyikan elemen
      this.scrollHiders.forEach(el => el.classList.add('baf-behavior-scroll-hide--hidden'));
    } else if (diffY < 0) {
      // Scroll Up -> Tampilkan kembali
      this.scrollHiders.forEach(el => el.classList.remove('baf-behavior-scroll-hide--hidden'));
    }

    this.lastScrollY = currentScrollY;
  },

  toggleNavigation() {
    const isOpen = this.primaryNav.classList.contains('is-active');
    if (!isOpen) {
      this.openNavigation();
    } else {
      this.closeNavigation();
    }
  },

  openNavigation() {
    this.navToggleBtn.setAttribute('aria-expanded', 'true');
    this.navToggleBtn.classList.add('is-active');
    this.primaryNav.classList.add('is-active');

    // Alihkan penahanan fokus keyboard secara instan
    window.BAF_FocusController.trapFocus(this.primaryNav);
    this.resetInactivityTimer();
  },

  closeNavigation() {
    this.navToggleBtn.setAttribute('aria-expanded', 'false');
    this.navToggleBtn.classList.remove('is-active');
    this.primaryNav.classList.remove('is-active');

    clearTimeout(this.inactivityTimer);
    this.navToggleBtn.focus(); // Kembalikan fokus ke hamburger pemicu
  },

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    if (this.primaryNav.classList.contains('is-active')) {
      this.inactivityTimer = setTimeout(() => {
        this.closeNavigation();
      }, this.INACTIVITY_DELAY);
    }
  }
};