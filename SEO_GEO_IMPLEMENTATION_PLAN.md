# Plan d’implémentation technique SEO, GEO et AEO

Site : https://toursmarrakechdesert.com  
Date : 2 novembre 2026 (UTC)  
Source : SEO_GEO_AI_AUDIT_REPORT.md, lu intégralement (836 lignes).  
Référence du dépôt : 23aa8db5227169be38a0df2aa2195e98e91fa57c.

## 1. Périmètre et niveau de preuve

Ce document est une feuille de route, pas un compte rendu de corrections réalisées. Aucun fichier applicatif, paramètre Hostinger/CDN ou Supabase n’est modifié. Aucun déploiement, build, installation, envoi de formulaire ou test de panne n’est exécuté pour préparer ce plan.

Les références de code ci-dessous ont été confrontées au dépôt courant, particulièrement les onze P1. Trois modifications concurrentes, non effectuées par l’auteur de ce plan, ont été détectées en fin de lecture : ActivityCard.tsx, daytripCard.tsx et TourCard.tsx utilisent maintenant Intl.NumberFormat avec EUR et un libellé par personne. Elles ne sont ni annulées ni modifiées. B07 reste à résoudre globalement; ses exemples de cartes activités/excursions en dollars décrivent l’audit initial, pas cette nouvelle version locale. Les trois cartes ont maintenant EUR codé en dur; la validation métier, les fiches circuits et la source commune restent à traiter. La production n’a pas été recontrôlée. Les observations HTTP et les 324 URL proviennent de l’audit du 1 novembre : elles ne sont pas présentées comme un nouveau crawl. Les documents techniques officiels ont été consultés pour préciser les recommandations.

Versions installées vérifiées : Next.js 16.4.3, React 19.2.4, next-intl 4.13.7, supabase-js 2.115.0. Le projet utilise App Router, webpack, src/proxy.ts, en/fr/es et localePrefix=as-needed. cacheComponents n’est pas activé. Conserver ces choix dans les corrections initiales.

### Registre exhaustif, sans changement arbitraire de priorité

« Confirmé » désigne un défaut de code ou de contenu démontré, pas nécessairement un incident actuellement actif. B01/B02 décrivent notamment des comportements en cas de panne; B17–B19 sont latents dans l’échantillon public.

| ID | Priorité | Bug confirmé | Phase |
|---|---|---|---|
| B01 | P1 | Erreur Supabase transformée en absence et potentiellement en 404 | 2 |
| B02 | P1 | Sitemap pouvant réussir avec données partielles après erreur | 3 |
| B03 | P1 | Accueil et activités sans renouvellement explicite du rendu Supabase | 5 |
| B04 | P1 | Ville sans circuits acceptée en 200 indexable | 4 |
| B05 | P1 | Canonical/hreflang des politiques vers trois URL 404 | 1 |
| B06 | P2 | Canonical anglais À propos vers /en/about redirigé | 1 |
| B07 | P1 | Contradiction dollars/euros dans l’audit; cartes locales modifiées pendant ce plan, alignement global à revalider | 7 |
| B08 | P1 | Acompte 20 % contre 150 €, conditions non réconciliées | 7 |
| B09 | P1 | Affirmation erronée de réouverture de la frontière algérienne | 7 |
| B10 | P2 | Deux images JSON-LD de contact inexistantes | 8 |
| B11 | P2 | Brouillon /offers indexable | 4 |
| B12 | P2 | Favoris indexables mais bloqués à l’exploration | 4 |
| B13 | P2 | Compteurs de destinations fixes, Agadir sans offre | 4 |
| B14 | P2 | CTA/navigation partiellement dans la mauvaise langue | 7 |
| B15 | P2 | duration et subjectOf mal modélisés sur les activités | 8 |
| B16 | P2 | Excursion valide dépendant à tort de la lecture des alternates | 2 |
| B17 | P2 | Contrats de traduction divergents entre fiche et découverte | 3 |
| B18 | P2 | Cartes et compteurs non filtrés par traduction exploitable | 3 |
| B19 | P2 | Changement de langue réutilisant un slug indisponible | 3 |

| ID | Priorité | Risque non vérifié | Preuve manquante / phase |
|---|---|---|---|
| R01 | P1 | Véritable Googlebot bloqué | Logs avec IP authentifiée et Search Console / 0 |
| R02 | P1 | Droits Supabase trop larges | RLS, grants, policies effectivement appliqués / 6 |
| R03 | P1 | Injection via HTML/JSON-LD | Confiance des auteurs et tests isolés; aucune exploitation prouvée / 6 |
| R04 | P2 | Troncature à grande échelle et slugs dupliqués | Comptages, plafonds distants, doublons / 3 |
| R05 | P2 | Origines publiques divergentes | Configuration effective par environnement / 1 |
| R06 | P2 | Performances insuffisantes | Mesures terrain et laboratoire / 9 |
| R07 | P2 | Disponibilité, horaires et promesses non justifiés | Validation opérationnelle de l’agence / 7–8 |
| R08 | P2 | Cannibalisation et conseils datés | Requêtes/pages GSC, relecture sourcée / 9 |

| ID | Priorité | Opportunité d’amélioration | Phase |
|---|---|---|---|
| O01 | P2 | Politique au sitemap, dates réelles, alternates XML facultatifs | 1 et 3 |
| O02 | P2 | Contexte produit/langue/dates dans la demande de devis | 9 |
| O03 | P2 | Graphe agence/page/voyage cohérent et excursions décrites | 8 |
| O04 | P2 | Expertise, sources, révision et réponses factuelles | 9 |
| O05 | P3 | Liens de langues et accordéons utilisables sans JS | 3 et 9 |
| O06 | P3 | Maintenance du llms.txt existant | 9 |
| O07 | P3 | Typage et tests SEO ciblés | Socle de tests puis chaque phase |

Total conservé : 19 bugs, 8 risques, 7 opportunités; 11 P1 dont 3 risques. Aucun P0 démontré.

### Ce qui peut réellement empêcher le crawl ou l’indexation

1. R01 devient un obstacle direct si Googlebot authentique reçoit des 403 sur les pages. Un 403 limité au sitemap gêne sa récupération, mais ne bloque pas automatiquement toutes les pages liées ailleurs. Un UA simulé refusé peut correspondre à une protection légitime contre l’usurpation.
2. B01/B16 peuvent faire disparaître une URL valide via faux 404/noindex. Une panne prolongée en 5xx réduit aussi le crawl; la solution ne consiste pas à retourner indéfiniment une erreur.
3. B04 peut entraîner des soft 404 : le serveur répond 200, mais Google peut considérer la page vide comme non indexable.
4. B05/B06 rendent les signaux canoniques contradictoires; Google peut les ignorer ou sélectionner une autre URL. Ils ne prouvent ni un blocage HTTP ni une désindexation globale.
5. B02/B17/R04 dégradent la découverte; l’absence du sitemap n’interdit pas l’indexation d’une URL liée et accessible.
6. B03 peut maintenir des retraits/prix/liens obsolètes. C’est un problème de fraîcheur, pas un blocage de crawl en soi.
7. B07/B08/B09/B10/B14/B15 touchent surtout la fiabilité, l’interprétation et la présentation; ils n’empêchent pas à eux seuls l’indexation.
8. B12 : robots Disallow ne garantit pas la désindexation; il peut empêcher la lecture du noindex voulu. Ne pas étendre ces restrictions aux pages commerciales.

Aucun besoin démontré de rendre tout le site dynamique, de supprimer le multilingue, de créer une API IA, ou d’ajouter un fichier llms.txt supplémentaire.

## 2. Impact par moteur

Échelle qualitative de priorité technique, pas estimation de gain de classement : F = fort, M = moyen, f = faible, ? = dépend d’un fait non vérifié. Pour les IA, « impact » signifie accès, récupération ou fidélité potentielle des réponses. Les fournisseurs ne documentent pas tous le poids de canonical, hreflang ou JSON-LD dans leurs systèmes : les effets comparés sont des inférences techniques.

