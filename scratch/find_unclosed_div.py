with open("/Users/razzledazzle/.gemini/antigravity/scratch/silver-paintbucket-studios/index.html", "r") as f:
    lines = f.readlines()

start_line = 365
end_line = 615

stack = []
import re

for idx in range(start_line - 1, end_line):
    line_num = idx + 1
    line = lines[idx]
    tags = re.findall(r'</?div(?:/?>|[^>]*>)', line)
    for tag in tags:
        if tag.startswith('</div'):
            if stack:
                popped = stack.pop()
                print(f"L{line_num}: Closed div opened at L{popped}")
            else:
                print(f"L{line_num}: Extra closed div")
        else:
            stack.append(line_num)
            print(f"L{line_num}: Opened div")

print("Remaining open divs:")
for open_div in stack:
    print(f"  L{open_div}")
