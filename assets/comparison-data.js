/**
 * Comparison Data for Fund Reporting Page
 * This file contains all the comparison texts between Octigen and other tools.
 * Edit this file to update the comparison content across both ticker and table.
 */

const comparisonData = [
  {
    feature: "Flat Learning Curve",
    octigen: "Use PowerPoint, a tool your team already masters",
    others: "Weeks of training on proprietary design tools"
  },
  {
    feature: "Template Creation",
    octigen: "Templating by example: no coding, no new languages",
    others: "Steep learning curves with rigid template builders"
  },
  {
    feature: "Output Format",
    octigen: "Native PPTX output, fully editable with no vendor lock-in",
    others: "Exports locked PDFs or non-editable formats"
  },
  {
    feature: "Brand Compliance",
    octigen: "Pixel-perfect branded reports that match your guidelines",
    others: "Compromise on design due to tool limitations"
  },
  {
    feature: "Last-Minute Edits",
    octigen: "Last-minute edits directly in PowerPoint before sending",
    others: "Charts are screenshots, small tweaks restart entire production"
  },
  {
    feature: "Data Updates",
    octigen: "Live data links keep your data (e.g. AUM, holdings...) current",
    others: "Manual copy-paste of data into templates each month"
  },
  {
    feature: "Deployment Options",
    octigen: "Deploy on AWS, Azure, GCP or your own infrastructure",
    others: "Regulatory headaches with third-party SaaS platforms"
  },
  {
    feature: "Data Sovereignty",
    octigen: "Data never leaves your environment in self-hosted deployments",
    others: "Client data stored on vendor servers outside your control"
  },
  {
    feature: "Developer API",
    octigen: "RESTful API for developers, JSON-to-PowerPoint in seconds",
    others: "Clunky integrations or no API access at all"
  },
  {
    feature: "AI Capabilities",
    octigen: "AI assistants for ad-hoc decks, with guardrails to stay on-brand",
    others: "Either no AI or generic outputs that miss your brand identity"
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
 * Initialize comparison section
 */
document.addEventListener('DOMContentLoaded', function() {
  renderComparisonTicker();
  renderComparisonTable();
});
