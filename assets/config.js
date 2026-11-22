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
    },
    {
      url: "blog/how-we-scan-our-infrastructure-for-cves.html",
      title: "How We Scan Our Entire Infrastructure for CVEs",
      date: "2026-11-21",
      description: "A unified vulnerability monitoring system across Kubernetes, VMs, and containers — Trivy, CISA KEV, Prometheus, and actionable alerts.",
    },
    {
      url: "blog/bulshittropy.html",
      title: "Bulshittropy",
      date: "2026-11-13",
      description: "On the drift toward absurdity and the erosion of authenticity — why meaning, like order, needs energy to survive.",
    },
    {
      url: "blog/ai-behind-a-human-face.html",
      title: "Don't Reply to a Human Face When an AI Is Behind the Conversation",
      date: "2026-11-13",
      description: "The growing problem of AI impersonating human communication — and why transparency should be the minimum standard.",
    },
    {
      url: "blog/how-long-should-you-stay-at-a-company.html",
      title: "How Long Should You Stay at a Company?",
      date: "2026-11-13",
      description: "Why we stay, what makes an organization a good place to work, and a simple answer: stay as long as you feel good being there.",
    },
    {
      url: "blog/the-right-to-make-mistakes.html",
      title: "The Right to Make Mistakes",
      date: "2026-11-13",
      description: "Owning your mistakes, supporting others through theirs, and why an expensive mistake gets more expensive when nobody learns from it.",
    },
    {
      url: "blog/the-10-20-70-rule.html",
      title: "Choosing the Right Tool: The 10/20/70 Rule",
      date: "2026-11-13",
      description: "Knowing tools, choosing the right one, and using it well — a simple ratio for getting things done, with examples from Linux and everyday life.",
    },
  ],

  // Videos shown on the home page and the Videos page.
  // `id` is the part after "watch?v=" in a YouTube URL.
  videos: [
    // { id: "dQw4w9WgXcQ", title: "My first video", date: "2026-01-01" },
  ],
};
