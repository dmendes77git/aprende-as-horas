/**
 * Fireworks & Particle Animation System for Celebration Victories
 */
class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  triggerFireworks() {
    this.particles = [];

    // Create 3 burst centers across the screen
    const centers = [
      { x: this.canvas.width * 0.3, y: this.canvas.height * 0.4 },
      { x: this.canvas.width * 0.5, y: this.canvas.height * 0.3 },
      { x: this.canvas.width * 0.7, y: this.canvas.height * 0.4 }
    ];

    const colorPalette = [
      '#ef4444', // Red
      '#3b82f6', // Blue
      '#f59e0b', // Gold
      '#10b981', // Emerald
      '#ec4899', // Pink
      '#8b5cf6'  // Purple
    ];

    centers.forEach(center => {
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          radius: Math.random() * 5 + 3,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    });

    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let activeParticles = 0;

    for (let p of this.particles) {
      if (p.alpha > 0) {
        activeParticles++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.alpha -= p.decay;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    if (activeParticles > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animId = null;
    }
  }
}
