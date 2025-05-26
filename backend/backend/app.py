from flask import Flask, jsonify
from flask_cors import CORS
from soco import SoCo
import os

SONOS_IP = os.environ.get("SONOS_IP", "192.168.1.155")

app = Flask(__name__)
CORS(app)

@app.route("/now-playing")
def now_playing():
    try:
        speaker = SoCo(SONOS_IP)
        coordinator = speaker.group.coordinator
        track = coordinator.get_current_track_info()
        return jsonify({
            "player": coordinator.player_name,
            "title": track.get('title', ''),
            "artist": track.get('artist', ''),
            "album": track.get('album', ''),
            "album_art": track.get('album_art', ''),
            "duration": track.get('duration', ''),
            "position": track.get('position', ''),
            "uri": track.get('uri', ''),
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
