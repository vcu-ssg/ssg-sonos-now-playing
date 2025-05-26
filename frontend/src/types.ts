// src/types.ts
export interface NowPlayingTrack {
  player: string;
  title: string;
  artist: string;
  album: string;
  album_art: string;
  duration: string;
  position: string;
  uri: string;
  error?: string;
}

export interface PlaylistTrack {
  title: string;
  artist: string;
  album: string;
  album_art: string;
  uri: string;
}

export interface PlaylistResponse {
  current_uri: string;
  items: PlaylistTrack[];
}
