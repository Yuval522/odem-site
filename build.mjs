// Static site generator for מטבחי אודם. Reuses the original Styletex landing-page markup and style.css.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { POSTS } from "./blog.mjs";

const OUT = "dist";
const SITE = "https://odemdesign.co.il";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync("static", OUT, { recursive: true });

// ---------- brand ----------
const WA = "https://wa.me/972507400143?text=" + encodeURIComponent("היי, הגעתי מהאתר של odem Kitchens");
const LEGAL = 'odem Kitchens (מטבחי אודם) הוא מותג של א. סטיילטקס בע"מ (I. Stiltex Ltd), ח.פ. 516475670';
const WAZE = "https://waze.com/ul?q=" + encodeURIComponent("מושב גבעולים");

// English tabs, in reading order (left to right)
const NAV = [
  ["/", "HOME"],
  ["/kitchens/", "KITCHENS"],
  ["/wardrobes/", "WARDROBES"],
  ["/joinery/", "CUSTOM JOINERY"],
  ["/about/", "ABOUT US"],
  ["/blog/", "BLOG"],
  ["/contact/", "CONTACTS"],
];

const esc = (s) => s.replace(/"/g, "&quot;");

// ---------- structured data (Google + AI assistants read this) ----------
const BUSINESS_ID = `${SITE}/#business`;
const BUSINESS = {
  "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
  "@id": BUSINESS_ID,
  name: "odem Kitchens",
  alternateName: ["מטבחי אודם", "odem design", "אודם דיזיין"],
  legalName: 'א. סטיילטקס בע"מ',
  description:
    "מפעל נגרות במושב גבעולים שבנגב, ליד נתיבות. מתכננים, מייצרים ומתקינים מטבחים בהתאמה אישית, ארונות קיר, חדרי ארונות, ויטרינות, קירות יין ונגרות למוסדות, בכל הארץ.",
  url: `${SITE}/`,
  logo: `${SITE}/icons/oj-icon-512.png`,
  image: [`${SITE}/assets/1111.jpeg`, `${SITE}/assets/new/kitchen-white-walnut-island.jpg`],
  telephone: "+972-50-740-0143",
  email: "info@odemdesign.co.il",
  address: { "@type": "PostalAddress", addressLocality: "מושב גבעולים", addressRegion: "מחוז הדרום", addressCountry: "IL" },
  areaServed: { "@type": "Country", name: "Israel" },
  foundingDate: "2021",
  knowsLanguage: ["he", "en"],
  knowsAbout: ["מטבחים בהתאמה אישית", "ארונות קיר", "חדרי ארונות", "ויטרינות", "קירות יין", "נגרות מוסדית", "חיתוך CNC", "פרזול Blum"],
  contactPoint: [
    { "@type": "ContactPoint", telephone: "+972-50-740-0143", email: "info@odemdesign.co.il", contactType: "customer service", availableLanguage: ["Hebrew", "English"] },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "שירותים",
    itemListElement: [
      ["מטבחים בהתאמה אישית", "/kitchens/"],
      ["ארונות קיר וחדרי ארונות", "/wardrobes/"],
      ["ויטרינות", "/wardrobes/"],
      ["קירות יין וברים", "/joinery/"],
      ["נגרות למוסדות ולעסקים", "/joinery/"],
    ].map(([n, u]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n, url: SITE + u } })),
  },
};
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...obj })}</script>`;
const serviceLd = (name, path, description) =>
  ld({ "@type": "Service", name, serviceType: name, description, url: SITE + path, provider: { "@id": BUSINESS_ID }, areaServed: { "@type": "Country", name: "Israel" } });
const faqLd = (faq) =>
  ld({ "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });

function head({ title, description, path, image = "assets/1111.jpeg", schema = "" }) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${title}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${SITE}${path}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="he_IL">
    <meta property="og:url" content="${SITE}${path}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${SITE}/${image}">
    <meta property="og:site_name" content="odem Kitchens">
    <meta name="twitter:card" content="summary_large_image">
    ${ld({ "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "odem Kitchens", alternateName: "מטבחי אודם", inLanguage: "he-IL", publisher: { "@id": BUSINESS_ID } })}
    ${ld(BUSINESS)}
    ${schema}
    <meta name="theme-color" content="#f4efe7">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="odem">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="icon" href="/icons/oj-favicon-32.png" sizes="32x32" type="image/png">
    <link rel="icon" href="/icons/oj-favicon-48.png" sizes="48x48" type="image/png">
    <link rel="icon" href="/icons/oj-icon-192.png" sizes="192x192" type="image/png">
    <link rel="apple-touch-icon" href="/icons/oj-apple-touch-icon.png">
    <base href="/">
    <link rel="preload" href="fonts/heebo-hebrew-300-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="fonts/jost-latin-200-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="pages.css">
    <link rel="stylesheet" href="fonts.css">
    <link rel="stylesheet" href="widgets.css">
</head>`;
}

function header(path) {
  const links = NAV.map(
    ([href, label]) => `<li><a href="${href}"${href === path ? ' class="current" aria-current="page"' : ""}>${label}</a></li>`
  ).join("\n                ");
  return `
    <header class="navbar">
        <div class="logo">
            <a href="/" class="brand-mark" aria-label="odem design – דף הבית"><span class="bm-word">odem</span><span class="bm-line"></span><span class="bm-sub">DESIGN</span></a>
        </div>
        <button class="menu-toggle" id="menu-toggle" aria-label="תפריט" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <nav aria-label="ניווט ראשי">
            <ul>
                ${links}
            </ul>
        </nav>
    </header>`;
}

function footer() {
  return `
    <footer>
        <div class="container">
            <div class="logo" style="margin-bottom: 2rem; display: flex; justify-content: center;">
                <a href="/" class="brand-mark brand-mark-lg" aria-label="odem design"><span class="bm-word">odem</span><span class="bm-line"></span><span class="bm-sub">DESIGN</span></a>
            </div>
            <ul class="footer-nav">
                ${NAV.slice(1).map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("\n                ")}
            </ul>
            <p class="footer-contact"><a href="tel:0507400143" dir="ltr">050-7400143</a> · <a href="mailto:info@odemdesign.co.il" dir="ltr">info@odemdesign.co.il</a></p>
            <ul class="footer-legal">
                <li><a href="/privacy/">מדיניות פרטיות</a></li>
                <li><a href="/terms/">תנאי שימוש</a></li>
                <li><a href="/accessibility/">הצהרת נגישות</a></li>
                <li><button type="button" class="link-btn" data-open-cookies>הגדרות עוגיות</button></li>
            </ul>
            <p>&copy; 2026 odem Kitchens · מטבחי אודם. מיוצר בישראל 🇮🇱</p>
            <p class="legal">${LEGAL}</p>
        </div>
    </footer>


    <a href="${WA}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="וואטסאפ">
        <img src="assets/whatsapp.svg" alt="WhatsApp">
    </a>

    <div id="image-lightbox" class="lightbox-modal" aria-hidden="true" role="dialog">
        <button class="lightbox-close" id="lightbox-close-btn" aria-label="סגירה">&times;</button>
        <div class="lightbox-content">
            <img id="lightbox-img" src="" alt="">
        </div>
    </div>

    <script src="site.js"></script>
    <script src="widgets.js" defer></script>`;
}

