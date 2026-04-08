/* === 1. VISUAL EFFECTS === */

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
            position: absolute; width: 2px; height: 2px;
            background: rgba(255, 255, 255, 0.1); border-radius: 50%;
            top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
        `;
        container.appendChild(particle);
    }
}
createParticles();

/* === 2. THE GATEKEEPER (Secret Access) === */

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyL') {
        e.preventDefault();
        const portal = document.getElementById('admin-login-overlay');
        if (portal) {
            portal.classList.remove('hidden');
            console.log("--- COMMAND DECK ACTIVATED ---");
        }
    }
});

/* === 3. AUTHENTICATION (Magic Link) === */

async function requestMagicLink() {
    const emailInput = document.getElementById('admin-email');
    const email = emailInput.value;
    const btn = event.target;

    if (!email) return alert("Enter admin email!");

    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const response = await fetch('https://your-render-app.onrender.com/api/v1/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            alert("Check Gmail, Charlie. Gate is open.");
            btn.innerText = "LINK SENT";
        } else {
            alert("Unauthorized access.");
            btn.innerText = "GET MAGIC LINK";
            btn.disabled = false;
        }
    } catch (err) {
        alert("Brain offline. Check Render.");
        btn.disabled = false;
    }
}

/* === 4. THE HANDSHAKE (Auto-Redirect) === */

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // 1. Secure the token
        localStorage.setItem('charlie_token', token);
        
        // 2. Teleport to the actual Dashboard folder
        // This moves you from wiston1568.github.io to wiston1568.github.io/console/
        window.location.href = "./console/index.html"; 
    }
});

/* === 5. ADMIN ACTIONS === */
// Note: These functions should move to a script inside /console/index.html 
// but I'm keeping them here for backup.
async function triggerManualPush() {
    const phone = document.getElementById('target-phone').value;
    const token = localStorage.getItem('charlie_token');
    if (!phone) return alert("Enter phone!");

    try {
        const response = await fetch('https://your-render-app.onrender.com/api/v1/mpesa/stk-push', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ phone })
        });
        const data = await response.json();
        alert(data.CustomerMessage || "Push Sent");
    } catch (err) {
        alert("STK Failed");
    }
}