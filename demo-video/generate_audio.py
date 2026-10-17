import asyncio
import os
import subprocess
import json
import numpy as np

OUTPUT_DIR = "/home/saksham-rai/healthcare-quad2/mediscript/demo-video/public/audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VOICEOVER_TRACKS = [
    {
        "filename": "act1_crisis.mp3",
        "voice": "en-IN-PrabhatNeural",
        "text": "Every single day across India, millions of patients walk into outpatient clinics clutching frayed paper prescriptions, faded lab slips, and incomplete medical histories. Doctors are forced to make split-second therapeutic decisions in the dark—unable to read cursive handwriting, blind to past allergic reactions, and vulnerable to catastrophic drug interactions. The longitudinal patient journey is fundamentally broken.",
        "rate": "+0%"
    },
    {
        "filename": "act2_herbarium.mp3",
        "voice": "en-IN-PrabhatNeural",
        "text": "Meet MediScript. Inspired by the taxonomy of nineteenth-century botanical field guides, MediScript unifies fragmented health records into an editorial vintage sanctuary. Built for multi-generational Indian families, it provides isolated, sovereign clinical partitions for every family member—from Rajesh to Sunita and Aarav—with zero data bleed.",
        "rate": "+0%"
    },
    {
        "filename": "act3_ocr_safety.mp3",
        "voice": "en-IN-PrabhatNeural",
        "text": "Behind its artisanal surface lies multimodal intelligence. Using spatial coordinate grounding, MediScript parses cursive doctor scripts, mapping handwriting to FHIR-grade clinical entities. Instantly, our deterministic safety engine executes bidirectional drug-drug interaction audits and penicillin allergy verification before a single pill is consumed.",
        "rate": "+0%"
    },
    {
        "filename": "act4_voice_intro.mp3",
        "voice": "en-IN-PrabhatNeural",
        "text": "Healthcare is personal, and in India, voice in one's native language is paramount. BulbaCare is our trilingual conversational companion, supporting English, Hindi, and Marathi with sub-second latency, natural barge-in interruptions, and direct grounding against the patient’s clinical vault.",
        "rate": "+0%"
    },
    {
        "filename": "act5_consent_dpdp.mp3",
        "voice": "en-IN-PrabhatNeural",
        "text": "Data sovereignty is non-negotiable. MediScript strictly enforces ABDM Milestones M1 through M3 and India's DPDP Act 2023. Patients grant time-bounded, granular consent via dynamic cryptographic PINs. In emergencies, the Break-Glass protocol unlocks life-saving access under immutable audit. And under DPDP Section 12, the right to erasure executes true cryptographic shredding.",
        "rate": "+0%"
    },
    {
        "filename": "act6_outro.mp3",
        "voice": "en-IN-PrabhatNeural",
        "text": "Bridging traditional clinical practice with state-of-the-art sovereign AI. MediScript restores continuity, dignity, and safety to every prescription. Built for India, ready for the world. Thank you.",
        "rate": "+0%"
    },
    # Act 4 dialogue stems
    {
        "filename": "act4_patient_hindi.mp3",
        "voice": "hi-IN-MadhurNeural",
        "text": "बल्बाकेयर, क्या मैं अपनी ब्लड प्रेशर की दवा खाने के तुरंत बाद ले सकता हूँ?",
        "rate": "+0%"
    },
    {
        "filename": "act4_bulba_hindi.mp3",
        "voice": "hi-IN-SwaraNeural",
        "text": "हाँ राजेश जी, आपकी टेलमिसार्टन 40 मिलीग्राम भोजन के तुरंत बाद लेना बिल्कुल सुरक्षित है।",
        "rate": "+0%"
    },
    {
        "filename": "act4_patient_marathi.mp3",
        "voice": "mr-IN-ManoharNeural",
        "text": "आणि मला डोकेदुखीसाठी काही वेगळं औषध घ्यावं लागेल का?",
        "rate": "+0%"
    },
    {
        "filename": "act4_bulba_marathi.mp3",
        "voice": "mr-IN-AarohiNeural",
        "text": "कृपया डॉक्टरांच्या सल्ल्याशिवाय आयबुप्रोफेन घेऊ नका, कारण ते तुमच्या बीपीच्या गोळ्यांवर परिणाम करू शकते।",
        "rate": "+0%"
    }
]

