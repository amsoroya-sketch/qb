#!/usr/bin/env python3
"""
Regenerate Single Asset Script
Forces regeneration of a specific asset by removing it from manifest and regenerating
"""

import json
import sys
import subprocess
import csv
from pathlib import Path

class SingleAssetRegenerator:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.output_base = self.base_dir / "outputs"

    def find_asset_in_csv(self, csv_file, asset_filename):
        """Find asset row in CSV by filename"""
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get('filename') == asset_filename:
                    return row
        return None

    def remove_from_manifest(self, game_dir, asset_id):
        """Remove asset from manifest to force regeneration"""
        manifest_path = game_dir / "asset_manifest.json"

        if not manifest_path.exists():
            print(f"⚠️  No manifest found: {manifest_path}")
            return False

        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        # Remove asset from list
        original_count = len(manifest.get('assets', []))
        manifest['assets'] = [
            a for a in manifest.get('assets', [])
            if a.get('asset_id') != asset_id
        ]
        new_count = len(manifest['assets'])

        if original_count == new_count:
            print(f"⚠️  Asset {asset_id} not found in manifest")
            return False

        # Save updated manifest
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        print(f"✅ Removed {asset_id} from manifest ({original_count} → {new_count} assets)")
        return True

    def create_single_asset_csv(self, csv_file, asset_filename):
        """Create temporary CSV with just one asset"""
        # Find asset row
        asset_row = self.find_asset_in_csv(csv_file, asset_filename)

        if not asset_row:
            print(f"❌ Asset {asset_filename} not found in {csv_file}")
            return None

        # Create temp CSV
        temp_csv = self.base_dir / f"temp_{asset_filename.replace('.', '_')}.csv"

        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames

        with open(temp_csv, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerow(asset_row)

        print(f"📄 Created temporary CSV: {temp_csv}")
        return temp_csv

    def delete_asset_file(self, game_dir, asset_filename):
        """Delete the actual asset file"""
        # Search for file in game directory
        matches = list(game_dir.rglob(asset_filename))

        if not matches:
            print(f"⚠️  File {asset_filename} not found in {game_dir}")
            return False

        for file_path in matches:
            file_path.unlink()
            print(f"🗑️  Deleted: {file_path}")

        return True

    def regenerate_asset(self, temp_csv, game_dir):
        """Run production pipeline to regenerate the asset"""
        print(f"\n🔄 Regenerating asset...")
        print(f"   CSV: {temp_csv}")
        print(f"   Output: {game_dir}\n")

        cmd = [
            sys.executable,
            str(self.base_dir / "production_pipeline.py"),
            str(temp_csv),
            "--output", str(game_dir)
        ]

        result = subprocess.run(cmd, cwd=str(self.base_dir))
        return result.returncode == 0

    def regenerate_single(self, game_name, csv_file, asset_filename):
        """Complete workflow to regenerate a single asset"""
        game_dir = self.output_base / game_name

        if not game_dir.exists():
            print(f"❌ Game directory not found: {game_dir}")
            return False

        csv_path = self.base_dir / csv_file
        if not csv_path.exists():
            print(f"❌ CSV file not found: {csv_path}")
            return False

        print("\n" + "="*70)
        print(f"REGENERATING SINGLE ASSET")
        print("="*70)
        print(f"Game: {game_name}")
        print(f"Asset: {asset_filename}")
        print(f"CSV: {csv_file}")
        print("="*70 + "\n")

        # Step 1: Find asset in CSV
        asset_row = self.find_asset_in_csv(csv_path, asset_filename)
        if not asset_row:
            return False

        asset_id = asset_row.get('asset_id')
        print(f"📋 Found asset: {asset_id}")

        # Step 2: Remove from manifest
        print(f"\n🔧 Step 1: Removing from manifest...")
        self.remove_from_manifest(game_dir, asset_id)

        # Step 3: Delete old file
        print(f"\n🔧 Step 2: Deleting old file...")
        self.delete_asset_file(game_dir, asset_filename)

        # Step 4: Create temp CSV
        print(f"\n🔧 Step 3: Creating temporary CSV...")
        temp_csv = self.create_single_asset_csv(csv_path, asset_filename)
        if not temp_csv:
            return False

        # Step 5: Regenerate
        print(f"\n🔧 Step 4: Regenerating asset...")
        success = self.regenerate_asset(temp_csv, game_dir)

        # Cleanup temp CSV
        if temp_csv.exists():
            temp_csv.unlink()
            print(f"\n🗑️  Cleaned up temporary CSV")

        if success:
            print("\n" + "="*70)
            print("✅ REGENERATION COMPLETE")
            print("="*70)
            print(f"\n🔍 Validate the result:")
            print(f"   python validate_assets.py {game_dir}/")
            print(f"\n📁 Check the file:")
            print(f"   ls -lh {game_dir}/**/{asset_filename}")
            return True
        else:
            print("\n❌ Regeneration failed - check logs")
            return False

    def list_assets(self, game_name):
        """List all assets for a game from its manifest"""
        game_dir = self.output_base / game_name
        manifest_path = game_dir / "asset_manifest.json"

        if not manifest_path.exists():
            print(f"❌ No manifest found for {game_name}")
            return

        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        print("\n" + "="*70)
        print(f"ASSETS IN {game_name}")
        print("="*70 + "\n")

        for asset in manifest.get('assets', []):
            asset_id = asset.get('asset_id')
            filename = asset.get('filename')
            asset_type = asset.get('type')
            status = asset.get('status')

            icon = "✅" if status == "success" else "❌"
            print(f"{icon} {asset_id}: {filename} ({asset_type})")

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Regenerate a single asset",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Regenerate single asset
  python regenerate_single_asset.py game02_complete game02_emotion_recognition_spec.csv ui_progress_stars.png

  # List all assets in a game
  python regenerate_single_asset.py game02_complete --list

  # Regenerate from different CSV
  python regenerate_single_asset.py game01_complete game01_complete_spec.csv apple_red.png

Workflow:
  1. Finds asset in CSV
  2. Removes from manifest (forces regeneration)
  3. Deletes old file
  4. Creates temporary CSV with just that asset
  5. Runs production pipeline
  6. Cleans up temporary files

Perfect for fixing single validation issues!
        """
    )

    parser.add_argument('game_name',
                       help='Game directory name (e.g., game02_complete)')
    parser.add_argument('csv_file', nargs='?',
                       help='CSV specification file')
    parser.add_argument('asset_filename', nargs='?',
                       help='Asset filename to regenerate (e.g., ui_progress_stars.png)')
    parser.add_argument('--list', action='store_true',
                       help='List all assets in the game')

    args = parser.parse_args()

    regenerator = SingleAssetRegenerator()

    if args.list:
        regenerator.list_assets(args.game_name)
        sys.exit(0)

    if not args.csv_file or not args.asset_filename:
        print("❌ Missing required arguments: csv_file and asset_filename")
        parser.print_help()
        sys.exit(1)

    success = regenerator.regenerate_single(
        args.game_name,
        args.csv_file,
        args.asset_filename
    )

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
