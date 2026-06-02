#!/usr/bin/env python3
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from PIL import Image, ImageDraw, ImageFont
    print("PIL imported successfully")
    
    # Create a new image with Open Graph recommended size
    width, height = 1200, 630
    background_color = (29, 78, 216)  # Blue color from SaveFlox
    text_color = (255, 255, 255)  # White
    
    image = Image.new('RGB', (width, height), background_color)
    draw = ImageDraw.Draw(image)
    
    # Try to load fonts
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 72)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 40)
    except Exception as e:
        print(f"Font loading error: {e}")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Add SaveFlox branding
    draw.text((300, 200), "SaveFlox", fill=text_color, font=title_font)
    draw.text((200, 350), "Free Online Video Downloader", fill=text_color, font=subtitle_font)
    
    # Save the image
    output_path = os.path.join(os.path.dirname(__file__), 'public', 'og-image.png')
    image.save(output_path, 'PNG')
    print(f"✓ og-image.png created successfully at {output_path}")
    print(f"  Image dimensions: {width}x{height}px")
    
except ImportError as e:
    print(f"Error: PIL not available - {e}")
    print("Please install Pillow: pip install Pillow")
    sys.exit(1)
except Exception as e:
    print(f"Error during image generation: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