function page({ path, title, description, image, body, bodyClass = "", schema = "" }) {
  const html = `${head({ title, description, path, image, schema })}
<body${bodyClass ? ` class="${bodyClass}"` : ""}>${header(path)}
${body}
${footer()}
</body>
</html>
`;
  const file = path === "/" ? `${OUT}/index.html` : path.endsWith(".html") ? `${OUT}${path}` : `${OUT}${path}index.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ---------- building blocks ----------
const item = (src, alt, cat) =>
  `<div class="gallery-item"${cat ? ` data-category="${cat}"` : ""}>
                    <img src="${src}" alt="${esc(alt)}" loading="lazy">
                </div>`;

const figure = (src, alt) =>
  `<figure class="gallery-item">
                    <img src="${src}" alt="${esc(alt)}" loading="lazy">
                    <figcaption>${alt}</figcaption>
                </figure>`;

const heroInner = (img, eyebrow, title, pos = "center", mobileImg = "") => `
    <section class="hero hero-inner">
        <div class="hero-bg" style="background-image: url('${img}'); background-position: ${pos};${mobileImg ? ` --hero-m: url('${mobileImg}');` : ""}"></div>
        <div class="hero-caption">
            <div class="brand-subtitle">${eyebrow}</div>
            <h1>${title}</h1>
        </div>
    </section>`;

const lead = (text) => `
    <p class="page-lead">${text}</p>`;

const features = (rows) => `
    <section class="features">
        ${rows
          .map(
            ([img, alt, t, d], i) => `<div class="feature-row">
            <div class="feature-img"><img src="${img}" alt="${esc(alt)}" loading="lazy"></div>
            <div class="feature-text">
                <span class="feature-num">${String(i + 1).padStart(2, "0")}</span>
                <h2>${t}</h2>
                <p>${d}</p>
            </div>
        </div>`
          )
          .join("\n        ")}
    </section>`;

const materials = (note) => `
    <section class="materials">
        <div class="container">
            <h2 class="tech-section-title">חומרים</h2>
            <p class="materials-note">${note}</p>
            <div class="swatches">
                <div class="swatch"><img src="assets/materials/oak.jpg" alt="עץ אלון" loading="lazy"><span>OAK · אלון</span></div>
                <div class="swatch"><img src="assets/materials/walnut.jpg" alt="עץ אגוז" loading="lazy"><span>WALNUT · אגוז</span></div>
                <div class="swatch"><img src="assets/materials/marble.jpg" alt="שיש" loading="lazy"><span>MARBLE · שיש</span></div>
                <div class="swatch"><img src="assets/materials/quartz.jpg" alt="קוורץ לבן" loading="lazy"><span>QUARTZ · קוורץ</span></div>
            </div>
        </div>
    </section>`;

const hardware = () => `
    <section class="hardware">
        <div class="container">
            <div class="hardware-head">
                <div class="brand-subtitle">HARDWARE</div>
                <h2>פרזול Blum ו-Domsil</h2>
                <p>אנחנו עובדים עם פרזול של Blum ו-Domsil: מגירות בפתיחה מלאה ובסגירה שקטה, צירים, מסילות ומגירות עם דפנות זכוכית.</p>
            </div>
            <div class="hardware-grid">
                <figure><img src="assets/hardware/odem-drawers.jpg" alt="מגירות בארון, במפעל שלנו" loading="lazy"><figcaption>מגירות בסגירה שקטה, אצלנו במפעל</figcaption></figure>
                <figure><img src="assets/hardware/cutlery.jpg" alt="מגירה עם חלוקה פנימית מעץ" loading="lazy"><figcaption>גימור יוקרתי וחלוקה פנימית</figcaption></figure>
                <figure><img src="assets/hardware/glass-drawer-lit.jpg" alt="מגירה פתוחה עם דפנות זכוכית" loading="lazy"><figcaption>מגירות עם דפנות זכוכית</figcaption></figure>
            </div>
        </div>
    </section>`;

const galleryPage = (title, items) => `
    <section class="gallery gallery-page">
        <div class="container">
            <h2 class="gallery-section-title">${title}</h2>
            <div class="gallery-grid">
                ${items.map(([s, a]) => figure(s, a)).join("\n                ")}
            </div>
        </div>
    </section>`;

const ctaStrip = (title = "נתחיל במדידה") => `
    <section class="cta-strip">
        <div class="container-minimal">
            <h2>${title}</h2>
            <div class="cta-links">
                <a href="/contact/" class="discover-link">לתיאום פגישה</a>
                <a href="${WA}" target="_blank" rel="noopener" class="discover-link">וואטסאפ</a>
            </div>
        </div>
    </section>`;

const columns = (title, cols, extraClass = "") => `
    <section class="technology">
        <div class="container">
            <h2 class="tech-section-title">${title}</h2>
            <div class="tech-minimal-grid ${extraClass}">
                ${cols
                  .map(
                    ([t, d], i) => `<div class="tech-column">
                    <span class="tech-number">${String(i + 1).padStart(2, "0")}</span>
                    <h3 class="tech-col-title">${t}</h3>
                    <p class="tech-col-desc">${d}</p>
                </div>`
                  )
                  .join("\n                ")}
            </div>
        </div>
    </section>`;

const ICON = {
  phone: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 3.5h3.2l1.6 4.2-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.9-.9.4-2.2.3-4-.8a9 9 0 0 1-2.8-2.8c-1.1-1.8-1.2-3.1-.9-3.9z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
};

// One clean contact list, used on the contact page and at the bottom of the home page.
function contactList() {
  const row = (icon, label, value, href, ext = false) => `
                    <li>
                        <span class="cx-icon">${icon}</span>
                        <span class="cx-label">${label}</span>
                        <a class="cx-value" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${value}</a>
                    </li>`;
  return `
                <ul class="cx-list">${row(ICON.wa, "וואטסאפ", "שלחו לנו הודעה", WA, true)}${row(ICON.phone, "טלפון", '<span dir="ltr">050-7400143</span>', "tel:+972507400143")}${row(ICON.mail, "אימייל", '<span dir="ltr">info@odemdesign.co.il</span>', "mailto:info@odemdesign.co.il")}${row(ICON.pin, "המפעל", "מושב גבעולים, ליד נתיבות", WAZE, true)}
                </ul>`;
}

const contactForm = () => `
                <form class="cx-form" name="consultation" method="POST" action="/thank-you/" dir="rtl">
                    <h2>או השאירו פרטים</h2>
                    <p class="cx-form-note">הפרטים יישלחו אלינו בוואטסאפ, ונחזור אליכם בהקדם.</p>
                    <input type="hidden" name="form-name" value="consultation">
                    <input type="hidden" name="subject" value="פנייה חדשה מהאתר של odem Kitchens">
                    <p class="hp-field" aria-hidden="true"><label>לא למילוי: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
                    <div class="form-row">
                        <label class="form-field"><span>שם מלא *</span><input name="name" required autocomplete="name" dir="rtl"></label>
                        <label class="form-field"><span>טלפון *</span><input name="phone" type="tel" required inputmode="tel" autocomplete="tel" pattern="[0-9+\\-\\s]{9,15}" dir="ltr" class="ltr-field"></label>
                    </div>
                    <label class="form-field"><span>אימייל</span><input name="email" type="email" autocomplete="email" inputmode="email" dir="ltr" class="ltr-field"></label>
                    <div class="form-row">
                        <label class="form-field"><span>יישוב</span><input name="city" autocomplete="address-level2" dir="rtl"></label>
                        <label class="form-field"><span>מה אתם מתכננים?</span>
                        <select name="project_type" dir="rtl">
                            <option>מטבח</option>
                            <option>ארון קיר או חדר ארונות</option>
                            <option>ויטרינה או קיר יין</option>
                            <option>נגרות לעסק או למוסד</option>
                            <option>משהו אחר</option>
                        </select>
                        </label>
                    </div>
                    <label class="form-field"><span>ספרו לנו קצת על הפרויקט</span><textarea name="message" rows="4" dir="rtl" placeholder="למשל: מטבח בדירה חדשה, קיר של 3.5 מטר, כניסה בעוד חצי שנה"></textarea></label>
                    <label class="form-consent"><input type="checkbox" name="consent" value="כן" required><span>קראתי את <a href="/privacy/" target="_blank" rel="noopener">מדיניות הפרטיות</a> ואני מאשר/ת שתחזרו אליי בטלפון או בוואטסאפ *</span></label>
                    <p class="form-notice">הפרטים נמסרים לא. סטיילטקס בע"מ (odem Kitchens), ומשמשים רק כדי לחזור אליכם, לתאם פגישה ולהכין הצעת מחיר. אין חובה חוקית למסור אותם, אבל בלעדיהם לא נוכל לחזור אליכם. אפשר לבקש לעיין במידע, לתקן אותו או למחוק אותו בטלפון <span dir="ltr">050-7400143</span>.</p>
                    <p class="form-error" role="alert" hidden>ההודעה לא נשלחה. נסו שוב, או כתבו לנו בוואטסאפ.</p>
                    <button type="submit" class="cx-submit">שליחה בוואטסאפ</button>
                </form>`;

// ---------- FAQ (shown on the home page, also sent to Google as FAQPage data) ----------
const FAQ = [
  ["איפה אתם נמצאים, ואיפה אתם מתקינים?", "המפעל שלנו נמצא במושב גבעולים שבנגב, ליד נתיבות. אנחנו מודדים ומתקינים בכל הארץ."],
  ["מה אתם מייצרים?", "מטבחים בהתאמה אישית, ארונות קיר, חדרי ארונות, ויטרינות, קירות יין וברים, ונגרות למשרדים ולמוסדות. הכול נבנה לפי מידה."],
  ["עם אילו חומרים ופרזול אתם עובדים?", "עץ אלון ואגוז, פורמייקה וצבע בתנור, ומשטחי שיש וקוורץ. הפרזול הוא של Blum ו-Domsil: מגירות בפתיחה מלאה ובסגירה שקטה, צירים ומסילות."],
  ["איך מתחילים?", "שולחים לנו בוואטסאפ תמונה של החלל ומידות בערך, או ממלאים את הטופס באתר. נחזור אליכם לתאם מדידה, ואחריה נשלח שרטוט והצעת מחיר."],
  ["אתם עובדים לפי תוכניות של אדריכל או מעצב?", "כן. אפשר לשלוח לנו תוכניות קיימות, ונעבוד לפיהן או נשלים את התכנון של הנגרות."],
  ["אפשר לבקר במפעל?", "כן, בתיאום מראש בטלפון. במפעל אפשר לראות דוגמאות של חומרים, גוונים ופרזול."],
  ["אתם עובדים גם עם מוסדות ועסקים?", "כן. בנינו עמדות קבלה, חדרי אוכל ונגרות למשרדים, בין היתר עבור משרד ראש הממשלה, מכון ויצמן ואוניברסיטת בן־גוריון."],
];
const faqSection = (items) => `
    <section class="faq" id="faq">
        <div class="container">
            <h2 class="tech-section-title">שאלות נפוצות</h2>
            <div class="faq-list">
                ${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n                ")}
            </div>
        </div>
    </section>`;

// ---------- photos ----------
const N = "assets/new/";
const S = "assets/stock/";
const P = (list) => list.map(([f, a]) => [N + f, a]);

const photos = {
  kitchens: [
    ["kitchen-white-walnut-island.jpg", "מטבח לבן, אי בציפוי אגוז"],
    ["kitchen-oak-curve.jpg", "מטבח אלון, מדף סיום מעוגל"],
    ["kitchen-white-walnut.jpg", "מטבח לבן עם נישת אגוז"],
    ["kitchen-oak-patio.jpg", "אלון וארונות גבוהים"],
    ["kitchen-white-tall.jpg", "קיר תנורים לבן"],
    ["kitchen-oak-warm.jpg", "מטבח אלון"],
    ["kitchen-oak-island.jpg", "אי עם משטח עץ"],
  ],
  wardrobes: [
    ["walkin-island.jpg", "חדר ארונות עם אי"],
    ["closet-walnut-wall.jpg", "קיר ארונות עם נישת אגוז"],
    ["vitrine-black.jpg", "ויטרינה במסגרת שחורה"],
    ["closet-bedroom.jpg", "ארון חדר שינה"],
    ["vitrine-white.jpg", "ויטרינה לבנה מוארת"],
    ["closet-white-wall.jpg", "ארון קיר עד התקרה"],
    ["walkin-island-2.jpg", "אי לחדר ארונות"],
    ["closet-white-hall.jpg", "ארונות מסדרון"],
    ["entry-cabinetry.jpg", "נגרות כניסה"],
    ["closet-flush.jpg", "ארונות בחזית סמויה"],
    ["vitrine-black-2.jpg", "ויטרינת זכוכית ועץ"],
  ],
  wine: [
    ["wine-wall.jpg", "קיר יין מואר"],
    ["wine-bar.jpg", "בר יין, משטח שיש שחור"],
    ["wine-shelves.jpg", "מדפי יין מעץ כהה"],
    ["wine-counter.jpg", "דלפק בר"],
    ["wine-detail.jpg", "פרט בדלפק"],
  ],
};

const institutional = [
  ["assets/commercial/commercial_reception_2.jpeg", "עמדת קבלה, משרד ממשלתי"],
  ["assets/commercial/commercial_living_1.jpeg", "לובי ועמדת קבלה"],
  ["assets/commercial/commercial_institution_5.jpg", "חלל המתנה במוסד"],
  ["assets/commercial/commercial_institution_6.jpg", "ריהוט מוסדי"],
  ["assets/commercial/commercial_office_3.jpeg", "נגרות למשרדים"],
  ["assets/commercial/commercial_premium_4.jpeg", "עמדת הגשה"],
];

// ======================= HOME (original landing page, renamed, text trimmed) =======================
page({
  path: "/",
  title: "odem Kitchens",
  description: "odem Kitchens (מטבחי אודם): מטבחים בהתאמה אישית, ארונות קיר, חדרי ארונות ונגרות. מתכננים, מייצרים במפעל CNC במושב גבעולים שבנגב ומתקינים בכל הארץ.",
  schema: faqLd(FAQ),
  body: `
    <section id="hero" class="hero">
        <div class="hero-bg" style="background-image: url('assets/1111.jpeg');"></div>
        <a href="#about-brand" class="scroll-indicator" aria-label="גללו למטה">
            <span class="si-label">SCROLL</span>
            <span class="si-circle"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </a>
    </section>

    <section id="about-brand" class="about-brand">
        <div class="container-minimal">
            <div class="minimal-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <div class="brand-subtitle">ODEM KITCHENS</div>
            <h1 class="brand-title">מטבחים וארונות בהתאמה אישית</h1>
            <p class="brand-description">אנחנו מתכננים, מייצרים ומתקינים מטבחים, ארונות ונגרות לפי מידה. הכול נעשה במפעל שלנו במושב גבעולים שבנגב, ומותקן אצלכם בכל הארץ.</p>
            <div class="discover-wrapper">
                <a href="/contact/" class="discover-link">לתיאום פגישה</a>
            </div>
        </div>
    </section>

    <section class="large-visual-divider">
        <div class="divider-bg" style="background-image: url('assets/kitchen_light.jpg');"></div>
    </section>
${columns("איך אנחנו עובדים", [
  ["מפעל משלנו", "כל חלק נחתך, נצבע ומורכב אצלנו במפעל בגבעולים."],
  ["דיוק ומקצועיות", "עובדים לפי שרטוט מדויק, עד המילימטר. החזיתות נסגרות בקו ישר, והמרווחים אחידים לאורך כל הקיר."],
  ["תאריך התקנה מראש", "את מועד ההתקנה קובעים כבר בשלב התכנון, כדי שתוכלו להתארגן."],
  ["צוות אחד לאורך כל הדרך", "אותו צוות מלווה אתכם מהמדידה, דרך הייצור ועד ההתקנה."],
])}

    <section class="services" style="position: relative; overflow: hidden;">
        <div class="gallery-door-overlay" id="gallery-doors">
            <div class="door-panel door-left">
                <div class="door-bg" style="background-image: url('assets/kitchen_dark.jpg');"></div>
            </div>
            <div class="door-panel door-right">
                <div class="door-bg" style="background-image: url('assets/kitchen_dark.jpg');"></div>
            </div>
            <div class="door-content-overlay">
                <span class="door-tagline">ODEM STUDIO</span>
                <h2 class="door-heading">OUR EXPERTISE</h2>
                <div class="door-action-indicator">
                    <span class="door-action-text">CLICK TO ENTER</span>
                    <span class="door-action-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </span>
                </div>
            </div>
        </div>

        <div class="container-minimal">
            <div class="brand-subtitle">ODEM SERVICES</div>
            <h2 class="services-title">מה אנחנו בונים</h2>
            <p class="services-intro"><a href="/kitchens/" style="color:inherit">מטבחים</a>, <a href="/wardrobes/" style="color:inherit">ארונות קיר וחדרי ארונות</a>, ו<a href="/joinery/" style="color:inherit">נגרות בהתאמה אישית</a> לבתים, לעסקים ולמוסדות.</p>
            <p class="authority-text">
                בין הלקוחות שלנו: <strong>משרד ראש הממשלה</strong>, <strong>מכון ויצמן</strong> ו<strong>אוניברסיטת בן־גוריון</strong>.
            </p>
        </div>
    </section>

    <section id="gallery" class="gallery">
        <div class="container">
            <h2 class="gallery-section-title">ODEM COLLECTION</h2>

            <div class="gallery-filters">
                <button class="filter-btn active" data-filter="kitchens">KITCHENS & WARDROBES</button>
                <button class="filter-btn" data-filter="custom">CUSTOM JOINERY</button>
                <button class="filter-btn" data-filter="commercial">COMMERCIAL & INSTITUTIONAL</button>
            </div>

            <div class="gallery-grid">
                ${[
                  ["kitchen_luxury_oak_curve.jpg", "מטבח אלון עם מדף מעוגל"],
                  ["kitchen_oak_patio_view.jpg", "מטבח אלון וארון מזווה"],
                  ["kitchen_oak_warm_lighting.jpg", "מטבח אלון בתאורה חמה"],
                  ["1.jpeg", "קיר ארונות גבוהים במטבח"],
                  ["2.jpg", "מטבח לבן ואגוז"],
                  ["3.jpg", "ויטרינה לבנה"],
                  ["4.jpeg", "ארון חדר שינה"],
                  ["5.jpeg", "ארון קיר עד התקרה"],
                  ["6.jpeg", "קיר ארונות עם נישת אגוז"],
                  ["7.jpg", "ארונות מסדרון"],
                  ["8.jpeg", "ארונות בחזית סמויה"],
                ]
                  .map(([f, a]) => item(`assets/kitchens/${f}`, a, "kitchens"))
                  .join("\n                ")}
                ${institutional.map(([s, a]) => item(s, a, "commercial")).join("\n                ")}
                ${[
                  ["wine_climate.jpg", "מקרר יין בנגרות"],
                  ["wine_gallery1.jpg", "ארון יין"],
                  ["wine_gallery2.jpg", "מקרר יין אינטגרלי"],
                  ["wine_hero.jpg", "קיר יין"],
                ]
                  .map(([f, a]) => item(`assets/custom/${f}`, a, "custom"))
                  .join("\n                ")}
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container-minimal">
            <div class="brand-subtitle">THE STUDIO</div>
            <h2>מפעל נגרות בנגב</h2>
            <p class="about-p">המפעל שלנו נמצא במושב גבעולים, ליד נתיבות. כאן נחתך, נצבע ומורכב כל פרויקט, ממגירה אחת ועד מטבח שלם, ומכאן הוא יוצא להתקנה בכל הארץ.</p>
            <div class="discover-wrapper"><a href="/about/" class="discover-link">עוד עלינו</a></div>
        </div>
    </section>

    <section class="trust-bar">
        <img src="assets/made_in_israel.png" alt="מיוצר בישראל" loading="lazy">
        <img src="assets/reserves_badge.png" alt="עסק של מילואימניק" loading="lazy">
    </section>
${faqSection(FAQ)}
${contactBlock()}`,
});

function contactBlock() {
  return `
    <section id="contact" class="cx cx-home">
        <div class="container">
            <div class="cx-grid">
                <div class="cx-intro">
                    <div class="brand-subtitle">CONTACT</div>
                    <h2>ספרו לנו מה אתם מתכננים</h2>
                    <p>הדרך הכי מהירה: לשלוח לנו בוואטסאפ תמונה של החלל ומידות בערך. נחזור אליכם לתאם מדידה.</p>
                    <a href="/contact/" class="discover-link">לטופס יצירת קשר</a>
                </div>
                ${contactList()}
            </div>
        </div>
    </section>`;
}

// ======================= KITCHENS =======================
page({
  path: "/kitchens/",
  title: "Kitchens | odem Kitchens",
  description: "מטבחים בהתאמה אישית: מדידה, תכנון, ייצור במפעל CNC במושב גבעולים והתקנה בכל הארץ. עץ אלון ואגוז, פורמייקה, צבע בתנור ופרזול Blum.",
  image: S + "hero-kitchens.jpg",
  schema: serviceLd("מטבחים בהתאמה אישית", "/kitchens/", "תכנון, ייצור והתקנה של מטבחים לפי מידה, במפעל CNC במושב גבעולים."),
  body: `${heroInner(S + "hero-kitchens.jpg", "KITCHENS", "מטבחים בהתאמה אישית")}
${lead("אנחנו מתכננים ובונים מטבחי יוקרה בהתאמה אישית, עם תשומת לב לפרטים הקטנים: קנט מדויק, פרזול שנסגר בשקט וחזיתות שנפגשות בקו אחד.")}
${features([
  [N + "kitchen-white-walnut-island.jpg", "מטבח לבן עם אי אגוז", "מדידה ותכנון", "מגיעים אליכם, מודדים את החלל ושואלים איך אתם משתמשים במטבח. אחר כך מקבלים שרטוט מלא, כולל כל מגירה וכל ציר."],
  [N + "kitchen-oak-sliding.jpg", "מטבח אלון וארונות גבוהים", "ייצור במפעל", "החלקים נחתכים במכונת CNC ומקבלים קנטים וצבע אצלנו במפעל. כל יחידה נבדקת לפני שהיא יוצאת להתקנה."],
  [N + "kitchen-white-tall.jpg", "קיר תנורים לבן", "התקנה", "הצוות שלנו מתקין, מכוונן את הדלתות והמגירות, ומוסר לכם את המטבח כשהכול עובד כמו שצריך."],
])}
${materials("חוץ מעץ ואבן, אנחנו עובדים גם עם פורמייקה וצבע בתנור. את הדוגמאות אפשר לראות ולמשש במפעל.")}
${hardware()}
${galleryPage("KITCHENS", P(photos.kitchens))}
${ctaStrip("מתכננים מטבח? נתחיל במדידה")}`,
});

// ======================= WARDROBES =======================
page({
  path: "/wardrobes/",
  title: "Wardrobes | odem Kitchens",
  description: "ארונות קיר, חדרי ארונות וויטרינות בהתאמה אישית. תכנון פנים מלא, ייצור CNC במפעל שלנו בנגב והתקנה בכל הארץ.",
  image: S + "hero-wardrobes.jpg",
  schema: serviceLd("ארונות קיר וחדרי ארונות", "/wardrobes/", "ארונות קיר, חדרי ארונות וויטרינות לפי מידה, כולל תכנון פנים מלא."),
  body: `${heroInner(S + "hero-wardrobes.jpg", "WARDROBES", "ארונות וחדרי ארונות", "30% center")}
${lead("ארונות וחדרי ארונות ברמת גימור של רהיט: חומרים איכותיים, חלוקה פנימית מדויקת ופרזול שנפתח ונסגר בשקט.")}
${features([
  [N + "walkin-island.jpg", "חדר ארונות עם אי", "חדרי ארונות", "אי במרכז החדר, מגירות לפי מה שאתם שומרים בהן, ותאורה לאורך המדפים."],
  [N + "closet-white-wall.jpg", "ארון קיר לבן", "ארונות קיר", "מהרצפה ועד התקרה, בחזית אחת נקייה. אפשר לפתוח בלחיצה או בידית סמויה."],
  [N + "vitrine-black.jpg", "ויטרינה במסגרת שחורה", "ויטרינות", "זכוכית במסגרת עץ או מתכת שחורה, עם תאורה מבפנים. מתאים לכלים, לספרים ולאוסף."],
])}
${hardware()}
${galleryPage("WARDROBES", P(photos.wardrobes))}
${ctaStrip("נתכנן יחד את הארון שלכם")}`,
});

// ======================= CUSTOM JOINERY =======================
page({
  path: "/joinery/",
  title: "Custom Joinery | odem Kitchens",
  description: "נגרות בהתאמה אישית: קירות יין, ברים, דלפקים ונגרות למוסדות ולעסקים. בין הלקוחות: משרד ראש הממשלה, מכון ויצמן ואוניברסיטת בן־גוריון.",
  schema: serviceLd("נגרות בהתאמה אישית", "/joinery/", "קירות יין, ברים, דלפקים, עמדות קבלה ונגרות למוסדות ולעסקים."),
  image: S + "hero-joinery-sun.jpg",
  body: `${heroInner(S + "hero-joinery-sun.jpg", "CUSTOM JOINERY", "נגרות בהתאמה אישית", "center", S + "hero-joinery-sun-m.jpg")}
${lead("כל מה שלא נכנס למידה סטנדרטית: קירות יין, ברים, דלפקים ונגרות לעסקים ולמוסדות.")}
${features([
  [N + "wine-wall.jpg", "קיר יין מואר", "קירות יין", "מדפים לבקבוקים, מקרר יין ותאורה, בנויים לתוך הקיר."],
  [N + "wine-bar.jpg", "בר יין", "ברים ודלפקים", "לבית, למסעדה ולמשרד, בגובה ובמידות שמתאימים למקום."],
  ["assets/commercial/commercial_reception_2.jpeg", "עמדת קבלה", "מוסדות ועסקים", "עמדות קבלה, חדרי אוכל, לובים ומשרדים. עבדנו בין היתר עם משרד ראש הממשלה, מכון ויצמן ואוניברסיטת בן־גוריון."],
])}
${galleryPage("PROJECTS", [...P(photos.wine), ...institutional])}
${ctaStrip("יש לכם תוכניות מאדריכל? שלחו אותן אלינו")}`,
});

// ======================= ABOUT =======================
page({
  path: "/about/",
  title: "About | odem Kitchens",
  description: "odem Kitchens הוא מפעל נגרות במושב גבעולים שבנגב, ליד נתיבות. מתכננים, מייצרים במכונת CNC ומתקינים מטבחים, ארונות ונגרות בהתאמה אישית, מאז 2021.",
  schema: ld({ "@type": "AboutPage", url: SITE + "/about/", about: { "@id": BUSINESS_ID } }),
  image: S + "hero-about.jpg",
  body: `${heroInner(S + "hero-about.jpg", "ABOUT US", "מי אנחנו")}
    <section class="about-block">
        <img src="${S}about-drawers.jpg" alt="ארון עץ עם מגירות פנימיות" loading="lazy">
        <div>
            <p class="people">מפעל נגרות בנגב</p>
            <p>המפעל שלנו נמצא במושב גבעולים שבנגב, ליד נתיבות, ופועל מאז 2021.</p>
            <p>אנחנו עושים את כל העבודה בעצמנו: מדידה, תכנון, ייצור והתקנה. כך אותו צוות מכיר את הפרויקט מהשרטוט הראשון ועד הבורג האחרון.</p>
            <p>במפעל עובדת מכונת CNC שחותכת כל חלק לפי השרטוט, ולצדה עמדות קנטים, צביעה והרכבה. כל יחידה נבדקת לפני שהיא יוצאת אליכם.</p>
            <p class="small-legal">${LEGAL}.</p>
        </div>
    </section>
${columns(
  "איך זה עובד",
  [
    ["מדידה", "מגיעים אליכם ומודדים את החלל."],
    ["תכנון", "שרטוט מלא, בחירת חומרים ופרזול."],
    ["ייצור", "חיתוך CNC, צבע והרכבה במפעל."],
    ["התקנה", "מתקינים, מכווננים ומוסרים."],
  ],
  "steps-grid"
)}
    <section class="trust-bar">
        <img src="assets/made_in_israel.png" alt="מיוצר בישראל" loading="lazy">
        <img src="assets/reserves_badge.png" alt="עסק של מילואימניק" loading="lazy">
    </section>
${ctaStrip("רוצים לראות את המפעל? תתקשרו ונתאם ביקור")}`,
});

// ======================= CONTACT =======================
page({
  path: "/contact/",
  title: "Contact | odem Kitchens",
  description: "דברו עם odem Kitchens בוואטסאפ, בטלפון 050-7400143, באימייל info@odemdesign.co.il או דרך הטופס. מפעל נגרות במושב גבעולים, ליד נתיבות.",
  bodyClass: "solid-nav",
  schema: ld({ "@type": "ContactPage", url: SITE + "/contact/", name: "יצירת קשר", about: { "@id": BUSINESS_ID } }),
  body: `
    <section class="cx cx-page">
        <div class="container">
            <div class="cx-grid">
                <div class="cx-intro">
                    <div class="brand-subtitle">CONTACT</div>
                    <h1>ספרו לנו מה אתם מתכננים</h1>
                    <p>הדרך הכי מהירה היא לשלוח בוואטסאפ תמונה של החלל ומידות בערך. נחזור אליכם לתאם מדידה.</p>
                    ${contactList()}
                    <figure class="cx-photo"><img src="${S}contact-kitchen.jpg" alt="מטבח בהיר עם אי וחלון גדול" loading="lazy"></figure>
                </div>
                ${contactForm()}
            </div>
        </div>
    </section>`,
});

// ======================= THANK YOU / ACCESSIBILITY / 404 =======================
page({
  path: "/thank-you/",
  title: "Thank you | odem Kitchens",
  description: "הפנייה התקבלה.",
  bodyClass: "solid-nav",
  body: `
    <section class="about-brand" style="padding:200px 0 140px">
        <div class="container-minimal">
            <div class="brand-subtitle">THANK YOU</div>
            <h1 class="brand-title">תודה, קיבלנו את הפרטים</h1>
            <p class="brand-description">נחזור אליכם בהקדם. אם זה דחוף, כתבו לנו בוואטסאפ.</p>
            <div class="discover-wrapper" style="gap:3rem"><a href="/" class="discover-link">לדף הבית</a><a href="${WA}" target="_blank" rel="noopener" class="discover-link">וואטסאפ</a></div>
        </div>
    </section>`,
});

const UPDATED = "13 בנובמבר 2026";
const TAB = { "/privacy/": "Privacy", "/terms/": "Terms", "/accessibility/": "Accessibility" };
const legalPage = (path, title, description, html, tabTitle = TAB[path]) =>
  page({
    path,
    title: `${tabTitle} | odem Kitchens`,
    description,
    bodyClass: "solid-nav",
    body: `
    <section class="text-page">
        <div class="container-minimal">
            <h1>${title}</h1>
${html}
            <p class="updated">עודכן לאחרונה: ${UPDATED}</p>
        </div>
    </section>`,
  });

legalPage("/privacy/", "מדיניות פרטיות",  "איזה מידע נאסף באתר odem Kitchens, למה, ומה הזכויות שלכם.", `
            <p>האתר מופעל על ידי א. סטיילטקס בע"מ, ח.פ. 516475670, הפועלת תחת המותג odem Kitchens (מטבחי אודם) (להלן: "אנחנו"). המדיניות מסבירה איזה מידע אישי אנחנו אוספים דרך האתר, למה, עם מי הוא משותף ומה הזכויות שלכם. היא נכתבה בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, כפי שתוקן (כולל תיקון מס' 13), ולתקנות שלפיו.</p>

            <h2>מי אחראי על המידע</h2>
            <p>האחראית על המידע שנאסף באתר היא א. סטיילטקס בע"מ, מושב גבעולים. לכל שאלה או בקשה בנושא פרטיות: טלפון <a href="tel:0507400143" dir="ltr">050-7400143</a> או אימייל <a href="mailto:info@odemdesign.co.il" dir="ltr">info@odemdesign.co.il</a>.</p>

            <h2>איזה מידע נאסף</h2>
            <ul>
                <li><strong>טופס יצירת קשר:</strong> שם, טלפון, אימייל (לא חובה), יישוב, סוג הפרויקט ותוכן ההודעה. הפרטים לא נשמרים באתר: בלחיצה על "שליחה" נפתחת אצלכם הודעת וואטסאפ מוכנה, והיא נשלחת אלינו רק אם תאשרו אותה. אין חובה חוקית למסור את המידע, אבל בלעדיו לא נוכל לחזור אליכם.</li>
                <li><strong>וואטסאפ וטלפון:</strong> אם תפנו אלינו כך, נקבל את המספר ואת תוכן ההודעה. וואטסאפ פועל לפי מדיניות הפרטיות של Meta.</li>
                <li><strong>מידע טכני:</strong> ספקית האחסון של האתר רושמת באופן אוטומטי נתונים כמו כתובת IP, סוג דפדפן ושעת הביקור, לצורכי אבטחה ותפעול.</li>
            </ul>

            <h2>למה אנחנו משתמשים במידע</h2>
            <ul>
                <li>לחזור אליכם, לתאם פגישה ולהכין הצעת מחיר.</li>
                <li>לבצע את העבודה ולתת שירות אחריה, אם נתקשר בהסכם.</li>
                <li>לעמוד בחובות לפי דין, למשל ניהול ספרים.</li>
            </ul>
            <p>לא נשלח לכם דיוור שיווקי בלי הסכמה מפורשת, ולא נמכור או נשכיר את המידע לאף אחד.</p>

            <h2>עם מי המידע משותף</h2>
            <ul>
                <li><strong>Cloudflare, Inc.</strong>: מארחת את האתר. השרתים שלה עשויים להיות מחוץ לישראל, כולל בארצות הברית.</li>
                <li><strong>WhatsApp (Meta)</strong>: פניות מהטופס נשלחות אלינו כהודעת וואטסאפ מהמכשיר שלכם.</li>
                <li>רואה החשבון של החברה, ורשויות מוסמכות כשהדין מחייב.</li>
            </ul>
            <p>האתר לא משתמש בכלי מעקב, בפרסום ממוקד או ברשתות פרסום. הגופנים והאייקונים נטענים מהשרת שלנו ולא משירותים חיצוניים.</p>

            <h2>כמה זמן המידע נשמר</h2>
            <p>פניות שלא הבשילו לעבודה נשמרות עד שנתיים ואז נמחקות. מידע על לקוחות נשמר כל עוד הוא נדרש למתן שירות ולאחריות, ולתקופה שהדין מחייב.</p>

            <h2>אבטחה</h2>
            <p>האתר מוצפן (HTTPS), והגישה לפניות מוגבלת לבעלי החברה. אף מערכת אינה חסינה לחלוטין, ולכן איננו יכולים להתחייב לאבטחה מוחלטת.</p>

            <h2>עוגיות ואחסון מקומי</h2>
            <p>האתר לא מציב עוגיות פרסום או סטטיסטיקה. הדפדפן שומר אצלכם רק שני פריטים טכניים:</p>
            <ul>
                <li><code>odem-consent</code>: הבחירה שלכם בהודעת העוגיות.</li>
                <li><code>odem-a11y</code>: הגדרות הנגישות שבחרתם, אם בחרתם.</li>
            </ul>
            <p>אפשר למחוק אותם בכל עת בהגדרות הדפדפן, או לשנות את הבחירה דרך "הגדרות עוגיות" בתחתית כל עמוד. אם נוסיף בעתיד כלי סטטיסטיקה, הוא יופעל רק אחרי הסכמה.</p>

            <h2>הזכויות שלכם</h2>
            <p>לפי חוק הגנת הפרטיות, אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקן אותו או למחוק אותו, ולבקש שלא נפנה אליכם בדיוור. לבקשה, פנו אלינו בטלפון או דרך טופס יצירת הקשר, ונענה תוך 30 יום.</p>

            <h2>קטינים</h2>
            <p>האתר מיועד למבוגרים. אנחנו לא אוספים ביודעין מידע מילדים מתחת לגיל 18.</p>

            <h2>יצירת קשר</h2>
            <p>א. סטיילטקס בע"מ (odem Kitchens), מושב גבעולים.<br>
            טלפון: <a href="tel:0507400143" dir="ltr">050-7400143</a> · אימייל: <a href="mailto:info@odemdesign.co.il" dir="ltr">info@odemdesign.co.il</a> · <a href="/contact/">טופס יצירת קשר</a></p>
            <p>אנחנו עשויים לעדכן את המדיניות מעת לעת. הנוסח המחייב הוא זה שמופיע באתר.</p>`);

legalPage("/terms/", "תנאי שימוש", "תנאי השימוש באתר מטבחי אודם.", `
            <p>האתר מופעל על ידי א. סטיילטקס בע"מ, ח.פ. 516475670, תחת המותג odem Kitchens (מטבחי אודם). השימוש באתר מהווה הסכמה לתנאים אלה. התנאים כתובים בלשון רבים ומתייחסים לכל המגדרים.</p>

            <h2>מידע באתר</h2>
            <ul>
                <li>המידע באתר הוא כללי. הוא איננו הצעה מחייבת, וזמינות, חומרים ומחירים יכולים להשתנות.</li>
                <li>התחייבות שלנו לעבודה נוצרת רק בהצעת מחיר או בהסכם בכתב, החתומים על ידי שני הצדדים.</li>
                <li>חלק מהתמונות באתר הן מפרויקטים שלנו, וחלקן תמונות השראה ממאגרים חופשיים (Unsplash) או הדמיות. גוונים בתמונה יכולים להיות שונים מהחומר במציאות.</li>
                <li>שמות מותגים כמו Blum ו-Domsil שייכים לבעליהם, ומוזכרים כדי לתאר את הפרזול שבו אנחנו עובדים.</li>
            </ul>

            <h2>קניין רוחני</h2>
            <p>התוכן, העיצוב, הטקסטים והתמונות מפרויקטים שלנו שייכים לא. סטיילטקס בע"מ. אין להעתיק או לפרסם אותם בלי אישור בכתב. תמונות ממאגרים חיצוניים כפופות לרישיון של המאגר.</p>

            <h2>שימוש מותר</h2>
            <p>אין להשתמש באתר באופן שפוגע בו או במשתמשים אחרים, לשלוח דרכו תוכן כוזב או פוגעני, או לנסות לחדור למערכותיו.</p>

            <h2>הגבלת אחריות</h2>
            <p>האתר מוצג כפי שהוא (AS IS). אנחנו עושים מאמץ שהמידע יהיה נכון ועדכני, אבל לא נישא באחריות לנזק שייגרם מהסתמכות על מידע באתר בלבד או מתקלה בו. אין באמור כדי לגרוע מזכויותיכם לפי חוק הגנת הצרכן.</p>

            <h2>קישורים חיצוניים</h2>
            <p>קישורים לאתרים אחרים, כמו וואטסאפ, הם לנוחותכם. איננו אחראים לתוכן או למדיניות של אותם אתרים.</p>

            <h2>פרטיות</h2>
            <p>השימוש במידע אישי מוסבר ב<a href="/privacy/">מדיניות הפרטיות</a>.</p>

            <h2>דין וסמכות שיפוט</h2>
            <p>על התנאים יחול הדין הישראלי בלבד. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז הדרום.</p>

            <h2>שינויים</h2>
            <p>אנחנו רשאים לעדכן את התנאים מעת לעת. הנוסח המחייב הוא זה שמופיע באתר.</p>`);

legalPage("/accessibility/", "הצהרת נגישות", "הצהרת הנגישות של אתר מטבחי אודם.", `
            <p>odem Kitchens (א. סטיילטקס בע"מ) רואה חשיבות בכך שכל אחד יוכל להשתמש באתר בקלות. האתר הונגש בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013, ולתקן הישראלי ת"י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA.</p>

            <h2>מה עשינו באתר</h2>
            <ul>
                <li>מבנה כותרות מסודר ותמיכה מלאה בעברית מימין לשמאל.</li>
                <li>ניווט מלא במקלדת, כולל תפריט, גלריה וטופס.</li>
                <li>טקסט חלופי לתמונות, ותוויות לכל שדות הטופס.</li>
                <li>ניגודיות צבעים תקינה בטקסט הראשי, והתאמה לגדלי מסך שונים ולנייד.</li>
                <li>כיבוי אנימציות למי שהגדיר "הפחתת תנועה" במכשיר.</li>
            </ul>

            <h2>תפריט הנגישות</h2>
            <p>בצד שמאל למטה בכל עמוד יש כפתור נגישות. דרכו אפשר להגדיל ולהקטין טקסט, להפעיל ניגודיות גבוהה או גווני אפור, להדגיש קישורים, לעבור לגופן קריא ולעצור אנימציות. ההגדרות נשמרות בדפדפן שלכם.</p>

            <h2>מגבלות ידועות</h2>
            <ul>
                <li>בחלק מהתמונות בגלריה התיאור קצר ואינו מפרט את כל הפרטים.</li>
                <li>הודעות וואטסאפ נשלחות דרך אפליקציה חיצונית, שהנגישות שלה באחריות Meta.</li>
            </ul>
            <p>אנחנו ממשיכים לשפר. אם נתקלתם ברכיב שאינו נגיש, נשמח שתספרו לנו.</p>

            <h2>רכז הנגישות</h2>
            <p>טלפון <a href="tel:0507400143" dir="ltr">050-7400143</a>, אימייל <a href="mailto:info@odemdesign.co.il" dir="ltr">info@odemdesign.co.il</a>, או דרך <a href="/contact/">טופס יצירת הקשר</a>. נטפל בפנייה תוך זמן סביר.</p>

            <h2>הסדרי נגישות פיזיים</h2>
            <p>פגישות ייעוץ ומדידות מתקיימות בבית הלקוח. ביקור במפעל במושב גבעולים מתואם מראש בטלפון. אם נדרשת התאמה, ספרו לנו כשאתם מתאמים.</p>`);

page({
  path: "/404.html",
  title: "Not found | odem Kitchens",
  description: "העמוד לא נמצא.",
  bodyClass: "solid-nav",
  body: `
    <section class="about-brand" style="padding:200px 0 140px">
        <div class="container-minimal">
            <div class="brand-subtitle">404</div>
            <h1 class="brand-title">העמוד הזה לא קיים</h1>
            <p class="brand-description">אולי הקישור השתנה. אפשר לחזור לדף הבית או לכתוב לנו.</p>
            <div class="discover-wrapper"><a href="/" class="discover-link">לדף הבית</a></div>
        </div>
    </section>`,
});

// ---------- manifest, sitemap, robots, _headers ----------
writeFileSync(
  `${OUT}/manifest.webmanifest`,
  JSON.stringify(
    {
      name: "odem",
      short_name: "odem",
      description: "מטבחים וארונות בהתאמה אישית",
      lang: "he",
      dir: "rtl",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#f4efe7",
      theme_color: "#f4efe7",
      icons: [
        { src: "/icons/oj-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icons/oj-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icons/oj-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    null,
    2
  )
);
// ======================= BLOG =======================
const heDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
const readMin = (html) => Math.max(2, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 180));
const crumbs = (items) => ld({ "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) });
const postCard = (p) => `
                <a class="post-card" href="/blog/${p.slug}/">
                    <img src="${p.image}" alt="${esc(p.imageAlt)}" loading="lazy">
                    <div class="post-card-body">
                        <span class="post-meta">${heDate(p.date)} · ${readMin(p.body)} דקות קריאה</span>
                        <h2>${p.title}</h2>
                        <p>${p.description}</p>
                        <span class="discover-link">לקריאה</span>
                    </div>
                </a>`;

page({
  path: "/blog/",
  title: "Blog | odem Kitchens",
  description: "מאמרים על תכנון מטבחים, ארונות וחדרי ארונות, חומרים ופרזול, מצוות odem Kitchens.",
  bodyClass: "solid-nav",
  schema: ld({ "@type": "Blog", "@id": SITE + "/blog/", url: SITE + "/blog/", name: "הבלוג של odem Kitchens", inLanguage: "he-IL", publisher: { "@id": BUSINESS_ID },
    blogPost: POSTS.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date })) }),
  body: `
    <section class="blog-index">
        <div class="container">
            <div class="brand-subtitle">BLOG</div>
            <h1>מה שכדאי לדעת לפני שמתכננים</h1>
            <p class="blog-intro">טיפים ותשובות לשאלות שאנחנו שומעים בכל פגישת תכנון: חומרים, מידות, פרזול ואיך עובד התהליך.</p>
            <div class="post-grid">${POSTS.map(postCard).join("")}
            </div>
        </div>
    </section>
${ctaStrip()}`,
});

for (const p of POSTS) {
  const url = `${SITE}/blog/${p.slug}/`;
  const others = POSTS.filter((o) => o.slug !== p.slug);
  page({
    path: `/blog/${p.slug}/`,
    title: `${p.title} | odem Kitchens`,
    description: p.description,
    image: p.image,
    bodyClass: "solid-nav",
    schema:
      ld({ "@type": "BlogPosting", "@id": url, mainEntityOfPage: url, headline: p.title, description: p.description, image: `${SITE}/${p.image}`,
        datePublished: p.date, dateModified: p.updated || p.date, inLanguage: "he-IL", author: { "@id": BUSINESS_ID }, publisher: { "@id": BUSINESS_ID } }) +
      crumbs([["דף הבית", "/"], ["בלוג", "/blog/"], [p.title, `/blog/${p.slug}/`]]),
    body: `
    <article class="post">
        <div class="container-minimal">
            <nav class="post-crumbs" aria-label="פירורי לחם"><a href="/">דף הבית</a> / <a href="/blog/">בלוג</a></nav>
            <h1>${p.title}</h1>
            <p class="post-meta">${heDate(p.date)} · ${readMin(p.body)} דקות קריאה</p>
        </div>
        <figure class="post-hero"><img src="${p.image}" alt="${esc(p.imageAlt)}"></figure>
        <div class="container-minimal post-body text-page">
${p.body}
            <div class="post-cta">
                <p>רוצים לדבר על הפרויקט שלכם? שלחו לנו תמונה של החלל בוואטסאפ, ונחזור אליכם.</p>
                <a href="${WA}" class="post-cta-btn" target="_blank" rel="noopener">לשיחה בוואטסאפ</a>
            </div>
        </div>
        <div class="container post-more">
            <h2>עוד מהבלוג</h2>
            <div class="post-grid">${others.map(postCard).join("")}
            </div>
        </div>
    </article>`,
  });
}

const urls = ["/", "/kitchens/", "/wardrobes/", "/joinery/", "/about/", "/blog/", ...POSTS.map((p) => `/blog/${p.slug}/`), "/contact/", "/privacy/", "/terms/", "/accessibility/"];
const LASTMOD = new Date().toISOString().slice(0, 10);
writeFileSync(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${LASTMOD}</lastmod><priority>${u === "/" ? "1.0" : ["/kitchens/", "/wardrobes/", "/joinery/"].includes(u) ? "0.9" : "0.5"}</priority></url>`)
    .join("\n")}\n</urlset>\n`
);
// Search engines and AI assistants are all welcome to read the site.
const BOTS = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"];
writeFileSync(
  `${OUT}/robots.txt`,
  `${BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}\n\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
);
// Plain-language summary for AI assistants (llmstxt.org convention).
writeFileSync(
  `${OUT}/llms.txt`,
  `# odem Kitchens (מטבחי אודם)

> Custom kitchen and woodworking factory in Moshav Givolim, in the Negev near Netivot, Israel. Designs, manufactures (CNC) and installs custom kitchens, wardrobes, walk-in closets, vitrines, wine walls and institutional joinery, anywhere in Israel.

מפעל נגרות במושב גבעולים שבנגב, ליד נתיבות. מתכננים, מייצרים במכונת CNC ומתקינים בכל הארץ: מטבחים בהתאמה אישית, ארונות קיר, חדרי ארונות, ויטרינות, קירות יין וברים, ונגרות למוסדות ולעסקים.

- Phone: +972-50-740-0143
- Email: info@odemdesign.co.il
- WhatsApp: https://wa.me/972507400143
- Founded: 2021. Company: I. Stiltex Ltd (א. סטיילטקס בע"מ)
- Materials: oak, walnut, laminate (formica), oven-baked paint, marble and quartz countertops
- Hardware: Blum and Domsil (full-extension soft-close drawers, glass-sided drawers, hinges, runners)
- Clients include the Prime Minister's Office, the Weizmann Institute and Ben-Gurion University
- How to start: send a photo of the space and rough measurements on WhatsApp, or use the contact form; a measurement visit is then scheduled

## Pages
- [מטבחים בהתאמה אישית / Custom kitchens](${SITE}/kitchens/)
- [ארונות וחדרי ארונות / Wardrobes and walk-in closets](${SITE}/wardrobes/)
- [נגרות בהתאמה אישית / Custom joinery, wine walls, institutional](${SITE}/joinery/)
- [מי אנחנו / About](${SITE}/about/)
- [בלוג / Blog](${SITE}/blog/)
${POSTS.map((p) => `  - [${p.title}](${SITE}/blog/${p.slug}/)`).join("\n")}
- [יצירת קשר / Contact](${SITE}/contact/)
`
);
// Cloudflare Pages response headers.
writeFileSync(
  `${OUT}/_headers`,
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`
);
console.log("built", urls.length, "pages");

// IndexNow: tells Bing (and through it ChatGPT/Copilot search) about updated pages.
// The key file proves we own the site. Ping runs only on Cloudflare production builds.
const INDEXNOW_KEY = "df8c7586d40a3cd0fa94da2a41ed8fee";
writeFileSync(`${OUT}/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
if (process.env.CF_PAGES && process.env.CF_PAGES_BRANCH === "main") {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList: urls.map((u) => `${SITE}${u}`),
      }),
      signal: AbortSignal.timeout(10000),
    });
    console.log("IndexNow:", res.status);
  } catch (e) {
    console.log("IndexNow ping skipped:", e.message);
  }
}
