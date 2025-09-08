// config.js
window.APP_CONFIG = {
  ENV: "production",
  STAGING: {
    API_BASE: "https://luther-tech-health-pdmd.vercel.app",
    SITE_BASE: "https://luther-tech-health.vercel.app",
  },
  PRODUCTION: {
    API_BASE: "https://luther-tech-health-pdmd.vercel.app",
    SITE_BASE: "https://www.luthertech.co.uk",
  },
  DEV: {
    API_BASE: "http://localhost:3000",
    SITE_BASE: "http://localhost:5173",
  },
};
