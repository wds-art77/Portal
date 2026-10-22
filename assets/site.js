/* conditionsgenerales.be — menu mobile et petites interactions (aucun cookie, aucun traceur). */
(function () {
  "use strict";
  document.documentElement.classList.remove("sans-js");

  var burger = document.querySelector(".burger");
  var nav = document.getElementById("navigation");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("ouvert")) {
        nav.classList.remove("ouvert");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("ouvert")) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      nav.classList.remove("ouvert");
      burger.setAttribute("aria-expanded", "false");
    });
  }

  // Ouvre la question de FAQ visée par l'ancre de l'URL (ex. faq.html#delais)
  function ouvrirCible() {
    var id = location.hash && location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  ouvrirCible();
  window.addEventListener("hashchange", ouvrirCible);

  // Sous-navigation pays défilante (mobile) : amène l'entrée active dans la zone visible
  var actif = document.querySelector(".nav-pays [aria-current=\"page\"]");
  var liste = actif && actif.closest("ul");
  if (liste && liste.scrollWidth > liste.clientWidth) {
    liste.scrollLeft += actif.getBoundingClientRect().left - liste.getBoundingClientRect().left - 16;
  }
})();
