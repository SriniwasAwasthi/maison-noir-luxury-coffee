import os
import io
import time
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from moviepy import ImageSequenceClip, AudioFileClip, concatenate_videoclips

base_dir = r"E:\W c One Drive\Projects\maison-noir-luxury-coffee-main"
media_dir = os.path.join(base_dir, "media")
output_video = os.path.join(base_dir, "Maison_Noir_Luxury_Overview.mp4")

# Chapter definitions with scroll targets and metadata
chapters = [
    {
        "id": "ch1",
        "audio": os.path.join(media_dir, "ch1.wav"),
        "scroll_start": 0,
        "scroll_end": 1400,
        "frames": 36,
        "title": "CHAPTER 1: BRAND GENESIS & AUDIENCE IDENTITY",
        "subtitle": "Maison Noir · Mayfair London · Haute Roastery · Est. 1998",
        "badge": "DIRECT-TRADE 92+ SCA"
    },
    {
        "id": "ch2",
        "audio": os.path.join(media_dir, "ch2.wav"),
        "scroll_start": 1400,
        "scroll_end": 3000,
        "frames": 32,
        "title": "CHAPTER 2: DESIGN SYSTEM & AESTHETIC PHILOSOPHY",
        "subtitle": "Obsidian Noir (#0D0A07) · Champagne Gold (#C9A25E) · Editorial Serif",
        "badge": "HAUTE COUTURE UI"
    },
    {
        "id": "ch3",
        "audio": os.path.join(media_dir, "ch3.wav"),
        "scroll_start": 3000,
        "scroll_end": 4800,
        "frames": 36,
        "title": "CHAPTER 3: TECHNICAL ARCHITECTURE & WEB AUDIO",
        "subtitle": "React 19 · Vite 7 · Tailwind v4 · Procedural Vinyl Jazz Synthesizer",
        "badge": "ZERO BUFFERING"
    },
    {
        "id": "ch4",
        "audio": os.path.join(media_dir, "ch4.wav"),
        "scroll_start": 4800,
        "scroll_end": 6600,
        "frames": 32,
        "title": "CHAPTER 4: LIVE FEATURE DEMO & SENSORY MENU",
        "subtitle": "23-Item Fine Dining Catalogue · 5-Axis Cupping Radar · Probat Telemetry",
        "badge": "LIVE PROFILING"
    },
    {
        "id": "ch5",
        "audio": os.path.join(media_dir, "ch5.wav"),
        "scroll_start": 6600,
        "scroll_end": 8500,
        "frames": 34,
        "title": "CHAPTER 5: COMPLETE USER WORKFLOW & JOURNEY",
        "subtitle": "Multi-Currency Engine · Tableside Delivery · 4 Salon Zones Reservation",
        "badge": "INR / USD / EUR / GBP / AED"
    },
    {
        "id": "ch6",
        "audio": os.path.join(media_dir, "ch6.wav"),
        "scroll_start": 8500,
        "scroll_end": 10370,
        "frames": 34,
        "title": "CHAPTER 6: EXECUTIVE SUMMARY & THANK YOU NOTE",
        "subtitle": "Maison Noir · 742 Evergreen Promenade, Mayfair · Open 07:00 — 23:00",
        "badge": "THANK YOU FOR WATCHING"
    }
]

# Fonts
try:
    font_title = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 42)
    font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 25)
    font_badge = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 19)
    font_status = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 17)
except Exception:
    font_title = font_sub = font_badge = font_status = ImageFont.load_default()

print("Launching Autonomous Chrome Bot to scroll and record website live...")

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

driver = webdriver.Chrome(options=options)
driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride", {
    "width": 1920,
    "height": 1080,
    "deviceScaleFactor": 1,
    "mobile": False
})

driver.get("http://localhost:5174/")
time.sleep(2.5) # allow hero animations to initialize

scene_clips = []

