#!/usr/bin/env python3
"""
Game 01: Color Matching Puzzle - Asset Generation with FLUX.1-schnell
Day 2 of Hugging Face Setup Learning Roadmap
SkillBridge Educational Gaming Platform
"""

import torch
from diffusers import FluxPipeline
import os
from datetime import datetime
import gc

# Asset configuration based on GAME_01 GDD
ASSETS = {
    "objects": [
        {
            "name": "red_ball",
            "prompt": "A bright red ball, simple sphere, smooth glossy surface, child-friendly cartoon style, slight highlight on top, clean white background, educational game asset, PNG format, centered, high contrast"
        },
        {
            "name": "blue_car",
            "prompt": "A cute blue toy car, simple cartoon style, rounded edges, friendly appearance, side view, bright royal blue color, clean white background, educational game asset for autism education, high contrast"
        },
        {
            "name": "yellow_star",
            "prompt": "A bright yellow five-pointed star, flat 2D shape, cartoon style, cheerful appearance, solid color #F1C40F, soft glow effect, white background, educational game asset, child-friendly, high contrast"
        },
        {
            "name": "green_frog",
            "prompt": "A friendly cartoon green frog, cute smiling face, sitting position, simple design, bright lime green color, large eyes, rounded shapes, white background, educational game asset, autism-friendly, high contrast"
        },
        {
            "name": "orange_fruit",
            "prompt": "A realistic bright orange fruit, whole orange with green leaf on top, round shape, textured peel, vibrant color #E67E22, clean white background, educational game asset, child-friendly, high contrast"
        },
        {
            "name": "purple_flower",
            "prompt": "A beautiful purple flower, simple cartoon style, 5-6 petals, bright purple color #9B59B6, green stem with two leaves, friendly appearance, white background, educational game asset, high contrast"
        },
        {
            "name": "red_apple",
            "prompt": "A shiny red apple with a smiling cartoon face, bright red color #E74C3C, friendly eyes and cheerful smile, green leaf on top, rounded shape, white background, educational game for autism, high contrast"
        },
        {
            "name": "blue_ball",
            "prompt": "A bright blue ball, simple sphere, smooth glossy surface, child-friendly cartoon style, royal blue color #3498DB, slight highlight reflection, clean white background, educational game asset, high contrast"
        },
        {
            "name": "yellow_banana",
            "prompt": "A bright yellow banana, curved shape, realistic texture, cheerful yellow color #F1C40F, slight brown spots for realism, white background, educational game asset, child-friendly, simple design, high contrast"
        },
        {
            "name": "green_leaf",
            "prompt": "A large bright green leaf, simple cartoon style, oval shape with visible veins, fresh green color #2ECC71, slightly curved, white background, educational game asset, clean design, high contrast"
        }
    ],
    "containers": [
        {
            "name": "red_bucket",
            "prompt": "A large bright red bucket container, simple cylindrical shape, clean design, solid red color #E74C3C, slight shadow for depth, front view, empty inside visible, white background, educational game asset for color matching, high contrast, PNG transparent"
        },
        {
            "name": "blue_bucket",
            "prompt": "A large bright blue bucket container, simple cylindrical shape, clean design, solid royal blue color #3498DB, slight shadow for depth, front view, empty inside visible, white background, educational game asset for color matching, high contrast, PNG transparent"
        },
        {
            "name": "yellow_bucket",
            "prompt": "A large bright yellow bucket container, simple cylindrical shape, clean design, solid yellow color #F1C40F, slight shadow for depth, front view, empty inside visible, white background, educational game asset for color matching, high contrast, PNG transparent"
        },
        {
            "name": "green_bucket",
            "prompt": "A large bright green bucket container, simple cylindrical shape, clean design, solid green color #2ECC71, slight shadow for depth, front view, empty inside visible, white background, educational game asset for color matching, high contrast, PNG transparent"
        }
    ],
    "backgrounds": [
        {
            "name": "playroom_background",
            "prompt": "A soft, cozy playroom interior background, light carpet floor texture, blurred toy shelf in background, window showing blue sky, warm and inviting atmosphere, muted pastel colors, uncluttered, calm environment, child-friendly, educational game background, autism-friendly design, minimal distractions"
        },
        {
            "name": "garden_background",
            "prompt": "A peaceful garden scene background, soft grass texture floor, flowers and trees in blurred background, sunny day with blue sky, calming nature environment, gentle colors, uncluttered composition, child-friendly outdoor scene, educational game background, minimal distractions, autism-friendly design"
        }
    ]
}

