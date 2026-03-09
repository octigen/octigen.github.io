/**
 * Blog Loader
 * Reads BLOG_POSTS / BLOG_AUTHORS / BLOG_TAGS from blog-data.js
 * and renders the listing page as a 2-column card grid.
 *
 * Depends on: blog-data.js loaded before this script.
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

  function tagHTML(tagKey) {
    const tag = BLOG_TAGS[tagKey];
    if (!tag) return "";
    return `<span class="blog-tag ${tag.cssClass}">${tag.label}</span>`;
  }

  function postURL(slug) {
    return `/blog/posts/${encodeURIComponent(slug)}/`;
  }

  function coverImageHTML(post) {
    if (post.coverImage) {
      return `
        <div class="blog-card-image">
          <img src="${post.coverImage}" alt="${post.title}" loading="lazy">
        </div>`;
    }
    return `
      <div class="blog-card-image">
        <div class="blog-card-image-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      </div>`;
  }

  function authorMeta(post) {
    const author = BLOG_AUTHORS[post.author];
    if (!author) return "";
    return `
      <div class="blog-card-meta">
        <img src="${author.image}" alt="${author.name}" class="blog-card-author-img">
        <span class="blog-card-author-name">${author.name}</span>
        <span class="blog-card-meta-divider">·</span>
        <span class="blog-card-date">${formatDate(post.date)}</span>
        <span class="blog-card-read-time">${post.readTime} read</span>
      </div>`;
  }

  /* -------------------------------------------------------
     Render: card (all posts use this)
  ------------------------------------------------------- */
  function renderCard(post, isFirst) {
    const latestBadge = isFirst
      ? `<span class="blog-latest-badge">Latest</span>`
      : "";
    return `
      <a href="${postURL(post.slug)}" class="blog-card">
        <div class="blog-card-image-wrap">
          ${latestBadge}
          ${coverImageHTML(post)}
        </div>
        <div class="blog-card-body">
          ${tagHTML(post.tag)}
          <h2 class="blog-card-title">${post.title}</h2>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          ${authorMeta(post)}
        </div>
      </a>`;
  }

  /* -------------------------------------------------------
     Filter logic
  ------------------------------------------------------- */
  let activeTag = "all";

  function getFilteredPosts() {
    if (activeTag === "all") return BLOG_POSTS;
    return BLOG_POSTS.filter(p => p.tag === activeTag);
  }

  /* -------------------------------------------------------
     Render listing
  ------------------------------------------------------- */
  function renderListing() {
    const gridWrap = document.getElementById("blog-grid-wrap");
    if (!gridWrap) return;

    const filtered = getFilteredPosts();

    if (filtered.length === 0) {
      gridWrap.innerHTML = `
        <div class="blog-empty-state">
          <p>No posts yet in this category — check back soon!</p>
        </div>`;
      return;
    }

    gridWrap.innerHTML = filtered
      .map((post, i) => renderCard(post, i === 0))
      .join("");
  }

  /* -------------------------------------------------------
     Wire up filter buttons — hide tags with zero posts
  ------------------------------------------------------- */
  function initFilters() {
    const buttons = document.querySelectorAll(".blog-filter-btn");

    // Count posts per tag
    const counts = {};
    BLOG_POSTS.forEach(p => {
      counts[p.tag] = (counts[p.tag] || 0) + 1;
    });

    buttons.forEach(btn => {
      const tag = btn.dataset.tag;
      // Hide tag-specific buttons that have no posts
      if (tag && tag !== "all" && !counts[tag]) {
        btn.style.display = "none";
        return;
      }
      btn.addEventListener("click", () => {
        activeTag = tag || "all";
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderListing();
      });
    });
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderListing();
    initFilters();
  });
})();
