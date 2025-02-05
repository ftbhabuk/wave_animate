const canvas = document.getElementById("waterCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;
const resolution = 5;
const cols = Math.floor(width / resolution);
const rows = Math.floor(height / resolution);
let currentWave = new Array(cols * rows).fill(0);
let previousWave = new Array(cols * rows).fill(0);
const damping = 0.98;

canvas.addEventListener("click", (e) => {
    let x = Math.floor(e.clientX / resolution);
    let y = Math.floor(e.clientY / resolution);
    previousWave[y * cols + x] = 100;
});

function updateWaves() {
    for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
            let i = y * cols + x;
            currentWave[i] = (
                (previousWave[i - 1] + previousWave[i + 1] +
                 previousWave[i - cols] + previousWave[i + cols]) / 2
            ) - currentWave[i];
            currentWave[i] *= damping;
        }
    }
    [currentWave, previousWave] = [previousWave, currentWave];
}

function drawWaves() {
    ctx.clearRect(0, 0, width, height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let i = y * cols + x;
            let color = Math.min(255, Math.max(0, 128 + currentWave[i] * 2));
            ctx.fillStyle = `rgb(${color}, ${color}, 255)`;
            ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
        }
    }
}

function animate() {
    updateWaves();
    drawWaves();
    requestAnimationFrame(animate);
}

animate();
