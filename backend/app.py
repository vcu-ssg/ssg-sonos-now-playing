from flask import Flask, jsonify
from flask_cors import CORS
import soco

app = Flask(__name__)
CORS(app)

@app.route("/now-playing")
def now_playing():
    devices = soco.discover()
    if not devices:
        return jsonify({"error": "No Sonos devices found"}), 404

    device = list(devices)[0]
    track = device.get_current_track_info()
    return jsonify({
        "player": device.player_name,
        "title": track['title'],
        "artist": track['artist'],
        "album": track['album'],
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
