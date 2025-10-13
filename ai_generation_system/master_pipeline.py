#!/usr/bin/env python3
"""
MASTER ASSET GENERATION PIPELINE
One command to generate ALL assets for a game from CSV specification
Day 3 of Hugging Face Setup Learning Roadmap
SkillBridge Educational Gaming Platform
"""

import pandas as pd
import torch
from diffusers import FluxPipeline
from transformers import AutoProcessor, BarkModel
import scipy.io.wavfile as wavfile
import numpy as np
from pathlib import Path
import time
import json
from tqdm import tqdm
import argparse
import gc

class MasterAssetPipeline:
    def __init__(self, output_dir="outputs"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Create subdirectories
        self.image_dir = self.output_dir / "images"
        self.audio_dir = self.output_dir / "audio"
        self.image_dir.mkdir(exist_ok=True)
        self.audio_dir.mkdir(exist_ok=True)

        # Load models
        print("\n" + "="*70)
        print("LOADING MODELS")
        print("="*70)

        print("\n⏳ Loading FLUX.1-schnell (image generation)...")
        self.image_pipe = FluxPipeline.from_pretrained(
            "black-forest-labs/FLUX.1-schnell",
            torch_dtype=torch.bfloat16
        )

        # Enable aggressive memory optimizations
        self.image_pipe.vae.enable_slicing()
        self.image_pipe.vae.enable_tiling()
        self.image_pipe.enable_model_cpu_offload()
        self.image_pipe.enable_sequential_cpu_offload()

        print("✓ Image pipeline ready (with memory optimizations)")

        print("\n⏳ Loading Bark (audio generation)...")
        self.audio_processor = AutoProcessor.from_pretrained("suno/bark")
        self.audio_model = BarkModel.from_pretrained("suno/bark")

        device = "cuda" if torch.cuda.is_available() else "cpu"
        self.audio_model = self.audio_model.to(device)
        self.audio_device = device

        print(f"✓ Audio pipeline ready (on {device})")

        self.generation_log = []

    def generate_image(self, spec):
        """Generate image from specification"""
        try:
            # Build prompt
            description = spec["description"]
            style = spec.get("style", "educational")

            if style == "educational":
                prompt = f"{description}, simple clean design, child-friendly cartoon style, educational illustration, white background, centered, high contrast"
            elif style == "realistic":
                prompt = f"{description}, photorealistic, high quality, soft lighting, calming atmosphere"
            elif style == "flat":
                prompt = f"{description}, flat design, modern UI, clean vector style, minimalist"
            else:
                prompt = f"{description}, {style} style"

            # Generate with inference mode
            with torch.inference_mode():
                image = self.image_pipe(
                    prompt=prompt,
                    num_inference_steps=4,
                    guidance_scale=0.0,
                    height=int(spec.get("height", 512)),
                    width=int(spec.get("width", 512))
                ).images[0]

            # Determine subdirectory based on filename
            filename = spec["filename"]
            if "background" in filename.lower() or filename.startswith("bg"):
                save_dir = self.image_dir / "backgrounds"
            elif "button" in filename.lower() or "icon" in filename.lower() or filename.startswith("ui"):
                save_dir = self.image_dir / "ui"
            elif "container" in filename.lower():
                save_dir = self.image_dir / "containers"
            else:
                save_dir = self.image_dir / "objects"

            save_dir.mkdir(exist_ok=True)
            filepath = save_dir / filename
            image.save(filepath)

            # Clean up memory
            del image
            torch.cuda.empty_cache()
            gc.collect()

            return {"status": "success", "filepath": str(filepath)}

        except Exception as e:
            return {"status": "error", "error": str(e)}

    def generate_audio(self, spec):
        """Generate audio from specification"""
        try:
            text = spec["text"]
            voice = spec.get("voice", "v2/en_speaker_6")

            # Prepare inputs
            inputs = self.audio_processor(
                text,
                voice_preset=voice,
                return_tensors="pt"
            ).to(self.audio_device)

            # Generate speech
            with torch.inference_mode():
                speech_output = self.audio_model.generate(**inputs, do_sample=True)

            # Convert to numpy array
            audio_array = speech_output[0].cpu().numpy()

            # Bark outputs at 24kHz
            sample_rate = 24000

            # Normalize audio to prevent clipping
            audio_array = audio_array / np.max(np.abs(audio_array))
            audio_array = (audio_array * 32767).astype(np.int16)

            # Determine subdirectory based on filename
            filename = spec["filename"]
            if filename.startswith("vo"):
                save_dir = self.audio_dir / "voiceovers"
            elif filename.startswith("sfx"):
                save_dir = self.audio_dir / "sound_effects"
            elif filename.startswith("mus"):
                save_dir = self.audio_dir / "music"
            else:
                save_dir = self.audio_dir

            save_dir.mkdir(exist_ok=True)
            filepath = save_dir / filename
            wavfile.write(str(filepath), sample_rate, audio_array)

            duration = len(audio_array) / sample_rate

            # Clean up memory
            del speech_output, audio_array
            torch.cuda.empty_cache()
            gc.collect()

            return {"status": "success", "filepath": str(filepath), "duration": duration}

        except Exception as e:
            return {"status": "error", "error": str(e)}

    def process_csv(self, csv_path):
        """Process entire CSV file"""
        df = pd.read_csv(csv_path)

        print("\n" + "="*70)
        print("CSV PROCESSING")
        print("="*70)
        print(f"File: {csv_path}")
        print(f"Total rows: {len(df)}")

        # Separate by type
        images_df = df[df["type"] == "image"]
        audio_df = df[df["type"] == "audio"]

        print(f"Images: {len(images_df)}")
        print(f"Audio: {len(audio_df)}")

        stats = {
            "total": len(df),
            "images": {"total": len(images_df), "success": 0, "error": 0, "time": 0},
            "audio": {"total": len(audio_df), "success": 0, "error": 0, "time": 0},
            "start_time": time.time()
        }

        # Generate images
        if len(images_df) > 0:
            print("\n" + "="*70)
            print("GENERATING IMAGES")
            print("="*70)

            for idx, row in tqdm(images_df.iterrows(), total=len(images_df), desc="Images"):
                start = time.time()
                result = self.generate_image(row)
                gen_time = time.time() - start

                if result["status"] == "success":
                    stats["images"]["success"] += 1
                    stats["images"]["time"] += gen_time
                else:
                    stats["images"]["error"] += 1
                    tqdm.write(f"❌ {row['asset_id']}: {result['error']}")

                self.generation_log.append({
                    "asset_id": row["asset_id"],
                    "type": "image",
                    "filename": row["filename"],
                    "generation_time": gen_time,
                    **result
                })

        # Generate audio
        if len(audio_df) > 0:
            print("\n" + "="*70)
            print("GENERATING AUDIO")
            print("="*70)

            for idx, row in tqdm(audio_df.iterrows(), total=len(audio_df), desc="Audio"):
                start = time.time()
                result = self.generate_audio(row)
                gen_time = time.time() - start

                if result["status"] == "success":
                    stats["audio"]["success"] += 1
                    stats["audio"]["time"] += gen_time
                else:
                    stats["audio"]["error"] += 1
                    tqdm.write(f"❌ {row['asset_id']}: {result['error']}")

                self.generation_log.append({
                    "asset_id": row["asset_id"],
                    "type": "audio",
                    "filename": row["filename"],
                    "generation_time": gen_time,
                    **result
                })

        # Calculate stats
        stats["end_time"] = time.time()
        stats["total_time"] = stats["end_time"] - stats["start_time"]

        # Print summary
        self.print_summary(stats)

        # Save manifest
        self.save_manifest(stats)

        return stats

    def print_summary(self, stats):
        """Print generation summary"""
        print("\n" + "="*70)
        print("✅ GENERATION COMPLETE")
        print("="*70)

        print(f"\nImages:")
        print(f"  Success: {stats['images']['success']}/{stats['images']['total']}")
        print(f"  Errors:  {stats['images']['error']}")
        if stats['images']['success'] > 0:
            avg_img = stats['images']['time'] / stats['images']['success']
            print(f"  Average: {avg_img:.1f}s per image")

        print(f"\nAudio:")
        print(f"  Success: {stats['audio']['success']}/{stats['audio']['total']}")
        print(f"  Errors:  {stats['audio']['error']}")
        if stats['audio']['success'] > 0:
            avg_aud = stats['audio']['time'] / stats['audio']['success']
            print(f"  Average: {avg_aud:.1f}s per clip")

        print(f"\nTotal time: {stats['total_time']:.1f}s ({stats['total_time']/60:.1f} min)")

        total_success = stats['images']['success'] + stats['audio']['success']
        if total_success > 0:
            avg_time = stats['total_time'] / total_success
            print(f"Overall average: {avg_time:.1f}s per asset")

        print(f"\n📁 Output directory: {self.output_dir}")
        print(f"   ├── images/")
        print(f"   │   ├── objects/")
        print(f"   │   ├── containers/")
        print(f"   │   ├── backgrounds/")
        print(f"   │   └── ui/")
        print(f"   └── audio/")
        print(f"       └── voiceovers/")

    def save_manifest(self, stats):
        """Save generation manifest"""
        manifest = {
            "summary": stats,
            "assets": self.generation_log
        }

        manifest_path = self.output_dir / "asset_manifest.json"
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        print(f"\n📄 Manifest saved: {manifest_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Master asset generation pipeline")
    parser.add_argument("csv", help="CSV file with complete asset specifications")
    parser.add_argument("--output", required=True, help="Output directory for game assets")

    args = parser.parse_args()

    print("\n" + "="*70)
    print("SKILLBRIDGE MASTER ASSET GENERATION PIPELINE")
    print("="*70)

    pipeline = MasterAssetPipeline(output_dir=args.output)
    stats = pipeline.process_csv(args.csv)

    print("\n" + "="*70)
    print("PIPELINE COMPLETE!")
    print("="*70)
    print(f"\nGenerated {stats['images']['success'] + stats['audio']['success']} assets")
    print(f"Output: {args.output}")
