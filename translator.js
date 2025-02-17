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

async function loadLanguage(lang) {
    localStorage.setItem('lang', lang);

    try {
        if (typeof jsyaml === "undefined") {
            await loadScript("https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js");
        }
        const response = await fetch(`/translations/homepage/${lang}.yaml`);
        const yamlText = await response.text();
        const translations = jsyaml.load(yamlText);
        applyTranslations(translations);
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

function applyTranslations(translations) {
    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        const keys = key.split(".");
        let translation = translations;
        
        keys.forEach(k => translation = translation[k] || el.innerHTML);

        if (el.hasAttribute("placeholder")) {
            el.setAttribute("placeholder", translation);
        } else {
            el.innerHTML = translation; // Allow HTML formatting like <a> tags
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "en";
    loadLanguage(lang);
    document.getElementById("currentLang").innerText = lang.toUpperCase();
  
    document.querySelectorAll(".lang-select").forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            const selectedLang = event.target.getAttribute("data-lang");
            loadLanguage(selectedLang);
            document.getElementById("currentLang").innerText = selectedLang.toUpperCase();
        });
    });
  });