"""Contrôles qualité appliqués aux données traitées."""

from pathlib import Path


PROCESSED_DIR = Path(__file__).resolve().parents[3] / "data" / "processed"


def main() -> None:
    """Vérifier schéma, doublons, valeurs manquantes et plages métier."""
    if not PROCESSED_DIR.exists():
        raise FileNotFoundError("Exécuter le traitement avant la validation.")
    raise NotImplementedError("Ajouter les contrôles propres au jeu de données.")


if __name__ == "__main__":
    main()

