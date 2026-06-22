from PIL import Image

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
width, height = img.size
pixels = img.load()

# Let's find the bounding box of pixels that are dark (e.g. R+G+B < 500)
dark_pixels = []
for y in range(height):
    for x in range(width):
        c = pixels[x, y]
        if sum(c) < 500: # not white/light gray
            dark_pixels.append((x, y))

if dark_pixels:
    min_x = min(px for px, py in dark_pixels)
    max_x = max(px for px, py in dark_pixels)
    min_y = min(py for px, py in dark_pixels)
    max_y = max(py for px, py in dark_pixels)
    print(f"Mascot bounding box (non-white): x={min_x} to {max_x}, y={min_y} to {max_y}")
else:
    print("No dark pixels found!")
