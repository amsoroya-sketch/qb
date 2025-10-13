#!/usr/bin/env python3
"""
Validate All Games Assets Script
Validates all generated assets across all games
Run this after generate_all_games.py completes
"""

from pathlib import Path
import json
import sys
import subprocess
from datetime import datetime

class AllGamesValidator:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.output_base = self.base_dir / "outputs"
        self.validator_script = self.base_dir / "validate_assets.py"

        self.games = [
            {"id": "01", "name": "Color Matching", "dir": "game01_complete"},
            {"id": "02", "name": "Emotion Recognition", "dir": "game02_complete"},
            # Add more as games are generated
        ]

    def find_game_directories(self):
        """Find all game output directories"""
        if not self.output_base.exists():
            return []

        game_dirs = []
        for item in self.output_base.iterdir():
            if item.is_dir() and (item / "asset_manifest.json").exists():
                game_dirs.append(item)
        return sorted(game_dirs)

    def validate_game(self, game_dir):
        """Validate a single game's assets"""
        game_name = game_dir.name

        print(f"\n{'='*70}")
        print(f"VALIDATING: {game_name}")
        print(f"{'='*70}")

        # Run validation script
        cmd = [sys.executable, str(self.validator_script), str(game_dir)]

        try:
            result = subprocess.run(
                cmd,
                cwd=str(self.base_dir),
                capture_output=True,
                text=True
            )

            # Parse validation report
            report_path = game_dir / "validation_report.json"
            if report_path.exists():
                with open(report_path, 'r') as f:
                    report = json.load(f)
                return report
            else:
                print(f"⚠️  No validation report generated")
                return None

        except Exception as e:
            print(f"❌ Error validating {game_name}: {e}")
            return None

    def validate_all(self):
        """Validate all games"""
        print("\n" + "="*70)
        print("SKILLBRIDGE ASSET VALIDATION - ALL GAMES")
        print("="*70)

        # Find all game directories
        game_dirs = self.find_game_directories()

        if not game_dirs:
            print("\n❌ No game output directories found!")
            print(f"   Expected location: {self.output_base}/")
            print("   Run generate_all_games.py first")
            return False

        print(f"\n📊 Found {len(game_dirs)} game(s) to validate:")
        for game_dir in game_dirs:
            print(f"   • {game_dir.name}")

        print("\n🔍 Starting validation...\n")

        # Validate each game
        all_reports = {}
        for game_dir in game_dirs:
            report = self.validate_game(game_dir)
            if report:
                all_reports[game_dir.name] = report

        # Generate summary report
        self.generate_summary_report(all_reports)

        return True

    def generate_summary_report(self, all_reports):
        """Generate overall validation summary"""
        print("\n" + "="*70)
        print("OVERALL VALIDATION SUMMARY")
        print("="*70 + "\n")

        total_images = 0
        total_images_valid = 0
        total_audio = 0
        total_audio_valid = 0

        games_with_issues = []

        for game_name, report in all_reports.items():
            summary = report.get('summary', {})

            # Images
            img_total = summary.get('images', {}).get('total', 0)
            img_valid = summary.get('images', {}).get('valid', 0)
            img_invalid = summary.get('images', {}).get('invalid', 0)

            # Audio
            aud_total = summary.get('audio', {}).get('total', 0)
            aud_valid = summary.get('audio', {}).get('valid', 0)
            aud_invalid = summary.get('audio', {}).get('invalid', 0)

            total_images += img_total
            total_images_valid += img_valid
            total_audio += aud_total
            total_audio_valid += aud_valid

            # Game summary
            game_pass = img_invalid == 0 and aud_invalid == 0
            icon = "✅" if game_pass else "⚠️"

            print(f"{icon} {game_name}:")
            print(f"   Images: {img_valid}/{img_total} valid", end="")
            if img_invalid > 0:
                print(f" ({img_invalid} issues)", end="")
            print()

            print(f"   Audio:  {aud_valid}/{aud_total} valid", end="")
            if aud_invalid > 0:
                print(f" ({aud_invalid} issues)", end="")
            print()

            if not game_pass:
                games_with_issues.append(game_name)
            print()

        # Overall totals
        print("="*70)
        print("TOTALS ACROSS ALL GAMES")
        print("="*70 + "\n")

        total_assets = total_images + total_audio
        total_valid = total_images_valid + total_audio_valid
        total_invalid = (total_images - total_images_valid) + (total_audio - total_audio_valid)

        if total_assets > 0:
            pass_rate = (total_valid / total_assets) * 100
        else:
            pass_rate = 0

        print(f"📊 Total Assets: {total_assets}")
        print(f"   • Images: {total_images}")
        print(f"   • Audio:  {total_audio}")
        print()
        print(f"✅ Valid Assets: {total_valid}/{total_assets} ({pass_rate:.1f}%)")
        print(f"   • Images: {total_images_valid}/{total_images}")
        print(f"   • Audio:  {total_audio_valid}/{total_audio}")

        if total_invalid > 0:
            print(f"\n⚠️  Invalid Assets: {total_invalid}")
            print(f"\nGames with issues:")
            for game_name in games_with_issues:
                print(f"   • {game_name}")
                report_path = self.output_base / game_name / "validation_report.json"
                print(f"     Report: {report_path}")
        else:
            print(f"\n🎉 ALL ASSETS PASSED VALIDATION!")

        # Save consolidated report
        consolidated_report = {
            "timestamp": datetime.now().isoformat(),
            "total_games": len(all_reports),
            "total_assets": total_assets,
            "total_valid": total_valid,
            "total_invalid": total_invalid,
            "pass_rate": pass_rate,
            "games": all_reports
        }

        report_path = self.output_base / "validation_summary_all_games.json"
        with open(report_path, 'w') as f:
            json.dump(consolidated_report, f, indent=2)

        print(f"\n📄 Consolidated report saved: {report_path}")

        # Next steps
        print("\n" + "="*70)
        print("NEXT STEPS")
        print("="*70 + "\n")

        if total_invalid == 0:
            print("✅ All assets valid - Ready for handoff to development team!")
            print("\nDeliver to:")
            print("   • GAME-001 (Unity Developer)")
            print("   • GODOT-001 (Godot Developer)")
            print("   • QA-001 (Quality Assurance)")
        else:
            print("⚠️  Some assets need attention:")
            print("\n1. Review validation reports for each game")
            print("2. Fix issues (update CSV prompts, regenerate)")
            print("3. Re-run validation")
            print("\nTo regenerate specific game:")
            print("   python production_pipeline.py gameXX_spec.csv --output outputs/gameXX")

        print()

    def show_detailed_issues(self):
        """Show detailed issues for all games"""
        print("\n" + "="*70)
        print("DETAILED VALIDATION ISSUES")
        print("="*70 + "\n")

        game_dirs = self.find_game_directories()

        for game_dir in game_dirs:
            report_path = game_dir / "validation_report.json"
            if not report_path.exists():
                continue

            with open(report_path, 'r') as f:
                report = json.load(f)

            # Check for issues
            has_issues = False

            # Image issues
            for filepath, data in report.get('images', {}).items():
                if not data.get('valid', True):
                    if not has_issues:
                        print(f"{'='*70}")
                        print(f"{game_dir.name}")
                        print(f"{'='*70}\n")
                        has_issues = True

                    filename = Path(filepath).name
                    print(f"❌ IMAGE: {filename}")
                    for issue in data.get('issues', []):
                        print(f"   • {issue}")
                    print()

            # Audio issues
            for filepath, data in report.get('audio', {}).items():
                if not data.get('valid', True):
                    if not has_issues:
                        print(f"{'='*70}")
                        print(f"{game_dir.name}")
                        print(f"{'='*70}\n")
                        has_issues = True

                    filename = Path(filepath).name
                    print(f"❌ AUDIO: {filename}")
                    for issue in data.get('issues', []):
                        print(f"   • {issue}")
                    print()

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Validate assets for all SkillBridge games",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Validate all games
  python validate_all_games.py

  # Show detailed issues
  python validate_all_games.py --detailed

  # Validate specific game
  python validate_assets.py outputs/game01_complete/
        """
    )

    parser.add_argument('--detailed', action='store_true',
                       help='Show detailed issues for each asset')

    args = parser.parse_args()

    validator = AllGamesValidator()

    if args.detailed:
        validator.show_detailed_issues()
    else:
        success = validator.validate_all()
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