| Problèmes | Google Search | ChatGPT Search | Gemini | Claude recherche | Perplexity |
|---|---|---|---|---|---|
| R01 accès Googlebot | F? direct si confirmé | ? aucun blocage propre démontré | F? pour sources via Google; autres accès à vérifier | ? | ? |
| B01/B16 faux absents | F | F | F | F | F |
| B02/B17/R04 découverte incomplète | F | M | M–F | M | M |
| B03 fraîcheur | M–F | F | F | F | F |
| B04/B11/B12 pages vides/utilitaires | M | M | M | M | M |
| B05/B06/R05 URL et identité | F pour canonicals; M pour hreflang | M | M–F | M | M |
| B18/B19/O05 navigation/traductions | M | M | M | M | M |
| B07/B08/B09/B13/B14/R07 faits et prix | M | F | F | F | F |
| B10/B15/O03 graphe fidèle | M | M, usage non garanti | M | M, usage non garanti | M |
| R02/R03 exposition/injection | F? si incident | F? | F? | F? | F? |
| R06 expérience/latence | M, selon mesures | M pour récupération | M | M | M |
| R08/O04 intentions/expertise | M–F selon preuves | F potentiel | F potentiel | F potentiel | F potentiel |
| O01 sitemap enrichi | M | f–M | f–M | f–M | f–M |
| O02 devis contextualisé | f direct; utile conversion | M pour parcours | M | M | M |
| O06 llms.txt | f, aucun gain établi | ? expérimental | ? | ? | ? |
| O07 tests/typage | Indirect F | Indirect F | Indirect F | Indirect F | Indirect F |

