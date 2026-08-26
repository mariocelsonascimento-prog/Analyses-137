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

## 2026-08-25 — Début de l'analyse des mentions

La moyenne simple du taux de mentions a été calculée par secteur dans un tableau croisé de `ANALYSE_2025`, puis reproduite depuis le CSV brut.

| Secteur | Lycées | Moyenne du taux de mentions |
| --- | ---: | ---: |
| Privé sous contrat | 784 | 73,5268 % |
| Public | 1 562 | 58,0627 % |
| Ensemble | 2 346 | 63,2306 % |

L'écart moyen brut est de 15,4640 points en faveur du privé sous contrat. Dans ce calcul, chaque lycée compte autant, quel que soit le nombre de candidats. Ce premier constat doit encore être complété par le taux pondéré et par la valeur ajoutée des mentions.

## 2026-08-25 — Taux de mentions pondéré

| Secteur | Candidats présents | Somme taux x présents | Taux de mentions pondéré |
| --- | ---: | ---: | ---: |
| Privé sous contrat | 107 343 | 8 314 231 | 77,4548 % |
| Public | 403 555 | 23 352 100 | 57,8660 % |
| Ensemble | 510 898 | 31 666 331 | 61,9837 % |

L'écart pondéré est de 19,5888 points en faveur du privé sous contrat. En langage courant, environ 77 mentions sont obtenues pour 100 candidats présents dans le privé sous contrat, contre environ 58 pour 100 dans le public. Ce résultat reste brut : il ne tient pas encore compte des taux attendus selon les profils des élèves.

## 2026-08-25 — Valeur ajoutée moyenne des mentions

| Secteur | Lycées renseignés | Valeurs manquantes | VA mentions moyenne |
| --- | ---: | ---: | ---: |
| Privé sous contrat | 693 | 91 | +1,4329 point |
| Public | 1 514 | 48 | -0,9835 point |
| Ensemble | 2 207 | 139 | -0,2247 point |

L'écart entre les moyennes de valeur ajoutée est de 2,4164 points en faveur du privé sous contrat. Les valeurs vides sont exclues du calcul.

### Précaution de comparaison

L'écart brut de 19,5888 points est pondéré par les candidats, alors que l'écart de VA de 2,4164 points est une différence entre moyennes d'établissements. Ces deux nombres ne constituent donc pas une décomposition arithmétique directe. Ils indiquent toutefois que l'écart entre secteurs est nettement plus faible sur l'indicateur corrigé produit par la DEPP que sur le taux brut pondéré.

Le privé sous contrat conserve en moyenne une valeur ajoutée de mentions supérieure dans les données 2025. Cela décrit une association et ne démontre pas un effet causal du secteur.

## 2026-08-26 — Médiane de la valeur ajoutée des mentions

| Secteur | Lycées renseignés | VA mentions moyenne | VA mentions médiane |
| --- | ---: | ---: | ---: |
| Privé sous contrat | 693 | +1,43 | +2 |
| Public | 1 514 | -0,98 | -1 |

Le lycée privé sous contrat situé au milieu de son secteur obtient deux points de mentions de plus que son taux attendu. Le lycée public situé au milieu obtient un point de moins que son taux attendu.

Les moyennes et les médianes racontent ici une histoire similaire. Cela rend moins plausible une différence provenant uniquement de quelques valeurs extrêmes, mais ne remplace pas l'étude de la distribution complète.

## 2026-08-26 — Distribution de la valeur ajoutée des mentions

| Situation | Privé sous contrat | Part du privé | Public | Part du public |
| --- | ---: | ---: | ---: | ---: |
| Au-dessus de l'attendu | 402 | 58,01 % | 600 | 39,63 % |
| Au niveau attendu | 39 | 5,63 % | 96 | 6,34 % |
| En dessous de l'attendu | 252 | 36,36 % | 818 | 54,03 % |
| Total renseigné | 693 | 100,00 % | 1 514 | 100,00 % |

Les effectifs et proportions ont été reproduits directement depuis le CSV brut. Sur 100 lycées renseignés, environ 58 lycées privés sous contrat obtiennent plus de mentions qu'attendu, contre environ 40 lycées publics. À l'inverse, environ 36 lycées privés et 54 lycées publics se situent sous leur attendu.

La répartition des mentions est donc plus favorable au privé sous contrat dans les IVAL 2025. Cette observation ne permet toujours pas d'attribuer l'écart au statut de l'établissement.

## 2026-08-26 — Quartiles de la valeur ajoutée des mentions

