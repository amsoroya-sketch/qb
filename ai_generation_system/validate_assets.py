#!/usr/bin/env python3
"""
Asset Quality Validation Script
Validates generated assets meet quality standards
Day 4 of Hugging Face Setup Learning Roadmap
SkillBridge Educational Gaming Platform
"""

from PIL import Image
import wave
from pathlib import Path
import json
import sys

class AssetValidator:
    def __init__(self):
        self.image_specs = {
            "min_width": 128,
            "min_height": 128,
            "max_size_mb": 5,
            "formats": [".png", ".jpg", ".jpeg"]
        }

        self.audio_specs = {
            "sample_rate": 24000,
            "min_duration": 0.5,  # seconds
            "max_duration": 30,
            "formats": [".wav", ".mp3"]
        }

    def validate_image(self, filepath):
        """Check if image meets specifications"""
        issues = []

        path = Path(filepath)
        if not path.exists():
            return [f"File not found: {filepath}"]

        # Check format
        if path.suffix.lower() not in self.image_specs["formats"]:
            issues.append(f"Invalid format: {path.suffix}")

        try:
            # Open image
            img = Image.open(path)

            # Check dimensions
            w, h = img.size
            if w < self.image_specs["min_width"]:
                issues.append(f"Width too small: {w}px (min {self.image_specs['min_width']}px)")
            if h < self.image_specs["min_height"]:
                issues.append(f"Height too small: {h}px (min {self.image_specs['min_height']}px)")

            # Check file size
            size_mb = path.stat().st_size / (1024 * 1024)
            if size_mb > self.image_specs["max_size_mb"]:
                issues.append(f"File too large: {size_mb:.1f}MB (max {self.image_specs['max_size_mb']}MB)")

            # Check if corrupted
            img.verify()

        except Exception as e:
            issues.append(f"Cannot open image: {e}")

        return issues

    def validate_audio(self, filepath):
        """Check if audio meets specifications"""
        issues = []

        path = Path(filepath)
        if not path.exists():
            return [f"File not found: {filepath}"]

        if path.suffix.lower() not in self.audio_specs["formats"]:
            issues.append(f"Invalid format: {path.suffix}")

        try:
            if path.suffix == ".wav":
                with wave.open(str(path), 'r') as wav:
                    sample_rate = wav.getframerate()
                    frames = wav.getnframes()
                    duration = frames / float(sample_rate)

                    # Check duration
                    if duration < self.audio_specs["min_duration"]:
                        issues.append(f"Too short: {duration:.1f}s (min {self.audio_specs['min_duration']}s)")
                    if duration > self.audio_specs["max_duration"]:
                        issues.append(f"Too long: {duration:.1f}s (max {self.audio_specs['max_duration']}s)")
        except Exception as e:
            issues.append(f"Cannot read audio: {e}")

        return issues

    def validate_directory(self, directory):
        """Validate all assets in directory"""
        directory = Path(directory)
        results = {"images": {}, "audio": {}, "summary": {}}

        # Validate images
        for img_path in directory.glob("**/*.png"):
            issues = self.validate_image(img_path)
            results["images"][str(img_path)] = {
                "valid": len(issues) == 0,
                "issues": issues
            }

        # Validate audio
        for audio_path in directory.glob("**/*.wav"):
            issues = self.validate_audio(audio_path)
            results["audio"][str(audio_path)] = {
                "valid": len(issues) == 0,
                "issues": issues
            }

        # Summary
        total_images = len(results["images"])
        valid_images = sum(1 for r in results["images"].values() if r["valid"])
        total_audio = len(results["audio"])
        valid_audio = sum(1 for r in results["audio"].values() if r["valid"])

        results["summary"] = {
            "images": {"total": total_images, "valid": valid_images, "invalid": total_images - valid_images},
            "audio": {"total": total_audio, "valid": valid_audio, "invalid": total_audio - valid_audio}
        }

        return results


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate_assets.py <directory>")
        sys.exit(1)

    validator = AssetValidator()
    results = validator.validate_directory(sys.argv[1])

    # Print summary
    print(f"\n{'='*60}")
    print("VALIDATION SUMMARY")
    print(f"{'='*60}")
    print(f"\nImages: {results['summary']['images']['valid']}/{results['summary']['images']['total']} valid")
    print(f"Audio:  {results['summary']['audio']['valid']}/{results['summary']['audio']['total']} valid")

    # Print issues
    has_issues = False
    for filepath, data in {**results["images"], **results["audio"]}.items():
        if not data["valid"]:
            has_issues = True
            print(f"\n❌ {Path(filepath).name}")
            for issue in data["issues"]:
                print(f"   - {issue}")

    if not has_issues:
        print(f"\n✅ All assets passed validation!")

    # Save report
    report_path = Path(sys.argv[1]) / "validation_report.json"
    with open(report_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n📄 Full report: {report_path}")
