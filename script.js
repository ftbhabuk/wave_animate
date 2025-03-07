const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

const config = {
    dropletCount: 1,  // Number of waves
    dropletVelocity: 15,
    waveSpeed: 1,
    waveStrength: 1,
    backgroundFade: 0.4,
    colorPalette: 'white',
    trailEffect: true,
    gravityIntensity: 1,
    colorMode: 'colorful',
    waveShape: 'circle',
    availableShapes: [
        'circle', 'square', 'triangle', 'mandala', 'spiral', 'fractal',
        'fireworks', 'ethereal-plasma',
        'quantum-singularity', 'fractal-consciousness', 'cosmic-mandala',
        'fractal-dendrite', 'quantum-interference'
    ],
    useRandomShapes: false,
    dropletDelay: 100, // Wave Delay
    waveSpread: 1.6, // Renamed from gravityIntensity
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        this.baseColor = [255, 255, 255];
        this.currentColor = [...this.baseColor];
        this.hasInteracted = false;
        this.colorMode = config.colorMode;
        this.waveShape = config.waveShape; // Store initial shape at creation
    }

    drawSophisticatedBacterialColony(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        ctx.save();
        ctx.translate(this.x, this.y);
        const timeFlow = Date.now() * 0.0005;
        const iterations = 3;

        for (let iteration = 1; iteration <= iterations; iteration++) {
            ctx.beginPath();
            const growthPoints = 80;
            for (let i = 0; i < growthPoints; i++) {
                const angle = (i / growthPoints) * Math.PI * 2;
                const radiusModulation = 
                    Math.pow(Math.sin(angle * 4 + timeFlow), 3) * 0.1 +
                    Math.cos(angle * 3 + timeFlow * iteration) * 0.05;
                const dynamicRadius = baseRadius * (1 + radiusModulation * (iteration / iterations));
                const x = dynamicRadius * Math.cos(angle);
                const y = dynamicRadius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            const layerAlpha = intensity * (1 - iteration/iterations) * 0.6;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${layerAlpha})`;
            ctx.lineWidth = this.width * (1 - iteration/iterations);
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
            ctx.globalCompositeOperation = 'lighter';
            ctx.stroke();
        }
        this.drawElegantCellBuds(ctx, baseRadius, intensity, [r, g, b]);
        ctx.restore();
    }

    drawElegantCellBuds(ctx, baseRadius, intensity, colorRGB) {
        const [r, g, b] = colorRGB;
        const budCount = 5;
        const timeFlow = Date.now() * 0.0005;
        for (let i = 0; i < budCount; i++) {
            const angle = (i / budCount) * Math.PI * 2 + timeFlow;
            const budDistance = baseRadius * 0.85;
            const budSize = baseRadius * 0.2;
            const x = budDistance * Math.cos(angle);
            const y = budDistance * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, budSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity * 0.4})`;
            ctx.fill();
        }
    }

    drawCosmicMandalaWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        ctx.save();
        ctx.translate(this.x, this.y);
        const layers = 5;
        for (let layer = 1; layer <= layers; layer++) {
            const layerRadius = baseRadius * (layer / layers);
            const petalCount = 12 + layer * 3;
            const rotationOffset = Math.sin(Date.now() * 0.001 * layer) * Math.PI;
            ctx.save();
            ctx.rotate(rotationOffset);
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2;
                ctx.save();
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(
                    layerRadius / 3, -layerRadius * 0.6,
                    layerRadius * 2/3, -layerRadius * 0.9,
                    layerRadius, 0
                );
                ctx.bezierCurveTo(
                    layerRadius * 2/3, layerRadius * 0.9,
                    layerRadius / 3, layerRadius * 0.6,
                    0, 0
                );
                const layerIntensity = intensity * (0.3 + 0.7 * (layers - layer) / layers);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${layerIntensity})`;
                ctx.lineWidth = this.width * (1 - layer/layers);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
        }
        ctx.restore();
    }

    drawFractalDendriteWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        const drawBranch = (x, y, length, angle, depth) => {
            if (depth <= 0 || length < 1) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(length, 0);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity * (depth / 5)})`;
            ctx.lineWidth = this.width * (depth / 5);
            ctx.stroke();
            const branchProbability = 0.7;
            const branchAngleSpread = Math.PI / 4;
            const lengthReduction = 0.7;
            if (Math.random() < branchProbability) {
                drawBranch(length, 0, length * lengthReduction, branchAngleSpread, depth - 1);
                drawBranch(length, 0, length * lengthReduction, -branchAngleSpread, depth - 1);
            }
            ctx.restore();
        };
        ctx.save();
        ctx.translate(this.x, this.y);
        drawBranch(0, 0, baseRadius, 0, 5);
        ctx.restore();
    }

    drawQuantumInterferenceWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        ctx.save();
        ctx.translate(this.x, this.y);
        const waveCount = 5;
        const timeOffset = Date.now() * 0.01;
        for (let i = 0; i < waveCount; i++) {
            const phaseShift = (i / waveCount) * Math.PI * 2;
            const waveIntensity = intensity * (1 - i / waveCount);
            ctx.beginPath();
            for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
                const radiusModulation = Math.sin(angle * 3 + timeOffset + phaseShift) * 
                                         Math.cos(angle * 2 + timeOffset) * 0.2 + 1;
                const currentRadius = baseRadius * radiusModulation;
                const x = currentRadius * Math.cos(angle);
                const y = currentRadius * Math.sin(angle);
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${waveIntensity})`;
            ctx.lineWidth = this.width * (1 - i / waveCount);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawEtherealPlasmaWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        ctx.save();
        ctx.translate(this.x, this.y);
        const layers = 4;
        const timeFlow = Date.now() * 0.0005;
        for (let layer = 1; layer <= layers; layer++) {
            ctx.beginPath();
            for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
                const dynamicRadius = baseRadius * (1 + Math.sin(angle * 2 + timeFlow * layer) * 0.2);
                const x = dynamicRadius * Math.cos(angle);
                const y = dynamicRadius * Math.sin(angle);
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            const layerIntensity = intensity * (1 - layer/layers) * 0.7;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${layerIntensity})`;
            ctx.lineWidth = this.width * (1 - layer/layers);
            ctx.globalCompositeOperation = 'lighter';
            ctx.stroke();
        }
        ctx.restore();
    }

    drawQuantumSingularityWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        ctx.save();
        ctx.translate(this.x, this.y);
        const timeWarp = Date.now() * 0.0003;
        const eventHorizonLayers = 6;
        for (let layer = 1; layer <= eventHorizonLayers; layer++) {
            ctx.beginPath();
            for (let t = 0; t <= Math.PI * 2; t += 0.1) {
                const distortionFactor = Math.pow(1.1, layer);
                const spiralRadius = baseRadius * (Math.exp(0.2 * t) / distortionFactor);
                const x = spiralRadius * Math.cos(t);
                const y = spiralRadius * Math.sin(t);
                if (t === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            const gravitationalIntensity = intensity * (1 - layer/eventHorizonLayers) * 0.8;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${gravitationalIntensity})`;
            ctx.lineWidth = this.width * (1.5 - layer/eventHorizonLayers);
            ctx.globalCompositeOperation = 'lighter';
            ctx.stroke();
        }
        ctx.restore();
    }

    drawFractalConsciousnessWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        const recursiveBranch = (x, y, length, angle, depth) => {
            if (depth <= 0 || length < 1) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            const branchVariation = depth === 6 ? 0 : Math.sin(Date.now() * 0.003 * depth) * 0.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                length / 3, -length * 0.4 * (1 + branchVariation),
                length * 2/3, length * 0.4 * (1 - branchVariation),
                length, 0
            );
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity * (depth / 6)})`;
            ctx.lineWidth = this.width * (depth / 6);
            ctx.stroke();
            const goldenRatio = 1.618;
            const branchProbability = 0.7;
            const angleSpread = Math.PI / 3;
            if (Math.random() < branchProbability) {
                recursiveBranch(length, 0, length / goldenRatio, angleSpread, depth - 1);
                recursiveBranch(length, 0, length / goldenRatio, -angleSpread, depth - 1);
            }
            ctx.restore();
        };
        ctx.save();
        ctx.translate(this.x, this.y);
        recursiveBranch(0, 0, baseRadius, 0, 6);
        ctx.restore();
    }

    drawFlowerWave(ctx) {
        // Placeholder for flower wave
    }

    drawSpiralWave(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;
        ctx.beginPath();
        const turns = 5;
        const maxAngle = turns * Math.PI * 2;
        for (let angle = 0; angle <= maxAngle; angle += 0.05) {
            const spiralRadius = baseRadius * (angle / maxAngle) * (1 + 0.2 * Math.sin(angle * 6));
            const x = this.x + spiralRadius * Math.cos(angle);
            const y = this.y + spiralRadius * Math.sin(angle);
            ctx.lineWidth = this.width * (0.5 + 0.5 * Math.cos(angle * 4));
            const opacity = Math.max(intensity * (1 - angle / maxAngle), 0.2);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    drawFirework(ctx) {
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;
        ctx.lineWidth = this.width;
        ctx.shadowBlur = 0;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
        const turns = 5;
        const maxAngle = turns * Math.PI * 2;
        ctx.beginPath();
        for (let angle = 0; angle <= maxAngle; angle += 0.05) {
            const spiralRadius = baseRadius * (angle / maxAngle) * (1 + 0.12 * Math.sin(angle * 5));
            const x = this.x + spiralRadius * Math.cos(angle);
            const y = this.y + spiralRadius * Math.sin(angle);
            const fade = Math.max(intensity * (1 - angle / maxAngle), 0.3);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${fade})`;
            ctx.lineWidth = this.width * (0.6 + 0.4 * Math.cos(angle * 3));
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            if (angle % 0.4 < 0.05) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                ctx.fill();
            }
        }
        ctx.stroke();
    }

    drawFractalWave(ctx) {
        const recursionDepth = 3;
        const baseRadius = this.radius;
        const intensity = this.strength * this.energy;
        const [r, g, b] = this.currentColor;

        const drawFractalBranch = (x, y, radius, angle, depth) => {
            if (depth === 0) return;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity / (depth + 1)})`;
            ctx.lineWidth = this.width * (recursionDepth - depth + 1);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
            const branchCount = 3;
            const branchAngleSpread = Math.PI / 4;
            const branchRadiusFactor = 0.6;
            for (let i = 0; i < branchCount; i++) {
                const branchAngle = angle + (i - branchCount/2) * branchAngleSpread;
                const branchX = x + Math.cos(branchAngle) * radius;
                const branchY = y + Math.sin(branchAngle) * radius;
                drawFractalBranch(branchX, branchY, radius * branchRadiusFactor, branchAngle, depth - 1);
            }
        };
        drawFractalBranch(this.x, this.y, baseRadius, 0, recursionDepth);
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

        if (this.waveShape === 'fireworks') {
            this.drawFirework(ctx);
            return;
        }
        if (this.waveShape === 'sophisticated-bacterial') {
            this.drawSophisticatedBacterialColony(ctx);
            return;
        }
        if (this.waveShape === 'ethereal-plasma') {
            this.drawEtherealPlasmaWave(ctx);
            return;
        }
        if (this.waveShape === 'quantum-singularity') {
            this.drawQuantumSingularityWave(ctx);
            return;
        }
        if (this.waveShape === 'fractal-consciousness') {
            this.drawFractalConsciousnessWave(ctx);
            return;
        }
        if (this.waveShape === 'cosmic-mandala') {
            this.drawCosmicMandalaWave(ctx);
            return;
        }
        if (this.waveShape === 'fractal-dendrite') {
            this.drawFractalDendriteWave(ctx);
            return;
        }
        if (this.waveShape === 'quantum-interference') {
            this.drawQuantumInterferenceWave(ctx);
            return;
        }
        if (this.waveShape === 'flower') {
            this.drawFlowerWave(ctx);
            return;
        }
        if (this.waveShape === 'spiral') {
            this.drawSpiralWave(ctx);
            return;
        }
        if (this.waveShape === 'fractal') {
            this.drawFractalWave(ctx);
            return;
        }
        if (this.waveShape === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.waveShape === 'square') {
            ctx.strokeRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else if (this.waveShape === 'triangle') {
            ctx.beginPath();
            const angleOffset = -Math.PI / 2;
            for (let i = 0; i < 3; i++) {
                const angle = angleOffset + i * (2 * Math.PI / 3);
                const vx = this.x + this.radius * Math.cos(angle);
                const vy = this.y + this.radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(vx, vy);
                else ctx.lineTo(vx, vy);
            }
            ctx.closePath();
            ctx.stroke();
        } else if (this.waveShape === 'mandala') {
            const numPetals = 12;
            const petalLength = this.radius;
            const petalWidth = this.radius / 3;
            ctx.save();
            ctx.translate(this.x, this.y);
            for (let i = 0; i < numPetals; i++) {
                let angle = i * (2 * Math.PI / numPetals);
                ctx.save();
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(petalLength / 3, -petalWidth, 2 * petalLength / 3, -petalWidth, petalLength, 0);
                ctx.bezierCurveTo(2 * petalLength / 3, petalWidth, petalLength / 3, petalWidth, 0, 0);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
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
    const numWaves = config.dropletCount;
    for (let i = 0; i < numWaves; i++) {
        (function(index) {
            setTimeout(() => {
                const offset = 5 * config.waveSpread;
                const rx = x + (Math.random() - 0.5) * offset;
                const ry = y + (Math.random() - 0.5) * offset;
                addWave(rx, ry, 0.7 - (index * 0.2));
            }, index * config.dropletDelay);
        })(i);
    }
}

function animate() {
    if (config.trailEffect) {
        ctx.fillStyle = `rgba(0, 0, 0, ${config.backgroundFade})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(0, 0, 0, ${config.backgroundFade})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    droplets = droplets.filter(droplet => droplet.update());

    for (let i = 0; i < waves.length; i++) {
        for (let j = i + 1; j < waves.length; j++) {
            waves[i].interact(waves[j]);
        }
    }

    waves = waves.filter(wave => {
        const isAlive = wave.update();
        if (isAlive) wave.draw(ctx);
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

canvas.addEventListener('click', (e) => handleClick(e.clientX, e.clientY));
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleClick(touch.clientX, touch.clientY);
}, { passive: false });

document.getElementById('waveSpread')?.addEventListener('input', (e) => {
    config.waveSpread = parseFloat(e.target.value);
    document.getElementById('waveSpreadValue').textContent = e.target.value;
});

document.getElementById('gravityIntensity')?.addEventListener('input', (e) => {
    config.waveSpread = parseFloat(e.target.value);
    document.getElementById('gravityIntensityValue').textContent = e.target.value;
});

document.getElementById('dropletDelay')?.addEventListener('input', (e) => {
    config.dropletDelay = parseInt(e.target.value);
    document.getElementById('dropletDelayValue').textContent = e.target.value;
});

document.getElementById('dropletCount')?.addEventListener('input', (e) => {
    config.dropletCount = parseInt(e.target.value);
    document.getElementById('dropletCountValue').textContent = e.target.value;
});

document.getElementById('dropletVelocity')?.addEventListener('input', (e) => {
    config.dropletVelocity = parseFloat(e.target.value);
    document.getElementById('dropletVelocityValue').textContent = e.target.value;
});

document.getElementById('waveSpeed')?.addEventListener('input', (e) => {
    config.waveSpeed = parseFloat(e.target.value);
    document.getElementById('waveSpeedValue').textContent = e.target.value;
});

document.getElementById('waveStrength')?.addEventListener('input', (e) => {
    config.waveStrength = parseFloat(e.target.value);
    document.getElementById('waveStrengthValue').textContent = e.target.value;
});

document.getElementById('backgroundFade')?.addEventListener('input', (e) => {
    config.backgroundFade = parseFloat(e.target.value);
    document.getElementById('backgroundFadeValue').textContent = e.target.value;
});

document.getElementById('colorPalette')?.addEventListener('change', (e) => {
    config.colorPalette = e.target.value;
});

document.getElementById('trailEffect')?.addEventListener('change', (e) => {
    config.trailEffect = e.target.checked;
});

document.getElementById('waveShape')?.addEventListener('change', (e) => {
    config.waveShape = e.target.value;
});

document.getElementById('resetButton')?.addEventListener('click', () => {
    waves = [];
    droplets = [];
    waveCounter = 0;
});

document.querySelectorAll('.section-header')?.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        content.classList.toggle('active');
        const icon = header.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        }
    });
});

animate();

let autoClickInterval = null;

function getRandomPosition() {
    return {
        x: Math.random() * canvas.getBoundingClientRect().width,
        y: Math.random() * canvas.getBoundingClientRect().height
    };
}

document.getElementById('randomShapesToggle')?.addEventListener('change', (e) => {
    config.useRandomShapes = e.target.checked;
});

function getRandomShape() {
    const randomIndex = Math.floor(Math.random() * config.availableShapes.length);
    return config.availableShapes[randomIndex];
}

function toggleAutoClick() {
    const autoClickButton = document.getElementById('autoClickButton');
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
        autoClickInterval = null;
        autoClickButton.textContent = 'Start Auto-Click';
        autoClickButton.classList.remove('active');
    } else {
        autoClickInterval = setInterval(() => {
            const { x, y } = getRandomPosition();
            if (config.useRandomShapes) {
                const previousShape = config.waveShape;
                config.waveShape = getRandomShape();
                handleClick(x, y);
            } else {
                handleClick(x, y);
            }
        }, 700);
        autoClickButton.textContent = 'Stop Auto-Click';
        autoClickButton.classList.add('active');
    }
}

document.getElementById('autoClickButton')?.addEventListener('click', toggleAutoClick);

function toggleColorMode() {
    config.colorMode = config.colorMode === 'monochrome' ? 'colorful' : 'monochrome';
    const colorModeButton = document.getElementById('colorModeButton');
    colorModeButton.textContent = `Color Mode: ${config.colorMode}`;
    colorModeButton.classList.toggle('colorful', config.colorMode === 'colorful');
}

document.getElementById('colorModeButton')?.addEventListener('click', toggleColorMode);