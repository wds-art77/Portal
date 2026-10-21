/* conditionsgenerales.be — formulaires « Analyse gratuite » et « Contact ».
 * Validation côté navigateur, envoi vers le service de formulaires indiqué dans l'attribut action,
 * pièce jointe limitée à 1 Mo (les photos trop lourdes sont réduites dans le navigateur).
 * Tant que l'attribut action contient « REMPLACER », le formulaire ouvre le logiciel de messagerie
 * du visiteur (mailto) avec le contenu prérempli : le site reste utilisable avant la configuration. */
(function () {
  "use strict";

  var form = document.querySelector("form.formulaire[data-formulaire]");
  if (!form) return;
  var bouton = form.querySelector("button[type=submit]");
  var texteBouton = bouton ? bouton.textContent : "Envoyer";
  var erreurEnvoi = document.getElementById("erreur-envoi");
  var CONTACT = form.getAttribute("data-contact") || "contact@conditionsgenerales.be";
  var PAGE_MERCI = form.getAttribute("data-merci") || "merci.html";
  var obligatoires = (form.getAttribute("data-obligatoires") || "").split(/\s+/).filter(Boolean);

  function champ(id) { return document.getElementById(id); }

  function valeur(id) {
    var el = champ(id);
    if (!el) return "";
    if (el.type === "checkbox") return el.checked ? "Oui" : "";
    if (el.type === "radio") {
      var coche = form.querySelector('input[name="' + el.name + '"]:checked');
      return coche ? coche.value : "";
    }
    return (el.value || "").trim();
  }

  function marquerErreur(id, message) {
    var el = champ(id);
    var zone = document.getElementById("err-" + id);
    if (el) el.setAttribute("aria-invalid", message ? "true" : "false");
    if (zone) zone.textContent = message || "";
  }

  // Pièce jointe : 1 Mo maximum. Les images trop lourdes sont réduites.
  var LIMITE = 1024 * 1024;
  var EXTENSIONS = /\.(pdf|doc|docx|odt|jpe?g|png)$/i;
  var inputPiece = form.querySelector("input[type=file]");
  var pieceFinale = null;
  var preparationPiece = Promise.resolve();

  function taille(octets) {
    return octets < 1024 * 1024 ? Math.round(octets / 1024) + " Ko" : (octets / 1024 / 1024).toFixed(1).replace(".", ",") + " Mo";
  }

  function reduireImage(fichier) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(fichier);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var essais = [];
        [2000, 1600, 1280, 1024].forEach(function (c) { [0.85, 0.7, 0.55].forEach(function (q) { essais.push([c, q]); }); });
        (function essayer(i) {
          if (i >= essais.length) return reject(new Error("trop lourd"));
          var max = essais[i][0], echelle = Math.min(1, max / Math.max(img.width, img.height));
          var canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * echelle);
          canvas.height = Math.round(img.height * echelle);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function (blob) {
            if (blob && blob.size <= LIMITE) {
              resolve(new File([blob], fichier.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
            } else {
              essayer(i + 1);
            }
          }, "image/jpeg", essais[i][1]);
        })(0);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("illisible")); };
      img.src = url;
    });
  }

  if (inputPiece) {
    var idPiece = inputPiece.id;
    var aide = document.getElementById("aide-" + idPiece);
    var aideInitiale = aide ? aide.textContent : "";
    inputPiece.addEventListener("change", function () {
      pieceFinale = null;
      marquerErreur(idPiece, "");
      if (aide) aide.textContent = aideInitiale;
      var f = inputPiece.files[0];
      if (!f) return;
      if (!EXTENSIONS.test(f.name)) {
        inputPiece.value = "";
        marquerErreur(idPiece, "Format non accepté. Formats possibles : PDF, Word (.doc, .docx), OpenDocument (.odt), JPG ou PNG.");
        return;
      }
      if (f.size <= LIMITE) { pieceFinale = f; return; }
      if (/^image\//.test(f.type) || /\.(jpe?g|png)$/i.test(f.name)) {
        var zone = document.getElementById("err-" + idPiece);
        if (zone) zone.textContent = "Réduction de l'image en cours…";
        preparationPiece = reduireImage(f).then(function (r) {
          pieceFinale = r;
          marquerErreur(idPiece, "");
          if (aide) aide.textContent = "Image réduite à " + taille(r.size) + " pour l'envoi.";
        }).catch(function () {
          inputPiece.value = "";
          marquerErreur(idPiece, "Cette image est trop lourde, même réduite. Essayez une image plus petite ou un PDF.");
        });
        return;
      }
      inputPiece.value = "";
      marquerErreur(idPiece, "Fichier trop lourd (" + taille(f.size) + "). La taille maximale est de 1 Mo.");
    });
  }

  // Affichage conditionnel : éléments avec data-visible-si="id=valeur"
  var conditionnels = form.querySelectorAll("[data-visible-si]");
  function majConditionnels() {
    Array.prototype.forEach.call(conditionnels, function (el) {
      var regle = el.getAttribute("data-visible-si").split("=");
      el.hidden = valeur(regle[0]) !== regle[1];
    });
  }
  form.addEventListener("change", majConditionnels);
  majConditionnels();

  function valider() {
    var premier = null;
    obligatoires.forEach(function (id) {
      var el = champ(id);
      if (!el) return;
      if (el.closest("[hidden]")) { marquerErreur(id, ""); return; }
      var vide = valeur(id) === "";
      var msg = vide ? "Ce champ est obligatoire." : "";
      if (!vide && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur(id))) msg = "Adresse e-mail invalide.";
      marquerErreur(id, msg);
      if (msg && !premier) premier = el;
    });
    if (premier) premier.focus();
    return !premier;
  }

  function echec() {
    bouton.disabled = false;
    bouton.textContent = texteBouton;
    if (erreurEnvoi) erreurEnvoi.textContent = "L'envoi a échoué. Veuillez réessayer dans quelques instants ou écrire directement à " +
      CONTACT + ". Vos réponses sont conservées dans le formulaire.";
  }

  // Secours tant que le service de formulaires n'est pas configuré : ouverture du logiciel de messagerie.
  function envoyerParCourriel() {
    var lignes = [];
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (el) {
      if (!el.name || el.type === "file" || el.type === "hidden" || el.type === "submit") return;
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      if (el.closest("[hidden]")) return;
      var v = (el.value || "").trim();
      if (v) lignes.push(el.name + " : " + v);
    });
    var sujet = form.getAttribute("data-sujet") || "Demande via conditionsgenerales.be";
    var corps = lignes.join("\n") + (pieceFinale ? "\n\n(Merci de joindre votre document à ce courriel.)" : "");
    window.location.href = "mailto:" + CONTACT + "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps);
    bouton.disabled = false;
    bouton.textContent = texteBouton;
    if (erreurEnvoi) erreurEnvoi.textContent = "Votre logiciel de messagerie s'ouvre avec le contenu de votre demande. Si rien ne se passe, écrivez-nous à " + CONTACT + ".";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (erreurEnvoi) erreurEnvoi.textContent = "";
    if (!valider()) return;

    var sujetCache = form.querySelector('input[name="subject"]');
    if (sujetCache) {
      var nom = valeur("nom"), entreprise = valeur("entreprise");
      sujetCache.value = (form.getAttribute("data-sujet") || "Demande") + " — " + [nom, entreprise].filter(Boolean).join(", ");
    }

    bouton.disabled = true;
    bouton.textContent = "Envoi en cours…";

    if (/REMPLACER/.test(form.action)) { envoyerParCourriel(); return; }

    preparationPiece.then(function () {
      var donnees = new FormData(form);
      if (inputPiece) {
        donnees.delete(inputPiece.name);
        if (pieceFinale) donnees.append(inputPiece.name, pieceFinale, pieceFinale.name);
      }
      return fetch(form.action, { method: "POST", body: donnees, headers: { "Accept": "application/json" } });
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (r.ok && data.success !== false && data.ok !== false) {
            window.location.href = PAGE_MERCI;
          } else {
            echec();
          }
        });
      })
      .catch(echec);
  });
})();
