(function () {
  "use strict";

  var form = document.getElementById("demande");
  if (!form) return;
  var bouton = document.getElementById("envoyer");
  var erreurEnvoi = document.getElementById("erreur-envoi");
  var CONTACT = "contact@avocatprodeo.com";

  var obligatoires = ["nom", "prenom", "email", "telephone", "commune", "domaine", "situation", "description", "information", "consentement"];

  function champ(id) { return document.getElementById(id); }

  function valeur(id) {
    var el = champ(id);
    if (!el) return "";
    if (el.type === "checkbox") return el.checked ? "Oui" : "";
    return (el.value || "").trim();
  }

  function marquerErreur(id, message) {
    var el = champ(id);
    var zone = document.getElementById("err-" + id);
    if (el) el.setAttribute("aria-invalid", message ? "true" : "false");
    if (zone) zone.textContent = message || "";
  }

  // Dates au format jj/mm/aaaa : barres obliques insérées automatiquement pendant la saisie.
  function formaterDate(el) {
    var chiffres = el.value.replace(/\D/g, "").slice(0, 8);
    var v = chiffres.slice(0, 2);
    if (chiffres.length > 2) v += "/" + chiffres.slice(2, 4);
    if (chiffres.length > 4) v += "/" + chiffres.slice(4);
    el.value = v;
  }

  function lireDate(texte) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texte);
    if (!m) return null;
    var j = +m[1], mo = +m[2], a = +m[3];
    var d = new Date(a, mo - 1, j);
    if (d.getFullYear() !== a || d.getMonth() !== mo - 1 || d.getDate() !== j) return null;
    return d;
  }

  Array.prototype.forEach.call(form.querySelectorAll("input.date"), function (el) {
    el.addEventListener("input", function (e) {
      if (e.inputType && e.inputType.indexOf("delete") === 0) return;
      formaterDate(el);
    });
    el.addEventListener("blur", function () { formaterDate(el); });
  });

  function validerDates() {
    var premier = null;
    var aujourdhui = new Date();
    ["naissance", "echeance"].forEach(function (id) {
      var texte = valeur(id);
      var msg = "";
      if (texte !== "") {
        var d = lireDate(texte);
        if (!d) msg = "Date invalide. Format attendu : jj/mm/aaaa.";
        else if (id === "naissance" && (d > aujourdhui || d.getFullYear() < 1900)) msg = "Date de naissance invalide.";
      }
      marquerErreur(id, msg);
      if (msg && !premier) premier = champ(id);
    });
    return premier;
  }

  // Pièce jointe : 1 Mo maximum (formule gratuite SimplyForms). Les photos sont réduites si nécessaire.
  var LIMITE = 1024 * 1024;
  var EXTENSIONS = /\.(pdf|doc|docx|jpe?g|png)$/i;
  var inputPiece = champ("piece");
  var pieceFinale = null; // fichier (éventuellement réduit) à envoyer

  function taille(octets) {
    return octets < 1024 * 1024 ? Math.round(octets / 1024) + " Ko" : (octets / 1024 / 1024).toFixed(1).replace(".", ",") + " Mo";
  }

  function reduireImage(fichier) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(fichier);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var cotes = [2000, 1600, 1280, 1024];
        var qualites = [0.85, 0.7, 0.55];
        var essais = [];
        cotes.forEach(function (c) { qualites.forEach(function (q) { essais.push([c, q]); }); });
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

  var preparationPiece = Promise.resolve();
  var aideInitiale = document.getElementById("aide-piece") ? document.getElementById("aide-piece").textContent : "";

  if (inputPiece) {
    inputPiece.addEventListener("change", function () {
      pieceFinale = null;
      marquerErreur("piece", "");
      document.getElementById("aide-piece").textContent = aideInitiale;
      var f = inputPiece.files[0];
      if (!f) return;
      if (!EXTENSIONS.test(f.name)) {
        inputPiece.value = "";
        marquerErreur("piece", "Format non accepté. Formats possibles : PDF, Word (.doc, .docx), JPG ou PNG.");
        return;
      }
      if (f.size <= LIMITE) { pieceFinale = f; return; }
      if (/^image\//.test(f.type) || /\.(jpe?g|png)$/i.test(f.name)) {
        var zone = document.getElementById("err-piece");
        zone.textContent = "Réduction de la photo en cours…";
        preparationPiece = reduireImage(f).then(function (r) {
          pieceFinale = r;
          marquerErreur("piece", "");
          zone.textContent = "";
          document.getElementById("aide-piece").textContent = "Photo réduite à " + taille(r.size) + " pour l'envoi.";
        }).catch(function () {
          inputPiece.value = "";
          marquerErreur("piece", "Cette photo est trop lourde, même réduite. Essayez une photo de plus petite taille.");
        });
        return;
      }
      inputPiece.value = "";
      marquerErreur("piece", "Fichier trop lourd (" + taille(f.size) + "). La taille maximale est de 1 Mo.");
    });
  }

  function valider() {
    var premier = null;
    obligatoires.forEach(function (id) {
      var vide = valeur(id) === "";
      var msg = vide ? "Ce champ est obligatoire." : "";
      if (!vide && id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur(id))) {
        msg = "Adresse e-mail invalide.";
      }
      marquerErreur(id, msg);
      if (msg && !premier) premier = champ(id);
    });
    var premierDate = validerDates();
    premier = premier || premierDate;
    if (premier) premier.focus();
    return !premier;
  }

  function echec() {
    bouton.disabled = false;
    bouton.textContent = "Envoyer ma demande";
    erreurEnvoi.textContent = "L'envoi a échoué. Veuillez réessayer dans quelques instants ou écrire directement à " +
      CONTACT + ". Vos réponses sont conservées dans le formulaire.";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    erreurEnvoi.textContent = "";
    if (!valider()) return;

    champ("sujet").value = "Demande d'aide juridique — " + valeur("nom").toUpperCase() + " " + valeur("prenom") +
      (champ("urgent").checked ? " [URGENT]" : "");

    bouton.disabled = true;
    bouton.textContent = "Envoi en cours…";

    preparationPiece.then(function () {
      var donnees = new FormData(form);
      donnees.delete("attachment");
      if (pieceFinale) donnees.append("attachment", pieceFinale, pieceFinale.name);
      return fetch(form.action, { method: "POST", body: donnees, headers: { "Accept": "application/json" } });
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (r.ok && data.success !== false && data.ok !== false) {
            window.location.href = "merci.html";
          } else {
            echec();
          }
        });
      })
      .catch(echec);
  });
})();
