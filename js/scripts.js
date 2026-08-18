/* Emlektabla.net — shared scripts */
(function () {
  "use strict";

  /* Google Ads conversion — phone link clicks */
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (link && typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-18339451265/5J1LCLGT8tMcEIGj96hE',
        'value': 1.0,
        'currency': 'HUF'
      });
    }
  });

  /* mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }


  /* tervezőből érkező ajánlatkérés előtöltése */
  try {
    var terv = new URLSearchParams(window.location.search).get("terv");
    if (terv) {
      var msg = document.querySelector('#kapcsolat textarea, form textarea');
      if (msg && !msg.value) msg.value = terv;
    }
  } catch (e) {}

  /* dropdown almenü (Szolgáltatások) */
  document.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var item = btn.closest(".nav-item");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav-item.open").forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("open");
        var b = item.querySelector(".sub-toggle");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* scroll reveal (class-based, respects reduced motion) */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* gallery filter */
  var filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        document.querySelectorAll(".gallery-grid figure").forEach(function (fig) {
          var show = cat === "all" || fig.getAttribute("data-cat") === cat;
          fig.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* Web3Forms contact form */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var status = document.getElementById("form-status");
      var submitBtn = form.querySelector('button[type="submit"]');
      status.className = "form-status";
      submitBtn.disabled = true;
      submitBtn.textContent = "Küldés...";

      var data = new FormData(form);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            status.textContent = "Köszönjük! Üzenetét megkaptuk, hamarosan jelentkezünk.";
            status.className = "form-status ok";
            form.reset();
            /* Google Ads conversion — form submission */
            if (typeof gtag === 'function') {
              gtag('event', 'conversion', {
                'send_to': 'AW-18339451265/5J1LCLGT8tMcEIGj96hE',
                'value': 1.0,
                'currency': 'HUF'
              });
            }
          } else {
            status.textContent = "Hiba történt a küldés során. Kérjük, próbálja újra, vagy hívjon minket telefonon.";
            status.className = "form-status err";
          }
        })
        .catch(function () {
          status.textContent = "Hiba történt a küldés során. Kérjük, próbálja újra, vagy hívjon minket telefonon.";
          status.className = "form-status err";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Ajánlatkérés elküldése";
        });
    });
  }

  /* vélemény marquee: véletlen sorrend + zökkenőmentes loop */
  var track = document.getElementById("quote-track");
  if (track) {
    var group = track.querySelector(".quote-group");
    var qitems = Array.prototype.slice.call(group.children);
    for (var i = qitems.length - 1; i > 0; i--) {
      var j2 = Math.floor(Math.random() * (i + 1));
      group.appendChild(qitems[j2]);
      qitems.splice(j2, 1);
    }
    track.appendChild(group.cloneNode(true));
  }

  /* hero videó: LCP-barát késleltetett betöltés + fallback a vésett plakettre.
     A forrást szándékosan csak a window load után fűzzük be (data-src attribútum),
     hogy a videó ne versenyezzen az oldal első kirajzolásával. A betöltésnek és a
     hibakezelésnek EGY helyen kell futnia — különben a play() még forrás nélkül
     elhasalna, és azonnal elrejtené a videót. */
  var vid = document.querySelector(".hero-video");
  if (vid) {
    var carveShown = false;
    var showCarve = function () {
      if (carveShown) return;
      carveShown = true;
      vid.style.display = "none";
      var veil = document.querySelector(".hero-veil");
      if (veil) veil.style.display = "none";
      var carve = document.querySelector(".hero-carve");
      if (carve) carve.style.display = "block";
    };

    vid.addEventListener("error", showCarve);

    var startHeroVideo = function () {
      var srcUrl = vid.getAttribute("data-src");

      /* Nincs data-src → a <source> már a HTML-ben van (korábbi működés). */
      if (!srcUrl) {
        var existing = vid.querySelector("source");
        if (existing) existing.addEventListener("error", showCarve);
        var p0 = vid.play();
        if (p0 && p0.catch) p0.catch(showCarve);
        setTimeout(function () {
          if (vid.readyState === 0) showCarve();
        }, 4000);
        return;
      }

      /* Csökkentett mozgás, adattakarékos mód vagy lassú hálózat → marad a plakett. */
      if (window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        showCarve();
        return;
      }
      var conn = navigator.connection;
      if (conn && (conn.saveData ||
                   conn.effectiveType === "slow-2g" ||
                   conn.effectiveType === "2g")) {
        showCarve();
        return;
      }

      var s = document.createElement("source");
      s.src = srcUrl;
      s.type = "video/mp4";
      s.addEventListener("error", showCarve);
      vid.appendChild(s);
      vid.load();
      var p = vid.play();
      if (p && p.catch) p.catch(showCarve);
      setTimeout(function () {
        if (vid.readyState === 0) showCarve();
      }, 6000);
    };

    if (document.readyState === "complete") {
      setTimeout(startHeroVideo, 100);
    } else {
      window.addEventListener("load", function () {
        setTimeout(startHeroVideo, 100);
      });
    }
  }
})();
