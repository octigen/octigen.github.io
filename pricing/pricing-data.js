/**
 * Pricing Data - Single Source of Truth
 * All pricing information for both desktop table and mobile cards
 */
const PRICING_DATA = {
  // Plan base prices
  plans: {
    payAsYouGo: {
      name: "Pay-As-You-Go",
      tagline: "Occasional use",
      price: {
        main: "Free",
        period: "to start"
      },
    },
    personal: {
      name: "Personal",
      tagline: "For Private Use",
      earlyAdopterDiscount: true,
      price: {
        original: { eur: "22", chf: "20" },
        main: { eur: "11", chf: "10" },
        currency: { eur: "EUR", chf: "CHF" },
        period: "/ month"
      },
    },
    business: {
      name: "Business",
      tagline: "For teams & enterprises",
      featured: true,
      featuredLabel: "Best for Teams",
      earlyAdopterDiscount: true,
      price: {
        original: { eur: "110", chf: "100" },
        main: { eur: "55", chf: "50" },
        currency: { eur: "EUR", chf: "CHF" },
        period: "/ month per user"
      },
    }
  },

  // Features by section
  features: {
    slideServices: {
      title: "Slide Services",
      icon: "slides",
      items: {
        slideDiffing: {
          name: "Slide Diffing",
          description: "Compare two PowerPoint presentations",
          values: {
            payAsYouGo: { type: "price", eur: "5 EUR / deck", chf: "5 CHF / deck" },
            personal: { type: "included" },
            business: { type: "included" }
          }
        },
        translations: {
          name: "Slide Deck Translations",
          description: "Translate PowerPoint presentations to any language",
          values: {
            payAsYouGo: { 
              type: "price", 
              eur: "5 EUR (up to 10 slides)", 
              chf: "5 CHF (up to 10 slides)",
              sub: { eur: "+0.50 EUR / extra slide", chf: "+0.50 CHF / extra slide" }
            },
            personal: { type: "included" },
            business: { type: "included" }
          }
        },
        updateBranding: {
          name: "Update Branding of Deck",
          description: "Update the branding of a PowerPoint deck to your company's brand",
          values: {
            payAsYouGo: { 
              type: "price", 
              eur: "5 EUR (up to 10 slides)", 
              chf: "5 CHF (up to 10 slides)",
              sub: { eur: "+0.50 EUR / extra slide", chf: "+0.50 CHF / extra slide" }
            },
            personal: { type: "included" },
            business: { type: "included" }
          }
        }
      }
    },
    aiFeatures: {
      title: "AI-Powered Creation",
      icon: "ai",
      items: {
        aiSlideCreation: {
          name: "AI Slide Creation",
          description: "Generate slides from templates with AI",
          values: {
            payAsYouGo: { type: "unavailable" },
            personal: { 
              type: "value", 
              text: "100 slides / month",
              sub: { eur: "+0.11 EUR / extra", chf: "+0.10 CHF / extra" }
            },
            business: { 
              type: "value", 
              text: "500 slides / month",
              sub: { eur: "+0.11 EUR / extra", chf: "+0.10 CHF / extra" }
            }
          }
        },
        aiTokens: {
          name: "AI Content Tokens",
          description: "For AI-generated content creation",
          values: {
            payAsYouGo: { type: "unavailable" },
            personal: { 
              type: "value", 
              text: "1M tokens / month",
              sub: { eur: "+11 EUR / 1M extra", chf: "+10 CHF / 1M extra" }
            },
            business: { 
              type: "value", 
              text: "5M tokens / month",
              sub: { eur: "+11 EUR / 1M extra", chf: "+10 CHF / 1M extra" }
            }
          }
        }
      }
    },
    collaboration: {
      title: "Workspaces & Collaboration",
      icon: "collaboration",
      items: {
        workspaces: {
          name: "Workspaces",
          description: "Organize templates and workflows",
          values: {
            payAsYouGo: { type: "unavailable" },
            personal: { type: "value", text: "1 workspace" },
            business: { 
              type: "value", 
              text: "1 workspace included",
              sub: { eur: "+110 EUR / extra", chf: "+100 CHF / extra" }
            }
          }
        },
        teamSharing: {
          name: "Team Sharing",
          description: "Share workspaces with team members",
          values: {
            payAsYouGo: { type: "unavailable" },
            personal: { type: "unavailable" },
            business: { type: "included" }
          }
        },
        jsonApi: {
          name: "JSON-to-PowerPoint API",
          description: "Programmatic slide generation",
          values: {
            payAsYouGo: { type: "unavailable" },
            personal: { type: "unavailable" },
            business: { type: "included" }
          }
        }
      }
    },
    dataSecurity: {
      title: "Data & Security",
      icon: "security",
      items: {
        dataLocation: {
          name: "Data at Rest Location",
          description: "Where your files are stored",
          values: {
            payAsYouGo: { type: "value", text: "Worldwide" },
            personal: { type: "value", text: "Worldwide" },
            business: { type: "value", text: "EU (Sovereign provider)", highlight: true }
          }
        },
        aiLocation: {
          name: "AI Model Location",
          description: "Where AI processing happens",
          values: {
            payAsYouGo: { type: "value", text: "Worldwide" },
            personal: { type: "value", text: "Worldwide" },
            business: { type: "value", text: "EU (US Provider)", highlight: true }
          }
        }
      }
    },
    support: {
      title: "Support",
      icon: "support",
      items: {
        communityChat: {
          name: "Community & Chat",
          description: "",
          values: {
            payAsYouGo: { type: "included", text: "Free" },
            personal: { type: "included", text: "Free" },
            business: { type: "included", text: "Free" }
          }
        },
        premiumSupport: {
          name: "Premium Support",
          description: "Senior consulting team",
          values: {
            payAsYouGo: { type: "unavailable" },
            personal: { type: "price", eur: "220 EUR / hour", chf: "200 CHF / hour" },
            business: { type: "price", eur: "220 EUR / hour", chf: "200 CHF / hour" }
          }
        }
      }
    }
  },

  // Enterprise add-ons (Business plan only)
  enterprise: {
    euPrivateCloud: {
      badge: "Managed Cloud",
      name: "EU Private Cloud",
      description: "Data at rest hosted on a dedicated EU cloud instance",
      price: { eur: "2,200 EUR", chf: "2,000 CHF" },
      period: "/ year",
      bonus: "Early adopter rebate: Free 2h support"
    },
    swissPrivateCloud: {
      badge: "Managed Cloud",
      name: "Swiss Private Cloud",
      description: "Data at rest hosted on a dedicated Swiss cloud instance",
      price: { eur: "5,500 EUR", chf: "5,000 CHF" },
      period: "/ year",
      bonus: "Early adopter rebate: Free 5h support"
    },
    swissAiUsProvider: {
      badge: "AI Model",
      name: "Swiss-Hosted AI (US Provider)",
      description: "AI model hosted in Switzerland via US cloud provider",
      price: { eur: "5,500 EUR", chf: "5,000 CHF" },
      period: "/ year",
      bonus: "Early adopter rebate: Free 5h support"
    },
    sovereignAi: {
      badge: "AI Model",
      name: "Sovereign AI (EU/CH)",
      description: "AI model at a sovereign (non-US) provider in EU or CH",
      price: { text: "On request" },
      period: ""
    },
    onPremise: {
      badge: "On-Premise",
      badgeHighlight: true,
      name: "Full On-Premise Deployment",
      description: "Deploy Octigen entirely within your own infrastructure with optional on-premise AI",
      price: { eur: "22,000 EUR", chf: "20,000 CHF" },
      period: "/ year",
      bonus: "Early adopter rebate: Free 20h support",
      highlight: true
    }
  },

  // Mobile card configuration (which features to show and how)
  mobileConfig: {
    payAsYouGo: {
      sections: [
        {
          title: "Core Features",
          icon: "slides",
          features: [
            { key: "slideDiffing", label: "Slide Deck Diffs" },
            { key: "translations", label: "Translations", shortValue: true },
            { key: "updateBranding", label: "Transform to Template", shortValue: true }
          ]
        },
        {
          title: "AI-Powered Creation",
          icon: "ai",
          features: [
            { key: "aiSlideCreation", label: "AI Slide Creation" },
            { key: "aiTokens", label: "AI Tokens" }
          ]
        },
        {
          title: "Workspaces",
          icon: "collaboration",
          features: [
            { key: "workspaces", label: "Workspaces" }
          ]
        }
      ]
    },
    personal: {
      sections: [
        {
          title: "Core Features",
          icon: "slides",
          features: [
            { key: "slideDiffing", label: "Slide Deck Diffs" },
            { key: "translations", label: "Translations" },
            { key: "updateBranding", label: "Transform to Template" }
          ]
        },
        {
          title: "AI-Powered Creation",
          icon: "ai",
          features: [
            { key: "aiSlideCreation", label: "AI Slide Creation" },
            { key: "aiTokens", label: "AI Tokens" }
          ]
        },
        {
          title: "Workspaces",
          icon: "collaboration",
          features: [
            { key: "workspaces", label: "Workspaces" }
          ]
        }
      ]
    },
    business: {
      sections: [
        {
          title: "Core Features",
          icon: "slides",
          features: [
            { key: "slideDiffing", label: "Slide Deck Diffs" },
            { key: "translations", label: "Translations" },
            { key: "updateBranding", label: "Transform to Template" }
          ]
        },
        {
          title: "AI-Powered Creation",
          icon: "ai",
          features: [
            { key: "aiSlideCreation", label: "AI Slide Creation" },
            { key: "aiTokens", label: "AI Tokens" }
          ]
        },
        {
          title: "Workspaces",
          icon: "collaboration",
          features: [
            { key: "workspaces", label: "Workspaces" },
            { key: "jsonApi", label: "Enterprise Add-ons", useAvailable: true }
          ]
        }
      ]
    }
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRICING_DATA;
}
