# Portail d'aide juridique (Pro Deo)

Site web statique (HTML/CSS, sans serveur ni base de données) comprenant :

| Page | Fichier |
|---|---|
| Accueil | `index.html` |
| Formulaire de demande d'aide juridique | `demande.html` |
| Coordonnées des Bureaux d'aide juridique (avocats Pro Deo) | `avocats.html` |
| Conditions d'accès | `conditions.html` |
| Protection des données (RGPD) | `confidentialite.html` |

## Fonctionnement du formulaire

Le formulaire est envoyé au service **SimplyForms** (République tchèque, serveurs en Allemagne),
qui transmet chaque demande par e-mail à **contact@avocatprodeo.com** puis l'efface.
L'adresse d'envoi (identifiant de formulaire) figure dans l'attribut `action` du formulaire, dans `demande.html`.
Après un envoi réussi, le visiteur est redirigé vers `merci.html`.
Une pièce jointe (PDF, Word, JPG ou PNG) peut être ajoutée : 1 Mo maximum avec la formule gratuite ;
les photos plus lourdes sont réduites automatiquement dans le navigateur. Pour changer la limite
(formule payante), modifiez `LIMITE` dans `assets/formulaire.js` et le texte d'aide dans `demande.html`.

## Mettre le site en ligne gratuitement (GitHub Pages)

1. Sur github.com, ouvrez le dépôt **Portal**.
2. Allez dans **Settings → Pages** (onglet « Settings » en haut, puis « Pages » dans le menu de gauche).
3. Sous « Build and deployment », choisissez **Source : Deploy from a branch**,
   branche **claude/portal-aide-juridique-y3w64k** (ou `main` si vous l'avez créée), dossier **/ (root)**, puis **Save**.
4. Après une à deux minutes, le site est accessible à l'adresse affichée (du type `https://<compte>.github.io/Portal/`).

Remarque : sur un compte GitHub gratuit, GitHub Pages exige que le dépôt soit **public**.

## Mise à jour des coordonnées

Les coordonnées des bureaux ont été relevées sur les sites officiels des barreaux le 3 octobre 2026
(la source figure sous chaque fiche). Elles changent régulièrement : vérifiez-les périodiquement.

## Nom de domaine avocatprodeo.com

Le fichier `CNAME` indique à GitHub Pages que le site doit être servi sur **avocatprodeo.com**.

Chez le registraire du domaine (GoDaddy → « Mes produits » → avocatprodeo.com → **DNS**) :

1. Supprimez les enregistrements **A** existants pour `@` (ainsi que tout « transfert » ou « parking »).
2. Ajoutez quatre enregistrements **A**, nom `@` :
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Remplacez l'enregistrement **CNAME** `www` par : `wds-art77.github.io`
4. Sur GitHub : **Settings → Pages → Custom domain** = `avocatprodeo.com`, **Save**, puis cochez
   **Enforce HTTPS** dès que la case est disponible.

Source : documentation GitHub, « Managing a custom domain for your GitHub Pages site ».
La propagation DNS peut prendre de quelques minutes à 24 heures.
