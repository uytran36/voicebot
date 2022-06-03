import React, { useState, useEffect, useCallback } from 'react';
import PT from 'prop-types';
import { PlayPause } from '@/components/Icons';

// play single
export const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);
  const start = () => {
    audio.load();
  };

  useEffect(() => {
    if (playing) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [audio, playing]);

  useEffect(() => {
    audio.autoplayplay = true;
    audio.loop = true;
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle, start];
};

// play multi
export const useMultiAudio = (_urls) => {
  const [urls, setUrls] = useState(_urls);
  const [sources, setSources] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setSources(
      [...urls].map(({ url, ...rest }) => {
        return {
          ...rest,
          audio: new Audio(url),
        };
      }),
    );
    setPlayers(
      [...urls].map((url) => {
        return {
          ...url,
          playing: false,
        };
      }),
    );
  }, [urls]);

  const toggle = useCallback(
    (targetIndex) => () => {
      const newPlayers = [...players];
      const currentIndex = players.findIndex((p) => p.playing === true);
      if (targetIndex === -1 && currentIndex !== -1) {
        newPlayers[currentIndex] = { ...newPlayers[currentIndex], playing: false };
      } else if (currentIndex !== -1 && currentIndex !== targetIndex) {
        newPlayers[currentIndex].playing = false;
        newPlayers[targetIndex].playing = true;
      } else if (currentIndex !== -1) {
        newPlayers[targetIndex].playing = false;
      } else if (currentIndex === -1 && targetIndex !== -1) {
        newPlayers[targetIndex].playing = true;
      }

      setPlayers(
        newPlayers.map((elm) => {
          return elm;
        }),
      );
    },
    [players],
  );

  useEffect(() => {
    sources.forEach((source, i) => {
      if (players[i].playing) {
        source.audio.play();
      } else {
        source.audio.pause();
      }
    });
  }, [sources, players]);

  useEffect(() => {
    sources.forEach((source, i) => {
      source.audio.addEventListener('ended', () => {
        const newPlayers = [...players];
        newPlayers[i].playing = false;
        setPlayers(newPlayers);
      });
    });
    return () => {
      sources.forEach((source, i) => {
        source.audio.removeEventListener('ended', () => {
          const newPlayers = [...players];
          newPlayers[i].playing = false;
          setPlayers(newPlayers);
        });
      });
    };
  }, []);

  return [players, toggle, setUrls];
};

export const Player = React.memo(({ url, playing, toggle }) => {
  return (
    <PlayPause
      paused={playing ? 'paused' : 'play'}
      onClick={toggle}
      style={{ cursor: 'pointer' }}
    />
  );
});

Player.propTypes = {
  url: PT.string.isRequired,
  playing: PT.bool.isRequired,
  toggle: PT.func.isRequired,
};

// export const MultiPlayer =

// export default Player;
