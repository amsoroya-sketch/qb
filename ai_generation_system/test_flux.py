#!/usr/bin/env python3
"""
FLUX.1-schnell Test Script - First Image Generation
Part of Day 1: Foundation & Authentication
SkillBridge Educational Gaming Platform
"""

import torch
from diffusers import FluxPipeline
import os
from datetime import datetime

def test_flux_generation():
    """Generate test image using FLUX.1-schnell"""

    print("=" * 60)
    print("FLUX.1-schnell Test - SkillBridge Asset Generation")
    print("=" * 60)

    # Verify CUDA availability
    print(f"\n✓ GPU Device: {torch.cuda.get_device_name(0)}")
    print(f"✓ CUDA Available: {torch.cuda.is_available()}")
    print(f"✓ PyTorch Version: {torch.__version__}")

    # Create output directory
    output_dir = os.path.expanduser("~/ai-tools/test_outputs")
    os.makedirs(output_dir, exist_ok=True)
    print(f"✓ Output Directory: {output_dir}")

    # Load FLUX.1-schnell pipeline
    print("\n" + "=" * 60)
    print("Loading FLUX.1-schnell model...")
    print("Note: First run will download ~12GB model")
    print("=" * 60 + "\n")

    pipe = FluxPipeline.from_pretrained(
        "black-forest-labs/FLUX.1-schnell",
        torch_dtype=torch.bfloat16,
        device_map="balanced"
    )

    print("\n✓ Model loaded successfully!")

    # Test prompt - autism-friendly educational game asset
    prompt = """
    A friendly, colorful cartoon apple with a happy smiling face,
    simple design, bright red color, green leaf on top,
    soft rounded edges, child-friendly style, high contrast,
    clean white background, educational game asset
    """

    print("\n" + "=" * 60)
    print("Generating Test Image")
    print("=" * 60)
    print(f"Prompt: {prompt.strip()}")
    print("\nGenerating... (this takes 5-15 seconds)")

    # Generate image
    image = pipe(
        prompt,
        guidance_scale=0.0,  # FLUX.1-schnell doesn't use guidance
        num_inference_steps=4,  # schnell is optimized for 4 steps
        max_sequence_length=256,
        generator=torch.Generator("cuda").manual_seed(42)
    ).images[0]

    # Save image with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"flux_test_{timestamp}.png")
    image.save(output_path)

    print(f"\n✓ Image generated successfully!")
    print(f"✓ Saved to: {output_path}")

    # Print image info
    print("\n" + "=" * 60)
    print("Image Information")
    print("=" * 60)
    print(f"Size: {image.size}")
    print(f"Format: {image.format or 'PNG'}")
    print(f"Mode: {image.mode}")

    print("\n" + "=" * 60)
    print("Test Complete!")
    print("=" * 60)
    print("\nNext Steps:")
    print("- Open the image to verify quality")
    print("- Try modifying the prompt")
    print("- Generate assets for Game 01: Color Matching")
    print("=" * 60)

if __name__ == "__main__":
    try:
        test_flux_generation()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure CUDA is available")
        print("2. Check GPU memory (need ~8GB VRAM)")
        print("3. Verify Hugging Face authentication")
        print("4. Check internet connection for model download")
        raise
