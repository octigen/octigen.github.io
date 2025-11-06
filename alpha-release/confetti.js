// Confetti Animation - Celebratory effect for page load
// Configurable, reusable confetti system

document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const config = {
    canvasId: 'confetti-canvas',
    count: 50,
    colors: ['#1e4fe2', '#ffffff', '#f0f0f0', '#4a90e2', '#64b5f6'],
    duration: 3000, // milliseconds
    size: { min: 2, max: 6 },
    speed: { y: { min: 2, max: 5 }, x: { min: -1, max: 1 } },
    fadeOutRate: 0.02
  };

  // Get canvas and setup context
  const canvas = document.getElementById(config.canvasId);
  if (!canvas) {
    console.warn('Confetti canvas not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const confettiPieces = [];
  let confettiActive = true;
  
  // Confetti class
  class Confetti {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
      this.speedY = Math.random() * (config.speed.y.max - config.speed.y.min) + config.speed.y.min;
      this.speedX = Math.random() * (config.speed.x.max - config.speed.x.min) + config.speed.x.min;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      this.opacity = 1;
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      
      // Fade out when stopping
      if (!confettiActive) {
        this.opacity -= config.fadeOutRate;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }
  
  // Initialize confetti pieces
  for (let i = 0; i < config.count; i++) {
    confettiPieces.push(new Confetti());
  }
  
  let animationId;
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw only visible confetti
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const piece = confettiPieces[i];
      piece.update();
      piece.draw();
      
      // Remove confetti that has faded out or fallen off screen
      if (piece.opacity <= 0 || piece.y > canvas.height + 50) {
        confettiPieces.splice(i, 1);
      }
    }
    
    // Continue animating if there are confetti pieces left
    if (confettiPieces.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Hide canvas when done
      canvas.style.display = 'none';
    }
  }
  
  // Start animation
  animate();
  
  // Stop confetti after specified duration
  setTimeout(() => {
    confettiActive = false;
  }, config.duration);
  
  // Resize handler
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  // Smooth scroll functionality for smooth-scroll links
  const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  });
});

