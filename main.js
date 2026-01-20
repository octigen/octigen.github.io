// ===========================================
// Theme Manager - Handles dark/light mode
// ===========================================
const ThemeManager = {
  STORAGE_KEY: 'octigen-theme',
  TRANSITION_CLASS: 'theme-transition',
  
  /**
   * Get the user's preferred theme from localStorage or system preference
   * @returns {'dark' | 'light'}
   */
  getPreferredTheme() {
    // First check localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    
    // Fall back to system preference (only switch to dark if explicitly set)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light
    return 'light';
  },
  
  /**
   * Get current theme from DOM
   * @returns {'dark' | 'light'}
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },
  
  /**
   * Set the theme and persist to localStorage
   * @param {'dark' | 'light'} theme
   * @param {boolean} animate - Whether to animate the transition
   */
  setTheme(theme, animate = true) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    
    // Add transition class for smooth change
    if (animate) {
      document.documentElement.classList.add(this.TRANSITION_CLASS);
    }
    
    // Set the theme
    document.documentElement.setAttribute('data-theme', validTheme);
    
    // Persist to localStorage
    localStorage.setItem(this.STORAGE_KEY, validTheme);
    
    // Dispatch custom event for other components (e.g., particles)
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: validTheme } 
    }));
    
    // Remove transition class after animation completes
    if (animate) {
      setTimeout(() => {
        document.documentElement.classList.remove(this.TRANSITION_CLASS);
      }, 300);
    }
  },
  
  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const current = this.getCurrentTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },
  
  /**
   * Initialize theme (call as early as possible to prevent flash)
   */
  init() {
    const theme = this.getPreferredTheme();
    this.setTheme(theme, false); // No animation on initial load
    
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
          this.setTheme(e.matches ? 'light' : 'dark');
        }
      });
    }
  }
};

// Initialize theme immediately (before DOMContentLoaded if possible)
// This prevents flash of wrong theme
ThemeManager.init();

// ===========================================
// Navbar Functionality
// ===========================================
async function loadNavbar() {
  try {
    const response = await fetch("/components/navbar.html");
    if (!response.ok) throw new Error("Navbar not found");
    const navbarHTML = await response.text();
    
    // Check if there's a navbar-container div, otherwise insert at beginning of body
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = navbarHTML;
    } else {
      document.body.insertAdjacentHTML("afterbegin", navbarHTML);
    }

    // Initialize navbar functionality
    initNavbar();

    // Ensure translations work after navbar is loaded
    if (typeof loadLanguage === 'function') {
      const lang = localStorage.getItem("lang") || "en";
      loadLanguage(lang);
    }

  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

// Initialize navbar behaviors
function initNavbar() {
  // Add scroll effect for fixed navbar
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
  
  // Set active link based on current page
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '/' && (currentPath === '/' || currentPath === '/index.html')) {
      link.classList.add('active');
    } else if (href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    }
  });
  
  // Initialize theme toggle buttons
  initThemeToggle();
  
  // Initialize mobile navigation
  if (typeof MobileNav !== 'undefined') {
    MobileNav.init();
    MobileNav.bindEvents();
  }
}

// Theme Toggle Buttons Functionality
function initThemeToggle() {
  // Get both desktop and mobile theme toggles
  const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  if (themeToggles.length === 0) return;
  
  // Inject icons into all toggle thumbs
  themeToggles.forEach(toggle => {
    const thumb = toggle.querySelector('.theme-toggle-thumb');
    if (!thumb || thumb.children.length > 0) return; // Skip if already has icons
    
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
    
    // Toggle theme on click using ThemeManager
    toggle.addEventListener('click', () => {
      ThemeManager.toggle();
    });
  });
}

// Load the navbar once the DOM is ready
document.addEventListener("DOMContentLoaded", loadNavbar);

// NOTE: Footer loading is handled by load-footer.js (single source of truth)
// Do NOT duplicate footer loading here!

// ===========================================
// Contact Link Handler
// ===========================================
// If current page has #contact, scroll to it. Otherwise, go to homepage.
window.handleContactClick = function() {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    return false; // Prevent default link navigation
  }
  return true; // Allow default navigation to /#contact
};
