/**
 * ARCHITECT: Kihima Arnold Wiston
 * MODULE: System Logic & Interactive Handshake
 */

const API_BASE = 'https://kihima-backend.onrender.com/api/v1/auth';

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initImageCycle();
    initMagneticButtons();
    initTabSystem();
    initSecretTriggers();
    initAuthLogic();
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

// 1.5 TRIPLE IMAGE CYCLE LOGIC
function initImageCycle() {
    const images = [
        'url("Pictures/image1.jpg")',
        'url("Pictures/image2.jpg")',
        'url("Pictures/image3.jpg")'
    ];
    let currentImg = 0;
    const imgNode = document.getElementById('cycle-image');
    
    if (!imgNode) return;

    function cycleImages() {
        currentImg = (currentImg + 1) % images.length;
        imgNode.style.backgroundImage = images[currentImg];
    }
    
    setInterval(cycleImages, 5000);
    imgNode.addEventListener('click', cycleImages);
}

// 2. SECRET TRIGGERS (Shortcuts & Triple Tap)
function initSecretTriggers() {
    // Keyboard Shortcut: Ctrl + Shift + L (or Ctrl + Shift + K as backup)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') || 
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k')) {
            e.preventDefault();
            toggleTerminal();
        }
    });

    // Mobile Triple Tap
    let tapCount = 0;
    document.querySelectorAll('.nav-logo img, .footer-logo').forEach(logo => {
        logo.addEventListener('click', () => {
            tapCount++;
            if (tapCount === 3) {
                toggleTerminal();
                tapCount = 0;
            }
            setTimeout(() => { tapCount = 0; }, 500);
        });
    });
}

// 3. TAB SYSTEM
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

// 4. MAGNETIC BUTTONS
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

// 5. AUTHENTICATION LOGIC
function initAuthLogic() {
    // Allow Enter key for all forms
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const emailOverlay = document.getElementById('recovery-email-overlay');
            const codeOverlay = document.getElementById('recovery-code-overlay');
            const loginOverlay = document.getElementById('admin-login-overlay');

            if (emailOverlay && !emailOverlay.classList.contains('hidden')) {
                sendRecoveryCode();
            } else if (codeOverlay && !codeOverlay.classList.contains('hidden')) {
                verifyRecoveryCode();
            } else if (loginOverlay && !loginOverlay.classList.contains('hidden')) {
                handlePinLogin();
            }
        }
    });
}

// 6. TOGGLE LOGIN TERMINAL
function toggleTerminal() {
    const overlay = document.getElementById('admin-login-overlay');
    if (overlay) {
        overlay.classList.toggle('hidden');
        if (!overlay.classList.contains('hidden')) {
            const pinInput = document.getElementById('admin-pin');
            if (pinInput) pinInput.focus();
        }
    }
}

// 7. PIN AUTHENTICATION
async function handlePinLogin() {
    const pinInput = document.getElementById('admin-pin');
    const authBtn = document.querySelector('.auth-btn');
    const pin = pinInput.value;

    if (pin.length !== 4) {
        pinInput.style.borderColor = 'red';
        pinInput.placeholder = 'INVALID_LENGTH';
        setTimeout(() => {
            pinInput.style.borderColor = 'var(--primary)';
            pinInput.placeholder = '••••';
        }, 2000);
        return;
    }

    try {
        authBtn.innerText = "AUTHORIZING...";
        const response = await fetch(`${API_BASE}/pin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('sys_token', data.token);
            authBtn.innerText = "ACCESS_GRANTED";
            authBtn.style.background = "#00ff88"; 
            setTimeout(() => { window.location.href = 'console/index.html'; }, 1000);
        } else {
            throw new Error(data.message || "UNAUTHORIZED");
        }
    } catch (err) {
        authBtn.innerText = "ACCESS_DENIED";
        authBtn.style.background = "var(--primary)";
        pinInput.value = "";
        setTimeout(() => { authBtn.innerText = "AUTHORIZE_CONNECTION"; }, 2000);
    }
}

// 8. RECOVERY EMAIL FLOW
function showRecoveryEmail() {
    const loginOverlay = document.getElementById('admin-login-overlay');
    const recoveryEmailOverlay = document.getElementById('recovery-email-overlay');
    if (loginOverlay) loginOverlay.classList.add('hidden');
    if (recoveryEmailOverlay) {
        recoveryEmailOverlay.classList.remove('hidden');
        const emailInput = document.getElementById('recovery-email');
        if (emailInput) emailInput.focus();
    }
}

function hideRecoveryEmail() {
    const recoveryEmailOverlay = document.getElementById('recovery-email-overlay');
    const loginOverlay = document.getElementById('admin-login-overlay');
    if (recoveryEmailOverlay) recoveryEmailOverlay.classList.add('hidden');
    if (loginOverlay) loginOverlay.classList.remove('hidden');
}

async function sendRecoveryCode() {
    const email = document.getElementById('recovery-email').value;
    const btn = document.getElementById('send-recovery-btn');

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        btn.innerText = "SENDING...";
        btn.disabled = true;

        const response = await fetch(`${API_BASE}/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            btn.innerText = "CODE_SENT";
            btn.style.background = "#00ff88";
            
            // Store email for code verification
            sessionStorage.setItem('recovery_email', email);
            
            setTimeout(() => {
                hideRecoveryEmail();
                showRecoveryCode();
            }, 1500);
        } else {
            throw new Error(data.message || "Failed to send recovery code");
        }
    } catch (err) {
        alert('ERROR: ' + err.message);
        btn.innerText = "SEND_RECOVERY_CODE";
        btn.disabled = false;
        btn.style.background = "var(--primary)";
    }
}

