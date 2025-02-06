const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

const config = {
    dropletCount: 20,
    dropletVelocity: 15,
    waveSpeed: 5,
    waveStrength: 1,
    backgroundFade: 0.1,
    colorPalette: 'white',
    trailEffect: false,
    gravityIntensity: 1,
    colorMode: 'monochrome', // Default to monochrome
    waveShape: 'circle'      // Default shape for waves
};

function resize() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(scale, scale);
}

window.addEventListener('resize', resize);
resize();

class Droplet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.velocityX = (Math.random() - 0.5) * 1;
        this.velocityY = -config.dropletVelocity - Math.random() * 1;
        this.gravity = 0.8 * config.gravityIntensity;
        this.size = Math.random() * 2 + 1;
        this.alpha = 1;
        this.landed = false;
        this.color = this.getColor();
    }

    getColor() {
        const palettes = {
            'white': [255, 255, 255],
            'blue': [100, 149, 237],
            'green': [50, 205, 50],
            'purple': [138, 43, 226]
        };
        const [r, g, b] = palettes[config.colorPalette];
        return `rgba(${r}, ${g}, ${b}, `;
    }

    update() {
        if (!this.landed) {
            if (this.x !== this.startX) {
                this.velocityX += (this.startX - this.x) * 0.02;
            }
            
            this.x += this.velocityX * 0.2;
            this.y += this.velocityY;
            this.velocityY += this.gravity;

            if (this.velocityY > 0 && this.y > this.startY) {
                this.landed = true;
                addWave(this.x, this.y, 0.22);
                return true;
            }
        } else {
            this.alpha -= 0.1;
        }
        return this.alpha > 0;
    }

    draw(ctx) {
        ctx.beginPath();
        // Drawing a square for each droplet. You can change to circle if needed.
        ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
    }
}

class Wave {
    constructor(x, y, strength = 1) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.strength = strength;
        this.speed = config.waveSpeed;
        this.energy = 1;
        this.width = 2;
        this.collisions = new Set();
        
