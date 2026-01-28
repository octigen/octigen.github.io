/**
 * Business Professionals Landing Page Scripts
 * Comparison data and render functions for /use-cases/business-professionals/
 */

/**
 * Comparison Data for Business Professionals Page
 * Octigen vs Generic AI Tools vs Manual Work
 */
const comparisonData = [
  {
    feature: "Brand Compliance",
    octigen: "100% on-brand, uses your corporate templates and guidelines",
    others: "Generic layouts that require extensive manual reformatting"
  },
  {
    feature: "Data Accuracy",
    octigen: "Deterministic data injection, no hallucinated numbers",
    others: "AI may fabricate statistics or misquote sources"
  },
  {
    feature: "Time to Deck",
    octigen: "Minutes, from research to client-ready presentation",
    others: "Hours of copy-paste, formatting, and verification"
  },
  {
    feature: "Output Quality",
    octigen: "Native PPTX fully editable for last-mile tweaks",
    others: "Images, PDFs, or text that needs rebuilding in PowerPoint"
  },
  {
    feature: "Research Integration",
    octigen: "Import from URLs, PDFs, and databases in one workflow",
    others: "Manual copy-paste between browser, PDF reader, and slides"
  },
  {
    feature: "Human Control",
    octigen: "You architect the story, AI proposes, you decide",
    others: "Take-it-or-leave-it outputs with limited customization"
  },
  {
    feature: "Chart & Table Handling",
    octigen: "Live data links, update source, slides update automatically",
    others: "Static screenshots that break when data changes"
  },
  // {
  //   feature: "Compliance & Audit",
  //   octigen: "Full traceability, know exactly where each data point came from",
  //   others: "Black-box generation with no source attribution"
  // },
  {
    feature: "Enterprise Security",
    octigen: "Deploy on your infra, data never leaves your environment",
    others: "Send sensitive research to third-party servers"
  },
  {
    feature: "Flat Learning Curve",
    octigen: "Work in PowerPoint, a tool you already master",
    others: "Learn new interfaces or prompt engineering techniques"
  }
];

/**
 * Renders the comparison ticker with all items scrolling
 */
function renderComparisonTicker() {
  const container = document.querySelector('.comparison-ticker-track');
  if (!container) return;
  
  let tickerHTML = '';
  
  // Generate ticker items (doubled for seamless loop)
  for (let i = 0; i < 2; i++) {
    comparisonData.forEach(item => {
      tickerHTML += `
        <div class="ticker-item ticker-octigen-item">
          <span class="ticker-icon">✓</span>
          <span class="ticker-label">OCTIGEN</span>
          <span class="ticker-text">${item.octigen}</span>
        </div>
        <div class="ticker-item ticker-other-item">
          <span class="ticker-icon">✗</span>
          <span class="ticker-label">OTHERS</span>
          <span class="ticker-text">${item.others}</span>
        </div>
      `;
    });
  }
  
  container.innerHTML = tickerHTML;
}

/**
 * Renders the comparison table
 */
function renderComparisonTable() {
  const tbody = document.querySelector('.comparison-table tbody');
  if (!tbody) return;
  
  let tableHTML = '';
  
  comparisonData.forEach(item => {
    tableHTML += `
      <tr>
        <td class="feature-cell">${item.feature}</td>
        <td class="octigen-cell">
          <span class="cell-icon cell-icon-check">✓</span>
          ${item.octigen}
        </td>
        <td class="others-cell">
          <span class="cell-icon cell-icon-cross">✗</span>
          ${item.others}
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = tableHTML;
}

/**
 * Initialize comparison section on DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
  renderComparisonTicker();
  renderComparisonTable();
});