// 9. RECOVERY CODE VERIFICATION
function showRecoveryCode() {
    const codeOverlay = document.getElementById('recovery-code-overlay');
    if (codeOverlay) {
        codeOverlay.classList.remove('hidden');
        const codeInput = document.getElementById('recovery-code');
        if (codeInput) codeInput.focus();
    }
}

function hideRecoveryCode() {
    const codeOverlay = document.getElementById('recovery-code-overlay');
    const loginOverlay = document.getElementById('admin-login-overlay');
    if (codeOverlay) codeOverlay.classList.add('hidden');
    if (loginOverlay) loginOverlay.classList.remove('hidden');
}

async function verifyRecoveryCode() {
    const code = document.getElementById('recovery-code').value;
    const email = sessionStorage.getItem('recovery_email');
    const btn = document.getElementById('verify-code-btn');

    if (code.length !== 6) {
        alert('Recovery code must be 6 digits');
        return;
    }

    try {
        btn.innerText = "VERIFYING...";
        btn.disabled = true;

        const response = await fetch(`${API_BASE}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: code })
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token and redirect to console
            localStorage.setItem('sys_token', data.token);
            btn.innerText = "ACCESS_GRANTED";
            btn.style.background = "#00ff88";
            
            alert('Recovery successful! Logging you in...');
            
            setTimeout(() => {
                window.location.href = 'console/index.html';
            }, 1500);
        } else {
            throw new Error(data.message || "Invalid recovery code");
        }
    } catch (err) {
        alert('ERROR: ' + err.message);
        btn.innerText = "VERIFY_CODE";
        btn.disabled = false;
        btn.style.background = "var(--primary)";
        document.getElementById('recovery-code').value = '';
    }
}

// EXPOSE FUNCTIONS GLOBALLY FOR HTML ONCLICK HANDLERS
window.toggleTerminal = toggleTerminal;
window.handlePinLogin = handlePinLogin;
window.showRecoveryEmail = showRecoveryEmail;
window.hideRecoveryEmail = hideRecoveryEmail;
window.sendRecoveryCode = sendRecoveryCode;
window.showRecoveryCode = showRecoveryCode;
window.hideRecoveryCode = hideRecoveryCode;

// 7. SIDEBAR NAVIGATION
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    const hamburger = document.getElementById('hamburgerBtn');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar) {
        sidebar.classList.toggle('active');
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    const hamburger = document.getElementById('hamburgerBtn');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar) {
        sidebar.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function openGithub() {
    window.open('https://github.com/Wiston1568', '_blank');
}

function scrollToProjects(e) {
    e.preventDefault();
    closeSidebar();
    const section = document.querySelector('.ecosystem');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToSkills(e) {
    e.preventDefault();
    closeSidebar();
    const section = document.querySelector('.ecosystem');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// EXPOSE SIDEBAR FUNCTIONS GLOBALLY
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.openGithub = openGithub;
window.scrollToProjects = scrollToProjects;
window.scrollToSkills = scrollToSkills;
window.verifyRecoveryCode = verifyRecoveryCode;