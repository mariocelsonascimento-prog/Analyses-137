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

### Correction validée

Le tableau croisé Excel a été corrigé et affiche maintenant :

- privé sous contrat : 0,698412698 ;
- public : -0,627476882 ;
- moyenne générale des établissements renseignés : -0,21146353.

L'étape 12 est validée. L'écart entre les moyennes de valeur ajoutée de réussite est de 1,3259 point en faveur du privé sous contrat. Cette moyenne reste descriptive et devra être complétée par les médianes, les distributions et les effectifs non renseignés.

## 2026-08-25 — Copie de travail Excel et feuille DATA_2025

### Organisation validée dans Excel Online

- création de la copie `IVAL_2025_ANALYSE.xlsx` ;
- conservation de la feuille source complète sans suppression de colonnes ;
- création d'une feuille dédiée `DATA_2025` ;
- copie des seules lignes de 2025 ;
- ajout des 11 champs d'identification et de localisation ;
- ajout des 7 indicateurs globaux de réussite, d'accès et de mentions.

### Champs numériques validés

- `Taux réussite numérique` ;
- `VA réussite numérique` ;
- `Taux accès 2nde-bac numérique` ;
- `VA accès 2nde-bac numérique` ;
- `Taux mentions numérique` ;
- `VA mentions numérique`.

Les conversions ont été contrôlées avec la fonction `TYPE` d'Excel. Les valeurs ajoutées absentes restent vides.

### Taux attendus validés

Les trois champs sont calculés avec la relation `taux attendu = taux observé - valeur ajoutée` :

- `Taux réussite attendu` ;
- `Taux accès 2nde-bac attendu` ;
- `Taux mentions attendu`.

Si le taux observé ou la valeur ajoutée est vide, le taux attendu reste vide.

### Reste à rendre reproductible

Cette préparation a été validée manuellement dans Excel Online, mais le classeur n'est pas encore présent dans le dépôt. Un export de `DATA_2025` et un script permettant de le reconstruire depuis le CSV brut restent nécessaires pour terminer le ticket de traitement.

## 2026-08-25 — Feuille de synthèse ANALYSE_2025

Une feuille `ANALYSE_2025` distincte de la table détaillée a été créée. Elle contient les résultats calculés et référence directement `DATA_2025`, sans dupliquer les 2 346 lignes.

Le premier tableau calcule la médiane de la valeur ajoutée de réussite en excluant les cellules vides avec `MEDIANE` et `FILTRE`.

### Contrôle indépendant depuis le CSV brut

| Secteur | Lycées renseignés | Médiane VA réussite |
| --- | ---: | ---: |
| Privé sous contrat | 693 | +1 point |
| Public | 1 514 | 0 point |

La médiane décrit le lycée typique de chaque secteur et complète la moyenne. Elle ne suffit pas encore à caractériser la distribution complète.

## 2026-08-25 — Position par rapport au taux attendu

Les lycées disposant d'une valeur ajoutée de réussite ont été répartis selon le signe de cette valeur.

| Situation | Privé sous contrat | Part du privé | Public | Part du public |
| --- | ---: | ---: | ---: | ---: |
| VA > 0 | 420 | 60,61 % | 479 | 31,64 % |
| VA = 0 | 187 | 26,98 % | 284 | 18,76 % |
| VA < 0 | 86 | 12,41 % | 751 | 49,60 % |
| Total renseigné | 693 | 100,00 % | 1 514 | 100,00 % |

Les six effectifs et leurs proportions ont été reproduits directement depuis le CSV brut. La distribution est plus favorable au privé sous contrat dans les données 2025. Ce constat descriptif ne mesure pas un effet causal du secteur et n'élimine pas les autres effets de composition.

## 2026-08-25 — Quartiles de la valeur ajoutée de réussite

Les quartiles inclusifs ont été calculés dans `ANALYSE_2025` en excluant les valeurs vides, puis reproduits depuis le CSV brut avec la même convention d'interpolation qu'Excel.

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| Q1 | 0 | -2 |
| Médiane | 1 | 0 |
| Q3 | 1 | 1 |

Les 50 % centraux se situent donc entre 0 et +1 point dans le privé sous contrat, contre -2 à +1 points dans le public. Le secteur public présente une partie basse de distribution plus défavorable ; un box plot permettra ensuite de rendre cette dispersion visible.

## 2026-08-25 — Valeurs extrêmes et synthèse de la réussite

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| VA minimum | -8 | -16 |
| VA maximum | +10 | +36 |

Ces quatre valeurs ont été reproduites depuis le CSV brut. Chaque extrême peut ne concerner qu'un seul établissement : les bornes observées ne doivent donc pas être utilisées seules pour comparer les secteurs. L'étendue plus large du public signale des queues de distribution plus éloignées, tandis que l'écart interquartile confirme aussi une plus grande dispersion centrale : 3 points dans le public contre 1 point dans le privé sous contrat.

### Tableau récapitulatif provisoire

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| Réussite brute moyenne | 98,74 % | 94,60 % |
| Réussite pondérée | 99,13 % | 94,49 % |
| VA moyenne | +0,70 | -0,63 |
| VA médiane | +1 | 0 |
| Q1 | 0 | -2 |
| Q3 | +1 | +1 |
| VA > 0 | 60,61 % | 31,64 % |
| VA = 0 | 26,98 % | 18,76 % |
| VA < 0 | 12,41 % | 49,60 % |
| Minimum | -8 | -16 |
| Maximum | +10 | +36 |

Cette synthèse clôt le premier calcul descriptif de la réussite au bac. Elle sera complétée par les visualisations et par les indicateurs de mentions et d'accès avant la conclusion générale.
