import React, { useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import PT from 'prop-types';

const paths = {
  left: {
    from:
      'M167.367809,144.720165 L9.94117647,14.6229895 C8.09802078,13.0865972 7.50706044,14.6370598 6.07584212,16.615661 L0.889656185,23.7788776 C-0.541562134,25.754644 -0.211484109,28.6034896 1.63167159,30.1427165 L156.995437,159.043764 C158.838593,160.582991 161.49242,160.225822 162.926279,158.247221 L168.112465,151.084004 C169.541043,149.108238 169.210965,146.259392 167.367809,144.720165 Z',
    to: 'M0',
  },
  right: {
    from:
      'M177.367809,130.720165 L19.9411765,0.622989503 C18.0980208,-0.913402806 17.5070604,0.637059846 16.0758421,2.61566101 L10.8896562,9.77887755 C9.45843787,11.754644 9.78851589,14.6034896 11.6316716,16.1427165 L166.995437,145.043764 C168.838593,146.582991 171.49242,146.225822 172.926279,144.247221 L178.112465,137.084004 C179.541043,135.108238 179.210965,132.259392 177.367809,130.720165 Z',
    to: 'M0',
  },
};

function noob() {}

MicrophoneFilled.propTypes = {
  slash: PT.oneOf(['unslash', 'slash']),
  className: PT.string,
  onClick: PT.func,
  disabled: PT.bool,
};

MicrophoneFilled.defaultProps = {
  slash: 'slash',
  className: '',
  onClick: noob,
  disabled: false,
};

const isSlash = (_dataPlay) => _dataPlay === 'slash';

function MicrophoneFilled({ onClick, slash, className, disabled, ...props }) {
  const leftRef = useRef(null);
  const rigthRef = useRef(null);

  const [dataPlay, toggleIcon] = useState(slash);
  const [pathsState, setPathsState] = useState({
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
      if (disabled) {
        e.preventDefault();
        return null;
      }
      const _slash = isSlash(dataPlay);
      console.log('aaaa', _slash)
      if (_slash) {
        toggleIcon('unslash');
        setPathsState({
          left: {
            from: paths.left.to,
            to: paths.left.from,
          },
          right: {
            from: paths.right.to,
            to: paths.right.from,
          },
        });
      } else {
        toggleIcon('slash');
        setPathsState({
          left: {
            from: paths.left.from,
            to: paths.left.to,
          },
          right: {
            from: paths.right.from,
            to: paths.right.to,
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
    const _slash = isSlash(slash);
    if (_slash) {
      setPathsState(paths);
    } else {
      setPathsState({
        left: {
          from: paths.left.to,
          to: paths.left.from,
        },
        right: {
          from: paths.right.to,
          to: paths.right.from,
        },
      });
    }
  }, [slash]);

  React.useEffect(() => {
    if (pathsState) {
      leftRef.current.beginElement();
      rigthRef.current.beginElement();
    }
  }, [pathsState]);

  return (
    <span onClick={handleClick} className={classNames('anticon', className)} {...props}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 179 188"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <g stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
          <path
            d="M91.5,129.25 C113.641875,129.25 131.590909,113.468281 131.590909,94 L131.590909,35.25 C131.590909,15.7817187 113.641875,0 91.5,0 C69.358125,0 51.4090909,15.7817187 51.4090909,35.25 L51.4090909,94 C51.4090909,113.468281 69.358125,129.25 91.5,129.25 Z M158.318182,70.5 L151.636364,70.5 C147.944659,70.5 144.954545,73.1290625 144.954545,76.375 L144.954545,94 C144.954545,121.465625 118.022642,143.504219 86.1587216,140.772344 C58.3874148,138.389297 38.0454545,116.438828 38.0454545,91.9070313 L38.0454545,76.375 C38.0454545,73.1290625 35.0553409,70.5 31.3636364,70.5 L24.6818182,70.5 C20.9901136,70.5 18,73.1290625 18,76.375 L18,91.12125 C18,124.035938 44.7147443,153.377891 81.4772727,157.835547 L81.4772727,170.375 L58.0909091,170.375 C54.3992045,170.375 51.4090909,173.004063 51.4090909,176.25 L51.4090909,182.125 C51.4090909,185.370937 54.3992045,188 58.0909091,188 L124.909091,188 C128.600795,188 131.590909,185.370937 131.590909,182.125 L131.590909,176.25 C131.590909,173.004063 128.600795,170.375 124.909091,170.375 L101.522727,170.375 L101.522727,157.975078 C137.316392,153.656953 165,126.642969 165,94 L165,76.375 C165,73.1290625 162.009886,70.5 158.318182,70.5 Z"
            id="Shape"
          ></path>
          <g transform="translate(0.000000, 11.000000)">
            <path>
              <animate
                ref={leftRef}
                attributeType="XML"
                attributeName="d"
                begin="indefinite"
                fill="freeze"
                from={pathsState.left.from}
                to={pathsState.left.to}
                dur="100ms"
              />
            </path>
            <path id='microphone-filled-slash'>
              <animate
                ref={rigthRef}
                attributeType="XML"
                attributeName="d"
                begin="indefinite"
                fill="freeze"
                from={pathsState.right.from}
                to={pathsState.right.to}
                dur="100ms"
              />
            </path>
          </g>
        </g>
      </svg>
    </span>
  );
}

export default MicrophoneFilled;
