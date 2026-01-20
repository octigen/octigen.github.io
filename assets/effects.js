// ===========================================
// Visual Effects Module
// Handles tilt, parallax, and other visual effects
// ===========================================

const VisualEffects = {
  
  // ===========================================
  // Image Tilt Effect
  // Applies 3D tilt to images based on mouse position
  // ===========================================
  initTiltEffect(options = {}) {
    const {
      selector = '.feature-image-container.tilt-effect',
      maxTilt = 15,
      effectRange = 600
    } = options;
    
    const tiltContainers = document.querySelectorAll(selector);
    if (tiltContainers.length === 0) return;
    
    document.addEventListener('mousemove', function(e) {
      tiltContainers.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;
        
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        const mouseX = Math.max(-1, Math.min(1, deltaX / effectRange));
        const mouseY = Math.max(-1, Math.min(1, deltaY / effectRange));
        
        const tiltX = -mouseY * maxTilt;
        const tiltY = mouseX * maxTilt;
        
        img.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
    });
  },
  
  // ===========================================
  // Horizontal Parallax Effect
  // Slides an element horizontally based on scroll position
  // ===========================================
  initHorizontalParallax(options = {}) {
    const {
      wrapperId = 'hero-parallax-image',
      imageSelector = '.hero-edge-image',
      startOffset = 0,
      maxSlide = 30,
      scrollRange = 600,
      direction = 'out', // 'in' or 'out'
      mobileBreakpoint = 991 // Disable on mobile
    } = options;
    
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    
    const image = wrapper.querySelector(imageSelector);
    if (!image) return;
    
    const isMobile = () => window.innerWidth <= mobileBreakpoint;
    
    const updateParallax = () => {
      // Skip parallax on mobile
      if (isMobile()) {
        image.style.transform = 'none';
        return;
      }
      
      const scrollY = window.scrollY;
      const progress = Math.min(1, scrollY / scrollRange);
      // Cubic ease-out for smooth effect
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate translateX based on direction
      const translateX = direction === 'out' 
        ? startOffset + (easedProgress * maxSlide)
        : startOffset - (easedProgress * maxSlide);
      
      image.style.transform = `translateX(${translateX}%)`;
    };
    
    // Throttle with requestAnimationFrame for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Update on resize to handle orientation changes
    window.addEventListener('resize', updateParallax);
    
    // Initial update
    updateParallax();
  },
  
  // ===========================================
  // Initialize all effects
  // Call this on DOMContentLoaded
  // ===========================================
  init() {
    // Initialize tilt effect for elements with .tilt-effect class
    this.initTiltEffect();
    
    // Initialize horizontal parallax if element exists
    this.initHorizontalParallax();
  }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  VisualEffects.init();
});

// Export for manual initialization with custom options
window.VisualEffects = VisualEffects;