Les quartiles inclusifs calculés dans Excel ont été reproduits depuis le CSV brut.

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| Q1 | -3 | -5 |
| Médiane | +2 | -1 |
| Q3 | +6 | +3 |

La moitié centrale des lycées privés sous contrat se situe entre 3 points sous l'attendu et 6 points au-dessus. Dans le public, elle se situe entre 5 points sous l'attendu et 3 points au-dessus. La distribution centrale du privé est donc décalée vers des valeurs plus hautes.

Les deux intervalles ont ici la même largeur de 9 points. Le décalage observé porte donc sur leur position, pas sur une différence d'étendue interquartile.

## 2026-08-26 — Valeurs extrêmes et synthèse des mentions

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| VA mentions minimum | -39 | -19 |
| Nombre de lycées au minimum | 1 | 1 |
| VA mentions maximum | +28 | +27 |
| Nombre de lycées au maximum | 2 | 2 |

Les quatre bornes ont été reproduites depuis le CSV brut. Le minimum de -39 dans le privé sous contrat ne concerne qu'un seul lycée ; il ne représente donc pas le secteur. Cette observation illustre pourquoi les extrêmes restent secondaires face à la médiane, aux quartiles et aux proportions.

### Tableau récapitulatif des mentions

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| Taux de mentions moyen | 73,53 % | 58,06 % |
| Taux de mentions pondéré | 77,45 % | 57,87 % |
| VA mentions moyenne | +1,43 | -0,98 |
| VA mentions médiane | +2 | -1 |
| Q1 | -3 | -5 |
| Q3 | +6 | +3 |
| VA > 0 | 58,01 % | 39,63 % |
| VA = 0 | 5,63 % | 6,34 % |
| VA < 0 | 36,36 % | 54,03 % |
| Minimum | -39 | -19 |
| Maximum | +28 | +27 |

Les calculs descriptifs des mentions sont désormais terminés. Dans les IVAL 2025, les taux bruts et les indicateurs corrigés sont globalement plus favorables au privé sous contrat. Cette synthèse reste une comparaison descriptive et ne démontre pas un effet causal du secteur.

## 2026-08-26 — Début de l'analyse de l'accès seconde-bac

| Secteur | Lycées | Taux d'accès moyen |
| --- | ---: | ---: |
| Privé sous contrat | 784 | 84,9707 % |
| Public | 1 562 | 85,1242 % |
| Ensemble | 2 346 | 85,0729 % |

Le taux d'accès moyen est supérieur de seulement 0,1535 point dans le public. À l'échelle de cette première comparaison descriptive, les deux secteurs sont donc presque au même niveau.

Le taux d'accès est un indicateur de parcours construit par la DEPP, et non le simple taux de réussite des candidats présents au bac. `Présents - Toutes séries` n'est pas son dénominateur : aucune moyenne pondérée avec ce champ ne sera calculée.

Ce résultat contraste avec les écarts bruts observés pour la réussite et les mentions. L'analyse doit maintenant examiner la valeur ajoutée d'accès avant d'interpréter le rôle relatif des secteurs dans les parcours jusqu'au bac.

## 2026-08-26 — Valeur ajoutée moyenne de l'accès seconde-bac

| Secteur | Lycées renseignés | Valeurs manquantes | VA accès moyenne |
| --- | ---: | ---: | ---: |
| Privé sous contrat | 693 | 91 | -2,4589 points |
| Public | 1 513 | 49 | -0,4250 point |
| Ensemble | 2 206 | 140 | -1,0639 point |

Les taux d'accès bruts moyens sont presque identiques, mais les positions par rapport aux taux attendus diffèrent. Le privé sous contrat se situe en moyenne 2,46 points sous son attendu, contre 0,42 point sous l'attendu dans le public. L'écart entre ces deux valeurs ajoutées moyennes est de 2,0339 points en faveur du public.

Sur cet indicateur de parcours, le public est donc en moyenne plus proche de son résultat attendu. Cette observation nuance les résultats de réussite et de mentions, mais ne prouve pas que le secteur public cause un meilleur accompagnement des élèves.

## 2026-08-26 — Médiane de la valeur ajoutée de l'accès

| Secteur | Lycées renseignés | VA accès moyenne | VA accès médiane |
| --- | ---: | ---: | ---: |
| Privé sous contrat | 693 | -2,46 | -1 |
| Public | 1 513 | -0,42 | 0 |

Le lycée privé sous contrat situé au milieu de son secteur se trouve un point sous son taux d'accès attendu. Le lycée public situé au milieu est exactement au niveau attendu.

