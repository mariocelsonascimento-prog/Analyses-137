# Carte du dépôt

## Principe général

Le dépôt sépare les sources d'analyse, les données, les tableaux de bord et le site publié. Ne pas déplacer un fichier uniquement pour simplifier un chemin sans vérifier le rôle de son dossier.

```text
Analyses 137/
├── analyses/              Documentation et livrables propres à chaque analyse
├── books/                 Projets personnels inspirés de livres
├── dashboards/            Fichiers Tableau, Power BI, Excel ou web
├── data/                  Catalogue, données brutes et données préparées
├── docs/                  Règles transversales du projet
├── documentation-ia/      Contexte interne destiné aux assistants IA
├── pipelines/             Code reproductible de traitement des données
├── project-management/    Workflow, tickets et modèles d'incidents
├── scripts/               Scripts utilitaires du dépôt
├── site/                  Racine exclusive du site GitHub Pages
└── templates/             Modèles pour de nouveaux projets
```

## Site public

- `site/index.html` : accueil et catalogues.
- `site/analyses/*.html` : pages détaillées des analyses.
- `site/suivi.html` : suivi public des projets et incidents.
- `site/accessibilite.html` : démarche d'accessibilité.
- `site/assets/styles.css` : styles communs et adaptations mobiles.
- `site/assets/*.js` : interactions, navigation par chapitres et visualisations web.
- `site/content/analyses.json` : cartes du catalogue d'analyses.
- `site/content/books.json` : catalogue des livres.
- `site/content/project-management.json` : projets, tâches et incidents affichés publiquement.
- `site/content/commercial-data.json` : données préparées pour le dashboard commercial web.
- `site/downloads/` : fichiers explicitement proposés au téléchargement.

Le déploiement est défini par `.github/workflows/pages.yml` et publie uniquement `site/`.

## Sources et traitements

- `data/raw/` : sources originales à conserver sans modification.
- `data/processed/` : sorties reproductibles des traitements.
- `data/catalog/` : fiches de traçabilité des jeux de données.
- `pipelines/` et `scripts/` : transformations, contrôles et génération de fichiers destinés au site.

Une correction manuelle effectuée dans un fichier préparé doit être remplacée, dès que possible, par une transformation documentée et reproductible.

## Tableaux de bord

- `dashboards/power-bi/` contient le rapport Power BI de l'étude commerciale.
- Une copie téléchargeable peut exister dans `site/downloads/`, mais elle doit correspondre à la version que le site présente.
- Les visualisations web peuvent reconstruire une expérience interactive sans prétendre être une intégration Power BI officielle.

## Documentation transversale

- `docs/ARCHITECTURE.md` : organisation générale.
- `docs/DATA_GOVERNANCE.md` : traçabilité et traitement des données.
- `docs/ACCESSIBILITY.md` : contrôles d'accessibilité.
- `docs/COMMENTS.md` : commentaires reposant sur les GitHub Issues.
- `docs/CONVENTIONS.md` : conventions de nommage et de rédaction.

## Gestion des commentaires

Les commentaires utilisent des GitHub Issues publiques et une validation par labels. Le site ne collecte pas d'adresse électronique. Ne pas ajouter de service tiers ni de champ de donnée personnelle sans demande explicite.

