# conditionsgenerales.com

Site vitrine statique (HTML, CSS et un peu de JavaScript, sans serveur ni base de données) du service
**ConditionsGenerales.com** du Cabinet d'avocats de Saeger : conditions générales et contrats sur mesure,
en français, pour les indépendants et PME de **Belgique, de France, du Luxembourg et de Suisse**. Le site
est organisé en quatre sections nationales (`belgique/`, `france/`, `luxembourg/`, `suisse/`), chacune
limitée au droit de son pays, plus des pages communes (accueil, à propos, contact, analyse gratuite,
pages légales). Inspiré, pour la structure, du site flamand algemenevoorwaarden.be.

## Contenu du site

| Rubrique | Fichiers |
|---|---|
| Accueil global (choix du pays) | `index.html` |
| Section Belgique | `belgique/index.html`, `belgique/conditions-generales.html` + `belgique/conditions-generales/` (webshop, entrepreneurs, freelances, indépendants), `belgique/contrats.html`, `belgique/secteurs.html` + `belgique/secteurs/` (construction et six métiers, horeca, immobilier, freelances), `belgique/connaissances.html` + `belgique/connaissances/` (11 articles) |
| Sections France, Luxembourg, Suisse | `france/`, `luxembourg/`, `suisse/` : même organisation (accueil national, conditions générales, webshop, contrats, secteurs, base de connaissances), en droit national |
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
2. **Adresse e-mail** : le site affiche `contact@conditionsgenerales.com`. Créez cette boîte chez votre
   fournisseur de messagerie ou remplacez l'adresse dans toutes les pages
   (`grep -rl "contact@conditionsgenerales.com" . | xargs sed -i 's/contact@conditionsgenerales.com/votre@adresse/g'`).
3. **Téléphone** : le numéro affiché est `+33 7 59 41 78 05` (écrit `+33&nbsp;7&nbsp;59&nbsp;41&nbsp;78&nbsp;05` dans
   le code, avec des espaces insécables). Pour un numéro belge, remplacez ce texte et le lien `tel:+33759417805`
   dans toutes les pages.
4. **Formulaires** (voir ci-dessous) : identifiant du service de formulaires à insérer.
5. **Biographie** (`a-propos.html`) et **délai de réponse** (« 48 heures ouvrables », présent sur de nombreuses
   pages) : relisez et ajustez ces engagements.
6. **Photo** : la carte « Votre interlocuteur » affiche les initiales « WS ». Pour une photo, placez
   `assets/portrait.jpg` (carré, 400 × 400 px) et remplacez, dans chaque page,
   `<div class="avatar" aria-hidden="true">WS</div>` par
   `<div class="avatar"><img src="assets/portrait.jpg" alt="" width="68" height="68"></div>`
   (préfixe `../` ou `../../` selon le dossier de la page).
7. **Contenu juridique** : les textes ont été rédigés et vérifiés en octobre 2026, pays par pays, à partir de
   fiches juridiques sourcées (législation belge, française, luxembourgeoise et suisse en vigueur), mais ils
   engagent l'avocat qui publie le site : une relecture finale par vos soins reste indispensable, en particulier
   pour les taux, montants et délais, qui changent (intérêts de retard, plafonds de compétence, seuils).
