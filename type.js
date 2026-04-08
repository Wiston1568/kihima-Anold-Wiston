/* === 1. VISUAL EFFECTS (Original) === */

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

/* === 2. THE GATEKEEPER (Secret Access) === */

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

/* === 3. AUTHENTICATION (Magic Link) === */

async function requestMagicLink() {
    const emailInput = document.getElementById('admin-email');
    const email = emailInput.value;
    const btn = event.target;

    if (!email) return alert("Enter your admin email first!");

    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const response = await fetch('https://your-render-app.onrender.com/api/v1/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            alert("Check your Gmail, Charlie. The gate is open.");
            btn.innerText = "LINK SENT";
        } else {
            alert("Unauthorized access attempt.");
            btn.innerText = "GET MAGIC LINK";
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Backend offline:", err);
        alert("Could not connect to the Brain. Check Render logs.");
        btn.innerText = "GET MAGIC LINK";
        btn.disabled = false;
    }
}

/* === 4. THE HANDSHAKE (Auto-Unlock) === */

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // 1. Store the key
        localStorage.setItem('charlie_token', token);
        
        // 2. Clean the address bar
        window.history.replaceState({}, document.title, "/");

        // 3. Flip the UI state
        const portal = document.getElementById('admin-login-overlay');
        const loginState = document.getElementById('login-state');
        const adminState = document.getElementById('admin-state');

        if (portal) portal.classList.remove('hidden');
        if (loginState) loginState.classList.add('hidden');
        if (adminState) adminState.classList.remove('hidden');
        
        console.log("--- ACCESS GRANTED: WELCOME CHARLIE ---");
    }
});

/* === 5. ADMIN ACTIONS (STK Push) === */

async function triggerManualPush() {
    const phone = document.getElementById('target-phone').value;
    const token = localStorage.getItem('charlie_token');
    const btn = event.target;

    if (!phone) return alert("Enter a phone number!");

    btn.innerText = "PUSHING...";
    btn.disabled = true;

    try {
        const response = await fetch('https://your-render-app.onrender.com/api/v1/mpesa/stk-push', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ phone: phone })
        });

        const data = await response.json();
        alert(data.CustomerMessage || "Request Processed");
    } catch (err) {
        alert("Failed to send STK push.");
    } finally {
        btn.innerText = "SEND PROMPT";
        btn.disabled = false;
    }
}
