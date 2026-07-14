/* Emlektabla.net — shared scripts */
(function () {
  "use strict";

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
    var items = Array.prototype.slice.call(group.children);
    for (var i = items.length - 1; i > 0; i--) {
      var j2 = Math.floor(Math.random() * (i + 1));
      group.appendChild(items[j2]);
      items.splice(j2, 1);
    }
    track.appendChild(group.cloneNode(true));
  }

  /* hero videó fallback: ha nem tölt be vagy nem indul, a vésett plakett jelenik meg */
  var vid = document.querySelector(".hero-video");
  if (vid) {
    var showCarve = function () {
      vid.style.display = "none";
      var veil = document.querySelector(".hero-veil");
      if (veil) veil.style.display = "none";
      var carve = document.querySelector(".hero-carve");
      if (carve) carve.style.display = "block";
    };
    var src = vid.querySelector("source");
    if (src) src.addEventListener("error", showCarve);
    vid.addEventListener("error", showCarve);
    var p = vid.play();
    if (p && p.catch) p.catch(showCarve);
    setTimeout(function () {
      if (vid.readyState === 0) showCarve();
    }, 4000);
  }
})();
