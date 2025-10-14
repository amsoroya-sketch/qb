#!/usr/bin/env python3
"""
Generate One Asset - Simplest Script
Generate a single asset by filename from a CSV
No manifest checking, just generate
"""

import sys
import subprocess
import csv
from pathlib import Path

def generate_one(csv_file, asset_filename, output_dir):
    """Generate one specific asset"""
    base_dir = Path(__file__).parent
    csv_path = base_dir / csv_file
    output_path = base_dir / "outputs" / output_dir

    if not csv_path.exists():
        print(f"❌ CSV not found: {csv_path}")
        return False

    # Read CSV and find the asset
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        asset_row = None

        for row in reader:
            if row.get('filename') == asset_filename:
                asset_row = row
                break

    if not asset_row:
        print(f"❌ Asset {asset_filename} not found in {csv_file}")
        print("\nAvailable assets in CSV:")
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                print(f"   • {row.get('filename')}")
        return False

    # Create temp CSV with just this asset
    temp_csv = base_dir / f"temp_{asset_filename.replace('.', '_')}.csv"

    with open(temp_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerow(asset_row)

    print("\n" + "="*70)
    print("GENERATING SINGLE ASSET")
    print("="*70)
    print(f"Asset: {asset_filename}")
    print(f"From CSV: {csv_file}")
    print(f"Output: {output_dir}")
    print(f"Asset ID: {asset_row.get('asset_id')}")
    print(f"Type: {asset_row.get('type')}")
    print("="*70 + "\n")

    # Run production pipeline
    cmd = [
        sys.executable,
        str(base_dir / "production_pipeline.py"),
        str(temp_csv),
        "--output", str(output_path),
        "--no-resume"  # Force regeneration
    ]

    result = subprocess.run(cmd, cwd=str(base_dir))

    # Cleanup
    if temp_csv.exists():
        temp_csv.unlink()

    if result.returncode == 0:
        print("\n" + "="*70)
        print("✅ GENERATION COMPLETE")
        print("="*70)
        print(f"\nCheck file: find {output_path} -name {asset_filename}")
        print(f"Validate: python validate_assets.py {output_path}/")
        return True
    else:
        print("\n❌ Generation failed")
        return False

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate a single asset from CSV",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate single asset
  python generate_one.py game02_emotion_recognition_spec.csv ui_progress_stars.png game02_complete

  # Generate from game01
  python generate_one.py game01_complete_spec.csv apple_red.png game01_complete

Super simple:
  1. Finds asset in CSV
  2. Creates temp CSV with just that one
  3. Runs production pipeline (no manifest checking)
  4. Generates the asset
        """
    )

    parser.add_argument('csv_file',
                       help='CSV specification file')
    parser.add_argument('asset_filename',
                       help='Asset filename to generate')
    parser.add_argument('output_dir',
                       help='Output directory name (e.g., game02_complete)')

    args = parser.parse_args()

    success = generate_one(args.csv_file, args.asset_filename, args.output_dir)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