        // Base and current color for the wave
        this.baseColor = [255, 255, 255];
        this.currentColor = [...this.baseColor];
        this.hasInteracted = false;
        this.colorMode = config.colorMode; // Use global color mode
    }

    distanceTo(other) {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }

    interact(other) {
        if (this === other) return;
        if (this.collisions.has(other.id)) return;
        
        const distance = this.distanceTo(other);
        const radiusSum = this.radius + other.radius;

        if (Math.abs(distance - radiusSum) < this.width * 2) {
            this.collisions.add(other.id);
            other.collisions.add(this.id);

            // Change color only if color mode is colorful
            if (!this.hasInteracted && this.colorMode === 'colorful') {
                this.currentColor = [
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 256)
                ];
                this.hasInteracted = true;
            }
        }
    }

    update() {
        this.radius += this.speed * this.energy;
        this.energy *= 0.995;
        this.strength *= 0.99;
        return this.strength > 0.01 && this.energy > 0.01;
    }

    draw(ctx) {
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;
    
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;
        ctx.lineWidth = this.width * 2;

        // Draw based on the selected wave shape
        if (config.waveShape === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (config.waveShape === 'square') {
            ctx.strokeRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else if (config.waveShape === 'triangle') {
            ctx.beginPath();
            // Create an equilateral triangle centered at (x,y) and inscribed in a circle of radius
            const angleOffset = -Math.PI / 2;
            for (let i = 0; i < 3; i++) {
                const angle = angleOffset + i * (2 * Math.PI / 3);
                const vx = this.x + this.radius * Math.cos(angle);
                const vy = this.y + this.radius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(vx, vy);
                } else {
                    ctx.lineTo(vx, vy);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
}

let waves = [];
let droplets = [];
let waveCounter = 0;

function addWave(x, y, strength = 1) {
    const wave = new Wave(x, y, strength);
    wave.id = waveCounter++;
    waves.push(wave);
}

function createSplash(x, y) {
    addWave(x, y, 1);
    
    const numDroplets = config.dropletCount;
    for (let i = 0; i < numDroplets; i++) {
        droplets.push(new Droplet(x, y));
    }

    for (let i = 0; i < 3; i++) {
        const offset = 5;
        const rx = x + (Math.random() - 0.5) * offset;
        const ry = y + (Math.random() - 0.5) * offset;
        addWave(rx, ry, 0.7 - i * 0.2);
    }
}

function animate() {
    ctx.fillStyle = `rgba(0, 0, 0, ${config.backgroundFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    droplets = droplets.filter(droplet => {
        const isAlive = droplet.update();
        if (isAlive) {
            droplet.draw(ctx);
        }
        return isAlive;
    });

    // Check collisions among waves
    for (let i = 0; i < waves.length; i++) {
        for (let j = i + 1; j < waves.length; j++) {
            waves[i].interact(waves[j]);
        }
    }

    waves = waves.filter(wave => {
        const isAlive = wave.update();
        if (isAlive) {
            wave.draw(ctx);
        }
        return isAlive;
    });

    requestAnimationFrame(animate);
}

function handleClick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    createSplash(x, y);
}

canvas.addEventListener('click', (e) => {
    handleClick(e.clientX, e.clientY);
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleClick(touch.clientX, touch.clientY);
}, { passive: false });

// Sidebar control event listeners
document.getElementById('dropletCount').addEventListener('input', (e) => {
    config.dropletCount = parseInt(e.target.value);
    document.getElementById('dropletCountValue').textContent = e.target.value;
});

document.getElementById('dropletVelocity').addEventListener('input', (e) => {
    config.dropletVelocity = parseFloat(e.target.value);
    document.getElementById('dropletVelocityValue').textContent = e.target.value;
});

document.getElementById('waveSpeed').addEventListener('input', (e) => {
    config.waveSpeed = parseFloat(e.target.value);
    document.getElementById('waveSpeedValue').textContent = e.target.value;
});

document.getElementById('waveStrength').addEventListener('input', (e) => {
    config.waveStrength = parseFloat(e.target.value);
    document.getElementById('waveStrengthValue').textContent = e.target.value;
});

document.getElementById('backgroundFade').addEventListener('input', (e) => {
    config.backgroundFade = parseFloat(e.target.value);
    document.getElementById('backgroundFadeValue').textContent = e.target.value;
});

document.getElementById('colorPalette').addEventListener('change', (e) => {
    config.colorPalette = e.target.value;
});

document.getElementById('trailEffect').addEventListener('change', (e) => {
    config.trailEffect = e.target.checked;
});

document.getElementById('gravityIntensity').addEventListener('input', (e) => {
    config.gravityIntensity = parseFloat(e.target.value);
    document.getElementById('gravityIntensityValue').textContent = e.target.value;
});

// Wave shape selection listener
document.getElementById('waveShape').addEventListener('change', (e) => {
    config.waveShape = e.target.value;
});

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', () => {
    waves = [];
    droplets = [];
    waveCounter = 0;
});

animate();

// Auto-Click functionality
let autoClickInterval = null;

function getRandomPosition() {
    return {
        x: Math.random() * canvas.getBoundingClientRect().width,
        y: Math.random() * canvas.getBoundingClientRect().height
    };
}

function toggleAutoClick() {
    const autoClickButton = document.getElementById('autoClickButton');
    
    if (autoClickInterval) {
        // Stop auto-clicking
        clearInterval(autoClickInterval);
        autoClickInterval = null;
        autoClickButton.textContent = 'Start Auto-Click';
        autoClickButton.classList.remove('active');
    } else {
        // Start auto-clicking
        autoClickInterval = setInterval(() => {
            const { x, y } = getRandomPosition();
            handleClick(x, y);
        }, 500); // Click every 500 milliseconds
        autoClickButton.textContent = 'Stop Auto-Click';
        autoClickButton.classList.add('active');
    }
}

document.getElementById('autoClickButton').addEventListener('click', toggleAutoClick);

// Toggle color mode event listener
function toggleColorMode() {
    config.colorMode = config.colorMode === 'monochrome' ? 'colorful' : 'monochrome';
    const colorModeButton = document.getElementById('colorModeButton');
    colorModeButton.textContent = `Color Mode: ${config.colorMode}`;
    colorModeButton.classList.toggle('colorful', config.colorMode === 'colorful');
}

document.getElementById('colorModeButton').addEventListener('click', toggleColorMode);
