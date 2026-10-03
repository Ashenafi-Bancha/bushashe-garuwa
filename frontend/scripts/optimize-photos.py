"""
Make web-ready copies of the Bushaashe Garuwa photos.

    photos-originals/<section>/<name>.png|jpg   →   src/assets/photos/<section>/<name>.webp
                                                    src/assets/photos/<section>/<name>-small.webp
                                                    src/assets/photos/<section>/<name>-phone.webp

- Fixes rotation from phone cameras, removes location/camera data (EXIF)
- Resizes so the longest side is at most 1920 px, saves as WebP (~150–500 KB)
- Also saves two lighter copies for phones, 1200 px wide (~100–300 KB) and 800 px
  wide (~60–150 KB); the site hands each screen the one that suits it (see
  `picture` in src/assets/photos.ts)
- File names become web-friendly: "Coffee Ceremony 1.JPG" → "coffee-ceremony-1.webp"
- Skips photos that are already up to date; use --force to redo everything

Run from the project folder:   pnpm photos      (or: python scripts/optimize-photos.py)
Requires Pillow:                pip install Pillow
"""
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "photos-originals"
OUT_DIR = ROOT / "src" / "assets" / "photos"
MAX_SIDE = 1920
QUALITY = 84
# the lighter copies for phones: (name suffix, width, quality). Sharp on the screens they are
# sent to, at a third to a sixth of the weight.
LIGHTER = [("small", 1200, 80), ("phone", 800, 78)]
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
SKIP_DIRS = {"brand"}  # logo master; the site uses src/assets/brand/logo.png


def web_name(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "photo"


def convert(src: Path, dst: Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            background = Image.new("RGB", im.size, (255, 255, 255))
            background.paste(im, mask=im.split()[-1])
            im = background
        else:
            im = im.convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, "WEBP", quality=QUALITY, method=6)
        for suffix, width, quality in LIGHTER:
            copy = dst.with_name(f"{dst.stem}-{suffix}.webp")
            if im.width > width:
                im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).save(copy, "WEBP", quality=quality, method=6)
            elif copy.exists():
                copy.unlink()


def main() -> None:
    force = "--force" in sys.argv
    sources = sorted(
        p for p in SRC_DIR.rglob("*")
        if p.suffix.lower() in EXTENSIONS and p.relative_to(SRC_DIR).parts[0] not in SKIP_DIRS
    )
    expected = set()
    made = skipped = 0

    for src in sources:
        rel_dir = src.parent.relative_to(SRC_DIR)
        dst = OUT_DIR / rel_dir / f"{web_name(src.stem)}.webp"
        if dst in expected:
            print(f"  ! name clash, skipped: {src.relative_to(ROOT)} (rename it)")
            continue
        expected.add(dst)
        expected.update(dst.with_name(f"{dst.stem}-{suffix}.webp") for suffix, _, _ in LIGHTER)
        if not force and dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            skipped += 1
            continue
        convert(src, dst)
        made += 1
        print(f"  + {dst.relative_to(ROOT).as_posix()}  "
              f"({src.stat().st_size // 1024} KB -> {dst.stat().st_size // 1024} KB)")

    orphans = [p for p in OUT_DIR.rglob("*") if p.suffix in (".jpg", ".webp") and p not in expected]
    for p in orphans:
        print(f"  ? no original found for {p.relative_to(ROOT).as_posix()} — delete it if the photo was removed")

    print(f"\nDone: {made} converted, {skipped} already up to date.")
    if made:
        print("Next: register new photos in src/assets/photos.ts to use them on the site.")


if __name__ == "__main__":
    main()
