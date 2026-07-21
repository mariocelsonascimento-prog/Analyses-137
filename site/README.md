# Site Analyses 137

Site statique déployé automatiquement avec GitHub Pages.

## Aperçu local

Depuis la racine du dépôt :

```powershell
py -m http.server 4173 --directory site
```

Puis ouvrir `http://127.0.0.1:4173`.

## Ajouter une analyse au catalogue

Modifier `content/analyses.json`. Une fiche complète pourra ensuite utiliser le même identifiant comme nom de dossier dans `analyses/`.