def initialize_flux_pipeline():
    """Load FLUX.1-schnell with aggressive memory optimizations for 8GB VRAM"""
    print("=" * 70)
    print("FLUX.1-schnell - Game 01 Asset Generation")
    print("Color Matching Puzzle Assets")
    print("=" * 70)

    print(f"\n✓ GPU: {torch.cuda.get_device_name(0)}")
    print(f"✓ CUDA Available: {torch.cuda.is_available()}")

    # Clear CUDA cache
    torch.cuda.empty_cache()
    gc.collect()

    print("\nLoading FLUX.1-schnell model...")
    print("(Using aggressive memory optimizations for 8GB VRAM)\n")

    # Load with optimizations
    pipe = FluxPipeline.from_pretrained(
        "black-forest-labs/FLUX.1-schnell",
        torch_dtype=torch.bfloat16
    )

    # Enable aggressive memory optimizations (VAE, CPU offloading, sequential)
    pipe.vae.enable_slicing()
    pipe.vae.enable_tiling()
    pipe.enable_model_cpu_offload()
    pipe.enable_sequential_cpu_offload()

    print("✓ Model loaded with aggressive memory optimizations!\n")
    print("  - VAE slicing: enabled")
    print("  - VAE tiling: enabled")
    print("  - Model CPU offload: enabled")
    print("  - Sequential CPU offload: enabled\n")

    return pipe

def generate_asset(pipe, asset_name, prompt, category, output_dir):
    """Generate single asset with FLUX"""

    print(f"\n{'=' * 70}")
    print(f"Generating: {asset_name}")
    print(f"Category: {category}")
    print(f"{'=' * 70}")
    print(f"Prompt: {prompt}\n")

    # Generate image
    with torch.inference_mode():
        image = pipe(
            prompt,
            num_inference_steps=4,
            guidance_scale=0.0,
            height=512,
            width=512
        ).images[0]

    # Save image
    category_dir = os.path.join(output_dir, category)
    os.makedirs(category_dir, exist_ok=True)

    output_path = os.path.join(category_dir, f"{asset_name}.png")
    image.save(output_path)

    print(f"✓ Saved: {output_path}")
    print(f"✓ Size: {image.size}")

    # Clear memory
    del image
    torch.cuda.empty_cache()
    gc.collect()

    return output_path

def generate_all_assets():
    """Generate all Game 01 assets"""

    # Create output directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = os.path.expanduser(f"~/ai-tools/game01_assets_{timestamp}")
    os.makedirs(output_dir, exist_ok=True)

    print(f"\n✓ Output Directory: {output_dir}")

    # Initialize FLUX pipeline
    pipe = initialize_flux_pipeline()

    # Track generated assets
    generated = {
        "objects": [],
        "containers": [],
        "backgrounds": []
    }

    # Generate objects (10 items)
    print("\n" + "=" * 70)
    print("PHASE 1: Generating Objects (10 items)")
    print("=" * 70)

    for i, asset in enumerate(ASSETS["objects"], 1):
        print(f"\n[{i}/10] {asset['name']}")
        output_path = generate_asset(
            pipe,
            asset["name"],
            asset["prompt"],
            "objects",
            output_dir
        )
        generated["objects"].append(output_path)

    # Generate containers (4 buckets)
    print("\n" + "=" * 70)
    print("PHASE 2: Generating Containers (4 buckets)")
    print("=" * 70)

    for i, asset in enumerate(ASSETS["containers"], 1):
        print(f"\n[{i}/4] {asset['name']}")
        output_path = generate_asset(
            pipe,
            asset["name"],
            asset["prompt"],
            "containers",
            output_dir
        )
        generated["containers"].append(output_path)

    # Generate backgrounds (2 scenes)
    print("\n" + "=" * 70)
    print("PHASE 3: Generating Backgrounds (2 scenes)")
    print("=" * 70)

    for i, asset in enumerate(ASSETS["backgrounds"], 1):
        print(f"\n[{i}/2] {asset['name']}")
        output_path = generate_asset(
            pipe,
            asset["name"],
            asset["prompt"],
            "backgrounds",
            output_dir
        )
        generated["backgrounds"].append(output_path)

    # Summary
    print("\n" + "=" * 70)
    print("GENERATION COMPLETE!")
    print("=" * 70)

    total_assets = len(generated["objects"]) + len(generated["containers"]) + len(generated["backgrounds"])

    print(f"\n✓ Total Assets Generated: {total_assets}")
    print(f"  - Objects: {len(generated['objects'])}")
    print(f"  - Containers: {len(generated['containers'])}")
    print(f"  - Backgrounds: {len(generated['backgrounds'])}")

    print(f"\n✓ All assets saved to: {output_dir}")

    print("\n" + "=" * 70)
    print("Next Steps:")
    print("=" * 70)
    print("1. Review generated images for quality")
    print("2. Adjust prompts if needed and regenerate")
    print("3. Move to Day 3: Bark voice generation for instructions")
    print("4. Set up CSV-driven batch workflow")
    print("=" * 70)

    # Cleanup
    del pipe
    torch.cuda.empty_cache()
    gc.collect()

    return output_dir, generated

if __name__ == "__main__":
    try:
        output_dir, generated = generate_all_assets()

        print(f"\n✓ SUCCESS! Game 01 assets ready for Unity integration")
        print(f"✓ Output: {output_dir}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure CUDA is available")
        print("2. Check GPU memory (need ~8GB VRAM)")
        print("3. Verify Hugging Face authentication")
        print("4. Check available disk space")
        raise
