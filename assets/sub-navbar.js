/**
 * Sub Navigation Bar Component
 * Reusable sticky sub-navigation for use case pages
 */

document.addEventListener('DOMContentLoaded', function() {
  initSubNavbar();
});

/**
 * Initialize the sub-navigation bar functionality
 */
function initSubNavbar() {
  const subNavbar = document.getElementById('sub-navbar');
  if (!subNavbar) return;
  
  const subNavLinks = document.querySelectorAll('.sub-nav-link');
  const sections = [];
  
  // Add class to html for CSS hooks
  document.documentElement.classList.add('has-sub-navbar');
  
  // Collect all sections with IDs
  subNavLinks.forEach(link => {
    const sectionId = link.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) {
      sections.push({ id: sectionId, element: section });
    }
  });
  
  /**
   * Sync sub-navbar position with main navbar's scrolled state
   * Uses the same scroll threshold as the main navbar (50px in main.js)
   * Checking scrollY directly ensures both navbars transition at exactly the same time,
   * avoiding race conditions that occur when checking the navbar's class state
   */
  function syncWithNavbar() {
    // Use the same threshold as main navbar (window.scrollY > 50)
    // This is more reliable than checking navbar class, especially on fast scrolls
    if (window.scrollY > 50) {
      subNavbar.classList.add('navbar-scrolled');
    } else {
      subNavbar.classList.remove('navbar-scrolled');
    }
  }
  
  /**
   * Get combined height of navbar + sub-navbar for scroll calculations
   */
  function getTotalNavHeight() {
    const navbar = document.querySelector('.navbar');
    const isScrolled = navbar && navbar.classList.contains('scrolled');
    // Use fixed values matching CSS
    const navbarHeight = isScrolled ? 58 : 90;
    const subNavHeight = subNavbar.offsetHeight || 40;
    return navbarHeight + subNavHeight;
  }
  
  /**
   * Update active link based on scroll position
   */
  function updateActiveLink() {
    const scrollY = window.scrollY;
    const offset = getTotalNavHeight() + 50;
    
    let currentSection = sections[0]?.id;
    
    sections.forEach(({ id, element }) => {
      const sectionTop = element.offsetTop - offset;
      const sectionBottom = sectionTop + element.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSection = id;
      }
    });
    
    // Update active class
    subNavLinks.forEach(link => {
      const sectionId = link.getAttribute('data-section');
      if (sectionId === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  /**
   * Handle scroll events
   */
  function handleScroll() {
    syncWithNavbar();
    updateActiveLink();
  }
  
  /**
   * Smooth scroll on click
   */
  subNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const targetPosition = targetSection.offsetTop - getTotalNavHeight() - 20;
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Initialize
  syncWithNavbar();
  updateActiveLink();
  
  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
}
