# Ventes, marge et retours — étude de cas Power BI

Cette étude de cas montre comment relier trois lectures complémentaires d'une activité commerciale : le chiffre d'affaires, la rentabilité et les retours produits.

## Question métier

Quels commerciaux, produits et clients contribuent le plus à l'activité, et quels signaux de retour doivent être examinés en priorité ?

## Livrables

- [Page publique](../../site/analyses/analyse-commerciale-power-bi.html)
- [Rapport Power BI](../../dashboards/power-bi/analyse-commerciale-power-bi.pbix)
- [Données brutes Excel](data/raw/Entrainement_PowerBI_DataAnalyst.xlsx)
- captures du dashboard dans `site/assets/images/`

La version web interactive est générée avec `scripts/prepare-commercial-data.ps1`. Le script retire deux doublons de vente, normalise les libellés et remplace les deux prix unitaires manquants par la moyenne observée pour le même produit. Il reproduit ainsi les KPI du rapport Power BI.

## Indicateurs

- chiffre d'affaires : 2 966 460 € ;
- marge : 526 914,94 € ;
- taux de marge : 17,76 % ;
- quantité vendue : 4 295 ;
- quantité retournée : 134 ;
- taux de retour : 3,12 %.

## Mesures DAX documentées

```DAX
Quantité retournée = SUM(Retours[Quantite_Retour])

Taux de retour = DIVIDE([Quantité retournée], [Quantité vendue], 0)
```

## Limites

Il s'agit d'un jeu de données d'exercice. Sa provenance et sa licence ne sont pas documentées dans les fichiers reçus : il ne doit donc pas être présenté comme une source publique officielle. Les résultats décrivent uniquement ce jeu de données et ne permettent pas d'établir les causes des retours ou des écarts de marge.