Moyenne et médiane vont dans le même sens : sur l'accès seconde-bac, le public est mieux positionné relativement à l'attendu. Cette phrase décrit la position centrale des groupes et ne signifie pas que chaque lycée public fait mieux que chaque lycée privé.

## 2026-08-26 — Distribution de la valeur ajoutée de l'accès

| Situation | Privé sous contrat | Part du privé | Public | Part du public |
| --- | ---: | ---: | ---: | ---: |
| Au-dessus de l'attendu | 254 | 36,65 % | 684 | 45,21 % |
| Au niveau attendu | 53 | 7,65 % | 135 | 8,92 % |
| En dessous de l'attendu | 386 | 55,70 % | 694 | 45,87 % |
| Total renseigné | 693 | 100,00 % | 1 513 | 100,00 % |

Sur 100 lycées renseignés, environ 37 lycées privés sous contrat font mieux que leur taux d'accès attendu, contre 45 lycées publics. À l'inverse, environ 56 lycées privés se situent sous l'attendu, contre 46 lycées publics.

Cette répartition confirme le signal donné par la moyenne et la médiane : sur l'accès seconde-bac, le public est mieux positionné relativement à l'attendu dans les IVAL 2025. Il s'agit toujours d'une association descriptive.

## 2026-08-26 — Quartiles de la valeur ajoutée de l'accès

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| Q1 | -5 | -3 |
| Médiane | -1 | 0 |
| Q3 | +2 | +3 |

Les quartiles inclusifs calculés dans Excel ont été reproduits depuis le CSV brut. La moitié centrale des lycées privés sous contrat se situe entre 5 points sous l'attendu et 2 points au-dessus. Dans le public, elle se situe entre 3 points sous l'attendu et 3 points au-dessus.

La zone centrale du public est donc légèrement décalée vers le haut. Les deux intervalles se chevauchent toutefois largement : cette comparaison décrit une différence de position entre les groupes, pas une séparation nette entre tous les lycées publics et privés.

## 2026-08-26 — Valeurs extrêmes et synthèse de l'accès

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| VA accès minimum | -47 | -28 |
| Nombre de lycées au minimum | 1 | 1 |
| VA accès maximum | +11 | +16 |
| Nombre de lycées au maximum | 1 | 2 |

Le minimum de -47 dans le privé sous contrat ne concerne qu'un seul lycée. Comme les autres valeurs extrêmes, il doit rester visible pour la transparence, mais ne peut pas résumer la distribution d'un secteur.

### Tableau récapitulatif de l'accès seconde-bac

| Indicateur | Privé sous contrat | Public |
| --- | ---: | ---: |
| Taux d'accès moyen | 84,97 % | 85,12 % |
| VA accès moyenne | -2,46 | -0,42 |
| Q1 | -5 | -3 |
| Médiane | -1 | 0 |
| Q3 | +2 | +3 |
| VA > 0 | 36,65 % | 45,21 % |
| VA = 0 | 7,65 % | 8,92 % |
| VA < 0 | 55,70 % | 45,87 % |
| Minimum | -47 | -28 |
| Maximum | +11 | +16 |

Les calculs centraux vont dans la même direction : pour l'accès seconde-bac, les lycées publics sont globalement mieux positionnés relativement à leur attendu dans les IVAL 2025. Les distributions se chevauchent largement et cette comparaison ne démontre pas un effet causal du secteur.

## 2026-08-26 — Synthèse des trois dimensions

Aucun score global n'est construit : réussite, mentions et accès décrivent des dimensions différentes qui doivent rester visibles séparément.

| Indicateur | Privé sous contrat | Public | Écart privé - public |
| --- | ---: | ---: | ---: |
| VA réussite moyenne | +0,70 | -0,63 | +1,33 |
| VA réussite médiane | +1 | 0 | +1 |
| VA mentions moyenne | +1,43 | -0,98 | +2,42 |
| VA mentions médiane | +2 | -1 | +3 |
| VA accès moyenne | -2,46 | -0,42 | -2,03 |
| VA accès médiane | -1 | 0 | -1 |

Les écarts moyens sont calculés à partir des valeurs non arrondies, puis arrondis à deux décimales. Cela explique les valeurs +2,42 pour les mentions et -2,03 pour l'accès, plutôt que +2,41 et -2,04 obtenues en soustrayant les nombres déjà arrondis du tableau.

Une valeur positive indique que l'indicateur est plus favorable au privé sous contrat ; une valeur négative indique qu'il est plus favorable au public. La réussite présente un écart modéré en faveur du privé, les mentions un écart plus marqué en faveur du privé, et l'accès un écart en faveur du public.

