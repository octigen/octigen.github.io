#!/usr/bin/env node
"use strict";

const fs = require("fs/promises");
const path = require("path");
const { marked } = require("marked");
const { PUBLISHED_POSTS } = require("../blog/blog-data.js");

const ROOT = path.resolve(__dirname, "..");
const BLOG_ROOT = path.join(ROOT, "blog");
const TEMPLATE_PATH = path.join(BLOG_ROOT, "POST_TEMPLATE.html");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");
const SITE_URL = "https://octigen.com";

marked.use({
  gfm: true,
  breaks: false,
  pedantic: false
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function renderPostHtml({ template, post, markdownHtml }) {
  const postUrl = `${SITE_URL}/blog/posts/${encodeURIComponent(post.slug)}/`;
  const imageUrl = post.coverImage
    ? `${SITE_URL}${post.coverImage}`
    : `${SITE_URL}/assets/images/octigen.png`;

  const tokens = {
    "{{POST_TITLE}}": escapeAttr(post.title || ""),
    "{{POST_EXCERPT}}": escapeAttr(post.excerpt || ""),
    "{{POST_URL}}": escapeAttr(postUrl),
    "{{POST_IMAGE_URL}}": escapeAttr(imageUrl),
    "{{POST_SLUG}}": escapeAttr(post.slug || ""),
    "{{POST_AUTHOR}}": escapeAttr(post.author || ""),
    "{{POST_CONTENT_HTML}}": markdownHtml.trim()
  };

  let output = template;
  for (const [token, value] of Object.entries(tokens)) {
    output = output.split(token).join(value);
  }
  const unresolved = output.match(/\{\{[A-Z_]+\}\}/g);
  if (unresolved) {
    throw new Error(`Unresolved template token(s): ${unresolved.join(", ")}`);
  }
  return output;
}

async function renderPost(post, template) {
  const postDir = path.join(BLOG_ROOT, "posts", post.slug);
  const mdPath = path.join(postDir, "post.md");
  const htmlPath = path.join(postDir, "index.html");

  const markdown = await fs.readFile(mdPath, "utf8");
  const markdownHtml = marked.parse(markdown).trim();
  const nextHtml = renderPostHtml({ template, post, markdownHtml });

  await fs.writeFile(htmlPath, nextHtml, "utf8");
}

function buildSitemapBlock(posts) {
  const latestDate = posts.length ? posts[0].date : new Date().toISOString().slice(0, 10);

  let xml = `    <url>\n`;
  xml += `        <loc>${SITE_URL}/blog/</loc>\n`;
  xml += `        <lastmod>${latestDate}</lastmod>\n`;
  xml += `        <changefreq>weekly</changefreq>\n`;
  xml += `        <priority>0.8</priority>\n`;
  xml += `    </url>\n`;

  for (const post of posts) {
    xml += `\n    <url>\n`;
    xml += `        <loc>${SITE_URL}/blog/posts/${encodeURIComponent(post.slug)}/</loc>\n`;
    xml += `        <lastmod>${post.date}</lastmod>\n`;
    xml += `        <changefreq>monthly</changefreq>\n`;
    xml += `        <priority>0.75</priority>\n`;
    xml += `    </url>\n`;
  }

  return xml;
}

async function updateSitemap(posts) {
  const sitemap = await fs.readFile(SITEMAP_PATH, "utf8");

  const startMarker = "<!-- BLOG_POSTS:START";
  const endMarker = "<!-- BLOG_POSTS:END -->";
  const startIdx = sitemap.indexOf(startMarker);
  const endIdx = sitemap.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Missing BLOG_POSTS markers in sitemap.xml");
  }

  const before = sitemap.slice(0, sitemap.indexOf("\n", startIdx) + 1);
  const after = sitemap.slice(endIdx);
  const block = buildSitemapBlock(posts);

  await fs.writeFile(SITEMAP_PATH, before + block + "    " + after, "utf8");
}

async function main() {
  const template = await fs.readFile(TEMPLATE_PATH, "utf8");
  for (const post of PUBLISHED_POSTS) {
    await renderPost(post, template);
  }
  await updateSitemap(PUBLISHED_POSTS);
  console.log(`Built ${PUBLISHED_POSTS.length} blog page(s) and updated sitemap.xml.`);
}

main().catch((err) => {
  console.error("Blog build failed:", err);
  process.exit(1);
});
