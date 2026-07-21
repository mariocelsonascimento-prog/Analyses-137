# Analyses 137

Portfolio public de Data Analysis consacré aux sujets souvent discutés avec beaucoup de conviction, mais pas toujours avec suffisamment de données.

Le projet présentera des analyses claires, sourcées et reproductibles, avec des dashboards créés dans Tableau Desktop, Power BI, Excel ou avec des technologies web.

## Principes

- distinguer faits, hypothèses et interprétations ;
- publier la source, la version et la date de chaque jeu de données ;
- expliquer les transformations et les limites ;
- conserver des analyses reproductibles ;
- offrir une navigation simple et cohérente quel que soit l'outil utilisé.

## Structure

```text
analyses/        Etudes de cas, methodes et resultats
dashboards/      Sources et exports Tableau, Power BI, Excel et web
data/catalog/    Fiches de tracabilite des jeux de donnees
data/raw/        Donnees publiques originales
data/processed/  Donnees nettoyees ou agregees
pipelines/       Code public de collecte, nettoyage et validation
docs/            Architecture, gouvernance et conventions
site/            Code du portfolio web
templates/       Modeles d'analyse et de source
```

## Ajouter une analyse

1. Copier `templates/analysis/` dans `analyses/<sujet>/`.
2. Référencer chaque source dans `data/catalog/` avec `templates/dataset.yml`.
3. Copier `templates/pipeline/` dans `pipelines/<sujet>/` et documenter son exécution.
4. Placer le dashboard ou ses instructions dans `dashboards/`.
5. Publier le contexte, la méthode, les résultats, les sources et les limites.

## Reproduire un traitement

Chaque pipeline public précise son environnement, ses données d'entrée, les commandes à exécuter, les contrôles qualité et les fichiers produits. Les notebooks peuvent servir à l'exploration, mais le nettoyage final doit aussi exister sous forme de scripts exécutables.

## Statut

Le dépôt est en phase de structuration initiale.
