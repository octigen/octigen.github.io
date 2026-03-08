/**
 * Blog Data - Single Source of Truth
 *
 * To add a new post:
 *   1. Create the folder: blog/posts/YYYY-MM-DD-your-slug/
 *   2. Create the post file: blog/posts/YYYY-MM-DD-your-slug/post.md
 *   3. Add an entry to the blogPosts array below (newest post first).
 *   4. Update sitemap.xml with the new post URL.
 */

const BLOG_AUTHORS = {
  kevin: {
    name: "Kevin Graziani",
    role: "Co-Founder & CFO",
    image: "/assets/images/kevin_graziani.png",
    bio: "Former front-office analyst at Credit Suisse and UBS. Dual MSc in Quantitative Finance. Co-founder of Octigen."
  },
  michel: {
    name: "Michel Müller",
    role: "Co-Founder & CEO",
    image: "/assets/images/michel_muller.png",
    bio: "Data architect and engineer in finance. Deeply cares about building the right tools for the job. MSc ETH Zurich & Dr. Eng. from Tokyo Tech. Co-founder of Octigen."
  }
};

/**
 * Tag definitions — keep in sync with blog.css tag colour classes.
 * Each tag has: label (display name), cssClass (appended to .blog-tag-).
 */
const BLOG_TAGS = {
  "product":      { label: "Product",      cssClass: "blog-tag-product" },
  "industry":     { label: "Industry",     cssClass: "blog-tag-industry" },
  "tutorial":     { label: "Tutorial",     cssClass: "blog-tag-tutorial" },
  "startup-life": { label: "Startup Life", cssClass: "blog-tag-startup-life" }
};

/**
 * Post registry — newest post first.
 *
 * Fields:
 *   title       {string}   Post title
 *   slug        {string}   Folder name under blog/posts/ (also used as URL path segment)
 *   date        {string}   ISO date (YYYY-MM-DD) — used for display and sorting
 *   excerpt     {string}   Short description shown on cards (1-2 sentences)
 *   coverImage  {string|null} Absolute path to cover image, or null for placeholder
 *   tag         {string}   One of the keys in BLOG_TAGS
 *   author      {string}   One of the keys in BLOG_AUTHORS
 *   readTime    {string}   e.g. "5 min"
 *   featured    {boolean}  If true, shown as the large hero card at the top
 */
const BLOG_POSTS = [
  {
    title: "A Swiss Paperwork Massacre: Why We Fled to Stripe",
    slug: "2026-03-09-payment-nightmare",
    date: "2026-03-09",
    excerpt: "We wanted a Swiss-first payment stack for Octigen. After paper forms, delays, and a rejection, Stripe went live in a day.",
    coverImage: "/blog/posts/2026-03-09-payment-nightmare/cover.jpg",
    coverAlt: "A stressed startup founder comparing payment providers and compliance requirements",
    tag: "industry",
    author: "michel",
    readTime: "5 min",
    featured: true
  },
  {
    title: "Why We Built Octigen: From Spreadsheets to AI-Powered Reports",
    slug: "2026-03-06-why-we-built-octigen",
    date: "2026-03-06",
    excerpt: "Every great product starts with a genuine pain. Ours started with too many late nights turning spreadsheets into client-ready PowerPoints. Here's the story.",
    coverImage: "/blog/posts/2026-03-06-why-we-built-octigen/cover.jpg",
    tag: "startup-life",
    author: "kevin",
    readTime: "6 min",
    featured: true
  }
];

// Export for module environments (Node, bundlers); no-op in browsers.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BLOG_POSTS, BLOG_AUTHORS, BLOG_TAGS };
}
