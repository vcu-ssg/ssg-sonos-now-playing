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
        height: '100%',
        width: '100%',
        fontFamily: 'sans-serif',
        background: '#111',
        color: '#eee',
        overflow: 'hidden',
      }}
    >
      {/* Now Playing Panel */}
      <div
        style={{
          flex: 1,
          minWidth: 0, // ✅ prevents content from breaking 50% width
          minHeight: 0,
          flexBasis: isLandscape ? '50%' : '33.33%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isLandscape ? '6rem 4rem' : '2rem 2rem',
          gap: '1.25rem',
          overflow: 'hidden',
        }}
      >
        {/* Album Art Container */}
        <div
          style={{
            flex: isLandscape ? 1 : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: isLandscape ? '100%' : '60%',
          }}
        >
          <img
            src={track.album_art}
            alt="Album Art"
            style={{
              maxWidth: isLandscape ? '80%' : '60%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '1rem',
              boxShadow: '0 0 30px #000',
            }}
          />
        </div>

        <h1 style={{ fontSize: '2rem', margin: 0 }}>{track.title}</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>{track.artist}</h2>

        <div
          style={{
            marginTop: '0.5rem',
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
          minWidth: 0, // ✅ same enforcement here
          minHeight: 0,
          flexBasis: isLandscape ? '50%' : '66.66%',
          overflowY: 'auto',
          padding: '2rem 1rem',
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
            maxHeight: '100%',
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
                padding: '1rem 1.5rem',
                background: isCurrent ? '#333' : 'transparent',
                borderLeft: isCurrent ? '4px solid lime' : '4px solid transparent',
                marginBottom: '0.5rem',
                borderRadius: '0.25rem',
                fontWeight: isCurrent ? 'bold' : 'normal',
              }}
            >
              <div
                style={{
                  fontSize: isCurrent ? '2.2rem' : '1.76rem',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: isCurrent ? '2rem' : '1.6rem',
                  fontWeight: 500,
                  color: '#ccc',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {item.artist}
              </div>
              <div
                style={{
                  fontSize: isCurrent ? '1.9rem' : '1.52rem',
                  fontStyle: 'italic',
                  color: '#888',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
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
            display: flex;
            flex-direction: column;
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
