# Lycées publics et privés sous contrat en 2025

## Question

Les lycées privés sous contrat conservent-ils de meilleurs résultats que les lycées publics lorsque l'on tient compte des résultats attendus selon le profil de leurs élèves ?

Cette analyse comparera des écarts observés. Elle ne cherchera pas à prouver que le secteur de l'établissement cause les résultats.

## Statut

**Cadrage et archivage de la source terminés. Préparation des données à venir.**

Aucun résultat comparatif n'est encore publié.

## Périmètre de la première version

- session 2025 ;
- lycées généraux et technologiques en France ;
- secteurs public et privé sous contrat ;
- indicateurs « Toutes séries » ;
- réussite, mentions et accès de la seconde au baccalauréat ;
- comparaisons nationales puis territoriales.

Les anciennes séries L, ES et S et les filières détaillées sont exclues de cette première version.

## Sous-questions

1. Les résultats bruts diffèrent-ils entre les deux secteurs ?
2. Les résultats attendus diffèrent-ils également ?
3. Les valeurs ajoutées diffèrent-elles ?
4. La conclusion est-elle la même pour la réussite, les mentions et l'accès au bac ?
5. Les écarts varient-ils selon les académies ou les régions ?
6. Les résultats changent-ils selon la taille du lycée ?

## Données

- producteur : DEPP, ministère chargé de l'Éducation nationale ;
- jeu : Indicateurs de valeur ajoutée des lycées d'enseignement général et technologique ;
- couverture : 2012–2025 ;
- licence : Licence Ouverte 2.0 ;
- fichier brut archivé : `data/raw/fr-en-indicateurs-de-resultat-des-lycees-gt_v2.csv` ;
- empreinte SHA-256 : `EC5FF514E63B9FD1F152AB8844ACC87315C65DABFDAC4073F9B4890E438F703C`.

Le fichier brut est conservé sans modification. Tous les futurs traitements écriront leurs résultats dans `data/processed/`.

## Contrôles initiaux reproduits le 2026-08-25

- 32 485 lignes et 88 colonnes ;
- années 2012 à 2025 ;
- aucune clé `Année + UAI` dupliquée ;
- 2 346 lycées en 2025 : 1 562 publics et 784 privés sous contrat ;
- aucun taux brut manquant en 2025 pour la réussite, les mentions ou l'accès ;
- 139 valeurs ajoutées manquantes pour la réussite et les mentions, 140 pour l'accès.

Les valeurs ajoutées absentes resteront nulles et seront présentées comme « Non déterminé », jamais comme zéro.

## Prochain livrable

Produire `data/processed/ival_lycees_2025_prepare.csv` à l'aide d'un script public, avec uniquement 2025 et les 21 colonnes retenues, puis exécuter les contrôles qualité avant toute visualisation.

## Sources officielles

- [Catalogue data.education.gouv.fr](https://data.education.gouv.fr/explore/dataset/fr-en-indicateurs-de-resultat-des-lycees-gt_v2/)
- [Présentation des IVAL par le ministère](https://www.education.gouv.fr/depp/les-indicateurs-de-resultats-des-colleges-et-des-lycees-377729)
- [Guide méthodologique IVAL 2025](https://www.education.gouv.fr/sites/default/files/document/Depp_Guide_m%C3%A9thodologique_IVAL_2025.pdf-515489.pdf)
