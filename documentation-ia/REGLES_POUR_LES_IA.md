# Règles pour les assistants IA

## Avant toute modification

1. Lire la demande actuelle et déterminer si elle autorise une modification ou demande seulement une explication.
2. Consulter les fichiers sources concernés avant de proposer une solution.
3. Vérifier l'état Git et préserver les changements du propriétaire.
4. Identifier si la modification touche le site public, les données, un rapport ou seulement la documentation interne.

## Données et résultats

- Ne jamais modifier un fichier de données brutes.
- Produire les transformations dans un fichier préparé ou par un script reproductible.
- Ne jamais remplacer une valeur manquante par zéro sans justification méthodologique.
- Vérifier les totaux, types, doublons, valeurs manquantes et bornes avant publication.
- Distinguer moyenne simple, médiane, quartiles et moyenne pondérée.
- Ne pas inventer de résultat lorsque le calcul ou la source n'est pas disponible.
- Citer la source, sa date, sa version et ses limites.

## Rédaction publique

- Poser clairement la question avant d'afficher les chiffres.
- Expliquer les valeurs pour un public non spécialiste.
- Utiliser des exemples lorsque cela facilite la compréhension, sans rendre le texte répétitif.
- Ne pas confondre association et causalité.
- Éviter les formulations comme « le privé est meilleur » lorsqu'un indicateur particulier ou un périmètre précis est réellement mesuré.
- Signaler qu'une étude d'entraînement est fictive.
- Ne pas présenter une hypothèse comme une cause démontrée.

## Interface et accessibilité

- Préserver les versions ordinateur et mobile.
- Tester les largeurs étroites sans dégrader la version de bureau.
- Garder des titres visibles et une hiérarchie sémantique correcte.
- Ne pas transmettre une information uniquement par la couleur.
- Conserver la navigation au clavier, les libellés accessibles et un focus visible.
- Pour les longues pages, privilégier des chapitres clairs plutôt qu'un défilement inutilement long.
- Vérifier les visualisations interactives après chaque changement : sélection, réinitialisation, filtres et absence de chevauchement.

## Modifications du site

- Le site est statique : HTML, CSS, JavaScript et JSON doivent fonctionner sans serveur applicatif.
- Ne pas ajouter de dépendance, service tiers, outil de suivi ou collecte de données sans demande explicite.
- Ne pas publier `documentation-ia/` dans `site/`.
- Incrémenter les paramètres de version des fichiers CSS ou JavaScript lorsqu'un cache navigateur pourrait masquer une modification.
- Tester localement, puis vérifier le déploiement GitHub Pages lorsque la publication est demandée.

## Git et gestion du projet

- Utiliser des messages de commit courts et explicites en français.
- Ne pas supprimer ou réécrire des changements existants sans autorisation.
- Mettre à jour `site/content/project-management.json` uniquement lorsque l'état réel d'une tâche change.
- Une tâche terminée doit correspondre à un livrable effectivement réalisé et vérifié.

## Fichiers Power BI, Excel et autres binaires

- Ne pas prétendre avoir modifié ou vérifié visuellement un fichier binaire sans l'avoir réellement ouvert dans l'outil adapté.
- Conserver une copie source et une copie publique uniquement lorsque le projet le prévoit.
- Vérifier la cohérence entre les mesures du rapport, les données préparées et les chiffres affichés sur le site.
- Documenter les mesures DAX ou transformations importantes dans le README de l'analyse.

## Fin d'intervention

Indiquer clairement :

- ce qui a été modifié ;
- ce qui a été vérifié ;
- ce qui reste à faire ou dépend du propriétaire ;
- si la modification est seulement locale, poussée sur GitHub ou publiée sur GitHub Pages.

