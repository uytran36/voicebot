import Timer from 'react-compound-timer';
import PT from 'prop-types';

TimerComponent.propTypes = {
  duration: PT.number.isRequired,
  props: PT.instanceOf(Object),
};

export default function TimerComponent({ duration, props }) {
  return (
    <Timer
      startImmediately={false}
      initialTime={duration * 1000}
      formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
      {...props}
    >
      {() => {
        return (
          <>
            <span>
              <Timer.Hours
                formatValue={(value) => `${value < 10 ? `0${value} : ` : `${value} : `} `}
              />
            </span>
            <span>
              <Timer.Minutes
                formatValue={(value) => `${value < 10 ? `0${value} : ` : `${value} : `} `}
              />
            </span>
            <span>
              <Timer.Seconds />
            </span>
          </>
        );
      }}
    </Timer>
  );
}
