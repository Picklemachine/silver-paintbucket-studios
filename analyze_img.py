from PIL import Image

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
width, height = img.size
print(f"Image Size: {width}x{height}")

# Let us find components of pixels with RGB > 240
pixels = img.load()
visited = [[False for _ in range(height)] for _ in range(width)]

components = []

for x in range(width):
    for y in range(height):
        if visited[x][y]:
            continue
        c = pixels[x, y]
        if c[0] > 240 and c[1] > 240 and c[2] > 240:
            # BFS to find component
            comp = []
            q = [(x, y)]
            visited[x][y] = True
            while q:
                cx, cy = q.pop(0)
                comp.append((cx, cy))
                for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                    if 0 <= nx < width and 0 <= ny < height:
                        if not visited[nx][ny]:
                            nc = pixels[nx, ny]
                            if nc[0] > 240 and nc[1] > 240 and nc[2] > 240:
                                visited[nx][ny] = True
                                q.append((nx, ny))
            
            # Print info about component
            touches_border = any(px == 0 or px == width-1 or py == 0 or py == height-1 for px, py in comp)
            min_x = min(px for px, py in comp)
            max_x = max(px for px, py in comp)
            min_y = min(py for px, py in comp)
            max_y = max(py for px, py in comp)
            
            components.append({
                "size": len(comp),
                "touches_border": touches_border,
                "bbox": (min_x, min_y, max_x, max_y),
                "pixels": comp
            })

# Sort components by size
components.sort(key=lambda x: x["size"], reverse=True)
for i, comp in enumerate(components[:10]):
    print(f"Component {i}: size={comp['size']}, touches_border={comp['touches_border']}, bbox={comp['bbox']}")
