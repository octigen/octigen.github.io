/**
 * Blog Post Helper
 *
 * 1. Fetches post.md from the same directory as index.html
 * 2. Renders it to HTML using marked.js (must be loaded before this script)
 * 3. Injects the result into #blog-post-content
 * 4. Renders the author card into #blog-author-card
 * 5. Renders related posts into #blog-related-wrap
 *
 * Reads from <body>:
 *   data-post-slug   — matches slug in BLOG_POSTS (blog-data.js)
 *   data-post-author — key in BLOG_AUTHORS (blog-data.js)
 *
 * Depends on: marked.js and blog-data.js loaded before this script.
 */

(function () {
  "use strict";

  /* -------------------------------------------------------
     Helpers
  ------------------------------------------------------- */
  function formatDate(isoDate) {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function postURL(slug) {
    return `/blog/posts/${slug}/`;
  }

  /* -------------------------------------------------------
     Markdown renderer
  ------------------------------------------------------- */
  function renderMarkdown(slug) {
    const target = document.getElementById("blog-post-content");
    if (!target) return;

    // Show loading state
    target.innerHTML = '<p style="opacity:0.4">Loading...</p>';

    fetch(`/blog/posts/${slug}/post.md`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load post.md (${res.status})`);
        return res.text();
      })
      .then(md => {
        // Configure marked: GFM + line breaks, no mangle, safe links
        marked.use({
          gfm: true,
          breaks: false,
          pedantic: false
        });
        target.innerHTML = marked.parse(md);
      })
      .catch(err => {
        console.error("Blog post load error:", err);
        target.innerHTML = '<p style="opacity:0.5">Could not load post content.</p>';
      });
  }

  /* -------------------------------------------------------
     Author card
  ------------------------------------------------------- */
  function renderAuthorCard(authorKey) {
    const target = document.getElementById("blog-author-card");
    if (!target) return;

    const author = BLOG_AUTHORS[authorKey];
    if (!author) return;

    target.innerHTML = `
      <div class="blog-post-author-card">
        <img src="${author.image}" alt="${author.name}" class="blog-post-author-img">
        <div class="blog-post-author-info">
          <div class="blog-post-author-name">${author.name}</div>
          <div class="blog-post-author-role">${author.role}</div>
          <p class="blog-post-author-bio">${author.bio}</p>
        </div>
      </div>`;
  }

  /* -------------------------------------------------------
     Related posts (same tag, excluding current post)
  ------------------------------------------------------- */
  function renderRelated(currentSlug) {
    const wrap = document.getElementById("blog-related-wrap");
    const section = document.getElementById("blog-related-section");
    if (!wrap || !section) return;

    const currentPost = BLOG_POSTS.find(p => p.slug === currentSlug);
    if (!currentPost) { section.style.display = "none"; return; }

    const sameTag = BLOG_POSTS.filter(
      p => p.slug !== currentSlug && p.tag === currentPost.tag
    ).slice(0, 2);

    const fallback = sameTag.length > 0
      ? sameTag
      : BLOG_POSTS.filter(p => p.slug !== currentSlug).slice(0, 2);

    if (fallback.length === 0) { section.style.display = "none"; return; }

    wrap.innerHTML = `
      <div class="blog-related-header">
        <h3>More to read</h3>
      </div>
      <div class="blog-related-grid">
        ${fallback.map(post => {
          const author = BLOG_AUTHORS[post.author] || {};
          const tag = BLOG_TAGS[post.tag] || {};
          return `
            <a href="${postURL(post.slug)}" class="blog-card">
              <div class="blog-card-image-wrap">
                <div class="blog-card-image">
                  ${post.coverImage
                    ? `<img src="${post.coverImage}" alt="${post.title}" loading="lazy">`
                    : `<div class="blog-card-image-placeholder">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                           <rect x="3" y="3" width="18" height="18" rx="3"/>
                           <circle cx="8.5" cy="8.5" r="1.5"/>
                           <path d="M21 15l-5-5L5 21"/>
                         </svg>
                       </div>`}
                </div>
              </div>
              <div class="blog-card-body">
                <span class="blog-tag ${tag.cssClass || ''}">${tag.label || ''}</span>
                <h2 class="blog-card-title">${post.title}</h2>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-meta">
                  <img src="${author.image}" alt="${author.name}" class="blog-card-author-img">
                  <span class="blog-card-author-name">${author.name}</span>
                  <span class="blog-card-meta-divider">·</span>
                  <span class="blog-card-date">${formatDate(post.date)}</span>
                  <span class="blog-card-read-time">${post.readTime} read</span>
                </div>
              </div>
            </a>`;
        }).join("")}
      </div>`;
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const slug = body.dataset.postSlug;
    const authorKey = body.dataset.postAuthor;

    if (slug) renderMarkdown(slug);
    if (authorKey) renderAuthorCard(authorKey);
    if (slug) renderRelated(slug);
  });
})();
