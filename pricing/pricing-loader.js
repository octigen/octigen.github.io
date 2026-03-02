/**
 * Pricing Loader - Injects pricing data into both desktop and mobile views
 * Uses PRICING_DATA from pricing-data.js as single source of truth
 */

(function() {
  'use strict';

  // Icons SVG templates
  const ICONS = {
    slides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/><path d="M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>',
    collaboration: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
    security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
  };

  // Get feature value for a plan
  function getFeatureValue(featureKey, planKey) {
    for (const sectionKey of Object.keys(PRICING_DATA.features)) {
      const section = PRICING_DATA.features[sectionKey];
      if (section.items[featureKey]) {
        return section.items[featureKey].values[planKey];
      }
    }
    return null;
  }

  // Render a cell value based on type
  function renderCellValue(value, currency) {
    if (!value) return '';
    
    switch (value.type) {
      case 'included':
        const includedText = value.text || 'Included';
        return `<span class="cell-check">${ICONS.check}${includedText}</span>`;
      
      case 'unavailable':
        return `<span class="cell-x">${ICONS.x}</span>`;
      
      case 'price':
        const priceVal = value[currency] || value.eur;
        let html = `<span class="cell-value price-value" data-eur="${value.eur}" data-chf="${value.chf}">${priceVal}</span>`;
        if (value.sub) {
          const subVal = value.sub[currency] || value.sub.eur;
          html += `<span class="cell-sub price-value" data-eur="${value.sub.eur}" data-chf="${value.sub.chf}">${subVal}</span>`;
        }
        return html;
      
      case 'value':
        let valHtml = `<span class="cell-value${value.highlight ? ' cell-highlight' : ''}">${value.text}</span>`;
        if (value.sub) {
          const subVal = value.sub[currency] || value.sub.eur;
          valHtml += `<span class="cell-sub price-value" data-eur="${value.sub.eur}" data-chf="${value.sub.chf}">${subVal}</span>`;
        }
        return valHtml;
      
      default:
        return value.text || '';
    }
  }

  // Render mobile feature value
  function renderMobileFeatureValue(value, currency, shortValue) {
    if (!value) return '';
    
    switch (value.type) {
      case 'included':
        const includedText = value.text || 'Included';
        return `<span class="cell-check">${ICONS.check}${includedText}</span>`;
      
      case 'unavailable':
        return `<span class="cell-x">${ICONS.x}</span>`;
      
      case 'price':
        if (shortValue) {
          // Extract just the base price for mobile short format
          const priceVal = value[currency] || value.eur;
          const shortPrice = priceVal.replace(' (up to 10 slides)', ' (10 slides)');
          return `<span class="price-value" data-eur="${value.eur.replace(' (up to 10 slides)', ' (10 slides)')}" data-chf="${value.chf.replace(' (up to 10 slides)', ' (10 slides)')}">${shortPrice}</span>`;
        }
        return `<span class="price-value" data-eur="${value.eur}" data-chf="${value.chf}">${value[currency] || value.eur}</span>`;
      
      case 'value':
        return value.text;
      
      default:
        return value.text || '';
    }
  }

  // Generate mobile card features HTML
  function generateMobileCardFeatures(planKey, currency) {
    const config = PRICING_DATA.mobileConfig[planKey];
    if (!config) return '';
    
    let html = '';
    
    for (const section of config.sections) {
      html += `
        <div class="mobile-section-title">
          ${ICONS[section.icon] || ICONS.slides}
          <span>${section.title}</span>
        </div>`;
      
      for (const feature of section.features) {
        const value = getFeatureValue(feature.key, planKey);
        let displayValue;
        
        if (feature.useAvailable && value && value.type === 'included') {
          displayValue = `<span class="cell-check">${ICONS.check}Available</span>`;
        } else {
          displayValue = renderMobileFeatureValue(value, currency, feature.shortValue);
        }
        
        html += `
          <div class="mobile-feature-row">
            <span class="mobile-feature-name">${feature.label}</span>
            <span class="mobile-feature-value">${displayValue}</span>
          </div>`;
      }
    }
    
    return html;
  }

  // Generate mobile cards HTML
  function generateMobileCards(currency, billingPeriod) {
    const plans = PRICING_DATA.plans;
    const billing = billingPeriod || 'annual';
    let html = '';
    
    // Pay-As-You-Go Card
    html += `
      <div class="pricing-card-mobile">
        <div class="pricing-card-mobile-header">
          <h3>${plans.payAsYouGo.name}</h3>
          <p class="plan-tagline">${plans.payAsYouGo.tagline}</p>
          <div class="plan-price">
            <span class="price-main">${plans.payAsYouGo.price.main}</span>
            <span class="price-period">${plans.payAsYouGo.price.period}</span>
          </div>
          <a href="https://cloud.octigen.com/subscribe" class="plan-cta plan-cta-outline" target="_blank" rel="noopener">Subscribe</a>
        </div>
        <div class="pricing-card-mobile-features">
          ${generateMobileCardFeatures('payAsYouGo', currency)}
        </div>
      </div>`;
    
    // Solo Card
    const soloPrice = plans.solo.price;
    const soloIsAnnual = billing === 'annual';
    const soloDisplayPrice = soloPrice[billing] || soloPrice.annual;
    html += `
      <div class="pricing-card-mobile">
        <div class="pricing-card-mobile-header">
          ${soloIsAnnual ? '<span class="early-adopter-badge">-50% EARLY ADOPTERS</span>' : ''}
          <h3>${plans.solo.name}</h3>
          <p class="plan-tagline">${plans.solo.tagline}</p>
          <div class="plan-price${soloIsAnnual ? ' has-discount' : ''}">
            ${soloIsAnnual ? `<span class="price-original price-value" data-eur="${soloPrice.monthly.eur}" data-chf="${soloPrice.monthly.chf}">${soloPrice.monthly[currency]}</span>` : ''}
            <span class="price-main price-value" data-eur="${soloDisplayPrice.eur}" data-chf="${soloDisplayPrice.chf}">${soloDisplayPrice[currency]}</span>
            <span class="price-currency price-value" data-eur="${soloPrice.currency.eur}" data-chf="${soloPrice.currency.chf}">${soloPrice.currency[currency]}</span>
            <span class="price-period">${soloPrice.period}</span>
          </div>
          <a href="https://cloud.octigen.com/subscribe" class="plan-cta plan-cta-primary" target="_blank" rel="noopener">Subscribe</a>
        </div>
        <div class="pricing-card-mobile-features">
          ${generateMobileCardFeatures('solo', currency)}
        </div>
      </div>`;
    
    // Team Card (Featured, Coming Soon)
    const teamPrice = plans.team.price;
    const teamIsAnnual = billing === 'annual';
    const teamDisplayPrice = teamPrice[billing] || teamPrice.annual;
    html += `
      <div class="pricing-card-mobile featured">
        <div class="pricing-card-mobile-header">
          <span class="mobile-featured-label">${plans.team.featuredLabel}</span>
          ${plans.team.comingSoon ? '<span class="coming-soon-badge">COMING SOON</span>' : ''}
          ${teamIsAnnual ? '<span class="early-adopter-badge">-50% EARLY ADOPTERS</span>' : ''}
          <h3>${plans.team.name}</h3>
          <p class="plan-tagline">${plans.team.tagline}</p>
          <div class="plan-price${teamIsAnnual ? ' has-discount' : ''}">
            ${teamIsAnnual ? `<span class="price-original price-value" data-eur="${teamPrice.monthly.eur}" data-chf="${teamPrice.monthly.chf}">${teamPrice.monthly[currency]}</span>` : ''}
            <span class="price-main price-value" data-eur="${teamDisplayPrice.eur}" data-chf="${teamDisplayPrice.chf}">${teamDisplayPrice[currency]}</span>
            <span class="price-currency price-value" data-eur="${teamPrice.currency.eur}" data-chf="${teamPrice.currency.chf}">${teamPrice.currency[currency]}</span>
            <span class="price-period">${teamPrice.period}</span>
          </div>
          <a class="plan-cta plan-cta-outline plan-cta-disabled">Coming Soon</a>
        </div>
        <div class="pricing-card-mobile-features">
          ${generateMobileCardFeatures('team', currency)}
        </div>
      </div>`;
    
    return html;
  }

  // Initialize pricing
  function initPricing() {
    const savedCurrency = localStorage.getItem('octigen-currency') || 'eur';
    const savedBilling = localStorage.getItem('octigen-billing') || 'annual';
    
    // Generate mobile cards
    const mobileContainer = document.querySelector('.pricing-cards-mobile');
    if (mobileContainer) {
      mobileContainer.innerHTML = generateMobileCards(savedCurrency, savedBilling);
    }
    
    // Update all price values based on saved currency
    updateCurrency(savedCurrency);
  }

  // Update currency display
  function updateCurrency(currency) {
    const priceValues = document.querySelectorAll('.price-value');
    priceValues.forEach(function(el) {
      const value = el.getAttribute('data-' + currency);
      if (value) {
        el.textContent = value;
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricing);
  } else {
    initPricing();
  }

  // Expose for currency/billing toggles
  window.PricingLoader = {
    updateCurrency: updateCurrency,
    regenerateMobileCards: function(currency, billingPeriod) {
      const mobileContainer = document.querySelector('.pricing-cards-mobile');
      if (mobileContainer) {
        mobileContainer.innerHTML = generateMobileCards(currency, billingPeriod);
      }
    }
  };
})();
