/* Jaryd's News — per-article sources burger toggle */
(function () {
  function closePanel(btn, panel) {
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  function openPanel(btn, panel) {
    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }

  function toggle(btn) {
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
    toggle(btn);
  });

  document.addEventListener("keydown", function (e) {
    var btn = e.target.closest && e.target.closest(".sources-toggle");
    if (!btn) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(btn);
    } else if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      e.preventDefault();
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) closePanel(btn, panel);
      btn.focus();
    }
  });
})();
