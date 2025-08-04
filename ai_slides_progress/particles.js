// Particle System for PowerPoint AI Slides Landing Page
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.floatingParticles = []; // New floating particles system
        this.mouse = { x: 0, y: 0 };
        this.connections = [];
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.createFloatingParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        // More connected particles for elegant effect
        const isMobile = window.innerWidth < 768;
        const performanceMultiplier = isMobile ? 0.8 : 1.5; // Increased
        const baseCount = Math.floor((this.canvas.width * this.canvas.height) / 12000); // More dense
        const particleCount = Math.min(baseCount * performanceMultiplier, isMobile ? 50 : 100); // More particles
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.15, // Slightly slower
                vy: (Math.random() - 0.5) * 0.15,
                radius: Math.random() * 1.2 + 0.6, // Small, elegant particles
                opacity: Math.random() * 0.4 + 0.3, // More visible for connections
                originalOpacity: Math.random() * 0.4 + 0.3,
                color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`, // White particles
                life: Math.random() * 300 + 200, // Longer, more stable life
                maxLife: Math.random() * 300 + 200,
                pulseSpeed: Math.random() * 0.008 + 0.003 // Gentler pulse
            });
        }
    }

    createFloatingParticles() {
        // More ambient floating particles for increased activity
        const isMobile = window.innerWidth < 768;
        const floatingCount = isMobile ? 8 : 15; // Increased for more visual activity
        
        for (let i = 0; i < floatingCount; i++) {
            this.spawnFloatingParticle();
        }
    }

    spawnFloatingParticle() {
        let x, y, vx, vy;
        
        // 50% chance to spawn directly on screen, 50% chance from edges
        if (Math.random() > 0.5) {
            // Spawn directly on visible screen
            x = Math.random() * this.canvas.width;
            y = Math.random() * this.canvas.height;
            vx = (Math.random() - 0.5) * 0.3; // Much slower
            vy = (Math.random() - 0.5) * 0.3;
        } else {
            // Spawn from random edges of the screen
            const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            
            switch(side) {
                case 0: // Top
                    x = Math.random() * this.canvas.width;
                    y = -30;
                    vx = (Math.random() - 0.5) * 0.4;
                    vy = Math.random() * 0.2 + 0.1; // Much slower
                    break;
                case 1: // Right
                    x = this.canvas.width + 30;
                    y = Math.random() * this.canvas.height;
                    vx = -(Math.random() * 0.2 + 0.1);
                    vy = (Math.random() - 0.5) * 0.4;
                    break;
                case 2: // Bottom
                    x = Math.random() * this.canvas.width;
                    y = this.canvas.height + 30;
                    vx = (Math.random() - 0.5) * 0.4;
                    vy = -(Math.random() * 0.2 + 0.1);
                    break;
                case 3: // Left
                    x = -30;
                    y = Math.random() * this.canvas.height;
                    vx = Math.random() * 0.2 + 0.1;
                    vy = (Math.random() - 0.5) * 0.4;
                    break;
            }
        }

        this.floatingParticles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            radius: Math.random() * 1.5 + 0.8, // Smaller particles
            opacity: Math.random() * 0.3 + 0.2, // More transparent
            color: 'white', // Only white
            life: Math.random() * 500 + 400,
            maxLife: Math.random() * 500 + 400,
            rotationSpeed: (Math.random() - 0.5) * 0.01, // Slower rotation
            rotation: 0,
            drift: {
                x: (Math.random() - 0.5) * 0.003, // Much subtler drift
                y: (Math.random() - 0.5) * 0.003
            },
            scale: Math.random() * 0.4 + 0.3 // Smaller scale
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.floatingParticles = [];
            this.createParticles();
            this.createFloatingParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Add touch support for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Mouse attraction effect
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 120;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * 0.008;
                particle.vy += Math.sin(angle) * force * 0.008;
                
                // Subtle opacity increase when near mouse
                particle.opacity = Math.min(particle.originalOpacity + force * 0.3, 0.8);
            } else {
                // Fade back to original opacity
                particle.opacity = Math.max(particle.opacity - 0.01, particle.originalOpacity);
            }

            // Apply velocity with damping
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.99; // More damping
            particle.vy *= 0.99;

            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Add subtle floating animation
            particle.y += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1;
        });
    }

    updateFloatingParticles() {
        // Update floating particles with space-like physics
        for (let i = this.floatingParticles.length - 1; i >= 0; i--) {
            const particle = this.floatingParticles[i];
            
            // Apply drift forces (like cosmic wind)
            particle.vx += particle.drift.x;
            particle.vy += particle.drift.y;
            
            // Apply movement
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Rotation
            particle.rotation += particle.rotationSpeed;
            
            // Slight velocity damping (space friction)
            particle.vx *= 0.999;
            particle.vy *= 0.999;
            
            // Life management
            particle.life--;
            
            // Remove particles that are off-screen or dead
            const buffer = 100;
            if (particle.life <= 0 || 
                particle.x < -buffer || particle.x > this.canvas.width + buffer ||
                particle.y < -buffer || particle.y > this.canvas.height + buffer) {
                this.floatingParticles.splice(i, 1);
            }
        }
        
        // More frequent spawning of new floating particles
        if (Math.random() < 0.02) { // 2% chance per frame (increased from 0.5%)
            this.spawnFloatingParticle();
        }
        
        // Maintain minimum number of floating particles
        const isMobile = window.innerWidth < 768;
        const minCount = isMobile ? 6 : 12; // Increased for more activity
        if (this.floatingParticles.length < minCount) {
            this.spawnFloatingParticle();
        }
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const opacity = (100 - distance) / 100;
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;

        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = (120 - distance) / 120;
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Add subtle pulsing effect
            const pulseScale = 1 + Math.sin(Date.now() * particle.pulseSpeed) * 0.2;
            const currentRadius = particle.radius * pulseScale;
            
            // Life-based opacity
            const lifeFactor = particle.life / particle.maxLife;
            const currentOpacity = particle.opacity * lifeFactor;

            // Create gradient for particles - white theme
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, currentRadius * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${currentOpacity * 0.4})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius * 1.8, 0, Math.PI * 2);
            this.ctx.fill();

            // Add subtle inner glow
            this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();

            // Decrease life slowly
            particle.life -= 0.2;
            if (particle.life <= 0) {
                // Respawn particle
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.life = particle.maxLife;
                particle.vx = (Math.random() - 0.5) * 0.2;
                particle.vy = (Math.random() - 0.5) * 0.2;
            }
        });
    }

    drawFloatingParticles() {
        this.floatingParticles.forEach(particle => {
            const lifeFactor = particle.life / particle.maxLife;
            const currentOpacity = Math.max(particle.opacity * lifeFactor, 0.1); // Lower minimum for subtlety
            
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.scale(particle.scale, particle.scale);
            
            // Simple white particles - elegant and subtle
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.radius * 2.5);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
            gradient.addColorStop(0.4, `rgba(255, 255, 255, ${currentOpacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Subtle white center
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(currentOpacity * 1.2, 0.8)})`;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.radius * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw floating particles first (background layer)
        this.updateFloatingParticles();
        this.drawFloatingParticles();
        
        // Then update and draw interactive particles (foreground layer)
        this.updateParticles();
        this.drawConnections();
        this.drawMouseConnections();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the page to settle
    setTimeout(() => {
        new ParticleSystem();
    }, 100);
});

// Add some additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Create floating elements on mouse move
    const createFloatingElement = (x, y) => {
        const element = document.createElement('div');
        element.className = 'floating-spark';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        document.body.appendChild(element);

        setTimeout(() => {
            element.remove();
        }, 1500); // Match the CSS animation duration
    };

    // Create motion trail
    const createMotionTrail = (x, y) => {
        const trail = document.createElement('div');
        trail.className = 'motion-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 400); // Match the CSS animation duration
    };

    // Create ripple effect on click
    const createRipple = (x, y) => {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000); // Match the 1s animation duration
    };

    let lastSparkTime = 0;
    let lastTrailTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        
        // Create subtle motion trail
        if (window.innerWidth > 991 && now - lastTrailTime > 60) {
            createMotionTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        }
        
        if (now - lastSparkTime > 100) { // Reduced delay for more frequent sparks
            if (Math.random() > 0.85) { // Increased spark generation from 5% to 15%
                createFloatingElement(e.clientX + (Math.random() - 0.5) * 20, e.clientY + (Math.random() - 0.5) * 20);
            }
            lastSparkTime = now;
        }
    });

    // Add click ripple effect
    document.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY);
    });

    // Add touch support
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            createRipple(touch.clientX, touch.clientY);
        }
    });
}); 