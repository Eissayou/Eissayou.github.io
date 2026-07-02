# SEO Status & Action Checklist

Last updated: 2026-07-01 (site overhaul branch `claude/wonderful-swanson-b072ee`)

## The one thing that was silently hurting indexing (now fixed)

The site is served at **`https://www.eissayou.com`** (the `CNAME` file says `www.eissayou.com`; the apex
`eissayou.com` 301-redirects to www). But every canonical tag, `og:url`, sitemap entry, robots.txt sitemap
line, and JSON-LD URL used the **non-www** host. Google was being told "the real copy of this page lives at
a URL that redirects away from it" — a mixed signal that suppresses indexing.

**Fix applied:** every URL in the repo now uses `https://www.eissayou.com/...`.
**Rule going forward:** never write a non-www `https://eissayou.com` URL in any file.

## What's in this overhaul

- ✅ Canonical/og/sitemap/robots/JSON-LD URLs unified on the www host
- ✅ Sitemap `lastmod` refreshed; 3 new project pages added to it
- ✅ Branded `404.html` (noindexed)
- ✅ Image optimization: assets went 17.7 MB → ~0.5 MB; proper 1200×630 `og-image.jpg`; width/height/lazy attrs; font & CDN preconnects
- ✅ Per-project detail pages: `projects/azure-honeypot.html`, `projects/formfixai.html`, `projects/pcap-tracker.html` (each with SoftwareApplication + BreadcrumbList schema)
- ✅ Expanded achievements page (featured TA Excellence Award, Cal-Bridge, UNL research, certifications) + Person schema with award array, 5 credential objects, achievements ItemList, WebSite schema
- ✅ Titles ≤60 chars + synced og/twitter tags, tuned descriptions, accessibility fixes (button hamburger, skip links, focus styles, contrast, reduced motion), real contact-form success/error handling
- ✅ Fact fixes: FormFixAI no longer claims MediaPipe (it uses Gemini video analysis); dead pcaptracker.site link replaced with the GitHub repo
- ✅ Release gate: JSON-LD parses on all pages, zero non-www URLs, unique titles/descriptions/canonicals, all internal links + anchors resolve, every page under 350 KB

## What Jason must do after merging to main

GitHub Pages deploys from `main`, so none of this is live until merged.

1. **Google Search Console** (search.google.com/search-console):
   - Add/verify the property `https://www.eissayou.com` (URL-prefix property; verify via the HTML-tag or
     DNS method). If you previously verified the non-www property, keep it but do the work in the www one.
   - Sitemaps → submit `https://www.eissayou.com/sitemap.xml`.
   - URL Inspection → paste the homepage URL → **Request indexing**. Repeat for
     `/achievements.html`, `/projects.html`, and each new project page.
2. **Bing Webmaster Tools** (optional, 5 minutes): import the site from Search Console.
3. **Backlinks — the biggest lever you control off-site:**
   - Put `https://www.eissayou.com` on your GitHub profile (bio "website" field) and pin the repos.
   - Add the site to your LinkedIn profile (Contact info → Website, and in the About section).
   - When you post about projects on LinkedIn, link to the project page on your site, not just the live app.
4. **Monitor:** Search Console → Pages report. Expect indexing to pick up within days-to-weeks after
   requesting; the canonical fix removes the main blocker.

## Notes

- `blog.html` is a legacy redirect stub → achievements; it's `noindex` and deliberately kept (old links keep working).
- `meta keywords` tags are ignored by Google — harmless, but don't bother maintaining them.
