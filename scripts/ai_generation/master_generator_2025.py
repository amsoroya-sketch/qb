#!/usr/bin/env python3
"""
Master Asset Generator - October 2025
Orchestrates generation of ALL assets: images, 3D models, and audio

Uses:
- FLUX.1 [schnell] for images (Apache 2.0)
- Roblox Cube 3D for 3D models (Open Source)
- Stable Audio Open for SFX & music (CC-BY-SA 4.0)
- Bark for voice synthesis (MIT)

ALL 100% COMMERCIAL-SAFE
"""

import argparse
import subprocess
from pathlib import Path
import pandas as pd
from datetime import datetime
import json

class MasterAssetGenerator2025:
    def __init__(self, game_id: str, asset_spec: str, output_dir: str):
        self.game_id = game_id
        self.asset_spec = Path(asset_spec)
        self.output_dir = Path(output_dir)
        self.script_dir = Path(__file__).parent

        # Create output structure
        self.image_dir = self.output_dir / game_id / "images"
        self.model_3d_dir = self.output_dir / game_id / "3d_models"
        self.audio_dir = self.output_dir / game_id / "audio"

        self.image_dir.mkdir(parents=True, exist_ok=True)
        self.model_3d_dir.mkdir(parents=True, exist_ok=True)
        self.audio_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n{'='*70}")
        print(f"  MASTER ASSET GENERATOR - OCTOBER 2025")
        print(f"  Game: {self.game_id}")
        print(f"  Spec: {self.asset_spec}")
        print(f"{'='*70}\n")

    def separate_assets(self):
        """Separate asset specs into images, 3D models, and audio"""
        print("Analyzing asset specifications...")

        df = pd.read_csv(self.asset_spec)

        # Separate by type
        images = df[df['type'].str.contains('image|sprite|background|ui', case=False, na=False)]
        models_3d = df[df['type'].str.contains('3d|model|object|mesh', case=False, na=False)]
        audio = df[df['type'].str.contains('audio|sound|music|voice|sfx', case=False, na=False)]

        # Save temporary CSVs
        image_csv = self.output_dir / f"{self.game_id}_images.csv" if not images.empty else None
        model_3d_csv = self.output_dir / f"{self.game_id}_3d_models.csv" if not models_3d.empty else None
        audio_csv = self.output_dir / f"{self.game_id}_audio.csv" if not audio.empty else None

        if not images.empty:
            images.to_csv(image_csv, index=False)
            print(f"  • {len(images)} images to generate")

        if not models_3d.empty:
            models_3d.to_csv(model_3d_csv, index=False)
            print(f"  • {len(models_3d)} 3D models to generate")

        if not audio.empty:
            audio.to_csv(audio_csv, index=False)
            print(f"  • {len(audio)} audio clips to generate")

        print()

        return image_csv, model_3d_csv, audio_csv

    def generate_images(self, image_csv: Path) -> bool:
        """Generate all images using FLUX.1"""
        print(f"\n{'='*70}")
        print(f"GENERATING IMAGES (FLUX.1)")
        print(f"{'='*70}\n")

        cmd = [
            "python3",
            str(self.script_dir / "generate_images_flux.py"),
            "--input", str(image_csv),
            "--output", str(self.image_dir)
        ]

        result = subprocess.run(cmd, capture_output=False)
        return result.returncode == 0

    def generate_3d_models(self, model_csv: Path) -> bool:
        """Generate all 3D models using Cube 3D"""
        print(f"\n{'='*70}")
        print(f"GENERATING 3D MODELS (Cube 3D)")
        print(f"{'='*70}\n")

        cmd = [
            "python3",
            str(self.script_dir / "generate_3d_models.py"),
            "--input", str(model_csv),
            "--output", str(self.model_3d_dir)
        ]

        result = subprocess.run(cmd, capture_output=False)
        return result.returncode == 0

    def generate_audio(self, audio_csv: Path) -> bool:
        """Generate all audio using Stable Audio + Bark"""
        print(f"\n{'='*70}")
        print(f"GENERATING AUDIO (Stable Audio + Bark)")
        print(f"{'='*70}\n")

        cmd = [
            "python3",
            str(self.script_dir / "generate_audio_unified.py"),
            "--input", str(audio_csv),
            "--output", str(self.audio_dir)
        ]

        result = subprocess.run(cmd, capture_output=False)
        return result.returncode == 0

    def create_manifest(self):
        """Create comprehensive asset manifest JSON"""
        manifest = {
            "game_id": self.game_id,
            "generated_at": datetime.now().isoformat(),
            "generator_version": "October 2025",
            "tools_used": {
                "images": "FLUX.1 [schnell] (Apache 2.0)",
                "3d_models": "Roblox Cube 3D (Open Source)",
                "audio_sfx": "Stable Audio Open (CC-BY-SA 4.0)",
                "audio_music": "Stable Audio Open (CC-BY-SA 4.0)",
                "audio_voice": "Bark (MIT License)"
            },
            "commercial_safe": True,
            "images": [],
            "3d_models": [],
            "audio": []
        }

        # Collect image files
        for img in self.image_dir.rglob("*.png"):
            manifest["images"].append({
                "asset_id": img.stem,
                "path": str(img.relative_to(self.output_dir)),
                "size_kb": img.stat().st_size // 1024,
                "format": "png"
            })

        # Collect 3D model files
        for model in self.model_3d_dir.rglob("*"):
            if model.suffix in ['.obj', '.glb', '.fbx']:
                manifest["3d_models"].append({
                    "asset_id": model.stem,
                    "path": str(model.relative_to(self.output_dir)),
                    "size_kb": model.stat().st_size // 1024,
                    "format": model.suffix[1:]  # Remove the dot
                })

        # Collect audio files
        for aud in self.audio_dir.rglob("*.wav"):
            manifest["audio"].append({
                "asset_id": aud.stem,
                "path": str(aud.relative_to(self.output_dir)),
                "size_kb": aud.stat().st_size // 1024,
                "type": aud.parent.name,  # sfx, music, or voice
                "format": "wav"
            })

        # Save manifest
        manifest_path = self.output_dir / self.game_id / "asset_manifest.json"
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        print(f"\n✓ Manifest created: {manifest_path}")
        return manifest

    def run(self):
        """Execute full generation pipeline"""
        start_time = datetime.now()

        # Separate assets
        image_csv, model_3d_csv, audio_csv = self.separate_assets()

        # Generate images
        if image_csv:
            success = self.generate_images(image_csv)
            if not success:
                print("⚠️ Image generation had errors")

        # Generate 3D models
        if model_3d_csv:
            success = self.generate_3d_models(model_3d_csv)
            if not success:
                print("⚠️ 3D model generation had errors")

        # Generate audio
        if audio_csv:
            success = self.generate_audio(audio_csv)
            if not success:
                print("⚠️ Audio generation had errors")

        # Create manifest
        manifest = self.create_manifest()

        # Summary
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        print(f"\n{'='*70}")
        print(f"  GENERATION COMPLETE")
        print(f"{'='*70}")
        print(f"\nGame: {self.game_id}")
        print(f"Images: {len(manifest['images'])}")
        print(f"3D Models: {len(manifest['3d_models'])}")
        print(f"Audio: {len(manifest['audio'])}")
        print(f"Duration: {duration:.1f} seconds ({duration/60:.1f} minutes)")
        print(f"\nOutput: {self.output_dir / self.game_id}")
        print(f"\n{'='*70}\n")

        print("Next Steps:")
        print("  1. Review generated assets")
        print("  2. Import to Godot project:")
        print(f"     cd {self.output_dir / self.game_id}")
        print("     bash import_to_godot.sh")
        print()

def main():
    parser = argparse.ArgumentParser(
        description='Master asset generator for games (October 2025)',
        epilog='Uses: FLUX.1 (images), Cube 3D (3D models), Stable Audio + Bark (audio) - All commercial-safe'
    )
    parser.add_argument('--game-id', required=True, help='Game identifier (e.g., game_005_emotion_matching)')
    parser.add_argument('--assets', required=True, help='Path to asset specifications CSV')
    parser.add_argument('--output', default='~/ai-tools/outputs', help='Output directory')

    args = parser.parse_args()

    # Expand paths
    output_dir = Path(args.output).expanduser()

    # Run generator
    generator = MasterAssetGenerator2025(args.game_id, args.assets, output_dir)
    generator.run()

if __name__ == "__main__":
    main()
