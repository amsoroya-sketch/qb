#!/usr/bin/env python3
"""
Validation Issue Fixer
Automatically identifies and regenerates failed assets
Run after validation to fix issues
"""

import json
import subprocess
import sys
import csv
from pathlib import Path
from datetime import datetime

class ValidationFixer:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.output_base = self.base_dir / "outputs"

    def find_validation_issues(self, game_dir):
        """Find all invalid assets from validation report"""
        report_path = game_dir / "validation_report.json"

        if not report_path.exists():
            print(f"❌ No validation report found: {report_path}")
            print(f"   Run validation first: python validate_assets.py {game_dir}/")
            return None

        with open(report_path, 'r') as f:
            report = json.load(f)

        invalid_assets = []

        # Check images
        for filepath, data in report.get('images', {}).items():
            if not data.get('valid', True):
                invalid_assets.append({
                    'type': 'image',
                    'filepath': filepath,
                    'issues': data.get('issues', [])
                })

        # Check audio
        for filepath, data in report.get('audio', {}).items():
            if not data.get('valid', True):
                invalid_assets.append({
                    'type': 'audio',
                    'filepath': filepath,
                    'issues': data.get('issues', [])
                })

        return invalid_assets

    def find_csv_for_game(self, game_dir):
        """Find the CSV specification file for this game"""
        game_name = game_dir.name

        # Common patterns
        patterns = [
            f"{game_name}_spec.csv",
            f"{game_name.replace('_complete', '')}_spec.csv",
            f"game{game_name[-2:]}_*.csv"  # e.g., game01
        ]

        for pattern in patterns:
            matches = list(self.base_dir.glob(pattern))
            if matches:
                return matches[0]

        # Try to find by looking for matching output path in CSVs
        for csv_file in self.base_dir.glob("game*.csv"):
            # This is a heuristic - might need adjustment
            if game_name.replace('_complete', '') in csv_file.stem:
                return csv_file

        return None

    def suggest_fixes(self, invalid_assets):
        """Suggest how to fix each invalid asset"""
        print("\n" + "="*70)
        print("SUGGESTED FIXES")
        print("="*70 + "\n")

        for asset in invalid_assets:
            filename = Path(asset['filepath']).name
            print(f"❌ {filename} ({asset['type']})")

            for issue in asset['issues']:
                print(f"   Issue: {issue}")

                # Suggest fixes based on issue type
                if 'Width too small' in issue or 'Height too small' in issue:
                    print(f"   Fix: Update CSV to specify exact dimensions")
                    print(f"        Add 'width XXXXX height XXXXX' to description")

                elif 'Too short' in issue or 'Too long' in issue:
                    print(f"   Fix: Adjust text length in CSV")
                    print(f"        Shorten/lengthen the 'text' field")

                elif 'File too large' in issue:
                    print(f"   Fix: May need to reduce image size/quality")
                    print(f"        Consider reducing dimensions in CSV")

                elif 'Cannot open' in issue or 'Cannot read' in issue:
                    print(f"   Fix: File may be corrupted - regenerate")

                else:
                    print(f"   Fix: Check CSV specifications and regenerate")

            print()

    def create_fix_csv(self, game_dir, invalid_assets, original_csv):
        """Create a CSV with only the failed assets for regeneration"""
        if not original_csv:
            print("❌ Cannot create fix CSV - original CSV not found")
            return None

        # Read original CSV
        with open(original_csv, 'r') as f:
            reader = csv.DictReader(f)
            all_rows = list(reader)
            fieldnames = reader.fieldnames

        # Find rows for invalid assets
        fix_rows = []
        invalid_filenames = {Path(a['filepath']).name for a in invalid_assets}

        for row in all_rows:
            if row.get('filename') in invalid_filenames:
                fix_rows.append(row)

        if not fix_rows:
            print("⚠️  Could not match invalid assets to CSV rows")
            return None

        # Create fix CSV
        fix_csv_path = self.base_dir / f"fix_{game_dir.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

        with open(fix_csv_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(fix_rows)

        print(f"\n📄 Created fix CSV: {fix_csv_path}")
        print(f"   Contains {len(fix_rows)} asset(s) to regenerate")

        return fix_csv_path

    def regenerate_assets(self, fix_csv, game_dir):
        """Regenerate assets using the fix CSV"""
        print(f"\n🔄 Regenerating assets...")
        print(f"   CSV: {fix_csv}")
        print(f"   Output: {game_dir}")

        cmd = [
            sys.executable,
            str(self.base_dir / "production_pipeline.py"),
            str(fix_csv),
            "--output", str(game_dir)
        ]

        try:
            result = subprocess.run(cmd, cwd=str(self.base_dir))
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error regenerating: {e}")
            return False

    def fix_game(self, game_dir, auto_fix=False, edit_csv=False):
        """Fix validation issues for a single game"""
        game_name = game_dir.name

        print("\n" + "="*70)
        print(f"FIXING: {game_name}")
        print("="*70)

        # Find validation issues
        invalid_assets = self.find_validation_issues(game_dir)

        if invalid_assets is None:
            return False

        if not invalid_assets:
            print(f"\n✅ No validation issues found for {game_name}")
            return True

        print(f"\n⚠️  Found {len(invalid_assets)} invalid asset(s)")

        # Show issues and suggestions
        self.suggest_fixes(invalid_assets)

        # Find original CSV
        original_csv = self.find_csv_for_game(game_dir)

        if not original_csv:
            print(f"\n⚠️  Could not find CSV for {game_name}")
            print(f"   Please specify CSV manually:")
            print(f"   python production_pipeline.py <csv_file> --output {game_dir}")
            return False

        print(f"\n📄 Found original CSV: {original_csv}")

        # Option to edit CSV first
        if edit_csv and not auto_fix:
            print("\n" + "="*70)
            print("MANUAL FIX WORKFLOW")
            print("="*70)
            print("\n1. Edit the CSV to fix issues:")
            print(f"   nano {original_csv}")
            print(f"\n2. Update descriptions/dimensions for:")
            for asset in invalid_assets:
                print(f"   • {Path(asset['filepath']).name}")
            print(f"\n3. Regenerate after editing:")
            print(f"   python production_pipeline.py {original_csv} --output {game_dir}")
            print(f"\n4. Re-validate:")
            print(f"   python validate_assets.py {game_dir}/")
            return False

        # Auto-fix mode
        if auto_fix:
            print("\n🤖 AUTO-FIX MODE")

            # Create fix CSV
            fix_csv = self.create_fix_csv(game_dir, invalid_assets, original_csv)

            if not fix_csv:
                return False

            # Regenerate
            success = self.regenerate_assets(fix_csv, game_dir)

            if success:
                print("\n✅ Regeneration complete!")
                print(f"\n🔍 Re-validate to check if issues are fixed:")
                print(f"   python validate_assets.py {game_dir}/")
            else:
                print("\n❌ Regeneration failed - check logs")

            return success
        else:
            # Interactive mode - just show info
            print("\n" + "="*70)
            print("NEXT STEPS")
            print("="*70)
            print("\nOption 1 - Auto-fix (regenerate with same CSV):")
            print(f"   python fix_validation_issues.py {game_name} --auto")
            print("\nOption 2 - Manual fix (edit CSV first):")
            print(f"   python fix_validation_issues.py {game_name} --edit")
            print("\nOption 3 - Manual regeneration:")
            print(f"   python production_pipeline.py {original_csv} --output {game_dir}")

            return False

    def fix_all_games(self, auto_fix=False):
        """Fix validation issues for all games"""
        print("\n" + "="*70)
        print("FIXING ALL GAMES")
        print("="*70)

        game_dirs = []
        for item in self.output_base.iterdir():
            if item.is_dir() and (item / "validation_report.json").exists():
                game_dirs.append(item)

        if not game_dirs:
            print("\n❌ No validation reports found")
            print("   Run validation first: python validate_all_games.py")
            return False

        print(f"\n📊 Found {len(game_dirs)} game(s) with validation reports")

        results = {}
        for game_dir in game_dirs:
            success = self.fix_game(game_dir, auto_fix=auto_fix)
            results[game_dir.name] = success

        # Summary
        print("\n" + "="*70)
        print("FIX SUMMARY")
        print("="*70 + "\n")

        for game_name, success in results.items():
            icon = "✅" if success else "⚠️"
            print(f"{icon} {game_name}")

        return all(results.values())

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Fix validation issues by regenerating failed assets",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Check issues and show suggestions (no changes)
  python fix_validation_issues.py game01_complete

  # Auto-fix by regenerating failed assets
  python fix_validation_issues.py game01_complete --auto

  # Show manual fix workflow (edit CSV first)
  python fix_validation_issues.py game01_complete --edit

  # Fix all games
  python fix_validation_issues.py --all

  # Auto-fix all games
  python fix_validation_issues.py --all --auto

Workflow:
  1. Run validation: python validate_all_games.py
  2. Check issues: python fix_validation_issues.py <game_name>
  3. Auto-fix: python fix_validation_issues.py <game_name> --auto
  4. Re-validate: python validate_assets.py outputs/<game_name>/
        """
    )

    parser.add_argument('game_name', nargs='?',
                       help='Game directory name (e.g., game01_complete)')
    parser.add_argument('--all', action='store_true',
                       help='Fix all games with validation issues')
    parser.add_argument('--auto', action='store_true',
                       help='Automatically regenerate failed assets')
    parser.add_argument('--edit', action='store_true',
                       help='Show manual edit workflow (modify CSV first)')

    args = parser.parse_args()

    fixer = ValidationFixer()

    if args.all:
        success = fixer.fix_all_games(auto_fix=args.auto)
        sys.exit(0 if success else 1)
    elif args.game_name:
        game_dir = fixer.output_base / args.game_name

        if not game_dir.exists():
            print(f"❌ Game directory not found: {game_dir}")
            print(f"\nAvailable games:")
            for item in fixer.output_base.iterdir():
                if item.is_dir():
                    print(f"   • {item.name}")
            sys.exit(1)

        success = fixer.fix_game(game_dir, auto_fix=args.auto, edit_csv=args.edit)
        sys.exit(0 if success else 1)
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
