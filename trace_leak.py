from PIL import Image
from collections import deque

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
width, height = img.size
pixels = img.load()

# Let's run a BFS and keep track of parents
parent = {}
visited = [[False for _ in range(height)] for _ in range(width)]
queue = deque()

# Add borders as seed
for x in range(width):
    for y in [0, height - 1]:
        c = pixels[x, y]
        if c[0] > 180 and c[1] > 180 and c[2] > 180:
            queue.append((x, y))
            visited[x][y] = True
            parent[(x, y)] = None

for y in range(1, height - 1):
    for x in [0, width - 1]:
        c = pixels[x, y]
        if c[0] > 180 and c[1] > 180 and c[2] > 180:
            queue.append((x, y))
            visited[x][y] = True
            parent[(x, y)] = None

# We want to trace the path to a point inside the hand (Component 1) at x=750, y=700
target = (750, 700)

found = False
while queue:
    x, y = queue.popleft()
    if (x, y) == target:
        found = True
        break
    
    for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
        if 0 <= nx < width and 0 <= ny < height:
            if not visited[nx][ny]:
                nc = pixels[nx, ny]
                if nc[0] > 185 and nc[1] > 185 and nc[2] > 185:
                    visited[nx][ny] = True
                    parent[(nx, ny)] = (x, y)
                    queue.append((nx, ny))

if found:
    print("Found path to target x=750, y=700!")
    path = []
    curr = target
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    path.reverse()
    
    print(f"Path length: {len(path)}")
    # Print the pixels along the path where the outline might be
    # Let's look for pixels with low values on this path (the "bottleneck" where it crosses the outline)
    print("Top bottleneck pixels on path (sorted by lowest RGB brightness):")
    bottlenecks = []
    for px, py in path:
        c = pixels[px, py]
        brightness = sum(c) / 3
        bottlenecks.append(((px, py), c, brightness))
    
    bottlenecks.sort(key=lambda x: x[2])
    for item in bottlenecks[:20]:
        print(f"Coord: {item[0]}, Color: {item[1]}, Brightness: {item[2]:.1f}")
else:
    print("Target not reached by BFS!")
