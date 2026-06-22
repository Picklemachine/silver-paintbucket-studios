from PIL import Image

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
pixels = img.load()

print("Top-left pixel color:", pixels[0, 0])
print("Top-right pixel color:", pixels[img.size[0] - 1, 0])
print("Bottom-left pixel color:", pixels[0, img.size[1] - 1])
print("Bottom-right pixel color:", pixels[img.size[0] - 1, img.size[1] - 1])
print("Center pixel color:", pixels[img.size[0] // 2, img.size[1] // 2])
