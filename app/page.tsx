"use client";

import { useEffect, useState, FormEvent, createContext, useContext } from "react";
import { createClient } from "@/lib/supabase/client";

type Lang = "en" | "kh";
const LangContext = createContext<Lang>("en");

const t = {
  // Nav
  navHow: { en: "How It Works", kh: "របៀបប្រើ" },
  navFeatures: { en: "Features", kh: "មុខងារ" },
  navPricing: { en: "Pricing", kh: "តម្លៃ" },
  navStories: { en: "Stories", kh: "រឿងរ៉ាវ" },
  navCta: { en: "Join Waitlist", kh: "ចុះឈ្មោះ" },

  // Hero
  heroLabel: { en: "Cambodia's #1 Dating App", kh: "កម្មវិធីណាត់ជួបលេខ ១ នៅកម្ពុជា" },
  heroTitle1: { en: "Find Your", kh: "ស្វែងរក" },
  heroTitle2: { en: "Perfect Match", kh: "គូស្នេហ៍ល្អឥតខ្ចោះ" },
  heroTitle3: { en: "in Cambodia", kh: "នៅកម្ពុជា" },
  heroKhmer: { en: "រកស្នេហ៍ដ៏ល្អឥតខ្ចោះ", kh: "Find Your Perfect Match" },
  heroDesc: {
    en: "SnaehApp connects Cambodian hearts through authentic culture, shared values, and modern technology. Bilingual Khmer–English, built for you.",
    kh: "SnaehApp ភ្ជាប់បេះដូងខ្មែរតាមរយៈវប្បធម៌ ក្តីស្រលាញ់ និងបច្ចេកវិទ្យាទំនើប។ ពីរភាសា ខ្មែរ–អង់គ្លេស សម្រាប់អ្នក។",
  },
  heroSeeHow: { en: "See How It Works", kh: "មើលរបៀបប្រើ" },
  statUsers: { en: "Active Users", kh: "អ្នកប្រើប្រាស់" },
  statMatches: { en: "Matches Made", kh: "គូស្នេហ៍" },
  statRating: { en: "App Rating", kh: "ការវាយតម្លៃ" },

  // How it works
  howEyebrow: { en: "Simple & Easy", kh: "ងាយស្រួល" },
  howTitle1: { en: "How ", kh: "" },
  howTitle2: { en: "SnaehApp", kh: "SnaehApp" },
  howTitle3: { en: " Works", kh: " ដំណើរការ" },
  howDesc: {
    en: "Get started in minutes. Find meaningful connections with people who share your values and culture.",
    kh: "ចាប់ផ្តើមក្នុងរយៈពេលប៉ុន្មាននាទី។ ស្វែងរកទំនាក់ទំនងដ៏មានអត្ថន័យជាមួយមនុស្សដែលមានតម្លៃ និងវប្បធម៌ដូចគ្នា។",
  },
  step1Title: { en: "Create Profile", kh: "បង្កើតប្រវត្តិរូប" },
  step1Desc: {
    en: "Sign up with your phone number. Add photos, interests, and your story in Khmer or English.",
    kh: "ចុះឈ្មោះដោយប្រើលេខទូរសព្ទ។ បន្ថែមរូបថត ចំណាប់អារម្មណ៍ និងរឿងរ៉ាវរបស់អ្នកជាភាសាខ្មែរ ឬអង់គ្លេស។",
  },
  step2Title: { en: "Discover Matches", kh: "ស្វែងរកគូស្នេហ៍" },
  step2Desc: {
    en: "Browse profiles nearby. Filter by province, interests, horoscope, and lifestyle preferences.",
    kh: "រកមើលប្រវត្តិរូបនៅជិត។ ត្រងតាមខេត្ត ចំណាប់អារម្មណ៍ ហោរាសាស្ត្រ និងរបៀបរស់នៅ។",
  },
  step3Title: { en: "Like & Connect", kh: "ចូលចិត្ត & ភ្ជាប់" },
  step3Desc: {
    en: "Swipe, super-like, or send a message. When both like each other — it's a match!",
    kh: "អូសស្វែងរក ចូលចិត្តខ្លាំង ឬផ្ញើសារ។ នៅពេលទាំងពីរចូលចិត្តគ្នា — វាជាគូស្នេហ៍!",
  },
  step4Title: { en: "Start Chatting", kh: "ចាប់ផ្តើមជជែក" },
  step4Desc: {
    en: "Chat securely in Khmer or English. Share photos and plan your first date in Cambodia.",
    kh: "ជជែកដោយសុវត្ថិភាពជាភាសាខ្មែរ ឬអង់គ្លេស។ ចែករំលែករូបថត និងរៀបចំកាលបរិច្ឆេទដំបូងនៅកម្ពុជា។",
  },

  // Features
  featEyebrow: { en: "Built for Cambodia", kh: "បង្កើតសម្រាប់កម្ពុជា" },
  featTitle1: { en: "Features Made ", kh: "មុខងារសម្រាប់" },
  featTitle2: { en: "for You", kh: "អ្នក" },
  featDesc: {
    en: "Unlike global apps, SnaehApp is designed around Cambodian culture, language, and values.",
    kh: "មិនដូចកម្មវិធីសកល SnaehApp ត្រូវបានរចនាជុំវិញវប្បធម៌ ភាសា និងតម្លៃខ្មែរ។",
  },
  feat1Title: { en: "Bilingual Experience", kh: "បទពិសោធន៍ពីរភាសា" },
  feat1Desc: {
    en: "Full Khmer Unicode support throughout the entire app. Communicate naturally in your own language.",
    kh: "ការគាំទ្រអក្សរខ្មែរពេញលេញនៅក្នុងកម្មវិធីទាំងមូល។ ទំនាក់ទំនងដោយធម្មជាតិជាភាសាផ្ទាល់ខ្លួន។",
  },
  feat2Title: { en: "Horoscope Matching", kh: "ផ្គូផ្គងហោរាសាស្ត្រ" },
  feat2Desc: {
    en: "Khmer zodiac and horoscope compatibility filtering — a cherished part of Cambodian matchmaking tradition.",
    kh: "ការត្រងភាពឆបគ្នានៃរាសីចក្រខ្មែរ និងហោរាសាស្ត្រ — ផ្នែកដ៏សំខាន់នៃប្រពៃណីផ្គូផ្គងខ្មែរ។",
  },
  feat3Title: { en: "Verified Profiles", kh: "ប្រវត្តិរូបផ្ទៀងផ្ទាត់" },
  feat3Desc: {
    en: "Photo and ID verification badges. Know you're talking to a real person, not a scammer.",
    kh: "ផ្លាកសញ្ញាផ្ទៀងផ្ទាត់រូបថត និងអត្តសញ្ញាណ។ ដឹងថាអ្នកកំពុងនិយាយជាមួយមនុស្សពិត មិនមែនអ្នកបោកប្រាស់។",
  },
  feat4Title: { en: "Province Filter", kh: "ត្រងតាមខេត្ត" },
  feat4Desc: {
    en: "Find matches in Phnom Penh, Siem Reap, Battambang, or any of Cambodia's 25 provinces.",
    kh: "ស្វែងរកគូស្នេហ៍នៅភ្នំពេញ សៀមរាប បាត់ដំបង ឬខេត្តណាមួយក្នុងចំណោម ២៥ ខេត្តរបស់កម្ពុជា។",
  },
  feat5Title: { en: "Local Payments", kh: "ការទូទាត់ក្នុងស្រុក" },
  feat5Desc: {
    en: "Pay for premium features using ABA PayWay, Wing Money, or ACLEDA. No international card needed.",
    kh: "ទូទាត់សម្រាប់មុខងារ Premium ដោយប្រើ ABA PayWay, Wing Money ឬ ACLEDA។ មិនត្រូវការកាតអន្តរជាតិ។",
  },
  feat6Title: { en: "Private & Safe", kh: "ឯកជន & សុវត្ថិភាព" },
  feat6Desc: {
    en: "Incognito mode, photo blur, and block/report features. Your privacy and safety are our top priority.",
    kh: "មុខងារលាក់ខ្លួន ព្រិលរូបថត និងទប់ស្កាត់/រាយការណ៍។ ឯកជនភាព និងសុវត្ថិភាពរបស់អ្នកជាអាទិភាពកំពូលរបស់យើង។",
  },

  // Pricing
  priceEyebrow: { en: "Simple Pricing", kh: "តម្លៃសាមញ្ញ" },
  priceTitle1: { en: "Choose Your ", kh: "ជ្រើសរើស" },
  priceTitle2: { en: "Plan", kh: "គម្រោង" },
  priceDesc: {
    en: "Affordable plans designed for Cambodian income levels. Pay in USD or KHR using local payment methods.",
    kh: "គម្រោងដែលមានតម្លៃសមរម្យសម្រាប់កម្រិតប្រាក់ចំណូលកម្ពុជា។ ទូទាត់ជា USD ឬ រៀល ដោយប្រើវិធីទូទាត់ក្នុងស្រុក។",
  },
  priceFree: { en: "Free", kh: "ឥតគិតថ្លៃ" },
  priceForever: { en: "Forever free", kh: "ឥតគិតថ្លៃជារៀងរហូត" },
  pricePerMonth: { en: "per month", kh: "ក្នុងមួយខែ" },
  priceMostPopular: { en: "Most Popular", kh: "ពេញនិយមបំផុត" },
  priceGetStarted: { en: "Get Started", kh: "ចាប់ផ្តើម" },
  priceStartPremium: { en: "Start Premium", kh: "ចាប់ផ្តើម Premium" },
  priceGoGold: { en: "Go Gold", kh: "ចាប់ផ្តើម Gold" },
  priceFree1: { en: "10 likes per day", kh: "ចូលចិត្ត ១០ ក្នុងមួយថ្ងៃ" },
  priceFree2: { en: "Basic matching", kh: "ផ្គូផ្គងមូលដ្ឋាន" },
  priceFree3: { en: "Chat with matches", kh: "ជជែកជាមួយគូស្នេហ៍" },
  priceFree4: { en: "Khmer & English UI", kh: "ខ្មែរ & អង់គ្លេស" },
  priceFree5: { en: "Province filter", kh: "ត្រងតាមខេត្ត" },
  pricePrem1: { en: "Unlimited likes", kh: "ចូលចិត្តគ្មានដែនកំណត់" },
  pricePrem2: { en: "See who liked you", kh: "មើលអ្នកដែលចូលចិត្តអ្នក" },
  pricePrem3: { en: "Rewind last swipe", kh: "ត្រឡប់ការអូសចុងក្រោយ" },
  pricePrem4: { en: "Horoscope matching", kh: "ផ្គូផ្គងហោរាសាស្ត្រ" },
  pricePrem5: { en: "Verified badge", kh: "ផ្លាកសញ្ញាផ្ទៀងផ្ទាត់" },
  pricePrem6: { en: "Priority in search", kh: "អាទិភាពក្នុងការស្វែងរក" },
  priceGold1: { en: "Everything in Premium", kh: "អ្វីទាំងអស់ក្នុង Premium" },
  priceGold2: { en: "5 Super Likes/day", kh: "ចូលចិត្តខ្លាំង ៥/ថ្ងៃ" },
  priceGold3: { en: "1 Boost per week", kh: "ជំរុញ ១ ក្នុងមួយសប្តាហ៍" },
  priceGold4: { en: "Incognito mode", kh: "មុខងារលាក់ខ្លួន" },
  priceGold5: { en: "Read receipts", kh: "បានអានការជូនដំណឹង" },
  priceGold6: { en: "VIP support", kh: "ជំនួយ VIP" },

  // Testimonials
  storyEyebrow: { en: "Success Stories", kh: "រឿងរ៉ាវជោគជ័យ" },
  storyTitle1: { en: "Real ", kh: "រឿងរ៉ាវ" },
  storyTitle2: { en: "Love", kh: "ស្នេហ៍" },
  storyTitle3: { en: " Stories", kh: "ពិត" },
  storyDesc: {
    en: "Thousands of Cambodians have found meaningful connections through SnaehApp.",
    kh: "ជនជាតិខ្មែររាប់ពាន់នាក់បានរកឃើញទំនាក់ទំនងដ៏មានអត្ថន័យតាមរយៈ SnaehApp។",
  },
  story1: {
    en: "I found my boyfriend on SnaehApp after just two weeks. The horoscope matching actually works — we are so compatible!",
    kh: "ខ្ញុំបានរកឃើញមិត្តប្រុសនៅលើ SnaehApp គ្រាន់តែពីរសប្តាហ៍។ ការផ្គូផ្គងហោរាសាស្ត្រពិតជាដំណើរការ — យើងឆបគ្នាណាស់!",
  },
  story2: {
    en: "Finally an app that works in Khmer! The verified profiles gave me confidence that I was talking to real people.",
    kh: "ទីបំផុតកម្មវិធីដែលដំណើរការជាភាសាខ្មែរ! ប្រវត្តិរូបដែលបានផ្ទៀងផ្ទាត់ផ្តល់ឱ្យខ្ញុំនូវទំនុកចិត្តថាខ្ញុំកំពុងនិយាយជាមួយមនុស្សពិត។",
  },
  story3: {
    en: "We matched in October, met in November, and got engaged in March. SnaehApp changed our lives completely.",
    kh: "យើងផ្គូផ្គងគ្នាក្នុងខែតុលា ជួបគ្នាក្នុងខែវិច្ឆិកា និងភ្ជាប់ពាក្យក្នុងខែមីនា។ SnaehApp បានផ្លាស់ប្តូរជីវិតយើងទាំងស្រុង។",
  },

  // CTA
  ctaTitle1: { en: "Your Story", kh: "រឿងរ៉ាវរបស់អ្នក" },
  ctaTitle2: { en: "Starts ", kh: "ចាប់ផ្តើម" },
  ctaTitle3: { en: "Today", kh: "ថ្ងៃនេះ" },
  ctaSub: {
    en: "Be the first to know when we launch. No spam, just love.",
    kh: "ក្លាយជាមនុស្សដំបូងដែលដឹងពេលយើងបើកដំណើរការ។ គ្មានសារឥតប្រយោជន៍ មានតែស្នេហ៍។",
  },

  // Footer
  footerAbout: { en: "About", kh: "អំពី" },
  footerSafety: { en: "Safety", kh: "សុវត្ថិភាព" },
  footerPrivacy: { en: "Privacy", kh: "ឯកជនភាព" },
  footerTerms: { en: "Terms", kh: "លក្ខខណ្ឌ" },
  footerContact: { en: "Contact", kh: "ទំនាក់ទំនង" },

  // Waitlist
  waitlistPlaceholder: { en: "Enter your email", kh: "បញ្ចូលអ៊ីមែលរបស់អ្នក" },
  waitlistBtn: { en: "Join Waitlist", kh: "ចុះឈ្មោះ" },
  waitlistLoading: { en: "Joining...", kh: "កំពុងចុះឈ្មោះ..." },
  waitlistSuccess: {
    en: "You're on the list! We'll notify you at launch.",
    kh: "អ្នកបានចុះឈ្មោះហើយ! យើងនឹងជូនដំណឹងអ្នកពេលបើកដំណើរការ។",
  },
  waitlistDuplicate: {
    en: "You're already registered. We'll be in touch!",
    kh: "អ្នកបានចុះឈ្មោះរួចហើយ។ យើងនឹងទាក់ទងអ្នក!",
  },
  waitlistError: {
    en: "Something went wrong. Please try again.",
    kh: "មានបញ្ហា។ សូមព្យាយាមម្តងទៀត។",
  },
  waitlistCount: {
    en: (n: number) => `Join ${n}+ others waiting for launch`,
    kh: (n: number) => `ចូលរួមជាមួយ ${n}+ នាក់ផ្សេងទៀតកំពុងរង់ចាំ`,
  },
} as const;

