# Classeur de travail reçu le 2026-09-23

- Fichier : [IVAL_2025_ANALYSE.xlsx](IVAL_2025_ANALYSE.xlsx).
- Nom reçu : `IVAL_2025_ANALYSE.xlsx.xlsx`.
- Taille : 12 273 900 octets.
- SHA-256 : `2631C1D557541438C6BFAE3C51F04DF07155115CC6AB2A899F17FF2C112CF5C6`.
- Conservation : copie binaire identique, seule la double extension du nom a été supprimée.
- Nature : classeur de travail de Mario, comprenant les données de référence, les préparations Excel et les tableaux d'analyse. Il ne remplace pas le CSV officiel archivé dans `data/raw/`.
- Publication : conservé dans le dépôt source, hors du dossier `site/`.

## Feuilles présentes

| Feuille | Plage utilisée déclarée | Observation |
| --- | --- | --- |
| Détails1 | A1:CN1565 | Feuille de détail intermédiaire |
| Feuil1 | A1:F11 | Tableau intermédiaire |
| in | A1:CN32486 | Données historiques et colonnes de travail |
| DATA_2025 | A1:AB2347 | 2 346 lycées et 28 colonnes |
| ANALYSE_2025 | A1:J161 | Calculs nationaux et tableaux régionaux, jusqu'aux mentions |

La feuille `in` contient des calculs ajoutés : elle ne doit pas être considérée comme une copie brute intacte. Le CSV du dépôt reste la référence.

## Contrôle effectué le 2026-09-23

Lecture des cellules, des formules et des valeurs enregistrées dans le fichier XLSX, puis rapprochement par UAI avec le CSV officiel archivé, filtré sur 2025. Les valeurs calculées enregistrées ont été comparées à des calculs indépendants. Le classeur n'a pas été modifié, recalculé dans Excel ni vérifié visuellement dans cette intervention.

### Données et calculs vérifiés

- `DATA_2025!A2:B2347` : uniquement 2025, 2 346 UAI uniques, aucun lycée absent par rapport au CSV de 2025.
- `DATA_2025!D2:D2347` : 784 privés sous contrat et 1 562 publics.
- Identité, secteur et libellés de localisation comparés : concordance avec le CSV. Les types des codes géographiques nécessitent les corrections ci-dessous.
- `DATA_2025!L2:R2347` : présents, taux observés et valeurs ajoutées conformes à la source, après conversion numérique pour le rapprochement.
- `DATA_2025!S2:X2347` : les six conversions numériques conservent les valeurs et les absences.
- `DATA_2025!Y2:AA2347` : taux attendus conformes à « observé − VA », avec propagation des absences.
- `DATA_2025!AB2:AB2347` : mentions pondérées conformes au produit du taux de mentions par les présents.
- Taux observés et attendus : toutes les valeurs renseignées sont comprises entre 0 et 100.
- Aucune cellule d'erreur enregistrée dans `DATA_2025`.
- `ANALYSE_2025!A143:G161` : moyennes par secteur et effectifs régionaux des mentions conformes au CSV. Les totaux sont 693 privés, 1 514 publics et 2 207 VA disponibles. Les moyennes concordent à 0,0000000001 point près.

| Indicateur | VA absentes | Taux attendus absents |
| --- | ---: | ---: |
| Réussite | 139 | 139 |
| Accès seconde-bac | 140 | 140 |
| Mentions | 139 | 139 |

Ces absences restent distinctes d'une valeur numérique égale à zéro.

## Points à corriger dans une prochaine version

### Codes géographiques

Les colonnes `E` (commune), `G` (département) et `J` (région) contiennent majoritairement des nombres, au format Général. La représentation diffère du CSV pour 126 codes commune, 126 codes département et 95 codes région, du fait des zéros initiaux.

Exemple : `DATA_2025!E2` contient `1034` au lieu de `01034` et `G2` contient `1` au lieu de `01`. Récupérer les codes sous forme de texte depuis le CSV, par jointure sur UAI et année. Mettre simplement une cellule existante au format Texte ne reconstitue pas les zéros perdus. Préserver aussi les codes alphanumériques corses.

### Synthèse calculée depuis des nombres déjà arrondis

Dans `ANALYSE_2025!B88:E94`, certaines moyennes ont été saisies en valeurs arrondies avant le calcul des écarts.

| Cellule | Valeur enregistrée | Écart calculé avant arrondi |
| --- | ---: | ---: |
| E91 — mentions | +2,41 | +2,42 points |
| E93 — accès | −2,04 | −2,03 points |

`E91` utilise `=C91-D91`, avec `1,43` et `−0,98` saisis en dur. Les moyennes précises sont déjà disponibles en `C40` et `C41`. Relier les synthèses aux calculs précis, puis appliquer un affichage à deux décimales, sans arrondir les entrées. Le même principe s'applique à l'accès. Le site affiche déjà les écarts calculés avant arrondi.

### Moyennes non déterminées à Mayotte

Les six erreurs enregistrées dans `ANALYSE_2025` sont situées en `E111`, `G111`, `E132`, `F132`, `D155` et `F155`. Elles concernent Mayotte, sans VA disponible pour les moyennes présentées.

Prévoir un affichage explicite « Non déterminé » et empêcher le calcul d'un écart lorsque l'une des moyennes est indisponible. Ne pas remplacer ces erreurs par zéro.

### Effectifs pour l'analyse de la taille des lycées

`DATA_2025` conserve 18 champs de la source, six conversions, trois taux attendus et les mentions pondérées. Les trois champs initialement prévus — `Effectif de seconde`, `Effectif de premiere`, `Effectif de terminale` — ne sont pas encore présents. Ils seront nécessaires si l'analyse utilise ces effectifs pour comparer la taille des lycées.

## Limite de validation

Ce contrôle valide les données et les résultats enregistrés dans les plages indiquées. Il ne constitue pas un test d'actualisation des tableaux croisés ou de recalcul dans Excel. Les étapes de préparation et de contrôle qualité restent en cours tant que les corrections, l'export préparé et le traitement reproductible complet ne sont pas livrés.