for idx, ch in enumerate(chapters):
    print(f"\n[Bot Recording] {ch['title']}...")
    
    # Measure audio duration
    audio_clip = AudioFileClip(ch["audio"])
    dur = audio_clip.duration
    num_frames = ch["frames"]
    
    start_y = ch["scroll_start"]
    end_y = ch["scroll_end"]
    
    frame_list_np = []
    
    for i in range(num_frames):
        # Smooth ease-in-out interpolation for bot scrolling
        progress = i / max(1, num_frames - 1)
        # Cosine ease in-out: 0.5 * (1 - cos(pi * progress))
        ease = 0.5 * (1 - np.cos(np.pi * progress))
        curr_y = int(start_y + (end_y - start_y) * ease)
        
        # Bot commands the browser to scroll
        driver.execute_script(f"window.scrollTo(0, {curr_y});")
        time.sleep(0.04) # brief yield for DOM rendering
        
        # Capture raw frame from the browser
        png_bytes = driver.get_screenshot_as_png()
        raw_img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
        
        # Ensure 1920x1080 exact dimensions
        if raw_img.size != (1920, 1080):
            raw_img = raw_img.resize((1920, 1080), Image.Resampling.LANCZOS)
            
        # Draw luxury HUD overlay onto the live bot-scrolled frame
        overlay = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # 1. Top Luxury Acrylic Header (85% opacity) with gold accent line
        draw.rectangle([(0, 0), (1920, 60)], fill=(13, 10, 7, 218))
        draw.rectangle([(0, 58), (1920, 60)], fill=(201, 162, 94, 255)) # Gold accent
        draw.text((40, 18), "☕ MAISON NOIR — HAUTE SPECIALTY ROASTERY & DIGITAL SANCTUARY", font=font_sub, fill=(243, 234, 217, 245))
        
        # Right Pill Badge
        draw.rectangle([(1920 - 370, 14), (1920 - 40, 46)], fill=(201, 162, 94, 240))
        draw.text((1920 - 355, 18), ch["badge"], font=font_badge, fill=(13, 10, 7, 255))
        
        # 2. Bottom Lower-Third HUD Card (92% opacity)
        card_h = 175
        draw.rectangle([(0, 1080 - card_h), (1920, 1080)], fill=(10, 8, 6, 235))
        draw.rectangle([(0, 1080 - card_h), (1920, 1080 - card_h + 3)], fill=(201, 162, 94, 255)) # Gold line
        
        # Text details
        draw.text((60, 1080 - card_h + 30), ch["title"], font=font_title, fill=(243, 234, 217, 255))
        draw.text((60, 1080 - card_h + 96), ch["subtitle"], font=font_sub, fill=(201, 162, 94, 255))
        
        # Status indicators on bottom right
        # Pulsing green dot and status
        draw.ellipse([(1920 - 450, 1080 - 52), (1920 - 438, 1080 - 40)], fill=(46, 204, 113, 255))
        draw.text((1920 - 430, 1080 - 53), "LIVE BOT SCROLL RECORDING", font=font_status, fill=(200, 220, 200, 240))
        draw.text((1920 - 430, 1080 - 30), "1080p FULL HD · 30 FPS · AI VOICE", font=font_status, fill=(180, 160, 130, 200))
        
        # Composite overlay
        composited = Image.alpha_composite(raw_img.convert("RGBA"), overlay).convert("RGB")
        frame_list_np.append(np.array(composited))
        
    print(f"Captured {len(frame_list_np)} live scrolling frames for Chapter {idx+1}. Building MoviePy clip...")
    
    # Compute playback FPS so sequence exactly spans the chapter voice duration
    clip_fps = len(frame_list_np) / dur
    ch_clip = ImageSequenceClip(frame_list_np, fps=clip_fps)
    ch_clip = ch_clip.with_audio(audio_clip)
    ch_clip = ch_clip.with_duration(dur)
    
    scene_clips.append(ch_clip)

driver.quit()
print("\nChrome Bot finished scrolling inspection successfully!")

print("\nConcatenating MoviePy scene clips with audio synchronization...")
final_video = concatenate_videoclips(scene_clips, method="compose")

print(f"Total Video Duration: {final_video.duration:.2f} seconds (~{final_video.duration/60:.1f} mins)")
print(f"Exporting broadcast master to: {output_video}...")

# Export with MoviePy & FFmpeg backend
final_video.write_videofile(
    output_video,
    codec="libx264",
    audio_codec="aac",
    fps=30,
    preset="medium",
    bitrate="5000k"
)

print("\n=======================================================")
print(f"SUCCESS! Broadcast Video Created: {output_video}")
print(f"File Size: {os.path.getsize(output_video) / (1024*1024):.2f} MB")
print("=======================================================")