function useLang() {
  return useContext(LangContext);
}

function WaitlistForm({ id }: { id: string }) {
  const lang = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("waitlist").select("*", { count: "exact", head: true }).then(({ count }) => {
      if (count !== null) setCount(count);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.from("waitlist").insert({ email: email.toLowerCase().trim() });
    if (error) {
      setStatus(error.code === "23505" ? "duplicate" : "error");
    } else {
      setStatus("success");
      setCount((c) => (c !== null ? c + 1 : 1));
      setEmail("");
    }
  };

  return (
    <div className="waitlist-wrapper">
      <form className="waitlist-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t.waitlistPlaceholder[lang]}
          className="waitlist-input"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status !== "idle" && status !== "loading") setStatus("idle"); }}
          required
          id={id}
        />
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          <span>{status === "loading" ? t.waitlistLoading[lang] : t.waitlistBtn[lang]}</span>
          <span>&rarr;</span>
        </button>
      </form>
      {status === "success" && <p className="waitlist-msg success">{t.waitlistSuccess[lang]}</p>}
      {status === "duplicate" && <p className="waitlist-msg duplicate">{t.waitlistDuplicate[lang]}</p>}
      {status === "error" && <p className="waitlist-msg error">{t.waitlistError[lang]}</p>}
      {count !== null && count > 0 && <p className="waitlist-count">{t.waitlistCount[lang](count)}</p>}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById("navbar");
    const handleScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [menuOpen]);

  return (
    <LangContext.Provider value={lang}>
      {/* NAV */}
      <nav id="navbar">
        <a href="#" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#ng)"
            />
            <defs>
              <linearGradient id="ng" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#E8454A" />
                <stop offset="1" stopColor="#8B1A28" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo-text">
            Snaeh<span>App</span>
          </span>
        </a>
        <ul className="nav-links">
          <li><a href="#how">{t.navHow[lang]}</a></li>
          <li><a href="#features">{t.navFeatures[lang]}</a></li>
          <li><a href="#pricing">{t.navPricing[lang]}</a></li>
          <li><a href="#stories">{t.navStories[lang]}</a></li>
          <li>
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === "en" ? "kh" : "en")}
              aria-label="Toggle language"
            >
              {lang === "en" ? "KH" : "EN"}
            </button>
          </li>
          <li>
            <a href="/auth/login" className="nav-signin">Sign In</a>
          </li>
          <li>
            <a href="/auth/signup" className="nav-cta">Sign Up</a>
          </li>
        </ul>
        <div className="nav-right-mobile">
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === "en" ? "kh" : "en")}
            aria-label="Toggle language"
          >
            {lang === "en" ? "KH" : "EN"}
          </button>
          <button
            className="nav-menu-btn"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#how" onClick={() => setMenuOpen(false)}>{t.navHow[lang]}</a>
        <a href="#features" onClick={() => setMenuOpen(false)}>{t.navFeatures[lang]}</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>{t.navPricing[lang]}</a>
        <a href="#stories" onClick={() => setMenuOpen(false)}>{t.navStories[lang]}</a>
        <a href="/auth/login" onClick={() => setMenuOpen(false)}>Sign In</a>
        <a href="/auth/signup" className="nav-cta" onClick={() => setMenuOpen(false)}>Sign Up</a>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <div className="hero-bg-circle c1"></div>
          <div className="hero-bg-circle c2"></div>
        </div>
        <div className="hero-pattern"></div>

        <div className="hero-content">
          <div className="hero-label">{t.heroLabel[lang]}</div>
          <h1 className="hero-title">
            {t.heroTitle1[lang]}
            <br />
            <em>{t.heroTitle2[lang]}</em>
            <br />
            {t.heroTitle3[lang]}
          </h1>
          <span className="hero-title-khmer">{t.heroKhmer[lang]}</span>
          <p className="hero-desc">{t.heroDesc[lang]}</p>
          <div className="hero-actions">
            <a href="/auth/signup" className="btn-primary">Sign Up Free &rarr;</a>
            <a href="#how" className="btn-secondary">{t.heroSeeHow[lang]}</a>
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-num">50K+</span>
              <span className="stat-label">{t.statUsers[lang]}</span>
            </div>
            <div>
              <span className="stat-num">8K+</span>
              <span className="stat-label">{t.statMatches[lang]}</span>
            </div>
            <div>
              <span className="stat-num">4.8&#9733;</span>
              <span className="stat-label">{t.statRating[lang]}</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-wrap">
            <div className="phone-glow"></div>
            <div className="phone">
              <div className="phone-notch"></div>
              <div className="phone-card">
                <div className="profile-photo-sim">
                  <span className="profile-emoji">&#128105;</span>
                </div>
                <div className="phone-card-img">
                  <div className="profile-info">
                    <div className="profile-name">Sreymom, 24</div>
                    <div className="profile-detail">
                      &#128205; Phnom Penh &middot; &#10003; Verified
                    </div>
                    <div className="profile-tags">
                      <span className="profile-tag">Buddhist</span>
                      <span className="profile-tag">Teacher</span>
                      <span className="profile-tag">Foodie</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="phone-actions">
                <div className="phone-btn pass">&#10005;</div>
                <div className="phone-btn like">&#9829;</div>
                <div className="phone-btn star">&#9733;</div>
              </div>
            </div>

            <div className="badge badge-left">
              <span className="badge-icon">&#128172;</span>
              <div>
                <span className="badge-text">It&apos;s a Match!</span>
                <span className="badge-sub">Start chatting now</span>
              </div>
            </div>
            <div className="badge badge-right">
              <span className="badge-icon">&#128737;&#65039;</span>
              <div>
                <span className="badge-text">Verified Profile</span>
                <span className="badge-sub">Safe &amp; trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-header reveal">
          <span className="section-eyebrow">{t.howEyebrow[lang]}</span>
          <h2 className="section-title">
            {t.howTitle1[lang]}<em>{t.howTitle2[lang]}</em>{t.howTitle3[lang]}
          </h2>
          <p className="section-desc">{t.howDesc[lang]}</p>
        </div>
        <div className="steps-grid">
          <div className="step reveal">
            <div className="step-num">01</div>
            <span className="step-icon">&#128241;</span>
            <div className="step-title">{t.step1Title[lang]}</div>
            <p className="step-desc">{t.step1Desc[lang]}</p>
          </div>
          <div className="step reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="step-num">02</div>
            <span className="step-icon">&#128269;</span>
            <div className="step-title">{t.step2Title[lang]}</div>
            <p className="step-desc">{t.step2Desc[lang]}</p>
          </div>
          <div className="step reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="step-num">03</div>
            <span className="step-icon">&#9829;</span>
            <div className="step-title">{t.step3Title[lang]}</div>
            <p className="step-desc">{t.step3Desc[lang]}</p>
          </div>
          <div className="step reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="step-num">04</div>
            <span className="step-icon">&#128172;</span>
            <div className="step-title">{t.step4Title[lang]}</div>
            <p className="step-desc">{t.step4Desc[lang]}</p>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="section-header reveal">
          <span className="section-eyebrow">{t.featEyebrow[lang]}</span>
          <h2 className="section-title">
            {t.featTitle1[lang]}<em>{t.featTitle2[lang]}</em>
          </h2>
          <p className="section-desc">{t.featDesc[lang]}</p>
        </div>
        <div className="features-grid">
          <div className="feature-card reveal">
            <span className="feature-icon">&#127472;&#127469;</span>
            <div className="feature-title">{t.feat1Title[lang]}</div>
            <span className="feature-title-khmer">ភាសាខ្មែរ &amp; English</span>
            <p className="feature-desc">{t.feat1Desc[lang]}</p>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="feature-icon">&#127800;</span>
            <div className="feature-title">{t.feat2Title[lang]}</div>
            <span className="feature-title-khmer">ហោរាសាស្ត្រ</span>
            <p className="feature-desc">{t.feat2Desc[lang]}</p>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="feature-icon">&#128737;&#65039;</span>
            <div className="feature-title">{t.feat3Title[lang]}</div>
            <span className="feature-title-khmer">ប្រវត្តិពិតប្រាកដ</span>
            <p className="feature-desc">{t.feat3Desc[lang]}</p>
          </div>
          <div className="feature-card reveal">
            <span className="feature-icon">&#128205;</span>
            <div className="feature-title">{t.feat4Title[lang]}</div>
            <span className="feature-title-khmer">ខេត្ត &amp; ក្រុង</span>
            <p className="feature-desc">{t.feat4Desc[lang]}</p>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="feature-icon">&#127974;</span>
            <div className="feature-title">{t.feat5Title[lang]}</div>
            <span className="feature-title-khmer">ABA &middot; Wing &middot; ACLEDA</span>
            <p className="feature-desc">{t.feat5Desc[lang]}</p>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="feature-icon">&#128274;</span>
            <div className="feature-title">{t.feat6Title[lang]}</div>
            <span className="feature-title-khmer">សុវត្ថិភាព</span>
            <p className="feature-desc">{t.feat6Desc[lang]}</p>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-header reveal">
          <span className="section-eyebrow">{t.priceEyebrow[lang]}</span>
          <h2 className="section-title">
            {t.priceTitle1[lang]}<em>{t.priceTitle2[lang]}</em>
          </h2>
          <p className="section-desc">{t.priceDesc[lang]}</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card reveal">
            <span className="pricing-tier">{t.priceFree[lang]}</span>
            <div className="pricing-price"><sup>$</sup>0</div>
            <span className="pricing-period">{t.priceForever[lang]}</span>
            <ul className="pricing-features">
              <li>{t.priceFree1[lang]}</li>
              <li>{t.priceFree2[lang]}</li>
              <li>{t.priceFree3[lang]}</li>
              <li>{t.priceFree4[lang]}</li>
              <li>{t.priceFree5[lang]}</li>
            </ul>
            <a href="#" className="btn-outline">{t.priceGetStarted[lang]}</a>
          </div>

          <div className="pricing-card featured reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="pricing-badge">{t.priceMostPopular[lang]}</div>
            <span className="pricing-tier">Premium</span>
            <div className="pricing-price"><sup>$</sup>5</div>
            <span className="pricing-period">{t.pricePerMonth[lang]}</span>
            <ul className="pricing-features">
              <li>{t.pricePrem1[lang]}</li>
              <li>{t.pricePrem2[lang]}</li>
              <li>{t.pricePrem3[lang]}</li>
              <li>{t.pricePrem4[lang]}</li>
              <li>{t.pricePrem5[lang]}</li>
              <li>{t.pricePrem6[lang]}</li>
            </ul>
            <a href="#" className="btn-filled">{t.priceStartPremium[lang]}</a>
          </div>

          <div className="pricing-card reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="pricing-tier">Gold</span>
            <div className="pricing-price"><sup>$</sup>10</div>
            <span className="pricing-period">{t.pricePerMonth[lang]}</span>
            <ul className="pricing-features">
              <li>{t.priceGold1[lang]}</li>
              <li>{t.priceGold2[lang]}</li>
              <li>{t.priceGold3[lang]}</li>
              <li>{t.priceGold4[lang]}</li>
              <li>{t.priceGold5[lang]}</li>
              <li>{t.priceGold6[lang]}</li>
            </ul>
            <a href="#" className="btn-outline">{t.priceGoGold[lang]}</a>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* TESTIMONIALS */}
      <section id="stories">
        <div className="section-header reveal">
          <span className="section-eyebrow">{t.storyEyebrow[lang]}</span>
          <h2 className="section-title">
            {t.storyTitle1[lang]}<em>{t.storyTitle2[lang]}</em>{t.storyTitle3[lang]}
          </h2>
          <p className="section-desc">{t.storyDesc[lang]}</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card reveal">
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">{t.story1[lang]}</p>
            <div className="testimonial-author">
              <div className="author-avatar">&#128105;</div>
              <div>
                <span className="author-name">Bopha, 26</span>
                <span className="author-loc">&#128205; Phnom Penh</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">{t.story2[lang]}</p>
            <div className="testimonial-author">
              <div className="author-avatar">&#128104;</div>
              <div>
                <span className="author-name">Dara, 29</span>
                <span className="author-loc">&#128205; Siem Reap</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">{t.story3[lang]}</p>
            <div className="testimonial-author">
              <div className="author-avatar">&#128107;</div>
              <div>
                <span className="author-name">Channary &amp; Virak</span>
                <span className="author-loc">&#128205; Battambang</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="cta-ornament">ស្នេហ៍</div>
        <div className="cta-content reveal">
          <h2 className="cta-title">
            {t.ctaTitle1[lang]}
            <br />
            {t.ctaTitle2[lang]}<em>{t.ctaTitle3[lang]}</em>
          </h2>
          <p className="cta-sub">{t.ctaSub[lang]}</p>
          <div className="cta-buttons">
            <a href="/auth/signup" className="btn-primary">Sign Up Free &rarr;</a>
            <a href="/auth/login" className="btn-secondary">Sign In</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="footer-logo">Snaeh<span>App</span></div>
          <span className="footer-khmer">ស្នេហ៍ &middot; Find Love in Cambodia</span>
        </div>
        <ul className="footer-links">
          <li><a href="/about">{t.footerAbout[lang]}</a></li>
          <li><a href="/compatibility">Compatible Signs</a></li>
          <li><a href="/privacy">{t.footerPrivacy[lang]}</a></li>
          <li><a href="/contact">{t.footerContact[lang]}</a></li>
        </ul>
        <div className="footer-copy">&copy; 2026 SnaehApp. All rights reserved.</div>
      </footer>
    </LangContext.Provider>
  );
}
