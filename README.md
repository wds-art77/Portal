# conditionsgenerales.be

Site vitrine statique (HTML, CSS et un peu de JavaScript, sans serveur ni base de données) du service
**ConditionsGenerales.be** du Cabinet d'avocats de Saeger : conditions générales et contrats sur mesure
pour les indépendants et PME de Wallonie et de Bruxelles. Équivalent francophone, en droit belge, du site
flamand algemenevoorwaarden.be.

## Contenu du site

| Rubrique | Fichiers |
|---|---|
| Accueil | `index.html` |
| Conditions générales (service) | `conditions-generales.html` + `conditions-generales/` (webshop, entrepreneurs, freelances, indépendants) |
| Contrats | `contrats.html` |
| Secteurs | `secteurs.html` + `secteurs/` (construction et six métiers, horeca, immobilier, freelances) |
| Base de connaissances | `connaissances.html` + `connaissances/` (11 articles : mise en demeure, facture impayée, recouvrement, prescription…) |
| Analyse gratuite (formulaire) | `analyse-gratuite.html` → `merci.html` |
| Contact (formulaire) | `contact.html` → `merci.html` |
| À propos | `a-propos.html` |
| Protection des données, mentions légales | `confidentialite.html`, `mentions-legales.html` |
| Page d'erreur, référencement | `404.html`, `sitemap.xml`, `robots.txt` |
| Styles, scripts, icônes | `assets/style.css`, `assets/site.js` (menu mobile), `assets/formulaire.js`, `assets/icone-*.png`, `assets/partage.png`, `favicon.*` |

Toutes les pages partagent le même en-tête, la même navigation et le même pied de page. Le site n'utilise
**aucun cookie, aucun traceur et aucune police externe** : il n'y a donc pas de bandeau de cookies.

## À compléter avant la mise en ligne

Les éléments suivants n'ont pas pu être vérifiés ou configurés automatiquement. Ils sont surlignés en jaune
sur la page `mentions-legales.html` (classe `a-completer`) ou signalés ici :

1. **Mentions légales** (`mentions-legales.html`) : numéro d'entreprise (BCE) et numéro de TVA, barreau(x)
   d'inscription, adresse du cabinet à Liège, assureur de responsabilité professionnelle.
2. **Adresse e-mail** : le site affiche `contact@conditionsgenerales.be`. Créez cette boîte chez votre
   fournisseur de messagerie ou remplacez l'adresse dans toutes les pages
   (`grep -rl "contact@conditionsgenerales.be" . | xargs sed -i 's/contact@conditionsgenerales.be/votre@adresse/g'`).
3. **Téléphone** : le numéro affiché est `+33 7 59 41 78 05`. Pour un numéro belge, remplacez-le de la même
   manière (texte `+33 7 59 41 78 05` et lien `tel:+33759417805`).
4. **Formulaires** (voir ci-dessous) : identifiant du service de formulaires à insérer.
5. **Biographie** (`a-propos.html`) et **délai de réponse** (« 48 heures ouvrables », présent sur de nombreuses
   pages) : relisez et ajustez ces engagements.
6. **Photo** : la carte « Votre interlocuteur » affiche les initiales « WS ». Pour une photo, placez
   `assets/portrait.jpg` (carré, 400 × 400 px) et remplacez, dans chaque page,
   `<div class="avatar" aria-hidden="true">WS</div>` par
   `<div class="avatar"><img src="assets/portrait.jpg" alt="" width="68" height="68"></div>`
   (préfixe `../` ou `../../` selon le dossier de la page).
7. **Contenu juridique** : les textes ont été rédigés et vérifiés sur la base de la législation belge en
   vigueur en octobre 2026, avec sources officielles, mais ils engagent l'avocat qui publie le site : une
   relecture finale par vos soins reste indispensable, en particulier pour les taux, montants et délais
   (intérêts de retard de la loi du 2 août 2002, plafonds du Livre XIX du Code de droit économique), qui changent.

## Fonctionnement des formulaires

Les formulaires d'`analyse-gratuite.html` et de `contact.html` sont prévus pour le service
**SimplyForms** (comme sur avocatprodeo.com) : chaque envoi est transmis par e-mail puis effacé par le service.

1. Créez un formulaire sur simplyforms.app en indiquant l'adresse de réception.
2. Remplacez `REMPLACER-PAR-IDENTIFIANT` par l'identifiant fourni dans l'attribut `action` des deux pages.
3. Tant que ce remplacement n'est pas fait, le bouton d'envoi ouvre le logiciel de messagerie du visiteur avec
   le contenu du formulaire prérempli (lien `mailto:`) : le site reste utilisable.

Une pièce jointe (PDF, Word, OpenDocument, JPG ou PNG) peut être ajoutée au formulaire d'analyse :
1 Mo maximum avec la formule gratuite (les photos plus lourdes sont réduites automatiquement dans le navigateur).
Pour changer la limite, modifiez `LIMITE` dans `assets/formulaire.js` et le texte d'aide dans `analyse-gratuite.html`.

## Mise en ligne (GitHub Pages)

GitHub Pages ne sert qu'**un seul site par dépôt** : avocatprodeo.com est déjà servi par le dépôt `Portal`.
Le site conditionsgenerales.be doit donc vivre dans un dépôt distinct.

1. Sur github.com, créez un dépôt **public** nommé `conditionsgenerales` (sans README).
2. Poussez-y cette branche comme branche `main` (depuis un ordinateur disposant de git, ou demandez-le à Claude
   une fois le dépôt créé) :
   `git push https://github.com/wds-art77/conditionsgenerales.git claude/conditionsgenerales-be:main`
3. Dans le nouveau dépôt : **Settings → Pages → Source : Deploy from a branch**, branche `main`, dossier
   `/ (root)`, **Save**.
4. **Settings → Pages → Custom domain** : `conditionsgenerales.be`, **Save**, puis cochez **Enforce HTTPS**
   dès que la case est disponible (le fichier `CNAME` du dépôt contient déjà `conditionsgenerales.be`).

### DNS du domaine conditionsgenerales.be

Chez le registraire du domaine (zone DNS) :

1. Supprimez les enregistrements **A** existants pour `@` (ainsi que tout « parking » ou « transfert »).
2. Ajoutez quatre enregistrements **A**, nom `@` :
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Ajoutez (ou remplacez) l'enregistrement **CNAME** `www` → `wds-art77.github.io`
4. Dans GitHub, après la propagation DNS (de quelques minutes à 24 heures), vérifiez le domaine et activez HTTPS.

Source : documentation GitHub, « Managing a custom domain for your GitHub Pages site ».

## Modifier le site

- Chaque page est un fichier HTML autonome. L'en-tête, le menu et le pied de page sont identiques sur toutes
  les pages : pour modifier une coordonnée ou un lien de menu, faites le remplacement dans tous les fichiers.
- Les liens internes sont relatifs (`../` depuis les sous-dossiers) : le site fonctionne aussi bien sur le
  domaine que sur une adresse `github.io` ou en local.
- Pour ajouter une page, copiez une page du même type, adaptez le contenu, le `<title>`, la `<meta name="description">`,
  la balise `<link rel="canonical">` et ajoutez l'adresse dans `sitemap.xml`.
