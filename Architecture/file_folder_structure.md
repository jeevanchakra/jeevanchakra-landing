jeevan-chakra/
│
├── index.html                                  # Main page skeleton, loads all sections
├── styles.css                                  # Global CSS only (fonts, resets, animations)
├── tailwind-config.js                          # Tailwind color config (jc-teal, jc-green, jc-amber)
├── thank-you.html                              # Form submission success page
│
├── components/
│   │
│   ├── header.html                             # Navigation bar HTML structure
│   ├── header.css                              # Header-specific styles (nav, mobile menu)
│   ├── header.js                               # Mobile menu toggle, scroll highlighting
│   │
│   ├── footer.html                             # Footer HTML with 4 columns (About, Links, Legal, Contact)
│   ├── footer.css                              # Footer-specific styles
│   │
│   ├── hero/
│   │   ├── hero.html                           # Carousel with 4 slides HTML
│   │   ├── hero.css                            # Carousel animations, slide transitions
│   │   └── hero.js                             # Carousel auto-rotate, navigation logic
│   │
│   ├── manifesto/
│   │   ├── manifesto.html                      # Vision/Manifesto section HTML
│   │   └── manifesto.css                       # Manifesto card styles (if needed)
│   │
│   ├── why-choose/
│   │   ├── why-choose.html                     # 6 reasons grid HTML
│   │   ├── why-choose.css                      # Card hover effects, animations
│   │   └── why-choose.js                       # Interactive card behaviors (if needed)
│   │
│   ├── system/
│   │   ├── system.html                         # 4 JC cards (Shield/Growth/Flow/Gyaan) HTML
│   │   ├── system.css                          # Card expand/collapse animations
│   │   └── system.js                           # Card toggle logic
│   │
│   ├── pricing/
│   │   ├── pricing.html                        # Fee structure + investment recommendation HTML
│   │   └── pricing.css                         # Pricing card styles, gradients
│   │
│   ├── faq/
│   │   ├── faq.html                            # 8 FAQ items accordion HTML
│   │   ├── faq.css                             # Accordion open/close animations
│   │   └── faq.js                              # FAQ toggle expand/collapse logic
│   │
│   └── waitlist/
│       ├── waitlist.html                       # Contact form HTML with legal notice
│       ├── waitlist.css                        # Form field styles, validation states
│       └── waitlist.js                         # Form validation + Apps Script submission
│
└── legal/
    ├── privacy-policy.html                     # Privacy policy full page
    ├── refund-policy.html                      # Refund policy full page
    ├── terms-of-service.html                   # Terms of service full page
    ├── disclaimer.html                         # Investment disclaimer full page
    ├── data-protection.html                    # DPDP Act 2023 compliance full page
    ├── cookie-policy.html                      # Cookie usage policy full page
    └── aml-kyc.html                            # Anti-money laundering KYC policy full page