"""Collecte reproductible des données depuis leur source publique."""

from pathlib import Path


RAW_DIR = Path(__file__).resolve().parents[3] / "data" / "raw"


def main() -> None:
    """Télécharger ou copier la source sans modifier son contenu."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Configurer la source publique de ce pipeline.")


if __name__ == "__main__":
    main()

