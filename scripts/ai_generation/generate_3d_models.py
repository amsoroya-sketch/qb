#!/usr/bin/env python3
"""
Roblox Cube 3D Model Generation Script - October 2025
Generates 3D models from text descriptions using Cube 3D

License: Open Source (100% commercial-safe)
Capability: NEW - Text-to-3D generation
"""

import argparse
from pathlib import Path
from typing import Dict
import pandas as pd
import torch
import time

class Cube3DGenerator:
    def __init__(self, model_path: str = None):
        print("Loading Cube 3D model...")
        print("This may take 1-2 minutes on first load...")

        if model_path is None:
            model_path = Path.home() / "ai-tools" / "cube3d" / "models" / "cube-3d-base"

        self.model_path = Path(model_path)

        if not self.model_path.exists():
            print(f"\n✗ Cube 3D model not found at: {self.model_path}")
            print(f"  Please run: bash ~/ai-tools/scripts/setup_cube3d.sh")
            raise FileNotFoundError(f"Model not found: {self.model_path}")

        try:
            # Import Cube 3D pipeline
            from cube3d import Cube3DPipeline

            # Load model
            self.pipeline = Cube3DPipeline.from_pretrained(
                str(self.model_path),
                torch_dtype=torch.float16,
                device_map="auto"
            )

            print("✓ Cube 3D model loaded successfully")
            print(f"  Device: {self.pipeline.device}")
            print()

        except ImportError as e:
            print(f"\n✗ Cube 3D not installed properly")
            print(f"  Error: {e}")
            print(f"  Please run: bash ~/ai-tools/scripts/setup_cube3d.sh")
            raise

        except Exception as e:
            print(f"\n✗ Error loading Cube 3D: {e}")
            raise

    def generate_3d_model(self, asset_spec: Dict, output_dir: Path) -> bool:
        """Generate a single 3D model from specification"""

        asset_id = asset_spec['asset_id']
        description = asset_spec['description']
        export_format = asset_spec.get('format', 'obj').lower()

        # Determine output path
        output_path = output_dir / f"{asset_id}.{export_format}"
        output_path.parent.mkdir(parents=True, exist_ok=True)

        print(f"  Generating: {asset_id}")
        print(f"    Prompt: {description}")
        print(f"    Format: .{export_format}")

        try:
            # Generate 3D mesh
            start_time = time.time()

            mesh = self.pipeline(
                prompt=description,
                num_inference_steps=50,  # Balance quality vs speed
                guidance_scale=7.5
            )

            gen_time = time.time() - start_time

            # Export to requested format
            mesh.export(str(output_path))

            # Also export as .glb (for Godot/web use) if originally .obj
            if export_format == 'obj':
                glb_path = output_path.with_suffix('.glb')
                mesh.export(str(glb_path))
                print(f"  ✓ Also exported: {glb_path.name}")

            # Get mesh statistics
            vertex_count = len(mesh.vertices) if hasattr(mesh, 'vertices') else 'N/A'
            face_count = len(mesh.faces) if hasattr(mesh, 'faces') else 'N/A'
            file_size_kb = output_path.stat().st_size // 1024

            print(f"  ✓ Saved: {output_path}")
            print(f"    Vertices: {vertex_count}, Faces: {face_count}")
            print(f"    Size: {file_size_kb} KB")
            print(f"    Generation time: {gen_time:.1f}s")

            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Generate 3D models using Cube 3D')
    parser.add_argument('--input', required=True, help='Input CSV file with 3D model specs')
    parser.add_argument('--output', default='outputs/3d_models', help='Output directory')
    parser.add_argument('--model-path', default=None, help='Path to Cube 3D model (optional)')

    args = parser.parse_args()

    print("\n" + "="*60)
    print("Cube 3D Model Generation - October 2025")
    print("Roblox Open Source - 100% Commercial Safe")
    print("="*60 + "\n")

    # Load specifications
    try:
        df = pd.read_csv(args.input)
    except Exception as e:
        print(f"✗ Error reading CSV: {e}")
        return

    # Filter for 3D model assets
    model_assets = df[df['type'].str.contains('3d|model|object|mesh', case=False, na=False)]

    if len(model_assets) == 0:
        print("✗ No 3D model assets found in input file")
        print("  Expected 'type' column to contain: 3d, model, object, or mesh")
        return

    print(f"Found {len(model_assets)} 3D model assets to generate")
    print(f"Output directory: {args.output}\n")

    # Initialize generator
    try:
        generator = Cube3DGenerator(args.model_path)
    except Exception as e:
        print(f"\n✗ Failed to initialize generator: {e}")
        return

    output_dir = Path(args.output)

    # Generate each 3D model
    successful = 0
    failed = 0
    total_start = time.time()

    for idx, row in model_assets.iterrows():
        asset_spec = row.to_dict()

        if generator.generate_3d_model(asset_spec, output_dir):
            successful += 1
        else:
            failed += 1

        print()

    total_time = time.time() - total_start
    avg_time = total_time / len(model_assets) if len(model_assets) > 0 else 0

    print("="*60)
    print("Generation Complete!")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Total time: {total_time/60:.1f} minutes")
    print(f"  Average: {avg_time:.1f}s per model")
    print(f"  Output: {output_dir}")
    print("="*60 + "\n")

    print("Performance Notes:")
    print("  • Simple objects: 30-60 seconds")
    print("  • Complex objects: 2-5 minutes")
    print("  • Exports: .obj (default) + .glb (Godot/web)")
    print()

    print("Import to Godot:")
    print("  1. Copy .obj/.glb files to your Godot project/assets/3d_models/")
    print("  2. Drag & drop into Godot editor")
    print("  3. Godot auto-imports as 3D scenes")
    print()

if __name__ == "__main__":
    main()
