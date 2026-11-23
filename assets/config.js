// ─────────────────────────────────────────────────────────────
//  Site configuration — edit this file to personalise the site.
// ─────────────────────────────────────────────────────────────
window.SITE = {
  name: "Morteza Bashsiz",

  // GitHub username — repos are fetched live from the GitHub API.
  github: "MortezaBashsiz",

  // YouTube channel URL.
  youtube: "https://www.youtube.com/@MortezaBashsiz",

  // Optional: public contact email. Leave "" to hide the Contact link.
  email: "",

  // Blog posts, newest first. Shown on the home page and the Blog page.
  // To add one: copy an existing post in blog/, edit it, and add an entry here.
  posts: [
    {
      url: "blog/when-ai-thinks-for-us.html",
      title: "When AI Thinks for Us: Are We Making Our Brains Lazy?",
      date: "2026-11-22",
      description: "Cognitive offloading, the illusion of learning, and how to use AI without outsourcing your ability to think.",
      fa: {"title": "وقتی هوش مصنوعی به‌جامون فکر می‌کنه، ذهنمون تنبل می‌شه؟", "description": "وقتی جواب آماده می‌گیریم، واقعاً چیزی یاد می‌گیریم؟ از واگذاری کار ذهنی و راه‌های مستقل فکر کردن می‌گم."},
    },
    {
      url: "blog/how-we-scan-our-infrastructure-for-cves.html",
      title: "How We Scan Our Entire Infrastructure for CVEs",
      date: "2026-11-21",
      description: "A unified vulnerability monitoring system across Kubernetes, VMs, and containers — Trivy, CISA KEV, Prometheus, and actionable alerts.",
      fa: {"title": "چطور آسیب‌پذیری‌های کل زیرساختمون رو پیدا می‌کنیم؟", "description": "چطور با Trivy و Prometheus آسیب‌پذیری‌های کوبرنتیز، ماشین‌های مجازی و کانتینرها رو یک‌جا زیر نظر می‌گیریم."},
    },
    {
      url: "blog/bulshittropy.html",
      title: "Bulshittropy",
      date: "2026-11-13",
      description: "On the drift toward absurdity and the erosion of authenticity — why meaning, like order, needs energy to survive.",
      fa: {"title": "بول‌شیتروپی", "description": "چرا هرچی محتوا بیشتر می‌شه، پیدا کردن چیزهایی که واقعاً ارزش خوندن دارن سخت‌تر می‌شه؟"},
    },
    {
      url: "blog/ai-behind-a-human-face.html",
      title: "Don't Reply to a Human Face When an AI Is Behind the Conversation",
      date: "2026-11-13",
      description: "The growing problem of AI impersonating human communication — and why transparency should be the minimum standard.",
      fa: {"title": "وقتی هوش مصنوعی پشت یه پروفایل واقعی جواب می‌ده", "description": "اگه یه پیام خودکار به اسم یه آدم واقعی فرستاده بشه، حق داریم بدونیم داریم با کی حرف می‌زنیم."},
    },
    {
      url: "blog/how-long-should-you-stay-at-a-company.html",
      title: "How Long Should You Stay at a Company?",
      date: "2026-11-13",
      description: "Why we stay, what makes an organization a good place to work, and a simple answer: stay as long as you feel good being there.",
      fa: {"title": "چقدر باید توی یه شرکت بمونیم؟", "description": "چرا توی یه شرکت می‌مونیم، چه چیزی موندن رو ارزشمند می‌کنه و کی باید به رفتن فکر کنیم؟"},
    },
    {
      url: "blog/the-right-to-make-mistakes.html",
      title: "The Right to Make Mistakes",
      date: "2026-11-13",
      description: "Owning your mistakes, supporting others through theirs, and why an expensive mistake gets more expensive when nobody learns from it.",
      fa: {"title": "حق اشتباه کردن", "description": "وقتی خودمون یا یکی از همکارامون اشتباه می‌کنه، چطور اوضاع رو درست کنیم و ازش یاد بگیریم؟"},
    },
    {
      url: "blog/the-10-20-70-rule.html",
      title: "Choosing the Right Tool: The 10/20/70 Rule",
      date: "2026-11-13",
      description: "Knowing tools, choosing the right one, and using it well — a simple ratio for getting things done, with examples from Linux and everyday life.",
      fa: {"title": "چطور ابزار مناسب رو انتخاب کنیم؟ قاعدهٔ ۱۰، ۲۰ و ۷۰", "description": "از پاستا خوردن تا کار با لینوکس، شناخت ابزار، انتخابش و بلد بودن کار باهاش چه فرقی دارن؟"},
    },
  ],

  // Videos shown on the home page and the Videos page.
  // `id` is the part after "watch?v=" in a YouTube URL.
  videos: [
    // { id: "dQw4w9WgXcQ", title: "My first video", date: "2026-01-01" },
  ],
};
