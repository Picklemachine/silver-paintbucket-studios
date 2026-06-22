from PIL import Image

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
pixels = img.load()
width, height = img.size

# Let's search for outlines (brightness < 160) for y from 350 to 550.
# For each y, let's find the leftmost and rightmost outline coordinate between x=150 and x=400.
for y in range(350, 550, 10):
    outlines = [x for x in range(150, 400) if pixels[x, y][0] < 160 and pixels[x, y][1] < 160 and pixels[x, y][2] < 160]
    if outlines:
        print(f"y={y}: Outlines found at x-coords: {outlines[:5]} ... {outlines[-5:] if len(outlines) > 5 else ''}")
    else:
        print(f"y={y}: NO outlines found in x=150-400!")
