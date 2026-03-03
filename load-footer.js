// ===========================================
// Footer Component Loader (Single Source of Truth)
// ===========================================
// This is the ONLY file that should load the footer.
// Do NOT duplicate this functionality elsewhere!

async function loadFooter() {
  try {
    const cacheBuster = '?v=' + Date.now();
    const response = await fetch('/components/footer.html' + cacheBuster);
    if (!response.ok) throw new Error("Footer not found: " + response.status);
    
    const footerHTML = await response.text();
    const footerContainer = document.getElementById('footer-container');
    
    if (footerContainer) {
      footerContainer.innerHTML = footerHTML;

      footerContainer.querySelectorAll('.footer-address[data-u]').forEach(function(el) {
        var e = el.dataset.u + ' [at] ' + el.dataset.d;
        var p = el.dataset.pa + ' ' + el.dataset.pb;
        el.textContent = e + ' \u00b7 ' + p;
      });
      
      // Ensure translations work after footer is loaded
      if (typeof loadLanguage === 'function') {
        const lang = localStorage.getItem("lang") || "en";
        loadLanguage(lang);
      }
    }
  } catch (error) {
    console.error("[Footer] Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadFooter);
