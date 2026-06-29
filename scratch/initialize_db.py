import urllib.request
import json

url = "https://kvdb.io/spb_studios_cfg_2026_dbx1/settings"

# Default configuration to prevent 404 and initialize database settings
default_payload = {
    "rootStyles": {
        "--card-margin": "16px",
        "--card-radius": "4px",
        "--card-bg": "#001f54",
        "--card-border-width": "4px",
        "--card-glow-size": "25px",
        "--card-glow-color": "rgba(181, 194, 201, 0.65)"
    },
    "cardStyles": [],
    "inputValues": {
        "custom-margin": "16",
        "custom-radius": "4",
        "custom-frame": "frame-wood",
        "custom-bg-color": "#001f54",
        "custom-card-bg": "#eddcd2",
        "custom-frame-border": "4",
        "custom-frame-margin": "12",
        "custom-filter-target": "all",
        "custom-brightness": "100",
        "custom-contrast": "100",
        "custom-saturation": "100",
        "custom-hue": "0",
        "custom-glow-color": "silver",
        "custom-glow-size": "25"
    },
    "paintingDatabase": {},
    "artistDatabase": {},
    "paintingOrder": [],
    "timestamp": 1782161613000
}

req = urllib.request.Request(
    url,
    data=json.dumps(default_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Response:", response.read().decode('utf-8'))
except Exception as e:
    print("Error initializing database:", e)
