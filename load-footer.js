// Footer component loader
async function loadFooter() {
  try {
    // Get the current path to determine the correct relative path for components
    const currentPath = window.location.pathname;
    let componentsPath = '/components/footer.html';
    
    // Adjust path based on current directory depth
    if (currentPath.includes('/ai_slides_progress/') || currentPath.includes('/waiting_list/')) {
      componentsPath = '../components/footer.html';
    }
    
    const response = await fetch(componentsPath);
    if (!response.ok) throw new Error("Footer not found");
    
    const footerHTML = await response.text();
    const footerContainer = document.getElementById('footer-container');
    
    if (footerContainer) {
      footerContainer.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

// Load the footer once the DOM is ready
document.addEventListener("DOMContentLoaded", loadFooter); 