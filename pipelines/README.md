# Pipelines de données

Ce dossier contient le code public utilisé pour collecter, nettoyer, valider et exporter les données des analyses.

## Structure attendue

```text
pipelines/<sujet>/
|-- README.md
|-- requirements.txt
|-- src/
|   |-- extract.py
|   |-- transform.py
|   `-- validate.py
`-- tests/
```

Chaque pipeline doit pouvoir être exécuté indépendamment du site et ne doit jamais modifier les fichiers de `data/raw/`.

