import { useEffect, useRef, useState } from 'react';
import type { NowPlayingTrack, PlaylistTrack, PlaylistResponse } from './types';

function App() {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState<boolean>(
    window.innerWidth > window.innerHeight
  );

  const playlistRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchNowPlaying = () => {
      fetch('/now-playing')
        .then(res => res.json())
        .then((data: NowPlayingTrack) => setTrack(data))
        .catch(() => setTrack(null));
    };

    const fetchPlaylist = () => {
      fetch('/playlist')
        .then(res => res.json())
        .then((data: PlaylistResponse) => {
          setPlaylist(data.items);
          setCurrentUri(data.current_uri);
        })
        .catch(() => {
          setPlaylist([]);
          setCurrentUri(null);
        });
    };

    fetchNowPlaying();
    fetchPlaylist();

    const interval = setInterval(() => {
      fetchNowPlaying();
      fetchPlaylist();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = playlistRef.current;
    if (container) {
      const currentEl = container.querySelector('.current');
      if (currentEl && currentEl.scrollIntoView) {
        currentEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [playlist, currentUri]);

  if (!track || track.error) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>No music playing…</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isLandscape ? 'row' : 'column',
        height: '100vh',
        width: '100vw',
        fontFamily: 'sans-serif',
        background: '#111',
        color: '#eee',
      }}
    >
      {/* Now Playing Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <img
          src={track.album_art}
          alt="Album Art"
          style={{
            width: '300px',
            maxWidth: '80%',
            borderRadius: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 0 30px #000',
          }}
        />
        <h1>{track.title}</h1>
        <h2>{track.artist}</h2>
        <p>
          <em>{track.album}</em>
        </p>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'lime',
              animation: 'pulse 1s infinite',
            }}
          />
          <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Now Playing</span>
        </div>
      </div>

      {/* Playlist Panel */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 1rem',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h3 style={{ textAlign: 'center' }}>Playlist</h3>
        <ul
          ref={playlistRef}
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '1rem 0',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          {playlist.map((item, index) => {
            const isCurrent = item.uri === currentUri;
            return (
              <li
                key={index}
                className={isCurrent ? 'current' : ''}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.5rem 1rem',
                  background: isCurrent ? '#333' : 'transparent',
                  borderLeft: isCurrent ? '4px solid lime' : '4px solid transparent',
                  marginBottom: '0.25rem',
                  borderRadius: '0.25rem',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                }}
              >
                <div>{item.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{item.artist}</div>
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#777' }}>
                  {item.album}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Global Styles */}
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-color: #111;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default App;
