from PIL import Image
from collections import deque

img_path = "/Users/razzledazzle/.gemini/antigravity/brain/4f1b9b40-7d2d-4be3-a24f-ffe527964464/media__1782072578745.jpg"
output_path = "assets/bucky_hero_purple.png"

img = Image.open(img_path).convert("RGBA")
width, height = img.size
pixels = img.load()

visited = [[False for _ in range(height)] for _ in range(width)]
background_mask = set()

# Safety regions where we do not allow BFS to enter to protect white details (gloves, shoe soles)
def is_safe_region(x, y):
    # Left glove/arm protection box
    if 220 <= x <= 330 and 400 <= y <= 520:
        return True
    # Shoes / soles protection box
    if 300 <= x <= 800 and 800 <= y <= 998:
        return True
    return False

# 1. Add borders as seeds
queue = deque()
for x in range(width):
    for y in [0, height - 1]:
        if not is_safe_region(x, y):
            c = pixels[x, y]
            if c[0] > 180 and c[1] > 180 and c[2] > 180:
                queue.append((x, y))
                visited[x][y] = True

for y in range(1, height - 1):
    for x in [0, width - 1]:
        if not is_safe_region(x, y):
            c = pixels[x, y]
            if c[0] > 180 and c[1] > 180 and c[2] > 180:
                queue.append((x, y))
                visited[x][y] = True

# Run BFS for outer background
THRESHOLD = 175
while queue:
    x, y = queue.popleft()
    background_mask.add((x, y))
    
    for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
        if 0 <= nx < width and 0 <= ny < height:
            if not visited[nx][ny]:
                if not is_safe_region(nx, ny):
                    nc = pixels[nx, ny]
                    if nc[0] > THRESHOLD and nc[1] > THRESHOLD and nc[2] > THRESHOLD:
                        visited[nx][ny] = True
                        queue.append((nx, ny))

# 2. Search for handle seed (must be unvisited and light-colored)
handle_seed = None
for y in range(150, 250):
    for x in range(340, 390):
        if not visited[x][y]:
            c = pixels[x, y]
            if c[0] > 200 and c[1] > 200 and c[2] > 200:
                handle_seed = (x, y)
                break
    if handle_seed:
        break

if handle_seed:
    print(f"Found handle seed at {handle_seed}")
    queue.append(handle_seed)
    visited[handle_seed[0]][handle_seed[1]] = True
    
    # Run BFS for handle interior
    while queue:
        x, y = queue.popleft()
        background_mask.add((x, y))
        
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < width and 0 <= ny < height:
                if not visited[nx][ny]:
                    if not is_safe_region(nx, ny):
                        nc = pixels[nx, ny]
                        if nc[0] > THRESHOLD and nc[1] > THRESHOLD and nc[2] > THRESHOLD:
                            visited[nx][ny] = True
                            queue.append((nx, ny))

# Turn background pixels transparent
for x, y in background_mask:
    pixels[x, y] = (255, 255, 255, 0)

img.save(output_path, "PNG")
print("Advanced background removal completed successfully!")
