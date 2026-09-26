"""
Make a web-ready copy of the hero film.

    media-originals/video/hero-loop.mp4   →   src/assets/video/hero-loop.mp4

- Cuts the sound (the film plays silently behind the title)
- Scales to 1280 px wide and drops to 25 frames a second
- Squeezes it to roughly 2-6 MB so it opens quickly on a phone
- Also writes a poster image from the first second

Run from the frontend folder:   pnpm video
Requires ffmpeg:  https://ffmpeg.org/download.html  (Windows: winget install Gyan.FFmpeg)
"""
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "media-originals" / "video"
OUT_DIR = ROOT / "src" / "assets" / "video"
MAX_MB = 8


def run(command: list[str]) -> None:
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr.strip()[-800:])
        sys.exit(f"ffmpeg failed: {' '.join(command[:3])} ...")


def main() -> None:
    if shutil.which("ffmpeg") is None:
        sys.exit(
            "ffmpeg is not installed.\n"
            "  Windows:  winget install Gyan.FFmpeg\n"
            "  macOS:    brew install ffmpeg\n"
            "Then run this again."
        )

    originals = sorted(p for p in SRC_DIR.glob("*") if p.suffix.lower() in {".mp4", ".mov", ".m4v", ".webm"})
    if not originals:
        sys.exit(f"No films found in {SRC_DIR.relative_to(ROOT)}. Put the hero film there as hero-loop.mp4")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for source in originals:
        name = source.stem.lower().replace(" ", "-")
        video_out = OUT_DIR / f"{name}.mp4"
        poster_out = OUT_DIR / f"{name}-poster.jpg"

        print(f"  {source.name} -> {video_out.relative_to(ROOT)}")
        run([
            "ffmpeg", "-y", "-i", str(source),
            "-an",                          # no sound
            "-vf", "scale=1280:-2,fps=25",
            "-c:v", "libx264", "-profile:v", "high", "-crf", "28", "-preset", "slow",
            "-movflags", "+faststart",      # starts playing before it finishes loading
            str(video_out),
        ])
        run(["ffmpeg", "-y", "-ss", "1", "-i", str(source), "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", str(poster_out)])

        size_mb = video_out.stat().st_size / 1_000_000
        note = "  (too heavy: shorten the film or lower the quality)" if size_mb > MAX_MB else ""
        print(f"    {size_mb:.1f} MB{note}")

    print("\nNext: set `heroLoop` in src/assets/videos.ts to the new file.")


if __name__ == "__main__":
    main()
