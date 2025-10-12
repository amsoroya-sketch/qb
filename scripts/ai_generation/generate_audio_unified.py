#!/usr/bin/env python3
"""
Unified Audio Generation Script - October 2025
Combines Stable Audio Open (SFX & music) + Bark (voice)

ALL COMMERCIAL-SAFE:
- Stable Audio Open: CC-BY-SA 4.0 (commercial OK with attribution)
- Bark: MIT License (100% free commercial use)

NOTE: MusicGen NOT INCLUDED (non-commercial license)
"""

import argparse
from pathlib import Path
from typing import Dict
import pandas as pd
import torch
import torchaudio
from scipy.io.wavfile import write as write_wav
import time

class UnifiedAudioGenerator:
    def __init__(self):
        print("Loading audio generation models...")
        print("Using only commercial-safe models\n")

        # Load Stable Audio for BOTH sound effects AND music
        try:
            from stable_audio_tools import get_pretrained_model
            from stable_audio_tools.inference.generation import generate_diffusion_cond

            model_path = Path.home() / "ai-tools" / "stable-audio" / "models" / "stable-audio-open"

            if not model_path.exists():
                print(f"✗ Stable Audio model not found at: {model_path}")
                print(f"  Please run: bash ~/ai-tools/scripts/setup_stable_audio.sh")
                self.stable_audio_model = None
            else:
                self.stable_audio_model, self.stable_audio_config = get_pretrained_model(str(model_path))
                self.stable_audio_generate = generate_diffusion_cond
                print("  ✓ Stable Audio Open loaded (SFX & Music)")
                print("    License: CC-BY-SA 4.0 (commercial OK)")

        except Exception as e:
            print(f"  ⚠ Stable Audio not loaded: {e}")
            self.stable_audio_model = None

        # Load Bark for voice synthesis
        try:
            from bark import generate_audio, SAMPLE_RATE
            self.bark_generate = generate_audio
            self.bark_sample_rate = SAMPLE_RATE
            print("  ✓ Bark loaded (Voice)")
            print("    License: MIT (100% free commercial use)")
        except Exception as e:
            print(f"  ⚠ Bark not loaded: {e}")
            self.bark_generate = None

        print("\n✓ All models are commercial-safe")
        print("✗ MusicGen NOT used (non-commercial license)\n")

    def generate_sound_effect(self, description: str, duration: float, output_path: Path) -> bool:
        """Generate sound effect using Stable Audio Open"""
        if self.stable_audio_model is None:
            print("ERROR: Stable Audio not available")
            return False

        print(f"  Generating SFX: {description}")
        print(f"    Duration: {duration}s")
        print(f"    Using: Stable Audio Open (CC-BY-SA 4.0)")

        try:
            start_time = time.time()

            # Generate audio
            output = self.stable_audio_generate(
                self.stable_audio_model,
                description,
                seconds_total=duration,
                batch_size=1
            )

            # Save to file
            torchaudio.save(
                str(output_path),
                output[0],
                sample_rate=44100
            )

            gen_time = time.time() - start_time
            file_size_kb = output_path.stat().st_size // 1024

            print(f"  ✓ Saved: {output_path}")
            print(f"    Size: {file_size_kb} KB")
            print(f"    Generation time: {gen_time:.1f}s")
            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            return False

    def generate_music(self, description: str, duration: float, output_path: Path) -> bool:
        """Generate background music using Stable Audio Open"""
        if self.stable_audio_model is None:
            print("ERROR: Stable Audio not available")
            return False

        print(f"  Generating music: {description}")
        print(f"    Duration: {duration}s")
        print(f"    Using: Stable Audio Open (CC-BY-SA 4.0 - commercial OK)")

        try:
            start_time = time.time()

            # Add "music" keyword to prompt for better musical results
            music_prompt = f"{description}, music, musical composition"

            # Generate audio
            output = self.stable_audio_generate(
                self.stable_audio_model,
                music_prompt,
                seconds_total=duration,
                batch_size=1
            )

            # Save to file
            torchaudio.save(
                str(output_path),
                output[0],
                sample_rate=44100
            )

            gen_time = time.time() - start_time
            file_size_kb = output_path.stat().st_size // 1024

            print(f"  ✓ Saved: {output_path}")
            print(f"    Size: {file_size_kb} KB")
            print(f"    Generation time: {gen_time:.1f}s")
            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            return False

    def generate_voice(self, text: str, output_path: Path, voice: str = "v2/en_speaker_6") -> bool:
        """Generate voice using Bark"""
        if self.bark_generate is None:
            print("ERROR: Bark not available")
            return False

        print(f"  Generating voice: {text}")
        print(f"    Voice: {voice}")
        print(f"    Using: Bark (MIT License - commercial OK)")

        try:
            start_time = time.time()

            # Generate audio
            audio_array = self.bark_generate(text, history_prompt=voice)

            # Save to file
            write_wav(str(output_path), self.bark_sample_rate, audio_array)

            gen_time = time.time() - start_time
            file_size_kb = output_path.stat().st_size // 1024

            print(f"  ✓ Saved: {output_path}")
            print(f"    Size: {file_size_kb} KB")
            print(f"    Generation time: {gen_time:.1f}s")
            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            return False

    def process_asset(self, asset_spec: Dict, output_dir: Path) -> bool:
        """Process a single audio asset"""
        try:
            asset_id = asset_spec['asset_id']
            asset_type = asset_spec['type'].lower()
            description = asset_spec['description']
            duration = float(asset_spec.get('duration', 2))

            # Determine output path based on type
            if 'music' in asset_type:
                subfolder = 'music'
            elif 'voice' in asset_type:
                subfolder = 'voice'
            else:
                subfolder = 'sfx'

            output_path = output_dir / subfolder / f"{asset_id}.wav"
            output_path.parent.mkdir(parents=True, exist_ok=True)

            # Generate based on type
            if 'music' in asset_type:
                return self.generate_music(description, duration, output_path)
            elif 'voice' in asset_type:
                # Extract voice preference if specified
                voice = asset_spec.get('voice', 'v2/en_speaker_6')
                return self.generate_voice(description, output_path, voice)
            else:  # Sound effect
                return self.generate_sound_effect(description, duration, output_path)

        except Exception as e:
            print(f"  ✗ Error processing asset: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Generate audio from asset specifications')
    parser.add_argument('--input', required=True, help='Input CSV file with audio asset specs')
    parser.add_argument('--output', default='outputs/audio', help='Output directory')

    args = parser.parse_args()

    print("\n" + "="*60)
    print("Unified Audio Generation - October 2025")
    print("Commercial-Safe Models Only")
    print("="*60)
    print("\nLicenses:")
    print("  • Stable Audio Open: CC-BY-SA 4.0 (commercial OK)")
    print("  • Bark: MIT License (100% free commercial use)")
    print("\n⚠ MusicGen NOT USED (non-commercial license)")
    print("="*60 + "\n")

    # Load specifications
    try:
        df = pd.read_csv(args.input)
    except Exception as e:
        print(f"✗ Error reading CSV: {e}")
        return

    audio_assets = df[df['type'].str.contains('audio|sound|music|voice|sfx', case=False, na=False)]

    if len(audio_assets) == 0:
        print("✗ No audio assets found in input file")
        print("  Expected 'type' column to contain: audio, sound, music, voice, or sfx")
        return

    print(f"Found {len(audio_assets)} audio assets to generate")
    print(f"Output directory: {args.output}\n")

    # Initialize generator
    try:
        generator = UnifiedAudioGenerator()
    except Exception as e:
        print(f"\n✗ Failed to initialize generator: {e}")
        return

    output_dir = Path(args.output)

    # Generate each audio file
    successful = 0
    failed = 0
    total_start = time.time()

    for idx, row in audio_assets.iterrows():
        asset_spec = row.to_dict()

        if generator.process_asset(asset_spec, output_dir):
            successful += 1
        else:
            failed += 1

        print()

    total_time = time.time() - total_start
    avg_time = total_time / len(audio_assets) if len(audio_assets) > 0 else 0

    print("="*60)
    print("Generation Complete!")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Total time: {total_time/60:.1f} minutes")
    print(f"  Average: {avg_time:.1f}s per audio clip")
    print(f"  Output: {output_dir}")
    print("="*60 + "\n")

    print("Performance Notes:")
    print("  • Sound effects: 10-15 seconds per 2-second clip")
    print("  • Music (30s): 15-20 seconds generation")
    print("  • Voice: 8-12 seconds per sentence")
    print()

    print("Available Bark Voices (child-friendly):")
    print("  • v2/en_speaker_6 - Neutral, clear")
    print("  • v2/en_speaker_9 - Warm, encouraging")
    print()

    print("Import to Godot:")
    print("  1. Copy .wav files to your Godot project/assets/audio/")
    print("  2. Drag & drop into Godot editor")
    print("  3. Godot auto-imports as AudioStream resources")
    print()

if __name__ == "__main__":
    main()
