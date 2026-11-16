import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

# Set up paths
base_dir = r"E:\W c One Drive\Projects\maison-noir-luxury-coffee-main"
media_dir = os.path.join(base_dir, "media")
output_video = os.path.join(base_dir, "Maison_Noir_Luxury_Overview.mp4")

scenes = [
    {
        "id": "scene1",
        "img": os.path.join(base_dir, "docs", "screenshots", "01-homepage-hero.png"),
        "audio": os.path.join(media_dir, "ch1.wav"),
        "title": "CHAPTER 1: BRAND GENESIS & AUDIENCE IDENTITY",
        "subtitle": "Maison Noir · Mayfair London · Haute Roastery · Est. 1998",
        "badge": "DIRECT-TRADE 92+ SCA"
    },
    {
        "id": "scene2",
        "img": os.path.join(base_dir, "docs", "screenshots", "02-story-heritage.png"),
        "audio": os.path.join(media_dir, "ch2.wav"),
        "title": "CHAPTER 2: DESIGN SYSTEM & AESTHETIC PHILOSOPHY",
        "subtitle": "Obsidian Noir (#0D0A07) · Champagne Gold (#C9A25E) · Editorial Serif",
        "badge": "HAUTE COUTURE UI"
    },
    {
        "id": "scene3",
        "img": os.path.join(base_dir, "docs", "screenshots", "04-sensory-experience.png"),
        "audio": os.path.join(media_dir, "ch3.wav"),
        "title": "CHAPTER 3: TECHNICAL ARCHITECTURE & WEB AUDIO",
        "subtitle": "React 19 · Vite 7 · Tailwind v4 · Procedural Vinyl Jazz Synthesizer",
        "badge": "ZERO BUFFERING"
    },
    {
        "id": "scene4",
        "img": os.path.join(base_dir, "docs", "screenshots", "03-menu-catalogue.png"),
        "audio": os.path.join(media_dir, "ch4.wav"),
        "title": "CHAPTER 4: LIVE FEATURE DEMO & SENSORY MENU",
        "subtitle": "23-Item Fine Dining Catalogue · 5-Axis Cupping Radar · Probat Telemetry",
        "badge": "LIVE PROFILING"
    },
    {
        "id": "scene5",
        "img": os.path.join(base_dir, "docs", "screenshots", "05-gallery-ambiance.png"),
        "audio": os.path.join(media_dir, "ch5.wav"),
        "title": "CHAPTER 5: COMPLETE USER WORKFLOW & JOURNEY",
        "subtitle": "Multi-Currency Engine · Tableside Delivery · 4 Salon Zones Reservation",
        "badge": "INR / USD / EUR / GBP / AED"
    },
    {
        "id": "scene6",
        "img": os.path.join(base_dir, "docs", "screenshots", "06-visit-concierge.png"),
        "audio": os.path.join(media_dir, "ch6.wav"),
        "title": "CHAPTER 6: EXECUTIVE SUMMARY & THANK YOU NOTE",
        "subtitle": "Maison Noir · 742 Evergreen Promenade, Mayfair · Open 07:00 — 23:00",
        "badge": "THANK YOU FOR WATCHING"
    }
]

# Load fonts
try:
    font_title = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 44)
    font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 26)
    font_badge = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 20)
except Exception:
    font_title = font_sub = font_badge = ImageFont.load_default()

scene_video_files = []

print("Preparing stylized scene frames...")

for i, s in enumerate(scenes):
    # 1. Open original screenshot
    src_img = Image.open(s["img"]).convert("RGB")
    
    # Target frame size: 1920x1080
    target_w, target_h = 1920, 1080
    
    # Crop / resize to fill 1920x1080 gracefully
    src_ratio = src_img.width / src_img.height
    target_ratio = target_w / target_h
    
    if src_ratio > target_ratio:
        new_h = target_h
        new_w = int(target_h * src_ratio)
    else:
        new_w = target_w
        new_h = int(target_w / src_ratio)
        
    resized = src_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - target_w) // 2
    top = 0 # keep top aligned to see navigation and headers
    cropped = resized.crop((left, top, left + target_w, top + target_h))
    
    # 2. Add luxury lower third and top bar overlay
    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Top subtle banner
    draw.rectangle([(0, 0), (target_w, 60)], fill=(13, 10, 7, 210))
    draw.rectangle([(0, 58), (target_w, 60)], fill=(201, 162, 94, 255)) # Gold line
    draw.text((40, 18), "☕ MAISON NOIR — HAUTE SPECIALTY ROASTERY & DIGITAL SANCTUARY", font=font_sub, fill=(243, 234, 217, 240))
    
    # Right pill badge
    draw.rectangle([(target_w - 380, 14), (target_w - 40, 46)], fill=(201, 162, 94, 240))
    draw.text((target_w - 365, 18), s["badge"], font=font_badge, fill=(13, 10, 7, 255))
    
    # Bottom luxury lower-third card
    card_h = 170
    draw.rectangle([(0, target_h - card_h), (target_w, target_h)], fill=(10, 8, 6, 235))
    draw.rectangle([(0, target_h - card_h), (target_w, target_h - card_h + 3)], fill=(201, 162, 94, 255)) # Gold line
    
    # Chapter Title & Subtitle
    draw.text((60, target_h - card_h + 32), s["title"], font=font_title, fill=(243, 234, 217, 255))
    draw.text((60, target_h - card_h + 98), s["subtitle"], font=font_sub, fill=(201, 162, 94, 255))
    
    # Watermark bottom right
    draw.text((target_w - 340, target_h - 45), "VITE 7 · REACT 19 · 1080p 30FPS", font=font_badge, fill=(180, 160, 130, 200))
    
    # Composite
    final_frame = Image.alpha_composite(cropped.convert("RGBA"), overlay).convert("RGB")
    frame_path = os.path.join(media_dir, f"frame_{s['id']}.png")
    final_frame.save(frame_path, quality=98)
    
    # 3. Get exact audio duration with ffprobe
    probe_cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", s["audio"]
    ]
    dur_str = subprocess.check_output(probe_cmd).decode().strip()
    duration = float(dur_str) + 0.5 # 0.5s breathing space
    
    scene_video = os.path.join(media_dir, f"{s['id']}.mp4")
    scene_video_files.append(scene_video)
    
    print(f"Rendering {s['id']} (Duration: {duration:.2f}s)...")
    
    # Subtle cinematic slow zoom (1.0 to 1.05) using zoompan filter
    # and combine with the audio track
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", frame_path,
        "-i", s["audio"],
        "-vf", f"scale=1920:1080,zoompan=z='min(zoom+0.00015,1.04)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080",
        "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(duration),
        scene_video
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Concatenating all scenes into single master video...")

# Write concat list
concat_list_file = os.path.join(media_dir, "concat_list.txt")
with open(concat_list_file, "w", encoding="utf-8") as f:
    for fpath in scene_video_files:
        escaped = fpath.replace("\\", "/")
        f.write(f"file '{escaped}'\n")

# Combine scenes
cmd_concat = [
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", concat_list_file,
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    output_video
]
subprocess.run(cmd_concat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print(f"SUCCESS! Master Video Rendered: {output_video}")
print(f"File Size: {os.path.getsize(output_video) / (1024*1024):.2f} MB")
