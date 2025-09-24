/**
 * Octigen Cookie Consent Manager
 * GDPR Compliant Cookie Consent Solution
 * Version 1.0
 */

class OctigenCookieConsent {
  constructor() {
    this.consentData = {
      necessary: true, // Always true, required for basic functionality
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    this.consentKey = 'octigen_cookie_consent';
    this.consentVersion = '1.0';
    this.init();
  }

  init() {
    // Check if consent has already been given
    const savedConsent = this.getSavedConsent();
    
    if (savedConsent && savedConsent.version === this.consentVersion) {
      this.consentData = { ...this.consentData, ...savedConsent.preferences };
      this.loadServices();
    } else {
      this.showConsentBanner();
    }
    
    // Add event listeners
    this.addEventListeners();
  }

  getSavedConsent() {
    try {
      const saved = localStorage.getItem(this.consentKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveConsent(preferences) {
    const consentRecord = {
      preferences: preferences,
      timestamp: new Date().toISOString(),
      version: this.consentVersion,
      userAgent: navigator.userAgent
    };
    
    try {
      localStorage.setItem(this.consentKey, JSON.stringify(consentRecord));
      return true;
    } catch (e) {
      console.warn('Could not save cookie consent preferences');
      return false;
    }
  }

  showConsentBanner() {
    // Remove existing banner if any
    const existing = document.getElementById('cookie-consent-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <div class="cookie-consent-text">
          <h4>🍪 We use cookies</h4>
          <p>We use cookies to enhance your experience, analyze our traffic, and for marketing purposes. 
          You can manage your preferences or learn more in our <a href="/privacy_policy.html" target="_blank">Privacy Policy</a>.</p>
        </div>
        <div class="cookie-consent-actions">
          <button id="cookie-reject" class="btn btn-outline-secondary me-2">Reject All</button>
          <button id="cookie-customize" class="btn btn-outline-primary me-2">Customize</button>
          <button id="cookie-accept" class="btn btn-primary">Accept All</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    
    // Force banner to be visible
    setTimeout(() => banner.classList.add('show'), 100);
  }

  showCustomizeModal() {
    // Remove existing modal if any
    const existing = document.getElementById('cookie-customize-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'cookie-customize-modal';
    modal.className = 'cookie-modal-overlay';
    modal.innerHTML = `
      <div class="cookie-modal">
        <div class="cookie-modal-header">
          <h3>Cookie Preferences</h3>
          <button id="cookie-modal-close" class="btn-close" aria-label="Close">&times;</button>
        </div>
        <div class="cookie-modal-body">
          <p>Choose which cookies you want to accept. You can change these settings at any time.</p>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h5>🔒 Necessary Cookies</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="necessary-toggle" checked disabled>
                <label class="form-check-label" for="necessary-toggle">Always Active</label>
              </div>
            </div>
            <p class="cookie-category-description">These cookies are essential for the website to function properly. They cannot be disabled.</p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <h5>📊 Analytics Cookies</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="analytics-toggle" ${this.consentData.analytics ? 'checked' : ''}>
                <label class="form-check-label" for="analytics-toggle">Enable</label>
              </div>
            </div>
            <p class="cookie-category-description">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously via Google Analytics.</p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <h5>🎯 Marketing Cookies</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="marketing-toggle" ${this.consentData.marketing ? 'checked' : ''}>
                <label class="form-check-label" for="marketing-toggle">Enable</label>
              </div>
            </div>
            <p class="cookie-category-description">These cookies may be set through our site by our advertising partners to build a profile of your interests.</p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <h5>⚙️ Preference Cookies</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="preferences-toggle" ${this.consentData.preferences ? 'checked' : ''}>
                <label class="form-check-label" for="preferences-toggle">Enable</label>
              </div>
            </div>
            <p class="cookie-category-description">These cookies allow the website to remember choices you make and provide enhanced, more personal features.</p>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button id="cookie-save-preferences" class="btn btn-primary">Save Preferences</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
  }

  hideConsentBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    }
  }

  hideCustomizeModal() {
    const modal = document.getElementById('cookie-customize-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  }

  acceptAll() {
    this.consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    this.saveConsent(this.consentData);
    this.loadServices();
    this.hideConsentBanner();
  }

  rejectAll() {
    this.consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    this.saveConsent(this.consentData);
    this.loadServices();
    this.hideConsentBanner();
  }

  saveCustomPreferences() {
    this.consentData = {
      necessary: true,
      analytics: document.getElementById('analytics-toggle')?.checked || false,
      marketing: document.getElementById('marketing-toggle')?.checked || false,
      preferences: document.getElementById('preferences-toggle')?.checked || false
    };
    this.saveConsent(this.consentData);
    this.loadServices();
    this.hideCustomizeModal();
    this.hideConsentBanner();
  }

  loadServices() {
    // Load Google Analytics if analytics consent is given
    if (this.consentData.analytics) {
      this.loadGoogleAnalytics();
    } else {
      this.disableGoogleAnalytics();
    }

    // Dispatch custom event for other services
    document.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: this.consentData
    }));
  }

  loadGoogleAnalytics() {
    // Only load if not already loaded
    if (!window.gtag) {
      // Create script elements
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-5PECZ000XN';
      document.head.appendChild(gtagScript);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-5PECZ000XN', {
        anonymize_ip: true, // IP anonymization for GDPR
        allow_google_signals: false, // Disable advertising features
        allow_ad_personalization_signals: false
      });
    }
  }

  disableGoogleAnalytics() {
    // Disable Google Analytics if it was loaded
    if (window.gtag) {
      gtag('config', 'G-5PECZ000XN', {
        'client_storage': 'none'
      });
    }
    
    // Set opt-out flag
    window['ga-disable-G-5PECZ000XN'] = true;
  }

  addEventListeners() {
    // Use event delegation for dynamically created elements
    document.addEventListener('click', (e) => {
      switch (e.target.id) {
        case 'cookie-accept':
          e.preventDefault();
          this.acceptAll();
          break;
        case 'cookie-reject':
          e.preventDefault();
          this.rejectAll();
          break;
        case 'cookie-customize':
          e.preventDefault();
          this.showCustomizeModal();
          break;
        case 'cookie-save-preferences':
          e.preventDefault();
          this.saveCustomPreferences();
          break;
        case 'cookie-modal-close':
          e.preventDefault();
          this.hideCustomizeModal();
          break;
        case 'cookie-settings-link':
          e.preventDefault();
          this.showCustomizeModal();
          break;
      }
    });

    // Close modal when clicking overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('cookie-modal-overlay')) {
        this.hideCustomizeModal();
      }
    });
  }

  // Public method to get current consent status
  getConsent() {
    return { ...this.consentData };
  }

  // Public method to reset consent (for testing or user request)
  resetConsent() {
    localStorage.removeItem(this.consentKey);
    location.reload();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.octigenCookieConsent = new OctigenCookieConsent();
});
