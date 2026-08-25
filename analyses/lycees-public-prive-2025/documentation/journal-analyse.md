# Journal de l'analyse

## 2026-08-25 — Exploration dans Excel Online

### Validations effectuées

- présence des colonnes principales et de plusieurs années ;
- filtre sur la session 2025 : 2 346 établissements ;
- secteurs : 1 562 lycées publics et 784 lycées privés sous contrat ;
- taux bruts complets ;
- valeurs ajoutées manquantes laissées vides ;
- création d'un taux de réussite attendu sur une ligne de contrôle ;
- conversion du taux de réussite et de la valeur ajoutée en nombres Excel ;
- calcul des moyennes simples et des taux de réussite pondérés.

### Résultats bruts reproduits depuis le CSV

| Secteur | Lycées | Moyenne simple | Candidats présents | Somme taux x présents | Taux pondéré |
| --- | ---: | ---: | ---: | ---: | ---: |
| Privé sous contrat | 784 | 98,7423 % | 107 343 | 10 640 774 | 99,1287 % |
| Public | 1 562 | 94,5973 % | 403 555 | 38 132 197 | 94,4907 % |

L'écart brut pondé est de 4,6380 points en faveur du privé sous contrat. Il s'agit d'une observation descriptive, pas d'une mesure causale de l'effet du secteur.

### Anomalie détectée à l'étape 12

Les moyennes communiquées sous le nom « VA réussite numérique » étaient :

- privé sous contrat : -2,458874459 ;
- public : -0,424983477.

Ces valeurs correspondent exactement à la colonne **Valeur ajoutée du taux d'accès 2nde-bac**, et non à la valeur ajoutée du taux de réussite.

Le recalcul direct de la colonne officielle **Valeur ajoutée du taux de réussite - Toutes séries**, en excluant les cellules vides, donne provisoirement :

- privé sous contrat : 0,698412698, sur 693 lycées renseignés ;
- public : -0,627476882, sur 1 514 lycées renseignés.

Le tableau croisé Excel doit donc être corrigé avant de valider l'étape 12.
