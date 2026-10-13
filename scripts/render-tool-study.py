"""Export the isolated tool-story candidate using the regular pixel GIF encoder."""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('mascot_gif_exporter', ROOT/'scripts/export-mascot-gifs.py')
exporter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(exporter)
exporter.DESTINATION = ROOT/'public/mascot/lab'
state = json.loads((exporter.DESTINATION/'tool-study-frames.json').read_text(encoding='utf-8'))
result = exporter.export_state(state)
(exporter.DESTINATION/'tool-study-gif.json').write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
print(f"Exported candidate GIF: {result['frameCount']} frames, {result['durationMs']}ms")
