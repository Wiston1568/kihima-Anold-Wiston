// Magnetic button effect
document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
    });
});

// Simple particles background
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return; 
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
        `;
        container.appendChild(particle);
    }
}
createParticles();

// Listen for Ctrl + Shift + L to reveal the Admin Portal
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyL') {
        e.preventDefault();
        showLoginPortal();
    }
});

function showLoginPortal() {
    const portal = document.getElementById('admin-login-overlay');
    if (portal) {
        portal.classList.remove('hidden');
        console.log("--- COMMAND DECK ACTIVATED ---");
    }
}

/* === BACKEND INTEGRATION LOGIC === */

// 1. Send Magic Link to your Backend
async function requestMagicLink() {
    const emailInput = document.getElementById('admin-email');
    const email = emailInput ? emailInput.value : null;
    
    if (!email) return alert("Email required, Charlie.");

    try {
        // Pointing to your live Render engine
        const response = await fetch('https://kihima-backend.onrender.com/api/v1/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert("Handshake initiated. Check your Gmail.");
        } else {
            alert("Access Denied: Unauthorized Email.");
        }
    } catch (err) {
        console.error("Connection failed:", err);
        // Special alert for Render Free Tier spin-up
        alert("Server is waking up... Please wait 30 seconds and try again.");
    }
}

// 2. The Handshake (Detect token in URL and move to /console)
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Save token for the dashboard to use for authorized API calls
        localStorage.setItem('charlie_token', token);
        
        // Clean the URL so the token doesn't stay in the history/address bar
        window.history.replaceState({}, document.title, "/");
        
        // Teleport to your internal dashboard folder
        // Ensure this path matches your repo structure exactly
        window.location.href = "./console/index.html"; 
    }
});