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