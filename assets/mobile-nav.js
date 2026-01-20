/**
 * Mobile Navigation Module
 * A clean, modular slide-in drawer navigation system
 * 
 * Usage:
 * - Import this module after the DOM has loaded
 * - Call MobileNav.init() to initialize
 * - The module automatically creates the mobile nav structure from existing navbar
 */

const MobileNav = {
  // DOM Elements (set during init)
  elements: {
    nav: null,
    backdrop: null,
    trigger: null,
    closeBtn: null,
    content: null,
  },
  
  // State
  isOpen: false,
  eventsBound: false,
  
  /**
   * Initialize the mobile navigation
   */
  init() {
    this.createMobileNav();
  },
  
  /**
   * Create the mobile navigation structure from existing navbar links
   */
  createMobileNav() {
    // Skip if already created
    if (document.querySelector('.mobile-nav')) return;
    
    // Get navigation data from existing navbar
    const navItems = this.extractNavItems();
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    
    // Create mobile nav container
    const nav = document.createElement('nav');
    nav.className = 'mobile-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');
    nav.setAttribute('aria-hidden', 'true');
    
    nav.innerHTML = `
      <div class="mobile-nav-header">
        <a href="/" class="mobile-nav-logo-link">
          <img src="/assets/images/logo_octigen_white.png" alt="Octigen" class="mobile-nav-logo" />
        </a>
        <button class="mobile-nav-close" aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="mobile-nav-content">
        <ul class="mobile-nav-list">
          ${this.renderNavItems(navItems)}
        </ul>
      </div>
      
      <div class="mobile-nav-footer">
        <div class="mobile-nav-theme-toggle">
          <span>Theme</span>
          <button class="theme-toggle" id="theme-toggle-mobile-drawer" aria-label="Toggle dark/light mode">
            <div class="theme-toggle-track">
              <div class="theme-toggle-thumb"></div>
            </div>
          </button>
        </div>
        
        <a href="/#contact" class="mobile-nav-cta" onclick="MobileNav.handleCtaClick(event)">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>Contact</span>
        </a>
      </div>
    `;
    
    // Create trigger button (hamburger)
    const trigger = document.createElement('button');
    trigger.className = 'mobile-nav-trigger';
    trigger.setAttribute('aria-label', 'Open menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `
      <span class="mobile-nav-trigger-bar"></span>
      <span class="mobile-nav-trigger-bar"></span>
      <span class="mobile-nav-trigger-bar"></span>
    `;
    
    // Insert trigger into navbar (after the mobile theme toggle)
    const navbar = document.querySelector('.navbar .container-fluid');
    if (navbar) {
      // Remove old toggler if exists
      const oldToggler = navbar.querySelector('.navbar-toggler');
      if (oldToggler) {
        oldToggler.style.display = 'none';
      }
      
      navbar.appendChild(trigger);
    }
    
    // Add elements to DOM
    document.body.appendChild(backdrop);
    document.body.appendChild(nav);
    
    // Store references
    this.elements.nav = nav;
    this.elements.backdrop = backdrop;
    this.elements.trigger = trigger;
    this.elements.closeBtn = nav.querySelector('.mobile-nav-close');
    this.elements.content = nav.querySelector('.mobile-nav-content');
    
    // Initialize the theme toggle in mobile drawer
    this.initMobileThemeToggle();
  },
  
  /**
   * Extract navigation items from existing navbar
   */
  extractNavItems() {
    const items = [];
    const navLinks = document.querySelectorAll('.navbar-nav > .nav-item');
    
    navLinks.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (!link) return;
      
      // Skip CTA button and theme toggle
      if (item.classList.contains('nav-item-cta') || 
          item.querySelector('.theme-toggle')) {
        return;
      }
      
      const itemData = {
        text: link.textContent.trim(),
        href: link.getAttribute('href'),
        isActive: link.classList.contains('active'),
        children: []
      };
      
      // Check for dropdown
      const dropdown = item.querySelector('.dropdown-menu');
      if (dropdown) {
        itemData.href = '#';
        itemData.isDropdown = true;
        dropdown.querySelectorAll('.dropdown-item').forEach(dropItem => {
          itemData.children.push({
            text: dropItem.textContent.trim(),
            href: dropItem.getAttribute('href')
          });
        });
      }
      
      items.push(itemData);
    });
    
    return items;
  },
  
  /**
   * Render navigation items to HTML
   */
  renderNavItems(items) {
    return items.map((item, index) => {
      if (item.isDropdown) {
        return `
          <li class="mobile-nav-item">
            <a href="#" 
               class="mobile-nav-link${item.isActive ? ' is-active' : ''}" 
               role="button"
               aria-expanded="false"
               aria-controls="mobile-dropdown-${index}"
               data-dropdown-toggle>
              <span>${item.text}</span>
              <svg class="mobile-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </a>
            <ul class="mobile-nav-dropdown" id="mobile-dropdown-${index}">
              ${item.children.map(child => `
                <li class="mobile-nav-dropdown-item">
                  <a href="${child.href}" class="mobile-nav-dropdown-link">${child.text}</a>
                </li>
              `).join('')}
            </ul>
          </li>
        `;
      }
      
      return `
        <li class="mobile-nav-item">
          <a href="${item.href}" class="mobile-nav-link${item.isActive ? ' is-active' : ''}">
            <span>${item.text}</span>
          </a>
        </li>
      `;
    }).join('');
  },
  
  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Prevent double-binding
    if (this.eventsBound) return;
    
    // Ensure elements exist
    if (!this.elements.nav || !this.elements.trigger) {
      console.warn('MobileNav: Elements not ready for binding');
      return;
    }
    
    this.eventsBound = true;
    
    // Open menu
    this.elements.trigger.addEventListener('click', () => this.open());
    
    // Close menu
    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Close on backdrop click
    if (this.elements.backdrop) {
      this.elements.backdrop.addEventListener('click', () => this.close());
    }
    
    // Handle dropdown toggles - use event delegation for reliability
    this.elements.nav.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-dropdown-toggle]');
      if (toggle) {
        this.handleDropdownToggle(e, toggle);
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Close menu when clicking a regular link - use event delegation
    this.elements.nav.addEventListener('click', (e) => {
      const link = e.target.closest('.mobile-nav-link:not([data-dropdown-toggle]), .mobile-nav-dropdown-link');
      if (link) {
        // Small delay to allow navigation to process
        setTimeout(() => this.close(), 100);
      }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 1199 && this.isOpen) {
          this.close();
        }
      }, 100);
    });
  },
  
  /**
   * Open the mobile navigation
   */
  open() {
    this.isOpen = true;
    
    // Update DOM
    this.elements.nav?.classList.add('is-open');
    this.elements.nav?.setAttribute('aria-hidden', 'false');
    this.elements.backdrop?.classList.add('is-visible');
    this.elements.trigger?.classList.add('is-active');
    this.elements.trigger?.setAttribute('aria-expanded', 'true');
    
    // Lock body scroll
    document.documentElement.classList.add('mobile-nav-open');
    document.body.classList.add('mobile-nav-open');
    
    // Focus management (use preventScroll to avoid scroll jump)
    this.elements.closeBtn?.focus({ preventScroll: true });
  },
  
  /**
   * Close the mobile navigation
   */
  close() {
    this.isOpen = false;
    
    // Update DOM
    this.elements.nav?.classList.remove('is-open');
    this.elements.nav?.setAttribute('aria-hidden', 'true');
    this.elements.backdrop?.classList.remove('is-visible');
    this.elements.trigger?.classList.remove('is-active');
    this.elements.trigger?.setAttribute('aria-expanded', 'false');
    
    // Unlock body scroll
    document.documentElement.classList.remove('mobile-nav-open');
    document.body.classList.remove('mobile-nav-open');
    
    // Close all dropdowns
    this.closeAllDropdowns();
    
    // Return focus to trigger
    this.elements.trigger?.focus({ preventScroll: true });
  },
  
  /**
   * Toggle the mobile navigation
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },
  
  /**
   * Handle dropdown toggle click
   */
  handleDropdownToggle(e, toggle) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropdownId = toggle.getAttribute('aria-controls');
    const dropdown = document.getElementById(dropdownId);
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // Close other dropdowns first
    this.elements.nav?.querySelectorAll('[data-dropdown-toggle]').forEach(otherToggle => {
      if (otherToggle !== toggle) {
        otherToggle.setAttribute('aria-expanded', 'false');
        const otherId = otherToggle.getAttribute('aria-controls');
        document.getElementById(otherId)?.classList.remove('is-open');
      }
    });
    
    // Toggle this dropdown
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    if (isExpanded) {
      dropdown?.classList.remove('is-open');
    } else {
      dropdown?.classList.add('is-open');
    }
  },
  
  /**
   * Close all dropdowns
   */
  closeAllDropdowns() {
    this.elements.nav?.querySelectorAll('[data-dropdown-toggle]').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });
    this.elements.nav?.querySelectorAll('.mobile-nav-dropdown').forEach(dropdown => {
      dropdown.classList.remove('is-open');
    });
  },
  
  /**
   * Initialize theme toggle within mobile nav drawer
   */
  initMobileThemeToggle() {
    const toggle = document.getElementById('theme-toggle-mobile-drawer');
    if (!toggle) return;
    
    const thumb = toggle.querySelector('.theme-toggle-thumb');
    if (!thumb || thumb.children.length > 0) return;
    
    // Add icons
    const sunIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sunIcon.setAttribute('class', 'theme-icon sun-icon');
    sunIcon.setAttribute('viewBox', '0 0 24 24');
    sunIcon.setAttribute('fill', 'currentColor');
    sunIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    
    const moonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    moonIcon.setAttribute('class', 'theme-icon moon-icon');
    moonIcon.setAttribute('viewBox', '0 0 24 24');
    moonIcon.setAttribute('fill', 'currentColor');
    moonIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    
    thumb.appendChild(sunIcon);
    thumb.appendChild(moonIcon);
    
    // Bind click event
    toggle.addEventListener('click', () => {
      if (typeof ThemeManager !== 'undefined') {
        ThemeManager.toggle();
      }
    });
  },
  
  /**
   * Handle CTA button click
   */
  handleCtaClick(event) {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      event.preventDefault();
      this.close();
      // Small delay to let menu close animation complete
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    } else {
      // Let the default navigation happen
      this.close();
    }
  }
};

// Make handleCtaClick available globally
window.MobileNav = MobileNav;

// Initialize when DOM is ready
// Note: This should be called after navbar is loaded
// It's called from main.js in initNavbar()
