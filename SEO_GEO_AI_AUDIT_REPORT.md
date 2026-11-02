# Audit technique SEO, GEO, AEO et compréhension par les agents IA

**Site :** https://toursmarrakechdesert.com  
**Date des observations :** 1 novembre 2026, UTC  
**Projet :** C:\Users\PC\Desktop\mywebsite\projet  
**Périmètre :** audit en lecture seule du dépôt, des artefacts de build existants et du site public. Seul ce rapport est créé. Aucun changement applicatif, installation, publication, modification Supabase ou envoi de formulaire.

## 1. Résumé exécutif

Le site possède de bonnes fondations : pages rendues côté serveur, routes et slugs traduits, contenu HTML substantiel, titres/descriptions distincts, sitemap accessible et robots.txt permissif pour les pages commerciales. **Les 324 URL présentes dans le sitemap ont toutes répondu HTTP 200 lors du contrôle avec un client HTTP standard.** Elles possédaient chacune un titre, une meta description et un H1. Aucun doublon exact de titre ou de description, JSON-LD syntaxiquement invalide ou meta robots noindex n’a été détecté dans cet ensemble. Les alternates examinés à l’intérieur de cet ensemble étaient réciproques.

Cela ne prouve ni l’indexation Google, ni le classement, ni la présence dans les réponses IA. **La cause réelle d’une visibilité organique insuffisante ne peut pas être attribuée sans Search Console et les journaux d’exploration.**

Les priorités sont concrètes :

1. Examiner immédiatement le **403 reçu avec un user-agent Googlebot simulé**. C’est une observation réseau réelle, mais le blocage des IP Google authentiques reste à confirmer.
2. Corriger les **canonicals/hreflang de la politique de réservation vers trois URL 404**.
3. Séparer les **pannes Supabase des absences de contenu**, et empêcher les sitemaps partiels en cas d’erreur.
4. Réparer les **pages de ville vides en HTTP 200** et la fraîcheur des pages Supabase sans revalidation.
5. Unifier **devises, acompte et informations pratiques** : ces contradictions compromettent autant la conversion que les réponses fiables des assistants IA.

**Comptage des constats :**

| Catégorie | Nombre |
|---|---:|
| Bugs/défauts confirmés B01–B19 | 19 |
| Risques nécessitant vérification R01–R08 | 8 |
| Opportunités O01–O07 | 7 |
| Total | 34 |

| Priorité | Bugs | Risques | Opportunités | Total |
|---|---:|---:|---:|---:|
| P0 — blocage critique démontré | 0 | 0 | 0 | 0 |
| P1 — priorité élevée | 8 | 3 | 0 | 11 |
| P2 — priorité moyenne | 11 | 5 | 4 | 20 |
| P3 — amélioration secondaire | 0 | 0 | 3 | 3 |

Un « bug confirmé » peut être **latent** : le chemin erroné est démontrable dans le code, mais ses conditions ne sont pas présentes dans les données publiques actuelles. B17–B19 sont explicitement de cette nature. Les 19 défauts ne signifient pas 19 incidents observés en production. Les niveaux P1 incluent des risques à investiguer, pas seulement des dysfonctionnements avérés.

**Méthode et limites de couverture.** Inventaire récursif des sources applicatives, composants, utilitaires, dictionnaires, migrations et ressources publiques; analyse des routes, métadonnées, JSON-LD, lectures Supabase et parcours de contact. Contrôle automatique des 324 URL du sitemap, complété par des URL hors sitemap, redirections, ressources cassées et plusieurs user-agents. Lecture éditoriale approfondie d’un échantillon de guides et modèles, et non vérification factuelle exhaustive des 186 articles traduits. Les dépendances tierces et les fichiers générés ne sont pas traités comme du code métier à auditer ligne par ligne.

Les références `fichier:ligne` sont relatives à la racine indiquée ci-dessus, dans l’état du dépôt au moment de l’audit. Les URL publiques constituent une seconde preuve indépendante. Aucun fichier .env ni secret n’a été affiché ou utilisé pour interroger la base.

## 2. Architecture du projet

**Stack vérifiée sur les paquets installés :** Next.js 16.4.3, React 19.2.4, next-intl 4.13.7 et supabase-js 2.115.0; TypeScript et Tailwind CSS 4. Le build utilise webpack. Le projet n’active pas `cacheComponents` dans next.config.ts. Les guides fournis par cette version dans `node_modules/next/dist/docs/` ont été consultés, notamment métadonnées, sitemap, cache sans Cache Components, generateStaticParams, not-found et Image. Les conclusions ne supposent pas les conventions d’une ancienne version de Next.js.

**Vue du crawler :** un GET public passe par la couche CDN, les redirections de domaine et `src/proxy.ts`, puis le routage next-intl réécrit vers `src/app/[locale]`. L’anglais n’a pas de préfixe, le français utilise /fr, l’espagnol /es. Les Server Components lisent les dictionnaires et Supabase avant de construire le HTML. Les composants client ajoutent les interactions, mais ne font pas disparaître automatiquement leur rendu initial côté serveur.

`src/i18n/routing.ts:4` définit en/fr/es, `localePrefix: "as-needed"` et `alternateLinks: false`. Ce dernier réglage supprime les alternates automatiques de next-intl; les pages construisent elles-mêmes leurs balises. Le layout fournit `metadataBase`, des robots index/follow, les polices locales produites par next/font, le header/footer et `html lang={locale}`. Pas de canonical global vers l’accueil : point positif.

**Inventaire complet des modèles de routes publiques.** Les paramètres {slug} désignent le slug de la langue concernée; {city} est généralement une clé comme marrakech, fes, casablanca ou tangier. Il n’existe pas de modèle de destination autonome distinct des pages par ville et des guides.

| Modèle source sous src/app/[locale] | URL EN | URL FR | URL ES | Rendu/cache établi |
|---|---|---|---|---|
| page.tsx | / | /fr | /es | Prérendu, sans ISR temporelle; HTML de production caché longuement |
| tours/page.tsx | /tours | /fr/circuits | /es/tours | Prérendu, ISR 86 400 s |
| tours/[slug]/page.tsx | /tours/{slug} | /fr/circuits/{slug} | /es/tours/{slug} | generateStaticParams + ISR 86 400 s |
| tours/from/[city]/page.tsx | /tours/from/{city} | /fr/circuits/depuis/{city} | /es/tours/desde/{city} | Déclaration 86 400 s, mais réponse observée dynamique/no-store |
| day-trips/page.tsx | /day-trips | /fr/excursions | /es/excursiones | Prérendu, ISR 86 400 s |
| day-trips/[slug]/page.tsx | /day-trips/{slug} | /fr/excursions/{slug} | /es/excursiones/{slug} | generateStaticParams + ISR 86 400 s |
| activities/page.tsx | /activities | /fr/activites | /es/actividades | Prérendu sans revalidation temporelle |
| activities/[slug]/page.tsx | /activities/{slug} | /fr/activites/{slug} | /es/actividades/{slug} | generateStaticParams, sans revalidation temporelle |
| customize-your-tour/page.tsx | /customize-your-tour | /fr/personnalisez-votre-circuit | /es/personaliza-tu-tour | Prérendu, contenu dictionnaires |
| blog/page.tsx | /blog | /fr/blog | /es/blog | Prérendu, ISR 86 400 s, 6 articles/page |
| blog/[slug]/page.tsx | /blog/{slug} | /fr/blog/{slug} | /es/blog/{slug} | generateStaticParams + ISR 86 400 s |
| blog/page/[number]/page.tsx | /blog/page/{number} | /fr/blog/page/{number} | /es/blog/page/{number} | Déclaration ISR; /blog/page/2 observé dynamique/no-store |
| about/page.tsx | /about | /fr/a-propos | /es/sobre-nosotros | Prérendu |
| about/booking-policy/page.tsx | /about/booking-policy | /fr/a-propos/politique-reservation | /es/sobre-nosotros/politica-reserva | Prérendu; canonical erroné |
| about/morocco_tourist/page.tsx | /about/morocco-tourist | /fr/a-propos/tourisme-maroc | /es/sobre-nosotros/turismo-marruecos | Prérendu; nom source différent du chemin public |
| contact/page.tsx | /contact | /fr/contact | /es/contacto | Prérendu; formulaire interactif |
| favorites/page.tsx | /favorites | /fr/favoris | /es/favoritos | Prérendu vide/utilitaire, bloqué par robots |
| offers/page.tsx | /offers | /fr/offers* | /es/offers* | Brouillon prérendu; aucune entrée dédiée dans routing.pathnames |

*Les variantes /offers FR/ES résultent du segment App Router non traduit; elles sont inventoriées depuis le dépôt, pas vérifiées individuellement en HTTP.*

Autres points d’entrée : `[...rest]/page.tsx` appelle notFound(); `POST /api/contact` est un Route Handler Node.js qui envoie un e-mail via SMTP; `/sitemap.xml` est généré par `src/app/sitemap.ts`; `/robots.txt` et `/llms.txt` sont des fichiers publics statiques; favicon, icône Apple, logo et images sont servis comme ressources. Aucun panneau admin ni API publique de catalogue/réservation n’est présent dans les routes inspectées. L’exclusion /admin du proxy ne constitue pas une authentification.

**Données :** quatre tables, `posts`, `activities`, `day_trips` et `tours`; colonnes JSONB en/fr/es pour titres, slugs, métadonnées et contenu. Les requêtes principales filtrent published=true. Les circuits utilisent une pagination interne par tranches de 500 et une validation des titres/slugs. Les autres lecteurs ont des garanties plus faibles. Tours et excursions ont created_at/updated_at et des triggers de mise à jour; posts/activities n’ont pas de updated_at dans les migrations fournies. Les prix numériques n’ont pas de colonne de devise dans ces schémas.

**Contenu initial :** les fiches montrent titre, description, prix, inclusions/exclusions et contenu avant interaction. Le blog injecte son corps HTML côté serveur. Les FAQ restent dans le DOM, cachées par CSS; les descriptions d’itinéraire sont rendues mais portent `hidden` quand les panneaux sont fermés. Il serait faux de les qualifier globalement de « contenu chargé uniquement après clic ». En revanche, un humain sans JS ne peut pas ouvrir ces panneaux. Les formulaires possèdent labels/id/name, types email/tel, required et états de chargement; leur envoi dépend du JavaScript.

**Cache observé et publication :**

- Le manifeste .next préexistant indique false pour accueil/activités et 86 400 pour les familles blog, tours et excursions. Cet artefact confirme un comportement local antérieur, sans prouver qu’il correspond au commit déployé.
- Les en-têtes publics corroborent cette distinction : accueil/activités `s-maxage=31536000`; fiches blog/tours/excursions `s-maxage=86400, stale-while-revalidate=31449600`; pagination blog et pages par ville `private, no-cache, no-store...`.
- Un `revalidate` déclaré n’est pas à lui seul la preuve qu’une page est effectivement mise en cache. Aucune instrumentation n’établit ici le nombre exact de requêtes Supabase par visite.
- generateStaticParams n’est pas réexécuté à chaque ISR. Aucune option dynamicParams=false n’a été trouvée : une nouvelle URL peut être rendue à la demande, mais ce parcours n’a pas été testé en créant une publication.
- Un nouveau blog peut entrer dans le sitemap à la prochaine régénération après 120 s, dans la liste après son cycle ISR et dans les recommandations après leur propre cache. L’accueil sans revalidation peut rester en retard. Les liens contextuels du corps des articles doivent être édités séparément.
- Un retrait de publication ne purge pas automatiquement un rendu déjà mis en cache. Définir un délai de retrait acceptable et une invalidation cohérente fait partie de B03.

**Vérifications exécutées :**

