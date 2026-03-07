const signs = [
  { animal: "Rat", emoji: "🐀", years: "1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020", compatible: ["Ox", "Dragon", "Monkey"], traits: "Quick-witted, resourceful, kind" },
  { animal: "Ox", emoji: "🐂", years: "1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021", compatible: ["Rat", "Snake", "Rooster"], traits: "Diligent, dependable, patient" },
  { animal: "Tiger", emoji: "🐅", years: "1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022", compatible: ["Horse", "Dog", "Pig"], traits: "Brave, confident, competitive" },
  { animal: "Rabbit", emoji: "🐇", years: "1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023", compatible: ["Goat", "Dog", "Pig"], traits: "Gentle, elegant, compassionate" },
  { animal: "Dragon", emoji: "🐉", years: "1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024", compatible: ["Rat", "Monkey", "Rooster"], traits: "Ambitious, energetic, fearless" },
  { animal: "Snake", emoji: "🐍", years: "1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025", compatible: ["Ox", "Rooster", "Goat"], traits: "Wise, intuitive, graceful" },
  { animal: "Horse", emoji: "🐴", years: "1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026", compatible: ["Tiger", "Goat", "Dog"], traits: "Active, energetic, warm-hearted" },
  { animal: "Goat", emoji: "🐐", years: "1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027", compatible: ["Rabbit", "Horse", "Pig", "Snake"], traits: "Calm, gentle, creative" },
  { animal: "Monkey", emoji: "🐒", years: "1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028", compatible: ["Rat", "Dragon", "Snake"], traits: "Clever, curious, mischievous" },
  { animal: "Rooster", emoji: "🐓", years: "1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029", compatible: ["Ox", "Dragon", "Snake"], traits: "Observant, hardworking, honest" },
  { animal: "Dog", emoji: "🐕", years: "1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030", compatible: ["Tiger", "Rabbit", "Horse"], traits: "Loyal, honest, faithful" },
  { animal: "Pig", emoji: "🐖", years: "1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031", compatible: ["Tiger", "Rabbit", "Goat"], traits: "Generous, compassionate, sincere" },
];

export default function CompatibilityPage() {
  return (
    <div className="static-page">
      <nav className="static-nav">
        <a href="/" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#cp)"
            />
            <defs>
              <linearGradient id="cp" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#E8454A" />
                <stop offset="1" stopColor="#8B1A28" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo-text">
            Snaeh<span>App</span>
          </span>
        </a>
      </nav>

      <div className="static-content compat-page">
        <h1 className="static-title">Your Compatible Signs</h1>
        <p className="static-subtitle">
          Discover your ideal match based on the Asian zodiac
        </p>

        <div className="compat-grid">
          {signs.map((s) => (
            <div key={s.animal} className="compat-card">
              <div className="compat-card-header">
                <span className="compat-emoji">{s.emoji}</span>
                <h2 className="compat-animal">{s.animal}</h2>
              </div>
              <p className="compat-traits">{s.traits}</p>
              <p className="compat-years">{s.years}</p>
              <div className="compat-match-section">
                <span className="compat-label">Best matches</span>
                <div className="compat-tags">
                  {s.compatible.map((c) => (
                    <span key={c} className="compat-tag">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="static-footer">
        <div className="footer-copy">&copy; 2026 SnaehApp. All rights reserved.</div>
        <div className="footer-powered">Powered by <a href="https://angkorai.ai" target="_blank" rel="noopener noreferrer">AngkorAI</a></div>
      </footer>
    </div>
  );
}
