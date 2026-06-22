from PIL import Image
from collections import deque

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
img = Image.open(img_path)
width, height = img.size
pixels = img.load()

# Run BFS from border to target (750, 700)
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
    path = []
    curr = target
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    path.reverse()
    
    print(f"Path from border to glove (750, 700):")
    # Print the coordinates of the path every 10 steps
    for i in range(0, len(path), 10):
        print(f"Step {i}: {path[i]} - color: {pixels[path[i][0], path[i][1]]}")
    print(f"Last step: {path[-1]} - color: {pixels[path[-1][0], path[-1][1]]}")
else:
    print("No path found!")
