// 1. Importation du dictionnaire
import translations from './i18n.js';

// --- ANIMATIONS AU SCROLL ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- GESTION DU THÈME ---
// On l'attache à window pour que le onclick du HTML le trouve
window.toggleTheme = function() {
    const body = document.body;
    const checkbox = document.getElementById('checkbox'); // Assure-toi que l'id correspond à ton switch thème
    
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// --- GESTION DES LANGUES ---
let currentLang = 'fr';

window.toggleLang = function() {
    const checkbox = document.getElementById('lang-checkbox');
    currentLang = checkbox.checked ? 'en' : 'fr';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });
    
    localStorage.setItem('preferred-lang', currentLang);
}

// --- INITIALISATION AU CHARGEMENT ---
document.addEventListener('DOMContentLoaded', () => {
    // Restaurer la langue
    const savedLang = localStorage.getItem('preferred-lang');
    const langCheckbox = document.getElementById('lang-checkbox');
    if (savedLang === 'en' && langCheckbox) {
        langCheckbox.checked = true;
        window.toggleLang(); 
    }

    // Restaurer le thème
    const savedTheme = localStorage.getItem('theme');
    const themeCheckbox = document.getElementById('checkbox');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeCheckbox) themeCheckbox.checked = true;
    }
});

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.innerHTML = "✨ Message envoyé avec succès !";
                status.style.color = "var(--accent)";
                status.style.display = "block";
                form.reset();
            } else {
                status.innerHTML = "❌ Une erreur est survenue.";
                status.style.color = "red";
                status.style.display = "block";
            }
        } catch (error) {
            status.innerHTML = "❌ Impossible d'envoyer le message.";
            status.style.display = "block";
        }
    });
}