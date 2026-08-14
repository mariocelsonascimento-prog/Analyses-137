# Commentaires GitHub et modération

Les commentaires utilisent exclusivement les GitHub Issues du dépôt public.

## Parcours

1. Le visiteur ouvre le formulaire `Proposer un commentaire`.
2. Il choisit un projet, indique un pseudonyme et rédige son commentaire.
3. L'issue reçoit automatiquement le label `comment-pending`.
4. Après vérification, le propriétaire remplace ce label par `comment-approved` ou `comment-rejected`.
5. Le site interroge l'API publique GitHub et affiche uniquement les issues ouvertes portant `comment-approved`.

## Approuver un commentaire

Dans l'issue GitHub :

1. retirer `comment-pending` ;
2. ajouter `comment-approved` ;
3. laisser l'issue ouverte pour qu'elle reste visible sur le site.

Pour refuser un commentaire, utiliser `comment-rejected`. Une issue fermée n'est pas affichée.

## Vie privée

Une issue d'un dépôt public est visible dès sa création. Le formulaire avertit donc explicitement les visiteurs de ne publier aucune donnée confidentielle. Il ne demande aucune adresse e-mail ni coordonnée de contact. Le site lit uniquement le projet, le pseudonyme et le commentaire.
