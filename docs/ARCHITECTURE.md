# Architecture du projet

## Parcours du visiteur

1. Accueil et promesse éditoriale.
2. Catalogue des sujets.
3. Page d'analyse avec résumé, chiffres clés et méthode.
4. Dashboard interactif ou aperçu de remplacement.
5. Sources, limites et historique des versions.

## Contrat d'intégration des dashboards

Le site restera indépendant des outils. Chaque dashboard devra déclarer son titre, son outil et sa version, son URL publique, une image d'aperçu, un lien alternatif, ses dimensions, sa date de mise à jour et les jeux de données associés.

Les contenus externes seront intégrés par un composant commun pour gérer chargements, erreurs, mobiles, cookies et solutions de repli de façon cohérente.

## Dossier d'une analyse

```text
analyses/<sujet>/
|-- README.md
|-- notebooks/
|-- scripts/
|-- outputs/
`-- dashboard.yml
```

Les fichiers trop lourds sont référencés par un lien public, une empreinte et des instructions de récupération.

