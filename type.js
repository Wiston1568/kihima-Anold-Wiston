/* === 1. VISUAL EFFECTS === */
document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
    });
});

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute; width: 2px; height: 2px;
            background: rgba(255, 255, 255, 0.1); border-radius: 50%;
            top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
        `;
        container.appendChild(particle);
    }
}
createParticles();

/* === 2. THE GATEKEEPER (Redirect Logic) === */

document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + L -> Teleport to the Console folder
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyL') {
        e.preventDefault();
        console.log("--- REDIRECTING TO COMMAND DECK ---");
        // Points to the index.html inside your /console folder
        window.location.href = "./console/index.html"; 
    }
});

/* === 3. THE HANDSHAKE (Token Capture) === */

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Store the key so the /console page can use it later
        localStorage.setItem('charlie_token', token);
        
        // Redirect to the console immediately to keep the main URL clean
        window.location.href = "./console/index.html";
    }
});
