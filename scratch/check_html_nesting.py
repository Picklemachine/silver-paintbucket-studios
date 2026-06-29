import re

with open("/Users/razzledazzle/.gemini/antigravity/scratch/silver-paintbucket-studios/index.html", "r") as f:
    content = f.read()

# Let's simple-parse tags to track nesting
# We want to find which tags are open at the line containing admin-login-modal
lines = content.split('\n')
stack = []
for i, line in enumerate(lines):
    line_num = i + 1
    # Find all tags in this line
    # A simple regex for HTML tags
    tags = re.findall(r'</?[a-zA-Z0-9\-]+(?:/?>|[^>]*>)', line)
    for tag in tags:
        if tag.startswith('</'):
            tag_name = re.match(r'</([a-zA-Z0-9\-]+)', tag).group(1)
            # Pop stack
            if stack:
                popped = stack.pop()
                if popped['tag'] != tag_name:
                    # Mismatch, let's keep popping or report
                    pass
        elif tag.endswith('/>') or ' />' in tag:
            # Self closing, ignore
            continue
        elif tag.startswith('<img') or tag.startswith('<input') or tag.startswith('<br') or tag.startswith('<hr') or tag.startswith('<link') or tag.startswith('<meta'):
            # Self closing in HTML5, ignore
            continue
        else:
            match = re.match(r'<([a-zA-Z0-9\-]+)', tag)
            if match:
                tag_name = match.group(1)
                # Check if it has an id
                id_match = re.search(r'id=["\']([^"\']+)["\']', tag)
                class_match = re.search(r'class=["\']([^"\']+)["\']', tag)
                tag_id = id_match.group(1) if id_match else None
                tag_class = class_match.group(1) if class_match else None
                stack.append({'tag': tag_name, 'line': line_num, 'id': tag_id, 'class': tag_class})
    
    if 'admin-login-modal' in line:
        print(f"At line {line_num} (admin-login-modal):")
        for s in stack:
            print(f"  <{s['tag']} id='{s['id']}' class='{s['class']}'> opened at line {s['line']}")
        break
