# Gouvernance des données

## Métadonnées obligatoires

Chaque jeu de données doit indiquer : producteur, URL officielle, licence, version ou période, dates de publication et de récupération, format, encodage, empreinte SHA-256, transformations, limites, biais connus et présence éventuelle de données personnelles.

## Règles

- `data/raw/` conserve les sources publiques sans modification.
- `data/processed/` conserve les résultats reproductibles.
- Une source sans licence claire peut être référencée sans être redistribuée.
- Les données personnelles ou confidentielles ne sont jamais publiées.
- Une mise à jour conserve un historique de version utile.
- Chaque affirmation et graphique cite sa source au plus près.

## Reproductibilité

- Tout fichier de `data/processed/` doit pouvoir être recréé par un pipeline public.
- Le pipeline conserve les données brutes en lecture seule.
- Les dépendances et leurs versions sont déclarées.
- Les étapes de nettoyage sont déterministes ou documentent leur part d'aléatoire.
- Les contrôles qualité vérifient au minimum le schéma, les doublons, les valeurs manquantes et les plages attendues.
- Le README du pipeline indique les entrées, sorties et commandes exactes.