async def generate_speech():
    import edge_tts
    print("Checking / generating speech audio tracks...")
    for item in VOICEOVER_TRACKS:
        file_path = os.path.join(OUTPUT_DIR, item["filename"])
        if os.path.exists(file_path) and os.path.getsize(file_path) > 1000:
            print(f"Already exists: {item['filename']} ({os.path.getsize(file_path)} bytes)")
            continue
        print(f"Generating {item['filename']} with voice {item['voice']}...")
        communicate = edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"])
        await communicate.save(file_path)
        print(f"Saved {file_path}")

def generate_ambient_music():
    bg_music_path = os.path.join(OUTPUT_DIR, "bg_music.mp3")
    if os.path.exists(bg_music_path) and os.path.getsize(bg_music_path) > 1000000:
        print(f"Already exists: bg_music.mp3 ({os.path.getsize(bg_music_path)} bytes)")
        return
    print("Generating 210-second ambient warm lo-fi harmonic synth bed...")
    sample_rate = 44100
    duration = 210.0
    total_samples = int(sample_rate * duration)
    
    # Pre-allocate stereo channels
    left = np.zeros(total_samples, dtype=np.float32)
    right = np.zeros(total_samples, dtype=np.float32)
    
    chord_duration = 7.0
    samples_per_chord = int(sample_rate * chord_duration)
    
    chords = [
        [146.83, 220.00, 277.18, 329.63, 369.99],   # Dmaj9
        [123.47, 185.00, 220.00, 277.18, 293.66],   # Bm9
        [98.00, 146.83, 185.00, 220.00, 293.66],    # Gmaj7
        [110.00, 164.81, 220.00, 293.66, 329.63]    # A7sus4
    ]
    
    t_chord = np.linspace(0, chord_duration, samples_per_chord, endpoint=False, dtype=np.float32)
    env = (np.sin(np.pi * (t_chord / chord_duration)) ** 1.5).astype(np.float32)
    
    num_chord_slots = int(np.ceil(duration / chord_duration)) # 30 slots
    for slot_idx in range(num_chord_slots):
        start_sample = slot_idx * samples_per_chord
        if start_sample >= total_samples:
            break
        end_sample = min(start_sample + samples_per_chord, total_samples)
        curr_len = end_sample - start_sample
        
        chord = chords[slot_idx % len(chords)]
        t_global = np.linspace(start_sample / sample_rate, end_sample / sample_rate, curr_len, endpoint=False, dtype=np.float32)
        local_env = env[:curr_len]
        
        s_l = np.zeros(curr_len, dtype=np.float32)
        s_r = np.zeros(curr_len, dtype=np.float32)
        
        for f in chord:
            # Main tone + warm chorus detune
            s_l += 0.16 * np.sin(2 * np.pi * f * t_global) + 0.08 * np.sin(2 * np.pi * (f * 1.002) * t_global)
            s_r += 0.16 * np.sin(2 * np.pi * (f * 0.998) * t_global) + 0.08 * np.sin(2 * np.pi * (f * 1.001) * t_global)
            
            # Sub-bass for root note
            if f == chord[0]:
                sub = 0.22 * np.sin(2 * np.pi * (f * 0.5) * t_global)
                s_l += sub
                s_r += sub
                
        left[start_sample:end_sample] += (s_l * local_env).astype(np.float32)
        right[start_sample:end_sample] += (s_r * local_env).astype(np.float32)

    # Vectorized subtle electric piano / acoustic bell plucks
    pluck_interval = 3.5
    num_plucks = int(duration / pluck_interval)
    pluck_len_samples = int(sample_rate * 2.5)
    t_pluck = np.linspace(0, 2.5, pluck_len_samples, endpoint=False, dtype=np.float32)
    pluck_base_env = (np.exp(-t_pluck * 2.2) * 0.14).astype(np.float32)
    
    for p in range(num_plucks):
        p_time = p * pluck_interval
        start_idx = int(p_time * sample_rate)
        if start_idx >= total_samples:
            break
        end_idx = min(start_idx + pluck_len_samples, total_samples)
        curr_len = end_idx - start_idx
        
        chord_idx = int((p_time // chord_duration) % len(chords))
        chord = chords[chord_idx]
        note = chord[(p * 2 + 1) % len(chord)] * 2.0
        
        p_t = t_pluck[:curr_len]
        p_wave = (np.sin(2 * np.pi * note * p_t) + 0.28 * np.sin(2 * np.pi * note * 2 * p_t)) * pluck_base_env[:curr_len]
        pan = 0.5 + 0.22 * np.sin(p * 1.4)
        
        left[start_idx:end_idx] += (p_wave * (1.0 - pan)).astype(np.float32)
        right[start_idx:end_idx] += (p_wave * pan).astype(np.float32)

    # Master fades: 3.0s fade in, 5.0s fade out
    fade_in_len = int(sample_rate * 3.0)
    fade_out_len = int(sample_rate * 5.0)
    left[:fade_in_len] *= np.linspace(0, 1, fade_in_len, dtype=np.float32)
    right[:fade_in_len] *= np.linspace(0, 1, fade_in_len, dtype=np.float32)
    left[-fade_out_len:] *= np.linspace(1, 0, fade_out_len, dtype=np.float32)
    right[-fade_out_len:] *= np.linspace(1, 0, fade_out_len, dtype=np.float32)

    # Normalize to -1dB peak / gentle comfortable bed
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
    if peak > 0:
        left = (left / peak) * 0.70
        right = (right / peak) * 0.70

    # Interleave to stereo
    stereo = np.empty((total_samples * 2,), dtype=np.float32)
    stereo[0::2] = left
    stereo[1::2] = right

    raw_path = os.path.join(OUTPUT_DIR, "raw_music.f32le")
    with open(raw_path, "wb") as f:
        stereo.tofile(f)

    bg_music_path = os.path.join(OUTPUT_DIR, "bg_music.mp3")
    cmd = [
        "ffmpeg", "-y",
        "-f", "f32le",
        "-ar", str(sample_rate),
        "-ac", "2",
        "-i", raw_path,
        "-af", "lowpass=f=2200,aecho=0.8:0.88:60:0.35,volume=0.85",
        "-codec:a", "libmp3lame",
        "-b:a", "192k",
        bg_music_path
    ]
    subprocess.run(cmd, check=True)
    if os.path.exists(raw_path):
        os.remove(raw_path)
    print(f"Generated {bg_music_path}")

def get_audio_duration(file_path):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def compute_timings():
    print("Calculating audio timings and scene frame allocations at 30 FPS...")
    all_files = [
        "act1_crisis.mp3",
        "act2_herbarium.mp3",
        "act3_ocr_safety.mp3",
        "act4_voice_intro.mp3",
        "act4_patient_hindi.mp3",
        "act4_bulba_hindi.mp3",
        "act4_patient_marathi.mp3",
        "act4_bulba_marathi.mp3",
        "act5_consent_dpdp.mp3",
        "act6_outro.mp3",
        "bg_music.mp3"
    ]

    durations = {}
    frames_map = {}
    for fname in all_files:
        fpath = os.path.join(OUTPUT_DIR, fname)
        dur = get_audio_duration(fpath)
        frames = int(np.ceil(dur * 30))
        durations[fname] = {
            "durationSeconds": round(dur, 3),
            "durationFrames": frames
        }
        frames_map[fname] = frames
        print(f"File: {fname:25s} | {dur:6.2f}s | {frames:5d} frames")

    fps = 30
    
    # Act timings: meticulously calculated so every dialogue stem and voiceover has natural
    # breathing room before and after, perfectly totaling 6,300 frames (210.0s) matching bg_music.mp3.
    #
    # Act 1 (1050 frames / 35.0s):
    #   Crisis voiceover: 916 frames (30.53s)
    #   Starts at frame 15, ends at 931. Leaving 119 frames (4.0s) for the dramatic broken journey montage.
    act1_frames = 1050
    act1_start = 0

    # Act 2 (900 frames / 30.0s):
    #   Herbarium sanctuary voiceover: 800 frames (26.64s)
    #   Starts at frame 1065, ends at 1865. Leaving 85 frames (2.8s) for partition UI navigation.
    act2_frames = 900
    act2_start = act1_start + act1_frames # 1050

    # Act 3 (900 frames / 30.0s):
    #   Multimodal OCR & safety voiceover: 775 frames (25.82s)
    #   Starts at frame 1965, ends at 2740. Leaving 110 frames (3.7s) for bounding box & DDI audit animations.
    act3_frames = 900
    act3_start = act2_start + act2_frames # 1950

    # Act 4 (1700 frames / 56.67s):
    #   Trilingual companion intro + conversational Hindi & Marathi dialogue
    act4_frames = 1700
    act4_start = act3_start + act3_frames # 2850

    # Dialogue cues within Act 4:
    a4_intro_start = act4_start + 15                           # 2865
    a4_intro_dur = frames_map["act4_voice_intro.mp3"]           # 654 (ends 3519)
    a4_h_pat_start = a4_intro_start + a4_intro_dur + 30        # 3549 (1.0s pause)
    a4_h_pat_dur = frames_map["act4_patient_hindi.mp3"]        # 180 (ends 3729)
    a4_h_bulba_start = a4_h_pat_start + a4_h_pat_dur + 24      # 3753 (0.8s pause)
    a4_h_bulba_dur = frames_map["act4_bulba_hindi.mp3"]        # 243 (ends 3996)
    a4_m_pat_start = a4_h_bulba_start + a4_h_bulba_dur + 36    # 4032 (1.2s pause)
    a4_m_pat_dur = frames_map["act4_patient_marathi.mp3"]      # 157 (ends 4189)
    a4_m_bulba_start = a4_m_pat_start + a4_m_pat_dur + 24      # 4213 (0.8s pause)
    a4_m_bulba_dur = frames_map["act4_bulba_marathi.mp3"]      # 258 (ends 4471)
    # Ends at 4471, leaving 79 frames (2.6s) before Act 5

    # Act 5 (1100 frames / 36.67s):
    #   Consent sovereignty & DPDP voiceover: 995 frames (33.14s)
    #   Starts at frame 4565, ends at 5560. Leaving 90 frames (3.0s) for cryptographic shredding animation.
    act5_frames = 1100
    act5_start = act4_start + act4_frames # 4550

    # Act 6 (650 frames / 21.67s):
    #   Grand outro voiceover: 485 frames (16.15s)
    #   Starts at frame 5665, ends at 6150. Leaving 150 frames (5.0s) for the final logo reveal & vision credits.
    act6_frames = 650
    act6_start = act5_start + act5_frames # 5650

    total_frames = act1_frames + act2_frames + act3_frames + act4_frames + act5_frames + act6_frames # Exactly 6300 frames!
    total_seconds = total_frames / fps # 210.0 seconds!

    timings_data = {
        "metadata": {
            "fps": fps,
            "targetDurationSeconds": 210.0,
            "targetDurationFrames": 6300,
            "totalCompositionDurationSeconds": round(total_seconds, 3),
            "totalCompositionFrames": total_frames,
            "bgMusicFile": "bg_music.mp3",
            "bgMusicDurationSeconds": durations["bg_music.mp3"]["durationSeconds"]
        },
        "audioFiles": durations,
        "scenes": [
            {
                "act": 1,
                "name": "Act 1: The Crisis of Fragmented Indian Healthcare",
                "startFrame": act1_start,
                "durationFrames": act1_frames,
                "startTimeSeconds": round(act1_start / fps, 3),
                "durationSeconds": round(act1_frames / fps, 3),
                "voiceover": {
                    "file": "act1_crisis.mp3",
                    "startFrame": act1_start + 15,
                    "durationFrames": frames_map["act1_crisis.mp3"]
                }
            },
            {
                "act": 2,
                "name": "Act 2: MediScript Herbarium Sanctuary & Sovereign Partitions",
                "startFrame": act2_start,
                "durationFrames": act2_frames,
                "startTimeSeconds": round(act2_start / fps, 3),
                "durationSeconds": round(act2_frames / fps, 3),
                "voiceover": {
                    "file": "act2_herbarium.mp3",
                    "startFrame": act2_start + 15,
                    "durationFrames": frames_map["act2_herbarium.mp3"]
                }
            },
            {
                "act": 3,
                "name": "Act 3: Multimodal Spatial OCR & Clinical Safety Engine",
                "startFrame": act3_start,
                "durationFrames": act3_frames,
                "startTimeSeconds": round(act3_start / fps, 3),
                "durationSeconds": round(act3_frames / fps, 3),
                "voiceover": {
                    "file": "act3_ocr_safety.mp3",
                    "startFrame": act3_start + 15,
                    "durationFrames": frames_map["act3_ocr_safety.mp3"]
                }
            },
            {
                "act": 4,
                "name": "Act 4: BulbaCare Trilingual Clinical Companion (EN, HI, MR)",
                "startFrame": act4_start,
                "durationFrames": act4_frames,
                "startTimeSeconds": round(act4_start / fps, 3),
                "durationSeconds": round(act4_frames / fps, 3),
                "dialogueCues": [
                    {
                        "character": "Narrator",
                        "language": "English",
                        "file": "act4_voice_intro.mp3",
                        "startFrame": a4_intro_start,
                        "durationFrames": a4_intro_dur
                    },
                    {
                        "character": "Patient (Rajesh)",
                        "language": "Hindi",
                        "file": "act4_patient_hindi.mp3",
                        "startFrame": a4_h_pat_start,
                        "durationFrames": a4_h_pat_dur
                    },
                    {
                        "character": "BulbaCare",
                        "language": "Hindi",
                        "file": "act4_bulba_hindi.mp3",
                        "startFrame": a4_h_bulba_start,
                        "durationFrames": a4_h_bulba_dur
                    },
                    {
                        "character": "Patient (Rajesh)",
                        "language": "Marathi",
                        "file": "act4_patient_marathi.mp3",
                        "startFrame": a4_m_pat_start,
                        "durationFrames": a4_m_pat_dur
                    },
                    {
                        "character": "BulbaCare",
                        "language": "Marathi",
                        "file": "act4_bulba_marathi.mp3",
                        "startFrame": a4_m_bulba_start,
                        "durationFrames": a4_m_bulba_dur
                    }
                ]
            },
            {
                "act": 5,
                "name": "Act 5: Data Sovereignty, Dynamic PINs & DPDP Section 12",
                "startFrame": act5_start,
                "durationFrames": act5_frames,
                "startTimeSeconds": round(act5_start / fps, 3),
                "durationSeconds": round(act5_frames / fps, 3),
                "voiceover": {
                    "file": "act5_consent_dpdp.mp3",
                    "startFrame": act5_start + 15,
                    "durationFrames": frames_map["act5_consent_dpdp.mp3"]
                }
            },
            {
                "act": 6,
                "name": "Act 6: Sovereign Clinical Vision & Grand Outro",
                "startFrame": act6_start,
                "durationFrames": act6_frames,
                "startTimeSeconds": round(act6_start / fps, 3),
                "durationSeconds": round(act6_frames / fps, 3),
                "voiceover": {
                    "file": "act6_outro.mp3",
                    "startFrame": act6_start + 15,
                    "durationFrames": frames_map["act6_outro.mp3"]
                }
            }
        ]
    }

    timings_path = os.path.join(OUTPUT_DIR, "audio-timings.json")
    with open(timings_path, "w", encoding="utf-8") as f:
        json.dump(timings_data, f, indent=2, ensure_ascii=False)
    print(f"Wrote timings to {timings_path}")
    return timings_data

async def main():
    # Remove test file if exists
    test_p = os.path.join(OUTPUT_DIR, "test.mp3")
    if os.path.exists(test_p):
        os.remove(test_p)
        
    await generate_speech()
    generate_ambient_music()
    compute_timings()

if __name__ == "__main__":
    asyncio.run(main())
