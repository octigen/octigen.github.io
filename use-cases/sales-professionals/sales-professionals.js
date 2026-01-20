/**
 * Sales Professionals Page - Interactive Elements
 * Page-specific JavaScript for /use-cases/sales-professionals/
 */

(function() {
  'use strict';

  /**
   * Animate counter numbers when they come into view
   */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'), 10);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Stagger animation for deck generator visual
   */
  function initDeckGeneratorAnimation() {
    const visual = document.querySelector('.deck-generator-visual');
    if (!visual) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateDeckGenerator();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(visual);
  }

  function animateDeckGenerator() {
    const briefCard = document.querySelector('.client-brief-card');
    const flow = document.querySelector('.generation-flow');
    const slideCard = document.querySelector('.generated-slide-card');
    
    const elements = [briefCard, flow, slideCard].filter(Boolean);
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  /**
   * Metrics animation when scrolling into view
   */
  function initMetricsAnimation() {
    const metricsBar = document.querySelector('.metrics-bar');
    if (!metricsBar) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateMetrics();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(metricsBar);
  }

  function animateMetrics() {
    const items = document.querySelectorAll('.metric-item');
    
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  /**
   * Initialize all animations on DOM ready
   */
  function init() {
    initCounterAnimation();
    initDeckGeneratorAnimation();
    initMetricsAnimation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
