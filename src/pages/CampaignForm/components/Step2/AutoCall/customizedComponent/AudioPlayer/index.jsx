import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from './styles.less';

function AudioPlayer(props) {
  const { src, dispatch, playing } = props;
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState(0);
  const [clickedTime, setClickedTime] = useState();
  useEffect(() => {
    const audio = document.getElementById('audio');
    let playPromise;

    playing ? (playPromise = audio?.play()) : audio?.pause();

    if (playPromise !== undefined) {
      playPromise.then((_) => {}).catch((error) => {});
    }

    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime;
      setClickedTime(null);
    }

    if (curTime === duration) {
      dispatch({
        type: 'audio/updateState',
        payload: {
          playing: false,
        },
      });
      setCurTime(0);
    }
  }, [playing, curTime, duration, clickedTime]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'audio/updateState',
        payload: {
          playing: false,
        },
      });
      setCurTime(0);
    };
  }, []);

  function formatDuration(x) {
    if (x) {
      return moment.utc(x * 1000).format('mm:ss');
    }
  }

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.getElementsByClassName(styles['bar__progress'])[0];
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    setClickedTime(calcClickedTime(e));
    const updateTimeOnMove = (eMove) => {
      setClickedTime(calcClickedTime(eMove));
    };

    document.addEventListener('mousemove', updateTimeOnMove);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', updateTimeOnMove);
    });
  }
  return (
    <div className={styles.audio_wrapper}>
      <audio
        onLoadedData={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => setCurTime(e.target.currentTime)}
        src={src}
        id="audio"
      />
      {playing ? (
        <FaPause
          style={{ cursor: 'pointer', color: '#1EAF61' }}
          onClick={() =>
            dispatch({
              type: 'audio/updateState',
              payload: {
                playing: false,
              },
            })
          }
        />
      ) : (
        <FaPlay
          style={{ cursor: 'pointer', color: '#1EAF61' }}
          onClick={() =>
            dispatch({
              type: 'audio/updateState',
              payload: {
                playing: true,
              },
            })
          }
        />
      )}
      <div className={styles.bar}>
        <span className={styles['bar__time']}>{formatDuration(curTime)}</span>
        <div
          className={styles['bar__progress']}
          style={{
            background: `linear-gradient(to right, #1EAF61 ${
              (curTime / duration) * 100
            }%, #D9D9D9 0)`,
          }}
          onMouseDown={(e) => handleTimeDrag(e)}
        >
          <span
            className={styles['bar__progress__knob']}
            style={{ left: `${(curTime / duration) * 100 - 1}%` }}
          />
        </div>
        <span className={styles['bar__time']}>{formatDuration(duration)}</span>
      </div>
    </div>
  );
}

export default connect(({ audio }) => ({
  playing: audio.playing,
}))(AudioPlayer);
