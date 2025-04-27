async function loadNavbar() {
  try {
      const response = await fetch("components/navbar.html");
      if (!response.ok) throw new Error("Navbar not found");
      const navbarHTML = await response.text();
      document.body.insertAdjacentHTML("afterbegin", navbarHTML);

      // Ensure translations work after navbar is loaded
      const lang = localStorage.getItem("lang") || "en";
      loadLanguage(lang);

      // Attach event listener after navbar is loaded
      document.getElementById("hamburgerMenu").addEventListener("click", function () {
          this.classList.toggle("active");
          document.getElementById("menuDropdown").classList.toggle("show");
      });

  } catch (error) {
      console.error("Error loading navbar:", error);
  }
}

// Load the navbar once the DOM is ready
document.addEventListener("DOMContentLoaded", loadNavbar);

// for the footer, we will use a different approach
// we fetch the footer.html and insert it between the footer tags
async function loadFooter() {
    try {
        const response = await fetch("components/footer.html");
        if (!response.ok) throw new Error("Footer not found");
        const footerHTML = await response.text();
        document.querySelector("footer").insertAdjacentHTML("beforeend", footerHTML);
    
        // Ensure translations work after footer is loaded
        const lang = localStorage.getItem("lang") || "en";
        loadLanguage(lang);
    
    } catch (error) {
        console.error("Error loading footer:", error);
    }
}

// Load the footer once the DOM is ready
document.addEventListener("DOMContentLoaded", loadFooter);