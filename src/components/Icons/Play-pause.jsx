import React, { useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import PT from 'prop-types';

const points = {
  left: {
    from: '15,0 50,25 50,75 15,100',
    to: '15,10 40,10 40,90, 15,90',
  },
  right: {
    from: '50,25 85,50 85,50, 50,75',
    to: '60,10 85,10 85,90, 60,90',
  },
};

function noob() {}

PlayPause.propTypes = {
  paused: PT.oneOf(['paused', 'play']),
  className: PT.string,
  onClick: PT.func,
  disabled: PT.bool,
};

PlayPause.defaultProps = {
  paused: 'paused',
  className: '',
  onClick: noob,
  disabled: false
};

const isPaused = (_dataPlay) => _dataPlay === 'paused';

function PlayPause({ onClick, paused, className, disabled, ...props }) {
  const leftRef = useRef(null);
  const rigthRef = useRef(null);

  const [dataPlay, toggleIcon] = useState(paused);
  const [pointState, setPointState] = useState({
    left: {
      from: '',
      to: '',
    },
    right: {
      from: '',
      to: '',
    },
  });

  const handleClick = useCallback(
    (e) => {
      if(disabled) {
        e.preventDefault();
        return null;
      }
      const _paused = isPaused(dataPlay);
      if (_paused) {
        toggleIcon('play');
        setPointState({
          left: {
            from: points.left.to,
            to: points.left.from,
          },
          right: {
            from: points.right.to,
            to: points.right.from,
          },
        });
      } else {
        toggleIcon('paused');
        setPointState({
          left: {
            from: points.left.from,
            to: points.left.to,
          },
          right: {
            from: points.right.from,
            to: points.right.to,
          },
        });
      }

      if (onClick) {
        onClick(e);
      }
      return null;
    },
    [dataPlay, disabled, onClick],
  );

  React.useEffect(() => {
    const _paused = isPaused(paused);
    if (_paused) {
      setPointState(points);
    } else {
      setPointState({
        left: {
          from: points.left.to,
          to: points.left.from,
        },
        right: {
          from: points.right.to,
          to: points.right.from,
        },
      });
    }
  }, [paused]);

  React.useEffect(() => {
    if (pointState) {
      leftRef.current.beginElement();
      rigthRef.current.beginElement();
    }
  }, [pointState]);

  return (
    <span onClick={handleClick} className={classNames('anticon', className)} {...props}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="15,0 50,25 50,75 15,100">
          <animate
            ref={leftRef}
            attributeType="XML"
            attributeName="points"
            begin="indefinite"
            fill="freeze"
            from={pointState.left.from}
            to={pointState.left.to}
            dur="100ms"
          />
        </polygon>
        <polygon points="50,25 85,50 85,50, 50,75">
          <animate
            ref={rigthRef}
            attributeType="XML"
            attributeName="points"
            begin="indefinite"
            fill="freeze"
            from={pointState.right.from}
            to={pointState.right.to}
            dur="100ms"
          />
        </polygon>
      </svg>
    </span>
  );
}

export default PlayPause;
