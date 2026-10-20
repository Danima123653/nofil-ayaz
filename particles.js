/* Ambient Particle Connections - Nofil Ayaz Portfolio */
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates for interactive particles
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Helper to read current design token colors dynamically from CSS variables
    function getThemeColors() {
        const style = getComputedStyle(document.body);
        const accentRgb = style.getPropertyValue('--clr-accent-rgb').trim() || "0, 245, 212";
        const accentAltRgb = style.getPropertyValue('--clr-accent-alt-rgb').trim() || "0, 217, 247";
        return {
            accent: accentRgb,
            accentAlt: accentAltRgb
        };
    }

    let colors = getThemeColors();

    // Listen for theme change events to update colors immediately
    window.addEventListener('theme-changed', () => {
        colors = getThemeColors();
    });

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, vx, vy, size, isAccent) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;
            this.isAccent = isAccent;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            
            const colorRgb = this.isAccent ? colors.accent : colors.accentAlt;
            const alpha = this.isAccent ? 0.6 : 0.5;
            ctx.fillStyle = `rgba(${colorRgb}, ${alpha})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = `rgba(${colorRgb}, 0.8)`;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow after drawing particle
        }

        update() {
            // Keep particles inside viewport borders
            if (this.x > width || this.x < 0) this.vx = -this.vx;
            if (this.y > height || this.y < 0) this.vy = -this.vy;

            // Mouse interactives
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let forceX = (dx / dist) * force * 2.5;
                    let forceY = (dy / dist) * force * 2.5;
                    
                    this.x -= forceX;
                    this.y -= forceY;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const particleDensity = Math.min((width * height) / 9000, 140);
        
        for (let i = 0; i < particleDensity; i++) {
            const size = Math.random() * 2.5 + 1.2;
            const x = Math.random() * (width - size * 2) + size;
            const y = Math.random() * (height - size * 2) + size;
            
            const vx = (Math.random() - 0.5) * 0.6;
            const vy = (Math.random() - 0.5) * 0.6;
            
            const isAccent = Math.random() > 0.4;

            particlesArray.push(new Particle(x, y, vx, vy, size, isAccent));
        }
    }

    function connect() {
        const threshold = 140;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < threshold) {
                    const opacity = (1 - dist / threshold) * 0.22;
                    const colorRgb = particlesArray[a].isAccent ? colors.accent : colors.accentAlt;
                    
                    ctx.strokeStyle = `rgba(${colorRgb}, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
});
