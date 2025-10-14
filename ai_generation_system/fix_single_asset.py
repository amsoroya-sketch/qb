#!/usr/bin/env python3
"""
Fix Single Asset - Simple Script
Just specify the asset filename and it finds and regenerates it
"""

import json
import sys
import subprocess
import csv
from pathlib import Path

class SimpleAssetFixer:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.output_base = self.base_dir / "outputs"

    def find_asset_everywhere(self, asset_filename):
        """Find which game and CSV contains this asset"""
        results = []

        # Search all game directories
        for game_dir in self.output_base.iterdir():
            if not game_dir.is_dir():
                continue

            manifest_path = game_dir / "asset_manifest.json"
            if not manifest_path.exists():
                continue

            # Check manifest
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)

            for asset in manifest.get('assets', []):
                if asset.get('filename') == asset_filename:
                    # Found it! Now find the CSV
                    game_name = game_dir.name
                    csv_files = self.find_csv_for_game(game_name)

                    results.append({
                        'game': game_name,
                        'game_dir': game_dir,
                        'asset_id': asset.get('asset_id'),
                        'filename': asset_filename,
                        'type': asset.get('type'),
                        'csv_files': csv_files
                    })

        return results

    def find_csv_for_game(self, game_name):
        """Find CSV files that might contain this game's specs"""
        patterns = [
            f"{game_name}_spec.csv",
            f"{game_name.replace('_complete', '')}_spec.csv",
            f"game{game_name[-2:] if game_name[-2:].isdigit() else ''}*.csv"
        ]

        csv_files = []
        for pattern in patterns:
            matches = list(self.base_dir.glob(pattern))
            csv_files.extend(matches)

        return csv_files

    def regenerate(self, game_dir, csv_file, asset_id, asset_filename):
        """Regenerate the asset"""
        print("\n" + "="*70)
        print("REGENERATING ASSET")
        print("="*70)
        print(f"Game: {game_dir.name}")
        print(f"Asset: {asset_filename} ({asset_id})")
        print(f"CSV: {csv_file.name}")
        print("="*70 + "\n")

        # Step 1: Remove from manifest
        manifest_path = game_dir / "asset_manifest.json"
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        original_count = len(manifest.get('assets', []))
        manifest['assets'] = [a for a in manifest.get('assets', []) if a.get('asset_id') != asset_id]
        new_count = len(manifest['assets'])

        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        print(f"✅ Step 1: Removed from manifest ({original_count} → {new_count} assets)")

        # Step 2: Delete file
        file_matches = list(game_dir.rglob(asset_filename))
        for file_path in file_matches:
            file_path.unlink()
            print(f"✅ Step 2: Deleted {file_path}")

        # Step 3: Create temp CSV
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            all_rows = list(reader)

        asset_row = None
        for row in all_rows:
            if row.get('filename') == asset_filename:
                asset_row = row
                break

        if not asset_row:
            print(f"❌ Asset {asset_filename} not found in CSV")
            return False

        temp_csv = self.base_dir / f"temp_fix_{asset_filename.replace('.', '_')}.csv"
        with open(temp_csv, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerow(asset_row)

        print(f"✅ Step 3: Created temp CSV: {temp_csv.name}")

        # Step 4: Regenerate
        print(f"\n🔄 Step 4: Regenerating asset...\n")

        cmd = [
            sys.executable,
            str(self.base_dir / "production_pipeline.py"),
            str(temp_csv),
            "--output", str(game_dir)
        ]

        result = subprocess.run(cmd, cwd=str(self.base_dir))

        # Cleanup
        temp_csv.unlink()
        print(f"\n✅ Cleaned up temp CSV")

        if result.returncode == 0:
            print("\n" + "="*70)
            print("✅ REGENERATION COMPLETE")
            print("="*70)
            print(f"\nValidate: python validate_assets.py {game_dir}/")
            return True
        else:
            print("\n❌ Regeneration failed")
            return False

    def fix(self, asset_filename):
        """Main fix function"""
        print(f"\n🔍 Searching for {asset_filename}...")

        results = self.find_asset_everywhere(asset_filename)

        if not results:
            print(f"❌ Asset {asset_filename} not found in any game")
            return False

        if len(results) > 1:
            print(f"⚠️  Found {len(results)} matches:")
            for i, result in enumerate(results, 1):
                print(f"{i}. {result['game']} ({result['asset_id']})")
            print("\nPlease specify game name:")
            print(f"   python fix_single_asset.py {asset_filename} --game {results[0]['game']}")
            return False

        # Single match - proceed
        result = results[0]
        print(f"✅ Found in game: {result['game']}")
        print(f"   Asset ID: {result['asset_id']}")

        if not result['csv_files']:
            print(f"❌ No CSV file found for {result['game']}")
            return False

        csv_file = result['csv_files'][0]
        print(f"   CSV: {csv_file.name}")

        # Regenerate
        return self.regenerate(
            result['game_dir'],
            csv_file,
            result['asset_id'],
            asset_filename
        )

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Fix single asset by filename",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Fix asset (auto-finds game and CSV)
  python fix_single_asset.py ui_progress_stars.png

  # Fix asset in specific game
  python fix_single_asset.py ui_progress_stars.png --game game02_complete

Simple workflow:
  1. Edit CSV to fix the issue
  2. Run: python fix_single_asset.py <filename>
  3. Script finds game, removes from manifest, regenerates
  4. Validate: python validate_assets.py outputs/game/
        """
    )

    parser.add_argument('filename',
                       help='Asset filename to fix (e.g., ui_progress_stars.png)')
    parser.add_argument('--game',
                       help='Specify game name if asset exists in multiple games')

    args = parser.parse_args()

    fixer = SimpleAssetFixer()

    if args.game:
        # Direct regeneration with specified game
        game_dir = fixer.output_base / args.game
        if not game_dir.exists():
            print(f"❌ Game not found: {args.game}")
            sys.exit(1)

        csv_files = fixer.find_csv_for_game(args.game)
        if not csv_files:
            print(f"❌ No CSV found for {args.game}")
            sys.exit(1)

        # Find asset ID from manifest
        manifest_path = game_dir / "asset_manifest.json"
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        asset_id = None
        for asset in manifest.get('assets', []):
            if asset.get('filename') == args.filename:
                asset_id = asset.get('asset_id')
                break

        if not asset_id:
            print(f"❌ Asset {args.filename} not found in {args.game}")
            sys.exit(1)

        success = fixer.regenerate(game_dir, csv_files[0], asset_id, args.filename)
        sys.exit(0 if success else 1)
    else:
        # Auto-find and fix
        success = fixer.fix(args.filename)
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
