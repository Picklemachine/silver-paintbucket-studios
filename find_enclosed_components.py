from PIL import Image

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
width, height = img.size
pixels = img.load()

# Let's define outline pixels as those with brightness < 160
is_outline = [[False for _ in range(height)] for _ in range(width)]
for y in range(height):
    for x in range(width):
        c = pixels[x, y]
        # Outline is dark
        if c[0] < 160 and c[1] < 160 and c[2] < 160:
            is_outline[x][y] = True

# Now let's do a BFS from the borders to find all background pixels (not crossing outlines)
visited = [[False for _ in range(height)] for _ in range(width)]
queue = []

for x in range(width):
    for y in [0, height-1]:
        if not is_outline[x][y]:
            queue.append((x, y))
            visited[x][y] = True

for y in range(1, height-1):
    for x in [0, width-1]:
        if not is_outline[x][y]:
            if not visited[x][y]:
                queue.append((x, y))
                visited[x][y] = True

# BFS
while queue:
    cx, cy = queue.pop(0)
    for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
        if 0 <= nx < width and 0 <= ny < height:
            if not visited[nx][ny] and not is_outline[nx][ny]:
                visited[nx][ny] = True
                queue.append((nx, ny))

# Now, any pixel that is NOT visited and NOT outline is inside Bucky (enclosed by outlines)!
# Let's group these inside pixels into connected components
inside_components = []
visited_inside = [[False for _ in range(height)] for _ in range(width)]

for x in range(width):
    for y in range(height):
        if not visited[x][y] and not is_outline[x][y] and not visited_inside[x][y]:
            # BFS to find component
            comp = []
            q = [(x, y)]
            visited_inside[x][y] = True
            while q:
                cx, cy = q.pop(0)
                comp.append((cx, cy))
                for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                    if 0 <= nx < width and 0 <= ny < height:
                        if not visited[nx][ny] and not is_outline[nx][ny] and not visited_inside[nx][ny]:
                            visited_inside[nx][ny] = True
                            q.append((nx, ny))
            
            min_x = min(px for px, py in comp)
            max_x = max(px for px, py in comp)
            min_y = min(py for px, py in comp)
            max_y = max(py for px, py in comp)
            inside_components.append({
                "size": len(comp),
                "bbox": (min_x, min_y, max_x, max_y),
                "pixels": comp
            })

# Sort by size and print
inside_components.sort(key=lambda x: x["size"], reverse=True)
print(f"Total enclosed inside components: {len(inside_components)}")
for i, comp in enumerate(inside_components[:15]):
    # Let's also check the average color of this component
    r_sum, g_sum, b_sum = 0, 0, 0
    for px, py in comp["pixels"]:
        c = pixels[px, py]
        r_sum += c[0]
        g_sum += c[1]
        b_sum += c[2]
    avg_c = (int(r_sum / len(comp["pixels"])), int(g_sum / len(comp["pixels"])), int(b_sum / len(comp["pixels"])))
    print(f"Component {i}: size={comp['size']}, bbox={comp['bbox']}, avg_color={avg_c}")
