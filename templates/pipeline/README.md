# Pipeline — nom du sujet

## Objectif

Décrire les données préparées et les analyses qui les utilisent.

## Entrées

- Fiche du catalogue : `data/catalog/identifiant.yml`
- Fichier brut : `data/raw/fichier-source.csv`

## Sorties

- Fichier traité : `data/processed/fichier-traite.csv`

## Environnement

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
```

## Exécution

```powershell
py src/transform.py
py src/validate.py
```

## Transformations

Documenter ici les renommages, filtres, jointures, valeurs manquantes, agrégations et hypothèses métier.

## Contrôles qualité

Documenter les règles testées et le résultat attendu.

