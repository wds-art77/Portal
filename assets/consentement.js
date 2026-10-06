/* Bandeau de consentement aux cookies (Google Ads).
 * La balise Google n'est chargée qu'après « Accepter » (voir le <head> de chaque page).
 * Le choix est conservé 6 mois dans le navigateur (localStorage). */
(function () {
  "use strict";
  var CLE = "consentement-cookies";
  var DUREE = 182 * 864e5; // 6 mois

  function lire() {
    try {
      var c = JSON.parse(localStorage.getItem(CLE) || "null");
      if (c && Date.now() - c.date < DUREE) return c.choix;
    } catch (e) {}
    return null;
  }

  function enregistrer(choix) {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, date: Date.now() })); } catch (e) {}
  }

  function supprimerCookiesGoogle() {
    document.cookie.split(";").forEach(function (c) {
      var nom = c.split("=")[0].trim();
      if (/^(_gcl|_gac|_ga|_gid)/.test(nom)) {
        var domaines = ["", location.hostname, "." + location.hostname.replace(/^www\./, "")];
        domaines.forEach(function (d) {
          document.cookie = nom + "=; Max-Age=0; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  var bandeau = null;

  function fermer() {
    if (bandeau) { bandeau.remove(); bandeau = null; }
  }

  function afficher() {
    if (bandeau) return;
    bandeau = document.createElement("div");
    bandeau.className = "bandeau-cookies";
    bandeau.setAttribute("role", "dialog");
    bandeau.setAttribute("aria-live", "polite");
    bandeau.setAttribute("aria-label", "Consentement aux cookies");
    bandeau.innerHTML =
      '<p><strong>Cookies</strong> — Avec votre accord, nous utilisons un cookie Google Ads pour mesurer ' +
      "l'efficacité de nos annonces. Le contenu de votre demande n'est jamais transmis à Google. " +
      '<a href="confidentialite.html">En savoir plus</a></p>' +
      '<div class="bandeau-boutons">' +
      '<button type="button" class="btn secondaire" data-choix="refuse">Refuser</button>' +
      '<button type="button" class="btn secondaire" data-choix="accepte">Accepter</button>' +
      "</div>";
    bandeau.addEventListener("click", function (e) {
      var choix = e.target.getAttribute && e.target.getAttribute("data-choix");
      if (!choix) return;
      var avant = lire();
      enregistrer(choix);
      fermer();
      if (choix === "accepte") {
        if (window.chargerGoogleAds) window.chargerGoogleAds();
      } else {
        if (window.gtag) window.gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
        supprimerCookiesGoogle();
        // Retrait d'un consentement donné plus tôt : recharger pour décharger la balise Google
        if (avant === "accepte" || window.googleAdsCharge) location.reload();
      }
    });
    document.body.appendChild(bandeau);
  }

  document.addEventListener("click", function (e) {
    var cible = e.target.closest && e.target.closest("[data-gerer-cookies]");
    if (cible) { e.preventDefault(); afficher(); }
  });

  if (!lire()) afficher();
})();
