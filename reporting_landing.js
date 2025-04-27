(function() {
  const mobileQP = window.matchMedia("(max-width: 768px)");
  if (mobileQP.matches) return;
  window.addEventListener("scroll", () => {
  // 1) if mobile, bail out immediately
  if (window.innerWidth <= 768) return;

  // 2) otherwise run your parallax
  const heroSection   = document.querySelector(".main-hero");
  const scrollPosition = window.scrollY;
  const moveX          = scrollPosition * 0.1;
  const moveY          = scrollPosition * 0.1;

  heroSection.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
  }
  );
  // 3) add a listener to the window resize event
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      // remove the scroll event listener
      window.removeEventListener("scroll", () => {});
    }
  });
})();

// Carousel of messages

const carouselMessagesEN = [
  "An entirely Swiss solution🇨🇭",
  "Flexible hosting solutions",
  "Use PowerPoint, no need to onboard new applications",
  "Develop, design, and iterate faster than ever before",
];

const carouselMessagesDE = [
  "Eine vollständig Schweizer Lösung🇨🇭",
  "Flexible Hosting-Lösungen",
  "Nutzen Sie PowerPoint, keine Notwendigkeit, neue Anwendungen einzuarbeiten",
  "Entwickeln, gestalten und iterieren Sie schneller als je zuvor",
];

const carouselMessagesFR = [
  "Une solution entièrement suisse🇨🇭",
  "Solutions d'hébergement flexibles",
  "Utilisez PowerPoint, pas besoin d'intégrer de nouvelles applications",
  "Développez, concevez et itérez plus vite que jamais",
];

const carouselMessagesIT = [
  "Una soluzione interamente svizzera🇨🇭",
  "Soluzioni di hosting flessibili",
  "Usa PowerPoint, non è necessario integrare nuove applicazioni",
  "Sviluppa, progetta e itera più velocemente che mai",
];

function slidingMessages() {
  let i = 0;
  const currentMessage = document.getElementById("features-carousel-message");

  function getMessages() {
    const lang = localStorage.getItem("lang") || "en";
    switch (lang) {
      case "de":
        return carouselMessagesDE;
      case "fr":
        return carouselMessagesFR;
      case "it":
        return carouselMessagesIT;
      default:
        return carouselMessagesEN;
    }
  }

  function showMessage() {
    const msgs = getMessages();
    currentMessage.innerText = msgs[i % msgs.length];
  }

  // initial
  showMessage();

  const intervalId = setInterval(() => {
    currentMessage.classList.add("fade-out");
    setTimeout(() => {
      i++;
      showMessage();
      currentMessage.classList.remove("fade-out");
    }, 500);
  }, 5000);

  // listen for language switches
  document.addEventListener("langChanged", () => {
    i = 0; // restart at first slide
    showMessage(); // immediately swap to first msg in new language
  });
}

document.addEventListener("DOMContentLoaded", slidingMessages);
