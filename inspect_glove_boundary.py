from PIL import Image

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
pixels = img.load()
width, height = img.size

# Let's save a visualization of the glove region (x: 600-900, y: 550-800)
# Showing where dark outline pixels (R,G,B < 160) are, and where white pixels (> 240) are.
debug_glove = Image.new("RGB", (300, 250), (255, 255, 255))
dg_px = debug_glove.load()

for y in range(550, 800):
    for x in range(600, 900):
        c = pixels[x, y]
        dx = x - 600
        dy = y - 550
        
        # Check if outline
        if c[0] < 160 and c[1] < 160 and c[2] < 160:
            dg_px[dx, dy] = (0, 0, 0) # Black for outline
        elif c[0] > 240 and c[1] > 240 and c[2] > 240:
            dg_px[dx, dy] = (255, 0, 0) # Red for very white
        else:
            dg_px[dx, dy] = (150, 150, 255) # Blue for others

debug_glove.save("debug_glove.png")
print("Saved debug_glove.png")

# Let's analyze the dark outline coordinates to see if they form a boundary on the right of the red pixels.
# For each y in range(550, 800): find the rightmost red pixel, and see if there is a black pixel to the right of it.
for y in range(550, 800, 10):
    red_xs = [x for x in range(600, 900) if pixels[x, y][0] > 240 and pixels[x, y][1] > 240 and pixels[x, y][2] > 240]
    if red_xs:
        rightmost_red = max(red_xs)
        # Search for outline to the right of it
        outline_xs = [x for x in range(rightmost_red, 900) if pixels[x, y][0] < 160 and pixels[x, y][1] < 160 and pixels[x, y][2] < 160]
        if outline_xs:
            print(f"y={y}: Rightmost red at x={rightmost_red}. Outline found to the right at x={min(outline_xs)}")
        else:
            print(f"y={y}: Rightmost red at x={rightmost_red}. NO outline found to the right!")
    else:
        print(f"y={y}: No red pixels in this row.")
