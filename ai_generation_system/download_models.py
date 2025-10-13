#!/usr/bin/env python3
"""
Hugging Face Model Download Script
Downloads all required models for SkillBridge Educational Gaming Platform

This script downloads models in sequence with progress tracking.
Models are cached in ~/.cache/huggingface/hub/

Required Models:
1. FLUX.1-schnell - Fast image generation (12GB)
2. Stable Audio Open - Audio/SFX generation (2GB)
3. Bark - Voice synthesis for educational content (10GB)
4. Llama-3.1-8B-Instruct - Text generation for content (16GB)
5. Whisper Large v3 - Speech recognition (3GB)
6. CLIP - Image understanding/validation (1.7GB)

Total: ~45GB
"""

import os
import sys
from datetime import datetime
from huggingface_hub import snapshot_download, hf_hub_download
from tqdm import tqdm

# Color codes for terminal output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_header(text):
    """Print formatted header"""
    print(f"\n{BLUE}{BOLD}{'='*70}{RESET}")
    print(f"{BLUE}{BOLD}{text:^70}{RESET}")
    print(f"{BLUE}{BOLD}{'='*70}{RESET}\n")

def print_success(text):
    """Print success message"""
    print(f"{GREEN}✓ {text}{RESET}")

def print_warning(text):
    """Print warning message"""
    print(f"{YELLOW}⚠ {text}{RESET}")

def print_error(text):
    """Print error message"""
    print(f"{RED}✗ {text}{RESET}")

