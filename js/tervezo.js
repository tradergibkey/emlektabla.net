/* Online emléktábla tervező v2 — emlektabla.net */
(function () {
  "use strict";

  var state = {
    material: "granit",
    size: "30x20",
    customSize: "",
    orient: "fekvo",
    text: "Emlékül\nszeretteinknek",
    font: "klasszikus",
    customFont: "",
    bgColor: "fekete",
    textColor: "arany",
    motif: "nincs",
    motifColor: "arany"
  };

  /* ---- 16-color palette ---- */
  var COLORS = [
    {id:"fekete",    label:"Fekete",       hex:"#1B1922"},
    {id:"sotetszurke",label:"Sötétszürke", hex:"#4A4856"},
    {id:"szurke",    label:"Szürke",       hex:"#8A8898"},
    {id:"vilagosszurke",label:"Világosszürke",hex:"#C4C2CC"},
    {id:"feher",     label:"Fehér",        hex:"#F7F5FA"},
    {id:"krem",      label:"Krém",         hex:"#F5E6C8"},
    {id:"arany",     label:"Arany",        hex:"#C9962E"},
    {id:"sotetarany",label:"Sötét arany",  hex:"#8B6914"},
    {id:"bronz",     label:"Bronz",        hex:"#8C5E3C"},
    {id:"ezust",     label:"Ezüst",        hex:"#B9BCC8"},
    {id:"bordo",     label:"Bordó",        hex:"#6B1530"},
    {id:"voros",     label:"Vörös",        hex:"#8B2020"},
    {id:"sotetkek",  label:"Sötétkék",     hex:"#1B2A4A"},
    {id:"zold",      label:"Zöld",         hex:"#2A5A3A"},
    {id:"barna",     label:"Barna",        hex:"#5C3D2E"},
    {id:"terrakotta",label:"Terrakotta",   hex:"#C47244"}
  ];

  function hexFor(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i].hex;
    return "#C9962E";
  }
  function labelFor(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i].label;
    return id;
  }

  var LABELS = {
    material: { granit: "Gránit", marvany: "Márvány", meszko: "Mészkő" },
    orient: { fekvo: "fekvő", allo: "álló" },
    font: { klasszikus: "Klasszikus (talpas)", modern: "Modern (talp nélküli)", vesett: "Vésett hatású" },
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
    /* material texture */
    plaque.className = "plaque stone-" + state.material
      + " orient-" + state.orient
      + " size-" + state.size.replace("x", "-");

    /* background color overlay */
    plaque.style.backgroundColor = hexFor(state.bgColor);

    /* text color */
    var tc = hexFor(state.textColor);
    plaqueText.style.cssText = "";
    plaqueText.style.color = tc;
    /* add metallic gradient for gold/silver */
    if (state.textColor === "arany" || state.textColor === "sotetarany") {
      plaqueText.style.background = "linear-gradient(160deg,#E8C165 10%,#B07E1F 45%,#F0D48A 70%,#A87718 100%)";
      plaqueText.style.webkitBackgroundClip = "text";
      plaqueText.style.backgroundClip = "text";
      plaqueText.style.color = "transparent";
      plaqueText.style.filter = "drop-shadow(0 1px 1px rgba(0,0,0,.45))";
    } else if (state.textColor === "ezust") {
      plaqueText.style.background = "linear-gradient(160deg,#E6E8F0 10%,#9FA3B2 45%,#F2F3F8 70%,#8E92A2 100%)";
      plaqueText.style.webkitBackgroundClip = "text";
      plaqueText.style.backgroundClip = "text";
      plaqueText.style.color = "transparent";
      plaqueText.style.filter = "drop-shadow(0 1px 1px rgba(0,0,0,.4))";
    } else if (state.textColor === "bronz") {
      plaqueText.style.background = "linear-gradient(160deg,#C49A6C 10%,#8C5E3C 45%,#D4AA78 70%,#7A4E2E 100%)";
      plaqueText.style.webkitBackgroundClip = "text";
      plaqueText.style.backgroundClip = "text";
      plaqueText.style.color = "transparent";
      plaqueText.style.filter = "drop-shadow(0 1px 1px rgba(0,0,0,.4))";
    } else {
      plaqueText.style.textShadow = "0 1px 1px rgba(0,0,0,.3)";
    }

    /* font family */
    if (state.font === "klasszikus") {
      plaqueText.style.fontFamily = 'Georgia, "Times New Roman", serif';
      plaqueText.style.letterSpacing = ".04em";
      plaqueText.style.textTransform = "none";
      plaqueText.style.fontSize = "";
    } else if (state.font === "modern") {
      plaqueText.style.fontFamily = "var(--font-head, 'Sora'), sans-serif";
      plaqueText.style.letterSpacing = ".02em";
      plaqueText.style.textTransform = "none";
      plaqueText.style.fontSize = "";
    } else {
      plaqueText.style.fontFamily = "'Space Mono', monospace";
      plaqueText.style.letterSpacing = ".14em";
      plaqueText.style.textTransform = "uppercase";
      plaqueText.style.fontSize = "clamp(.9rem,2.6vw,1.2rem)";
    }

    /* text content */
    var safe = state.text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
    plaqueText.innerHTML = safe || "&nbsp;";

    /* motif color + visibility */
    var mc = hexFor(state.motifColor);
    plaqueFrame.style.borderColor = mc;
    plaqueMotif.style.color = mc;
    plaqueFrame.style.display = state.motif === "keret" ? "block" : "none";
    if (MOTIF_SVG[state.motif]) {
      plaqueMotif.innerHTML = MOTIF_SVG[state.motif];
      plaqueMotif.style.display = "block";
    } else {
      plaqueMotif.style.display = "none";
    }

    /* size label */
    var dims = state.size.split("x");
    var shown = state.orient === "allo" ? dims[1] + " × " + dims[0] : dims[0] + " × " + dims[1];
    var sizeText = state.customSize ? state.customSize + " (egyedi)" : shown + " cm · " + LABELS.orient[state.orient];
    if (stageSize) stageSize.textContent = sizeText;

    updateQuoteLink();
  }

  /* ---------- quote handoff ---------- */
  function summary() {
    var dims = state.size.split("x");
    var shown = state.orient === "allo" ? dims[1] + "×" + dims[0] : dims[0] + "×" + dims[1];
    var sizeStr = state.customSize ? state.customSize + " (egyedi méret)" : shown + " cm (" + LABELS.orient[state.orient] + ")";
    var fontStr = state.customFont
      ? LABELS.font[state.font] + " — ügyfél kérése: \"" + state.customFont + "\""
      : LABELS.font[state.font];
    return "Az online tervezőben összeállított tábla:\n" +
      "\u2022 Anyag: " + LABELS.material[state.material] + "\n" +
      "\u2022 Méret: " + sizeStr + "\n" +
      "\u2022 Betűtípus: " + fontStr + "\n" +
      "\u2022 Háttérszín: " + labelFor(state.bgColor) + "\n" +
      "\u2022 Betűszín: " + labelFor(state.textColor) + "\n" +
      "\u2022 Díszítés: " + LABELS.motif[state.motif] + "\n" +
      "\u2022 Díszítés színe: " + labelFor(state.motifColor) + "\n" +
      "\u2022 Felirat: \u201E" + state.text.replace(/\n/g, " / ") + "\u201D";
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
  bindGroup("ctrlBgColor", "color", "bgColor");
  bindGroup("ctrlTextColor", "color", "textColor");
  bindGroup("ctrlMotif", "motif", "motif");
  bindGroup("ctrlMotifColor", "color", "motifColor");

  /* text inputs */
  function bindInput(id, key) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      state[key] = el.value;
      render();
    });
  }
  bindInput("ctrlText", "text");
  bindInput("ctrlCustomSize", "customSize");
  bindInput("ctrlCustomFont", "customFont");

  /* ---------- gentle 3D tilt ---------- */
  var MAX_TILT = 7;
  function applyTilt(x, y) {
    var r = stage.getBoundingClientRect();
    var px = (x - r.left) / r.width - 0.5;
    var py = (y - r.top) / r.height - 0.5;
    plaque.style.transform = "rotateX(" + (-py * MAX_TILT) + "deg) rotateY(" + (px * MAX_TILT) + "deg)";
  }
  function resetTilt() { plaque.style.transform = "rotateX(2deg) rotateY(-4deg)"; }
  stage.addEventListener("mousemove", function (e) { applyTilt(e.clientX, e.clientY); });
  stage.addEventListener("mouseleave", resetTilt);
  stage.addEventListener("touchmove", function (e) {
    if (e.touches.length === 1) applyTilt(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  stage.addEventListener("touchend", resetTilt);

  resetTilt();
  render();
})();
