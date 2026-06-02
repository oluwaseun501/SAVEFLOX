import xml.etree.ElementTree as ET
import os
from PIL import Image

sitemap_path = os.path.join('public', 'sitemap.xml')
img_path = os.path.join('public', 'og-image.png')

print('Validating sitemap:', sitemap_path)
try:
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = root.findall('sm:url', ns)
    print('Sitemap parsed successfully - URL count:', len(urls))
except ET.ParseError as e:
    print('Sitemap parse error:', e)
except Exception as e:
    print('Error reading sitemap:', e)

print('\nChecking OG image:', img_path)
if os.path.exists(img_path):
    try:
        with Image.open(img_path) as im:
            print('Image exists - format:', im.format, 'size:', im.size)
    except Exception as e:
        print('Error opening image:', e)
else:
    print('Image not found at', img_path)

# Print meta tags from index.html for quick verification
print('\nInspecting index.html meta tags for og/twitter image...')
with open('index.html','r', encoding='utf-8') as f:
    txt=f.read()
for key in ['og:image', 'twitter:image']:
    start = txt.find(key)
    if start!=-1:
        line = txt[max(0, start-80):start+120]
        print('-', key + ':', line.replace('\n',' '))
    else:
        print('-', key + ': NOT FOUND')
