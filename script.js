document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    
    // Get stat display elements
    const pointsInsideElement = document.getElementById('pointsInside');
    const totalPointsElement = document.getElementById('totalPoints');
    const estimatedPiElement = document.getElementById('estimatedPi');
    const errorElement = document.getElementById('error');
    
    // Constants
    const CANVAS_SIZE = canvas.width; // Canvas is square
    const ACTUAL_PI = Math.PI;
    
    // Simulation variables
    let pointsInside = 0;
    let totalPoints = 0;
    let animationId = null;
    let pointsPerFrame = parseInt(speedSlider.value);
    
    // Initialize the canvas
    function initCanvas() {
        // Clear the canvas
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // Draw the unit square
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // Draw the quarter circle
        ctx.beginPath();
        ctx.arc(0, CANVAS_SIZE, CANVAS_SIZE, -Math.PI/2, 0, false);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Generate a random point and check if it's inside the circle
    function generatePoint() {
        // Generate random coordinates in [0, 1]
        const x = Math.random();
        const y = Math.random();
        
        // Calculate distance from origin (0, 1) in unit square coordinates
        // For a quarter circle centered at (0, 1) with radius 1
        const dx = x;
        const dy = 1 - y;
        const isInside = (dx * dx + dy * dy) <= 1;
        
        // Draw the point
        const canvasX = x * CANVAS_SIZE;
        const canvasY = y * CANVAS_SIZE;
        
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 2, 0, Math.PI * 2);
        ctx.fillStyle = isInside ? '#3498db' : '#e74c3c';
        ctx.fill();
        
        // Update counters
        if (isInside) {
            pointsInside++;
        }
        totalPoints++;
        
        return isInside;
    }
    
    // Update the statistics display
    function updateStats() {
        const estimatedPi = totalPoints > 0 ? (4 * pointsInside / totalPoints) : 0;
        const error = totalPoints > 0 ? Math.abs((estimatedPi - ACTUAL_PI) / ACTUAL_PI * 100) : 0;
        
        pointsInsideElement.textContent = pointsInside;
        totalPointsElement.textContent = totalPoints;
        estimatedPiElement.textContent = estimatedPi.toFixed(8);
        errorElement.textContent = error.toFixed(4);
    }
    
    // Animation loop
    function animate() {
        // Generate multiple points per frame based on the speed slider
        for (let i = 0; i < pointsPerFrame; i++) {
            generatePoint();
        }
        
        updateStats();
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the simulation
    function startSimulation() {
        if (!animationId) {
            animate();
            startBtn.disabled = true;
            stopBtn.disabled = false;
        }
    }
    
    // Stop the simulation
    function stopSimulation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }
    
    // Reset the simulation
    function resetSimulation() {
        stopSimulation();
        pointsInside = 0;
        totalPoints = 0;
        initCanvas();
        updateStats();
    }
    
    // Event listeners
    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);
    resetBtn.addEventListener('click', resetSimulation);
    
    speedSlider.addEventListener('input', () => {
        pointsPerFrame = parseInt(speedSlider.value);
        speedValue.textContent = `${pointsPerFrame} points/frame`;
    });
    
    // Initialize the simulation
    initCanvas();
    updateStats();
});
