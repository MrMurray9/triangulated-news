/* Jaryd's News — sources burger, visited state, video headline badges */
(function () {
  /* Edition-scoped visited key: jn-visited-stories-YYYY-MM-DD from <time datetime> */
  function editionDateKey() {
    var t = document.querySelector("header.site time[datetime], .edition-date time[datetime]");
    if (t) {
      var d = (t.getAttribute("datetime") || "").slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return "jn-visited-stories-" + d;
    }
    return "jn-visited-stories-unknown";
  }

  function visitedKey() {
    return editionDateKey();
  }

  /* ---------- sources burger ---------- */
  function closePanel(btn, panel) {
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  function openPanel(btn, panel) {
    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }

  function toggleSources(btn) {
    var id = btn.getAttribute("aria-controls");
    if (!id) return;
    var panel = document.getElementById(id);
    if (!panel) return;
    var open = btn.getAttribute("aria-expanded") === "true";
    if (open) {
      closePanel(btn, panel);
    } else {
      openPanel(btn, panel);
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".sources-toggle");
    if (!btn) return;
    e.preventDefault();
    toggleSources(btn);
  });

  document.addEventListener("keydown", function (e) {
    var btn = e.target.closest && e.target.closest(".sources-toggle");
    if (!btn) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSources(btn);
    } else if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      e.preventDefault();
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) closePanel(btn, panel);
      btn.focus();
    }
  });

  /* ---------- visited state (localStorage) ---------- */
  function loadVisited() {
    try {
      var raw = localStorage.getItem(visitedKey());
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveVisited(ids) {
    try {
      localStorage.setItem(visitedKey(), JSON.stringify(ids));
    } catch (err) {
      /* quota / private mode — ignore */
    }
  }

  function markVisited(article) {
    if (!article || !article.id) return;
    article.classList.add("story-visited");
    var visited = loadVisited();
    if (visited.indexOf(article.id) === -1) {
      visited.push(article.id);
      saveVisited(visited);
    }
  }

  function applyVisitedClass(article) {
    if (!article || !article.id) return;
    if (loadVisited().indexOf(article.id) !== -1) {
      article.classList.add("story-visited");
    }
  }

  function shouldAccordion(article) {
    if (!article || !article.classList.contains("story")) return false;
    if (article.classList.contains("oilers-card")) return false;
    if (article.closest("#markets")) return false;
    return true;
  }

  function storyDetails(article) {
    if (!article) return null;
    var kids = article.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el.tagName === "DETAILS" && el.classList.contains("story-details")) {
        return el;
      }
    }
    return article.querySelector("details.story-details");
  }

  function openParentRegion(article) {
    if (!article) return;
    var region = article.closest("section.region");
    if (!region) return;
    var regionDetails = region.querySelector(":scope > details.region-details");
    if (regionDetails) regionDetails.open = true;
  }

  function openStory(article) {
    if (!article) return;
    openParentRegion(article);
    var details = storyDetails(article);
    if (!details) return;
    details.open = true;
    markVisited(article);
  }

  /* Mark visited when a story details is opened */
  document.addEventListener(
    "toggle",
    function (e) {
      var details = e.target;
      if (!details || details.tagName !== "DETAILS") return;
      if (!details.classList.contains("story-details")) return;
      if (!details.open) return;
      var article = details.parentElement;
      while (article && article.tagName !== "ARTICLE") {
        article = article.parentElement;
      }
      if (article && shouldAccordion(article)) {
        markVisited(article);
      }
    },
    true
  );

  function handleHash() {
    var hash = (location.hash || "").replace(/^#/, "");
    if (!hash) return;
    var el = document.getElementById(hash);
    if (!el) return;
    if (el.classList.contains("story") && shouldAccordion(el)) {
      openStory(el);
      return;
    }
    if (el.classList.contains("region")) {
      var regionDetails = el.querySelector(":scope > details.region-details");
      if (regionDetails) regionDetails.open = true;
      return;
    }
    /* ticker / oilers card etc. — open parent region */
    openParentRegion(el);
  }


  /* ---------- video headline badges ---------- */
  /* Morning routine: keep putting .video-embed (YouTube iframe) in the story body.
     This scans for embeds and injects a small screen/play icon into the collapsed
     headline summary automatically — no per-story HTML badge needed. */
  var VIDEO_BADGE_SVG =
    '<svg class="story-video-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/>' +
    '<path d="M10 9.2v5.6l5-2.8z" fill="currentColor"/>' +
    "</svg>";

  function storyHasVideo(article) {
    if (!article) return false;
    var body = article.querySelector(".story-body");
    var root = body || article;
    if (root.querySelector(".video-embed")) return true;
    if (root.querySelector('iframe[src*="youtube"], iframe[src*="youtube-nocookie"], iframe[src*="youtu.be"]')) {
      return true;
    }
    return false;
  }

  function ensureVideoBadge(article) {
    if (!shouldAccordion(article) || !storyHasVideo(article)) return false;
    var details = storyDetails(article);
    if (!details) return false;
    var summary = details.querySelector(":scope > .story-summary");
    if (!summary) return false;
    if (summary.querySelector(".story-video-badge")) return true;
    var h3 = summary.querySelector("h3");
    var toggle = summary.querySelector(".story-toggle-text");
    var badge = document.createElement("span");
    badge.className = "story-video-badge";
    badge.setAttribute("title", "Has video");
    badge.innerHTML =
      VIDEO_BADGE_SVG + '<span class="visually-hidden">Has video</span>';
    if (toggle && toggle.parentNode) {
      /* Place after title text, before the chevron */
      var chevron = summary.querySelector(".story-chevron");
      if (chevron && chevron.parentNode === toggle.parentNode) {
        toggle.parentNode.insertBefore(badge, chevron);
      } else {
        toggle.parentNode.insertBefore(badge, toggle.nextSibling);
      }
    } else if (h3) {
      h3.appendChild(badge);
    } else {
      summary.appendChild(badge);
    }
    return true;
  }

  function initVideoBadges() {
    var stories = document.querySelectorAll("article.story");
    var n = 0;
    for (var i = 0; i < stories.length; i++) {
      if (ensureVideoBadge(stories[i])) n += 1;
    }
    return n;
  }

  function initVisited() {
    var stories = document.querySelectorAll("article.story");
    for (var i = 0; i < stories.length; i++) {
      if (shouldAccordion(stories[i])) {
        applyVisitedClass(stories[i]);
      }
    }
    initVideoBadges();
    handleHash();
  }

  window.addEventListener("hashchange", handleHash);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVisited);
  } else {
    initVisited();
  }
})();