| Contrôle | Résultat / portée |
|---|---|
| TypeScript : node node_modules/typescript/bin/tsc --noEmit --incremental false | Réussi; aucune sortie ni émission de fichier |
| ESLint sur src, sans cache ni --fix | 4 erreurs no-explicit-any, 0 warning; voir O07 |
| Nouveau build | Non exécuté : il écrirait des artefacts et dépendrait du réseau; utilisation du manifeste existant et du HTML public |
| Tests automatiques métier existants | Aucun script de test dans package.json |
| Comparaison dictionnaires | JSON valides; FAQ EN contient 8 entrées contre 6 FR/ES, différence éditoriale et non erreur de clé à elle seule |
| Site en navigateur interactif / viewport mobile | Pas de validation visuelle ni d’audit Playwright/Lighthouse dans cette session |
| État Git avant rapport | Propre lors des contrôles |

**Journal de vérification publique.** Tests GET sans session utilisateur; contrôle des 324 URL avec au maximum trois requêtes simultanées. Les réponses ont été analysées sans exécuter JavaScript : statut final, title, description, H1, canonical, alternates, robots et parsing JSON-LD. Le contrôle des alternates porte sur les cibles présentes dans l’ensemble testé, pas sur chaque lien de chaque article.

| Ressource / groupe | Résultat observé |
|---|---|
| /robots.txt | 200; règles identiques à la source sur les directives examinées |
| /sitemap.xml | 200, application/xml, 33 557 octets, 324 URL uniques, 108 par langue |
| Répartition par langue | 9 pages fixes + 21 circuits + 6 excursions + 6 activités + 62 articles + 4 villes = 108 |
| Toutes les 324 URL du sitemap, client standard | 324 réponses 200; aucun title/description vide, H1 absent/multiple, noindex ou JSON-LD non parsable détecté |
| Canonicals des URL du sitemap | Une discordance hors normalisation du slash final : /about → /en/about |
| Réciprocité hreflang dans cet ensemble | Aucune discordance détectée |
| /blog/page/2 | 200; canonical propre à la page 2 |
| /blog/page/9999 et /audit-page-inexistante | 404 avec noindex |
| /tours/from/audit-ville-inexistante et /tours/from/agadir | 200 indexable, sans circuit |
| /offers et /favorites | 200, titre générique, index/follow |
| Trois pages de politique de réservation | Pages 200, mais leurs canonicals cibles répondent 404 |
| /images/hero.jpeg et /images/logofooter.jpeg | 404 |
| /llms.txt | 200; texte identique au local après normalisation CRLF/LF et espaces finaux |
| HTTP domaine nu | 301 vers HTTPS |
| HTTPS www | 308 vers domaine nu |
| HTTP www | 301 vers HTTPS www puis 308 vers domaine nu : deux étapes |
| /tours/ | 308 vers /tours |
| /en/tours et /en/about | 307 vers versions sans /en |
| / avec Accept-Language: fr-FR | 307 vers /fr |
| Googlebot simulé desktop/mobile | Accueil et sitemap 403; robots.txt 200 |
| OAI-SearchBot, Claude-SearchBot, PerplexityBot simulés | Fiche de circuit échantillonnée 200 |

Les tests ne révèlent pas de divergence majeure entre code et production sur les fonctionnalités examinées : erreurs de canonical, images et devises s’y retrouvent. La réponse dynamique de certaines routes malgré revalidate et le filtre Googlebot relèvent du comportement effectif à documenter, pas d’une preuve de code différent. Aucun identifiant de déploiement n’a permis de certifier l’égalité exacte dépôt/production.

## 3. Problèmes critiques empêchant potentiellement l’indexation Google

Aucun blocage général P0 n’est démontré : le client standard reçoit toutes les URL du sitemap. Les défauts ci-dessous peuvent altérer l’exploration ou les signaux d’indexabilité, sans prouver une exclusion Google actuelle. Le contrôle Googlebot est la première investigation infrastructure à mener.

### R01 — Refus Googlebot simulé par la couche publique (P1, risque à vérifier)

**Fichier / ligne :** `Infrastructure CDN hors dépôt`; `contexte src/proxy.ts:4`; `public/robots.txt:4`.

**Problème et preuve :** UA Googlebot desktop/mobile: / et /sitemap.xml 403; /robots.txt 200; serveur hcdn. UA standard et robots IA testés: 200.

**Impact :** Si les IP Google authentiques sont aussi refusées, découverte et indexation gravement compromises; cela n’est pas établi.

**Correction recommandée :** Vérifier inspection URL en direct et logs CDN; authentifier les IP Google; ajuster seulement la règle fautive.

**Vérification :** Search Console et requêtes Google authentifiées doivent recevoir 200; un UA seul ne prouve rien.

### B01 — Erreur de lecture confondue avec une absence (P1, bug confirmé)

**Fichier / ligne :** `src/lib/supabase/blogs.ts:130`; `src/lib/supabase/activities.ts:130`; `src/lib/supabase/day_trips.ts:192`; `src/lib/supabase/tours.ts:321`.

**Problème et preuve :** Les erreurs retournent null; les pages appellent notFound().

**Impact :** Une panne peut produire une fausse 404 et retirer temporairement une page utile.

**Correction recommandée :** Lever une erreur typée sur panne; réserver notFound() aux contenus réellement absents; préserver le dernier rendu valide.

**Vérification :** Simuler erreur et absence en environnement de test; vérifier respectivement réponse d’erreur et 404, sans pollution du cache.

### B02 — Sitemap incomplet présenté comme réussi après erreur (P1, bug confirmé)

**Fichier / ligne :** `src/app/sitemap.ts:34`; `src/lib/supabase/blogs.ts:162`; `src/lib/supabase/activities.ts:181`; `src/lib/supabase/day_trips.ts:241`; `src/lib/supabase/tours.ts:197`.

**Problème et preuve :** Retours [] et fail() qui journalise sans lever; readRows peut retourner une liste partielle.

**Impact :** Le sitemap 200 peut perdre une famille ou une partie des URL publiées.

**Correction recommandée :** Faire échouer atomiquement la génération; conserver une dernière version valide; alerter sur variation anormale du nombre d’URL.

**Vérification :** Faire échouer une famille et une page intermédiaire; vérifier qu’aucun sitemap partiel n’est publié.

### B04 — Villes inexistantes indexables en HTTP 200 (P1, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/tours/from/[city]/page.tsx:142`.

**Problème et preuve :** if(!tours) ne détecte pas []; /tours/from/audit-ville-inexistante répond 200 index, follow.

**Impact :** Espace illimité de pages vides, risque de soft 404 et mauvaise expérience depuis les liens Agadir.

**Correction recommandée :** Valider les villes disponibles; traiter tableau vide; distinguer ville inexistante et catalogue temporairement vide.

**Vérification :** Tester ville réelle, ville absente et panne Supabase; vérifier statut, robots et absence d’hreflang vers des villes inexistantes.

### B05 — Canonical et hreflang de réservation vers des 404 (P1, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/about/booking-policy/page.tsx:410`; `src/i18n/routing.ts:88`.

**Problème et preuve :** /about/booking-policy déclare /booking-policy; même omission du parent en FR et ES; trois cibles testées en 404.

**Impact :** Signaux contradictoires sur une page de confiance; alternates inutilisables.

**Correction recommandée :** Construire toutes les URL avec getPathname et /about/booking-policy; corriger aussi og:url.

**Vérification :** Les trois canonicals doivent être les URL finales 200 et les alternates réciproques.


