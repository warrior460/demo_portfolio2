/* =========================================================
   SHARED DATA LAYER
   Used by both the public website (js/main.js) and the
   Admin Panel (admin/js/admin.js). Everything is persisted
   in the browser's localStorage so edits survive refreshes
   and sync live between open tabs on this device.
   ========================================================= */

(function (global) {

  const KEYS = {
    content: 'aas_site_content_v1',
    theme: 'aas_site_theme_v1',
    auth: 'aas_admin_auth_v1'
  };

  const DEFAULT_THEME = 'amber-navy';

  // Variable names below must match the custom properties defined in
  // css/style.css's :root block exactly — that's how applying a theme
  // re-skins the whole site with no per-element code.
  const THEMES = {
    'amber-navy': {
      label: 'Amber Navy',
      swatch: ['#0A0D13', '#C9A24B', '#5FB7C7'],
      vars: {
        '--bg': '#0A0D13', '--bg-2': '#0F1420',
        '--surface': '#131A28', '--surface-2': '#161F30',
        '--border': 'rgba(233,238,247,0.09)', '--border-strong': 'rgba(233,238,247,0.16)',
        '--text': '#E9EEF7', '--text-dim': '#97A1B5', '--text-faint': '#5D6579',
        '--accent': '#C9A24B', '--accent-soft': 'rgba(201,162,75,0.14)',
        '--accent-2': '#5FB7C7', '--accent-2-soft': 'rgba(95,183,199,0.12)'
      }
    },
    'charcoal-ember': {
      label: 'Charcoal Ember',
      swatch: ['#161311', '#E0733C', '#7FA8C9'],
      vars: {
        '--bg': '#161311', '--bg-2': '#1C1815',
        '--surface': '#211C18', '--surface-2': '#28221D',
        '--border': 'rgba(245,238,230,0.08)', '--border-strong': 'rgba(245,238,230,0.15)',
        '--text': '#F3EEE7', '--text-dim': '#A89C8E', '--text-faint': '#6B6156',
        '--accent': '#E0733C', '--accent-soft': 'rgba(224,115,60,0.15)',
        '--accent-2': '#7FA8C9', '--accent-2-soft': 'rgba(127,168,201,0.13)'
      }
    },
    'slate-violet': {
      label: 'Slate Violet',
      swatch: ['#100E1A', '#9B7BFF', '#5EEAD4'],
      vars: {
        '--bg': '#100E1A', '--bg-2': '#141224',
        '--surface': '#191631', '--surface-2': '#211C3D',
        '--border': 'rgba(232,228,247,0.09)', '--border-strong': 'rgba(232,228,247,0.17)',
        '--text': '#EDEBF7', '--text-dim': '#A19DC0', '--text-faint': '#615C82',
        '--accent': '#9B7BFF', '--accent-soft': 'rgba(155,123,255,0.16)',
        '--accent-2': '#5EEAD4', '--accent-2-soft': 'rgba(94,234,212,0.14)'
      }
    },
    'emerald-ink': {
      label: 'Emerald Ink',
      swatch: ['#0A130F', '#34D399', '#F2C14E'],
      vars: {
        '--bg': '#0A130F', '--bg-2': '#0D1913',
        '--surface': '#122A1F', '--surface-2': '#163527',
        '--border': 'rgba(232,245,238,0.09)', '--border-strong': 'rgba(232,245,238,0.16)',
        '--text': '#E9F5EF', '--text-dim': '#93AFA4', '--text-faint': '#5B7A6D',
        '--accent': '#34D399', '--accent-soft': 'rgba(52,211,153,0.15)',
        '--accent-2': '#F2C14E', '--accent-2-soft': 'rgba(242,193,78,0.14)'
      }
    }
  };

  const DEFAULT_CONTENT = {
    hero: {
      eyebrow: 'Data Analyst',
      name: 'Asif Ahamed Sohag',
      role: 'Turning financial and operational data into decisions worth acting on.',
      tagline: 'Turning numbers into insights, and insights into informed decisions.',
      ctaPrimaryText: 'View projects',
      ctaPrimaryHref: '#projects',
      ctaSecondaryText: 'Get in touch',
      ctaSecondaryHref: '#contact',
      previewVideo: null,
      previewImage: null,
      previewTag: 'Dashboard preview — placeholder, replace via Admin Panel'
    },
    about: {
      eyebrow: 'About me',
      title: 'From financial statements to data pipelines',
      photo: null,
      paragraphs: [
        "My journey with data began with a strong academic foundation in Finance & Banking through my BBA, where I built a solid understanding of finance, accounting, business analysis, and quantitative decision-making.",
        "I later completed an MBA in Accounting and Information Systems, where my interest in data analysis developed into a structured analytical approach. My thesis, \"Financial Statement Analysis of Private Commercial Banks in Bangladesh,\" strengthened my practical experience in descriptive statistics, financial ratios, comparative analysis, trend analysis, variability, and correlation.",
        "My professional experience spans finance, banking, taxation, accounting, supply chain, inventory, and business operations — work that has sharpened my ability to read real business data within its operational context. I currently work as an Accounts Executive, applying financial and analytical knowledge to accounting, reporting, and business processes.",
        "Alongside my career, I've built practical expertise in Excel, Pivot Tables, Power Query, SQL, Power BI, and Tableau — focused on data cleaning, transformation, statistical analysis, visualization, and dashboard development."
      ],
      stats: [
        { value: 'BBA · MBA', label: 'Finance & Accounting foundation' },
        { value: '6+', label: 'Business domains worked across' },
        { value: '7', label: 'Core analytics tools' }
      ]
    },
    projects: [
      {
        id: 'p1', title: 'Sales Performance Dashboard',
        description: 'An interactive Power BI dashboard tracking regional sales, margin, and target attainment, built on cleaned and modeled transactional data.',
        thumb: null, thumbStyle: 'bars',
        link: 'https://github.com/asifahamedsohag-gif'
      },
      {
        id: 'p2', title: 'Financial Ratio Analysis',
        description: 'A comparative study of private commercial banks using liquidity, profitability, and solvency ratios, with trend analysis in Excel and SQL.',
        thumb: null, thumbStyle: 'line',
        link: 'https://github.com/asifahamedsohag-gif'
      },
      {
        id: 'p3', title: 'Customer Churn Analysis',
        description: 'An exploratory data analysis and churn-prediction workflow in Python and Pandas, visualized in Tableau for stakeholder reporting.',
        thumb: null, thumbStyle: 'donut',
        link: 'https://github.com/asifahamedsohag-gif'
      }
    ],
    tools: [
      { id: 'tl1', category: 'Data analysis', items: ['Excel', 'SQL', 'Python', 'Pandas'] },
      { id: 'tl2', category: 'Visualization', items: ['Power BI', 'Tableau', 'Matplotlib'] },
      { id: 'tl3', category: 'Data & database', items: ['MySQL', 'Power Query', 'DAX'] },
      { id: 'tl4', category: 'Core analytics', items: ['Data cleaning', 'Exploratory data analysis', 'Descriptive statistics', 'Dashboard design'] }
    ],
    education: [
      {
        id: 'ed1', title: 'BBA, Finance & Banking',
        meta: 'Bachelor of Business Administration',
        description: 'Built a foundation in finance, accounting, business analysis, and quantitative decision-making.'
      },
      {
        id: 'ed2', title: 'MBA, Accounting & Information Systems',
        meta: 'Master of Business Administration',
        description: 'Thesis: "Financial Statement Analysis of Private Commercial Banks in Bangladesh" — descriptive statistics, ratio and trend analysis, correlation.'
      }
    ],
    certifications: [],
    experience: [
      {
        id: 'ex1', title: 'Accounts Executive',
        meta: 'Current role',
        description: 'Applying financial and analytical knowledge to accounting, reporting, and day-to-day business processes.'
      },
      {
        id: 'ex2', title: 'Cross-functional business exposure',
        meta: 'Banking · Tax & VAT · Procurement & logistics',
        description: 'Worked with real-world operational and financial data across banking, taxation, supply chain, and inventory functions.'
      }
    ],
    cta: {
      title: 'Interested in working together?',
      text: "I'm currently looking for Data Analyst, Business Analyst, Sales Analyst, and Supply Chain Analyst opportunities where I can put this analytical work to use.",
      buttonText: 'Download résumé',
      resumeLink: '#',
      resumeFileName: null,
      resumeFileData: null
    },
    contact: {
      email: 'asifahamedsohag1@gmail.com',
      whatsapp: '+8801684366569',
      linkedin: 'https://www.linkedin.com/in/asif-ahamed-sohag',
      github: 'https://github.com/asifahamedsohag-gif'
    },
    footer: {
      name: 'Asif Ahamed Sohag',
      role: 'Data Analyst · Business Analyst · BBA, MBA Graduate'
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function deepMerge(target, source) {
    const out = Array.isArray(target) ? target.slice() : { ...target };
    if (Array.isArray(source)) return source;
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key]) {
        out[key] = deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        out[key] = source[key];
      }
    }
    return out;
  }

  function getContent() {
    try {
      const raw = localStorage.getItem(KEYS.content);
      if (!raw) return deepClone(DEFAULT_CONTENT);
      const parsed = JSON.parse(raw);
      return deepMerge(deepClone(DEFAULT_CONTENT), parsed);
    } catch (e) {
      console.error('Store: failed to read content, using defaults', e);
      return deepClone(DEFAULT_CONTENT);
    }
  }

  function saveContent(content) {
    try {
      localStorage.setItem(KEYS.content, JSON.stringify(content));
      return true;
    } catch (e) {
      console.error('Store: failed to save content', e);
      return false;
    }
  }

  function resetContent() {
    try {
      localStorage.removeItem(KEYS.content);
      return true;
    } catch (e) {
      console.error('Store: failed to reset content', e);
      return false;
    }
  }

  function getTheme() {
    try {
      return localStorage.getItem(KEYS.theme) || DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function saveTheme(themeKey) {
    if (!THEMES[themeKey]) return false;
    try {
      localStorage.setItem(KEYS.theme, themeKey);
      applyTheme(themeKey);
      return true;
    } catch (e) {
      console.error('Store: failed to save theme', e);
      applyTheme(themeKey); // still preview it for this page view even if it can't persist
      return false;
    }
  }

  function applyTheme(themeKey) {
    const theme = THEMES[themeKey] || THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  function getAuth() {
    try {
      const raw = localStorage.getItem(KEYS.auth);
      if (!raw) return { username: 'admin', password: 'Admin@123' };
      return JSON.parse(raw);
    } catch (e) {
      return { username: 'admin', password: 'Admin@123' };
    }
  }

  function saveAuth(auth) {
    try {
      localStorage.setItem(KEYS.auth, JSON.stringify(auth));
      return true;
    } catch (e) {
      console.error('Store: failed to save auth', e);
      return false;
    }
  }

  function newId(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  global.Store = {
    KEYS,
    THEMES,
    DEFAULT_THEME,
    DEFAULT_CONTENT,
    getContent,
    saveContent,
    resetContent,
    getTheme,
    saveTheme,
    applyTheme,
    getAuth,
    saveAuth,
    deepClone,
    newId
  };

})(window);
