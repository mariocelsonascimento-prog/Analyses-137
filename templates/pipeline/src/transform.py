"""Nettoyage et transformation reproductibles des données."""

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"


def main() -> None:
    """Lire les données brutes et produire une version traitée."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Implémenter les règles de nettoyage documentées.")


if __name__ == "__main__":
    main()

