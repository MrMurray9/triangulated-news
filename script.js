/* Jaryd's News — sources burger + visited state for native details accordions */
(function () {
  var VISITED_KEY = "jn-visited-stories";

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
      var raw = localStorage.getItem(VISITED_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveVisited(ids) {
    try {
      localStorage.setItem(VISITED_KEY, JSON.stringify(ids));
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

  function initVisited() {
    var stories = document.querySelectorAll("article.story");
    for (var i = 0; i < stories.length; i++) {
      if (shouldAccordion(stories[i])) {
        applyVisitedClass(stories[i]);
      }
    }
    handleHash();
  }

  window.addEventListener("hashchange", handleHash);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVisited);
  } else {
    initVisited();
  }
})();
