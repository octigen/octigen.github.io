// Function to dynamically load an external script
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function getLanguageFromHashOrStorage() {
    const hashLang = window.location.hash.replace("#", "");
    const storedLang = localStorage.getItem("lang");
    return hashLang || storedLang || "en";
}

function applyTranslations(translations) {
    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        const keys = key.split(".");
        let translation = translations;
        
        keys.forEach(k => translation = translation[k] || key); // Fallback if missing

        // Handle placeholders separately for input & textarea elements
        if (el.hasAttribute("placeholder")) {
            el.setAttribute("placeholder", translation);
        } else {
            el.innerHTML = translation; // Allow HTML formatting like <a> tags
        }
    });
}

async function loadLanguage(lang) {
    if (!lang) {
        lang = getLanguageFromHash();
    }

    localStorage.setItem("lang", lang);

    try {
        if (typeof jsyaml === "undefined") {
            await loadScript("https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js");
        }

        let page = document.body.getAttribute("data-page") || "homepage";
        page = page.replace(/\.[^/.]+$/, ""); // Remove file extension if present

        const response = await fetch(`/translations/${page}/${lang}.yaml`);

        const yamlText = await response.text();
        const translations = jsyaml.load(yamlText);
        applyTranslations(translations);
    } catch (error) {
        console.error("Error loading translations:", error);
    }

    document.getElementById("currentLang").innerText = lang.toUpperCase();
}

// Ensure language is set on page load
document.addEventListener("DOMContentLoaded", () => {
    const lang = getLanguageFromHashOrStorage();
    loadLanguage(lang);

    document.getElementById("currentLang").innerText = lang.toUpperCase();
});

document.body.addEventListener("click", (event) => {
    const target = event.target.closest(".lang-select"); // Ensure it is a .lang-select
    if (target) {
        event.preventDefault();
        const selectedLang = target.getAttribute("data-lang");

        // Change URL hash to update language without reloading
        window.location.hash = selectedLang;
        loadLanguage(selectedLang);
    }
});
