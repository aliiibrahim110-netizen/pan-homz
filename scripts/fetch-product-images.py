"""Cache only the seven exact supplied catalog images; preserve bytes and TLS verification."""
import concurrent.futures
import json
import pathlib
import sys
import urllib.request

root = pathlib.Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'scripts/product-images.json').read_text())
output = root / 'public/images'
output.mkdir(parents=True, exist_ok=True)

def fetch(pair):
    name, url = pair
    destination = output / name
    if destination.exists() and destination.stat().st_size > 0:
        return True, f'{name}: cached'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'PAN-HOMZ-Presentation/1.0'})
        with urllib.request.urlopen(req, timeout=45) as response:
            if not response.headers.get('Content-Type', '').startswith('image/'):
                raise ValueError('Source did not return an image')
            data = response.read()
        if not data:
            raise ValueError('Source returned an empty file')
        temporary = destination.with_suffix(destination.suffix + '.tmp')
        temporary.write_bytes(data)
        temporary.replace(destination)
        return True, f'{name}: downloaded {len(data)} bytes'
    except Exception as error:
        return False, f'{name}: {error}'

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(fetch, manifest.items()))
for success, message in results:
    print(message)
if not all(success for success, _ in results):
    print('Some catalog images could not be cached. Product-specific fallbacks remain available.', file=sys.stderr)
    sys.exit(1)