8. **Déontologie** : faire confirmer par écrit, par les ordres concernés, le titre sous lequel l'activité est
   exercée à Paris, au Luxembourg et en Suisse, puis compléter la section « Exercice dans les quatre pays » des
   mentions légales ; documenter la notification au bâtonnier de l'offre de première analyse gratuite
   (à défaut, retirer cette offre de l'accueil et de `analyse-gratuite.html`).
9. **Assurance responsabilité professionnelle** : une fois l'assureur et la couverture géographique confirmés,
   ajouter une section « Assurance responsabilité professionnelle » aux mentions légales (art. III.74, 14°, CDE).
10. **Protection des données** : signer le contrat de sous-traitance (art. 28 RGPD) avec le service de
    formulaires et reprendre son nom, son pays d'établissement et la localisation de ses serveurs dans
    `confidentialite.html`.
11. **À propos** : confirmer les fonctions d'enseignement mentionnées (Université de Hasselt, Haute École PXL) ;
    à défaut, supprimer la phrase.

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

## Méthode de rédaction et de vérification

Les textes ont été produits en octobre 2026 selon la méthode suivante :

1. Pour chaque pays, des fiches de faits juridiques (Belgique : huit fiches ; France, Luxembourg et Suisse :
   quatre fiches chacun, sur les contrats et conditions générales, la consommation et le commerce électronique,
   le paiement et le recouvrement, la construction, les secteurs et la déontologie), rédigées à partir de
   sources officielles (Moniteur belge, Légifrance, Legilux, Fedlex, sites des ordres et des administrations)
   puis contestées par deux relecteurs indépendants (actualité 2020-2026 ; exactitude des articles, montants
   et délais) et corrigées. Tout point non vérifiable a été marqué « non vérifié » et exclu du site.
2. Chaque page a été rédigée à partir des seules fiches de son pays, puis relue par un vérificateur juridique
   et un relecteur éditorial, et corrigée ; un contrôle de cohérence par section et entre sections a suivi.
3. Contrôles automatiques : HTML valide (html-validate), liens internes et ancres, hiérarchie des titres,
   étiquettes de formulaire, captures d'écran de chaque page en largeur 1280 et 390 px.

Points de déontologie signalés par les fiches, à trancher par l'avocat avant la mise en ligne :

- l'offre d'« analyse gratuite » n'est pas interdite en soi, mais la fiche recommande de documenter la
  notification ou l'autorisation du bâtonnier (Code de déontologie de l'avocat, publicité et offre de services) ;
- le site ne publie ni témoignages, ni avis Google, ni statistiques de clients, ni comparaison avec des
  confrères, conformément au Code de déontologie ;
- les taux et plafonds cités (intérêts de retard de la loi du 2 août 2002, Livre XIX du CDE) sont datés et
  doivent être revus à chaque semestre ; le Livre 7 du nouveau Code civil (contrats spéciaux) entre en vigueur
  le 1er septembre 2027 et imposera une relecture des pages construction et webshop.

## Mise en ligne (GitHub Pages)

GitHub Pages ne sert qu'**un seul site par dépôt** : avocatprodeo.com est déjà servi par le dépôt `Portal`.
Le site conditionsgenerales.com doit donc vivre dans un dépôt distinct.

1. Sur github.com, créez un dépôt **public** nommé `conditionsgenerales` (sans README), puis donnez-y accès
   à l'application GitHub de Claude (la création du dépôt depuis une session Claude a été refusée par GitHub).
2. Poussez-y cette branche comme branche `main` (depuis un ordinateur disposant de git, ou demandez-le à Claude
   une fois le dépôt créé et autorisé) :
   `git push https://github.com/wds-art77/conditionsgenerales.git claude/conditionsgenerales-be:main`
3. Dans le nouveau dépôt : **Settings → Pages → Source : Deploy from a branch**, branche `main`, dossier
   `/ (root)`, **Save**.
4. Le site est alors visible immédiatement à l'adresse `https://wds-art77.github.io/conditionsgenerales/`
   (tous les liens du site sont relatifs, il fonctionne aussi bien sous ce chemin que sur le domaine).
5. Une fois le DNS configuré (ci-dessous) : **Settings → Pages → Custom domain** : `conditionsgenerales.com`,
   **Save** (GitHub ajoute lui-même un fichier `CNAME` dans la branche), puis cochez **Enforce HTTPS**
   dès que la case est disponible. Ne renseignez le domaine qu'après le DNS : tant que le domaine ne répond pas,
   GitHub redirigerait l'adresse github.io vers un domaine inactif.

### DNS du domaine conditionsgenerales.com

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
