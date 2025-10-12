#!/usr/bin/env python3
"""
FLUX.1 Image Generation Script - October 2025
Generates images using FLUX.1 [schnell] via ComfyUI
2-3x faster than Stable Diffusion 1.5

License: Apache 2.0 (100% commercial-safe)
"""

import requests
import json
import time
import argparse
from pathlib import Path
from typing import Dict, List
import pandas as pd
from PIL import Image
import io

COMFYUI_URL = "http://localhost:8188"

class FluxImageGenerator:
    def __init__(self, comfyui_url: str = COMFYUI_URL):
        self.url = comfyui_url
        self.checkpoint = "flux1-schnell.safetensors"

        # Verify ComfyUI is running
        try:
            response = requests.get(f"{self.url}/system_stats", timeout=5)
            response.raise_for_status()
            print("✓ Connected to ComfyUI")
        except requests.exceptions.RequestException as e:
            print(f"✗ Cannot connect to ComfyUI at {self.url}")
            print(f"  Error: {e}")
            print(f"  Please start ComfyUI: bash ~/ai-tools/start_comfyui_flux.sh")
            raise

    def create_flux_workflow(self, prompt: str, negative_prompt: str,
                            width: int = 512, height: int = 512,
                            steps: int = 4, cfg: float = 1.0,
                            seed: int = None) -> Dict:
        """
        Create FLUX.1 [schnell] workflow

        FLUX.1 [schnell] is optimized for speed:
        - Only needs 4 steps (vs 20-50 for SD)
        - CFG scale of 1.0 (guidance not needed)
        - 2-3x faster generation
        """

        if seed is None:
            seed = int(time.time() * 1000) % (2**32)

        workflow = {
            "3": {
                "inputs": {
                    "seed": seed,
                    "steps": steps,
                    "cfg": cfg,
                    "sampler_name": "euler",
                    "scheduler": "simple",
                    "denoise": 1.0,
                    "model": ["4", 0],
                    "positive": ["6", 0],
                    "negative": ["7", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": self.checkpoint
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "5": {
                "inputs": {
                    "width": width,
                    "height": height,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage"
            },
            "6": {
                "inputs": {
                    "text": prompt,
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "7": {
                "inputs": {
                    "text": negative_prompt,
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "8": {
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["4", 2]
                },
                "class_type": "VAEDecode"
            },
            "9": {
                "inputs": {
                    "filename_prefix": "flux_generated",
                    "images": ["8", 0]
                },
                "class_type": "SaveImage"
            }
        }

        return workflow

    def queue_prompt(self, workflow: Dict) -> Dict:
        """Send prompt to ComfyUI queue"""
        try:
            response = requests.post(
                f"{self.url}/prompt",
                json={"prompt": workflow},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error queuing prompt: {e}")
            return None

    def wait_for_completion(self, prompt_id: str, timeout: int = 300) -> bool:
        """Wait for generation to complete"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"{self.url}/history/{prompt_id}")
                history = response.json()

                if prompt_id in history:
                    return True

                time.sleep(0.5)
            except Exception as e:
                print(f"Error checking status: {e}")
                time.sleep(2)

        return False

    def get_image(self, filename: str, subfolder: str = "", folder_type: str = "output") -> bytes:
        """Retrieve generated image"""
        try:
            response = requests.get(
                f"{self.url}/view",
                params={
                    "filename": filename,
                    "subfolder": subfolder,
                    "type": folder_type
                }
            )
            response.raise_for_status()
            return response.content
        except Exception as e:
            print(f"Error retrieving image: {e}")
            return None

    def generate_image(self, asset_spec: Dict, output_dir: Path) -> bool:
        """Generate a single image from specification"""

        # Parse dimensions
        if 'x' in str(asset_spec.get('size', '512x512')):
            width, height = map(int, str(asset_spec['size']).split('x'))
        else:
            width = height = 512

        # Create optimized prompt for FLUX.1
        description = asset_spec['description']
        style = asset_spec.get('style', 'clean')

        # FLUX.1 prompt optimization
        prompt = f"{description}, {style} style, high quality, detailed, professional"

        # Negative prompt (though FLUX.1 works well without heavy negatives)
        negative_prompt = (
            "blurry, low quality, distorted, bad anatomy, "
            "watermark, text, signature"
        )

        print(f"  Generating: {asset_spec['asset_id']}")
        print(f"    Prompt: {prompt}")
        print(f"    Size: {width}x{height}")
        print(f"    Model: FLUX.1 [schnell]")

        # Create workflow
        workflow = self.create_flux_workflow(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            steps=4,  # FLUX.1 schnell only needs 4 steps!
            cfg=1.0   # FLUX.1 works best with CFG=1.0
        )

        # Queue generation
        result = self.queue_prompt(workflow)
        if not result or 'prompt_id' not in result:
            print(f"  ✗ Failed to queue prompt")
            return False

        prompt_id = result['prompt_id']
        print(f"    Queued: {prompt_id}")

        # Wait for completion
        start_gen = time.time()
        if not self.wait_for_completion(prompt_id, timeout=300):
            print(f"  ✗ Generation timeout")
            return False

        gen_time = time.time() - start_gen
        print(f"    Generation time: {gen_time:.1f}s")

        # Get history to find output filename
        try:
            response = requests.get(f"{self.url}/history/{prompt_id}")
            history = response.json()

            if prompt_id not in history:
                print(f"  ✗ Prompt not found in history")
                return False

            outputs = history[prompt_id]['outputs']

            # Find SaveImage node output
            image_data = None
            for node_id, output in outputs.items():
                if 'images' in output:
                    image_info = output['images'][0]
                    filename = image_info['filename']
                    subfolder = image_info.get('subfolder', '')

                    # Download image
                    image_data = self.get_image(filename, subfolder)
                    break

            if not image_data:
                print(f"  ✗ No image data found")
                return False

            # Save image
            output_path = output_dir / f"{asset_spec['asset_id']}.png"
            output_path.parent.mkdir(parents=True, exist_ok=True)

            with open(output_path, 'wb') as f:
                f.write(image_data)

            # Get file size
            file_size_kb = output_path.stat().st_size // 1024

            print(f"  ✓ Saved: {output_path} ({file_size_kb} KB)")
            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Generate images using FLUX.1')
    parser.add_argument('--input', required=True, help='Input CSV file with asset specs')
    parser.add_argument('--output', default='outputs/images', help='Output directory')
    parser.add_argument('--comfyui-url', default=COMFYUI_URL, help='ComfyUI server URL')

    args = parser.parse_args()

    print("\n" + "="*60)
    print("FLUX.1 Image Generation - October 2025")
    print("Apache 2.0 License - 100% Commercial Safe")
    print("="*60 + "\n")

    # Load specifications
    try:
        df = pd.read_csv(args.input)
    except Exception as e:
        print(f"✗ Error reading CSV: {e}")
        return

    image_assets = df[df['type'].str.contains('image|sprite|background|ui', case=False, na=False)]

    if len(image_assets) == 0:
        print("✗ No image assets found in input file")
        return

    print(f"Found {len(image_assets)} image assets to generate")
    print(f"Output directory: {args.output}\n")

    # Initialize generator
    try:
        generator = FluxImageGenerator(args.comfyui_url)
    except Exception as e:
        print(f"\n✗ Failed to initialize generator: {e}")
        return

    output_dir = Path(args.output)

    # Generate each image
    successful = 0
    failed = 0
    total_start = time.time()

    for idx, row in image_assets.iterrows():
        asset_spec = row.to_dict()

        if generator.generate_image(asset_spec, output_dir):
            successful += 1
        else:
            failed += 1

        # Small delay between generations
        time.sleep(1)

        print()

    total_time = time.time() - total_start
    avg_time = total_time / len(image_assets) if len(image_assets) > 0 else 0

    print("="*60)
    print("Generation Complete!")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Total time: {total_time:.1f}s")
    print(f"  Average: {avg_time:.1f}s per image")
    print(f"  Output: {output_dir}")
    print("="*60 + "\n")

    print("Performance Notes:")
    print("  • FLUX.1 [schnell]: 2-3 seconds per image (4 steps)")
    print("  • 2-3x faster than Stable Diffusion 1.5")
    print("  • Better quality, especially for hands and faces")
    print()

if __name__ == "__main__":
    main()
