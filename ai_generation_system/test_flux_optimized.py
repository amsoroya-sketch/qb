#!/usr/bin/env python3
"""
FLUX test with aggressive memory optimization for 8GB VRAM
"""

import torch
from diffusers import FluxPipeline
import os
from datetime import datetime
import gc

print("="*60)
print("FLUX.1-schnell Optimized Test (8GB VRAM)")
print("="*60)

# GPU check
print(f"\n✓ GPU: {torch.cuda.get_device_name(0)}")
print(f"✓ CUDA: {torch.cuda.is_available()}")

# Clear CUDA cache
torch.cuda.empty_cache()
gc.collect()

# Create output dir
output_dir = os.path.expanduser("~/ai-tools/test_outputs")
os.makedirs(output_dir, exist_ok=True)

print("\nLoading FLUX model with memory optimizations...")
print("(This uses CPU offloading to fit in 8GB VRAM)\n")

# Load with aggressive memory saving
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
)

# Enable aggressive memory optimizations
pipe.vae.enable_slicing()
pipe.vae.enable_tiling()
pipe.enable_model_cpu_offload()  # Offload to CPU when not needed
pipe.enable_sequential_cpu_offload()  # Even more aggressive

print("✓ Model loaded with CPU offloading!\n")

# Simple test prompt
prompt = "A friendly cartoon apple with a smiling face, bright red color, simple design, white background"

print(f"Generating image (will be slower due to CPU offloading)...")
print(f"Prompt: {prompt}\n")

# Generate with minimal memory usage
with torch.inference_mode():
    image = pipe(
        prompt,
        num_inference_steps=4,
        guidance_scale=0.0,
        height=512,  # Smaller size to save memory
        width=512
    ).images[0]

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_path = os.path.join(output_dir, f"flux_test_{timestamp}.png")
image.save(output_path)

print(f"\n✓ SUCCESS!")
print(f"✓ Image saved: {output_path}")
print(f"✓ Size: {image.size}")
print("="*60)

# Clean up
del pipe
torch.cuda.empty_cache()
gc.collect()
