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

// Function to get the language from the URL parameter or storage
function getLanguageFromURLOrStorage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    const storedLang = localStorage.getItem("lang");
    return urlLang || storedLang || "en"; // Default to English
}

// Function to update the URL without reloading the page
function updateURLWithLanguage(lang) {
    const url = new URL(window.location);
    url.searchParams.set("lang", lang);
    window.history.pushState({}, "", url); // Update the URL
}

// Function to apply translations to elements
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

// Function to load the language file and apply translations
async function loadLanguage(lang) {
    if (!lang) lang = getLanguageFromURLOrStorage();
    localStorage.setItem("lang", lang);
    updateURLWithLanguage(lang);
  
    if (typeof jsyaml === "undefined") {
      await loadScript("https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js");
    }
  
    const page      = (document.body.getAttribute("data-page") || "homepage").replace(/\.[^/.]+$/, "");
    const sources   = [ page, "navbar", "footer" ];
    let translations = {};  // <<-- start with an empty object
  
    // A simple recursive merge
    function mergeDeep(target, src) {
      for (let key in src) {
        if (src[key] && typeof src[key] === "object") {
          if (!target[key] || typeof target[key] !== "object") target[key] = {};
          mergeDeep(target[key], src[key]);
        } else {
          target[key] = src[key];
        }
      }
      return target;
    }
  
    for (let srcName of sources) {
      try {
        const res = await fetch(`/translations/${srcName}/${lang}.yaml`);
        if (!res.ok) throw new Error(res.statusText);
        const doc = jsyaml.load(await res.text());
        mergeDeep(translations, doc);
      }
      catch (e) {
        console.warn(`No translations for ${srcName}/${lang} — skipping.`, e);
      }
    }
  
    applyTranslations(translations);
    document.getElementById("currentLang").innerText = lang.toUpperCase();
    document.dispatchEvent(new CustomEvent("langChanged", { detail: lang }));

}  

// Ensure language is set on page load
document.addEventListener("DOMContentLoaded", () => {
    const lang = getLanguageFromURLOrStorage();
    loadLanguage(lang);
});

// Handle language switching with event delegation
document.body.addEventListener("click", (event) => {
    const target = event.target.closest(".lang-select"); // Ensure it is a .lang-select
    if (target) {
        event.preventDefault();
        const selectedLang = target.getAttribute("data-lang");

        loadLanguage(selectedLang); // Load the new language
    }
});