Google Search et ses fonctions IA reposent sur les fondations SEO habituelles, sans schéma IA spécial requis. [Google, fonctionnalités IA](https://developers.google.com/search/docs/appearance/ai-features).

Pour Gemini, ne pas assimiler l’application à AI Overviews/AI Mode. Google-Extended contrôle certains usages Gemini et n’est pas un UA HTTP séparé ni un contrôle d’indexation Search. [Google, crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

ChatGPT Search : vérifier OAI-SearchBot; GPTBot concerne l’entraînement et ChatGPT-User les consultations utilisateur. Autoriser l’entraînement n’est pas une condition de présence en recherche. [OpenAI, crawlers](https://developers.openai.com/api/docs/bots).

Claude : distinguer Claude-SearchBot, Claude-User et ClaudeBot. [Anthropic, robots](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).
Perplexity : distinguer PerplexityBot et Perplexity-User; vérifier les plages IP officielles à jour. [Perplexity, crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).
Un 200 simulé, une autorisation robots ou un graphe valide ne garantit jamais une citation.

## 3. Dossiers techniques des onze P1

Les numéros sont les lignes relevées pendant cette lecture; les changements concurrents sur les cartes sont signalés explicitement. Revalider les numéros au démarrage de chaque lot. Les nouveaux fichiers proposés n’ont pas encore de lignes. Les tests Txx sont définis en section 6.

### R01 — Accès Googlebot

- Emplacement : infrastructure hors dépôt; src/proxy.ts:4 (createMiddleware), :6 (config.matcher); public/robots.txt:4. Aucune fonction locale de refus Googlebot identifiée; sitemap/robots sont exclus du proxy.
- Cause : inconnue. hcdn et la différence d’UA orientent vers la couche périphérique, sans prouver la règle responsable ni exclure l’origine.
- Correction exacte conditionnelle : corréler statut CDN, statut origine, request ID, IP et heure UTC; authentifier Google via plages officielles ou DNS inverse puis direct; identifier la règle de refus; ajuster uniquement son traitement des robots vérifiés. Aucun allow fondé sur le seul texte Googlebot.
- Régression : ouvrir le WAF à des usurpateurs ou autoriser des chemins privés. Conserver protections API/admin et limites adaptées.
- Tests : T01; inspection GSC et crawl automatique sont deux preuves distinctes. Phase 0, propriétaire GSC/Hostinger.

### B01 — Panne transformée en 404

- Lecteurs : blogs.ts getBlogDetail:120, branche error:130; activities.ts getActivityDetail:122, error:130; day_trips.ts getDayTripDetail:180, error:192; tours.ts getTourDetail:304, fail:177, appel:321. Tous sous src/lib/supabase/.
- Consommateurs : generateMetadata et pages détail blog:45/176 (notFound:52/188), tours:54/161 (notFound:68/176), excursions:44/149 (notFound:55/164), activités:89/164 (notFound:170), sous src/app/[locale]/…/[slug]/page.tsx.
- Cause : null signifie tantôt erreur réseau/permission, tantôt zéro ligne; fail() ne lève pas d’exception.
- Correction : contrat Promise<T|null>, null réservé à une lecture réussie sans contenu publiable; erreur typée ContentReadError sur error, timeout, réponse incohérente ou doublon. fail() doit lever. Étendre ce contrat aux listes et slugs; ne pas transformer les exceptions en []/{} dans les appelants. Les filtres published et de langue restent obligatoires.
- Prévoir src/lib/supabase/errors.ts; journaliser opération, code et identifiant de corrélation sans secret. Un error.tsx localisé peut fournir un nouvel essai; il ne fixe pas le statut HTTP.
- Cache chaud : erreur de régénération doit préserver le dernier rendu valide, sans fabriquer une 404. Cache froid : échouer avant le streaming autant que possible, 5xx attendu; ne pas prétendre qu’un throw garantit 503. Un statut 503 et Retry-After nécessiteraient un contrôle serveur explicite, à justifier séparément.
- Régression : des builds auparavant « réussis » malgré panne échoueront; c’est attendu. Éviter erreurs interceptant les exceptions notFound/redirect de Next. Tester indisponibilité, absence réelle, doublon et récupération.
- T02/T03; phase 2. B16 associé : day-trips page:157/163, charger le contenu primaire indépendamment; une panne des seuls alternates ne doit plus appeler notFound. Préférer les traductions dans la même projection primaire; sinon omettre les alternates indisponibles, conserver canonical et alerter.

### B02 — Sitemap partiel

- src/app/sitemap.ts : sitemap():31, Promise.all:34, déduplication:97.
- getAllBlogSlugs:156/error:162; getAllActivitySlugs:175/error:181; getAllDayTripSlugs:234/error:241; tours.ts readRows:185/error:197, getAllTourSlugs:365 et getAllToursGroupedByCity:260.
- Cause : Promise.all reçoit des succès artificiels [] et readRows peut interrompre une pagination après un échec en retournant le préfixe déjà collecté.
- Correction : propager chaque erreur; aucune publication du tableau final avant succès de toutes les familles/langues/pages. Paginer avec ordre stable et id de départage. Dédupliquer ne doit pas masquer des collisions de slugs : les signaler.
- Conserver initialement sitemap.ts et revalidate=120. Tester sa conservation ISR du dernier XML valide sur l’hébergement cible. À froid/premier build sans version valide : échec explicite, jamais XML partiel 200.
- Si le cache hébergeur ne fournit pas cette garantie, décider d’un snapshot validé persistant et atomique, avec âge/alerte, ou d’un Route Handler XML explicite. Ne pas faire coexister deux implémentations de /sitemap.xml; éviter un snapshot uniquement en mémoire locale.
- Régression : hausse des lectures, indisponibilité temporaire d’un sitemap auparavant partiel. Un XML ancien peut contenir un retrait : purge prioritaire et limite de stale à définir en phase 5.
- T04/T05/T08; phase 3. Exhaustivité actuelle de la base non démontrée : 324 est un point de référence, pas une cible permanente.

### B03 — Fraîcheur et retrait

- src/app/[locale]/page.tsx Home:132; activities/page.tsx ActivitiesPage:61; activities/[slug]/page.tsx generateStaticParams:34 et page:164; src/components/sections/Home/HomeBlogSection.tsx HomeBlogSection:46, lecture:48. Aucun revalidate de route dans les trois pages.
- Cause : prérendu conservé sans stratégie explicite; sitemap 120 s et autres familles 86400 s ne synchronisent pas l’accueil. Un client Supabase importé ne définit pas à lui seul une politique de cache fiable.
- Correction initiale : exporter revalidate=3600 (littéral analysable) sur les trois pages, après B01/B02. Valeur proposée à mesurer, pas garantie contractuelle; conserver d’abord les 86400 des autres familles pour isoler le changement.
- Ensuite définir invalidation par produit, famille, langue et ancienne/nouvelle URL; voir phase 5. React cache() déduplique dans un rendu, sans assurer une fraîcheur interrequêtes. unstable_cache est utilisable dans ce projet sans Cache Components, avec clés comprenant locale/slug/filtres/page et tags assignés explicitement.
- Ne pas passer globalement en force-static : cela peut neutraliser headers/cookies nécessaires au routage. Conserver params asynchrones, setRequestLocale dans les pages qui en ont besoin et accès serveur aux données.
- Régression : charge Supabase, retrait non purgé au CDN, cache mélangeant les langues, succès partiel durable. T08; phase 5.

### B04 — Pages de ville vides

- src/app/[locale]/tours/from/[city]/page.tsx generateMetadata:55, CityToursPage:126, lecture:142, if(!tours):146; src/lib/supabase/tours.ts getToursByCity:276, limite par défaut:279.
- Cause : [] est truthy; metadata accepte toute chaîne non vide et annonce les trois langues.
- Correction : résoudre une clé de ville normalisée contre le catalogue de villes accepté, puis vérifier les offres publiables par langue avec le contrat B01. Ville inconnue : notFound avant rendu; ville connue sans offre : par défaut 404 pour cette route de liste, hors sitemap/liens/hreflang. Garder une page 200 noindex seulement si un vrai contenu de remplacement est validé, sans l’appeler catalogue actif.
- Ne pas utiliser une liste de villes figée qui bloquerait les futurs départs. Une panne doit lever, pas vider le catalogue. Canonical, sitemap et liens doivent partager la même normalisation de city.
- Régression : disparition d’Agadir des liens, mauvaise normalisation des noms, réduction accidentelle aux dix premiers tours. Tester aussi onze tours et disponibilité EN seule.
- T06/T05; phase 4 après phase 2.

### B05 — Politique de réservation

- src/app/[locale]/about/booking-policy/page.tsx bookingPolicyPaths:410, generateMetadata:416, canonicalUrl:422, alternates:429, og:url:440; src/i18n/routing.ts:88 contient déjà le chemin correct.
- Cause : deuxième table de chemins omettant /about et ses traductions.
- Correction : supprimer cette reconstruction locale; utiliser getPathname({locale, href: '/about/booking-policy'}) puis new URL(path, origineValidée). Même source pour canonical, languages en/fr/es/x-default et openGraph.url.
- Cibles : /about/booking-policy; /fr/a-propos/politique-reservation; /es/sobre-nosotros/politica-reserva. Ne pas créer trois nouvelles pages aux mauvaises URL pour satisfaire les anciens canonicals.
- Ajouter cette clé à STATIC_PATHS après validation. Une redirection d’une ancienne mauvaise URL n’est utile que si des liens/visites sont établis; pas de migration générale de slugs.
- Régression : double préfixe, /en indésirable, mauvais x-default. T07; phase 1.

### B07 — Devises

- ActivityCard() src/components/sections/activities/ActivityCard.tsx:23, prix actuel:187–199, currency EUR:196 (modification concurrente après le relevé initial :15/:187); DayTripCard() src/components/sections/day_trips/daytripCard.tsx:34, prix actuel:142–155, currency EUR:152. Le rapport initial référençait :141 avec dollars; une modification concurrente l’a remplacé. TourCard() src/components/sections/tours/TourCard.tsx:47, currency EUR:180 a également changé : vérifier son alignement avec la fiche circuit et TourSeoJsonLd actuellement orientés USD, sans supposer une conversion légitime.
- Pages activité:255 et excursion:226; src/components/seo/seoActivities.ts CURRENCY_BY_LOCALE:11, buildActivityJsonLd:52, Offer:70–75.
- Types price : ActivityRow:43/ActivityDetail:70; DayTripRow:37/DayTripDetail:62; TourRow:37 et projections associées dans src/lib/supabase/. Les migrations ne définissent pas currency.
- Cause : symbole et EUR codés dans les consommateurs, sans devise dans les données.
- Correction : l’agence confirme la devise réelle de chaque prix et son unité. Introduire Money {amount, currency} et formatMoney utilisant Intl.NumberFormat; locale modifie la présentation, pas la monnaie. JSON-LD reçoit la même devise ISO et la même valeur, sans symbole ni virgule locale.
- Déploiement progressif : configuration explicite par famille/produit validée dans le dépôt comme transition, puis colonne currency nullable, remplissage vérifié, lecteurs compatibles et contrainte finale seulement après inventaire. Aucun EUR/USD supposé pour remplir les lignes.
- Prix inconnu : devis sur demande et pas d’Offer chiffrée. Tester null, zéro explicitement gratuit, décimales et montant invalide; remplacer les tests de vérité tels que activity.price par une validation numérique.
- Régression : conversion involontaire, confusion tarif par personne/groupe, arrondi, divergence anciennes données/nouveau code. T09; phase 7, décision métier et éventuelle migration Supabase séparées.

### B08 — Acompte

- src/messages/en.json:243, fr.json:236, es.json:241 (texte sur mesure p3); content dans booking-policy/page.tsx:42, notamment EN:70/87/100/121, FR:188/207/220/242, ES:309/328/341/362; BookingPolicyPage:483 et generateMetadata:416.
- Cause : règles commerciales copiées dans plusieurs textes; 20 % et 150 € sans périmètre d’exception.
- Correction : faire approuver montant ou pourcentage, base de calcul, devise, périmètre par produit, délais de changement et remboursement. Centraliser les données dans un module proposé src/lib/booking-policy.ts et interpoler les traductions, titres/meta/FAQ compris. Même version dans le processus de devis externe.
- Ne pas décider arbitrairement entre les deux règles et ne pas appliquer rétrospectivement une règle aux réservations existantes.
- Régression : nouvelle contradiction, promesse trop large, changement commercial involontaire. T10; phase 7. En attente de décision, livrer les autres phases sans inventer les conditions.

### B09 — Information de frontière

- src/messages/en.json:185, fr.json:178, es.json:183; MoroccoTouristPage dans src/app/[locale]/about/morocco_tourist/page.tsx:85, getTranslations('MoroccoTourist'):89.
- Cause : affirmation de réouverture dans un paragraphe prospectif, sans source/date.
- Correction : retirer cette affirmation et indiquer factuellement que les frontières terrestres et maritimes Maroc–Algérie sont fermées, avec lien et date de vérification; traduire fidèlement. Ce point est confirmé à nouveau par [FCDO, risques régionaux](https://www.gov.uk/foreign-travel-advice/morocco/regional-risks), consulté le 2 novembre 2026. Revalider avant publication.
- Régression : casser le balisage rich text <bold> ou étendre à tort cette conclusion à toutes les conditions d’entrée. T10; phase 7, sous-lot indépendant réalisable tôt.

### R02 — RLS

- supabase/migrations/20260908184206_create_day_trips.sql:1 et 20260911215827_create-tour.sql:1; src/lib/supabase/server.ts createClient:5, clé anon:4.
- Cause possible : migrations sans ENABLE ROW LEVEL SECURITY/policy pour ces deux tables; état distant et grants inconnus. L’absence locale ne prouve pas une exposition distante.
- Correction conditionnelle : inventorier pg_class.relrowsecurity, pg_policies, grants et rôles d’édition; préparer une nouvelle migration additive. Pour la lecture anonyme, n’autoriser que published=true; aucune écriture anonyme. Examiner aussi authenticated et les éventuelles policies permissives existantes. RLS filtre les lignes, pas automatiquement les champs internes d’une ligne publiée.
- Ne pas remplacer la clé anon par service_role pour « réparer » les pages. Tester l’éditeur réellement utilisé avant de restreindre ses droits.
- Régression : catalogue entier invisible; RLS peut renvoyer zéro ligne sans erreur et donc contourner la détection B01. Comparer inventaire autorisé et résultats anonymes de fixtures connues.
- T11; phase 6. Audit distant et application des migrations nécessitent Supabase; aucun accès ni changement distant dans ce travail.

### R03 — HTML et JSON-LD

- BlogDetailPage src/app/[locale]/blog/[slug]/page.tsx:176, injection blogContent:290; activité page:164, JSON.stringify:191, overview:280. Le correctif de H2 blog fixDuplicateBlogHeading:147 ne constitue pas un assainissement HTML.
- Cause : données stockées considérées fiables; JSON.stringify seul n’empêche pas la fermeture de la balise script.
- Correction : sérialiseur commun proposé src/lib/seo/json-ld.ts : JSON.stringify(value).replace(/</g, '\\u003c'); réutiliser sur tous les graphes. Pipeline serveur d’assainissement HTML à liste autorisée pour blogs/overview, distinct de la sérialisation JSON.
- Préserver paragraphes, titres, listes, tableaux, liens HTTP(S), ancres et images nécessaires; retirer scripts, gestionnaires on*, protocoles javascript: et iframes non approuvées. Utiliser un parseur/assainisseur maintenu, pas une regex; déclarer les dépendances directes requises. Les tours disposent déjà de rehype-sanitize : conserver leurs garanties.
- Auditer aussi les droits d’édition, sans qualifier le site de compromis. Régression : suppression de tableaux/classes/ancres utiles; tester un corpus réel anonymisé et des fixtures malveillantes isolées.
- T12; phase 6. La protection applicative peut être livrée indépendamment de l’audit RLS.

## 4. Stratégie compatible avec la stack

### Contrats communs

Un même contrat de contenu publiable par langue doit alimenter fiche, liste, count, sitemap, alternates, workTranslation et LanguageSwitcher. Minimum : published=true, locale acceptée, slug et titre non vides après trim; pour les activités, structure de contenu requise par la fiche. Ne pas imposer soudainement des critères éditoriaux plus stricts à tout le catalogue sans inventaire.

Filtres et count/range doivent partager les mêmes critères. Filtrer seulement après pagination peut créer des pages fantômes. Si les expressions JSONB actuelles ne permettent pas un filtrage exact (espaces seuls notamment), prévoir une vue/RPC ou des données normalisées via migration distincte; garder la validation TypeScript en défense complémentaire.

Les lecteurs secondaires ne doivent pas invalider un contenu primaire sain. Idéal : récupérer les traductions du même objet dans une lecture cohérente; sinon dégradation ciblée, traçable et limitée dans le temps.

### Next.js 16.4.3 et next-intl

Conserver src/proxy.ts, params: Promise et les Server Components. Ne pas migrer vers Cache Components dans ce chantier. Ne pas ajouter un global-not-found expérimental pour traiter des absences de produits.

La documentation locale not-found précise : 404 avant streaming, 200 avec noindex après streaming. Tester les en-têtes ET le HTML reçu avec plusieurs UA. Chercher les limites Suspense/loading/layout et placer la décision d’existence avant l’émission du contenu. Un 200 de page d’erreur sur une URL commerciale reste un défaut à résoudre, pas un succès de test.

La documentation revalidatePath de cette version demande le chemin interne de destination pour les rewrites. Pour next-intl, tester explicitement les chemins internes, par exemple /fr/tours/slug-fr, et les URL publiques /fr/circuits/slug-fr. Utiliser au besoin le pattern interne /[locale]/tours/[slug] avec type 'page', en acceptant sa portée plus large. Le getPathname public sert à canonical/liens/purge CDN; ne pas confondre ces deux espaces.

generateStaticParams n’est pas relancé lors de l’ISR. Conserver l’accès aux nouveaux slugs et tester une publication post-build; ne pas introduire dynamicParams=false sur les produits. Une nouvelle URL doit fonctionner sans rebuild.

React cache() peut partager la lecture entre generateMetadata et page. Ne pas le présenter comme une invalidation persistante. Si unstable_cache est introduit, y envelopper la lecture validée qui lève sur panne, avec tous les arguments métier dans la clé. Ne pas partager un client authentifié utilisateur dans un cache public.

### Fraîcheur : politique proposée, à valider

| Événement | Cible proposée en environnement sain | Mécanisme / preuve |
|---|---|---|
| Modification ordinaire | Visible sur requête de vérification sous 5 min avec invalidation; sinon cycle temporel documenté | Invalidation + préchauffage contrôlé; comparaison HTML/JSON-LD |
| Retrait urgent / mauvais prix | Plus aucun ancien contenu sous 5 min après événement validé | Expiration immédiate, purge CDN, requêtes de contrôle; jamais SWR seul |
| Nouvelle publication | Fiche, listes, accueil et sitemap cohérents sous 5 min avec invalidation | Nouveau slug absent du build, liens et XML vérifiés |
| Panne Supabase | Dernier contenu valide pour données non retirées; alerte immédiate | Erreur de régénération, sans faux absent; seuil de stale décidé par métier |
| Redémarrage / multi-instance | Même état de publication partout | Cache partagé ou stratégie hébergeur vérifiée; pas de garantie depuis un processus seul |

Un TTL est un seuil de revalidation déclenchée par accès, pas une tâche planifiée ni une borne absolue. Si la borne de cinq minutes est retenue, une vérification active et une chaîne d’invalidation opérationnelle sont requises. L’hébergement doit démontrer la persistance et la propagation; sinon ne pas annoncer cet engagement.

Pour invalidation ordinaire : revalidateTag(tag, 'max') permet du stale. Pour retrait strict dans un Route Handler : revalidateTag(tag, {expire: 0}); updateTag ne convient pas à un webhook/Route Handler. Ne pas utiliser la signature revalidateTag(tag) dépréciée. Les tags n’agissent que sur des entrées effectivement taguées.

Si un endpoint d’invalidation est ajouté ultérieurement : POST serveur, secret non public, signature ou authentification vérifiée, fenêtre temporelle, anti-rejeu, liste fermée de tables/événements, taille bornée, idempotence et reprise après échec. Dériver les chemins côté serveur, jamais accepter une URL arbitraire à purger. Conserver ancien/nouveau slug et ville pour les changements. Un acquittement ne prouve pas que le CDN est purgé. La connexion au système éditorial reste une action externe distincte.

## 5. Phases indépendantes et ordre de livraison

Chaque phase correspond à un lot revu, testé et réversible. « Indépendante » signifie sans obligation de déployer tous les lots ensemble; les dépendances de contrat sont explicites. Les commandes C0/C1 et Txx sont définies en section 6. Toutes sont des vérifications futures, non exécutées ici.

### Phase 0 — Établir la réalité du refus Googlebot (première action)

- **Objectif :** confirmer ou écarter le seul obstacle potentiel d’accès global.
- **Problèmes concernés :** R01; référence initiale pour R06/R08.
- **Fichiers à modifier :** aucun fichier applicatif. Lire src/proxy.ts et public/robots.txt; conserver preuves et identifiant du déploiement.
- **Modifications recommandées :** d’abord aucune; inspection GSC de l’accueil, d’une fiche par famille/langue et de la politique; examiner le téléchargement du sitemap dans GSC. Corréler logs CDN/origine et authentifier les IP Google. Si refus confirmé, correction ciblée de la règle par l’administrateur Hostinger.
- **Risques :** confondre test utilisateur Google et crawl automatique; désactiver trop largement le WAF.
- **Tests à effectuer :** T01 et commandes HTTP C2; comparaison navigateur, Googlebot simulé et trafic authentifié, sans conclure sur l’UA seul.
- **Résultat attendu :** diagnostic avec règle/couche responsable ou preuve que les robots vérifiés passent.
- **Critères de validation avant déploiement :** aucune modification CDN sans règle identifiée, sauvegarde de son état et test de retour arrière. Avant clôture, inspection en direct réussie ET absence de refus sur un échantillon récent de crawl authentifié; sinon R01 reste ouvert.
- **Périmètre / retour arrière :** GSC + Hostinger/CDN; restaurer uniquement la règle modifiée. Les travaux dépôt suivants peuvent avancer pendant l’attente des accès.

### Phase 1 — Réparer les URL de référence

- **Objectif :** faire converger canonical, hreflang, og:url et sitemap.
- **Problèmes concernés :** B05/B06; portion locale R05; O01 pour la politique.
- **Fichiers à modifier :** about/booking-policy/page.tsx, about/page.tsx, src/app/sitemap.ts; nouveau src/lib/seo/site-url.ts; consommateurs d’origine progressivement (layout.tsx, BlogSeo, TourSeoJsonLd, seoActivities). src/i18n/routing.ts est déjà correct : le réutiliser.
- **Modifications recommandées :** appliquer B05; corriger about generateMetadata:92/100 via getPathname('/about'); origine HTTPS unique validée sans chemin/query, sans la déduire d’un Host arbitraire; ajouter les trois politiques au sitemap. Préproduction protégée/noindex au niveau environnement, jamais par fuite de configuration en production.
- **Risques :** /en ajouté, double préfixe, pages de préproduction indexables, origine build différente de l’origine runtime.
- **Tests à effectuer :** C0/C1 et T07, soit npx --no-install vitest run tests/seo/urls.test.ts puis node scripts/seo/check.mjs --base http://localhost:3100 --suite urls.
- **Résultat attendu :** politiques auto-canoniques finales 200 et alternates réciproques; /about auto-canonique. À catalogue identique, 327 URL au lieu de 324 après ajout des politiques seulement.
- **Critères de validation avant déploiement :** zéro cible canonical/hreflang 3xx/4xx/noindex dans le lot; toutes les autres familles gardent leurs URL; contrôle des images et liens inchangé.
- **Dépendances / retour arrière :** dépôt seul; configuration effective de l’origine à confirmer par l’hébergeur. Annuler le lot si régression, sans recréer les anciennes URL erronées.

### Phase 2 — Séparer panne, absence et données secondaires

- **Objectif :** arrêter les fausses 404 et les listes vides de secours trompeuses.
- **Problèmes concernés :** B01/B16; préalable B02/B03/B04.
- **Fichiers à modifier :** quatre lecteurs src/lib/supabase/, nouveau errors.ts; pages et generateMetadata détail; éventuel src/app/[locale]/error.tsx; lecteurs de listes et alternates.
- **Modifications recommandées :** appliquer B01, supprimer retours vides sur erreur, lever dans fail/readRows; rendre les alternates facultatifs sans masquer les erreurs primaires; dédupliquer la lecture par rendu si utile.
- **Risques :** exception non traitée au build, propagation trop large d’une erreur secondaire, panne devenue 200 streamé.
- **Tests à effectuer :** C0/C1, T02/T03; npx --no-install vitest run tests/seo/data-contract.test.ts; node scripts/seo/check.mjs --base http://localhost:3100 --suite errors sur serveur avec doublure isolée.
- **Résultat attendu :** absent réel 404/noindex; panne primaire distincte; fiche valide accessible malgré panne secondaire.
- **Critères de validation avant déploiement :** timeout, 401/403, 429, 5xx et doublon ne produisent jamais de succès métier vide; absence et panne séparées dans logs; cache valide préservé; erreurs froides contrôlées avant streaming. Le build doit échouer proprement si son catalogue obligatoire manque.
- **Dépendances / retour arrière :** dépôt seul, tests sans base de production. Livrer contrat et consommateurs ensemble; restaurer le lot entier si nécessaire.

### Phase 3 — Fiabiliser sitemap et traduction publiable

- **Objectif :** découverte complète des seules URL exploitables.
- **Problèmes concernés :** B02/B17/B18/B19/R04/O01; liens de langues O05.
- **Fichiers à modifier :** src/app/sitemap.ts; lecteurs Supabase; src/components/seo/BlogSeo.tsx:95; src/components/ui/LanguageSwitcher.tsx:58; listes blog/activités; nouveaux modules de validation/pagination. Migrations futures pour unicité et updated_at si retenues.
- **Modifications recommandées :** génération tout-ou-rien; pagination stable pour les quatre familles; contrat commun avant count/range; alternates seulement pour traductions publiables; aucun fallback currentSlug vers une langue manquante. Ajouter de vrais liens vers traductions disponibles, avec lien distinct vers la liste si besoin.
- **Risques :** pages de pagination qui changent, réduction du catalogue par filtre trop strict, doublons masqués, transactions concurrentes pendant pagination.
- **Tests à effectuer :** C0/C1, T04/T05; npx --no-install vitest run tests/seo/catalogue.test.ts tests/seo/sitemap.test.ts; node scripts/seo/check.mjs --base http://localhost:3100 --suite discovery.
- **Résultat attendu :** sitemap égal à l’inventaire attendu par famille/langue; toutes les URL annoncées répondent 200, auto-canoniques et indexables.
- **Critères de validation avant déploiement :** échec à la deuxième tranche ou dans une langue ne remplace jamais le XML valide; 1001+ lignes intégralement parcourues; aucun /null, /undefined, titre blanc ou count fantôme. Export de référence daté et comparaison d’ensembles, pas uniquement de totaux.
- **Dépendances / retour arrière :** phase 2; phase 1 pour politiques. Retarder les contraintes uniques tant que les doublons ne sont pas résolus avec correspondance d’URL. Migrations nouvelles, jamais réécriture des historiques.
- **Complément :** updated_at/date de révision réels pour lastmod; omettre si inconnus. Pas de new Date() systématique. Les alternates XML sont facultatifs. Pour garantir un snapshot sous publications concurrentes, prévoir vue/RPC transactionnelle ou version de catalogue et nouvelle tentative si elle change; un simple ordre stable ne suffit pas.

### Phase 4 — Fermer les routes vides et corriger leurs liens

- **Objectif :** supprimer les espaces d’URL vides indexables.
- **Problèmes concernés :** B04/B11/B12/B13.
- **Fichiers à modifier :** tours/from/[city]/page.tsx; offers/page.tsx; favorites/page.tsx; src/components/sections/Home/Destinations.tsx; src/components/Layout/Footer.tsx; public/robots.txt; sitemap si contrat ville partagé.
- **Modifications recommandées :** appliquer B04; calculer compteurs sur tout le catalogue publiable, pas les dix cartes affichées. Brouillon offers : privilégier 404 tant qu’il n’est pas livré. Favoris conservés pour l’utilisateur : metadata noindex et exploration autorisée de leurs variantes afin de lire ce signal. Retirer les liens inutiles.
- **Risques :** fonctionnalité favoris cassée, villes légitimes exclues, règles robots trop larges.
- **Tests à effectuer :** C0/C1, T06; node scripts/seo/check.mjs --base http://localhost:3100 --suite routes; parcours favoris en navigateur.
- **Résultat attendu :** inconnues et listes sans offre ne sont plus des pages commerciales 200 indexables; compteurs exacts.
- **Critères de validation avant déploiement :** ville réelle 200; inconnue 404/noindex; panne ≠ absence; offres EN/FR/ES testées; aucun lien sitemap vers page retirée; favoris fonctionnels et noindex lisible.
- **Dépendances / retour arrière :** phase 2, contrat langue phase 3 pour finaliser les alternates. Dépôt seul; restauration coordonnée des pages/liens/robots, jamais de blocage global.

### Phase 5 — Maîtriser cache et publication

- **Objectif :** mettre à jour et retirer le contenu sans redéploiement complet.
- **Problèmes concernés :** B03, cohérence B01/B02, R06 mesuré.
- **Fichiers à modifier :** accueil et activités liste/détail; lecteurs/cache partagés; dépendances HomeBlogSection; éventuel src/lib/seo/revalidation.ts et src/app/api/revalidate/route.ts; autres familles uniquement pour la politique d’invalidation validée.
- **Modifications recommandées :** sous-lot 5A : revalidate=3600 sur les trois pages et preuve ISR; sous-lot 5B : invalidation authentifiée, tags/chemins et intégration éditoriale. Invalider fiche, listes, villes, accueil, recommandations, pagination blog, alternates et sitemap dans les trois langues; traiter anciens/nouveaux slugs.
- **Risques :** amplification des lectures, cache froid après purge, endpoint abusé, retrait encore servi par un autre nœud/CDN.
- **Tests à effectuer :** C0/C1 et T08; npx --no-install vitest run tests/seo/revalidation.test.ts; node scripts/seo/check.mjs --base http://localhost:3100 --suite freshness. Refaire sur préproduction derrière CDN.
- **Résultat attendu :** publication/modification/retrait suivent la politique mesurée de section 4.
- **Critères de validation avant déploiement :** preuve cold/HIT/STALE/régénération et contenu réel; nouvelle publication post-build; retrait sur chaque instance et cache CDN; événement invalide rejeté; réessai après panne. Pas de validation via next dev seulement.
- **Dépendances / retour arrière :** phases 2–3. 5A dépôt; 5B intégration Supabase/éditeur et Hostinger. Désactiver l’intégration si nécessaire en conservant TTL de secours; ne pas restaurer un snapshot contenant un retrait urgent.

### Phase 6 — Protéger la chaîne de contenu

- **Objectif :** vérifier les droits et rendre HTML/JSON-LD sûrs.
- **Problèmes concernés :** R02/R03.
- **Fichiers à modifier :** blog/activité détail; sérialiseur JSON-LD commun; assainisseur HTML; composants SEO; nouvelle migration RLS après audit, tests SQL isolés.
- **Modifications recommandées :** appliquer les deux dossiers P1. Séparer 6A assainissement dans le dépôt et 6B droits Supabase. Tester 6A sans attendre les accès 6B.
- **Risques :** suppression de contenu utile; catalogue invisible après RLS; éditeur privé bloqué.
- **Tests à effectuer :** C0/C1, T11/T12; npx --no-install vitest run tests/seo/content-safety.test.ts; npx --no-install playwright test tests/seo/content-safety.spec.ts; SQL de lecture C3 puis tests de rôles sur base isolée.
- **Résultat attendu :** aucun script de fixture exécuté; contenu utile conservé; accès public limité aux lignes publiées.
- **Critères de validation avant déploiement :** liens/tableaux/accents et rendu sans JS conservés; JSON parsable avec charge </script>; rôle anon interdit en écriture; éditeur autorisé fonctionne; inventaire public attendu complet.
- **Dépendances / retour arrière :** lot applicatif indépendant, retester contrat phase 2. RLS uniquement après vérification distante; prévoir restauration des policies antérieures sans désactiver globalement la protection. Si exposition réelle découverte, faire remonter la priorité et traiter avant les améliorations.

### Phase 7 — Réconcilier prix, conditions et langues

- **Objectif :** fournir une réponse commerciale et factuelle unique.
- **Problèmes concernés :** B07/B08/B09/B14/R07.
- **Fichiers à modifier :** cartes et fiches citées dans les dossiers; types/projections Supabase; seoActivities.ts; src/messages/{en,fr,es}.json; booking-policy/page.tsx; nouveaux modules money.ts et booking-policy.ts; modèles de devis externes.
- **Modifications recommandées :** sous-lot immédiat B09 et chaînes de langue; sous-lot prix/conditions après décision agence; migration currency additive facultative dans un lot distinct. Décrire tarif de départ, unité, inclusions et confirmation humaine.
- **Risques :** migration irréversible de montants, surpromesse commerciale, erreurs d’arrondi ou rich text.
- **Tests à effectuer :** C0/C1, T09/T10; npx --no-install vitest run tests/seo/money-policy.test.ts; node scripts/seo/check.mjs --base http://localhost:3100 --suite commercial; relecture EN/FR/ES.
- **Résultat attendu :** carte = fiche = Offer = devis pour même produit/périmètre; règles d’acompte cohérentes; frontière corrigée.
- **Critères de validation avant déploiement :** devise/source validées par l’agence pour toutes les lignes; aucune conversion implicite; null et zéro traités; conditions approuvées; aucune affirmation de réouverture; nouveaux textes localisés.
- **Dépendances / retour arrière :** B09/B14 autonomes et à avancer dès le début; prix/conditions dépendent de décisions métier. Code compatible avec ancienne/nouvelle colonne; rollback applicatif sans supprimer currency ni annuler aveuglément les données validées.

### Phase 8 — Réparer et relier les données structurées

- **Objectif :** un graphe fidèle aux informations visibles.
- **Problèmes concernés :** B10/B15/O03, prolongement B07/R07.
- **Fichiers à modifier :** src/components/seo/{ContactJsonLd.tsx,seoActivities.ts,BlogSeo.tsx,TourSeoJsonLd.tsx}; day-trips/[slug]/page.tsx; customize-your-tour/page.tsx; about/morocco_tourist/page.tsx.
- **Modifications recommandées :** images réelles /images/hero.jpg et /logo.png après contrôle; ID agence commun; WebPage avec breadcrumb/mainEntity et TouristTrip lié au fournisseur; Offer seulement si prix/conditions fiables. Mettre les étapes sous itinerary, avec ItemList de lieux quand les étapes sont effectivement des lieux; garder les durées imprécises en texte. Retirer InStock constant non justifié.
- **Risques :** graphe dupliqué, type incompatible, faits absents du HTML, métadonnées en retard sur le prix.
- **Tests à effectuer :** C0/C1, T13; npx --no-install vitest run tests/seo/schema.test.ts; node scripts/seo/check.mjs --base http://localhost:3100 --suite schema; Schema.org Validator et Rich Results Test pour types éligibles.
- **Résultat attendu :** données parsables, propriétés compatibles et entités reliées; aucune promesse de rich result TouristTrip/FAQ.
- **Critères de validation avant déploiement :** images 200 image/*, liens d’entités résolus, contenu/monnaie identiques au HTML; zéro erreur sémantique bloquante, avertissements documentés; aucun avis/disponibilité inventé.
- **Dépendances / retour arrière :** phases 1/3/6 pour URL, traductions, sérialisation; phase 7 pour offres. Les images B10 peuvent être corrigées seules plus tôt. Revenir à un graphe minimal fidèle si nécessaire.
- **Références :** [TouristTrip](https://schema.org/TouristTrip), [duration](https://schema.org/duration), [itinerary](https://schema.org/itinerary). Un JSON valide ne suffit pas à valider la sémantique.

### Phase 9 — Consolider contenu, parcours et mesure

- **Objectif :** améliorer la compréhension et mesurer les effets après réparation des fondations.
- **Problèmes concernés :** R06/R08/O02/O04/O05/O06/O07.
- **Fichiers à modifier :** Home/Hero.tsx, layout.tsx seulement après mesure; BlogSeo et modèles blog/fiches; Contact/ContactForms.tsx et src/app/api/contact/route.ts pour contexte validé; LanguageSwitcher.tsx, Itinerary.tsx, FaqItem.tsx; public/llms.txt; tests/CI à créer.
- **Modifications recommandées :** auteurs/relecteurs réels, sources et dates; tableaux factuels départ/arrivée/durée/inclusions; liens éditoriaux locaux pertinents; langues en liens HTML; accordéons accessibles. Ajouter produit, URL, langue, dates/voyageurs au devis avec validation serveur. Vérifier llms.txt existant sans en faire un objectif de classement.
- **Risques :** fusion de pages sans preuve, perte de liens, formulaire envoyant de vrais messages pendant test, optimisation visuelle régressive.
- **Tests à effectuer :** C0/C1, T14; npx --no-install playwright test tests/seo/journeys.spec.ts; node scripts/seo/check.mjs --base http://localhost:3100 --suite content; mesures mobiles reproductibles et exports GSC.
- **Résultat attendu :** lecture et navigation sans JS utiles, devis contextualisé, métriques de référence et suivi comparables.
- **Critères de validation avant déploiement :** aucun envoi SMTP réel dans les tests; clavier/mobile sans régression; contenu factuel approuvé; mesures avant/après sous mêmes conditions. Aucune suppression/fusion pour « cannibalisation » sans matrice requête/URL.
- **Dépendances / retour arrière :** URLs/langues et faits stabilisés; GSC, preuves agence et contenu Supabase pour les conclusions externes. Optimisations une par une, réversibles, sans modifier la stack.

### Ordonnancement pratique

Lancer la phase 0 en premier. Premier lot applicatif recommandé ensuite : phase 1, simple et indépendant. Chaîne centrale : 2 → 3 → 4 → 5. En parallèle organisationnel, sans dépendre des accès GSC : 6A et correction B09; préparer décisions métier de 7 et audit 6B. Puis finaliser 7 → 8 → 9. « En parallèle » décrit des chantiers humains possibles, pas une exécution automatique dans cette session.

Ne pas attendre la fin d’une longue analyse de performances pour corriger une information factuelle ou une canonical connue. Ne pas reporter un incident RLS/injection confirmé derrière les améliorations SEO.


## 6. Plan de tests et commandes de vérification

### Statut des commandes

Le package.json actuel ne contient aucun script de test métier. Vitest, Playwright, tests/seo/ et scripts/seo/check.mjs ci-dessous sont des **livrables à créer pendant l’implémentation**, pas des outils déjà disponibles ni des tests déjà réussis. Les commandes npx --no-install doivent échouer tant que les dépendances locales ne sont pas installées : pas d’installation implicite.

Prévoir un petit socle de tests dès la première correction : Vitest pour contrats de fonctions, Playwright pour rendu/parcours, parseur HTML/XML pour contrôles HTTP. Déclarer et verrouiller les dépendances; adapter package.json et package-lock.json uniquement lors de l’implémentation autorisée. Aucun de ces fichiers n’est changé pour ce plan.

Contrat du futur scripts/seo/check.mjs :
- paramètres --base et --suite (urls, errors, discovery, routes, freshness, commercial, schema, content ou all);
- base locale/préproduction explicitement indiquée; sorties JSON avec horodatage, URL demandée/finale, statut, chaîne de redirections, canonical, langues, robots, graphes et erreurs;
- maximum trois GET concurrents, timeout borné, pas de POST externe, aucun envoi de formulaire;
- code de sortie non nul sur assertion échouée; parser le HTML complet et XML avec leurs namespaces, pas une regex naïve;
- --suite freshness/errors uniquement sur environnement isolé avec doublure pilotable. Refuser ces scénarios si base de production ou configuration non isolée;
- assertions tirées de fixtures et d’un inventaire attendu par langue, jamais d’un nombre 324 codé en dur;
- analyser aussi X-Robots-Tag et les métadonnées streamées dans le corps; faire un passage avec JS et un sans JS.

Les tests d’intégration serveur doivent injecter les défaillances dans l’adaptateur Supabase ou une doublure HTTP locale côté serveur. page.route de Playwright, limité au trafic navigateur, ne simule pas les requêtes Supabase des Server Components. Ne pas interrompre une base distante pour tester.

### C0 — Vérifications existantes, sans correction automatique

~~~powershell
git status --short
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js src --no-cache
git diff --check
~~~

Référence du rapport : typecheck réussi; quatre erreurs no-explicit-any dans blogs.ts/activities.ts. Ne pas les présenter comme de nouveaux échecs ou comme un lint vert. Dans les lots qui touchent ces lecteurs, remplacer les any par projections typées et viser zéro erreur. Pour un lot isolé sans rapport avec les lecteurs, aucune nouvelle erreur et exception de référence documentée; ne pas désactiver les règles pour obtenir un résultat vert.

### C1 — Vérification sur build de production isolé

Exécuter ultérieurement dans un checkout de test avec environnement Supabase de test ou doublure, jamais avec une base privée de production par défaut. Les secrets viennent du gestionnaire de l’environnement, pas de commandes copiées dans le rapport.

~~~powershell
npm run build
npm run start -- --port 3100
~~~

Le premier terminal garde le serveur; dans un second :

~~~powershell
node scripts/seo/check.mjs --base http://localhost:3100 --suite all
npx --no-install vitest run tests/seo
npx --no-install playwright test tests/seo
~~~

Le build écrit .next et peut lire Supabase : il n’est pas exécuté dans cette préparation documentaire. Capturer la table des routes et le manifeste de ce nouveau build; ne pas utiliser le manifeste antérieur comme preuve du résultat. Les variantes avec cache doivent passer sous next start, puis derrière le CDN de préproduction.

### C2 — GET reproductibles, pas une preuve d’identité du bot

~~~powershell
$seoBase = 'https://toursmarrakechdesert.com'
curl.exe --silent --show-error --max-time 30 --dump-header - --output NUL "$seoBase/"
curl.exe --silent --show-error --max-time 30 --dump-header - --output NUL "$seoBase/sitemap.xml"
curl.exe --silent --show-error --max-time 30 --dump-header - --output NUL "$seoBase/robots.txt"
curl.exe --silent --show-error --max-time 30 --dump-header - --output NUL --user-agent 'Googlebot' "$seoBase/"
curl.exe --silent --show-error --max-time 30 --dump-header - --output NUL --user-agent 'Googlebot' "$seoBase/sitemap.xml"
curl.exe --silent --show-error --location --max-redirs 5 --max-time 30 --dump-header - --output NUL "$seoBase/en/about"
~~~

Répéter avec les UA complets desktop/mobile officiels et les UA de recherche IA pour comparer les règles, puis avec Accept-Language en/fr/es et sans cookie. Les commandes sans --location révèlent le premier statut; la dernière montre les sauts. Pour inspecter HTML/XML, supprimer --output NUL ou utiliser le futur vérificateur. Ne pas utiliser HEAD seul pour conclure sur GET.

Pour Google authentique : exporter les logs depuis Hostinger et utiliser les méthodes de [vérification Google](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests). Les IP et plages changent : les relire à l’exécution. Ne pas faire confiance à un X-Forwarded-For fourni par le client. Une inspection GSC réussie prouve le test en direct, pas à elle seule le passage du crawler automatique.

### C3 — Diagnostic Supabase en lecture seule, réservé à un accès autorisé

À préparer pour l’administrateur, non exécuté ici :

~~~sql
select n.nspname, c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('posts', 'activities', 'day_trips', 'tours');

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('posts', 'activities', 'day_trips', 'tours');

select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('posts', 'activities', 'day_trips', 'tours');

select en->>'slug' as slug, count(*)
from public.tours
where published is true and nullif(btrim(en->>'slug'), '') is not null
group by en->>'slug'
having count(*) > 1;
~~~

Répéter le contrôle de doublons pour chaque table/langue, et comparer aussi les slugs normalisés. Les vues de grants peuvent dépendre du rôle de diagnostic : vérifier les privilèges effectifs, y compris hérités, avec l’administrateur. Exporter seulement comptages/URL publiques nécessaires, pas des contenus privés. La lecture anon d’une fixture publiée connue doit réussir; celle d’un brouillon connu doit être filtrée. Tester INSERT/UPDATE/DELETE uniquement sur fixtures d’une base isolée, jamais en production. [Supabase, RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

### Matrice d’acceptation détaillée

| Test | Entrées / scénario | Assertions et preuve attendue |
|---|---|---|
| T01 accès | Accueil, sitemap, robots, fiche de chaque famille/langue; UA normal/simulé et logs réels | 200 sur ressources publiques pour bots vérifiés; pas de challenge; origine du 403 identifiée. GSC et logs joints; un 403 d’usurpation peut rester légitime |
| T02 données primaires | Zéro ligne, unpublished, locale absente, timeout, 401/403, 429, 500, données malformées, doublon | Zéro ligne publiable → null; erreur → rejet typé; pas de []/{} de secours. Contrat identique dans metadata/page/listes/slugs |
| T03 rendu et cache d’erreur | Page existante cache froid puis chaud; erreur primaire; erreur alternates seule; retour de la base | Froid : erreur serveur sans faux notFound; chaud : ancien rendu valide, pas 404 mémorisée; alternates seuls : fiche 200 et canonical correct; récupération à la requête suivante appropriée |
| T04 sitemap atomique | Erreur d’une famille, d’une langue et de la deuxième tranche; cache vide puis préchauffé | Aucun XML partiel 200; hash du dernier XML valide conservé si ISR chaud; froid/build en échec explicite. Après guérison, ensemble complet exact |
| T05 catalogue/traductions | 0/1/10/11/12/13/500/501/1000/1001 lignes, plafond serveur inférieur à 500, titres identiques, slugs dupliqués, traduction EN seule, null, vide, espaces, contenu activité absent | Pagination exhaustive avec ordre stable; count/range cohérents; aucun slug invalide; pas d’alternate/workTranslation/lien pour langue non publiable; navigation retour et changement de langue corrects |
| T06 routes | Marrakech, Agadir sans offre, ville aléatoire, casse/espaces/encodage; offres/favoris dans trois langues | Ville valide 200, inconnue 404/noindex; normalisation stable ou redirection explicite; panne distincte; pas de page de brouillon indexable; favoris noindex accessible au crawler |
| T07 URL | Trois politiques, trois À propos, tous modèles dynamiques, pagination 1/2/invalide, environnement de préproduction | Une canonical finale exacte; EN sans /en; réciprocité uniquement entre traductions existantes; x-default valide; og:url cohérent; aucun domaine de préproduction dans les URL de production |
| T08 publication/cache | Nouveau produit après build; changement prix/slug/ville; retrait/republication; événement répété/retardé/invalide; panne pendant ISR; redémarrage et deux instances | Toutes dépendances mises à jour; ancien slug retiré/redirigé selon décision; aucune fuite de langue; événement illégitime sans effet; retrait non servi par CDN; timestamps et délais mesurés |
| T09 monnaie | Trois langues × activités/excursions/tours × 165/99.99/null/0/valeur invalide; devise différente de la langue | Montant et code ISO identiques entre carte/fiche/graphe; format local correct; null sans Offer chiffrée; zéro gratuit explicite; aucune conversion implicite ni perte de décimales |
| T10 conditions/faits | Acompte/règles par produit et trois langues; texte, metadata et FAQ; frontière et CTA | Conditions identiques à la décision métier, exceptions explicites; affirmation erronée absente; source/date affichées; clés rich text valides et aucune langue de secours involontaire |
| T11 droits | Lecture published/unpublished; anon/authenticated/éditeur; permissions d’écriture, sans clé privilégiée côté public | Public ne lit que fixtures autorisées et n’écrit pas; éditeur fonctionne; inventaire attendu complet; migration réexécutable selon outil et restauration testée |
| T12 contenu sûr | </script>, attributs onerror, javascript:, SVG dangereux, liens/ancres/tableaux légitimes, accents | Pas d’exécution navigateur ni injection de nœud parasite; JSON.parse réussit; contenu utile et navigation préservés; résultat identique avant hydratation |
| T13 graphe | Toutes familles/langues; prix inconnu; images; étapes descriptives vs lieux; traductions absentes | Syntaxe puis validation domaine/range; URL absolues finales; IDs cohérents; images 200; aucune disponibilité inventée; durée fidèle au texte et aucune propriété incompatible |
| T14 parcours/mesures | JS désactivé, mobile/clavier, formulaires en environnement capturé, liens llms.txt, corpus de questions IA | Contenu essentiel lisible; liens langues réels; devis conserve contexte; zéro e-mail réel; mesures comparables; aucune citation IA présentée comme garantie |

Précision T03/T06 : si Next stream une réponse 200 puis injecte noindex, conserver cette preuve, mais ne pas conclure « vrai 404 testé ». Adapter le placement de la lecture/validation et retester sous les UA concernés avant acceptation. Les tests doivent vérifier le statut réellement émis, pas seulement l’appel mocké à notFound.

Pour T08, enregistrer : heure de changement de fixture, réception d’événement, invalidation Next, purge CDN, première réponse neuve, dernière réponse ancienne. Répéter à froid/chaud et après redémarrage. Age, Cache-Control, x-nextjs-cache si disponible et hash du corps doivent être lus ensemble; les en-têtes seuls ne prouvent pas la fraîcheur.

Retrait : fixer un comportement métier explicite. Pour un produit dépublié sans remplacement, 404/noindex; redirection permanente seulement vers un équivalent réellement pertinent. Une URL consultée et mise en cache comme absente avant sa publication doit aussi être invalidée.

Les tests de sitemap doivent comparer URL attendues et obtenues en différences d’ensembles (manquantes et excédentaires), puis suivre toutes les cibles. Une chute même légitime exige une explication; un seuil d’alerte proposé de 10 % par famille/langue ne remplace pas l’égalité attendue sur fixtures.

### Validation commune avant chaque livraison

- Typecheck, tests du lot, build de production et absence de nouvelle erreur lint; artefacts reliés au SHA du lot.
- Régression HTTP sur toutes les URL du sitemap de préproduction et pages hors sitemap citées; pas seulement la page modifiée.
- Contrôles EN/FR/ES, HTML brut et rendu navigateur sur les modèles touchés.
- Accès public aux pages commerciales conservé; pas de noindex/Disallow de préproduction transporté en production.
- Rollback du lot testé; migrations additives compatibles avec version précédente.
- Responsables et preuves externes identifiés; une étape non testée est indiquée « non validée », jamais verte par défaut.

## 7. Répartition dépôt / services externes

| Action | Réalisable dans le dépôt | Nécessite hors dépôt |
|---|---|---|
| Canonical, hreflang, og:url, liens, texte, schema | Oui | GSC pour constater l’interprétation Google, après futur déploiement |
| Contrat erreurs Supabase et tests de panne | Oui, avec doublures locales | Logs/quotas/permissions réels pour diagnostiquer une panne distante |
| Génération sitemap atomique/pagination | Oui | Inventaire Supabase autorisé pour certifier exhaustivité réelle; CDN pour conservation/purge |
| Ville vide, offres, favoris, robots | Oui | GSC pour suivi de désindexation éventuelle, sans garantie de délai |
| TTL et cache Next | Oui pour code; validation locale partielle | Hostinger pour runtime, cache persistant, nombre d’instances et comportement CDN |
| Invalidation après édition | Endpoint et tests dans dépôt | Configuration de l’émetteur éditorial/Supabase, secret serveur et purge CDN |
| RLS, unicité, currency, updated_at | Migration et tests préparables | Audit/application Supabase séparés, sauvegarde et décision propriétaire |
| Devise, acompte, horaires/disponibilité | Affichage centralisé | Confirmation agence, données et modèles de devis |
| Révision des articles | Templates, tests et dictionnaires | Édition Supabase et validation humaine pour les corps stockés en base |
| Googlebot authentique, indexation réelle | Non démontrables par code | Search Console + logs Hostinger/origine |
| Performances et visibilité IA | Tests locaux et instrumentation préparables | CrUX/RUM, analytics/logs, accès outils et observations répétées |

La tâche actuelle autorise uniquement la création de ce plan. Toutes les actions opérationnelles ci-dessus restent à exécuter ultérieurement dans leur périmètre approprié.

## 8. Suivi après une future mise en production

Ces étapes ne sont pas des actions effectuées aujourd’hui :
1. Contrôle immédiat GET de chaque modèle/langue, sitemap, canonical/hreflang, robots et JSON-LD; vérifier que le SHA déployé correspond au lot testé.
2. Surveiller 403/404/5xx, erreurs de génération, âge du sitemap, temps de rafraîchissement, charge Supabase et latence; revenir au lot stable en cas de régression mesurée. Éviter rollback qui republie des contenus retirés.
3. Dans GSC, vérifier sitemap lu, inspection représentative, canonical déclarée/choisie et évolution des causes d’exclusion. Ne pas demander l’indexation de pages encore défectueuses ni considérer la soumission comme une garantie.
4. Comparer requêtes, pages, pays et appareils sur des périodes comparables (proposition : 28 jours avant/après, en tenant compte de la saisonnalité); séparer marque/hors marque. La première mesure d’impact n’est pas un critère de déploiement.
5. Pour les IA, suivre accès réels quand vérifiables, référents, pages citées et demandes qualifiées; garder le corpus de questions, langues, dates et réponses. Une fluctuation de réponse n’établit pas un effet causal de la correction.

## 9. Documentation technique locale de référence

Les recommandations Next.js s’appuient sur les guides du paquet installé, à relire si la version change :
- node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md
- node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md
- node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md
- node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidatePath.md
- node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md
- node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md
- node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md
- node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md
- node_modules/next/dist/docs/01-app/02-guides/json-ld.md

La génération des chemins suit le createNavigation déjà présent et [getPathname de next-intl](https://next-intl.dev/docs/routing/navigation). Les recommandations externes sont reliées aux affirmations correspondantes dans ce document. Aucune conclusion sur indexation, RLS distant ou blocage authentique n’est tirée sans les preuves manquantes.

**Première phase à exécuter : phase 0, diagnostic Googlebot authentifié. Premier correctif applicatif autonome : phase 1, canonical/hreflang.**
