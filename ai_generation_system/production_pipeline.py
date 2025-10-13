#!/usr/bin/env python3
"""
PRODUCTION-READY ASSET GENERATION PIPELINE
Enhanced with retry logic, resume capability, and error recovery
Day 4 of Hugging Face Setup Learning Roadmap
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
import logging
from typing import Dict, List, Optional

class ProductionAssetPipeline:
    def __init__(self, output_dir="outputs", log_file=None):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Setup logging
        self.setup_logging(log_file)

        # Create subdirectories
        self.image_dir = self.output_dir / "images"
        self.audio_dir = self.output_dir / "audio"
        self.image_dir.mkdir(exist_ok=True)
        self.audio_dir.mkdir(exist_ok=True)

        # Load manifest if exists (for resume capability)
        self.manifest_path = self.output_dir / "asset_manifest.json"
        self.completed_assets = self.load_completed_assets()

        # Load models
        self.logger.info("="*70)
        self.logger.info("LOADING MODELS")
        self.logger.info("="*70)

        self.load_image_model()
        self.load_audio_model()

        self.generation_log = []

    def setup_logging(self, log_file):
        """Setup logging to file and console"""
        if log_file is None:
            log_file = self.output_dir / "generation.log"

        self.logger = logging.getLogger("ProductionPipeline")
        self.logger.setLevel(logging.INFO)

        # File handler
        fh = logging.FileHandler(log_file)
        fh.setLevel(logging.INFO)

        # Console handler
        ch = logging.StreamHandler()
        ch.setLevel(logging.INFO)

        # Formatter
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        fh.setFormatter(formatter)
        ch.setFormatter(formatter)

        self.logger.addHandler(fh)
        self.logger.addHandler(ch)

    def load_completed_assets(self) -> set:
        """Load list of already completed assets for resume capability"""
        if self.manifest_path.exists():
            try:
                with open(self.manifest_path, 'r') as f:
                    manifest = json.load(f)

                completed = set()
                for asset in manifest.get("assets", []):
                    if asset.get("status") == "success":
                        completed.add(asset.get("asset_id"))

                self.logger.info(f"Found {len(completed)} previously completed assets")
                return completed
            except Exception as e:
                self.logger.warning(f"Could not load previous manifest: {e}")

        return set()

    def load_image_model(self):
        """Load FLUX image generation model"""
        self.logger.info("\n⏳ Loading FLUX.1-schnell (image generation)...")
        try:
            self.image_pipe = FluxPipeline.from_pretrained(
                "black-forest-labs/FLUX.1-schnell",
                torch_dtype=torch.bfloat16
            )

            # Enable aggressive memory optimizations
            self.image_pipe.vae.enable_slicing()
            self.image_pipe.vae.enable_tiling()
            self.image_pipe.enable_model_cpu_offload()
            self.image_pipe.enable_sequential_cpu_offload()

            self.logger.info("✓ Image pipeline ready (with memory optimizations)")
        except Exception as e:
            self.logger.error(f"Failed to load image model: {e}")
            raise

    def load_audio_model(self):
        """Load Bark audio generation model"""
        self.logger.info("\n⏳ Loading Bark (audio generation)...")
        try:
            self.audio_processor = AutoProcessor.from_pretrained("suno/bark")
            self.audio_model = BarkModel.from_pretrained("suno/bark")

            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.audio_model = self.audio_model.to(device)
            self.audio_device = device

            self.logger.info(f"✓ Audio pipeline ready (on {device})")
        except Exception as e:
            self.logger.error(f"Failed to load audio model: {e}")
            raise

    def generate_image_with_retry(self, spec: Dict, max_retries: int = 3) -> Dict:
        """Generate image with automatic retry on failure"""
        for attempt in range(max_retries):
            try:
                result = self.generate_image(spec)

                if result["status"] == "success":
                    return result

                # If error and not last attempt, wait and retry
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    self.logger.warning(f"Retry {attempt + 1}/{max_retries} after {wait_time}s...")
                    time.sleep(wait_time)

            except Exception as e:
                if attempt == max_retries - 1:
                    self.logger.error(f"Failed after {max_retries} attempts: {e}")
                    return {"status": "error", "error": str(e)}

                wait_time = 2 ** attempt
                self.logger.warning(f"Attempt {attempt + 1} failed, retrying in {wait_time}s...")
                time.sleep(wait_time)

        return {"status": "error", "error": "Max retries exceeded"}

    def generate_image(self, spec: Dict) -> Dict:
        """Generate single image from specification"""
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
            self.logger.error(f"Image generation error: {e}")
            return {"status": "error", "error": str(e)}

    def generate_audio_with_retry(self, spec: Dict, max_retries: int = 3) -> Dict:
        """Generate audio with automatic retry on failure"""
        for attempt in range(max_retries):
            try:
                result = self.generate_audio(spec)

                if result["status"] == "success":
                    return result

                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt
                    self.logger.warning(f"Retry {attempt + 1}/{max_retries} after {wait_time}s...")
                    time.sleep(wait_time)

            except Exception as e:
                if attempt == max_retries - 1:
                    self.logger.error(f"Failed after {max_retries} attempts: {e}")
                    return {"status": "error", "error": str(e)}

                wait_time = 2 ** attempt
                self.logger.warning(f"Attempt {attempt + 1} failed, retrying in {wait_time}s...")
                time.sleep(wait_time)

        return {"status": "error", "error": "Max retries exceeded"}

    def generate_audio(self, spec: Dict) -> Dict:
        """Generate single audio clip from specification"""
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
            self.logger.error(f"Audio generation error: {e}")
            return {"status": "error", "error": str(e)}

    def process_csv(self, csv_path: str, skip_completed: bool = True):
        """Process entire CSV file with resume capability"""
        df = pd.read_csv(csv_path)

        self.logger.info("\n" + "="*70)
        self.logger.info("CSV PROCESSING")
        self.logger.info("="*70)
        self.logger.info(f"File: {csv_path}")
        self.logger.info(f"Total rows: {len(df)}")

        # Filter out completed assets if resume mode
        if skip_completed and self.completed_assets:
            original_count = len(df)
            df = df[~df["asset_id"].isin(self.completed_assets)]
            skipped = original_count - len(df)
            if skipped > 0:
                self.logger.info(f"Skipping {skipped} already completed assets")

        # Separate by type
        images_df = df[df["type"] == "image"]
        audio_df = df[df["type"] == "audio"]

        self.logger.info(f"Images to generate: {len(images_df)}")
        self.logger.info(f"Audio to generate: {len(audio_df)}")

        stats = {
            "total": len(df),
            "images": {"total": len(images_df), "success": 0, "error": 0, "time": 0},
            "audio": {"total": len(audio_df), "success": 0, "error": 0, "time": 0},
            "start_time": time.time()
        }

        # Generate images
        if len(images_df) > 0:
            self.logger.info("\n" + "="*70)
            self.logger.info("GENERATING IMAGES")
            self.logger.info("="*70)

            for idx, row in tqdm(images_df.iterrows(), total=len(images_df), desc="Images"):
                start = time.time()
                result = self.generate_image_with_retry(row, max_retries=3)
                gen_time = time.time() - start

                if result["status"] == "success":
                    stats["images"]["success"] += 1
                    stats["images"]["time"] += gen_time
                else:
                    stats["images"]["error"] += 1
                    tqdm.write(f"❌ {row['asset_id']}: {result.get('error', 'Unknown error')}")

                self.generation_log.append({
                    "asset_id": row["asset_id"],
                    "type": "image",
                    "filename": row["filename"],
                    "generation_time": gen_time,
                    **result
                })

                # Save manifest periodically (every 5 assets)
                if len(self.generation_log) % 5 == 0:
                    self.save_manifest(stats, partial=True)

        # Generate audio
        if len(audio_df) > 0:
            self.logger.info("\n" + "="*70)
            self.logger.info("GENERATING AUDIO")
            self.logger.info("="*70)

            for idx, row in tqdm(audio_df.iterrows(), total=len(audio_df), desc="Audio"):
                start = time.time()
                result = self.generate_audio_with_retry(row, max_retries=3)
                gen_time = time.time() - start

                if result["status"] == "success":
                    stats["audio"]["success"] += 1
                    stats["audio"]["time"] += gen_time
                else:
                    stats["audio"]["error"] += 1
                    tqdm.write(f"❌ {row['asset_id']}: {result.get('error', 'Unknown error')}")

                self.generation_log.append({
                    "asset_id": row["asset_id"],
                    "type": "audio",
                    "filename": row["filename"],
                    "generation_time": gen_time,
                    **result
                })

                # Save manifest periodically
                if len(self.generation_log) % 5 == 0:
                    self.save_manifest(stats, partial=True)

        # Calculate final stats
        stats["end_time"] = time.time()
        stats["total_time"] = stats["end_time"] - stats["start_time"]

        # Print summary
        self.print_summary(stats)

        # Save final manifest
        self.save_manifest(stats, partial=False)

        return stats

    def print_summary(self, stats: Dict):
        """Print generation summary"""
        self.logger.info("\n" + "="*70)
        self.logger.info("✅ GENERATION COMPLETE")
        self.logger.info("="*70)

        self.logger.info(f"\nImages:")
        self.logger.info(f"  Success: {stats['images']['success']}/{stats['images']['total']}")
        self.logger.info(f"  Errors:  {stats['images']['error']}")
        if stats['images']['success'] > 0:
            avg_img = stats['images']['time'] / stats['images']['success']
            self.logger.info(f"  Average: {avg_img:.1f}s per image")

        self.logger.info(f"\nAudio:")
        self.logger.info(f"  Success: {stats['audio']['success']}/{stats['audio']['total']}")
        self.logger.info(f"  Errors:  {stats['audio']['error']}")
        if stats['audio']['success'] > 0:
            avg_aud = stats['audio']['time'] / stats['audio']['success']
            self.logger.info(f"  Average: {avg_aud:.1f}s per clip")

        self.logger.info(f"\nTotal time: {stats['total_time']:.1f}s ({stats['total_time']/60:.1f} min)")

        total_success = stats['images']['success'] + stats['audio']['success']
        if total_success > 0:
            avg_time = stats['total_time'] / total_success
            self.logger.info(f"Overall average: {avg_time:.1f}s per asset")

        self.logger.info(f"\n📁 Output directory: {self.output_dir}")

    def save_manifest(self, stats: Dict, partial: bool = False):
        """Save generation manifest"""
        manifest = {
            "summary": stats,
            "assets": self.generation_log,
            "partial": partial
        }

        with open(self.manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        if not partial:
            self.logger.info(f"\n📄 Manifest saved: {self.manifest_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Production asset generation pipeline")
    parser.add_argument("csv", help="CSV file with complete asset specifications")
    parser.add_argument("--output", required=True, help="Output directory for game assets")
    parser.add_argument("--no-resume", action="store_true", help="Regenerate all assets (ignore completed)")
    parser.add_argument("--log", help="Log file path (default: output_dir/generation.log)")

    args = parser.parse_args()

    print("\n" + "="*70)
    print("SKILLBRIDGE PRODUCTION ASSET GENERATION PIPELINE")
    print("="*70)

    pipeline = ProductionAssetPipeline(output_dir=args.output, log_file=args.log)
    stats = pipeline.process_csv(args.csv, skip_completed=not args.no_resume)

    print("\n" + "="*70)
    print("PIPELINE COMPLETE!")
    print("="*70)
    print(f"\nGenerated {stats['images']['success'] + stats['audio']['success']} assets")
    print(f"Output: {args.output}")