**Précision Googlebot.** Le user-agent peut être usurpé et un CDN peut bloquer justement les requêtes prétendant provenir de Google hors de ses IP. Les tests de cette session ne viennent pas d’une IP Google authentifiée. Conserver les horodatages, chemins, codes HTTP et motifs de blocage côté CDN; comparer avec l’outil d’inspection d’URL et les IP vérifiées. Ne pas désactiver globalement la protection anti-bot sur cette seule base. [Référence officielle Google sur les crawlers et leur authentification](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

**Erreurs et streaming.** notFound() peut intervenir avant ou après le début du streaming; il faut donc contrôler le statut effectif et le noindex, pas promettre systématiquement un 404 dans tous les chemins. Les erreurs « contenu absent » testées hors villes ont bien renvoyé 404. Aucun 500/502/503 n’a été observé dans le crawl standard; aucune panne de base n’a été provoquée.

## 4. Bugs SEO techniques

### B06 — Canonical anglais /en/about redirigé (P2, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/about/page.tsx:100`.

**Problème et preuve :** /about répond 200 mais canonical /en/about, lequel répond 307 vers /about; hreflang en pointe /about.

**Impact :** Canonical contraire à la stratégie sans préfixe anglais.

**Correction recommandée :** Utiliser getPathname avec /about et locale en.

**Vérification :** GET /about: canonical auto-référent, cible 200, identique à hreflang en.

### B11 — Page de brouillon publique et indexable (P2, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/offers/page.tsx:3`; `src/app/[locale]/layout.tsx:46`.

**Problème et preuve :** /offers renvoie 200, texte morocco student trips, titre générique, sans H1 ni canonical.

**Impact :** Page pauvre qui peut être découverte malgré son absence du sitemap.

**Correction recommandée :** Retirer la route publique tant qu’elle est inachevée, ou publier une vraie page; noindex temporaire si elle doit rester accessible.

**Vérification :** GET /offers et variantes: comportement choisi explicite, aucun brouillon indexable.

### B12 — Favoris sans noindex et lien vers une page vide (P2, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/favorites/page.tsx:3`; `public/robots.txt:29`; `src/app/[locale]/layout.tsx:46`.

**Problème et preuve :** /favorites répond index, follow, titre générique; robots bloque son exploration mais pas nécessairement son indexation par URL.

**Impact :** URL utilitaire susceptible d’apparaître sans contenu utile; fonctionnalité inachevée.

**Correction recommandée :** Définir noindex sur toutes les variantes; permettre sa lecture pour prendre en compte ce signal, ou retirer la route et les liens si inutilisés.

**Vérification :** Vérifier HTML noindex, règles robots compatibles et comportement utilisateur des favoris.

### B16 — Une panne des slugs alternatifs suffit à faire disparaître une excursion valide (P2, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/day-trips/[slug]/page.tsx:157`.

**Problème et preuve :** if(!trip || !alternateSlugs) notFound(), bien que trip soit déjà chargé.

**Impact :** Couplage inutile: une lecture secondaire peut transformer une fiche valide en 404.

**Correction recommandée :** La fiche dépend seulement de trip; omettre les alternates indisponibles et journaliser leur erreur.

**Vérification :** Faire échouer uniquement la lecture des alternates; la fiche doit rester accessible avec canonical correct.

### B17 — Critères d’éligibilité différents entre sitemap, alternates et fiches (P2, bug confirmé)

**Fichier / ligne :** `src/lib/supabase/blogs.ts:156`; `src/lib/supabase/activities.ts:175`; `src/lib/supabase/day_trips.ts:234`; `src/components/seo/BlogSeo.tsx:95`.

**Problème et preuve :** Slugs non vides suffisent aux listes; fiches exigent aussi titre, et contenu pour activités. workTranslation construit toutes les URL même avec slug null/manquant.

**Impact :** Une traduction incomplète peut être annoncée puis répondre 404, ou produire /null; cas latent, non observé sur les 324 URL actuelles.

**Correction recommandée :** Partager une validation de publication par langue entre listes, sitemap, metadata et graphe; filtrer chaque workTranslation.

**Vérification :** Fixtures avec slug seul, titre vide, contenu absent et traduction null: aucune URL invalide annoncée.

### R04 — Plafonds et unicité des slugs non garantis à grande échelle (P2, risque à vérifier)

**Fichier / ligne :** `supabase/config.toml:18`; `src/lib/supabase/blogs.ts:156`; `src/lib/supabase/activities.ts:175`; `src/lib/supabase/day_trips.ts:234`; `src/lib/supabase/tours.ts:279`.

**Problème et preuve :** max_rows local 1000; pas de pagination dans trois lecteurs de slugs; liste activités limitée à 12, ville à 10; index slugs non uniques.

**Impact :** Omissions futures ou sélection arbitraire en présence de doublons; aucun dépassement actuel démontré.

**Correction recommandée :** Pagination stable, contraintes d’unicité partielles par langue après audit des doublons, navigation paginée quand utile.

**Vérification :** Fixtures dépassant chaque seuil; égalité entre nombre attendu et URL/cartes découvertes, doublons rejetés.

### O01 — Sitemap plus fidèle aux publications et pages de confiance (P2, opportunité)

**Fichier / ligne :** `src/app/sitemap.ts:15`; `src/lib/supabase/blogs.ts:23`.

**Problème et preuve :** Pas de politique de réservation, lastmod ni alternates XML; 324 URL, loin des limites.

**Impact :** Meilleurs signaux de découverte et de fraîcheur; absence d’alternates XML non bloquante si HTML correct.

**Correction recommandée :** Ajouter la politique après correction; dates de changement réelles; alternates optionnels, sans date artificielle à chaque génération.

**Vérification :** Comparer catalogue publié et sitemap; dates stables sans modification; limite 50 000 URL/50 Mo respectée.


Les URL relatives de metadata ne sont pas en elles-mêmes un défaut : metadataBase les transforme en URL absolues. Les versions FR/ES testées sont auto-canoniques, pas canonicalisées globalement vers l’anglais. La pagination valide dispose d’un canonical propre et de liens HTML réels. La page 1 utilise redirect vers /blog; le code vérifie ensuite les autres formats numériques. Le retour 307 de /en n’est pas un blocage démontré.

robots.txt contient un seul groupe partagé de user-agents, Allow: / et des exclusions API/admin/favoris; aucune exclusion des catalogues ou du blog. Le sitemap déclaré utilise le domaine HTTPS attendu. Les ressources _next ne sont pas bloquées. Robots n’est ni un mécanisme d’authentification, ni une garantie de désindexation : Google doit pouvoir lire noindex pour l’appliquer. [Documentation officielle noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Canonical, redirection et sitemap doivent converger vers les URL finales, particulièrement pour À propos et la politique de réservation. Google peut ignorer une préférence canonique contradictoire : ce n’est pas une instruction absolue ni une preuve de désindexation. [Documentation officielle canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Le sitemap actuel est petit, dédupliqué et contient les trois langues. L’absence de lastmod est préférable à une fausse date de modification systématique. Son exhaustivité vis-à-vis de toutes les lignes publiées en base reste inconnue : aucune connexion à la base privée n’a été utilisée. Les trois politiques de réservation sont omises du tableau STATIC_PATHS. Les pages de pagination peuvent être découvertes par leurs liens; leur absence du sitemap n’est pas considérée comme un bug.

## 5. Problèmes de contenu et de référencement

### B07 — Devise contradictoire entre cartes et fiches (P1, bug confirmé)

**Fichier / ligne :** `src/components/sections/activities/ActivityCard.tsx:187`; `src/components/sections/day_trips/daytripCard.tsx:141`; `src/app/[locale]/activities/[slug]/page.tsx:255`; `src/app/[locale]/day-trips/[slug]/page.tsx:226`; `src/components/seo/seoActivities.ts:11`.

**Problème et preuve :** Cartes $; fiches €; même valeur numérique issue du même champ price; activités JSON-LD EUR. Exemple montgolfière 165, Ourika 99.99.

**Impact :** Voyageurs et IA ne peuvent déterminer le prix fiable; risque commercial direct.

**Correction recommandée :** Décider la devise réelle; stocker currency avec price; partager le formatage et les conditions tarifaires; ne pas convertir seulement le symbole.

**Vérification :** Comparer carte, fiche, devis, blog pertinent et Offer dans les trois langues.

### B08 — Conditions de réservation contradictoires (P1, bug confirmé)

**Fichier / ligne :** `src/messages/en.json:243`; `src/messages/fr.json:236`; `src/messages/es.json:241`; `src/app/[locale]/about/booking-policy/page.tsx:87`.

**Problème et preuve :** Sur mesure: acompte 20%; politique: 150 € requis, sans exception explicite. Préavis de 15 jours et remboursement non borné méritent clarification.

**Impact :** Réponses IA et décisions de réservation ambiguës.

**Correction recommandée :** Faire valider la règle commerciale puis la centraliser; expliciter les exceptions par produit et les délais de remboursement/changement.

**Vérification :** Comparer les pages sur mesure, politique et modèles de devis dans les trois langues.

### B09 — Information erronée sur la frontière algérienne (P1, bug confirmé)

**Fichier / ligne :** `src/messages/en.json:185`; `src/messages/fr.json:178`; `src/messages/es.json:183`; `src/app/[locale]/about/morocco_tourist/page.tsx:85`.

**Problème et preuve :** Le texte annonce des routes terrestres rouvertes; la référence officielle FCDO consultée indique une frontière terrestre et maritime fermée.

**Impact :** Conseil de voyage trompeur; forte perte de fiabilité pour les citations.

**Correction recommandée :** Corriger les trois langues avec source officielle et date de vérification; revoir les autres informations changeantes.

**Vérification :** Comparer le rendu aux conseils officiels et vérifier l’absence de l’affirmation dans les trois versions.

### B13 — Comptages de circuits inventoriés en dur, dont Agadir sans offre (P2, bug confirmé)

**Fichier / ligne :** `src/components/sections/Home/Destinations.tsx:5`; `src/components/Layout/Footer.tsx:21`.

**Problème et preuve :** Agadir annonce 6+ tours mais page vide et aucun groupe Agadir au sitemap; Fes 12+, Marrakech 24+ sont constants.

**Impact :** Promesse de catalogue non fiable, parcours vide, mauvaise extraction par les IA.

**Correction recommandée :** Calculer les nombres sur les offres publiées disponibles par langue; masquer ou expliquer les destinations sans circuit.

**Vérification :** Comparer comptes affichés, catalogue et résultat Supabase autorisé par locale.

### R08 — Chevauchement éditorial, fraîcheur et conseils évolutifs (P2, risque à vérifier)

**Fichier / ligne :** `src/app/[locale]/blog/[slug]/page.tsx:184`; `src/lib/supabase/blogs.ts:23`; `src/messages/en.json:97`.

**Problème et preuve :** Articles commerciaux proches des fiches, liens de recommandation génériques Marrakech, pas de updated_at blog; conseils passeport/visa sans source contextuelle.

**Impact :** Cannibalisation possible, incohérences d’itinéraire/prix et conseils datés; aucun effet de ranking établi.

**Correction recommandée :** Comparer requêtes/URL Search Console; attribuer une intention à chaque page; révision humaine et sources officielles datées.

**Vérification :** Matrice intention→URL, comparaison des itinéraires, analyse Search Console; aucune suppression massive sans preuve.

### O04 — Expertise locale et réponses vérifiables à renforcer (P2, opportunité)

**Fichier / ligne :** `src/app/[locale]/about/page.tsx:208`; `src/app/[locale]/blog/[slug]/page.tsx:240`; `src/components/seo/BlogSeo.tsx:234`.

**Problème et preuve :** Équipe nommée sur À propos; auteur des articles reste l’organisation; bonnes réponses rapides déjà présentes dans plusieurs guides.

**Impact :** Différenciation et citabilité améliorables par preuve et contexte.

**Correction recommandée :** Identifier le rédacteur/relecteur réel, date de révision, photos originales, tableaux de route et conditions tarifaires sourcées.

**Vérification :** Vérifier chaque affirmation et responsabilité; comparer un échantillon de questions avant/après sans promettre de citation.


Pour B09, la contradiction est fondée sur la [page officielle FCDO sur les risques régionaux au Maroc](https://www.gov.uk/foreign-travel-advice/morocco/regional-risks), consultée le jour de l’audit. Elle suffit à invalider l’affirmation de réouverture; elle ne constitue pas une vérification de toutes les autres données géographiques, statistiques ou réglementaires du site.

**Qualité constatée.** L’accueil expose clairement la marque, l’activité et les départs; les fiches de circuit comportent des itinéraires, inclusions, exclusions et CTA. Les cinq guides échantillonnés proposent des réponses directes et des comparaisons utiles. Il serait inexact de qualifier globalement le blog de contenu vide ou de recommander des FAQ partout sans tenir compte de celles déjà présentes.

**Faiblesses éditoriales spécifiques :**

- Le H1 anglais de l’accueil combine la marque et une expression de recherche de façon peu naturelle (`src/messages/en.json`, section Hero; rendu /). Réécrire pour un voyageur plutôt que répéter la requête; aucune densité optimale de mots-clés n’est prescrite.
- Les H1 des listes restent génériques, mais chaque page du sitemap en possède exactement un lors du scan. Les H2/H3 issus du corps Supabase doivent être validés à l’édition; le filtre `fixDuplicateBlogHeading` ne gère que le premier H2 strictement identique au titre.
- Le guide des prix distingue explicitement fourchettes de marché et tarifs de l’agence : bon point à conserver. Le guide « 3 days » affiche aussi un prix propre au billet; il doit être réconcilié avec les conditions de la fiche et le devis, sans supposer qu’il s’agit du même périmètre.
- La page Maroc contient des données touristiques chiffrées et des règles d’entrée qui nécessitent des sources et dates; une éventuelle erreur de visa/passeport n’a pas été classée comme confirmée ici. La relecture doit préciser nationalité, type de passeport et date.
- Les textes de politique indiquent un remboursement et un préavis sans détailler toutes les exceptions. Clarifier la règle commerciale, sans présenter cet audit comme une consultation juridique.
- Les images disposent généralement d’un alt ou d’un secours par le titre. Les colonnes alt communes aux langues, des libellés anglais fixes et des éventuels alt vides constituent des points de revue éditoriale, pas une preuve de pénalité.

**Intentions et autorité thématique.** Exploiter les pages déjà présentes plutôt que multiplier des articles très proches :

| Intention / thème | Page principale à privilégier | Rôle des contenus de soutien |
|---|---|---|
| Marrakech desert tours | Hub /tours/from/marrakech, puis fiche précise | Choix 2/3/4/5 jours, temps de route et contraintes |
| Merzouga / Sahara | Fiches Merzouga par départ et durée | Erg Chebbi, camp, saison, bagages, attentes réalistes |
| Morocco private tours / itinéraires | /tours et fiches longues depuis Casablanca/Tangier | Comparaison rythme, étapes, coût, profil voyageur |
| Marrakech to Fes | Fiches traversée dans le bon sens | Différence transfert direct / circuit désert; trajet retour distinct |
| Atlas Mountains | Excursions Ourika/Aït Ben Haddou et guides Atlas | Niveau de marche, météo, points de départ, inclusions |
| Day trips from Marrakech | /day-trips et fiches Ourika/Ouzoud/Aït Ben Haddou | Tableau des durées, accès et options réelles |
| Familles | Guide famille existant + sélection de fiches adaptées | Longues journées, sièges enfants, rythme, âge et conditions confirmées |

La concurrence entre deux URL pour les mêmes requêtes reste une hypothèse R08. Vérifier impressions, clics, requêtes et pages sur une période comparable dans Search Console avant fusion, redirection ou suppression. Les recommandations de tours au bas de chaque blog sont toujours trois circuits Marrakech : ajouter des liens thématiques réels dans le corps, notamment pour Fes, Casablanca et Atlas.

## 6. Problèmes multilingues

### B14 — Fragments de navigation et CTA dans la mauvaise langue (P2, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/activities/[slug]/page.tsx:213`; `src/app/[locale]/activities/[slug]/page.tsx:264`; `src/app/[locale]/day-trips/[slug]/page.tsx:191`; `src/app/[locale]/blog/[slug]/page.tsx:308`.

**Problème et preuve :** Accueil, Réserver cette activité et À partir de restent français sur fiches EN/ES; More Blogs/View all/All tours restent anglais.

**Impact :** Compréhension et confiance dégradées; HTML lang correct mais contenu mixte.

**Correction recommandée :** Passer ces chaînes et les descriptions de secours par les dictionnaires; traduire aussi les libellés d’accessibilité pertinents.

**Vérification :** Lire les trois rendus sans JavaScript et contrôler les libellés ainsi que les métadonnées de secours.

### B18 — Cartes blog/activités sans filtre de traduction exploitable (P2, bug confirmé)

**Fichier / ligne :** `src/lib/supabase/blogs.ts:74`; `src/lib/supabase/activities.ts:95`.

**Problème et preuve :** Le filtre published est présent, mais aucun contrôle titre/slug avant map; JSONB par défaut {} possible.

**Impact :** Une publication partiellement traduite peut générer carte vide ou lien invalide; cas latent non démontré en production.

**Correction recommandée :** Filtrer titre et slug utilisables avant count/range/limit, puis valider les objets.

**Vérification :** Publier une fixture uniquement EN: absence de carte et de pagination fantôme en FR/ES.

### B19 — Changement de langue incorrect quand la traduction manque (P2, bug confirmé)

**Fichier / ligne :** `src/components/ui/LanguageSwitcher.tsx:58`; `src/lib/supabase/tours.ts:457`.

**Problème et preuve :** targetSlug = alternateSlugs?.[newLocale] ?? currentSlug; null réutilise le slug source, chaîne vide reste vide.

**Impact :** Navigation vers une URL invalide ou non équivalente; latent si une traduction manque.

**Correction recommandée :** Ne proposer que les traductions disponibles; prévoir un lien explicite vers la liste localisée si nécessaire.

**Vérification :** Tester slug absent, vide et null, navigation successive et retour navigateur.

### R05 — Origine publique définie de plusieurs façons (P2, risque à vérifier)

**Fichier / ligne :** `src/app/[locale]/layout.tsx:37`; `src/app/[locale]/blog/[slug]/page.tsx:55`; `src/app/sitemap.ts:13`; `src/components/seo/TourSeoJsonLd.tsx:9`.

**Problème et preuve :** BASE_URL, SITE_URL et domaine codé en dur coexistent; valeurs d’environnement non lues.

**Impact :** Divergence possible canonical/sitemap/graphe ou indexation d’un domaine de préproduction; non observée sur le domaine testé.

**Correction recommandée :** Centraliser une origine HTTPS validée et une stratégie explicite pour la préproduction.

**Vérification :** Comparer toutes les familles d’URL sur production et préproduction sans afficher les variables secrètes.


**Ce qui fonctionne :** en/fr/es dans html lang, métadonnées propres aux langues, chemins FR/ES traduits, slugs distincts fournis par Supabase, x-default anglais dans les modèles examinés. Les hreflang des 324 URL contrôlées sont réciproques au sein de cet ensemble. Le site n’a pas besoin de traduire à tout prix les clés de ville (fes, tangier) si elles restent stables et les libellés sont corrects.

**Points à distinguer :** B05 concerne des cibles réellement fausses; B17/B18 des traductions incomplètes possibles; B19 un parcours utilisateur latent. La différence de longueur des FAQ entre langues n’est pas automatiquement un défaut. Il faut adapter utilement le contenu à chaque audience.

La redirection / → /fr avec Accept-Language français est observée. C’est le comportement de détection de locale, pas une redirection imposée à tous les visiteurs. Vérifier que les URL explicitement localisées restent accessibles sans dépendre des cookies; le crawl standard en fournit déjà une preuve partielle. Les liens HTML de langue sont recommandés en O05 pour rendre ce choix plus explicite aux utilisateurs et agents.

Les liens intégrés dans le HTML Supabase ne passent pas par next-intl : le serveur les restitue tels quels. Les équivalents locaux des liens éditoriaux doivent donc être contrôlés dans la base. Une erreur générale de ces liens FR/ES n’est pas établie par les métadonnées seules.

## 7. Problèmes de données structurées

### B10 — Images d’agence inexistantes dans le JSON-LD (P2, bug confirmé)

**Fichier / ligne :** `src/components/seo/ContactJsonLd.tsx:61`.

**Problème et preuve :** /images/hero.jpeg et /images/logofooter.jpeg absents du dépôt et HTTP 404 en production.

**Impact :** Entité d’agence associée à des images inaccessibles.

**Correction recommandée :** Employer les fichiers réels /images/hero.jpg et /logo.png, après validation de leur pertinence.

**Vérification :** GET des URL d’images en 200 avec type image; recontrôler le graphe contact.

### B15 — Propriétés Schema.org mal modélisées sur activités (P2, bug confirmé)

**Fichier / ligne :** `src/components/seo/seoActivities.ts:64`; `src/components/seo/seoActivities.ts:80`.

**Problème et preuve :** Production: duration: 3-4 Hours sur TouristTrip; duration n’est pas dans ce domaine et attend une durée normalisée; subjectOf contient ItemList au lieu d’une œuvre ou d’un événement.

**Impact :** Graphe JSON syntaxiquement valide mais sémantique moins exploitable.

**Correction recommandée :** Placer les étapes dans itinerary; garder la durée humaine en HTML; n’ajouter un champ de durée que sur une entité/propriété compatible, sans inventer une valeur exacte pour un intervalle.

**Vérification :** Valider domaine, range et valeurs avec Schema.org Validator, puis comparer au HTML.

### R07 — Disponibilité et promesses commerciales sans source opérationnelle démontrée (P2, risque à vérifier)

**Fichier / ligne :** `src/components/seo/seoActivities.ts:75`; `src/app/[locale]/contact/page.tsx:25`; `src/messages/en.json:68`.

**Problème et preuve :** InStock constant; coordonnées et horaires 24h fixes; promesse Every trip includes...; pas d’inventaire de places/dates.

**Impact :** Une IA peut prendre une possibilité de devis pour une disponibilité confirmée.

**Correction recommandée :** Valider horaires, localisation et inclusions; retirer la disponibilité non justifiée; préciser sous réserve de confirmation.

**Vérification :** Validation métier documentée et concordance page, offre et réponse de réservation.

### O03 — Graphe d’entités à harmoniser sans promesse de rich result (P2, opportunité)

**Fichier / ligne :** `src/app/[locale]/day-trips/[slug]/page.tsx:169`; `src/components/seo/BlogSeo.tsx:276`; `src/app/[locale]/customize-your-tour/page.tsx:89`.

**Problème et preuve :** Excursions sans JSON-LD; agence sans @id sur certains modèles; breadcrumb posé sur BlogPosting; commentaires FAQ promettent à tort des snippets.

**Impact :** Relations agence→page→voyage moins homogènes.

**Correction recommandée :** Partager l’ID agence; relier WebPage, TouristTrip, Offer et BreadcrumbList; déplacer breadcrumb vers WebPage; corriger les commentaires obsolètes.

**Vérification :** Validation Schema.org et, uniquement pour types éligibles, Rich Results Test; concordance avec contenu visible.


**Inventaire JSON-LD :**

| Source | Types produits | Observation |
|---|---|---|
| src/app/[locale]/page.tsx:153 + Home/Faq.tsx:18 | TravelAgency, WebSite, WebPage, FAQPage | IDs communs agence/site; FAQ visible dans le DOM |
| src/components/seo/TourSeoJsonLd.tsx:166 | TravelAgency, WebSite, WebPage, TouristTrip, Offer imbriqué, BreadcrumbList, FAQPage | Graphe assez cohérent, USD identique à la fiche; contrôler domaines de propriétés |
| src/components/seo/BlogSeo.tsx:103 | Organization, WebSite, Blog, BlogPosting, BreadcrumbList, FAQPage | Auteur organisation; dateModified optionnel jamais fourni par la page actuelle; traductions à filtrer |
| src/components/seo/seoActivities.ts:52 | TouristTrip, Offer, FAQPage, BreadcrumbList | EUR, InStock constant, durée et subjectOf à corriger |
| src/components/seo/ContactJsonLd.tsx:43 | WebSite, TravelAgency, ContactPage, BreadcrumbList | Même @id agence, mais images 404 |
| src/app/[locale]/customize-your-tour/page.tsx:89 | TravelAgency, OfferCatalog, Offer, TouristTrip | Agence sans @id commun; ouverture sans bornes horaires dans ce bloc |
| src/app/[locale]/about/morocco_tourist/page.tsx:93 | Article, Organization, Country | Graphe minimal; image relative et absence d’ID page/langue/dates à améliorer |
| src/app/[locale]/day-trips/[slug]/page.tsx:169 | Aucun JSON-LD propre | HTML riche mais graphe absent; opportunité, pas obstacle d’indexation |

TravelAgency est un type spécialisé de commerce local : ajouter séparément LocalBusiness sans nécessité ne rend pas le graphe meilleur. TouristDestination n’est pas indispensable; l’ajouter seulement pour une destination réellement décrite, avec une relation utile au voyage.

La syntaxe JSON des scripts présents a pu être parsée sur les 324 pages. **Ce contrôle n’équivaut pas à une validation Schema.org, ni à un Rich Results Test.** B15 s’appuie sur le contrat des propriétés : [TouristTrip](https://schema.org/TouristTrip), [duration](https://schema.org/duration). Le champ duration d’une activité comme « 3-4 Hours » n’est pas corrigé en inventant PT3H sur un domaine incompatible. Conserver la plage exacte en texte et sélectionner une modélisation autorisée si utile. Les champs inLanguage/keywords directement posés sur TouristTrip dans le composant tours doivent également être examinés selon le vocabulaire choisi; la langue et les mots-clés peuvent déjà être portés par WebPage.

**Éligibilité Google, actualisée à la date de l’audit :** ne pas promettre un résultat enrichi « things to do » du seul fait de TouristTrip. Les commentaires dans seoActivities.ts:47 et :93 exagèrent ce bénéfice. En outre, Google indique que les résultats enrichis FAQ ne sont plus affichés depuis le 7 mai 2026; la documentation FAQ a ensuite été retirée. Conserver éventuellement FAQPage pour décrire fidèlement les réponses, sans objectif de snippet FAQ Google. [Journal officiel Google Search](https://developers.google.com/search/updates).

Aucun AggregateRating ni Review fabriqué n’a été repéré dans les générateurs inspectés. Cela ne vérifie pas des avis externes ou toutes les affirmations éditoriales en base. Ne pas ajouter des étoiles, nombres de clients, licences ou garanties non démontrés.

## 8. Problèmes GEO/AEO et compréhension par les agents IA

**Politiques robots.** public/robots.txt:4–25 autorise le contenu public pour tous les agents listés. Pas de blocage explicite d’OAI-SearchBot, GPTBot, ChatGPT-User, Googlebot, Google-Extended, PerplexityBot, ClaudeBot, Claude-SearchBot ou Claude-User. Les restrictions API/admin/favoris restent communes à ce groupe. Les droits de collecte et les choix d’entraînement sont une décision de l’éditeur; autoriser l’entraînement n’est pas nécessaire pour autoriser la recherche.

| Agent / contrôle | Fonction à distinguer | Lecture de la configuration actuelle |
|---|---|---|
| Googlebot | Exploration Google Search, dont fonctions IA de Search | Autorisé par robots; refus des requêtes simulées à investiguer |
| Google-Extended | Token de contrôle d’utilisation pour Gemini, dont entraînement et certains usages de grounding; pas un user-agent HTTP indépendant | Autorisé; ce n’est pas le contrôle d’indexation Google Search |
| OAI-SearchBot | Découverte pour ChatGPT Search | Autorisé; test simulé 200 sur une fiche |
| GPTBot | Collecte pouvant servir à l’entraînement | Autorisé, indépendant d’OAI-SearchBot |
| ChatGPT-User | Accès déclenché par un utilisateur | Autorisé dans le fichier; certaines actions utilisateur ne suivent pas nécessairement robots comme un crawl automatique |
| PerplexityBot | Recherche et liens Perplexity, pas entraînement de modèles de fondation | Autorisé; test simulé 200 sur une fiche |
| Perplexity-User | Consultation demandée par l’utilisateur | Token présent; ne pas l’assimiler à une exploration d’index |
| ClaudeBot | Collecte pouvant contribuer à l’entraînement | Autorisé |
| Claude-SearchBot | Recherche | Autorisé; test simulé 200 sur une fiche |
| Claude-User | Consultation à la demande | Autorisé dans le fichier |

Sources : [OpenAI — crawlers](https://developers.openai.com/api/docs/bots), [Google — crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [Perplexity — crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Anthropic — robots](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

**Accès ≠ récupération ≠ citation ≠ recommandation.** Ni un 200 avec user-agent simulé ni robots Allow ne démontre une visite réelle du fournisseur, une intégration dans son index ou une citation. Vérifier ces événements avec logs authentifiés et liens référents. Les règles anti-bot peuvent dépendre d’IP, pays, comportement et réputation.

Google n’exige pas de fichier IA ou de schéma spécial pour AI Overviews/AI Mode; les fondations SEO restent pertinentes et l’apparition n’est pas garantie. [Google — fonctionnalités IA et sites web](https://developers.google.com/search/docs/appearance/ai-features).

**Capacité à répondre aux questions touristiques, sur contenu réellement examiné :**

| Question | Support existant / constat | Amélioration prioritaire |
|---|---|---|
| Combien coûte Marrakech–Merzouga ? | Guide des prix avec tableau et distinctions privé/partagé; cartes et fiches commerciales | Corriger les devises B07; distinguer fourchette de marché, tarif « à partir de », groupe et dates |
| Trois jours suffisent-ils ? | Guide « marrakech-desert-tour-3-days-itinerary-guide » donne une réponse courte, deux nuitées et précise le temps de route important | Comparaison 3/4/5 jours et lien vers la fiche correspondant exactement au trajet |
| Qu’est-ce qui est inclus dans un circuit privé ? | Listes d’inclusions/exclusions sur fiches | Éviter la promesse générale « chaque voyage inclut... » si elle ne vaut pas pour chaque produit |
| Quelle saison pour le Sahara ? | FAQ d’accueil et sections saison des guides | Révision datée, nuance régionale et distinction climat habituel/prévision |
| Marrakech–Fes via le désert ? | Fiches de traversée, guide best-marrakech-to-fes-desert-tour présent au sitemap; guide sens inverse Fes–Marrakech lu | Clarifier sens, arrivée et différences d’itinéraire; ne pas intervertir les deux sens |
| Quel circuit pour une famille ? | Guide morocco-with-kids-spring-family-tours compare rythme, trajet, logement et âges | Ajouter critères confirmés de siège enfant, distances et pauses au devis |
| Peut-on réserver un circuit privé ? | CTA devis, page sur mesure, formulaire et politique | Unifier acompte et expliquer que l’envoi n’est pas une réservation confirmée |
| Merzouga ou Zagora ? | Guide comparatif incluant aussi Agafay, tableau « Quick Answer » | Conserver distinctions dunes/terrain rocheux et temps disponible; vérifier les offres liées |

Les guides publics échantillonnés ont été lus directement par HTTP : [prix](https://toursmarrakechdesert.com/blog/marrakech-desert-tour-cost-price-guide), [trois jours](https://toursmarrakechdesert.com/blog/marrakech-desert-tour-3-days-itinerary-guide), [familles](https://toursmarrakechdesert.com/blog/morocco-with-kids-spring-family-tours), [déserts comparés](https://toursmarrakechdesert.com/blog/best-desert-in-morocco-merzouga-zagora-agafay-compared), [Fes–Marrakech](https://toursmarrakechdesert.com/blog/morocco-fes-to-marrakech-travel-time-desert-tour). Ces textes constituent des preuves de structure et de contenu disponible, pas des sources indépendantes validant toutes leurs affirmations.

**Compréhension de l’agence :** identité, services, pays, départs, téléphone, e-mail, équipe et langues sont présents. Les limites portent surtout sur la base du prix, la date de validité, les horaires/disponibilités, l’unification des conditions et la preuve des promesses. La durée est présente mais souvent stockée en texte partagé; l’arrivée n’est pas un champ structuré distinct du modèle TourRow. Elle doit rester explicite dans l’itinéraire et le résumé factuel.

### O02 — Demande de devis contextualisée pour humains et agents (P2, opportunité)

**Fichier / ligne :** `src/components/sections/Contact/ContactForms.tsx:8`; `src/app/[locale]/tours/[slug]/page.tsx:337`.

**Problème et preuve :** Le formulaire transmet nom/email/WhatsApp/message, sans identifiant du circuit ni dates structurées.

**Impact :** Les détails du choix se perdent; ce flux ne constitue pas une réservation automatisée.

**Correction recommandée :** Préremplir produit et URL, langue, dates et voyageurs; expliquer devis→confirmation→acompte→documents; conserver validation humaine.

**Vérification :** Parcours au clavier et navigateur, sans envoyer de vraie demande pendant l’audit; test d’envoi seulement en environnement dédié.

### O05 — Navigation multilingue et accordéons utilisables sans interaction JS (P3, opportunité)

**Fichier / ligne :** `src/components/ui/LanguageSwitcher.tsx:160`; `src/components/sections/day_trips/Itinerary.tsx:99`; `src/components/ui/FaqItem.tsx:18`.

**Problème et preuve :** Langues proposées via boutons; itinéraire présent dans le HTML mais hidden; FAQ présente dans le DOM.

**Impact :** Extracteurs texte avantagés, mais lecteur sans JS et certains agents ne peuvent ouvrir tous les panneaux.

**Correction recommandée :** Liens réels vers traductions disponibles; envisager details/summary ou ouverture progressive; associer aria-controls aux réponses.

**Vérification :** Tester HTML sans JS, clavier et lecteur d’écran; ne pas retirer le contenu du HTML initial.

### O06 — Maintenir llms.txt comme ressource expérimentale (P3, opportunité)

**Fichier / ligne :** `public/llms.txt:1`; `public/llms.txt:67`.

**Problème et preuve :** Fichier existant de 572 lignes, environ 50 Ko, identique en production après normalisation des fins de ligne.

**Impact :** Une liste manuelle peut vieillir; aucun bénéfice Google garanti.

**Correction recommandée :** Automatiser la vérification des liens et réduire les répétitions; faire pointer vers les pages de référence corrigées.

**Vérification :** Comparer liens et catalogue après publication; ne pas en faire un KPI de classement.


**llms.txt existe déjà.** Il comporte des liens EN/FR/ES, l’identité de l’agence et des consignes de prudence sur les prix et disponibilités. Le rapport ne recommande pas de créer un second fichier ni d’y accumuler des mots-clés. La longueur et la maintenance manuelle justifient un contrôle de cohérence, sans considérer ce fichier comme une norme universelle. Google indique explicitement qu’il n’est pas nécessaire et n’améliore ni ne dégrade ses classements. [Clarification officielle dans les mises à jour Google](https://developers.google.com/search/updates).

**Agents de navigation et réservation.** Les liens descriptifs, fiches HTML et labels permettent à un agent de comprendre et préparer une demande. Aucun calendrier transactionnel, stock de places, paiement ni confirmation automatique n’a été identifié. Un agent peut lire et remplir un formulaire avec accord approprié de son utilisateur; cet audit n’a envoyé aucun message. Le site est un parcours d’enquête/devis accompagné par l’agence, pas un moteur de réservation autonome. Aucune justification métier ne ressort pour construire maintenant une API spéciale, un serveur MCP ou une interface réservée aux IA.

## 9. Problèmes Next.js, performances et infrastructure

### B03 — Contenu Supabase figé sans stratégie de renouvellement sur accueil et activités (P1, bug confirmé)

**Fichier / ligne :** `src/app/[locale]/page.tsx:132`; `src/app/[locale]/activities/page.tsx:61`; `src/app/[locale]/activities/[slug]/page.tsx:34`; `src/components/sections/Home/HomeBlogSection.tsx:48`.

**Problème et preuve :** Pas de revalidate/invalidation pour ces routes; manifeste existant initialRevalidateSeconds=false; production s-maxage=31536000.

**Impact :** Prix, publication et liens récents peuvent rester anciens jusqu’au redéploiement ou à une purge.

**Correction recommandée :** Définir une politique de revalidation adaptée et invalider toutes les pages dépendantes après publication/modification/retrait.

**Vérification :** Modifier une donnée de test et contrôler fiche, liste, accueil et sitemap après le délai convenu; ne pas modifier la production pour tester.

### R02 — Protection RLS non documentée pour tours/day_trips (P1, risque à vérifier)

**Fichier / ligne :** `supabase/migrations/20260908184206_create_day_trips.sql:1`; `supabase/migrations/20260911215827_create-tour.sql:1`; `src/lib/supabase/server.ts:5`.

**Problème et preuve :** Ces migrations ne contiennent ni ENABLE ROW LEVEL SECURITY ni policy, contrairement aux deux autres tables; grants et état distant inconnus.

**Impact :** Selon les droits réels, accès direct à du contenu non publié; le filtre applicatif seul ne protège pas la base.

**Correction recommandée :** Auditer grants et policies réels; versionner les règles publiées; restreindre toutes les écritures.

**Vérification :** Contrôler pg_policies et relrowsecurity en accès autorisé; tests rôle anonyme sans lecture de données privées en production.

### R03 — Chaîne de confiance HTML et JSON-LD non garantie (P1, risque à vérifier)

**Fichier / ligne :** `src/app/[locale]/blog/[slug]/page.tsx:290`; `src/app/[locale]/activities/[slug]/page.tsx:191`; `src/app/[locale]/activities/[slug]/page.tsx:280`.

**Problème et preuve :** HTML Supabase injecté brut; JSON.stringify des activités non échappé contre </script>; tours utilisent au contraire rehypeSanitize.

**Impact :** Si une entrée non fiable atteint la base: injection, liens SEO parasites ou rupture du document; aucune exploitation observée.

**Correction recommandée :** Auditer les droits éditoriaux, assainir le HTML selon une liste autorisée et sérialiser le JSON-LD en échappant <.

**Vérification :** Fixtures malveillantes en test local isolé; aucun script exécuté, liens utiles conservés.

### R06 — Latence, poids HTML/JS et Core Web Vitals non mesurés (P2, risque à vérifier)

**Fichier / ligne :** `src/lib/supabase/server.ts:5`; `src/app/[locale]/tours/[slug]/page.tsx:62`; `src/components/sections/Home/Hero.tsx:62`; `src/app/[locale]/layout.tsx:85`.

**Problème et preuve :** Lectures répétées metadata/page sans cache explicite; images qualité 90; provider de traductions global; articleBody reproduit le texte.

**Impact :** TTFB/LCP/INP/CLS potentiellement affectés, sans score disponible.

**Correction recommandée :** Mesurer RUM/CrUX et profils réseau avant optimisation; dédupliquer par requête si nécessaire; timeout et cache adaptés.

**Vérification :** Mesures mobiles reproductibles et percentiles terrain, sans assimiler un temps GET aux Core Web Vitals.

### O07 — Contrôles de qualité SEO à intégrer aux vérifications existantes (P3, opportunité)

**Fichier / ligne :** `src/lib/supabase/activities.ts:106`; `src/lib/supabase/activities.ts:137`; `src/lib/supabase/blogs.ts:95`; `src/lib/supabase/blogs.ts:137`.

**Problème et preuve :** TypeScript passe; ESLint remonte quatre no-explicit-any, aucune alerte supplémentaire dans src.

**Impact :** Typage et tests de contrat réduiraient les régressions éditoriales/routage.

**Correction recommandée :** Typer les projections Supabase et ajouter des contrôles ciblés canonical, statut, devise, langue, sitemap et publication.

**Vérification :** Exécuter lint sans correction automatique, typecheck et fixtures représentatives en CI.


**Points favorables :** rendu serveur, images next/image avec dimensions ou conteneurs réservés, sizes sur les grandes images, priorité sur les héros, cartes secondaires chargées normalement, polices next/font avec display swap, cartes géographiques en iframe lazy et HTML principal indépendant des appels navigateur à Supabase.

**Points de mesure ciblés :**

- LCP : héros de l’accueil à qualité 90 et image source marrakech.jpeg d’environ 441 Ko; ce poids source n’est pas le poids optimisé transféré. Mesurer les variantes réellement livrées, le preload et le réseau mobile.
- INP : header mobile, galerie, favoris et accordéons utilisent React. Aucune latence d’interaction n’a été mesurée; les classes CSS ou le nombre de composants ne suffisent pas à conclure.
- CLS : conteneurs réservés et dimensions sont favorables; les polices, images éditoriales Supabase et contenu variable doivent être testés visuellement.
- TTFB : pages par ville/pagination dynamiques et dépendances Supabase; les appels metadata/page peuvent être répétés mais le nombre réel n’a pas été tracé. Une mémorisation par requête évite certaines lectures sans introduire un cache périmé entre utilisateurs.
- HTML/JS : BlogSeo réplique articleBody dans JSON-LD en plus du HTML; NextIntlClientProvider global peut envoyer plus de messages que nécessaire. Mesurer avant de retirer des données utiles.
- GA est injecté via @next/third-parties dans le layout. Le bon fonctionnement de la collecte, le consentement et les conversions ne sont pas confirmés.
- La documentation Next.js installée déprécie Image priority en faveur de preload. C’est une migration de maintenance à prévoir, pas une panne démontrée; choisir preload/loading/fetchPriority selon la mesure du héros, sans précharger toutes les images.

**Infrastructure :** HTTPS et redirection www fonctionnent dans l’échantillon. HTTP www effectue deux sauts : optimisation secondaire possible à la périphérie, sans priorité sur les bugs ci-dessus. L’en-tête server=hcdn a été observé; aucune configuration CDN/WAF, reverse proxy, déploiement ou logs n’est versionnée dans les fichiers inspectés. Aucune preuve de cloaking intentionnel dans le code.

Le proxy exclut notamment API/admin et chemins contenant un point. Les slugs à points ne sont pas garantis par ce routage; aucun cas présent n’a été démontré. Valider le format des slugs à l’édition. Les erreurs publiques testées n’ont pas exposé de secrets.

**Contact :** le handler valide les champs requis et échappe le HTML des e-mails, utilise des timeouts SMTP et renvoie des erreurs génériques. Il n’a ni limite de débit applicative visible ni borne explicite de taille des champs; les protections CDN éventuelles sont inconnues. Ce point relève d’un durcissement ciblé de disponibilité du formulaire, sans diagnostic d’attaque ou test de charge. La vérification SMTP avant chaque envoi ajoute une étape réseau; l’envoi réel et sa délivrabilité n’ont pas été testés.

**Pas de score inventé :** aucun chiffre LCP/INP/CLS, score PageSpeed ou percentile de latence n’est annoncé. Les limites de données et les méthodes nécessaires figurent en section 12.

## 10. Tableau complet des problèmes

Ce tableau est le registre de comptage : une ligne par constat, sans compter deux fois ses occurrences dans plusieurs langues. Les scénarios latents et risques sont détaillés dans les sections précédentes. Les vérifications à réaliser figurent dans chaque fiche de constat.

| ID | Sévérité | Type | Fichier / ligne | Problème | Preuve | Impact | Solution |
|---|---|---|---|---|---|---|---|
| B01 | P1 | Bug confirmé | src/lib/supabase/blogs.ts:130; src/lib/supabase/activities.ts:130; src/lib/supabase/day_trips.ts:192; src/lib/supabase/tours.ts:321 | Erreur de lecture confondue avec une absence | Les erreurs retournent null; les pages appellent notFound(). | Une panne peut produire une fausse 404 et retirer temporairement une page utile. | Lever une erreur typée sur panne; réserver notFound() aux contenus réellement absents; préserver le dernier rendu valide. |
| B02 | P1 | Bug confirmé | src/app/sitemap.ts:34; src/lib/supabase/blogs.ts:162; src/lib/supabase/activities.ts:181; src/lib/supabase/day_trips.ts:241; src/lib/supabase/tours.ts:197 | Sitemap incomplet présenté comme réussi après erreur | Retours [] et fail() qui journalise sans lever; readRows peut retourner une liste partielle. | Le sitemap 200 peut perdre une famille ou une partie des URL publiées. | Faire échouer atomiquement la génération; conserver une dernière version valide; alerter sur variation anormale du nombre d’URL. |
| B03 | P1 | Bug confirmé | src/app/[locale]/page.tsx:132; src/app/[locale]/activities/page.tsx:61; src/app/[locale]/activities/[slug]/page.tsx:34; src/components/sections/Home/HomeBlogSection.tsx:48 | Contenu Supabase figé sans stratégie de renouvellement sur accueil et activités | Pas de revalidate/invalidation pour ces routes; manifeste existant initialRevalidateSeconds=false; production s-maxage=31536000. | Prix, publication et liens récents peuvent rester anciens jusqu’au redéploiement ou à une purge. | Définir une politique de revalidation adaptée et invalider toutes les pages dépendantes après publication/modification/retrait. |
| B04 | P1 | Bug confirmé | src/app/[locale]/tours/from/[city]/page.tsx:142 | Villes inexistantes indexables en HTTP 200 | if(!tours) ne détecte pas []; /tours/from/audit-ville-inexistante répond 200 index, follow. | Espace illimité de pages vides, risque de soft 404 et mauvaise expérience depuis les liens Agadir. | Valider les villes disponibles; traiter tableau vide; distinguer ville inexistante et catalogue temporairement vide. |
| B05 | P1 | Bug confirmé | src/app/[locale]/about/booking-policy/page.tsx:410; src/i18n/routing.ts:88 | Canonical et hreflang de réservation vers des 404 | /about/booking-policy déclare /booking-policy; même omission du parent en FR et ES; trois cibles testées en 404. | Signaux contradictoires sur une page de confiance; alternates inutilisables. | Construire toutes les URL avec getPathname et /about/booking-policy; corriger aussi og:url. |
| B06 | P2 | Bug confirmé | src/app/[locale]/about/page.tsx:100 | Canonical anglais /en/about redirigé | /about répond 200 mais canonical /en/about, lequel répond 307 vers /about; hreflang en pointe /about. | Canonical contraire à la stratégie sans préfixe anglais. | Utiliser getPathname avec /about et locale en. |
| B07 | P1 | Bug confirmé | src/components/sections/activities/ActivityCard.tsx:187; src/components/sections/day_trips/daytripCard.tsx:141; src/app/[locale]/activities/[slug]/page.tsx:255; src/app/[locale]/day-trips/[slug]/page.tsx:226; src/components/seo/seoActivities.ts:11 | Devise contradictoire entre cartes et fiches | Cartes $; fiches €; même valeur numérique issue du même champ price; activités JSON-LD EUR. Exemple montgolfière 165, Ourika 99.99. | Voyageurs et IA ne peuvent déterminer le prix fiable; risque commercial direct. | Décider la devise réelle; stocker currency avec price; partager le formatage et les conditions tarifaires; ne pas convertir seulement le symbole. |
| B08 | P1 | Bug confirmé | src/messages/en.json:243; src/messages/fr.json:236; src/messages/es.json:241; src/app/[locale]/about/booking-policy/page.tsx:87 | Conditions de réservation contradictoires | Sur mesure: acompte 20%; politique: 150 € requis, sans exception explicite. Préavis de 15 jours et remboursement non borné méritent clarification. | Réponses IA et décisions de réservation ambiguës. | Faire valider la règle commerciale puis la centraliser; expliciter les exceptions par produit et les délais de remboursement/changement. |
| B09 | P1 | Bug confirmé | src/messages/en.json:185; src/messages/fr.json:178; src/messages/es.json:183; src/app/[locale]/about/morocco_tourist/page.tsx:85 | Information erronée sur la frontière algérienne | Le texte annonce des routes terrestres rouvertes; la référence officielle FCDO consultée indique une frontière terrestre et maritime fermée. | Conseil de voyage trompeur; forte perte de fiabilité pour les citations. | Corriger les trois langues avec source officielle et date de vérification; revoir les autres informations changeantes. |
| B10 | P2 | Bug confirmé | src/components/seo/ContactJsonLd.tsx:61 | Images d’agence inexistantes dans le JSON-LD | /images/hero.jpeg et /images/logofooter.jpeg absents du dépôt et HTTP 404 en production. | Entité d’agence associée à des images inaccessibles. | Employer les fichiers réels /images/hero.jpg et /logo.png, après validation de leur pertinence. |
| B11 | P2 | Bug confirmé | src/app/[locale]/offers/page.tsx:3; src/app/[locale]/layout.tsx:46 | Page de brouillon publique et indexable | /offers renvoie 200, texte morocco student trips, titre générique, sans H1 ni canonical. | Page pauvre qui peut être découverte malgré son absence du sitemap. | Retirer la route publique tant qu’elle est inachevée, ou publier une vraie page; noindex temporaire si elle doit rester accessible. |
| B12 | P2 | Bug confirmé | src/app/[locale]/favorites/page.tsx:3; public/robots.txt:29; src/app/[locale]/layout.tsx:46 | Favoris sans noindex et lien vers une page vide | /favorites répond index, follow, titre générique; robots bloque son exploration mais pas nécessairement son indexation par URL. | URL utilitaire susceptible d’apparaître sans contenu utile; fonctionnalité inachevée. | Définir noindex sur toutes les variantes; permettre sa lecture pour prendre en compte ce signal, ou retirer la route et les liens si inutilisés. |
| B13 | P2 | Bug confirmé | src/components/sections/Home/Destinations.tsx:5; src/components/Layout/Footer.tsx:21 | Comptages de circuits inventoriés en dur, dont Agadir sans offre | Agadir annonce 6+ tours mais page vide et aucun groupe Agadir au sitemap; Fes 12+, Marrakech 24+ sont constants. | Promesse de catalogue non fiable, parcours vide, mauvaise extraction par les IA. | Calculer les nombres sur les offres publiées disponibles par langue; masquer ou expliquer les destinations sans circuit. |
| B14 | P2 | Bug confirmé | src/app/[locale]/activities/[slug]/page.tsx:213; src/app/[locale]/activities/[slug]/page.tsx:264; src/app/[locale]/day-trips/[slug]/page.tsx:191; src/app/[locale]/blog/[slug]/page.tsx:308 | Fragments de navigation et CTA dans la mauvaise langue | Accueil, Réserver cette activité et À partir de restent français sur fiches EN/ES; More Blogs/View all/All tours restent anglais. | Compréhension et confiance dégradées; HTML lang correct mais contenu mixte. | Passer ces chaînes et les descriptions de secours par les dictionnaires; traduire aussi les libellés d’accessibilité pertinents. |
| B15 | P2 | Bug confirmé | src/components/seo/seoActivities.ts:64; src/components/seo/seoActivities.ts:80 | Propriétés Schema.org mal modélisées sur activités | Production: duration: 3-4 Hours sur TouristTrip; duration n’est pas dans ce domaine et attend une durée normalisée; subjectOf contient ItemList au lieu d’une œuvre ou d’un événement. | Graphe JSON syntaxiquement valide mais sémantique moins exploitable. | Placer les étapes dans itinerary; garder la durée humaine en HTML; n’ajouter un champ de durée que sur une entité/propriété compatible, sans inventer une valeur exacte pour un intervalle. |
| B16 | P2 | Bug confirmé | src/app/[locale]/day-trips/[slug]/page.tsx:157 | Une panne des slugs alternatifs suffit à faire disparaître une excursion valide | if(!trip  /  /  !alternateSlugs) notFound(), bien que trip soit déjà chargé. | Couplage inutile: une lecture secondaire peut transformer une fiche valide en 404. | La fiche dépend seulement de trip; omettre les alternates indisponibles et journaliser leur erreur. |
| B17 | P2 | Bug confirmé | src/lib/supabase/blogs.ts:156; src/lib/supabase/activities.ts:175; src/lib/supabase/day_trips.ts:234; src/components/seo/BlogSeo.tsx:95 | Critères d’éligibilité différents entre sitemap, alternates et fiches | Slugs non vides suffisent aux listes; fiches exigent aussi titre, et contenu pour activités. workTranslation construit toutes les URL même avec slug null/manquant. | Une traduction incomplète peut être annoncée puis répondre 404, ou produire /null; cas latent, non observé sur les 324 URL actuelles. | Partager une validation de publication par langue entre listes, sitemap, metadata et graphe; filtrer chaque workTranslation. |
| B18 | P2 | Bug confirmé | src/lib/supabase/blogs.ts:74; src/lib/supabase/activities.ts:95 | Cartes blog/activités sans filtre de traduction exploitable | Le filtre published est présent, mais aucun contrôle titre/slug avant map; JSONB par défaut {} possible. | Une publication partiellement traduite peut générer carte vide ou lien invalide; cas latent non démontré en production. | Filtrer titre et slug utilisables avant count/range/limit, puis valider les objets. |
| B19 | P2 | Bug confirmé | src/components/ui/LanguageSwitcher.tsx:58; src/lib/supabase/tours.ts:457 | Changement de langue incorrect quand la traduction manque | targetSlug = alternateSlugs?.[newLocale] ?? currentSlug; null réutilise le slug source, chaîne vide reste vide. | Navigation vers une URL invalide ou non équivalente; latent si une traduction manque. | Ne proposer que les traductions disponibles; prévoir un lien explicite vers la liste localisée si nécessaire. |
| R01 | P1 | Risque à vérifier | Infrastructure CDN hors dépôt; contexte src/proxy.ts:4; public/robots.txt:4 | Refus Googlebot simulé par la couche publique | UA Googlebot desktop/mobile: / et /sitemap.xml 403; /robots.txt 200; serveur hcdn. UA standard et robots IA testés: 200. | Si les IP Google authentiques sont aussi refusées, découverte et indexation gravement compromises; cela n’est pas établi. | Vérifier inspection URL en direct et logs CDN; authentifier les IP Google; ajuster seulement la règle fautive. |
| R02 | P1 | Risque à vérifier | supabase/migrations/20260908184206_create_day_trips.sql:1; supabase/migrations/20260911215827_create-tour.sql:1; src/lib/supabase/server.ts:5 | Protection RLS non documentée pour tours/day_trips | Ces migrations ne contiennent ni ENABLE ROW LEVEL SECURITY ni policy, contrairement aux deux autres tables; grants et état distant inconnus. | Selon les droits réels, accès direct à du contenu non publié; le filtre applicatif seul ne protège pas la base. | Auditer grants et policies réels; versionner les règles publiées; restreindre toutes les écritures. |
| R03 | P1 | Risque à vérifier | src/app/[locale]/blog/[slug]/page.tsx:290; src/app/[locale]/activities/[slug]/page.tsx:191; src/app/[locale]/activities/[slug]/page.tsx:280 | Chaîne de confiance HTML et JSON-LD non garantie | HTML Supabase injecté brut; JSON.stringify des activités non échappé contre </script>; tours utilisent au contraire rehypeSanitize. | Si une entrée non fiable atteint la base: injection, liens SEO parasites ou rupture du document; aucune exploitation observée. | Auditer les droits éditoriaux, assainir le HTML selon une liste autorisée et sérialiser le JSON-LD en échappant <. |
| R04 | P2 | Risque à vérifier | supabase/config.toml:18; src/lib/supabase/blogs.ts:156; src/lib/supabase/activities.ts:175; src/lib/supabase/day_trips.ts:234; src/lib/supabase/tours.ts:279 | Plafonds et unicité des slugs non garantis à grande échelle | max_rows local 1000; pas de pagination dans trois lecteurs de slugs; liste activités limitée à 12, ville à 10; index slugs non uniques. | Omissions futures ou sélection arbitraire en présence de doublons; aucun dépassement actuel démontré. | Pagination stable, contraintes d’unicité partielles par langue après audit des doublons, navigation paginée quand utile. |
| R05 | P2 | Risque à vérifier | src/app/[locale]/layout.tsx:37; src/app/[locale]/blog/[slug]/page.tsx:55; src/app/sitemap.ts:13; src/components/seo/TourSeoJsonLd.tsx:9 | Origine publique définie de plusieurs façons | BASE_URL, SITE_URL et domaine codé en dur coexistent; valeurs d’environnement non lues. | Divergence possible canonical/sitemap/graphe ou indexation d’un domaine de préproduction; non observée sur le domaine testé. | Centraliser une origine HTTPS validée et une stratégie explicite pour la préproduction. |
| R06 | P2 | Risque à vérifier | src/lib/supabase/server.ts:5; src/app/[locale]/tours/[slug]/page.tsx:62; src/components/sections/Home/Hero.tsx:62; src/app/[locale]/layout.tsx:85 | Latence, poids HTML/JS et Core Web Vitals non mesurés | Lectures répétées metadata/page sans cache explicite; images qualité 90; provider de traductions global; articleBody reproduit le texte. | TTFB/LCP/INP/CLS potentiellement affectés, sans score disponible. | Mesurer RUM/CrUX et profils réseau avant optimisation; dédupliquer par requête si nécessaire; timeout et cache adaptés. |
| R07 | P2 | Risque à vérifier | src/components/seo/seoActivities.ts:75; src/app/[locale]/contact/page.tsx:25; src/messages/en.json:68 | Disponibilité et promesses commerciales sans source opérationnelle démontrée | InStock constant; coordonnées et horaires 24h fixes; promesse Every trip includes...; pas d’inventaire de places/dates. | Une IA peut prendre une possibilité de devis pour une disponibilité confirmée. | Valider horaires, localisation et inclusions; retirer la disponibilité non justifiée; préciser sous réserve de confirmation. |
| R08 | P2 | Risque à vérifier | src/app/[locale]/blog/[slug]/page.tsx:184; src/lib/supabase/blogs.ts:23; src/messages/en.json:97 | Chevauchement éditorial, fraîcheur et conseils évolutifs | Articles commerciaux proches des fiches, liens de recommandation génériques Marrakech, pas de updated_at blog; conseils passeport/visa sans source contextuelle. | Cannibalisation possible, incohérences d’itinéraire/prix et conseils datés; aucun effet de ranking établi. | Comparer requêtes/URL Search Console; attribuer une intention à chaque page; révision humaine et sources officielles datées. |
| O01 | P2 | Opportunité | src/app/sitemap.ts:15; src/lib/supabase/blogs.ts:23 | Sitemap plus fidèle aux publications et pages de confiance | Pas de politique de réservation, lastmod ni alternates XML; 324 URL, loin des limites. | Meilleurs signaux de découverte et de fraîcheur; absence d’alternates XML non bloquante si HTML correct. | Ajouter la politique après correction; dates de changement réelles; alternates optionnels, sans date artificielle à chaque génération. |
| O02 | P2 | Opportunité | src/components/sections/Contact/ContactForms.tsx:8; src/app/[locale]/tours/[slug]/page.tsx:337 | Demande de devis contextualisée pour humains et agents | Le formulaire transmet nom/email/WhatsApp/message, sans identifiant du circuit ni dates structurées. | Les détails du choix se perdent; ce flux ne constitue pas une réservation automatisée. | Préremplir produit et URL, langue, dates et voyageurs; expliquer devis→confirmation→acompte→documents; conserver validation humaine. |
| O03 | P2 | Opportunité | src/app/[locale]/day-trips/[slug]/page.tsx:169; src/components/seo/BlogSeo.tsx:276; src/app/[locale]/customize-your-tour/page.tsx:89 | Graphe d’entités à harmoniser sans promesse de rich result | Excursions sans JSON-LD; agence sans @id sur certains modèles; breadcrumb posé sur BlogPosting; commentaires FAQ promettent à tort des snippets. | Relations agence→page→voyage moins homogènes. | Partager l’ID agence; relier WebPage, TouristTrip, Offer et BreadcrumbList; déplacer breadcrumb vers WebPage; corriger les commentaires obsolètes. |
| O04 | P2 | Opportunité | src/app/[locale]/about/page.tsx:208; src/app/[locale]/blog/[slug]/page.tsx:240; src/components/seo/BlogSeo.tsx:234 | Expertise locale et réponses vérifiables à renforcer | Équipe nommée sur À propos; auteur des articles reste l’organisation; bonnes réponses rapides déjà présentes dans plusieurs guides. | Différenciation et citabilité améliorables par preuve et contexte. | Identifier le rédacteur/relecteur réel, date de révision, photos originales, tableaux de route et conditions tarifaires sourcées. |
| O05 | P3 | Opportunité | src/components/ui/LanguageSwitcher.tsx:160; src/components/sections/day_trips/Itinerary.tsx:99; src/components/ui/FaqItem.tsx:18 | Navigation multilingue et accordéons utilisables sans interaction JS | Langues proposées via boutons; itinéraire présent dans le HTML mais hidden; FAQ présente dans le DOM. | Extracteurs texte avantagés, mais lecteur sans JS et certains agents ne peuvent ouvrir tous les panneaux. | Liens réels vers traductions disponibles; envisager details/summary ou ouverture progressive; associer aria-controls aux réponses. |
| O06 | P3 | Opportunité | public/llms.txt:1; public/llms.txt:67 | Maintenir llms.txt comme ressource expérimentale | Fichier existant de 572 lignes, environ 50 Ko, identique en production après normalisation des fins de ligne. | Une liste manuelle peut vieillir; aucun bénéfice Google garanti. | Automatiser la vérification des liens et réduire les répétitions; faire pointer vers les pages de référence corrigées. |
| O07 | P3 | Opportunité | src/lib/supabase/activities.ts:106; src/lib/supabase/activities.ts:137; src/lib/supabase/blogs.ts:95; src/lib/supabase/blogs.ts:137 | Contrôles de qualité SEO à intégrer aux vérifications existantes | TypeScript passe; ESLint remonte quatre no-explicit-any, aucune alerte supplémentaire dans src. | Typage et tests de contrat réduiraient les régressions éditoriales/routage. | Typer les projections Supabase et ajouter des contrôles ciblés canonical, statut, devise, langue, sitemap et publication. |

## 11. Roadmap de correction

Aucune des actions ci-dessous n’a été appliquée pendant l’audit. « Low / Medium / High » mesure la complexité technique relative, pas une estimation commerciale ni une garantie de délai.

### Corrections et vérifications immédiates

| Priorité / IDs | Tâche | Fichiers / couche | Complexité | Bénéfice attendu | Dépendances | Vérification |
|---|---|---|---|---|---|---|
| P1 R01 | Vérifier le traitement du véritable Googlebot | CDN/WAF, logs, Search Console; aucune règle de blocage trouvée dans src/proxy.ts | Medium | Écarter ou réparer un obstacle réel au crawl Google | Accès propriétaire Search Console/CDN | Inspection URL en direct + IP Google authentifiées 200 |
| P1 B05 | Réparer politique de réservation EN/FR/ES | src/app/[locale]/about/booking-policy/page.tsx; src/i18n/routing.ts | Low | Canonicals et alternates vers pages valides | Aucune | Trois URL finales 200, canonical auto-référent |
| P1 B01/B02/B16 | Séparer erreur, absence et traduction secondaire | src/lib/supabase/{blogs,activities,day_trips,tours}.ts; pages de détail; src/app/sitemap.ts | Medium | Éviter fausses 404 et sitemaps partiels | Contrat d’erreur partagé | Tests erreur/absence sur détail et génération partielle |
| P1 B04 | Refuser les villes inexistantes | src/app/[locale]/tours/from/[city]/page.tsx | Low | Supprimer les pages vides artificielles | Distinguer absence métier et panne | Ville inconnue 404; ville existante utile |
| P1 B03 | Définir et implémenter une fraîcheur cohérente | accueil, activités liste/détail, intégration éditoriale | Medium | Prix, liens et retraits synchronisés | B01/B02 d’abord; choix SLA métier | Publication/modification/retrait en environnement de test |
| P1 B07/B08 | Décider devise et acompte de référence | modèles Supabase, cartes/fiches, seoActivities.ts, messages, booking-policy | Medium | Fiabilité des prix et conditions | Validation commerciale; migration de données éventuelle | Matrice page/langue/produit sans contradiction |
| P1 B09 | Corriger l’affirmation de frontière ouverte | src/messages/{en,fr,es}.json | Low | Éviter une information de voyage trompeuse | Source officielle | Relecture et comparaison des trois rendus |
| P1 R02/R03 | Contrôler droits de publication et contenu brut | migrations, policies distantes, blog/activité HTML/JSON-LD | Medium | Prévenir exposition et injections de contenu | Accès base autorisé; aucune exploitation live | RLS/grants et fixtures isolées |

### Corrections techniques à court terme

| Priorité / IDs | Tâche | Fichiers | Complexité | Bénéfice | Dépendances | Vérification |
|---|---|---|---|---|---|---|
| P2 B06/B10 | Corriger À propos EN et images de contact | about/page.tsx; ContactJsonLd.tsx | Low | Signaux canoniques et identité propres | Aucune | GET cibles, images et graphe |
| P2 B11/B12 | Retirer/contrôler les routes inachevées | offers/page.tsx; favorites/page.tsx; robots.txt; Footer.tsx | Low | Moins de pages sans valeur | Choix fonctionnel sur favoris/offres | Statut/robots et parcours réel |
| P2 B17/B18/B19 | Valider les traductions avant exposition | lecteurs Supabase; BlogSeo; LanguageSwitcher | Medium | Pas de liens ni alternates invalides | Définition d’une traduction publiable | Fixtures partielles dans trois langues |
| P2 R04 | Éliminer les limites silencieuses et doublons | lecteurs, catalogues, migrations d’index uniques | Medium | Découverte robuste à la croissance | Audit des données avant contrainte | Catalogues au-delà de 10/12/1000 et doublons |
| P2 B15/O03 | Réconcilier le graphe Schema.org | composants SEO; détail excursions; pages informationnelles | Medium | Données structurées fidèles | Prix et identité validés | Validator + comparaison HTML |
| P2 O01 | Compléter le sitemap et ses dates utiles | sitemap.ts; modèles de dates | Low–Medium | Découverte de pages de confiance et mises à jour | B02/B05, vraies dates | URL publiées uniquement; absence de dates artificielles |
| P2 R05/R06 | Centraliser l’origine et mesurer les performances | configuration, utilitaires URL, couche Supabase, layout/images | Medium | Stabilité entre environnements et optimisation mesurée | Données RUM/CrUX ou mesures labo | Comparaison avant/après documentée |
| P3 O07 | Traiter lint et ajouter contrôles SEO ciblés | activities.ts, blogs.ts, CI existante à établir | Low–Medium | Régressions détectées tôt | Contrats fonctionnels stabilisés | Typecheck/lint et tests pertinents |

### Améliorations de contenu

| Priorité / IDs | Tâche | Fichiers / contenu | Complexité | Bénéfice | Dépendances | Vérification |
|---|---|---|---|---|---|---|
| P2 B13/B14 | Compteurs réels et traductions complètes | Destinations.tsx; modèles d’activité/excursion/blog; messages | Low–Medium | Parcours cohérent par langue | Catalogue fiable | Agadir et toutes les langues |
| P2 R07/O04 | Réviser promesses et démontrer l’expertise | pages société/contact, messages, articles en base | Medium | Confiance et précision | Validation agence et sources | Relecteur réel, dates, conditions et sources |
| P2 R08 | Cartographier les intentions et les liens contextuels | blog/fiches en base; recommandations blog | Medium | Clarifier information vs conversion | Export Search Console | Comparaison requêtes/URL et suivi comparable |
| P2 O02 | Conserver le contexte du devis | ContactForms.tsx; CTA des fiches; route contact | Medium | Moins d’ambiguïté dans les demandes | Conditions commerciales harmonisées | Produit/langue/dates corrects, test sans envoi réel |

### Améliorations avancées de découvrabilité IA

| Priorité / IDs | Tâche | Fichiers / couche | Complexité | Bénéfice | Dépendances | Vérification |
|---|---|---|---|---|---|---|
| P2 O04 | Ajouter résumés et tableaux factuels là où ils manquent | fiches, guides, modèles de données | Medium | Comparaison et extraction plus fiables | Données validées; ne pas dupliquer les bons tableaux existants | Questions touristiques représentatives et fidélité des réponses |
| P3 O05 | Liens de langue et accordéons utilisables sans JS | LanguageSwitcher, Itinerary, FaqItem | Medium | Navigation accessible aux humains et agents | B19 | Clavier, sans JS, DOM initial |
| P3 O06 | Synchroniser llms.txt avec le catalogue | public/llms.txt et processus éditorial | Low | Ressource expérimentale à jour | URL canoniques stabilisées | Liens contrôlés après publication |
| P2 R01/R07 | Observer accès et références IA sans promettre de résultat | logs/analytics configurés par le propriétaire | Medium | Mesurer visites réelles et conversions | Vérification des bots, accès outils | Distinguer crawl authentifié, référent, demande de devis et vente |

**Ordre conseillé :** vérifier l’accès Google et corriger les canonicals; fiabiliser les lectures et le cache; aligner les informations commerciales; traiter traductions et graphe; mesurer puis améliorer contenu et expérience. Le travail sur llms.txt vient après ces fondations.

## 12. Informations impossibles à confirmer

| Sujet | Ce qui manque | Donnée nécessaire pour conclure |
|---|---|---|
| Indexation Google réelle | Aucun accès Search Console | Export « Indexation des pages », sitemaps soumis, inspections d’URL représentatives, canonical déclarée/choisie |
| Cause du manque de visibilité | Aucun historique requêtes/positions/clics | Performance Search Console par page, requête, pays, appareil et période; distinction marque/hors marque |
| Blocage réel de Googlebot | UA simulés seulement | Logs CDN/origine avec IP, date UTC, UA, chemin, statut, règle déclenchée; vérification IP/rDNS Google; inspection en direct |
| Couverture des vrais robots IA | Aucun log authentifié | Journaux et plages IP officielles; différencier bots de recherche, entraînement et accès utilisateur |
| Exhaustivité du catalogue publié | Pas de requête privée Supabase | Comptages en lecture seule des lignes publiées valides par langue; comparaison au sitemap; dates et slugs |
| RLS et droits effectifs | Migrations locales seules | relrowsecurity, pg_policies, grants et historique des migrations réellement appliquées |
| Unicité / traductions incomplètes | Données publiques actuelles non représentatives de tous les états | Recherche autorisée des doublons, slug/titre vides, JSONB incomplets, images nulles |
| Fraîcheur de publication réelle | Aucun contenu créé ou modifié | Horodatages de publication et cache; test contrôlé en préproduction; mécanisme de purge hébergeur |
| Commit réellement déployé | Pas de SHA/build identifiable et relié au dépôt | ID de déploiement, version Git et variables publiques validées sans exposition de valeurs sensibles |
| Core Web Vitals | Pas de PSI/CrUX/RUM ou profil navigateur | LCP/INP/CLS terrain mobile/desktop, percentile 75 si disponible, tests labo reproductibles |
| TTFB et disponibilité historique | GET ponctuels seulement | APM, percentiles par route, latence Supabase, logs 5xx/timeouts et taux de cache |
| Mobile/accessibilité/hydratation | Pas de navigateur instrumenté | Tests de viewport, clavier, lecteur d’écran, console d’hydratation et interactions |
| Délivrabilité contact | Aucun formulaire envoyé | Test en environnement de test, résultat SMTP, réception et traitement; pas de vrai message généré par cet audit |
| Analyse de conversion | Pas d’accès Analytics | Parcours fiche→demande→réponse→vente, source de trafic et qualité des demandes |
| Identité, adresse, licences, réputation | Déclarations du site seulement | Documents de l’agence, profils professionnels vérifiés, preuves publiques exactes, avis authentiques |
| Disponibilité et prix final | Aucun inventaire transactionnel | Règles de devise, unité tarifaire, nombre de voyageurs, saison, catégorie et confirmation agence |
| Rich results et validation sémantique complète | Parsing JSON seulement, vérification documentaire ciblée | Schema.org Validator; Rich Results Test pour les types réellement pris en charge |
| Citations ChatGPT/Gemini/Perplexity/Claude | Pas d’étude répétée de requêtes ou de référents | Échantillon horodaté de questions/langues, réponses sourcées, logs et conversions; aucune garantie de reproductibilité |
| Backlinks, concurrence et cannibalisation | Aucun export de liens ni analyse concurrentielle quantitative | Liens Search Console/outils autorisés, SERP contextualisées et matrice requêtes/URL |

**Accès externes :** l’outil web a d’abord échoué à ouvrir robots/sitemap, sans que cela indique une panne du site. Les GET directs, autorisés hors du bac à sable réseau, ont ensuite confirmé leur disponibilité pour un client standard. Le refus Googlebot est distinct de cette restriction initiale d’environnement.

**Reproduction prudente :** refaire les GET avec et sans redirection automatique, lire canonical/hreflang dans le HTML brut, parser les scripts JSON-LD séparément et comparer les URL finales. Pour l’incident Googlebot, utiliser Search Console et les logs authentifiés, pas seulement curl avec un user-agent changé. Pour les pannes Supabase, utiliser des fixtures ou des doublures locales; ne pas interrompre la base en production. Pour le formulaire, un simple audit de lecture ne doit pas envoyer d’e-mail.

**Sources techniques locales consultées :**

- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
- `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`

Les références externes sont liées au plus près des affirmations dans les sections 3 à 8. Elles ont été consultées pour éviter de reconduire des recommandations obsolètes, notamment sur les FAQ enrichies et les usages des différents robots.

## 13. Top 10 recommandations

1. **Lever l’incertitude Googlebot avec des preuves authentifiées.** Le 403 simulé est le risque d’infrastructure à vérifier en premier; ne pas le présenter comme une exclusion Google avérée.
2. **Réparer les canonicals de réservation et d’À propos.** Toutes les cibles doivent être les pages finales 200 de la bonne langue.
3. **Rendre la lecture Supabase et le sitemap résistants aux pannes.** Une erreur réseau ne doit pas devenir une absence de produit ni une publication XML partielle.
4. **Définir une politique de fraîcheur et de retrait cohérente.** Accueil, activités, listes, fiches, recommandations et sitemap doivent refléter la publication selon un délai maîtrisé.
5. **Supprimer les pages vides indexables et les promesses de catalogue erronées.** Traiter villes inexistantes, Agadir, /offers et favoris selon leur utilité réelle.
6. **Unifier prix, devise, unité tarifaire et conditions de réservation.** Résoudre dollars/euros et 20 %/150 €, avec validation métier et une seule source de référence.
7. **Corriger les informations factuelles et documenter la révision.** Commencer par la frontière algérienne; dater et sourcer les conseils évolutifs.
8. **Valider chaque traduction avant de la lier ou de l’annoncer.** Même contrat pour carte, fiche, sitemap, hreflang, workTranslation et changement de langue.
9. **Harmoniser le graphe d’entités autour de faits vérifiables.** Réparer images, durée/itinéraire, disponibilité et ID agence; compléter les excursions sans promettre de rich results.
10. **Renforcer les réponses et le parcours de devis qui existent déjà.** Conserver les bons comparatifs, ajouter expertise et critères manquants, transmettre le circuit choisi, mesurer la conversion; traiter llms.txt comme une ressource secondaire.

**Les cinq leviers IA les plus utiles sont donc :** informations commerciales cohérentes; résumés d’itinéraires et comparaisons factuelles; expertise/sources datées; graphe agence–page–voyage fidèle; parcours de devis explicite et accessible. Aucun ne garantit une citation, mais chacun rend les informations plus compréhensibles et vérifiables.
