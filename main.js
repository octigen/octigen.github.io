document.getElementById("hamburgerMenu").addEventListener("click", function () {
  this.classList.toggle("active");
  document.getElementById("menuDropdown").classList.toggle("show");
});