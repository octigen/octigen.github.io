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
    return `/blog/post/?slug=${encodeURIComponent(slug)}`;
  }

  function getPostBySlug(slug) {
    return BLOG_POSTS.find(p => p.slug === slug) || null;
  }

  function getDisplayDate(isoDate) {
    if (!isoDate) return "";
    return formatDate(isoDate);
  }

  function renderHero(post) {
    const target = document.getElementById("blog-post-hero-content");
    if (!target || !post) return;

    const tag = BLOG_TAGS[post.tag] || {};
    const author = BLOG_AUTHORS[post.author] || {};

    target.innerHTML = `
      <span class="blog-tag ${tag.cssClass || ""}">${tag.label || ""}</span>
      <h1>${post.title}</h1>
      <div class="blog-post-hero-meta">
        <span>${author.name || ""}</span>
        <span class="meta-divider">·</span>
        <span>${getDisplayDate(post.date)}</span>
        <span class="meta-divider">·</span>
        <span>${post.readTime} read</span>
      </div>`;
  }

  function renderCover(post) {
    const target = document.getElementById("blog-post-cover-wrap");
    if (!target || !post) return;

    if (post.coverImage) {
      target.innerHTML = `
        <img
          src="${post.coverImage}"
          alt="${post.coverAlt || post.title}"
          class="blog-post-cover-img"
          width="1200"
          height="654"
          loading="eager"
        />`;
      return;
    }

    target.innerHTML = `
      <div class="blog-post-cover-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.75">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span>Cover image</span>
      </div>`;
  }

  function setMetaByName(name, content) {
    if (!content) return;
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  function setMetaByProperty(property, content) {
    if (!content) return;
    const el = document.querySelector(`meta[property="${property}"]`);
    if (el) el.setAttribute("content", content);
  }

  function setCanonical(url) {
    const el = document.querySelector('link[rel="canonical"]');
    if (el && url) el.setAttribute("href", url);
  }

  function applySeoMetadata(post) {
    if (!post) return;
    const postUrl = `https://octigen.com/blog/post/?slug=${encodeURIComponent(post.slug)}`;
    const imageUrl = post.coverImage
      ? `https://octigen.com${post.coverImage}`
      : "https://octigen.com/assets/images/octigen.png";

    document.title = `${post.title} - Octigen Blog`;
    setCanonical(postUrl);
    setMetaByName("description", post.excerpt || "");
    setMetaByName("twitter:title", post.title);
    setMetaByName("twitter:description", post.excerpt || "");
    setMetaByName("twitter:image", imageUrl);
    setMetaByProperty("og:title", post.title);
    setMetaByProperty("og:description", post.excerpt || "");
    setMetaByProperty("og:url", postUrl);
    setMetaByProperty("og:image", imageUrl);
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
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || body.dataset.postSlug;
    const post = slug ? getPostBySlug(slug) : null;
    const authorKey = body.dataset.postAuthor || (post && post.author);

    if (post) {
      renderHero(post);
      renderCover(post);
      applySeoMetadata(post);
    }

    if (slug) renderMarkdown(slug);
    if (authorKey) renderAuthorCard(authorKey);
    if (slug) renderRelated(slug);
  });
})();
