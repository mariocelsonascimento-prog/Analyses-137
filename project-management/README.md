# Gestion de projet et suivi des incidents

Ce dossier définit le fonctionnement public du suivi Analyses 137. Le tableau visible sur le site est alimenté par `site/content/project-management.json`.

Chaque projet possède une couleur hexadécimale dans le champ `color`. Elle sert de repère visuel dans la liste et le Kanban, tandis que l'identifiant du projet reste toujours affiché pour garantir la compréhension et l'accessibilité.

## Workflow des tickets

1. **À étudier** : idée enregistrée, périmètre non confirmé.
2. **Planifié** : résultat attendu et priorité définis.
3. **En cours** : travail effectivement commencé.
4. **À valider** : réalisation terminée, contrôles encore nécessaires.
5. **Terminé** : livrable publié et vérifié.

Un ticket ne passe pas directement de « Planifié » à « Terminé » sans que la réalisation et sa validation puissent être constatées.

Chaque ticket doit aussi fournir une `description` compréhensible et une liste de `deliverables` vérifiables. Ces informations sont affichées dans la fenêtre de détail du Kanban.

## Identifiants

- `SITE-n` : évolution du portfolio ;
- `BOOK-BIPY-n` : projet issu du livre *Business Intelligence avec Python* ;
- `ANALYSES-n` : analyse d'un sujet de conversation ;
- `INC-n` : incident affectant le projet ou sa publication.

## Incidents

Un incident décrit son impact, sa gravité, ses dates et sa résolution. Les incidents résolus restent dans le registre afin de montrer les problèmes rencontrés et les corrections apportées.