def format_size(bytes):
    """Format bytes to human readable size"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0

def check_disk_space():
    """Check available disk space"""
    import shutil
    cache_dir = os.path.expanduser("~/.cache/huggingface")
    os.makedirs(cache_dir, exist_ok=True)

    total, used, free = shutil.disk_usage(cache_dir)

    print(f"Disk Space Check:")
    print(f"  Total: {format_size(total)}")
    print(f"  Used:  {format_size(used)}")
    print(f"  Free:  {format_size(free)}")

    required_space = 50 * 1024 * 1024 * 1024  # 50GB
    if free < required_space:
        print_warning(f"Low disk space. Recommend at least 50GB free.")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(0)
    else:
        print_success(f"Sufficient disk space available")
    print()

def download_model(model_id, model_name, estimated_size, priority="high"):
    """Download a single model with progress tracking"""

    print_header(f"Downloading: {model_name}")
    print(f"Model ID: {model_id}")
    print(f"Estimated Size: {estimated_size}")
    print(f"Priority: {priority}")

    try:
        start_time = datetime.now()

        # Download entire model repository
        cache_dir = snapshot_download(
            repo_id=model_id,
            resume_download=True,
            local_files_only=False,
        )

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        print_success(f"Downloaded successfully in {duration:.1f} seconds")
        print(f"Cache location: {cache_dir}\n")

        return True

    except Exception as e:
        print_error(f"Failed to download: {str(e)}")
        print(f"You can retry this model later\n")
        return False

def main():
    """Main download orchestration"""

    print_header("SkillBridge AI Models Download")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Check disk space
    check_disk_space()

    # Define all models to download
    models = [
        {
            "id": "black-forest-labs/FLUX.1-schnell",
            "name": "FLUX.1-schnell (Image Generation)",
            "size": "~12GB",
            "priority": "critical",
            "description": "Fast image generation for game assets (4-step diffusion)"
        },
        {
            "id": "stabilityai/stable-audio-open-1.0",
            "name": "Stable Audio Open (Audio Generation)",
            "size": "~2GB",
            "priority": "high",
            "description": "Audio/SFX generation for game sounds and music"
        },
        {
            "id": "suno/bark",
            "name": "Bark (Voice Synthesis)",
            "size": "~10GB",
            "priority": "high",
            "description": "Text-to-speech for educational voiceovers"
        },
        {
            "id": "meta-llama/Llama-3.1-8B-Instruct",
            "name": "Llama 3.1 8B Instruct (Text Generation)",
            "size": "~16GB",
            "priority": "medium",
            "description": "Content generation and game dialogue",
            "note": "Requires accepting Meta license at https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct"
        },
        {
            "id": "openai/whisper-large-v3",
            "name": "Whisper Large v3 (Speech Recognition)",
            "size": "~3GB",
            "priority": "medium",
            "description": "Voice input recognition for interactive games"
        },
        {
            "id": "openai/clip-vit-large-patch14",
            "name": "CLIP ViT Large (Image Understanding)",
            "size": "~1.7GB",
            "priority": "low",
            "description": "Image validation and quality control"
        }
    ]

    print(f"{BOLD}Total Models: {len(models)}{RESET}")
    print(f"{BOLD}Estimated Total Size: ~45GB{RESET}\n")

    # Show model list
    print_header("Models to Download")
    for i, model in enumerate(models, 1):
        print(f"{i}. {BOLD}{model['name']}{RESET}")
        print(f"   ID: {model['id']}")
        print(f"   Size: {model['size']} | Priority: {model['priority']}")
        print(f"   Use: {model['description']}")
        if 'note' in model:
            print_warning(f"   Note: {model['note']}")
        print()

    # Confirmation
    print(f"\n{YELLOW}This will download ~45GB of AI models.{RESET}")
    print(f"{YELLOW}Downloads will be cached in ~/.cache/huggingface/hub/{RESET}")
    response = input(f"\nProceed with download? (y/n): ")

    if response.lower() != 'y':
        print("\nDownload cancelled.")
        sys.exit(0)

    # Track results
    results = {
        "success": [],
        "failed": [],
        "skipped": []
    }

    start_time = datetime.now()

    # Download each model
    for i, model in enumerate(models, 1):
        print(f"\n{BOLD}[{i}/{len(models)}]{RESET}")

        # Special handling for gated models
        if 'note' in model and 'license' in model['note'].lower():
            print_warning(model['note'])
            response = input(f"Have you accepted the license? (y/n/skip): ")
            if response.lower() == 'skip':
                results["skipped"].append(model['name'])
                print_warning(f"Skipped {model['name']}")
                continue
            elif response.lower() != 'y':
                results["skipped"].append(model['name'])
                print_warning(f"Skipped {model['name']} - license not accepted")
                continue

        success = download_model(
            model['id'],
            model['name'],
            model['size'],
            model['priority']
        )

        if success:
            results["success"].append(model['name'])
        else:
            results["failed"].append(model['name'])

            # Ask if user wants to continue
            response = input(f"Continue with remaining models? (y/n): ")
            if response.lower() != 'y':
                print("\nDownload process stopped by user.")
                break

    # Final summary
    end_time = datetime.now()
    total_duration = (end_time - start_time).total_seconds()

    print_header("Download Summary")

    print(f"{BOLD}Started:{RESET}  {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{BOLD}Finished:{RESET} {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{BOLD}Duration:{RESET} {total_duration/60:.1f} minutes")
    print()

    if results["success"]:
        print(f"{GREEN}{BOLD}✓ Successfully Downloaded ({len(results['success'])})::{RESET}")
        for model in results["success"]:
            print(f"  {GREEN}✓{RESET} {model}")
        print()

    if results["failed"]:
        print(f"{RED}{BOLD}✗ Failed ({len(results['failed'])})::{RESET}")
        for model in results["failed"]:
            print(f"  {RED}✗{RESET} {model}")
        print()

    if results["skipped"]:
        print(f"{YELLOW}{BOLD}⊘ Skipped ({len(results['skipped'])})::{RESET}")
        for model in results["skipped"]:
            print(f"  {YELLOW}⊘{RESET} {model}")
        print()

    # Next steps
    print_header("Next Steps")

    if len(results["success"]) > 0:
        print("1. Test image generation:")
        print(f"   cd ~/ai-tools && source hf-env/bin/activate && python test_flux.py")
        print()
        print("2. Continue with Day 2 of Hugging Face learning roadmap")
        print()
        print("3. Generate assets for Game 01: Color Matching Puzzle")
        print()

    if results["failed"]:
        print(f"{YELLOW}To retry failed downloads, run this script again.{RESET}")
        print(f"{YELLOW}Failed downloads will resume from where they stopped.{RESET}")
        print()

    if results["skipped"]:
        print(f"{YELLOW}For skipped models with license requirements:{RESET}")
        print(f"1. Visit the model page on Hugging Face")
        print(f"2. Accept the license agreement")
        print(f"3. Run this script again")
        print()

    print(f"Cache location: ~/.cache/huggingface/hub/")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Download interrupted by user.{RESET}")
        print("Progress has been saved. Run script again to resume.")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
