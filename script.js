// Character sets
const CHARS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
};

// DOM Elements
const outputEl = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const copyIcon = document.getElementById('copyIcon');
const lengthSlider = document.getElementById('lengthSlider');
const lengthVal = document.getElementById('lengthVal');
const generateBtn = document.getElementById('generateBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const historyList = document.getElementById('passwordHistory');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeBtn = document.querySelector('.close-btn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Toggles
const toggles = {
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    numbers: document.getElementById('numbers'),
    symbols: document.getElementById('symbols')
};

let history = [];

// Functions
function generatePassword() {
    let pool = "";
    Object.keys(toggles).forEach(key => {
        if (toggles[key].checked) pool += CHARS[key];
    });

    if (!pool) return alert("Select at least one character type!");

    let length = lengthSlider.value;
    let password = "";

    // Use crypto API for actual security
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += pool[array[i] % pool.length];
    }

    outputEl.value = password;
    evaluateStrength(password);
    addToHistory(password);
}

function evaluateStrength(password) {
    let strength = 0;
    if (password.length > 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    // Update Bar UI (using CSS variable hack or direct style)
    const bar = document.querySelector('.bar');
    bar.style.setProperty('--strength', `${strength}%`);
    // Note: I used a pseudo element in CSS, so I'll update width directly
    strengthBar.animate([
        { width: strengthBar.style.width || '0%' },
        { width: strength + '%' }
    ], { duration: 500, fill: 'forwards' });

    let label = "Low";
    let color = "#ff4d4d";

    if (strength > 80) { label = "Critical Defense"; color = "#4dff88"; }
    else if (strength > 60) { label = "Strong"; color = "#00f2ff"; }
    else if (strength > 40) { label = "Medium"; color = "#ffb84d"; }

    strengthText.innerText = `Security Level: ${label}`;
    strengthText.style.color = color;
}

function addToHistory(password) {
    history.unshift(password);
    if (history.length > 5) history.pop();

    historyList.innerHTML = history.map(p => `<span>${p}</span>`).join('');
}

async function copyToClipboard() {
    if (!outputEl.value) return;
    try {
        await navigator.clipboard.writeText(outputEl.value);
        copyIcon.innerText = "✅";
        setTimeout(() => copyIcon.innerText = "📋", 1000);
    } catch (err) {
        console.error("Failed to copy!", err);
    }
}

// Listeners
lengthSlider.addEventListener('input', () => {
    lengthVal.innerText = lengthSlider.value;
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// --- MODAL LOGIC ---
aboutBtn.addEventListener('click', () => aboutModal.style.display = 'flex');
closeBtn.addEventListener('click', () => aboutModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === aboutModal) aboutModal.style.display = 'none';
});

// --- THEME LOGIC ---
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggleBtn.innerText = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
});

// Init
generatePassword();

// Logic update 7