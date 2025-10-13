#!/usr/bin/env python3
"""
Generate All Games Assets Script
Automatically generates assets for all SkillBridge games
PM-001 can run this script and then validate later
"""

import subprocess
import sys
import os
import time
from pathlib import Path

class AllGamesGenerator:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.output_base = self.base_dir / "outputs"
        self.games = [
            {
                "id": "01",
                "name": "Color Matching",
                "csv": "game01_complete_spec.csv",
                "output": "game01_complete",
                "priority": 1,
                "status": "incomplete"  # Has assets but missing audio
            },
            {
                "id": "02",
                "name": "Emotion Recognition",
                "csv": "game02_emotion_recognition_spec.csv",
                "output": "game02_complete",
                "priority": 2,
                "status": "complete"  # Already done
            },
            # Add more games as CSVs are created
        ]

    def check_csv_exists(self, csv_file):
        """Check if CSV file exists"""
        csv_path = self.base_dir / csv_file
        return csv_path.exists()

    def generate_game(self, game):
        """Generate assets for a single game"""
        print(f"\n{'='*70}")
        print(f"GAME {game['id']}: {game['name']}")
        print(f"{'='*70}")

        csv_path = self.base_dir / game['csv']
        output_path = self.output_base / game['output']

        # Check if CSV exists
        if not csv_path.exists():
            print(f"⚠️  CSV not found: {csv_path}")
            print(f"   Skipping Game {game['id']} - Create CSV first")
            return False

        # Check if already complete
        if game['status'] == 'complete':
            manifest_path = output_path / "asset_manifest.json"
            if manifest_path.exists():
                print(f"✅ Game {game['id']} already complete")
                print(f"   Run with --force to regenerate")
                return True

        print(f"📄 CSV: {game['csv']}")
        print(f"📁 Output: {output_path}")
        print(f"🚀 Starting generation...\n")

        # Build command
        cmd = [
            sys.executable,
            str(self.base_dir / "production_pipeline.py"),
            str(csv_path),
            "--output", str(output_path)
        ]

        # Run generation
        start_time = time.time()
        try:
            result = subprocess.run(
                cmd,
                cwd=str(self.base_dir),
                capture_output=False,
                text=True
            )

            elapsed = time.time() - start_time

            if result.returncode == 0:
                print(f"\n✅ Game {game['id']} generation complete!")
                print(f"   Time: {elapsed/60:.1f} minutes")
                return True
            else:
                print(f"\n❌ Game {game['id']} generation failed!")
                print(f"   Check logs: {output_path}/generation.log")
                return False

        except Exception as e:
            print(f"\n❌ Error generating Game {game['id']}: {e}")
            return False

    def generate_all(self, force=False, skip_complete=True):
        """Generate assets for all games"""
        print("\n" + "="*70)
        print("SKILLBRIDGE ASSET GENERATION - ALL GAMES")
        print("="*70)

        # Check environment
        print("\n🔍 Checking environment...")
        try:
            import torch
            import diffusers
            import transformers
            print("✅ Python packages ready")
            print(f"✅ CUDA available: {torch.cuda.is_available()}")
        except ImportError as e:
            print(f"❌ Missing package: {e}")
            print("   Run: source hf-env/bin/activate")
            return False

        # Summary
        available_games = [g for g in self.games if self.check_csv_exists(g['csv'])]
        print(f"\n📊 Found {len(available_games)}/{len(self.games)} games with CSVs")

        if skip_complete:
            incomplete_games = [g for g in available_games if g['status'] != 'complete']
            print(f"📋 {len(incomplete_games)} games need generation")
        else:
            incomplete_games = available_games

        if not incomplete_games:
            print("\n✅ All games are already complete!")
            print("   Run with --force to regenerate")
            return True

        # Confirm
        print(f"\n🎯 Will generate assets for:")
        for game in incomplete_games:
            print(f"   • Game {game['id']}: {game['name']}")

        print(f"\n⏱️  Estimated time: {len(incomplete_games) * 15} minutes")
        print("   (Pipeline will resume if interrupted)\n")

        # Generate each game
        results = {}
        for game in incomplete_games:
            success = self.generate_game(game)
            results[game['id']] = success

        # Final summary
        print("\n" + "="*70)
        print("GENERATION COMPLETE")
        print("="*70)

        successful = sum(1 for r in results.values() if r)
        failed = sum(1 for r in results.values() if not r)

        print(f"\n✅ Successful: {successful}/{len(results)}")
        if failed > 0:
            print(f"❌ Failed: {failed}/{len(results)}")
            print("\nFailed games:")
            for game_id, success in results.items():
                if not success:
                    game = next(g for g in self.games if g['id'] == game_id)
                    print(f"   • Game {game_id}: {game['name']}")

        print(f"\n📁 All outputs in: {self.output_base}/")
        print("\n🔍 Next step: Validate assets")
        print(f"   python validate_assets.py outputs/game01_complete/")
        print(f"   python validate_assets.py outputs/game02_complete/")
        print("   etc.\n")

        return failed == 0

    def list_games(self):
        """List all available games and their status"""
        print("\n" + "="*70)
        print("AVAILABLE GAMES")
        print("="*70 + "\n")

        for game in self.games:
            csv_exists = "✅" if self.check_csv_exists(game['csv']) else "❌"
            status_icon = "✅" if game['status'] == 'complete' else "📋"

            print(f"Game {game['id']}: {game['name']}")
            print(f"   CSV: {csv_exists} {game['csv']}")
            print(f"   Status: {status_icon} {game['status']}")
            print(f"   Output: outputs/{game['output']}/")
            print()

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate assets for all SkillBridge games",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate all incomplete games
  python generate_all_games.py

  # List available games
  python generate_all_games.py --list

  # Regenerate all games (including complete)
  python generate_all_games.py --force

  # Generate specific game
  python production_pipeline.py game01_complete_spec.csv --output outputs/game01_complete
        """
    )

    parser.add_argument('--list', action='store_true',
                       help='List all games and their status')
    parser.add_argument('--force', action='store_true',
                       help='Regenerate all games, including complete ones')

    args = parser.parse_args()

    generator = AllGamesGenerator()

    if args.list:
        generator.list_games()
    else:
        success = generator.generate_all(
            force=args.force,
            skip_complete=not args.force
        )
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
