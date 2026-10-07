/* Jaryd's News — sources burger + story accordion + visited state */
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
    if (!article.id) return;
    if (loadVisited().indexOf(article.id) !== -1) {
      article.classList.add("story-visited");
    }
  }

  /* ---------- story accordion ---------- */
  function shouldAccordion(article) {
    if (!article || !article.classList.contains("story")) return false;
    if (article.classList.contains("oilers-card")) return false;
    if (article.closest("#tomorrows-watch")) return false;
    if (article.closest("#markets")) return false;
    return true;
  }

  function setExpanded(btn, panel, open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
  }

  function enhanceCommunityNote(cn, storyId) {
    if (!cn || cn.dataset.cnAccordion === "1") return;
    var label = cn.querySelector(":scope > .cn-label");
    if (!label) return;
    cn.dataset.cnAccordion = "1";

    var cnBodyId = (storyId || "cn") + "-cn-body";
    var body = document.createElement("div");
    body.className = "cn-body";
    body.id = cnBodyId;
    body.hidden = true;

    var move = [];
    var child = label.nextSibling;
    while (child) {
      move.push(child);
      child = child.nextSibling;
    }
    move.forEach(function (node) {
      body.appendChild(node);
    });

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cn-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", cnBodyId);

    var labelText = document.createElement("span");
    labelText.className = "cn-label";
    labelText.textContent = label.textContent || "Community Note";
    btn.appendChild(labelText);

    var chevron = document.createElement("span");
    chevron.className = "cn-chevron";
    chevron.setAttribute("aria-hidden", "true");
    btn.appendChild(chevron);

    label.replaceWith(btn);
    cn.appendChild(body);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.getAttribute("aria-expanded") === "true";
      setExpanded(btn, body, !open);
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(btn, body, false);
        btn.focus();
      }
    });
  }

  function openStory(article) {
    if (!article) return;
    var btn = article.querySelector(":scope > h3 > .story-toggle");
    var body = article.querySelector(":scope > .story-body");
    if (!btn || !body) return;
    setExpanded(btn, body, true);
    markVisited(article);
  }

  function enhanceStory(article) {
    if (!shouldAccordion(article) || article.dataset.accordion === "1") return;
    var h3 = article.querySelector(":scope > h3");
    if (!h3) return;
    article.dataset.accordion = "1";
    article.classList.add("story-collapsible");

    var titleText = h3.textContent.trim();
    var bodyId = (article.id || "story") + "-body";

    var body = document.createElement("div");
    body.className = "story-body";
    body.id = bodyId;
    body.hidden = true;

    var node = h3.nextSibling;
    while (node) {
      var next = node.nextSibling;
      body.appendChild(node);
      node = next;
    }
    article.appendChild(body);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "story-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", bodyId);

    var text = document.createElement("span");
    text.className = "story-toggle-text";
    text.textContent = titleText;
    btn.appendChild(text);

    var chevron = document.createElement("span");
    chevron.className = "story-chevron";
    chevron.setAttribute("aria-hidden", "true");
    btn.appendChild(chevron);

    h3.textContent = "";
    h3.appendChild(btn);

    var cn = body.querySelector(":scope > .community-note");
    if (cn) enhanceCommunityNote(cn, article.id);

    applyVisitedClass(article);

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      if (open) {
        setExpanded(btn, body, false);
      } else {
        setExpanded(btn, body, true);
        markVisited(article);
      }
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        setExpanded(btn, body, false);
        btn.focus();
      }
    });
  }

  function handleHash() {
    var hash = (location.hash || "").replace(/^#/, "");
    if (!hash) return;
    var el = document.getElementById(hash);
    if (el && el.classList.contains("story") && shouldAccordion(el)) {
      openStory(el);
    }
  }

  function initAccordions() {
    var stories = document.querySelectorAll("article.story");
    for (var i = 0; i < stories.length; i++) {
      enhanceStory(stories[i]);
    }
    handleHash();
  }

  window.addEventListener("hashchange", handleHash);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAccordions);
  } else {
    initAccordions();
  }
})();