Cette opposition est le résultat central provisoire : la réponse change selon la dimension mesurée. Résumer l'analyse par « le privé est meilleur » ou « le public est meilleur » effacerait une partie essentielle des données.

## 2026-08-26 — Début de l'analyse régionale et anomalie de comptage

Le tableau croisé régional des moyennes de VA réussite a été créé avec `Region` en lignes et `Secteur` en colonnes. Les moyennes affichées ont été retrouvées dans le CSV brut.

En revanche, le champ « Nombre de VA réussite numérique » du tableau croisé compte 784 lycées privés et 1 562 publics. Les vrais nombres de VA renseignées sont 693 et 1 514. Excel compte ici les cellules qui contiennent une formule renvoyant `""` comme des cellules présentes.

Exemples de corrections nécessaires :

| Région | Privé total | Privé avec VA | Public total | Public avec VA |
| --- | ---: | ---: | ---: | ---: |
| Auvergne-Rhône-Alpes | 102 | 92 | 176 | 175 |
| Grand Est (`GRA EST` dans la source) | 57 | 48 | 140 | 134 |
| Île-de-France | 162 | 147 | 312 | 305 |
| Normandie (`NORMAIE` dans la source) | 40 | 31 | 84 | 77 |
| Mayotte | 0 | 0 | 10 | 0 |

Mayotte affiche logiquement une moyenne non calculable : aucune des dix lignes publiques ne possède de VA réussite renseignée.

Les écarts territoriaux ne seront pas interprétés avant correction de ces effectifs. Une colonne indicatrice numérique `VA réussite disponible`, valant 1 si la VA est numérique et 0 sinon, permettra de sommer les vrais effectifs dans le tableau croisé.

## 2026-08-26 — Effectifs régionaux corrigés et vérifiés

Le tableau croisé utilise maintenant les vrais nombres de valeurs ajoutées renseignées. Les moyennes et les effectifs ont été reproduits ligne par ligne depuis le CSV brut : le total est de 693 lycées privés sous contrat et 1 514 lycées publics.

Deux anomalies de libellé existent dans la source brute : `GRA EST` et `NORMAIE`. Le fichier brut reste inchangé ; les libellés `Grand Est` et `Normandie` sont utilisés uniquement pour l'affichage public et devront être documentés dans le traitement reproductible.

Mayotte compte dix lycées publics en 2025, mais aucune valeur ajoutée de réussite exploitable. Aucune moyenne ni aucun écart ne doit donc y être affiché comme zéro.

Une comparaison est signalée comme fragile lorsqu'un secteur repose sur moins de 10 lycées renseignés. C'est le cas de la Corse, de la Guadeloupe, de la Guyane, de La Réunion et de la Martinique pour le privé sous contrat. Ce seuil est une règle de présentation prudente, pas un test statistique.

## 2026-08-26 — Règle d'interprétation régionale à 20 lycées

La règle de prudence est renforcée : une région est utilisée pour comparer les secteurs seulement si elle possède au moins 20 lycées avec une VA réussite disponible dans chacun des deux secteurs. Cette règle analytique est propre à cette publication et ne vient pas de la DEPP.

Dix régions remplissent cette condition : Auvergne-Rhône-Alpes, Bretagne, Grand Est, Hauts-de-France, Île-de-France, Normandie, Nouvelle-Aquitaine, Occitanie, Pays de la Loire et Provence-Alpes-Côte d'Azur.

| Région | Privé renseigné | Public renseigné | Écart VA réussite privé - public |
| --- | ---: | ---: | ---: |
| Auvergne-Rhône-Alpes | 92 | 175 | +1,99 |
| Bretagne | 55 | 63 | +0,80 |
| Grand Est | 48 | 134 | +1,30 |
| Hauts-de-France | 61 | 124 | +1,01 |
| Île-de-France | 147 | 305 | +1,72 |
| Normandie | 31 | 77 | +2,37 |
| Nouvelle-Aquitaine | 46 | 135 | +1,15 |
| Occitanie | 46 | 133 | +0,64 |
| Pays de la Loire | 60 | 70 | +1,97 |
| Provence-Alpes-Côte d'Azur | 58 | 101 | +1,13 |

L'écart est positif dans les dix régions retenues. Il varie de +0,64 point en Occitanie à +2,37 points en Normandie, contre +1,33 point au niveau national. La cohérence du signe montre que le résultat national n'est pas porté uniquement par une ou deux grandes régions ; l'ampleur de l'écart varie cependant selon le territoire.

Ce constat reste descriptif. Le seuil de 20 n'est ni un test de significativité ni une garantie que les différences observées ne sont pas dues à d'autres facteurs.
