/**
 * ARCHITECT: Kihima Arnold Wiston
 * MODULE: System Logic & Interactive Handshake
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTerminalLogic();
    initMagneticButtons();
    initTabSystem();
    initSecretTriggers();
    console.log("NODE_ONLINE: System Handshake Complete.");
});

// 1. SCROLL REVEAL ANIMATIONS
function initScrollReveal() {
    const observerOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// 2. TERMINAL & AUTH LOGIC
const API_BASE = 'https://kihima-backend.onrender.com/api/v1/auth';

async function handlePinLogin() {
    const pinInput = document.getElementById('admin-pin');
    const authBtn = document.querySelector('.auth-btn');
    const pin = pinInput.value;

    if (pin.length !== 4) {
        alert("CRITICAL_ERROR: PIN must be 4 digits.");
        return;
    }

    try {
        authBtn.innerText = "AUTHORIZING...";
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('sys_token', data.token);
            authBtn.innerText = "ACCESS_GRANTED";
            authBtn.style.background = "#00ff88"; 
            setTimeout(() => { window.location.href = 'admin-dashboard.html'; }, 1000);
        } else {
            throw new Error(data.message || "UNAUTHORIZED");
        }
    } catch (err) {
        authBtn.innerText = "ACCESS_DENIED";
        authBtn.style.background = "var(--primary)";
        pinInput.value = "";
        setTimeout(() => { authBtn.innerText = "AUTHORIZE_ACCESS"; }, 2000);
    }
}

// 3. SECRET TRIGGERS (Shortcuts & Triple Tap)
function initSecretTriggers() {
    // Keyboard Shortcut: Ctrl + Shift + L
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            window.toggleTerminal();
        }
    });

    // Mobile Triple Tap
    let tapCount = 0;
    document.querySelectorAll('.nav-logo img, .footer-logo').forEach(logo => {
        logo.addEventListener('click', () => {
            tapCount++;
            if (tapCount === 3) {
                window.toggleTerminal();
                tapCount = 0;
            }
            setTimeout(() => { tapCount = 0; }, 500);
        });
    });
}

// 4. TAB SYSTEM
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            const activeTab = document.getElementById(`tab-${target}`);
            if (activeTab) activeTab.classList.add('active');
        });
    });
}

// 5. UTILITIES
window.toggleTerminal = function() {
    const overlay = document.getElementById('admin-login-overlay');
    if (overlay) overlay.classList.toggle('hidden');
};

function initMagneticButtons() {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const pos = btn.getBoundingClientRect();
            const x = e.pageX - pos.left - pos.width / 2;
            const y = e.pageY - pos.top - pos.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseout', () => { btn.style.transform = `translate(0, 0)`; });
    });
}