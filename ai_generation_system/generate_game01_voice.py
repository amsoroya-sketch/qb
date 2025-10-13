#!/usr/bin/env python3
"""
Game 01: Color Matching Puzzle - Voice Generation with Bark
Day 2 of Hugging Face Setup Learning Roadmap
SkillBridge Educational Gaming Platform
"""

import torch
import numpy as np
from transformers import AutoProcessor, BarkModel
import scipy.io.wavfile as wavfile
import os
from datetime import datetime

# Voice-over scripts from Game 01 GDD
VOICE_SCRIPTS = {
    "intro": {
        "text": "Welcome to Color Matching! Let's match things by color!",
        "speaker": "female_warm"  # Warm, encouraging adult voice
    },
    "encouragement_1": {
        "text": "You're doing great!",
        "speaker": "female_warm"
    },
    "encouragement_2": {
        "text": "Nice matching!",
        "speaker": "female_warm"
    },
    "correct_red": {
        "text": "That's right! Red and red match!",
        "speaker": "female_warm"
    },
    "correct_blue": {
        "text": "Perfect! The ball goes in the blue bucket!",
        "speaker": "female_warm"
    },
    "redirect_1": {
        "text": "Hmm, let's try again!",
        "speaker": "female_warm"
    },
    "redirect_2": {
        "text": "Almost! Try another one!",
        "speaker": "female_warm"
    },
    "completion": {
        "text": "Wow! You matched all the colors! Amazing work!",
        "speaker": "female_warm"
    },
    "mastery": {
        "text": "You've mastered this level! Ready for a new challenge?",
        "speaker": "female_warm"
    },
    "keep_going": {
        "text": "Keep going!",
        "speaker": "female_warm"
    }
}

# Bark speaker presets (predefined voice characteristics)
BARK_SPEAKERS = {
    "female_warm": "v2/en_speaker_6",  # Warm female voice
    "male_friendly": "v2/en_speaker_3",  # Friendly male voice
    "child_excited": "v2/en_speaker_9"  # Child voice (peer model)
}

def initialize_bark():
    """Load Bark model for voice generation"""
    print("=" * 70)
    print("Bark TTS - Game 01 Voice Generation")
    print("Color Matching Puzzle Voice-Overs")
    print("=" * 70)

    print(f"\n✓ GPU: {torch.cuda.get_device_name(0)}")
    print(f"✓ CUDA Available: {torch.cuda.is_available()}")

    print("\nLoading Bark model...")
    print("(This may take a minute...)\n")

    # Load processor and model
    processor = AutoProcessor.from_pretrained("suno/bark")
    model = BarkModel.from_pretrained("suno/bark")

    # Move to GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = model.to(device)

    print(f"✓ Bark model loaded on {device}!\n")

    return processor, model, device

def generate_voice(processor, model, device, text, speaker_preset, output_path):
    """Generate voice-over with Bark"""

    print(f"\n{'=' * 70}")
    print(f"Generating voice-over...")
    print(f"{'=' * 70}")
    print(f"Text: {text}")
    print(f"Speaker: {speaker_preset}")

    # Prepare inputs
    inputs = processor(
        text,
        voice_preset=speaker_preset,
        return_tensors="pt"
    ).to(device)

    # Generate speech
    with torch.inference_mode():
        speech_output = model.generate(**inputs, do_sample=True)

    # Convert to numpy array
    audio_array = speech_output[0].cpu().numpy()

    # Bark outputs at 24kHz
    sample_rate = 24000

    # Normalize audio to prevent clipping
    audio_array = audio_array / np.max(np.abs(audio_array))
    audio_array = (audio_array * 32767).astype(np.int16)

    # Save as WAV file
    wavfile.write(output_path, sample_rate, audio_array)

    duration = len(audio_array) / sample_rate

    print(f"✓ Saved: {output_path}")
    print(f"✓ Duration: {duration:.2f} seconds")
    print(f"✓ Sample rate: {sample_rate} Hz")

    return output_path, duration

def generate_all_voices():
    """Generate all Game 01 voice-overs"""

    # Create output directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = os.path.expanduser(f"~/ai-tools/game01_voice_{timestamp}")
    os.makedirs(output_dir, exist_ok=True)

    print(f"\n✓ Output Directory: {output_dir}")

    # Initialize Bark
    processor, model, device = initialize_bark()

    # Track generated audio
    generated = []
    total_duration = 0

    print("\n" + "=" * 70)
    print(f"Generating Voice-Overs ({len(VOICE_SCRIPTS)} clips)")
    print("=" * 70)

    for i, (clip_name, clip_data) in enumerate(VOICE_SCRIPTS.items(), 1):
        print(f"\n[{i}/{len(VOICE_SCRIPTS)}] {clip_name}")

        text = clip_data["text"]
        speaker = BARK_SPEAKERS[clip_data["speaker"]]

        output_path = os.path.join(output_dir, f"{clip_name}.wav")

        path, duration = generate_voice(
            processor,
            model,
            device,
            text,
            speaker,
            output_path
        )

        generated.append({
            "name": clip_name,
            "path": path,
            "duration": duration,
            "text": text
        })

        total_duration += duration

    # Summary
    print("\n" + "=" * 70)
    print("GENERATION COMPLETE!")
    print("=" * 70)

    print(f"\n✓ Total Voice Clips Generated: {len(generated)}")
    print(f"✓ Total Duration: {total_duration:.2f} seconds")
    print(f"✓ Average Duration: {total_duration / len(generated):.2f} seconds per clip")

    print(f"\n✓ All voice-overs saved to: {output_dir}")

    # Create manifest file
    manifest_path = os.path.join(output_dir, "manifest.txt")
    with open(manifest_path, 'w') as f:
        f.write("Game 01: Color Matching Puzzle - Voice-Over Manifest\n")
        f.write("=" * 70 + "\n\n")
        for clip in generated:
            f.write(f"Clip: {clip['name']}\n")
            f.write(f"Text: {clip['text']}\n")
            f.write(f"Duration: {clip['duration']:.2f}s\n")
            f.write(f"Path: {clip['path']}\n")
            f.write("-" * 70 + "\n")

    print(f"✓ Manifest saved: {manifest_path}")

    print("\n" + "=" * 70)
    print("Next Steps:")
    print("=" * 70)
    print("1. Review generated voice clips for quality")
    print("2. Test different speaker presets if needed")
    print("3. Move to Day 3: CSV-driven batch workflow")
    print("4. Create master pipeline for all 10 games")
    print("=" * 70)

    return output_dir, generated

if __name__ == "__main__":
    try:
        output_dir, generated = generate_all_voices()

        print(f"\n✓ SUCCESS! Game 01 voice-overs ready for Unity integration")
        print(f"✓ Output: {output_dir}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure CUDA is available")
        print("2. Check GPU memory")
        print("3. Verify Bark model downloaded correctly")
        print("4. Check available disk space")
        raise
