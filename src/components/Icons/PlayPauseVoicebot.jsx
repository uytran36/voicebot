import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import { Image } from 'antd';
import PauseIcon from '@/assets/pause.svg';
import PlayIcon from '@/assets/play.svg';

function noob() {}

PlayPause.propTypes = {
  paused: PT.oneOf(['paused', 'play']),
  className: PT.string,
  onClick: PT.func,
  disabled: PT.bool,
};

PlayPause.defaultProps = {
  paused: 'play',
  className: '',
  onClick: noob,
  disabled: false,
};

const isPaused = (_dataPlay) => _dataPlay === 'paused';

function PlayPause({ onClick, paused, disabled, ...props }) {
  const [dataPlay, toggleIcon] = useState(paused);

  const handleClick = useCallback(
    (e) => {
      if (disabled) {
        e.preventDefault();
        return null;
      }
      const _paused = isPaused(dataPlay);
      if (_paused) {
        toggleIcon('play');
      } else {
        toggleIcon('paused');
      }

      if (onClick) {
        onClick(e);
      }
      return null;
    },
    [dataPlay, disabled, onClick],
  );

  return (
    <span onClick={handleClick} {...props}>
      {dataPlay === 'paused' ? (
        <Image src={PauseIcon} preview={false} />
      ) : (
        <Image src={PlayIcon} preview={false} />
      )}
    </span>
  );
}

export default PlayPause;
