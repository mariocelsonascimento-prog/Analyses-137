# Méthodologie prévue

## Principe d'interprétation

La valeur ajoutée est la différence entre le taux observé et le taux attendu. Par conséquent :

```text
taux attendu = taux observé - valeur ajoutée
```

Lorsque la valeur ajoutée n'est pas déterminée, le taux attendu calculé restera nul. Ces absences ne seront jamais remplacées par zéro.

## Comparaisons prévues

- décrire le lycée typique avec médiane, quartiles et distributions ;
- décrire le résultat global des candidats avec des taux pondérés par le nombre de présents ;
- ne pas pondérer automatiquement le taux d'accès par les présents au bac ;
- analyser conjointement la réussite, les mentions et l'accès ;
- afficher les effectifs et les valeurs non déterminées avec chaque comparaison territoriale.

## Garde-fous

- aucune jointure sur le nom du lycée : utiliser `Année + UAI` ;
- conserver les codes commune, département et région sous forme de texte ;
- contrôler que les taux se situent entre 0 et 100 ;
- ne pas transformer l'analyse en classement d'établissements ;
- distinguer systématiquement association observée et causalité.

## Livrables Tableau prévus

1. Vue d'ensemble : indicateurs nationaux, secteurs, distributions et territoire.
2. Observé contre attendu : un point par lycée et une diagonale de référence.
3. Analyse territoriale : valeurs ajoutées et écarts public-privé avec effectifs.
