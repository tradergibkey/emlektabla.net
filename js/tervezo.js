/* Online emléktábla tervező — emlektabla.net */
(function () {
  "use strict";

  var state = {
    material: "granit",
    size: "30x20",
    orient: "fekvo",
    text: "Emlékül\nszeretteinknek",
    font: "klasszikus",
    color: "arany",
    motif: "nincs"
  };

  var LABELS = {
    material: { granit: "Gránit", marvany: "Márvány", meszko: "Mészkő" },
    orient: { fekvo: "fekvő", allo: "álló" },
    font: { klasszikus: "Klasszikus (talpas)", modern: "Modern (talp nélküli)", vesett: "Vésett hatású" },
    color: { arany: "Arany", fekete: "Fekete", feher: "Fehér", ezust: "Ezüst" },
    motif: { nincs: "Nincs", keret: "Keret", kereszt: "Kereszt", olajag: "Olajág", csillag: "Csillag" }
  };

  var MOTIF_SVG = {
    kereszt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M6 8h12"/></svg>',
    olajag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 20C9 15 14 9 20 4"/><path d="M9 15c-2.4.4-4.4-.4-5.4-2M9 15c.4-2.4-.4-4.4-2-5.4M13.5 10.5c-2.4.4-4.4-.4-5.4-2M13.5 10.5c.4-2.4-.4-4.4-2-5.4M17 7c-1.8.3-3.3-.3-4-1.5M17 7c.3-1.8-.3-3.3-1.5-4"/></svg>',
    csillag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 5.9-5.3-3-5.3 3 1.2-5.9L3.4 9.3l6-.7z"/></svg>'
  };

  var plaque = document.getElementById("plaque");
  var plaqueText = document.getElementById("plaqueText");
  var plaqueMotif = document.getElementById("plaqueMotif");
  var plaqueFrame = document.getElementById("plaqueFrame");
  var stage = document.getElementById("stage");
  var stageSize = document.getElementById("stageSize");
  var btnQuote = document.getElementById("btnQuote");
  if (!plaque || !stage) return;

  /* ---------- render ---------- */
  function render() {
    plaque.className = "plaque stone-" + state.material +
      " font-" + state.font +
      " color-" + state.color +
      " orient-" + state.orient +
      " size-" + state.size.replace("x", "-");

    var safe = state.text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
    plaqueText.innerHTML = safe || "&nbsp;";

    plaqueFrame.style.display = state.motif === "keret" ? "block" : "none";
    if (MOTIF_SVG[state.motif]) {
      plaqueMotif.innerHTML = MOTIF_SVG[state.motif];
      plaqueMotif.style.display = "block";
    } else {
      plaqueMotif.style.display = "none";
    }

    var dims = state.size.split("x");
    var shown = state.orient === "allo" ? dims[1] + " × " + dims[0] : dims[0] + " × " + dims[1];
    if (stageSize) stageSize.textContent = shown + " cm · " + LABELS.orient[state.orient];

    updateQuoteLink();
  }

  /* ---------- quote handoff ---------- */
  function summary() {
    var dims = state.size.split("x");
    var shown = state.orient === "allo" ? dims[1] + "×" + dims[0] : dims[0] + "×" + dims[1];
    return "Az online tervezőben összeállított tábla:\n" +
      "• Anyag: " + LABELS.material[state.material] + "\n" +
      "• Méret: " + shown + " cm (" + LABELS.orient[state.orient] + ")\n" +
      "• Betűtípus: " + LABELS.font[state.font] + "\n" +
      "• Betűszín: " + LABELS.color[state.color] + "\n" +
      "• Díszítés: " + LABELS.motif[state.motif] + "\n" +
      "• Felirat: \u201E" + state.text.replace(/\n/g, " / ") + "\u201D";
  }

  function updateQuoteLink() {
    if (btnQuote) btnQuote.href = "/?terv=" + encodeURIComponent(summary()) + "#kapcsolat";
  }

  /* ---------- controls ---------- */
  function bindGroup(id, attr, key) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-" + attr + "]");
      if (!btn) return;
      wrap.querySelectorAll(".active").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      state[key] = btn.getAttribute("data-" + attr);
      render();
    });
  }

  bindGroup("ctrlMaterial", "material", "material");
  bindGroup("ctrlSize", "size", "size");
  bindGroup("ctrlOrient", "orient", "orient");
  bindGroup("ctrlFont", "font", "font");
  bindGroup("ctrlColor", "color", "color");
  bindGroup("ctrlMotif", "motif", "motif");

  var textInput = document.getElementById("ctrlText");
  if (textInput) {
    textInput.addEventListener("input", function () {
      state.text = textInput.value;
      render();
    });
  }

  /* ---------- gentle 3D tilt (mouse + touch) ---------- */
  var MAX_TILT = 7;
  function applyTilt(x, y) {
    var r = stage.getBoundingClientRect();
    var px = (x - r.left) / r.width - 0.5;
    var py = (y - r.top) / r.height - 0.5;
    plaque.style.transform =
      "rotateX(" + (-py * MAX_TILT) + "deg) rotateY(" + (px * MAX_TILT) + "deg)";
  }
  function resetTilt() {
    plaque.style.transform = "rotateX(2deg) rotateY(-4deg)";
  }
  stage.addEventListener("mousemove", function (e) { applyTilt(e.clientX, e.clientY); });
  stage.addEventListener("mouseleave", resetTilt);
  stage.addEventListener("touchmove", function (e) {
    if (e.touches.length === 1) applyTilt(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  stage.addEventListener("touchend", resetTilt);

  resetTilt();
  render();
})();
